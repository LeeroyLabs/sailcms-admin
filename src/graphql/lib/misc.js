import { Client } from "@graphql/lib/client";
import MiscQueries from "../queries/misc";
import gql from "graphql-tag";

export class Misc
{
    /**
     *
     * Get Registered extensions for display in the admin panel
     *
     */
    static async registeredExtensions()
    {
        const client = new Client();
        let query = MiscQueries.registeredExtensions;
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.registeredExtensions;
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
    static async testEmail(email)
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
    static async navigationElements(locales = ['fr', 'en'])
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
    static async settingsElements(locales = ['fr', 'en'])
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
    static async handshakeKey()
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
    static async runExtensionQuery(id, query, variables, locales = ['en', 'fr'])
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
     *
     */
    static async runExtensionMutation(id, query, variables)
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
    static async availableTemplates(forSelect = false)
    {
        const client = new Client();
        let query = MiscQueries.availableTemplates;

        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            if (forSelect) {
                return result.data.availableTemplates.map((t) =>
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
    static async getSailLogs(page = 1, dateSearch = 0)
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
            return result.data.getSailLogs;
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
    static async getPHPLogs()
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
    static async getLiveMonitoringSample()
    {
        const client = new Client();
        let query = MiscQueries.monitoringSample;

        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.monitoringSample;
        }

        return null;
    }

    /**
     *
     * Get a ranged sample
     *
     * @param start
     * @param end
     *
     */
    static async getRangeSample(start, end)
    {
        const client = new Client();
        let query = MiscQueries.getRangeSample;

        let result = await client.query(gql`${query}`, {start: start, end: end});

        if (result.data) {
            return result.data.getRangeSample;
        }

        return [];
    }

    /**
     *
     * Add a bookmark
     *
     * @param id
     * @param url
     * @param name
     *
     */
    static async addBookmark(id, url, name)
    {
        const client = new Client();
        let query = MiscQueries.addBookmark;

        let result = await client.mutation(gql`${query}`, { user_id: id, url: url, name: name });

        if (result.data) {
            return result.data.addBookmark;
        }

        return false;
    }

    static async removeBookmark(id, url)
    {
        const client = new Client();
        let query = MiscQueries.removeBookmark;

        let result = await client.mutation(gql`${query}`, { user_id: id, url: url });

        if (result.data) {
            return result.data.removeBookmark;
        }

        return false;
    }

    static parseLocales(locales)
    {
        let out = ``;

        for (let locale of locales) {
            out += `${locale}\n`;
        }

        return out;
    }
}
