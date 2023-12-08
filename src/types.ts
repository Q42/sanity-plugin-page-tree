export type SanityRef = {
  _ref: string;
  _type: 'reference';
};

export type PageIdAndUrlInfo = {
  pageId: string;
  url: string;
  type: string;
};

export type PageInfo = {
  _id: string;
  _type: string;
  _updatedAt: string;
  parent?: SanityRef;
  slug?: { current: string };
  language: string;
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

export type PageTreeConfig = {
  apiVersion: string;
  rootSchemaTypes: string[];
  pageSchemaTypes: string[];
};
