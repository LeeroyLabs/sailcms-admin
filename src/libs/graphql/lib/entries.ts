import { Client } from "./client";
import EntryQueries from "../queries/entries";
import gql from "graphql-tag";
import { Entry } from "../types/entries";

export class Entries
{
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
}
