import { ComponentType } from "react";
import { Article } from "./article";
import { Profile } from "./profile";

interface Pages {
  frontpage: ComponentType<{
    articles: Article[];
    profile: Profile;
  }>;
  article: ComponentType<{
    article: Article;
    profile: Profile;
    pdfUrl: string;
  }>;
}

type Page<TName extends keyof Pages> = Pages[TName];

export { Pages, Page };
