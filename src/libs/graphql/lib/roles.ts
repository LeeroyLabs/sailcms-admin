import { Client } from "./client";
import RoleQueries from "../queries/roles";
import gql from "graphql-tag";
import { Permission, Role, RoleConfig } from "../types/roles";

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

    /**
     *
     *
     * get system permissions
     *
     */
    public static async permissions(): Promise<Permission[]>
    {
        const client = new Client();
        let query = RoleQueries.permissions;
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.permissions;
        }

        return [];
    }

    /**
     *
     * Create a role
     *
     * @param role
     *
     */
    public static async createRole(role: Role): Promise<boolean>
    {
        const client = new Client();
        let query = RoleQueries.createRole;

        let result = await client.query(gql`${query}`, {
            name: role.name,
            description: role.description,
            level: role.level,
            permissions: role.permissions
        });

        if (result.error) {
            return false;
        }

        if (result.data) {
            return result.data.createRole;
        }

        return false;
    }

    /**
     *
     * Update a role
     *
     * @param id
     * @param role
     *
     */
    public static async updateRole(id: string, role: Role): Promise<boolean>
    {
        const client = new Client();
        let query = RoleQueries.updateRole;

        let result = await client.query(gql`${query}`, {
            id: id,
            name: role.name,
            description: role.description,
            level: role.level,
            permissions: role.permissions
        });

        if (result.error) {
            return false;
        }

        if (result.data) {
            return result.data.updateRole;
        }

        return false;
    }
}
