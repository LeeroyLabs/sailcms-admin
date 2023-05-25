export interface Category {
    _id: string;
    name: {
        en: string;
        fr: string;
    };
    order: number;
    parent_id: string;
    slug: string;
    children: Category[];
}
