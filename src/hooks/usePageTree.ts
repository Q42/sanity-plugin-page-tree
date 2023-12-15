import { useMemo } from 'react';

import { getRawPageMetadataQuery } from '../queries';
import { RawPageMetadata, PageTreeConfig } from '../types';
import { mapRawPageMetadatasToPageTree } from '../helpers/page-tree';
import { useListeningQuery } from 'sanity-plugin-utils';

export const usePageTree = (config: PageTreeConfig) => {
  const { data, loading } = useListeningQuery<RawPageMetadata[]>(getRawPageMetadataQuery(config), {
    options: { apiVersion: config.apiVersion },
  });

  const pageTree = useMemo(() => (data ? mapRawPageMetadatasToPageTree(config, data) : undefined), [config, data]);

  return {
    isLoading: loading,
    pageTree,
  };
};
