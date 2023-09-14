import { Client } from "./client";
import FormsQueries from "../queries/forms";
import gql from "graphql-tag";
import { SortingOrder } from "@/libs/graphql/types/general";
import { FormDate, FormSettingsInput } from "@/libs/graphql/types/forms";

export class Forms {
    /**
     *
     * getForm
     *
     * @param handle
     *
     */
    public static async getForm(id: string) {
        const client = new Client();
        const query = FormsQueries.getForm;

        const result = await client.query(
            gql`
                ${query},
            `,
            { id },
            false
        );

        if (result.data) {
            return result.data.form;
        }

        return null;
    }

    /**
     *
     * getForms
     *
     *
     */
    public static async getForms() {
        const client = new Client();
        const query = FormsQueries.getForms;

        const result = await client.query(
            gql`
                ${query},
            `,
            {},
            false
        );

        if (result.data) {
            return result.data.forms;
        }

        return null;
    }

    /**
     *
     * getFormEntries
     *
     *
     */
    public static async getFormEntries(
        form_handle: string,
        page: number,
        limit: number,
        dateSearch: FormDate,
        search: string,
        sort: string,
        order: SortingOrder
    ) {
        const client = new Client();
        const query = FormsQueries.getFormEntries;

        const result = await client.query(
            gql`
                ${query},
            `,
            {
                form_handle,
                page,
                limit,
                dateSearch,
                search,
                sort,
                order,
            },
            false
        );

        if (result.data) {
            return result.data.formEntries;
        }

        return null;
    }

    /**
     *
     * createForm
     *
     *
     */
    public static async createForm(
        handle: string,
        title: string,
        fields: string[],
        settings?: FormSettingsInput
    ) {
        const client = new Client();
        const mutation = FormsQueries.createForm;

        const result = await client.mutation(
            gql`
                ${mutation},
            `,
            { handle, title, fields, settings }
        );

        if (result.data) {
            return result.data.createForm;
        }

        return null;
    }

    /**
     *
     * updateForm
     *
     *
     */
    public static async updateForm(
        id: string,
        handle: string,
        title: string,
        fields: string[],
        settings?: FormSettingsInput
    ) {
        const client = new Client();
        const mutation = FormsQueries.updateForm;

        const result = await client.mutation(
            gql`
                ${mutation},
            `,
            { id, handle, title, fields, settings }
        );

        if (result.data) {
            return result.data.updateForm;
        }

        return null;
    }

    /**
     *
     * deleteForm
     *
     *
     */
    public static async deleteForm(ids: string[]) {
        const client = new Client();
        const mutation = FormsQueries.deleteForm;

        const result = await client.mutation(
            gql`
                    ${mutation},
                `,
            { ids }
        );

        if (result.data) {
            return result.data.deleteForm;
        }

        return null;
    }
}
