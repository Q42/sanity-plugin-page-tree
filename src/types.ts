import { DocumentListBuilder } from 'sanity/lib/exports/desk';

export type SanityRef = {
  _ref: string;
  _type: 'reference';
};

/**
 * @public
 */
export type SitemapPage = {
  _id: string;
  _updatedAt: string;
  url: string;
  type: string;
};

/**
 * @public
 */
export type PageInfo = {
  [key: string]: any;
  _id: string;
  _type: string;
  _updatedAt: string;
  parent?: SanityRef;
  slug?: { current: string };
  title: string;
};

export type PageInfoWithPublishedState = PageInfo & {
  isDraft: boolean;
  isPublished: boolean;
};

export type PageTreeItem = PageInfoWithPublishedState & {
  children?: PageTreeItem[];
  url: string;
};

/**
 * @public
 */
export type PageTreeConfig = {
  /* Api version that is used throughout your project */
  apiVersion: string;
  /* Root page schema type name, e.g. "homePage" */
  rootSchemaType: string;
  /* All your page schema type names, e.g. ["homePage", "contentPage"] */
  pageSchemaTypes: string[];
  /* This plugin supports the document-internationalization plugin. To use it properly, provide the supported languages. */
  documentInternationalization?: {
    /* Array of supported language code strings, e.g. ["en", "nl"]. These will be used in root pages and when creating a new child page it will set the language field based on the parent page. */
    supportedLanguages: string[];
    /* Optional field name of the language field, defaults to "language" */
    languageFieldName?: string;
  };
};

/**
 * @public
 */
export type PageTreeDocumentListOptions = {
  config: PageTreeConfig;
  extendDocumentList?: (builder: DocumentListBuilder) => DocumentListBuilder;
};

/**
 * @public
 */
export type PageTreeHelpers = {
  pageInfoQuery: string;
  getSitemap: (pagesInfo: PageInfo[]) => SitemapPage[];
};
