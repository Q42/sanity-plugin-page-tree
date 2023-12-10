import { StructureBuilder, DocumentList } from 'sanity/desk';
import { PageInfo, PageTreeConfig, PageTreeDocumentListOptions, PageTreeHelpers } from './types';
import { createPageTreeView } from './components/PageTreeView';
import { getSitemap } from './helpers/page-tree';
import { getPageInfoQuery } from './queries';

export { definePageType } from './schema/definePageType';
export { PageTreeField } from './components/PageTreeField';

export type { PageTreeHelpers, PageTreeConfig, PageInfo, PageTreeDocumentListOptions, SitemapPage } from './types';

/**
 * Returns helpers for querying and using the page tree in your client.
 * @param config - Page tree config
 * @public
 */
export const getPageTreeHelpers = (config: PageTreeConfig): PageTreeHelpers => {
  return {
    /* Sanity GROQ query to get an array of page info objects containing the necessary information to build the page tree and resolve urls. */
    pageInfoQuery: getPageInfoQuery(config),
    /* Get resolved pages info for a given array of page info objects and returns an array of resolved page info objects containing the resolved url, id and page type */
    getSitemap: (pagesInfo: PageInfo[]) => getSitemap(config, pagesInfo),
  };
};

/**
 * Creates a custom document list for the page tree.
 * @param S - Structure builder
 * @param config - Page tree config
 * @param extendDocumentList - Optional function to extend the document list builder to add custom title, filter etc.
 * @public
 */
export const createPageTreeDocumentList = (
  S: StructureBuilder,
  { config, extendDocumentList }: PageTreeDocumentListOptions,
): DocumentList => {
  const documentList = extendDocumentList ? extendDocumentList(S.documentList()) : S.documentList();

  return Object.assign(
    documentList.filter(`_type in [${config.pageSchemaTypes.map(type => `"${type}"`).join(',')}]`).serialize(),
    {
      // Prevents the component from re-rendering when switching documents
      __preserveInstance: true,
      key: 'pageTree',
      type: 'component',
      component: createPageTreeView(config),
    },
  );
};
