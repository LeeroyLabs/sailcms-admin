import { Client } from "./client";
import SeoQueries from "../queries/seo";
import type { Task } from "../types/tasks";
import type { SortingOrder } from "../types/general";
import gql from "graphql-tag";

export class Seo {
    /**
     *
     * getSeoSettings
     *
     *
     */
    public static async getSeoSettings() {
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
}
