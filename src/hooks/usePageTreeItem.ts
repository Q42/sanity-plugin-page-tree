import { useMemo } from 'react';

import { getRawPageMetadataQuery } from '../queries';
import { RawPageMetadata, PageTreeConfig } from '../types';
import { getAllPageMetadata } from '../helpers/page-tree';
import { useListeningQuery } from 'sanity-plugin-utils';
import { ClientPerspective } from 'next-sanity';

export const usePageTreeItem = (documentId: string, config: PageTreeConfig, perspective?: ClientPerspective) => {
  const { data, loading } = useListeningQuery<RawPageMetadata[]>(getRawPageMetadataQuery(config), {
    options: { apiVersion: config.apiVersion, perspective },
  });

  const pageTree = useMemo(() => (data ? getAllPageMetadata(config, data) : undefined), [config, data]);

  return {
    isLoading: loading,
    page: pageTree?.find(page => page._id === documentId),
  };
};
