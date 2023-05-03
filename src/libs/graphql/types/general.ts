export type GraphQLOutput = {
    data: GraphObject|null;
    error: string|null;
}

export type GraphObject = {
    [key: string]: any;
}

export type GraphQLHeaders = {
    [key: string]: string;
}

export type Pagination = {
    current: number;
    totalPages: number;
    total: number;
}

export type LocaleObject = {
    [key: string]: string;
}