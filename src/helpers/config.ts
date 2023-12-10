import { PageTreeConfig } from '../types';

export const getLanguageFromConfig = (config: PageTreeConfig) => {
  return config.documentInternationalization
    ? config.documentInternationalization.languageFieldName ?? 'language'
    : undefined;
};
