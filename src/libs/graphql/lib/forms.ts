import { Client } from "./client";
import FormsQueries from "../queries/forms";
import gql from "graphql-tag";

export class Forms {
    /**
     *
     * getForm
     *
     * @param handle
     *
     */
    public static async getForm(handle: string) {
        const client = new Client();
        const query = FormsQueries.getForm;

        const result = await client.query(
            gql`
                ${query},
            `,
            { handle },
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
     * deleteForm
     *
     *
     */
    public static async deleteForm(id: string) {
        const client = new Client();
        const mutation = FormsQueries.deleteForm;

        const result = await client.mutation(
            gql`
                ${mutation},
            `,
            { id }
        );

        if (result.data) {
            return result.data.deleteForm;
        }

        return null;
    }

    /**
     *
     * createFormLayout
     *
     *
     */
    public static async createFormLayout(
        title: string,
        schema: any,
        slug: string
    ) {
        const client = new Client();
        const mutation = FormsQueries.createFormLayout;

        const result = await client.mutation(
            gql`
                ${mutation},
            `,
            { titles, schema, slug }
        );

        if (result.data) {
            return result.data.createFormLayout;
        }

        return null;
    }
}
