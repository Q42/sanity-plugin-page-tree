import { ClientPerspective } from 'next-sanity';
import { useMemo } from 'react';
import { useListeningQuery } from 'sanity-plugin-utils';

import { getAllPageMetadata } from '../helpers/page-tree';
import { getAllRawPageMetadataQuery } from '../queries';
import { apiVersion } from '../sanity/api-version';
import { PageTreeConfig, RawPageMetadata } from '../types';

export const usePageTreeItem = (documentId: string, config: PageTreeConfig, perspective?: ClientPerspective) => {
  const { data, loading } = useListeningQuery(getAllRawPageMetadataQuery(config), {
    options: { apiVersion, perspective },
  });

  const pagesData = Array.isArray(data) ? (data as RawPageMetadata[]) : undefined;

  const pageTree = useMemo(() => (pagesData ? getAllPageMetadata(config, pagesData) : undefined), [config, pagesData]);

  return {
    isLoading: loading,
    page: pageTree?.find(page => page._id === documentId),
  };
};
