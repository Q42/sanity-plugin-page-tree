import { Reference, ValidationContext } from 'sanity';

import { getLanguageFieldName } from '../helpers/config';
import { getRawPageMetadataQuery } from '../queries';
import { PageTreeConfig, RawPageMetadata, SanityRef } from '../types';

/**
 * Validates that the slug is unique within the parent page and therefore that entire the path is unique.
 */
export const allowedParentValidator =
  (config: PageTreeConfig, ownType: string) =>
  async (selectedParentRef: Reference | undefined, context: ValidationContext) => {
    const allowedParents = config.allowedParents?.[ownType];

    const parentRef = context.document?.parent as SanityRef | undefined;
    if (!parentRef) {
      return true;
    }

    const parentId = parentRef._ref;

    if (parentId === undefined) {
      return true;
    }

    const client = context.getClient({ apiVersion: config.apiVersion });
    const selectedParent = (await client.fetch<RawPageMetadata[]>(getRawPageMetadataQuery(parentId, config)))?.[0];

    if (!selectedParent._type) {
      return 'Unable to check the type of the selected parent.';
    }

    if (allowedParents && !allowedParents.includes(selectedParent._type)) {
      return `The parent of type "${selectedParent._type}" is not allowed for this type of document.`;
    }

    if (config.documentInternationalization?.documentLanguageShouldMatchParent) {
      const languageFieldName = getLanguageFieldName(config);
      const language = context.document?.[languageFieldName];
      const parentLanguage = selectedParent?.[languageFieldName];

      if (language !== parentLanguage) {
        return 'The language of the parent must match the language of the document.';
      }
    }

    return true;
  };
