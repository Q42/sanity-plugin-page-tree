import { PortableText } from "@portabletext/react";
import { ContentPage as ContentPageType } from "@/page-types";

type ContentPageProps = {
  page: ContentPageType;
}

export const ContentPage = ({ page }: ContentPageProps) => {
  return (
    <div>
      <h1>{page.title}</h1>
      <PortableText value={page.content} />
    </div>
  );
}
