import { SlugValue, ValidationContext } from 'sanity';

import { getRawPageMetadataQuery } from '../queries';
import { RawPageMetadata, PageTreeConfig, SanityRef } from '../types';
import { getSanityDocumentId } from '../utils/sanity';

/**
 * Validates that the slug is unique within the parent page and therefore that entire the path is unique.
 */
export const slugValidator =
  (config: PageTreeConfig) => async (slug: SlugValue | undefined, context: ValidationContext) => {
    const client = context.getClient({ apiVersion: config.apiVersion });
    const parentRef = context.document?.parent as SanityRef | undefined;

    if (!parentRef) {
      return true;
    }

    const allPages = await client.fetch<RawPageMetadata[]>(getRawPageMetadataQuery(config));
    const siblingPages = allPages.filter(page => page.parent?._ref === parentRef._ref);

    const hasDuplicateSlugWithinParent = siblingPages
      .filter(
        child =>
          getSanityDocumentId(child._id) !== (context.document?._id && getSanityDocumentId(context.document._id)),
      )
      .some(child => child.slug?.current === slug?.current);

    if (hasDuplicateSlugWithinParent) {
      return 'Slug must be unique.';
    }

    return true;
  };
