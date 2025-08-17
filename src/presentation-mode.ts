import { ClientPerspective } from 'next-sanity';
import { map, Observable } from 'rxjs';
import { DocumentStore } from 'sanity';

import { getAllPageMetadata } from './helpers/page-tree';
import { getAllRawPageMetadataQuery } from './queries';
import { PageMetadata, PageTreeConfig } from './types';

/**
 * @public
 */
export const createPageMetadataObservable = (
  documentStore: DocumentStore,
  config: PageTreeConfig,
  perspective: ClientPerspective,
): Observable<PageMetadata[]> => {
  const query = getAllRawPageMetadataQuery(config);
  const pageTreeMetadata$ = documentStore.listenQuery(query, {}, { perspective });
  const pageTreeMetadata = pageTreeMetadata$.pipe(map(data => getAllPageMetadata(config, data)));

  return pageTreeMetadata;
};
