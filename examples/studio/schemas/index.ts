import { defineType } from 'sanity';
import { definePageType } from 'sanity-plugin-page-tree';
import { pageTreeConfig } from '../page-tree-config';

const _homePageType = defineType({
  name: 'homePage',
  type: 'document',
  title: 'Homepage',
  fields: [],
});

const homePageType = definePageType(_homePageType, pageTreeConfig, { isRoot: true });

const _contentPageType = defineType({
  name: 'contentPage',
  type: 'document',
  title: 'Content page',
  fields: [],
});

const contentPageType = definePageType(_contentPageType, pageTreeConfig);

export const schemaTypes = [homePageType, contentPageType];
