import { SlugValue, ValidationContext } from 'sanity';

import { DRAFTS_PREFIX } from '../helpers/page-tree';
import { getAllRawPageMetadataQuery } from '../queries';
import { PageTreeConfig, RawPageMetadata, SanityRef } from '../types';
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

    const allPages = await client.fetch<RawPageMetadata[]>(getAllRawPageMetadataQuery(config));
    const siblingPages = allPages.filter(page => page.parent?._ref === parentRef._ref);

    const siblingPagesWithSameSlug = siblingPages
      .filter(
        page => getSanityDocumentId(page._id) !== (context.document?._id && getSanityDocumentId(context.document._id)),
      )
      .filter(page => page.slug?.current?.toLowerCase() === slug?.current?.toLowerCase());

    if (siblingPagesWithSameSlug.length) {
      // If there is a sibling page with the same slug published, but a different slug in a draft, we want to show a more specific validation error to the user instead.
      const siblingDraftPageWithSameSlug = siblingPages.find(
        page =>
          page._id.startsWith(DRAFTS_PREFIX) &&
          page._id.includes(siblingPagesWithSameSlug[0]._id) &&
          page.slug?.current?.toLowerCase() !== slug?.current?.toLowerCase(),
      );

      return siblingDraftPageWithSameSlug
        ? `Slug must be unique. Another page with the same slug is already published, but has a draft version with a  different slug: "${siblingDraftPageWithSameSlug.slug?.current}". Publish that page first or change the slug to something else.`
        : 'Slug must be unique.';
    }

    return true;
  };
