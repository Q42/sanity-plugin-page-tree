import { SlugValue, ValidationContext } from 'sanity';

import { DRAFTS_PREFIX } from '../helpers/page-tree';
import { getPageInfoQuery } from '../queries';
import { PageInfo, PageTreeConfig, SanityRef } from '../types';

/**
 * Validates that the slug is unique within the parent page and therefore that entire the url is unique.
 */
export const slugValidator =
  (config: PageTreeConfig) => async (slug: SlugValue | undefined, context: ValidationContext) => {
    const client = context.getClient({ apiVersion: config.apiVersion });
    const parentRef = context.document?.parent as SanityRef | undefined;

    if (!parentRef) {
      return true;
    }

    const allPages = await client.fetch<PageInfo[]>(getPageInfoQuery(config.pageSchemaTypes));
    const siblingPages = allPages.filter(page => page.parent?._ref === parentRef._ref);

    const hasDuplicateSlugWithinParent = siblingPages
      .filter(child => child._id.replace(DRAFTS_PREFIX, '') !== context.document?._id.replace(DRAFTS_PREFIX, ''))
      .some(child => child.slug?.current === slug?.current);

    if (hasDuplicateSlugWithinParent) {
      return 'Slug must be unique.';
    }

    return true;
  };
