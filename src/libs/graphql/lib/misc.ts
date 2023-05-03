import { RegisteredExtensions } from "../types/misc";
import { Client } from "./client";
import MiscQueries from "../queries/misc";
import gql from "graphql-tag";

// TODO
// _.mapKeys(obj, (v, k) => _.camelCase(k))

// TODO
// Fragments with aspect (basic, public, full)

export class Misc
{
    /**
     *
     * Get Registered extensions for display in the admin panel
     *
     */
    public static async registeredExtensions(): Promise<RegisteredExtensions>
    {
        const client = new Client();
        let query = MiscQueries.registeredExtensions;
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.registeredExtensions as RegisteredExtensions;
        }

        return {
            modules: [],
            containers: []
        }
    }
}
