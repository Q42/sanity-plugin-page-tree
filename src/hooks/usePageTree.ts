import { useMemo } from 'react';
import { useListeningQuery } from 'sanity-plugin-utils';

import { mapRawPageMetadatasToPageTree } from '../helpers/page-tree';
import { getAllRawPageMetadataQuery } from '../queries';
import { apiVersion } from '../sanity/api-version';
import { PageTreeConfig, RawPageMetadata } from '../types';

export const usePageTree = (config: PageTreeConfig) => {
  const { data, loading } = useListeningQuery(getAllRawPageMetadataQuery(config), {
    options: { apiVersion },
  });

  const pagesData = Array.isArray(data) ? (data as RawPageMetadata[]) : undefined;

  const pageTree = useMemo(
    () => (pagesData ? mapRawPageMetadatasToPageTree(config, pagesData) : undefined),
    [config, pagesData],
  );

  return {
    isLoading: loading,
    pageTree,
  };
};
