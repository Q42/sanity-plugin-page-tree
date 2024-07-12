import { getLanguageFieldName } from '../helpers/config';
import { PageTreeConfig } from '../types';

export const getRawPageMetadataQuery = (config: PageTreeConfig) => `*[_type in [${Object.values(config.pageSchemaTypes)
  .map(key => `"${key}"`)
  .join(', ')}]]{
    _id,
    _type,
    _updatedAt,
    parent,
    slug,
    title,
    ${getLanguageFieldName(config) ?? ''}
  }`;

export const getDocumentTypeQuery = (documentId: string) => `*[_id == "${documentId}"]{
  _type
}`;
