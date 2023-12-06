import { Client } from "src/graphql/lib/client";
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
     * @param form_handle
     * @param page
     * @param limit
     * @param dateSearch
     * @param search
     * @param sort
     * @param order
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
     * @param handle
     * @param title
     * @param fields
     * @param settings
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
     * @param id
     * @param handle
     * @param title
     * @param fields
     * @param settings
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
     * @param ids
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

    /**
     *
     * viewedFormEntry
     *
     * @param id
     * @param form_handle
     *
     *
     */
    public static async viewedFormEntry(id: string, form_handle: string) {
        const client = new Client();
        const mutation = FormsQueries.viewedFormEntry;

        const result = await client.mutation(
            gql`
                    ${mutation},
                `,
            { id, form_handle }
        );

        if (result.data) {
            return result.data.viewedFormEntry;
        }

        return null;
    }

    /**
     *
     * deleteFormEntry
     *
     * @param ids
     * @param form_handle
     *
     *
     */
    public static async deleteFormEntry(ids: string[], form_handle: string) {
        const client = new Client();
        const mutation = FormsQueries.deleteFormEntry;

        const result = await client.mutation(
            gql`
                    ${mutation},
                `,
            { ids, form_handle }
        );

        if (result.data) {
            return result.data.deleteFormEntry;
        }

        return null;
    }
}
