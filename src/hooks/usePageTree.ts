import { useMemo } from 'react';
import { useListeningQuery } from 'sanity-plugin-utils';

import { mapRawPageMetadatasToPageTree } from '../helpers/page-tree';
import { getAllRawPageMetadataQuery } from '../queries';
import { apiVersion } from '../sanity/api-version';
import { PageTreeConfig, RawPageMetadata } from '../types';

export const usePageTree = (config: PageTreeConfig) => {
  const { data, loading } = useListeningQuery<RawPageMetadata[]>(getAllRawPageMetadataQuery(config), {
    options: { apiVersion },
  });

  const pageTree = useMemo(() => mapRawPageMetadatasToPageTree(config, (data ?? []) as RawPageMetadata[]), [config, data]);

  return {
    isLoading: loading,
    pageTree,
  };
};
