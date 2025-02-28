import { PageTreeConfig } from '@q42/sanity-plugin-page-tree';

export const pageTreeConfig: PageTreeConfig = {
  rootSchemaType: 'homePage',
  pageSchemaTypes: ['homePage', 'contentPage'],
  titleFieldName: 'title',
  documentInternationalization: {
    supportedLanguages: ['nl', 'en', 'fr'],
    documentLanguageShouldMatchParent: true,
  }
};
