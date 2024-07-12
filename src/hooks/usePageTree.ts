import { useMemo } from 'react';
import { useListeningQuery } from 'sanity-plugin-utils';

import { mapRawPageMetadatasToPageTree } from '../helpers/page-tree';
import { getAllRawPageMetadataQuery } from '../queries';
import { PageTreeConfig, RawPageMetadata } from '../types';

export const usePageTree = (config: PageTreeConfig) => {
  const { data, loading } = useListeningQuery<RawPageMetadata[]>(getAllRawPageMetadataQuery(config), {
    options: { apiVersion: config.apiVersion },
  });

  const pageTree = useMemo(() => (data ? mapRawPageMetadatasToPageTree(config, data) : undefined), [config, data]);

  return {
    isLoading: loading,
    pageTree,
  };
};
