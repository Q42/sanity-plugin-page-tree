import { compact, get } from 'lodash';
import { defineField, defineType, DocumentDefinition } from 'sanity';

import { PageTreeField } from '../components/PageTreeField';
import { SlugField } from '../components/SlugField';
import { PageTreeConfig, GlobalOptions } from '../types';
import { slugValidator } from '../validators/slug-validator';

import { allowedParentValidator } from '../validators/parent-validator';

type Options = GlobalOptions & {
  isRoot?: boolean;
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
  options = {...config.globalOptions, ...options};
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
          components: {
            input: props => SlugField({ ...props, config }),
          },
          validation: Rule => [
            Rule.required().custom(slugValidator(config)),
            ...toArray(options.slugValidationRules?.(Rule))
          ],
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
          to: getPossibleParentsFromConfig(config, ownType).map(type => ({ type })),
          validation: Rule => Rule.required().custom(allowedParentValidator(config, ownType.name)),
          group: options.fieldsGroupName,
          components: {
            field: props => PageTreeField({ ...props, config, mode: 'select-parent' }),
          },
        }),
      ]
    : []),
];

const getSlugSourceField = (config: PageTreeConfig, options: Options) => config.titleFieldName ?? options.slugSource;
const toArray = <T>(t: undefined | T | T[]) => t === undefined ? [] : Array.isArray(t) ? t : [t];
