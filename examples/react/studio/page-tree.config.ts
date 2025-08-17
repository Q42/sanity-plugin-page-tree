import { PageTreeConfig } from '@julioferrero/sanity-plugin-page-tree';

export const pageTreeConfig: PageTreeConfig = {
  rootSchemaType: 'homePage',
  pageSchemaTypes: ['homePage', 'contentPage'],
  titleFieldName: 'title',
};
