import { Client } from "./client";
import EmailQueries from "../queries/emails";
import gql from "graphql-tag";
import { Email } from "../types/emails";

export class Emails
{
    /**
     *
     * Get a specific email
     *
     * @param id
     * @param locales
     *
     */
    public static async email(id: string, locales: string[] = ['fr', 'en']): Promise<Email|null>
    {
        const client = new Client();
        let query = EmailQueries.email;

        query = query.replace(/#locale#/g, Emails.parseLocales(locales));
        let result = await client.query(gql`${query}`, {id: id});

        if (result.data) {
            return result.data.email as Email;
        }

        return null;
    }

    /**
     *
     * Get all system emails
     *
     * @param locales
     *
     */
    public static async emails(locales: string[] = ['fr', 'en']): Promise<Email[]>
    {
        const client = new Client();
        let query = EmailQueries.emails;

        query = query.replace(/#locale#/g, Emails.parseLocales(locales));
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.emails as Email[];
        }

        return [];
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
