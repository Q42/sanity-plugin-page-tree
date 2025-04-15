import { compact } from 'lodash';
import { defineField, defineType, DocumentDefinition, SlugOptions } from 'sanity';

import ComputedSlugInput, { ComputedSlugInputProps } from '../components/ComputedSlugField';
import { PageTreeField } from '../components/PageTreeField';
import { PageTreeConfig } from '../types';
import { parentValidator } from '../validators/parent-validator';
import { slugValidator } from '../validators/slug-validator';

type Options = {
  isRoot?: boolean;
  fieldsGroupName?: string;
  slugSource?: SlugOptions['source'];
};

function getPossibleParentsFromConfig(config: PageTreeConfig, ownType: DocumentDefinition): string[] {
  if (config.allowedParents !== undefined && ownType.name in config.allowedParents) {
    return config.allowedParents[ownType.name];
  }
  return config.pageSchemaTypes;
}

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
    fields: compact([slugSourceField, ...basePageFields(config, options, type), ...typeFields]),
  });
};

const basePageFields = (config: PageTreeConfig, options: Options, ownType: DocumentDefinition) => [
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
          validation: Rule => Rule.required().custom(slugValidator(config)),
          group: options.fieldsGroupName,
        }),
        {
          name: 'computedSlug',
          type: 'string',
          title: 'Link to Page',
          group: options.fieldsGroupName,
          components: {
            input: (props: ComputedSlugInputProps) => ComputedSlugInput({ ...props, config }),
          },
        },
      ]
    : []),
  ...(!options.isRoot
    ? [
        defineField({
          name: 'parent',
          title: 'Parent page',
          type: 'reference',
          to: getPossibleParentsFromConfig(config, ownType).map(type => ({ type })),
          validation: Rule => Rule.required().custom(parentValidator(config, ownType.name)),
          group: options.fieldsGroupName,
          components: {
            field: props => PageTreeField({ ...props, config, mode: 'select-parent' }),
          },
        }),
      ]
    : []),
];

const getSlugSourceField = (config: PageTreeConfig, options: Options) => config.titleFieldName ?? options.slugSource;
