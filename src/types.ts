import { DocumentListBuilder } from 'sanity/structure';

export type SanityRef = {
  _ref: string;
  _type: 'reference';
};

/**
 * @public
 */
export type PageMetadata = {
  _id: string;
  _updatedAt: string;
  path: string;
  type: string;
};

export type RawPageMetadata = {
  // For user customizable language/title fields
  [key: string]: any;
  _id: string;
  _type: string;
  _updatedAt: string;
  parent?: SanityRef;
  slug?: { current: string };
};

export type RawPageMetadataWithPublishedState = RawPageMetadata & {
  isDraft: boolean;
  isPublished: boolean;
};

export type PageTreeItem = RawPageMetadataWithPublishedState & {
  children?: PageTreeItem[];
  path: string;
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
  /* Field name of your page documents */
  titleFieldName?: string;
  /* Optionally specify which document types can be the parent of a document type */
  allowedParents?: Record<string, string[]>;
  /* Used for creating page link on the editor page */
  baseUrl?: string;
  /* This plugin supports the document-internationalization plugin. To use it properly, provide the supported languages. */
  documentInternationalization?: {
    /* Array of supported language code strings, e.g. ["en", "nl"]. These will be used in root pages and when creating a new child page it will set the language field based on the parent page. */
    supportedLanguages: string[];
    /* Optional field name of the language field, defaults to "language" */
    languageFieldName?: string;
  };
  /* Optionally add any filtering rules */
  slugValidationOptions?: {
    /* Slugs must be lowercase or fail validation */
    enforceLowerCase?: boolean;
    /* Slugs cannot contain invalid characters or fail validation */
    /* Invalid characters include: */
    enforceValidCharacters?: boolean;
  }
};

/**
 * @public
 */
export type PageTreeDocumentListOptions = {
  config: PageTreeConfig;
  extendDocumentList?: (builder: DocumentListBuilder) => DocumentListBuilder;
};
