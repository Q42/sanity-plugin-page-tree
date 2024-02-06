export const DRAFTS_PREFIX = 'drafts.';

/**
 * Strips draft id prefix from Sanity document id when draft id is provided.
 */
export const getSanityDocumentId = (val: string) => val.replace(DRAFTS_PREFIX, '');
