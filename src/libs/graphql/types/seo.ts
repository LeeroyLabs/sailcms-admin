export interface SeoSettingsInput {
    separator_character: string;
    sitename: string;
    sitename_position: SitenamePosition;
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
