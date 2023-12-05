import { LocaleObject } from "./general";

export type Email = {
    _id: string;
    name: string;
    slug: string;
    subject: LocaleObject;
    fields: EmailField[];
    template: string;
    created_at: number;
    last_modified: number;
    site_id: string;
    is_preview: boolean;
};

export type EmailField = {
    key: string;
    value: LocaleObject;
};
