import { LocaleObject, Pagination } from "./general";

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

export type NavigationConfiguration = {
    [key: string]: boolean
}

export type Template = {
    name: string;
    filename: string;
}

export type LogListing = {
    pagination: Pagination;
    list: Log[];
}

export type Log = {
    _id: string;
    message: string;
    date: number;
}

export type MonitoringSample = {
    warning: boolean;
    timestamp: number;
    php_tested: boolean;
    ram: RamSample;
    disk: DiskSample;
    cpu: CpuSample;
    php: PHPVersion;
    boot: BootSample;
}

export type RamSample = {
    total: number;
    available: number;
    used: number;
    percent: number;
}

export type DiskSample = {
    total: number;
    available: number;
    used: number;
    percent: number;
}

export type CpuSample = {
    cores: number;
    percent: number;
}

export type BootSample = {
    boot_time: number;
    uptime: string;
}

export type PHPVersion = {
    installed: string;
    current: string;
    latest: boolean;
    secure: boolean;
    supported: boolean;
}
