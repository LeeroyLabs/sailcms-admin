import { Client } from "./client";
import RoleQueries from "../queries/roles";
import gql from "graphql-tag";
import { Role, RoleConfig } from "types/roles";

export class Roles
{
    /**
     *
     * Get list of roles
     *
     */
    public static async roles(): Promise<Role[]>
    {
        const client = new Client();
        let query = RoleQueries.roles;
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.roles as Role[];
        }

        return [];
    }

    /**
     *
     * Get a single role by id
     *
     * @param id
     *
     */
    public static async role(id: string): Promise<RoleConfig|null>
    {
        const client = new Client();
        let query = RoleQueries.role;
        let result = await client.query(gql`${query}`, {id: id});

        if (result.data) {
            return result.data.role as RoleConfig;
        }

        return null;
    }
}