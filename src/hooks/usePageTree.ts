import { useMemo } from 'react';

import { getPageInfoQuery } from '../queries';
import { PageInfo, PageTreeConfig } from '../types';
import { mapPageInfoToPageTree } from '../helpers/page-tree';
import { useListeningQuery } from 'sanity-plugin-utils';

export const usePageTree = (config: PageTreeConfig) => {
  const { data, loading } = useListeningQuery<PageInfo[]>(getPageInfoQuery(config), {
    options: { apiVersion: config.apiVersion },
  });

  const pageTree = useMemo(() => (data ? mapPageInfoToPageTree(config, data) : undefined), [data]);

  return {
    isLoading: loading,
    pageTree,
  };
};
