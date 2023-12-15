import { PortableText } from '@portabletext/react';
import { ContentPage as ContentPageType } from '../page-types';
import { useEffect, useState } from 'react';
import { sanityClient } from '../sanity.client.ts';
import { NotFound } from './NotFound.tsx';

type ContentPageProps = {
  pageId: string;
};

export const ContentPage = ({ pageId }: ContentPageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState<ContentPageType>();

  useEffect(() => {
    const fetchContentPage = async () => {
      const contentPage = await sanityClient.fetch<ContentPageType>(`*[_id == $id][0]{title, content}`, { id: pageId });
      setPage(contentPage);
      setIsLoading(false);
    };

    void fetchContentPage();
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
      <PortableText value={page.content} />
    </div>
  );
};
