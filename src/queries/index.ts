import { PageTreeConfig } from '../types';
import { getLanguageFromConfig } from '../helpers/config';

export const getRawPageMetadataQuery = (config: PageTreeConfig) => `*[_type in [${Object.values(config.pageSchemaTypes)
  .map(key => `"${key}"`)
  .join(', ')}]]{
    _id,
    _type,
    _updatedAt,
    parent,
    slug,
    title,
    ${getLanguageFromConfig(config) ?? ''}
  }`;
