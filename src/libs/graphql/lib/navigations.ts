import { Client } from "./client";
import type {
    NavigationItem,
    NavigationDetails,
    createNavigation,
    updateNavigation,
} from "../types/navigations";
import NavigationsQueries from "../queries/navigations";
import gql from "graphql-tag";

export class Navigations {
    /**
     *
     * navigation
     *
     * @param name
     *
     *
     */
    public static async navigation(
        name: string
    ): Promise<NavigationItem[] | null> {
        const client = new Client();
        const query = NavigationsQueries.navigation;

        const result = await client.query(
            gql`
                ${query},
            `,
            { name: name },
            false
        );

        if (result.data) {
            return result.data.navigation;
        }

        return null;
    }

    /**
     *
     * navigationDetails
     *
     * @param name
     *
     *
     */
    public static async navigationDetails(
        name: string
    ): Promise<NavigationDetails | null> {
        const client = new Client();
        const query = NavigationsQueries.navigationDetails;

        const result = await client.query(
            gql`
                    ${query},
                `,
            { name: name },
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
     * @param name
     * @param structure
     * @param locale
     *
     *
     */
    public static async createNavigation(
        navigationInput: createNavigation
    ): Promise<NavigationDetails | null> {
        const client = new Client();
        const mutation = NavigationsQueries.createNavigation;

        const result = await client.mutation(
            gql`
                    ${mutation},
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
     * @param id
     * @param name
     * @param structure
     * @param locale
     *
     *
     */
    public static async updateNavigation(
        navigationInput: updateNavigation
    ): Promise<NavigationDetails | null> {
        const client = new Client();
        const mutation = NavigationsQueries.updateNavigation;

        const result = await client.mutation(
            gql`
                    ${mutation},
                `,
            { ...navigationInput }
        );

        if (result.data) {
            return result.data.updateNavigation;
        }

        return null;
    }
}
