import { SanityClient } from '@sanity/client';
import { groupBy, omit, orderBy } from 'lodash';

import { getPageInfoQuery } from '../queries';
import { PageIdAndUrlInfo, PageInfo, PageInfoWithPublishedState, PageTreeConfig, PageTreeItem } from '../types';

export const DRAFTS_PREFIX = 'drafts.';

export const getPageTreeItemById = async (
  config: PageTreeConfig,
  client: SanityClient,
  id: string,
): Promise<PageTreeItem | undefined> => {
  const allPages = await client.fetch(getPageInfoQuery(config.pageSchemaTypes));
  const pageTree = mapPagesToPageTree(allPages);

  return findPageTreeItemById(pageTree, id);
};

/**
 * Finds a page from an array of page tree items by the given page id.
 */
export const findPageTreeItemById = (pages: PageTreeItem[], id: string): PageTreeItem | undefined => {
  for (const page of pages) {
    if (page._id === id) return page;

    if (page.children) {
      const childPage = findPageTreeItemById(page.children, id);
      if (childPage) return childPage;
    }
  }
};

/**
 * Maps pages to page tree containing recursive nested children.
 */
export const mapPagesToPageTree = (pages: PageInfo[]): PageTreeItem[] => {
  const pagesWithPublishedState = getPublishedAndDraftPageInfo(pages);

  return orderBy(mapPageTreeItems(pagesWithPublishedState), 'url');
};

/**
 * Recursively flattens page tree to flat array of pages.
 */
export const flatMapPageTree = (pages: PageTreeItem[]): Omit<PageTreeItem, 'children'>[] =>
  pages.flatMap(page => (page.children ? [omit(page, 'children'), ...flatMapPageTree(page.children)] : page));

/**
 * Map pages to flattened array of page id and resolved url info.
 */
export const mapPagesToPageIdAndUrlInfo = (pages: PageInfo[]): PageIdAndUrlInfo[] => {
  const pageTree = mapPagesToPageTree(pages);
  const flatPageTree = flatMapPageTree(pageTree);

  return flatPageTree.map(page => ({
    pageId: page._id,
    url: page.url,
    type: page._type,
  }));
};

/**
 * Maps pages to page tree containing recursive nested children and urls.
 */
const mapPageTreeItems = (
  pagesWithPublishedState: PageInfoWithPublishedState[],
  parentId?: string,
  parentUrl: string = '',
): PageTreeItem[] => {
  const getChildPages = (parentId: string | undefined) =>
    pagesWithPublishedState.filter(page => page.parent?._ref === parentId);

  return getChildPages(parentId).map(page => {
    const pageUrl = parentUrl ? `${parentUrl}/${page.slug?.current}` : `/${page.language}`;
    const children = orderBy(mapPageTreeItems(pagesWithPublishedState, page._id, pageUrl), 'url');

    return {
      ...page,
      ...(children.length ? { children } : {}),
      url: pageUrl,
    };
  });
};

/**
 * Provides draft and published status. Filters out duplicate pages with the same id and invalid pages.
 */
const getPublishedAndDraftPageInfo = (pages: PageInfo[]): PageInfoWithPublishedState[] => {
  const publishedPages = groupBy(
    pages.filter(p => !p._id.startsWith(DRAFTS_PREFIX)),
    p => p._id,
  );
  const draftPages = groupBy(
    pages.filter(p => p._id.startsWith(DRAFTS_PREFIX)),
    p => p._id.replace(DRAFTS_PREFIX, ''),
  );

  return pages
    .filter(isValidPage)
    .filter(p => !draftPages[p._id]) // filter out published versions for pages which have a draft
    .map(p => {
      const isDraft = p._id.startsWith(DRAFTS_PREFIX);
      const _idWithoutDraft = p._id.replace(DRAFTS_PREFIX, '');
      const newPage: PageInfoWithPublishedState = {
        ...p,
        _id: isDraft ? _idWithoutDraft : p._id,
        isDraft,
        isPublished: !!publishedPages[_idWithoutDraft],
      };
      return newPage;
    });
};

const isValidPage = (page: PageInfo): boolean => {
  if (page.parent == null || page.slug == null) {
    if (page._type != 'homePage') {
      return false;
    }
  }
  return true;
};
