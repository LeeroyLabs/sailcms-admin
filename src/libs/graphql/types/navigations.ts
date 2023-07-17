export interface NavigationItem {
    label: string;
    url: string;
    is_entry: boolean;
    is_category: boolean;
    entry_id: string;
    external: boolean;
    children: NavigationItem[];
    _id?: string;
    parent_id?: string;
    order?: number;
}

export interface SortedNavigationItem {
    id: string;
    order: number;
    parent_id: string;
}

export interface NavigationDetails {
    _id: string;
    title: string;
    name: string;
    structure: NavigationItem[];
    locale: string;
}

export interface CreateNavigation {
    name: string;
    structure: NavigationItem[];
    locale: string;
    site_id: string;
}

export interface UpdateNavigation {
    id: string;
    name: string;
    structure: NavigationItem[];
    locale: string;
    site_id?: string;
}
