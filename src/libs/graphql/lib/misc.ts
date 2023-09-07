import { LogListing, MonitoringSample, NavigationElement, RegisteredExtensions, SettingsElements, Template } from "../types/misc";
import { Client } from "./client";
import MiscQueries from "../queries/misc";
import gql from "graphql-tag";
import { SailCMS } from "@/libs/graphql";

export class Misc
{
    /**
     *
     * Get Registered extensions for display in the admin panel
     *
     */
    public static async registeredExtensions(): Promise<RegisteredExtensions>
    {
        const client = new Client();
        let query = MiscQueries.registeredExtensions;
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.registeredExtensions as RegisteredExtensions;
        }

        return {
            modules: [],
            containers: []
        }
    }

    /**
     *
     * Test email configurations with a test email
     *
     * @param email
     *
     */
    public static async testEmail(email: string): Promise<boolean>
    {
        const client = new Client();
        let query = MiscQueries.testEmail;
        let result = await client.mutation(gql`${query}`, {email: email});

        if (result.data) {
            return result.data.testEmail;
        }

        return false;
    }

    /**
     *
     * Fetch dynamic navigation elements from extensions
     *
     * @params locales
     *
     */
    public static async navigationElements(locales: string[] = ['fr', 'en']): Promise<NavigationElement[]>
    {
        const client = new Client();
        let query = MiscQueries.navigationElements;

        query = query.replace(/#locale#/g, Misc.parseLocales(locales));
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.navigationElements;
        }

        return [];
    }

    /**
     *
     * Fetch dynamic navigation elements for Settings from extensions
     *
     * @params locales
     *
     */
    public static async settingsElements(locales: string[] = ['fr', 'en']): Promise<SettingsElements>
    {
        const client = new Client();
        let query = MiscQueries.settingsElements;

        query = query.replace(/#locale#/g, Misc.parseLocales(locales));
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.settingsElements;
        }

        return {entries: [], emails: [], others: []};
    }

    /**
     *
     * Get the extension security handshake key
     *
     */
    public static async handshakeKey(): Promise<string>
    {
        const client = new Client();
        let query = MiscQueries.handshakeKey;

        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.handshakeKey;
        }

        return '';
    }

    /**
     *
     * Run an extension's query
     *
     * @param id
     * @param query
     * @param variables
     * @param locales
     *
     */
    public static async runExtensionQuery(id: string, query: string, variables: object, locales: ['en', 'fr']): Promise<any>
    {
        const client = new Client();

        query = query.replace(/#locale#/g, Misc.parseLocales(locales));
        let result = await client.query(gql`${query}`, variables);

        if (result.data) {
            return result.data[id];
        }

        if (result.error) {
            return result.error;
        }

        return null;
    }

    /**
     *
     * Run an extension's query
     *
     * @param id
     * @param query
     * @param variables
     * @param locales
     *
     */
    public static async runExtensionMutation(id: string, query: string, variables: object, locales: ['en', 'fr']): Promise<any>
    {
        const client = new Client();
        let result = await client.mutation(gql`${query}`, variables);

        if (result.data) {
            return result.data[id];
        }

        if (result.error) {
            return result.error;
        }

        return null;
    }

    /**
     *
     * Load available templates for an entry
     *
     * @param forSelect
     *
     */
    public static async availableTemplates(forSelect: boolean = false): Promise<any[] | Template[]>
    {
        const client = new Client();
        let query = MiscQueries.availableTemplates;

        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            if (forSelect) {
                return result.data.availableTemplates.map((t: Template) =>
                {
                    return {value: t.filename, title: t.name};
                });
            }

            return result.data.availableTemplates;
        }

        return [];
    }

    /**
     *
     * Get Sail Logs
     *
     * @param page
     * @param dateSearch
     *
     */
    public static async getSailLogs(page: number = 1, dateSearch: number = 0): Promise<LogListing>
    {
        const client = new Client();
        let query = MiscQueries.getSailLogs;

        let variables = {page: page, limit: 50, date_search: null};

        if (dateSearch >= 0) {
            // @ts-ignore
            variables.date_search = dateSearch;
        }

        let result = await client.query(gql`${query}`, variables);

        if (result.data) {
            return result.data.getSailLogs as LogListing;
        }

        return {
            pagination: {
                current: page,
                totalPages: 1,
                total: 0
            },
            list: []
        }
    }

    /**
     *
     * Get latest php logs (every found in error.log latest first)
     *
     */
    public static async getPHPLogs(): Promise<string>
    {
        const client = new Client();
        let query = MiscQueries.getPHPLogs;

        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.getPHPLogs.replace(/\n/g, '<br/>');
        }

        return '';
    }

    /**
     *
     * Get a live sample of the server's health
     *
     */
    public static async getLiveMonitoringSample(): Promise<MonitoringSample|null>
    {
        const client = new Client();
        let query = MiscQueries.monitoringSample;

        let result = await client.query(gql`${query}`, {});

        console.log(result.data);

        if (result.data) {
            return result.data.monitoringSample as MonitoringSample;
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
