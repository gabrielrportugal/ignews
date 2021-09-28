import moment from "moment";
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import Head from 'next/head';

import styles from './post.module.scss';

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
};

interface PostPros {
  post: Post;
}

export default function Post({post}: PostPros) {
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
            className={styles.postContent}
            dangerouslySetInnerHTML={{__html: post.content}} 
          />

        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({req, params}) => {
  const session = await getSession({req});
  const {slug} = params;

  if (!session?.activeSubscription) {
    // Redirect not subscribed users
    return {
      redirect: {
        destination: '/',
        permanent: false,
      }
    }
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('publication', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: moment(response.last_publication_date).format('DD [de] MMMM [de] YYYY'),
  }

  return {
    props: {
      post
    }
  }
}