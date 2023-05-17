import { LocaleObject, Pagination } from "./general";
import { User } from "./users";

export type Asset = {
    filename: string;
    site_id: string;
    name: string;
    title: LocaleObject;
    folder: string;
    url: string;
    filesize: number;
    size: Size;
    is_image: boolean;
    uploader: User;
    created_at: number;
    transforms: Transform[];
};

export type Folder = {
    slug: string;
    name: string;
    deletable: boolean;
}

export type AssetListing = {
    pagination: Pagination;
    list: Asset[];
}

export type Size = {
    width: number;
    height: number;
};

export type Transform = {
    transform: string;
    filename: string;
    name: string;
    url: string;
};

export type AssetsOptions = {
    page: number;
    limit: number;
    folder?: string;
    search?: string;
    sort?: string;
    direction?: string;
}

export type AssetConfig = {
    maxSize: number;
    blacklist: string[];
}
