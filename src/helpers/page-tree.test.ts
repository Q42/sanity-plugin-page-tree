import { describe, expect, it } from 'vitest';

import { NestedPageTreeItem, PageTreeConfig, RawPageMetadata } from '../types';
import { findPageTreeItemById, flatMapPageTree, getAllPageMetadata, mapRawPageMetadatasToPageTree } from './page-tree';

const config: PageTreeConfig = {
  apiVersion: '2023-01-01',
  rootSchemaType: 'homePage',
  pageSchemaTypes: ['homePage', 'contentPage'],
  titleFieldName: 'title',
  baseUrl: 'https://example.com',
  documentInternationalization: {
    supportedLanguages: ['en', 'nl'],
  },
};

const rawHomePage: RawPageMetadata = {
  _id: 'home',
  _type: 'homePage',
  _updatedAt: '2023-01-01T00:00:00Z',
  title: 'Home Page',
  language: 'en',
};

const rawParentContentPage: RawPageMetadata = {
  _id: 'parent',
  _type: 'contentPage',
  _updatedAt: '2023-01-01T00:00:00Z',
  parent: { _ref: 'home', _type: 'reference' },
  slug: { current: 'parent' },
  title: 'Content Page',
  language: 'en',
};

const rawChildContentPage: RawPageMetadata = {
  _id: 'child',
  _type: 'contentPage',
  _updatedAt: '2023-01-01T00:00:00Z',
  parent: { _ref: 'parent', _type: 'reference' },
  slug: { current: 'child' },
  title: 'Content Page child',
  language: 'en',
};

const rawPages: RawPageMetadata[] = [rawHomePage, rawParentContentPage, rawChildContentPage];

const pageTree: NestedPageTreeItem[] = [
  {
    ...rawHomePage,
    isDraft: false,
    isPublished: true,
    path: '/en',
    children: [
      {
        ...rawParentContentPage,
        isDraft: false,
        isPublished: true,
        path: '/en/parent',
        children: [
          {
            ...rawChildContentPage,
            isDraft: false,
            isPublished: true,
            path: '/en/parent/child',
            children: [],
          },
        ],
      },
    ],
  },
];

describe('Page tree helpers', () => {
  describe('getAllPageMetadata', () => {
    it('should return all page metadata from a page tree', () => {
      expect(getAllPageMetadata(config, rawPages)).toStrictEqual([
        {
          _id: rawHomePage._id,
          _updatedAt: rawHomePage._updatedAt,
          title: 'Home Page',
          type: rawHomePage._type,
          path: '/en',
        },
        {
          _id: rawParentContentPage._id,
          _updatedAt: rawParentContentPage._updatedAt,
          title: 'Content Page',
          type: rawParentContentPage._type,
          path: '/en/parent',
        },
        {
          _id: rawChildContentPage._id,
          _updatedAt: rawChildContentPage._updatedAt,
          title: 'Content Page child',
          type: rawChildContentPage._type,
          path: '/en/parent/child',
        },
      ]);
    });
  });

  describe('mapRawPageMetadatasToPageTree', () => {
    it('should map an array raw page metadata to a nested page tree correctly', () => {
      expect(mapRawPageMetadatasToPageTree(config, rawPages)).toStrictEqual(pageTree);
    });

    it('should omit invalid pages from page tree', () => {
      expect(
        mapRawPageMetadatasToPageTree(config, [
          {
            _id: 'missing-parent',
            _type: 'contentPage',
            _updatedAt: '2023-01-01T00:00:00Z',
            language: 'en',
            slug: { current: 'slug' },
          },
          {
            _id: 'missing-slug',
            _type: 'contentPage',
            _updatedAt: '2023-01-01T00:00:00Z',
            language: 'en',
            parent: { _ref: 'home', _type: 'reference' },
          },
        ]),
      ).toStrictEqual([]);
    });

    it('should omit published pages that have a draft version', () => {
      expect(
        mapRawPageMetadatasToPageTree(config, [
          {
            _id: 'home',
            _type: 'homePage',
            _updatedAt: '2023-01-01T00:00:00Z',
            title: 'Home Page',
            language: 'en',
          },
          {
            _id: 'drafts.home',
            _type: 'homePage',
            _updatedAt: '2024-01-01T00:00:00Z',
            title: 'Home Page in draft',
            language: 'en',
          },
        ]),
      ).toStrictEqual([
        {
          _id: 'home',
          _type: 'homePage',
          _updatedAt: '2024-01-01T00:00:00Z',
          title: 'Home Page in draft',
          isDraft: true,
          isPublished: true,
          path: '/en',
          language: 'en',
          children: [],
        },
      ]);
    });
  });

  describe('flatMapPageTree', () => {
    it('should flatten a nested page tree correctly', () => {
      expect(flatMapPageTree(pageTree)).toStrictEqual([
        {
          ...rawHomePage,
          isDraft: false,
          isPublished: true,
          path: '/en',
        },
        {
          ...rawParentContentPage,
          isDraft: false,
          isPublished: true,
          path: '/en/parent',
        },
        {
          ...rawChildContentPage,
          isDraft: false,
          isPublished: true,
          path: '/en/parent/child',
        },
      ]);
    });
  });

  describe('findPageTreeItemById', () => {
    it('should find a page from a page tree by the given page id', () => {
      expect(findPageTreeItemById(pageTree, 'child')).toStrictEqual({
        ...rawChildContentPage,
        isDraft: false,
        isPublished: true,
        path: '/en/parent/child',
        children: [],
      });
    });

    it('should return undefined if the page id is not found', () => {
      expect(findPageTreeItemById(pageTree, 'missing')).toBeUndefined();
    });
  });
});
