import { Reference, ValidationContext } from 'sanity';

import { getDocumentTypeQuery } from '../queries';
import { RawPageMetadata, PageTreeConfig, SanityRef } from '../types';

/**
 * Validates that the slug is unique within the parent page and therefore that entire the path is unique.
 */
export const allowedParentValidator =
  (config: PageTreeConfig, ownType: string) =>
  async (selectedParent: Reference | undefined, context: ValidationContext) => {
    const alllowedParents = config.alllowedParents?.[ownType];

    if (alllowedParents === undefined) {
      return true;
    }

    const parentRef = context.document?.parent as SanityRef | undefined;
    if (!parentRef) {
      return true;
    }

    const parentId = parentRef._ref;

    if (parentId === undefined) {
      return true;
    }

    const client = context.getClient({ apiVersion: config.apiVersion });
    const selectedParentType = (await client.fetch<Pick<RawPageMetadata, '_type'>[]>(getDocumentTypeQuery(parentId)))[0]
      ?._type;

    if (!selectedParentType) {
      return 'Unable to check the type of the selected parent.';
    }

    if (!alllowedParents.includes(selectedParentType)) {
      return `The parent of type "${selectedParentType}" is not allowed for this type of document.`;
    }

    return true;
  };
