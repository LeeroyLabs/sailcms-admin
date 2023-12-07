import { Client } from "./client.js";
import UserQueries from "../queries/user.js";
import gql from "graphql-tag";
import { AppStore } from "@stores/app.js";
import { get } from 'svelte/store';

export class Users
{
    /**
     *
     * First step of authentication
     *
     * @param email
     * @param password
     *
     */
    static async authenticate(email, password)
    {
        const client = new Client();
        let query = UserQueries.authenticate;

        let result = await client.query(gql`${query}`, { email: email, password: password });

        if (result.data) {
            return result.data.authenticate;
        }

        return {
            user_id: "",
            message: "error",
        };
    }

    /**
     *
     * Get user and token if authentication is successful
     *
     * @param token
     * @param meta
     * @param locales
     *
     */
    static async getFromAuthentication(token, meta = "", locales = ['en', 'fr'])
    {
        const client = new Client();
        let query = UserQueries.verifyAuthentication;

        if (token === "error" || token === "2fa") return null;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        query = query.replace('#locales#', Users.parseLocales(locales));

        let result = await client.query(gql`${query}`, { token: token });

        if (result.data && result.data.verifyAuthenticationToken) {
            return result.data.verifyAuthenticationToken;
        }

        return null;
    }

    /**
     *
     * Verify 2FA code and log user in
     *
     * @param user_id
     * @param code
     * @param meta
     *
     */
    static async verifyTFA(user_id, code, meta = "")
    {
        const client = new Client();
        let query = UserQueries.verifyTFA;

        if (code === "") return null;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        let result = await client.query(gql`${query}`, { user_id: user_id, code: code });

        if (result.data && result.data.verifyTFA) {
            return result.data.verifyTFA;
        }

        return null;
    }

    /**
     *
     * Request a password change
     *
     * @param email
     *
     */
    static async forgotPassword(email)
    {
        const client = new Client();
        let query = UserQueries.forgotPassword;

        let result = await client.query(gql`${query}`, { email: email });

        if (result.data) {
            return (result.data.forgotPassword) || false;
        }

        return false;
    }

    /**
     *
     * Change password (reset)
     *
     * @param code
     * @param password
     *
     */
    static async resetPassword(code, password)
    {
        const client = new Client();
        let query = UserQueries.resetPassword;

        let result = await client.mutation(gql`${query}`, { code: code, password: password });

        if (result.data) {
            return ((result.data.changePassword) || { password_check: false, code_check: false });
        }

        return { password_check: false, code_check: false };
    }

    /**
     *
     * Log user in only with the access token
     *
     * @param meta
     * @param locales
     *
     */
    static async userWithToken(meta = "", locales = ['en', 'fr'])
    {
        const client = new Client();
        let query = UserQueries.userWithToken;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        query = query.replace('#locales#', Users.parseLocales(locales));

        let result = await client.query(gql`${query}`, {});

        if (result.data && result.data.userWithToken) {
            return result.data.userWithToken || null;
        }

        return null;
    }

    /**
     *
     * Fetch a single user by id
     *
     * @param id
     * @param meta
     *
     */
    static async user(id, meta = "")
    {
        const client = new Client();
        let query = UserQueries.user;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        let result = await client.query(gql`${query}`, { id: id });

        if (result.data) {
            return result.data.user;
        }

        return null;
    }

    /**
     *
     * Get user listing
     *
     * @param args
     * @param meta
     *
     */
    static async users(args, meta = "")
    {
        const client = new Client();
        let query = UserQueries.users;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        let result = await client.query(gql`${query}`, args);

        if (result.data) {
            return result.data.users;
        }

        return {
            pagination: {
                total: 0,
                totalPages: 0,
                current: 1,
            },
            list: [],
        };
    }

    /**
     *
     * Create a new user
     *
     * @param data
     * @param forceNewPassword
     *
     */
    static async createUser(data, forceNewPassword)
    {
        const client = new Client();
        let query = UserQueries.createUser;

        let result = await client.mutation(
            gql`${query}`, {
                name: data.name,
                email: data.email,
                password: data.password,
                roles: data.roles,
                group: data.group,
                meta: { flags: { use2fa: false } },
                avatar: data.avatar,
                locale: get(AppStore).locales[0],
                create_with_set_password: forceNewPassword,
                pre_activated: true
            }
        );

        if (result.detailed) {
            let code = parseInt(
                result.detailed.graphQLErrors[0].extensions.debugMessage.substring(
                    0,
                    4
                )
            );

            switch (code) {
                case 9001:
                default:
                    return "email-used";

                case 9002:
                    return "weak-password";
            }
        }

        if (result.data) {
            return result.data.createUser;
        }

        return "";
    }

    /**
     *
     * Update a user
     *
     * @param id
     * @param data
     *
     */
    static async updateUser(id, data)
    {
        const client = new Client();
        let query = UserQueries.updateUser;

        let result = await client.mutation(
            gql`${query}`, {
                id: id,
                name: { first: data.name.first, last: data.name.last },
                email: data.email,
                password: data.password,
                roles: data.roles,
                group: data.group,
                avatar: data.avatar,
                locale: data.locale,
            }
        );

        if (result.detailed) {
            let code = parseInt(
                result.detailed.graphQLErrors[0].extensions.debugMessage.substring(0, 4)
            );

            switch (code) {
                case 9001:
                default:
                    return "email-used";

                case 9002:
                    return "weak-password";

                case 9003:
                    return "invalid-email";
            }
        }

        if (result.data) {
            return result.data.updateUser ? "true" : "false";
        }

        return "false";
    }

    /**
     *
     * Enable given users
     *
     * @param ids
     *
     */
    static async enableUsers(ids)
    {
        return await Users.changeStatus(ids, true);
    }

    /**
     *
     * Disable given users
     *
     * @param ids
     *
     */
    static async disableUsers(ids)
    {
        return await Users.changeStatus(ids, false);
    }

    /**
     *
     * Delete a list of users
     *
     * @param ids
     *
     */
    static async deleteUsers(ids)
    {
        const client = new Client();
        let query = UserQueries.deleteUsers;

        let result = await client.query(
            gql`${query}`, { ids: ids }
        );

        if (result.data) {
            return result.data.deleteUsers;
        }

        return false;
    }

    /**
     *
     * Change user status
     *
     * @param ids
     * @param status
     *
     */
    static async changeStatus(ids, status)
    {
        const client = new Client();
        let query = UserQueries.changeUserStatus;

        let result = await client.query(
            gql`${query}`,
            { ids: ids, status: status }
        );

        if (result.data) {
            return result.data.changeUserStatus;
        }

        return false;
    }

    static parseLocales(locales)
    {
        let out = ``;

        for (let locale of locales) {
            out += `${locale}\n`;
        }

        return out;
    }
}
