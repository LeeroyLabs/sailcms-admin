import { Client } from "./client";
import type { Category } from "../types/categories";
import CategoriesQueries from "../queries/categories";
import gql from "graphql-tag";

export class Categories {
    /**
     *
     * categoryFullTree
     *
     * @param parent_id
     * @param site_id
     *
     *
     */
    public static async categoryFullTree(
        parent_id: string,
        site_id: string
    ): Promise<Category[] | null> {
        const client = new Client();
        const query = CategoriesQueries.categoryFullTree;

        const result = await client.query(
            gql`
                ${query}
            `,
            { parent_id: parent_id, site_id: site_id }
        );

        if (result.data) {
            return result.data.categoryFullTree;
        }

        return null;
    }
}
