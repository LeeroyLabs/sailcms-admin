import { Client } from "./client";
import SeoQueries from "../queries/seo";
import type {
    SeoSettingsInput,
    BrokenLinkListing,
    Redirection,
    RedirectType,
} from "../types/seo";
import { SortingOrder } from "@/libs/graphql/types/general";
import gql from "graphql-tag";

export class Seo {
    /**
     *
     * getSeoSettings
     *
     *
     */
    public static async getSeoSettings(): Promise<SeoSettingsInput | null> {
        const client = new Client();
        const query = SeoQueries.getSeoSettings;

        const result = await client.query(
            gql`
                ${query},
            `,
            {},
            false
        );

        if (result.data) {
            return result.data.getSeoSettings;
        }

        return null;
    }

    /**
     *
     * getBrokenLinks
     *
     * @param page
     * @param limit
     * @param search
     * @param sort
     * @param order
     *
     */
    public static async getBrokenLinks(
        page: number,
        limit: number,
        search: string,
        sort: string,
        order: SortingOrder
    ): Promise<BrokenLinkListing | null> {
        const client = new Client();
        const query = SeoQueries.getBrokenLinks;

        const result = await client.query(
            gql`
                ${query},
            `,
            { page, limit, search, sort, order },
            false
        );

        if (result.data) {
            return result.data.getBrokenLinks;
        }

        return null;
    }

    /**
     *
     * getRedirection
     *
     * @param id
     *
     */
    public static async getRedirection(
        id: string
    ): Promise<Redirection | null> {
        const client = new Client();
        const query = SeoQueries.getRedirection;

        const result = await client.query(
            gql`
                ${query},
            `,
            { id },
            false
        );

        if (result.data) {
            return result.data.getRedirection;
        }

        return null;
    }

    /**
     *
     * getRedirections
     *
     * @param page
     * @param limit
     * @param search
     * @param sort
     * @param order
     *
     */
    public static async getRedirections(
        page: number,
        limit: number,
        search: string,
        sort: string,
        order: SortingOrder
    ): Promise<Redirection[] | null> {
        const client = new Client();
        const query = SeoQueries.getRedirections;

        const result = await client.query(
            gql`
                ${query},
            `,
            { page, limit, search, sort, order },
            false
        );

        if (result.data) {
            return result.data.getRedirections;
        }

        return null;
    }

    /**
     *
     * createRedirection
     *
     * @param url
     * @param redirect_url
     * @param redirect_type
     *
     */
    public static async createRedirection(
        url: string,
        redirect_url: string,
        redirect_type: RedirectType
    ): Promise<boolean | null> {
        const client = new Client();
        const mutation = SeoQueries.createRedirection;

        const result = await client.mutation(
            gql`
                ${mutation},
            `,
            { url, redirect_url, redirect_type }
        );

        if (result.data) {
            return result.data.createRedirection;
        }

        return null;
    }

    /**
     *
     * updateRedirection
     *
     * @param id
     * @param url
     * @param redirect_url
     * @param redirect_type
     *
     */
    public static async updateRedirection(
        id: string,
        url: string,
        redirect_url: string,
        redirect_type: RedirectType
    ): Promise<boolean | null> {
        const client = new Client();
        const mutation = SeoQueries.updateRedirection;

        const result = await client.mutation(
            gql`
                ${mutation},
            `,
            { id, url, redirect_url, redirect_type }
        );

        if (result.data) {
            return result.data.updateRedirection;
        }

        return null;
    }
}
