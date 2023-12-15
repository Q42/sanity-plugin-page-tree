import { HomePage as HomePageType } from "@/page-types";
import PageLink from "@/components/PageLink";

export type HomePageProps = {
  page: HomePageType;
}

export const HomePage = ({ page }: HomePageProps) => {
  return (
    <div>
      <h1>{page.title}</h1>
      <p>{page.introText}</p>
      <PageLink link={page.link.page}>
        {page.link.title}
      </PageLink>
    </div>
  );
}
