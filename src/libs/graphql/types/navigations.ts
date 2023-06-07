export interface NavigationItem {
    label: string;
    url: string;
    is_entry: boolean;
    entry_id: string;
    external: boolean;
    children: NavigationItem[];
}

export interface NavigationDetails {
    _id: string;
    title: string;
    name: String;
    structure: NavigationItem[];
    locale: string;
}

export interface createNavigation {
    name: string;
    structure: NavigationItem[];
    locale: string;
    site_id: string;
}
