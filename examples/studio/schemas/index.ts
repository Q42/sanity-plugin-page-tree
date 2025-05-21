import { ObjectRule, defineArrayMember, defineField, defineType } from 'sanity';
import { PageTreeField, PageTreeInput, definePageType } from '@q42/sanity-plugin-page-tree';
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
      name: 'links',
      title: 'Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'reference',
          to: [{ type: 'contentPage' }, { type: 'homePage' }],
          components: {
            input: props => PageTreeInput({ ...props, config: pageTreeConfig }),
          },
        }),
      ],
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'Title',
          type: 'string',
        }),
        defineField({
          name: 'page',
          title: 'Page',
          type: 'reference',
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
