import { Client } from "src/graphql/lib/client";
import EmailQueries from "../queries/emails";
import gql from "graphql-tag";
import { Email } from "../types/emails";
import { SailCMS } from "@/libs/graphql";

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
        let result = await client.query(gql`${query}`, {site_id: SailCMS.getSiteId()});

        if (result.data) {
            return result.data.emails as Email[];
        }

        return [];
    }

    /**
     *
     * get list of email templates to be used
     *
     */
    public static async emailTemplates(locales: string[] = ['fr', 'en']): Promise<string[]>
    {
        const client = new Client();
        let query = EmailQueries.emailTemplates;

        query = query.replace(/#locale#/g, Emails.parseLocales(locales));
        let result = await client.query(gql`${query}`, {site_id: SailCMS.getSiteId()});

        if (result.data) {
            return result.data.emailTemplates;
        }

        return [];
    }

    /**
     *
     * Create a new email
     *
     * @param email
     *
     */
    public static async createEmail(email: Email): Promise<boolean>
    {
        const client = new Client();
        let query = EmailQueries.createEmail;

        console.log({
            name: email.name,
            subject: email.subject,
            fields: email.fields,
            template: email.template,
            site_id: SailCMS.getSiteId(),
            preview: email.is_preview
        });

        let result = await client.mutation(gql`${query}`, {
            name: email.name,
            subject: email.subject,
            fields: email.fields,
            template: email.template,
            site_id: SailCMS.getSiteId(),
            preview: email.is_preview
        });

        if (result.data) {
            return result.data.createEmail;
        }

        return false;
    }

    /**
     *
     * Create a preview email
     *
     * @param email
     *
     */
    public static async createPreviewEmail(email: Email): Promise<string>
    {
        const client = new Client();
        let query = EmailQueries.createPreviewEmail;

        let result = await client.mutation(gql`${query}`, {
            name: email.name,
            subject: email.subject,
            fields: email.fields,
            template: email.template,
            site_id: SailCMS.getSiteId()
        });

        if (result.data) {
            return result.data.createPreviewEmail;
        }

        return '';
    }

    /**
     *
     * Update an email
     *
     * @param email
     *
     */
    public static async updateEmail(email: Email): Promise<boolean>
    {
        const client = new Client();
        let query = EmailQueries.updateEmail;

        let result = await client.mutation(gql`${query}`, {
            id: email._id,
            name: email.name,
            subject: email.subject,
            fields: email.fields,
            template: email.template
        });

        if (result.data) {
            return result.data.updateEmail;
        }

        return false;
    }

    /**
     *
     * Delete a list of emails
     *
     * @param emails
     *
     */
    public static async deleteEmails(emails: string[]): Promise<boolean>
    {
        const client = new Client();
        let query = EmailQueries.deleteEmails;

        let result = await client.mutation(gql`${query}`, {ids: emails, site_id: SailCMS.getSiteId()});

        if (result.data) {
            return result.data.deleteEmails;
        }

        return false;
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
