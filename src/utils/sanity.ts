export const DRAFTS_PREFIX = 'drafts.';
export const VERSION_PREFIX = 'versions.';

/**
 * Strips draft or version id prefix from Sanity document id.
 * Handles: 'drafts.<id>' and 'versions.<bundleId>.<id>'
 */
export const getSanityDocumentId = (val: string): string => {
  if (val.startsWith(DRAFTS_PREFIX)) return val.slice(DRAFTS_PREFIX.length);
  if (val.startsWith(VERSION_PREFIX)) {
    const withoutVersion = val.slice(VERSION_PREFIX.length);
    const dotIndex = withoutVersion.indexOf('.');
    return dotIndex >= 0 ? withoutVersion.slice(dotIndex + 1) : withoutVersion;
  }
  return val;
};
