import { DocumentDefinition, defineField, defineType } from 'sanity';

import { PageTreeField } from '../components/PageTreeField';
import { PageTreeConfig } from '../types';
import { slugValidator } from '../validators/slug-validator';

type Options = {
  isRoot?: boolean;
  fieldsGroupName?: string;
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
  defineField({
    name: 'title',
    title: 'Title',
    type: 'string',
    group: options.fieldsGroupName,
  }),
  ...(!options.isRoot
    ? [
        defineField({
          name: 'slug',
          title: 'Slug',
          type: 'slug',
          options: {
            source: 'title',
            isUnique: () => true,
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
          title: 'Parent',
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
