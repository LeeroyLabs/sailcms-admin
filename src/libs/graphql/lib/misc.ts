import { NavigationElement, RegisteredExtensions, SettingsElements } from "../types/misc";
import { Client } from "./client";
import MiscQueries from "../queries/misc";
import gql from "graphql-tag";
import { SailCMS } from "@/libs/graphql";

// TODO
// _.mapKeys(obj, (v, k) => _.camelCase(k))

// TODO
// Fragments with aspect (basic, public, full)

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

    private static parseLocales(locales: string[]): string
    {
        let out = ``;

        for (let locale of locales) {
            out += `${locale}\n`;
        }

        return out;
    }
}
