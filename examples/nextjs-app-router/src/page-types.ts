import type { PortableTextBlock } from '@sanity/types';

export type HomePage = {
    title: string;
    introText: string;
    link: {
      title: string;
      page: {_ref : string, _type: 'reference'};
    }
}

export type ContentPage = {
    title: string;
    content: PortableTextBlock[];
}
