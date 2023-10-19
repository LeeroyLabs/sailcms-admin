import { Pagination } from "./general";

export interface SeoSettingsInput {
    separator_character: string;
    sitename: string;
    sitename_position: SitenamePosition;
    gtag: string;
}

export enum SitenamePosition {
    BEFORE = "BEFORE",
    AFTER = "AFTER",
}

export interface SeoDefaultConfigInput {
    title: string;
    description: string;
    keywords: string;
    robots: boolean;
    sitemap: boolean;
    default_image: string;
    social_metas: SocialMetaInput;
}

export interface SocialMetaInput {
    handle: string;
    content: SocialMetaContentInput[];
}

export interface SocialMetaContentInput {
    name: string;
    content: string;
}

export interface Redirection {
    url: string;
    redirect_url: string;
    redirect_type: string;
    hit_count: number;
    last_attempt: number;
}

export type BrokenLink = Omit<Redirection, "redirect_url" | "last_attempt">;

export interface BrokenLinkListing {
    pagination: Pagination;
    list: BrokenLink[];
}

export enum RedirectType {
    PERMANENT = "PERMANENT",
    TEMPORARY = "TEMPORARY",
}
