import { Client } from "./client";
import type {
    NavigationItem,
    NavigationDetails,
    CreateNavigation,
    UpdateNavigation,
} from "../types/navigations";
import NavigationsQueries from "../queries/navigations";
import gql from "graphql-tag";

export class Navigations {
    /**
     *
     * navigation
     *
     * @param slug
     *
     */
    public static async navigation(
        slug: string
    ): Promise<NavigationItem[] | null> {
        const client = new Client();
        const query = NavigationsQueries.navigation;

        const result = await client.query(
            gql`
                ${query}
            `,
            { slug },
            false
        );

        if (result.data) {
            return result.data.navigation;
        }

        return null;
    }

    /**
     *
     * navigationDetailsList
     *
     * @param sort
     * @param direction
     * @param locale
     * @param site_id
     *
     */
    public static async navigationDetailsList(
        sort: string,
        direction: string,
        locale: string,
        site_id: string
    ): Promise<NavigationDetails | null> {
        const client = new Client();
        const query = NavigationsQueries.navigationDetailsList;

        const result = await client.query(
            gql`
                ${query}
            `,
            { sort, direction, locale, site_id },
            false
        );

        if (result.data) {
            return result.data.navigationDetailsList;
        }

        return null;
    }

    /**
     *
     * navigationDetails
     *
     * @param slug
     *
     */
    public static async navigationDetails(
        slug: string
    ): Promise<NavigationDetails | null> {
        const client = new Client();
        const query = NavigationsQueries.navigationDetails;

        const result = await client.query(
            gql`
                ${query}
            `,
            { slug },
            false
        );

        if (result.data) {
            return result.data.navigationDetails;
        }

        return null;
    }

    /**
     *
     * createNavigation
     *
     * @param navigationInput
     *
     */
    public static async createNavigation(
        navigationInput: CreateNavigation
    ): Promise<string | null> {
        const client = new Client();
        const mutation = NavigationsQueries.createNavigation;

        const result = await client.mutation(
            gql`
                ${mutation}
            `,
            { ...navigationInput }
        );

        if (result.data) {
            return result.data.createNavigation;
        }

        return null;
    }

    /**
     *
     * updateNavigation
     *
     * @param navigationInput
     *
     */
    public static async updateNavigation(
        navigationInput: UpdateNavigation
    ): Promise<boolean | null> {
        const client = new Client();
        const mutation = NavigationsQueries.updateNavigation;

        const result = await client.mutation(
            gql`
                ${mutation}
            `,
            { ...navigationInput }
        );

        if (result.data) {
            return result.data.updateNavigation;
        }

        return null;
    }

    /**
     *
     * deleteNavigation
     *
     * @param navigationInput
     *
     */
    public static async deleteNavigation(id: string): Promise<boolean | null> {
        const client = new Client();
        const mutation = NavigationsQueries.deleteNavigation;

        const result = await client.mutation(
            gql`
                ${mutation}
            `,
            { id }
        );

        if (result.data) {
            return result.data.deleteNavigation;
        }

        return null;
    }
}
