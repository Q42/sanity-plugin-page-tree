import { HomePage as HomePageType } from '../page-types';
import { useEffect, useState } from 'react';
import { sanityClient } from '../sanity.client.ts';
import { PageLink } from '../components/PageLink.tsx';
import { NotFound } from './NotFound.tsx';

export type HomePageProps = {
  pageId: string;
};

export const HomePage = ({ pageId }: HomePageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<HomePageType>();

  useEffect(() => {
    const fetchHomePage = async () => {
      const homePage = await sanityClient.fetch<HomePageType>(`*[_id == $id][0]{title, link}`, { id: pageId });
      setPage(homePage);
      setIsLoading(false);
    };

    void fetchHomePage();
  }, [pageId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!page) {
    return <NotFound />;
  }

  return (
    <div>
      <h1>{page.title}</h1>
      <p>{page.introText}</p>
      <PageLink link={page.link.page}>{page.link.title}</PageLink>
    </div>
  );
};
