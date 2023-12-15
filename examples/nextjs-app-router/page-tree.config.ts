import { PageTreeConfig } from 'sanity-plugin-page-tree';
import { apiVersion } from './sanity/env';

export const pageTreeConfig: PageTreeConfig = {
  rootSchemaType: 'homePage',
  pageSchemaTypes: ['homePage', 'contentPage'],
  apiVersion,
};
