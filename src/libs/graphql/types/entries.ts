import { LocaleObject } from "./general";
import { entry } from "@/components/entries/entry/entry";
import { SailCMS } from "@/libs/graphql";

export type Entry = {
    _id: string;
    entry_type_id: string;
    parent?: Parent;
    site_id: string;
    locale: string;
    alternates: Alternate[];
    is_homepage: boolean;
    status: string;
    title: string;
    template: string;
    slug?: string;
    url: string;
    authors: Authors;
    dates: Dates;
    categories: string[];
    content: ModelFieldContent[];
    schema: LayoutField[];
    seo?: EntrySeo;
};

export type EntryStructure = {
    entry_type_handle: string;
    locale: string;
    is_homepage: boolean;
    title: string;
    template: string;
    slug: string;
    categories: string[];
    content: any,
    parent: string,
    site_id: string;
    alternates?: any;
    seo: any;
}

export type EntryType = {
    _id: string;
    title: string;
    handle: string;
    url_prefix: JsonObject;
    entry_layout_id: string;
    use_categories: string;
}

export type Parent = {
    handle: string;
    parent_id: string;
};

export type Alternate = {
    locale: string;
    entry_id: string;
};

export type Authors = {
    created_by: string;
    updated_by: string;
    published_by: string;
    deleted_by: string;
};

export type Dates = {
    created: number;
    updated: number;
    published: number;
    deleted: number;
};

export type ModelFieldContent = {
    key: string;
    content: JsonObject;
    handle: string;
    type: JsonObject;
};

export type JsonObject = {
    [key: string]: any;
};

export type LayoutField = {
    key: string;
    fieldConfigs: FieldConfig[];
};

export type FieldConfig = {
    labels: LocaleObject;
    handle: string;
    inputSettings: InputSetting[];
};

export type InputSetting = {
    inputKey: string;
    settings: Setting[];
};

export type Setting = {
    name: string;
    value: string;
    choices: string[];
    type: string;
};

export type EntrySeo = {
    entry_seo_id: string;
    title: string;
    alternates: Alternate[];
    url: string;
    locale: string;
    description: string;
    keywords: string;
    robots: boolean;
    sitemap: boolean;
    default_image: string;
    social_metas: SocialMeta[];
};

export type SocialMeta = {
    handle: string;
    content: SocialMetaContent[];
};

export type SocialMetaContent = {
    name: string;
    content: string;
};

export type EntryLayout = {
    _id: string;
    slug?: string;
    title: string;
    schema: EntryLayoutTab[];
    authors: Authors;
    dates: Dates;
    is_trashed: boolean;
};

export type EntryLayoutTab = {
    label: string;
    fields: Field[];
};

export type FieldInfo = {
    name: string;
    fullname: string;
    handle: string;
    description: string;
    storingType: string;
    searchable: boolean;
    inputs: FieldInputInfo[];
};

export type FieldInputInfo = {
    name: string;
    fullname: string;
    type: string;
    inputKey: string;
    availableSettings: SettingInfo[];
};

export type SettingInfo = {
    name: string;
    value: string;
    options: Option[];
    type: string;
};

export type Option = {
    value: string;
    label: string;
};

export type Field = {
    _id?: string;
    name: string;
    key?: string,
    label: LocaleObject,
    placeholder: LocaleObject,
    explain: LocaleObject,
    repeatable: boolean,
    validation: string,
    required: boolean,
    type: string,
    config: object;
};

export type EntryListing = {
    pagination: {
        current: number;
        totalPages: number;
        total: number;
    },
    list: any[]
}
