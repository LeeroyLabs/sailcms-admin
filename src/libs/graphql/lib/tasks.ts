import { Client } from "./client";
import TasksQueries from "../queries/tasks";
import type { Task } from "../types/tasks";
import type { SortingOrder } from "../types/general";
import gql from "graphql-tag";

export class Tasks {
    /**
     *
     * task
     *
     * @param id
     *
     */
    public static async task(id: string) {
        const client = new Client();
        const query = TasksQueries.task;

        const result = await client.query(
            gql`
                ${query},
            `,
            { id: id },
            false
        );

        if (result.data) {
            return result.data.task;
        }

        return null;
    }

    /**
     *
     * taskList
     *
     * @param limit
     *
     */
    public static async taskList(limit: number) {
        const client = new Client();
        const query = TasksQueries.taskList;

        const result = await client.query(
            gql`
                ${query},
            `,
            { limit },
            false
        );

        if (result.data) {
            return result.data.taskList;
        }

        return null;
    }

    /**
     *
     * taskSearch
     *
     * @param page
     * @param limit
     * @param search
     * @param sort
     * @param order
     *
     */
    public static async taskSearch(
        page: number,
        limit: number,
        search: number,
        sort: boolean,
        order: SortingOrder
    ) {
        const client = new Client();
        const query = TasksQueries.taskSearch;

        const result = await client.query(
            gql`
                    ${query},
                `,
            { page, limit, search, sort, order }
        );

        if (result.data) {
            return result.data.taskSearch;
        }

        return null;
    }

    /**
     *
     * createTask
     *
     * @param name
     * @param action
     * @param priority
     * @param retriable
     *
     */
    public static async createTask(
        name: string,
        action: string,
        priority: number,
        retriable: boolean
    ) {
        const client = new Client();
        const mutation = TasksQueries.createTask;

        const result = await client.mutation(
            gql`
                ${mutation},
            `,
            { name, action, priority, retriable }
        );

        if (result.data) {
            return result.data.createTask;
        }

        return null;
    }

    /**
     *
     * cancelTask
     *
     * @param id
     *
     */
    public static async cancelTask(id: string) {
        const client = new Client();
        const mutation = TasksQueries.cancelTask;

        const result = await client.mutation(
            gql`
                ${mutation},
            `,
            { id }
        );

        if (result.data) {
            return result.data.cancelTask;
        }

        return null;
    }

    /**
     *
     * retryTask
     *
     * @param id
     *
     */
    public static async retryTask(id: string) {
        const client = new Client();
        const mutation = TasksQueries.retryTask;

        const result = await client.mutation(
            gql`
                ${mutation},
            `,
            { id }
        );

        if (result.data) {
            return result.data.retryTask;
        }

        return null;
    }
}
