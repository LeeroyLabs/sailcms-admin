import { Client } from "./client";
import GroupQueries from "../queries/groups";
import gql from "graphql-tag";
import { Group } from "../types/groups";

export class Groups
{
    /**
     *
     * Get list of groups
     *
     */
    public static async groups(): Promise<Group[]>
    {
        const client = new Client();
        let query = GroupQueries.groups;
        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.groups as Group[];
        }

        return [];
    }

    /**
     *
     * Get a single group by id
     *
     * @param id
     *
     */
    public static async group(id: string): Promise<Group|null>
    {
        const client = new Client();
        let query = GroupQueries.group;
        let result = await client.query(gql`${query}`, {id: id});

        if (result.data) {
            return result.data.group as Group;
        }

        return null;
    }

    /**
     *
     * Delete a group
     *
     * @param id
     *
     */
    public static async deleteGroup(id: string): Promise<boolean>
    {
        const client = new Client();
        let query = GroupQueries.deleteGroup;
        let result = await client.mutation(gql`${query}`, {id: id});

        if (result.data) {
            return result.data.deleteGroup;
        }

        return false;
    }

    /**
     *
     * Create a group
     *
     * @param name
     *
     */
    public static async createGroup(name: string): Promise<string>
    {
        const client = new Client();
        let query = GroupQueries.createGroup;
        let result = await client.mutation(gql`${query}`, {name});

        if (result.error) {
            return 'already_exists';
        }

        if (result.data) {
            return result.data.createGroup;
        }

        return 'error';
    }

    /**
     *
     * Update a group
     *
     * @param id
     * @param name
     */
    public static async updateGroup(id: string, name: string): Promise<boolean>
    {
        const client = new Client();
        let query = GroupQueries.updateGroup;
        let result = await client.mutation(gql`${query}`, {id, name});

        if (result.error) {
            return false;
        }

        if (result.data) {
            return result.data.updateGroup;
        }

        return false;
    }
}
