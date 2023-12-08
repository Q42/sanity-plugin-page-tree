# sanity-plugin-page-tree

> This is a **Sanity Studio v3** plugin.

## Installation

```sh
npm install sanity-plugin-page-tree
```

## Usage

### Create a page tree config
Create a shared page tree config file and constant to use in your page types and desk structure.

```ts
// pageTreeConfig.ts
import { PageTreeConfig } from 'sanity-plugin-page-tree';

export const pageTreeConfig: PageTreeConfig = {
  rootSchemaType: 'homePage',
  pageSchemaTypes: ['homePage', 'page'],
  apiVersion: '2023-12-08',
};

```

### Create a page type
The `definePageType` function can be used to wrap your page schema types with the necessary fields for the page tree.

#### Root page (e.g. home page)
Provide the `isRoot` option to the definePageType function to mark the page as a root page.

```ts
// schemas/page.ts
import { pageTreeConfig } from './pageTreeConfig';

const _contentPageType = defineType({
  name: 'homePage',
  type: 'document',
  title: 'Page',
  fields: [
    // ...
  ],
});

export const pageType = definePageType(_contentPageType, pageTreeConfig, {
  isRoot: true
});
```

#### Other pages

```ts
// schemas/page.ts
import { pageTreeConfig } from './pageTreeConfig';

const _contentPageType = defineType({
  name: 'page',
  type: 'document',
  title: 'Page',
  fields: [
    // ...
  ],
});

export const pageType = definePageType(_contentPageType, pageTreeConfig);
```

### Add page tree to desk structure
Instead of using the default document list for creating and editing pages, you can use the `createPageTreeDocumentList` function to create a custom page tree document list view and add it to your desk structure.

```ts
// deskStructure.ts
import { pageTreeConfig } from './pageTreeConfig';

export const structure = (S: StructureBuilder) =>
  S.list()
    .title('Website')
    .items([
        S.listItem()
          .title('Pages')
          .child(
            createPageTreeDocumentList(S, {
              config: pageTreeConfig,
              extendDocumentList: builder => builder.id('pages').title('Pages').apiVersion('2023-12-08'),
            }),
          )
      ]
    )
```

### Create internal page links
A link to an internal page is a reference to a page document. The `PageTreeField` component can be used to render a custom page tree input in the reference field.

```ts
const linkField = defineField({
  name: 'link',
  title: 'Link',
  type: 'reference',
  to: pageTreeConfig.pageSchemaTypes.map(type => ({ type })),
  components: {
    field: props => PageTreeField({ ...props, config: pageTreeConfig }),
  },
});

```

## License

[MIT](LICENSE) © Q42

## Develop & test

This plugin uses [@sanity/plugin-kit](https://github.com/sanity-io/plugin-kit)
with default configuration for build & watch scripts.

See [Testing a plugin in Sanity Studio](https://github.com/sanity-io/plugin-kit#testing-a-plugin-in-sanity-studio)
on how to run this plugin with hotreload in the studio.
