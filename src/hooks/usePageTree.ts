import { useMemo } from 'react';
import { useMemoObservable } from 'react-rx';
import { useDocumentStore } from 'sanity';

import { mapPagesToPageTree } from '../helpers/page-tree';
import { getPageInfoQuery } from '../queries';
import { PageTreeConfig } from '../types';

export const usePageTree = (config: PageTreeConfig) => {
  const documentStore = useDocumentStore();
  const allPages = useMemoObservable(
    () =>
      documentStore.listenQuery(
        getPageInfoQuery(config.pageSchemaTypes),
        {},
        {
          apiVersion: config.apiVersion,
        },
      ),
    [documentStore],
  );

  const pageTree = useMemo(() => (allPages ? mapPagesToPageTree(allPages) : undefined), [allPages]);
  const isLoading = useMemo(() => !allPages, [allPages]);

  return {
    isLoading,
    pageTree,
  };
};
