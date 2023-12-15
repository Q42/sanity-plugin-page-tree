import { notFound } from 'next/navigation';
import {sanityClient} from '../../../sanity.client'
import { HomePage as HomePageType, ContentPage as ContentPageType } from '../../page-types';
import { SitemapPage } from 'sanity-plugin-page-tree/next';
import { HomePage } from '@/pages/HomePage';
import { ContentPage } from '@/pages/ContentPage';
import { pageTreeClient } from '../../../page-tree.client';

type PageProps = {
  params: {
    slug: string[];
  };
}

const Page = async ({ params }: PageProps) => {
  const path = params.slug ? "/" + params.slug?.join('/') : '/';
  const sitemap = await pageTreeClient.getSitemap();
  const pageInfo = sitemap.find((page) => page.url === path);

  if (!pageInfo) {
    return notFound();
  }

  return <PageHandler pageInfo={pageInfo}  />;
};

export default Page;

type PageHandlerProps = {
  pageInfo: SitemapPage;
};

const PageHandler = async ({ pageInfo }: PageHandlerProps) => {
  switch (pageInfo.type) {
    case 'homePage': {
      const page = await sanityClient.fetch<HomePageType>(`*[_id == $id][0]{title, link}`, { id: pageInfo._id });

      if (!page) {
        return notFound();
      }

      return <HomePage page={page} />;
    }
    case 'contentPage': {
      const page = await sanityClient.fetch<ContentPageType>(`*[_id == $id][0]{title, content}`, { id: pageInfo._id });

      if (!page) {
        return notFound();
      }

      return <ContentPage page={page} />;
    }
  }
};

