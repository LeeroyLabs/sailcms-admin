import { LocaleObject } from "./general";

export type RegisteredExtensions = {
    modules: Module[];
    containers: Container[];
};

export type Container = {
    name: string;
    info: ContainerInfo;
    class: string;
    middlewares: Middleware[];
    graphql: GraphQLInfo[];
    routes: Routes;
};

export type Module = {
    name: string;
    info: ModuleInfo;
    class: string;
    middlewares: Middleware[];
};

export type ContainerInfo = {
    name: string;
    description: string;
    version: number;
    semver: string;
    author: string;
    link: string;
};

export type ModuleInfo = {
    name: string;
    description: string;
    version: number;
    semver: string;
    author: string;
    link: string;
};

export type Middleware = {
    type: string;
    name: string;
};

export type GraphQLInfo = {
    operation: string;
    handler: string;
    method: string;
};

export type Routes = {
    post: string[];
    get: string[];
    put: string[];
    delete: string[];
    redirect: string[];
};

export type NavigationElement = {
    icon: string;
    url: string;
    label: LocaleObject;
    parent: string;
    permission: string;
};

export type SettingsElements = {
    entries: SettingsElement[];
    emails: SettingsElement[];
    others: SettingsElement[];
}

export type SettingsElement = {
    icon: string;
    url: string;
    label: LocaleObject;
    permission: string;
};
