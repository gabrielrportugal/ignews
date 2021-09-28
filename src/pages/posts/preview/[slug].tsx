import moment from "moment";
import { GetStaticPaths, GetStaticProps } from "next"
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../../services/prismic";
import Head from 'next/head';
import Link from 'next/link';

import styles from '../post.module.scss';
import { useSession } from "next-auth/client";
import { useEffect } from "react";
import { useRouter } from "next/router";

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostPreviewPros {
  post: Post;
}

export default function PostPreview({post}: PostPreviewPros) {
  const [session] = useSession();
  const router = useRouter();

  useEffect(()=>{
    if (session.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  },[session])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>

          <h1>{post.title}</h1>

          <time>{post.updatedAt}</time>

          <div
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{__html: post.content}}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a href="">Subscribe now 🤗</a>
            </Link>
          </div>

        </article>
      </main>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Pages that will be created (static) at the build process
  return {
    paths: [],
    fallback: 'blocking',
    // If it's not SSG yet
    // true -> will render at client browser
    // false -> will return a 404
    // blocking -> will render as SSR at first access
  }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
  const {slug} = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: moment(response.last_publication_date).format('DD [de] MMMM [de] YYYY'),
  }

  return {
    props: {
      post
    },
    redirect: 60 * 30, // 30 minutes
  }
}
