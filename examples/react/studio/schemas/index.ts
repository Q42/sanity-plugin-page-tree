import { ObjectRule, defineArrayMember, defineField, defineType } from 'sanity';
import { PageTreeField, definePageType } from 'sanity-plugin-page-tree';
import { pageTreeConfig } from '../page-tree.config';

const _homePageType = defineType({
  name: 'homePage',
  type: 'document',
  title: 'Homepage',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'introText',
      title: 'Intro text',
      type: 'text',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'object',
      validation: (Rule: ObjectRule) => Rule.required(),
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
          validation: Rule => Rule.required(),
        }),
        defineField({
          name: 'page',
          title: 'Page',
          type: 'reference',
          validation: Rule => Rule.required(),
          to: [{ type: 'contentPage' }, { type: 'homePage' }],
          components: {
            field: props => PageTreeField({ ...props, config: pageTreeConfig }),
          },
        }),
      ],
    }),
  ],
});

const homePageType = definePageType(_homePageType, pageTreeConfig, { isRoot: true });

const _contentPageType = defineType({
  name: 'contentPage',
  type: 'document',
  title: 'Content page',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [defineArrayMember({ type: 'block' })],
    }),
  ],
});

const contentPageType = definePageType(_contentPageType, pageTreeConfig);

export const schemaTypes = [homePageType, contentPageType];
