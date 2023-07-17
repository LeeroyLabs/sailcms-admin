import { Client } from "./client";
import type {
    NavigationItem, NavigationDetails, CreateNavigation, UpdateNavigation,
} from "../types/navigations";
import NavigationsQueries from "../queries/navigations";
import gql from "graphql-tag";

export class Navigations
{
    /**
     *
     * navigation
     *
     * @param name
     *
     */
    public static async navigation(name: string): Promise<NavigationItem[] | null>
    {
        const client = new Client();
        const query = NavigationsQueries.navigation;

        const result = await client.query(gql`${query}`, { name: name }, false);

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
     */
    public static async navigationDetails(name: string): Promise<NavigationDetails | null>
    {
        const client = new Client();
        const query = NavigationsQueries.navigationDetails;

        const result = await client.query(gql`${query}`, { name: name }, false);

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
    public static async createNavigation(navigationInput: CreateNavigation): Promise<NavigationDetails | null>
    {
        const client = new Client();
        const mutation = NavigationsQueries.createNavigation;

        const result = await client.mutation(gql`${mutation}`, {...navigationInput});

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
    public static async updateNavigation(navigationInput: UpdateNavigation): Promise<NavigationDetails | null>
    {
        const client = new Client();
        const mutation = NavigationsQueries.updateNavigation;

        const result = await client.mutation(gql`${mutation}`, {...navigationInput});

        if (result.data) {
            return result.data.updateNavigation;
        }

        return null;
    }
}
