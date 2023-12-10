import { groupBy, omit, orderBy } from 'lodash';

import { PageInfo, PageInfoWithPublishedState, PageTreeConfig, PageTreeItem, SitemapPage } from '../types';
import { getLanguageFromConfig } from './config';

export const DRAFTS_PREFIX = 'drafts.';

/**
 * Maps array of page info objects to sitemap pages array containing id, url and type.
 */
export const getSitemap = (config: PageTreeConfig, pagesInfo: PageInfo[]): SitemapPage[] => {
  const pageTree = mapPageInfoToPageTree(config, pagesInfo);
  const flatPageTree = flatMapPageTree(pageTree);

  return flatPageTree.map(page => ({
    _id: page._id,
    _updatedAt: page._updatedAt,
    url: page.url,
    type: page._type,
  }));
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
export const mapPageInfoToPageTree = (config: PageTreeConfig, pages: PageInfo[]): PageTreeItem[] => {
  const pagesWithPublishedState = getPublishedAndDraftPageInfo(pages);

  return orderBy(mapPageTreeItems(config, pagesWithPublishedState), 'url');
};

/**
 * Recursively flattens page tree to flat array of pages.
 */
export const flatMapPageTree = (pages: PageTreeItem[]): Omit<PageTreeItem, 'children'>[] =>
  pages.flatMap(page => (page.children ? [omit(page, 'children'), ...flatMapPageTree(page.children)] : page));

/**
 * Maps pages to page tree containing recursive nested children and urls.
 */
const mapPageTreeItems = (
  config: PageTreeConfig,
  pagesWithPublishedState: PageInfoWithPublishedState[],
  parentId?: string,
  parentUrl: string = '',
): PageTreeItem[] => {
  const getChildPages = (parentId: string | undefined) =>
    pagesWithPublishedState.filter(page => page.parent?._ref === parentId);

  return getChildPages(parentId).map(page => {
    const pageUrl = parentUrl
      ? `${parentUrl === '/' ? '' : parentUrl}/${page.slug?.current}`
      : `/${getLanguageFromConfig(config) ?? ''}`;
    const children = orderBy(mapPageTreeItems(config, pagesWithPublishedState, page._id, pageUrl), 'url');

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
  if (page.parent === null || page.slug === null) {
    if (page._type != 'homePage') {
      return false;
    }
  }
  return true;
};
