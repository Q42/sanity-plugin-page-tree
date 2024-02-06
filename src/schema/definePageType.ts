import { DocumentDefinition, defineField, defineType, SlugOptions } from 'sanity';

import { PageTreeField } from '../components/PageTreeField';
import { PageTreeConfig } from '../types';
import { slugValidator } from '../validators/slug-validator';
import { SlugField } from '../components/SlugField';

type Options = {
  isRoot?: boolean;
  fieldsGroupName?: string;
  slugSource?: SlugOptions['source'];
};

export const definePageType = (
  type: DocumentDefinition,
  config: PageTreeConfig,
  options: Options = { isRoot: false },
) =>
  defineType({
    ...type,
    title: type.title,
    fields: [...basePageFields(config, options), ...type.fields],
  });

const basePageFields = (config: PageTreeConfig, options: Options) => [
  ...(!options.isRoot
    ? [
        defineField({
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          options: {
            source: config.titleFieldName ?? options.slugSource,
            isUnique: () => true,
          },
          components: {
            input: props => SlugField({ ...props, config }),
          },
          validation: Rule => Rule.required().custom(slugValidator(config)),
          group: options.fieldsGroupName,
        }),
      ]
    : []),
  ...(!options.isRoot
    ? [
        defineField({
          name: 'parent',
          title: 'Parent page',
          type: 'reference',
          to: config.pageSchemaTypes.map(type => ({ type })),
          validation: Rule => Rule.required(),
          group: options.fieldsGroupName,
          components: {
            field: props => PageTreeField({ ...props, config, mode: 'select-parent' }),
          },
        }),
      ]
    : []),
];
