import { groupBy, omit, orderBy, sortBy } from 'lodash';

import {
  NestedPageTreeItem,
  PageMetadata,
  PageTreeConfig,
  PageTreeItem,
  RawPageMetadata,
  RawPageMetadataWithPublishedState,
} from '../types';
import { getSanityDocumentId } from '../utils/sanity';
import { getLanguageFieldName, getRootPageSlug } from './config';

export const DRAFTS_PREFIX = 'drafts.';

/**
 * Maps array of raw page metadata objects to page metadata object array containing resolved id, path and type.
 */
export const getAllPageMetadata = (config: PageTreeConfig, pages: RawPageMetadata[]): PageMetadata[] => {
  const pageTree = mapRawPageMetadatasToPageTree(config, pages);
  const flatPageTree = flatMapPageTree(pageTree);

  return flatPageTree.map(page => ({
    _id: page._id,
    _updatedAt: page._updatedAt,
    path: page.path,
    type: page._type,
  }));
};

/**
 * Finds a page from an array of page tree items by the given page id.
 */
export const findPageTreeItemById = (pages: NestedPageTreeItem[], id: string): NestedPageTreeItem | undefined => {
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
export const mapRawPageMetadatasToPageTree = (
  config: PageTreeConfig,
  pages: RawPageMetadata[],
): NestedPageTreeItem[] => {
  const pagesWithPublishedState = getPublishedAndDraftRawPageMetadata(config, pages);

  const orderedPages = orderBy(mapPageTreeItems(config, pagesWithPublishedState), 'path');
  const { documentInternationalization } = config;
  if (documentInternationalization) {
    const languageField = getLanguageFieldName(config);

    return sortBy(orderedPages, p => {
      let index = documentInternationalization.supportedLanguages.indexOf((p[languageField] as string)?.toLowerCase());
      if (index === -1) {
        index = documentInternationalization.supportedLanguages.length;
      }
      return index;
    });
  }
  return orderedPages;
};

/**
 * Recursively flattens page tree to flat array of pages.
 */
export const flatMapPageTree = (pages: NestedPageTreeItem[]): PageTreeItem[] =>
  pages.flatMap(page =>
    page.children ? [omit(page, 'children') as PageTreeItem, ...flatMapPageTree(page.children)] : page,
  );

/**
 * Maps pages to page tree containing recursive nested children and pahts.
 */
const mapPageTreeItems = (
  config: PageTreeConfig,
  pagesWithPublishedState: RawPageMetadataWithPublishedState[],
  parentId?: string,
  parentPath: string = '',
): NestedPageTreeItem[] => {
  const getChildPages = (parentId: string | undefined) =>
    pagesWithPublishedState.filter(page => page.parent?._ref === parentId);

  return getChildPages(parentId).map(page => {
    const pagePath = parentPath
      ? `${parentPath === '/' ? '' : parentPath}/${page.slug?.current}`
      : `/${getRootPageSlug(page, config) ?? ''}`;
    const children = orderBy(mapPageTreeItems(config, pagesWithPublishedState, page._id, pagePath), 'path');

    return {
      ...page,
      children,
      path: pagePath,
    };
  });
};

/**
 * Provides draft and published status. Filters out duplicate pages with the same id, invalid and archived pages.
 */
const getPublishedAndDraftRawPageMetadata = (
  config: PageTreeConfig,
  pages: RawPageMetadata[],
): RawPageMetadataWithPublishedState[] => {
  const publishedPages = groupBy(
    pages.filter(p => !p._id.startsWith(DRAFTS_PREFIX)),
    p => p._id,
  );
  const draftPages = groupBy(
    pages.filter(p => p._id.startsWith(DRAFTS_PREFIX)),
    p => getSanityDocumentId(p._id),
  );

  return pages
    .filter(page => isValidPage(config, page))
    .filter(page => !isArchivedPage(config, page))
    .filter(p => !draftPages[p._id]) // filter out published versions for pages which have a draft
    .map(p => {
      const isDraft = p._id.startsWith(DRAFTS_PREFIX);
      const _idWithoutDraft = getSanityDocumentId(p._id);
      const newPage: RawPageMetadataWithPublishedState = {
        ...p,
        _id: isDraft ? _idWithoutDraft : p._id,
        isDraft,
        isPublished: !!publishedPages[_idWithoutDraft],
      };
      return newPage;
    });
};

const isValidPage = (config: PageTreeConfig, page: RawPageMetadata): boolean => {
  if (!page.parent || !page.slug) {
    if (page._type !== config.rootSchemaType) {
      return false;
    }
  }
  return true;
};

const isArchivedPage = (config: PageTreeConfig, page: RawPageMetadata): boolean => {
  return config.archivedFieldName ? page[config.archivedFieldName] === true : false;
};
