import { Client } from "./client";
import EntryQueries from "../queries/entries";
import gql from "graphql-tag";
import { Entry, EntryLayout, EntryListing, EntryType, Field, FieldInfo } from "../types/entries";
import { LocaleObject } from "@/libs/graphql/types/general";

export class Entries
{
    /**
     *
     * Fetch all entry types
     *
     */
    public static async entryTypes(locales: string[] = ['fr', 'en']): Promise<EntryType[]>
    {
        const client = new Client();
        let query = EntryQueries.entryTypes;

        query = query.replace('#locale#', Entries.parseLocales(locales));
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.entryTypes;
        }

        return [];
    }

    /**
     *
     * Fetch a single entry type
     *
     * @param handle
     * @param locales
     *
     */
    public static async entryType(handle: string, locales: string[] = ['fr', 'en']): Promise<EntryType|null>
    {
        const client = new Client();
        let query = EntryQueries.entryType;

        query = query.replace('#locale#', Entries.parseLocales(locales));
        let result = await client.query(gql`${query}`, {handle: handle});

        if (result.data) {
            return result.data.entryType;
        }

        return null;
    }

    /**
     *
     * Create an entry type
     *
     * @param type
     *
     */
    public static async createEntryType(type: EntryType): Promise<string>
    {
        const client = new Client();
        let query = EntryQueries.createEntryType;

        let prefixes = {} as LocaleObject;

        // @ts-ignore
        for (let locale of type.url_prefix) {
            prefixes[locale.locale] = locale.data;
        }

        let result = await client.mutation(gql`${query}`, {
            handle: type.handle,
            title: type.title,
            url_prefix: prefixes,
            entry_layout_id: type.entry_layout_id,
            use_categories: type.use_categories
        });

        if (result.detailed) {
            let code = parseInt(result.detailed.graphQLErrors[0].extensions.debugMessage.substring(0, 4));

            switch (code)
            {
                case 4002:
                default:
                    return 'already_exists';

                case 4003:
                    return 'reserved_keyword';
            }
        }

        if (result.data && result.data.createEntryType) {
            return 'ok';
        }

        return 'unknown_error';
    }

    /**
     *
     * Update a entry type
     *
     * @param type
     *
     */
    public static async updateEntryType(type: EntryType): Promise<string>
    {
        const client = new Client();
        let query = EntryQueries.updateEntryType;

        let prefixes = {} as LocaleObject;

        // @ts-ignore
        for (let locale of type.url_prefix) {
            prefixes[locale.locale] = locale.data;
        }

        let result = await client.mutation(gql`${query}`, {
            handle: type.handle,
            title: type.title,
            url_prefix: prefixes,
            entry_layout_id: type.entry_layout_id,
            use_categories: type.use_categories
        });

        if (result.detailed) {
            let code = parseInt(result.detailed.graphQLErrors[0].extensions.debugMessage.substring(0, 4));

            switch (code)
            {
                case 4008:
                default:
                    return 'cannot_change_default';
            }
        }

        if (result.data && result.data.updateEntryType) {
            return 'ok';
        }

        return 'unknown_error';
    }

    /**
     *
     * Delete an entry type
     *
     * @param id
     *
     */
    public static async deleteEntryType(id: string): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.deleteEntryType;

        let result = await client.query(gql`${query}`, {id: id});

        if (result.data) {
            return result.data.deleteEntryType;
        }

        return false;
    }

    /**
     *
     * Get all entry layouts
     *
     * @param locales
     * @param hideTrashed
     *
     */
    public static async entryLayouts(locales: string[] = ['fr', 'en'], hideTrashed: boolean): Promise<EntryLayout[]>
    {
        const client = new Client();
        let query = EntryQueries.entryLayouts;

        query = query.replace(/#locale#/g, Entries.parseLocales(locales));
        let result = await client.query(gql`${query}`, {ignoreTrashed: hideTrashed});

        if (result.data) {
            return result.data.entryLayouts;
        }

        return [];
    }

    /**
     *
     * Get all available fields for the UI
     *
     * @param locales
     *
     */
    public static async fields(locales: string[] = ['fr', 'en']): Promise<FieldInfo[]>
    {
        const client = new Client();
        let query = EntryQueries.fields;

        query = query.replace(/#locale#/g, Entries.parseLocales(locales));
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.entryFields;
        }

        return [];
    }

    /**
     *
     * Get homepage entry
     *
     * @param locale
     * @param siteId
     */
    public static async homepageEntry(locale: string, siteId: string): Promise<Entry|null>
    {
        return null;
    }

    /**
     *
     * Alias of homepageEntry
     *
     * @param locale
     * @param siteId
     */
    public static async homepage(locale: string, siteId: string): Promise<Entry|null>
    {
        return Entries.homepageEntry(locale, siteId);
    }

    /**
     *
     * Create an entry layout
     *
     * @param title
     * @param schema
     * @param slug
     *
     */
    public static async createEntryLayout(title: string, schema: any, slug: string): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.createEntryLayout;

        let result = await client.mutation(gql`${query}`, {
            title: title,
            schema: schema,
            slug: slug
        });

        return !!(result.data && result.data.createEntryLayout !== null);
    }

    /**
     *
     * Update an entry layout
     *
     * @param id
     * @param title
     * @param schema
     * @param slug
     *
     */
    public static async updateEntryLayout(id: string, title: string, schema: any, slug: string): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.updateEntryLayout;

        let result = await client.mutation(gql`${query}`, {
            id: id,
            title: title,
            schema: schema,
            slug: slug
        });

        return !!(result.data && result.data.updateEntryLayout !== null)
    }

    /**
     *
     * Get entry layout with id
     *
     * @param id
     * @param locales
     *
     */
    public static async entryLayout(id: string, locales: string[] = ['fr', 'en']): Promise<EntryLayout|null>
    {
        const client = new Client();
        let query = EntryQueries.entryLayout;

        query = query.replace(/#locale#/g, Entries.parseLocales(locales));
        let result = await client.query(gql`${query}`, {id: id});

        if (result.data) {
            return result.data.entryLayoutById;
        }

        return null;
    }

    /**
     *
     * Validate that key name is available for the field
     *
     * @param key
     *
     */
    public static async entryFieldValidateKey(key: string): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.entryFieldValidateKey;

        let result = await client.query(gql`${query}`, {key: key});

        if (result.data) {
            return result.data.entryFieldValidateKey;
        }

        return false;
    }

    /**
     *
     * Create a field
     *
     * @param field
     */
    public static async createEntryField(field: Field): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.createEntryField;

        delete field._id;

        let result = await client.mutation(gql`${query}`, field);

        return !!(result.data && result.data.createEntryField !== null);
    }

    /**
     *
     * Update a field
     *
     * @param field
     *
     */
    public static async updateEntryField(field: Field): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.updateEntryField;

        delete field.key;

        let result = await client.mutation(gql`${query}`, field);

        return !!(result.data && result.data.updateEntryField !== null);
    }

    /**
     *
     * Delete selected entry fields
     *
     * @param ids
     *
     */
    public static async deleteEntryFields(ids: string[]): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.deleteEntryFields;

        let result = await client.mutation(gql`${query}`, {ids});
        return !!(result.data && result.data.deleteEntryFields !== null);
    }

    /**
     *
     * Get a field by its key
     *
     * @param key
     * @param locales
     *
     */
    public static async entryField(key: string, locales: string[] = ['fr', 'en']): Promise<Field|null>
    {
        const client = new Client();
        let query = EntryQueries.entryField;

        query = query.replace(/#locale#/g, Entries.parseLocales(locales));
        let result = await client.query(gql`${query}`, {key: key});

        if (result.data) {
            return result.data.entryField;
        }

        return null;
    }

    /**
     *
     * Delete given entry layouts
     *
     * @param ids
     * @param soft
     *
     */
    public static async deleteEntryLayouts(ids: string[], soft: boolean): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.deleteEntryLayouts;

        let result = await client.mutation(gql`${query}`, {ids, soft});
        return !!(result.data && result.data.deleteEntryLayouts !== null);
    }

    /**
     *
     * Restore layouts from the trash
     *
     * @param ids
     *
     */
    public static async restoreEntryLayouts(ids: string[]): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.restoreEntryLayouts;

        let result = await client.mutation(gql`${query}`, {ids});
        return !!(result.data && result.data.restoreEntryLayouts !== null);
    }

    /**
     *
     * Entries
     *
     * @param type
     * @param page
     * @param search
     * @param direction
     * @param locales
     * @param ignoreTrash
     *
     */
    public static async entries(type: string, page: number, search: string = '', direction: number = 1, locales: string[] = ['fr', 'en'], trash: boolean, locale: string): Promise<EntryListing>
    {
        const client = new Client();
        let query = EntryQueries.entries;

        query = query.replace(/#locale#/g, Entries.parseLocales(locales));
        let result = await client.query(gql`${query}`, {
            entry_type_handle: type,
            page: page,
            limit: 30,
            search: search,
            sort: 'title',
            direction: direction,
            only_trash: trash,
            locale: locale
        });

        if (result.data) {
            return result.data.entries;
        }

        return {
            pagination: {
                current: 1,
                totalPages: 1,
                total: 0
            },
            list: []
        };
    }

    private static parseLocales(locales: string[]): string
    {
        let out = ``;

        for (let locale of locales) {
            out += `${locale}\n`;
        }

        return out;
    }
}
