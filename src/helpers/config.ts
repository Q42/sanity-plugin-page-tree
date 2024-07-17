import { PageTreeConfig, RawPageMetadata } from '../types';

export const getLanguageFieldName = (config: PageTreeConfig) =>
  config.documentInternationalization?.languageFieldName ?? 'language';

export const getRootPageSlug = (page: RawPageMetadata, config: PageTreeConfig) => {
  if (!config.documentInternationalization) return;

  const language = page[getLanguageFieldName(config)];
  if (typeof language != 'string') {
    throw new Error(`Language field is not a string: ${language}`);
  }
  return language;
};
