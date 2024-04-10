import { StructureBuilder, DocumentList } from 'sanity/structure';
import { PageTreeDocumentListOptions } from './types';
import { createPageTreeView } from './components/PageTreeView';

export { definePageType } from './schema/definePageType';
export { PageTreeField } from './components/PageTreeField';
export { PageTreeInput } from './components/PageTreeInput';

export type { PageTreeConfig, PageTreeDocumentListOptions } from './types';

/**
 * Creates a custom document list for the page tree.
 * @param S - Structure builder
 * @param config - Page tree config
 * @param extendDocumentList - Optional function to extend the document list builder to add custom title, filter etc.
 * @public
 */
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
