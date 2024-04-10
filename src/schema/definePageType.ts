import { compact, get } from 'lodash';
import { defineField, defineType, DocumentDefinition, SlugOptions } from 'sanity';

import { PageTreeField } from '../components/PageTreeField';
import { SlugField } from '../components/SlugField';
import { PageTreeConfig } from '../types';
import { slugValidator } from '../validators/slug-validator';

type Options = {
  isRoot?: boolean;
  fieldsGroupName?: string;
  slugSource?: SlugOptions['source'];
};

export const definePageType = (
  type: DocumentDefinition,
  config: PageTreeConfig,
  options: Options = { isRoot: false },
) => {
  const slugSourceFieldName = getSlugSourceField(config, options);

  let slugSourceField;
  let typeFields = type.fields;
  if (slugSourceFieldName) {
    slugSourceField = type.fields.find(field => field.name === slugSourceFieldName);
    typeFields = type.fields.filter(field => field.name !== slugSourceFieldName);
  }

  return defineType({
    ...type,
    title: type.title,
    fields: compact([slugSourceField, ...basePageFields(config, options), ...typeFields]),
  });
};

const basePageFields = (config: PageTreeConfig, options: Options) => [
  ...(!options.isRoot
    ? [
        defineField({
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          options: {
            source: getSlugSourceField(config, options),
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

const getSlugSourceField = (config: PageTreeConfig, options: Options) => config.titleFieldName ?? options.slugSource;
