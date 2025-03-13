import { getLanguageFieldName } from '../helpers/config';
import { PageTreeConfig } from '../types';

export const getAllRawPageMetadataQuery = (config: PageTreeConfig) => `*[_type in [${Object.values(
  config.pageSchemaTypes,
)
  .map(key => `"${key}"`)
  .join(', ')}]
  ${config?.filter ? ` && ${config.filter}` : ''}
]{
    ${rawPageMetadataFragment(config)}
  }`;

export const getRawPageMetadataQuery = (documentId: string, config: PageTreeConfig) => `*[_id == "${documentId}"]{
  ${rawPageMetadataFragment(config)}
}`;

export const rawPageMetadataFragment = (config: PageTreeConfig) => `
    _id,
    _type,
    _updatedAt,
    parent,
    slug,
    ${config.titleFieldName ?? 'title'},
    ${config.documentInternationalization ? getLanguageFieldName(config) : ''}`;
