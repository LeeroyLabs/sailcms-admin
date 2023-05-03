import { LocaleObject } from "types/general";

export type Email = {
    _id: string;
    name: string;
    slug: string;
    subject: LocaleObject;
    title: LocaleObject;
    content: LocaleObject;
    cta: LocaleObject;
    cta_title: LocaleObject;
    template: string;
    created_at: number;
    last_modified: number;
};