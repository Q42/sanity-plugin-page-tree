import { notFound } from 'next/navigation';
import {sanityClient} from '../../../sanity.client'
import { HomePage as HomePageType, ContentPage as ContentPageType } from '../../page-types';
import { PageMetadata } from '@q42/sanity-plugin-page-tree/next';
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
  const pageMetadata = await pageTreeClient.getPageMetadataByPath(path);

  if (!pageMetadata) {
    return notFound();
  }

  return <PageHandler pageMetadata={pageMetadata}  />;
};

export default Page;

type PageHandlerProps = {
  pageMetadata: PageMetadata;
};

const PageHandler = async ({ pageMetadata }: PageHandlerProps) => {
  switch (pageMetadata.type) {
    case 'homePage': {
      const page = await sanityClient.fetch<HomePageType>(`*[_id == $id][0]{title, link}`, { id: pageMetadata._id });

      if (!page) {
        return notFound();
      }

      return <HomePage page={page} />;
    }
    case 'contentPage': {
      const page = await sanityClient.fetch<ContentPageType>(`*[_id == $id][0]{title, content}`, { id: pageMetadata._id });

      if (!page) {
        return notFound();
      }

      return <ContentPage page={page} />;
    }
  }
};

