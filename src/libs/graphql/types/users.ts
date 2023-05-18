import { Pagination, LocaleObject } from "./general";

export type User = {
    _id: string;
    name: LocaleObject;
    email: string;
    roles: string[];
    status: boolean;
    avatar: string;
    permissions: string[];
    meta: UserMeta;
    auth_token: string;
    created_at: number;
    validated: boolean;
    locale: string;
    highest_level: number;
}

export type UserData = {
    name: UserNameInput;
    email: string;
    password: string;
    roles: string[];
    group: string;
    avatar: string;
    locale?: string;
}

export type UserNameInput = {
    first: string;
    last: string;
}

export type UserListing = {
    pagination: Pagination;
    list: User[];
}

export type UserMeta = {
    flags: Flags;
    [key: string]: any;
}

export type Flags = {
    [key: string] : boolean;
}

export type UserListArguments = {
    page: number;
    limit: number;
    search?: string;
    sorting?: UserSort;
    type?: UserType;
    meta?: MetaSearch;
    status?: boolean;
    validated?: boolean;
}

export type UserSort = {
    sort: string;
    order: string;
}

export type UserType = {
    type: string;
    except: boolean;
}

export type MetaSearch = {
    key: string;
    value: string;
}

export type LoginResult = {
    user_id: string;
    message: string;
}

export type PasswordChangeResult = {
    password_check: boolean;
    code_check: boolean;
}
