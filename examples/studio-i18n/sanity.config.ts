import { defineConfig } from 'sanity';
import { deskTool } from 'sanity/desk';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './schemas';
import { createPageTreeDocumentList } from 'sanity-plugin-page-tree';
import { pageTreeConfig } from './page-tree-config';
import { documentInternationalization } from '@sanity/document-internationalization';

export default defineConfig({
  name: 'default',
  title: 'Sanity plugin page tree',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID as string,
  dataset: 'production',
  plugins: [
    deskTool({
      structure: S =>
        S.list()
          .title('Website')
          .items([
            S.listItem()
              .title('Pages')
              .child(
                createPageTreeDocumentList(S, {
                  config: pageTreeConfig,
                  extendDocumentList: builder =>
                    builder.id('pages').title('Pages').apiVersion(pageTreeConfig.apiVersion),
                }),
              ),
          ]),
    }),
    visionTool(),
    documentInternationalization({
      supportedLanguages: [
        { id: 'en', title: 'English' },
        { id: 'nl', title: 'Dutch' },
      ],
      schemaTypes: schemaTypes.map(type => type.name),
    }),
  ],
  schema: {
    types: schemaTypes,
  },
});
