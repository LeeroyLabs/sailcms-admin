import { Client } from "./client";
import EntryQueries from "../queries/entries";
import gql from "graphql-tag";
import { Entry, EntryLayout, EntryType, FieldInfo } from "../types/entries";
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
            url_prefix: prefixes
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
            url_prefix: prefixes
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
     *
     */
    public static async entryLayouts(locales: string[] = ['fr', 'en']): Promise<EntryLayout[]>
    {
        const client = new Client();
        let query = EntryQueries.entryLayouts;

        query = query.replace(/#locale#/g, Entries.parseLocales(locales));
        let result = await client.query(gql`${query}`, {});

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
     * @param titles
     * @param schema
     * @param slug
     *
     */
    public static async createEntryLayout(titles: LocaleObject, schema: any, slug: string): Promise<boolean>
    {
        const client = new Client();
        let query = EntryQueries.createEntryLayout;

        let result = await client.mutation(gql`${query}`, {
            titles: titles,
            schema: schema,
            slug: slug
        });

        if (result.data && result.data.createEntryLayout !== null) return true;
        return false;
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
            return result.data.entryLayout;
        }

        return null;
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
