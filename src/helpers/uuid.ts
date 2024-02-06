import { uuid } from '@sanity/uuid';

export const generateDraftId = () => `drafts.${uuid()}`;
