import { PageTreeConfig } from '@q42/sanity-plugin-page-tree';

export const pageTreeConfig: PageTreeConfig = {
  rootSchemaType: 'homePage',
  pageSchemaTypes: ['homePage', 'contentPage'],
  apiVersion: '2023-12-08',
  titleFieldName: 'title',
  baseUrl: 'https://q42.nl'
};
