import { PageTreeConfig, RawPageMetadata } from '../types';

export const getLanguageFieldName = (config: PageTreeConfig) => {
  return config.documentInternationalization?.languageFieldName ?? 'language';
};

export const getRootPageSlug = (page: RawPageMetadata, config: PageTreeConfig) => {
  if (!config.documentInternationalization) return;

  const language = page[getLanguageFieldName(config)];
  // this can be the case when you create a root page but haven't selected the language yet
  if (typeof language != 'string') {
    return '';
  }
  return language;
};
