import { Client } from "./client";
import type { Category, CategorySortItem } from "../types/categories";
import type { LocaleObject } from "../types/general";
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

    /**
     *
     * createCategory
     *
     * @param name
     * @param parent_id
     * @param site_id
     *
     *
     */
    public static async createCategory(
        name: LocaleObject,
        parent_id: string,
        site_id: string
    ): Promise<boolean | null> {
        const client = new Client();
        const mutation = CategoriesQueries.createCategory;
        const result = await client.mutation(
            gql`
                ${mutation}
            `,
            { name: name, parent_id: parent_id, site_id: site_id }
        );

        if (result.data) {
            return result.data.createCategory;
        }

        return null;
    }

    /**
     *
     * updateCategory
     *
     * @param id
     *
     *
     */
    public static async updateCategory(
        id: string,
        name: LocaleObject,
        parent_id: string
    ): Promise<boolean | null> {
        const client = new Client();
        const mutation = CategoriesQueries.updateCategory;
        const result = await client.mutation(
            gql`
                ${mutation}
            `,
            { id: id, name: name, parent_id: parent_id }
        );

        if (result.data) {
            return result.data.updateCategory;
        }

        return null;
    }

    /**
     *
     * updateCategory
     *
     * @param parent_id
     * @param order
     * @param site_id
     *
     *
     */
    public static async updateCategoryOrders(
        tree: CategorySortItem[],
        site_id: string
    ): Promise<boolean | null> {
        const client = new Client();
        const mutation = CategoriesQueries.updateCategoryOrders;
        const result = await client.mutation(
            gql`
                ${mutation}
            `,
            { tree: tree, site_id: site_id }
        );

        if (result.data) {
            return result.data.updateCategoryOrders;
        }

        return null;
    }

    /**
     *
     * deleteCategory
     *
     * @param id
     *
     *
     */
    public static async deleteCategory(id: string): Promise<boolean | null> {
        const client = new Client();
        const mutation = CategoriesQueries.deleteCategory;
        const result = await client.mutation(
            gql`
                ${mutation}
            `,
            { id: id }
        );

        if (result.data) {
            return result.data.deleteCategory;
        }

        return null;
    }
}
