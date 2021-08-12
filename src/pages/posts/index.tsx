import { GetStaticProps } from 'next';
import Head from 'next/head';
import Prismic from '@prismicio/client';
import { RichText } from 'prismic-dom';
import moment from 'moment';

import { getPrismicClient } from '../../services/prismic';
import styles from './styles.module.scss';

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostProps {
  posts: Post[],
}

export default function Posts({ posts }:PostProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>

          {posts.map(post => (
            <a key={post.slug} href="#">
              <time>{post.updatedAt}</time>
              <strong>{post.title}</strong>
              <p>{post.excerpt}</p>
            </a>
          ))}

        </div>
      </main>
    </>
  );
}

export const  getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  // Maracutaia feita com moment pois minha versão do Node causa bug ao usar o toLocaleDateString para formatar data
  // Versão do Node 12.18
  moment.locale('pt'); 

  moment.updateLocale('pt', {
    months : [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
        "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
  });

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'publication')],
    {
      fetch: ['publication.title', 'publication.content'],
      pageSize: 100,
    }
  );

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find((content) => content.type === 'paragraph')?.text ?? '',
      updatedAt: moment(post.last_publication_date).format('DD [de] MMMM [de] YYYY'),
    };
  })

  return {
    props: {
      posts
    }
  }
}