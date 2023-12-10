import { PageInfo, PageTreeConfig, PageTreeHelpers } from './types';
import { getSitemap } from './helpers/page-tree';
import { getPageInfoQuery } from './queries';

export type { PageTreeHelpers, PageInfo, SitemapPage } from './types';

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
