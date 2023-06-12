export interface NavigationItem {
    label: string;
    url: string;
    is_entry: boolean;
    is_category: boolean;
    entry_id: string;
    external: boolean;
    children: NavigationItem[];
    id?: string;
    parent_id?: string;
}

export interface SortedNavigationItem {
    id: string;
    order: number;
    parent: string;
}

export interface NavigationDetails {
    _id: string;
    title: string;
    name: string;
    structure: NavigationItem[];
    locale: string;
}

export interface createNavigation {
    name: string;
    structure: NavigationItem[];
    locale: string;
    site_id: string;
}

export interface updateNavigation {
    id: string;
    name: string;
    structure: NavigationItem[];
    locale: string;
    site_id?: string;
}
