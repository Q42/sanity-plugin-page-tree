import { DocumentDefinition, defineField, defineType, SlugOptions } from 'sanity';
import { PageTreeField } from '../components/PageTreeField';
import { PageTreeConfig } from '../types';
import { slugValidator } from '../validators/slug-validator';
import { SlugField } from '../components/SlugField';
import { allowedParentValidator } from '../validators/parent-validator';

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
) =>
  defineType({
    ...type,
    title: type.title,
    fields: [...basePageFields(config, options, type), ...type.fields],
  });

const basePageFields = (config: PageTreeConfig, options: Options, ownType: DocumentDefinition) => [
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
