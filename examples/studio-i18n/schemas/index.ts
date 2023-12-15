import { defineField, defineType } from 'sanity';
import { definePageType } from 'sanity-plugin-page-tree';
import { pageTreeConfig } from '../page-tree-config';

const _homePageType = defineType({
  name: 'homePage',
  type: 'document',
  title: 'Homepage',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
  ],
});

const homePageType = definePageType(_homePageType, pageTreeConfig, { isRoot: true });

const _contentPageType = defineType({
  name: 'contentPage',
  type: 'document',
  title: 'Content page',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'language',
      type: 'string',
      hidden: true,
    }),
  ],
});

const contentPageType = definePageType(_contentPageType, pageTreeConfig);

export const schemaTypes = [homePageType, contentPageType];
