import { StructureBuilder, DocumentListBuilder, DocumentList } from 'sanity/desk';

import { createPageTreeView } from './components/PageTreeView';
import { PageTreeConfig } from './types';

export {
  getPageTreeItemById,
  mapPagesToPageTree,
  flatMapPageTree,
  findPageTreeItemById,
  mapPagesToPageIdAndUrlInfo,
} from './helpers/page-tree';
export { definePageType } from './schema/definePageType';
export { PageTreeField } from './components/PageTreeField';
export * from './types';
export { getPageInfoQuery } from './queries';

export type PageTreeDocumentListOptions = {
  config: PageTreeConfig;
  extendDocumentList?: (builder: DocumentListBuilder) => DocumentListBuilder;
};

export const createPageTreeDocumentList = (
  S: StructureBuilder,
  { config, extendDocumentList }: PageTreeDocumentListOptions,
): DocumentList => {
  const documentList = extendDocumentList ? extendDocumentList(S.documentList()) : S.documentList();

  return Object.assign(
    documentList.filter(`_type in [${config.pageSchemaTypes.map(type => `"${type}"`).join(',')}]`).serialize(),
    {
      // Prevents the component from re-rendering when switching documents
      __preserveInstance: true,
      key: 'pageTree',
      type: 'component',
      component: createPageTreeView(config),
    },
  );
};
