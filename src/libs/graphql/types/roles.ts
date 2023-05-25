import { LocaleObject } from "./general";

export type Role = {
    _id: string;
    name: string;
    description: string;
    slug: string;
    level: number;
    permissions: string[];
}

export type RoleConfig = {
    role: Role;
    allowedPermissions: ACL[];
    permissions: ACL[];
}

export type ACL = {
    category: string;
    value: string;
}

export type Permission = {
    name: string;
    group: string;
    category: string;
    description: LocaleObject;
}
