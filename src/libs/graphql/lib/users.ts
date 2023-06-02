import { Client } from "./client";
import {
    LoginResult,
    PasswordChangeResult,
    User,
    UserData,
    UserListArguments,
    UserListing,
} from "../types/users";
import UserQueries from "../queries/user";
import gql from "graphql-tag";
import { useAppStore } from "@/store/app";

export class Users {
    /**
     *
     * First step of authentication
     *
     * @param email
     * @param password
     *
     */
    public static async authenticate(
        email: string,
        password: string
    ): Promise<LoginResult> {
        const client = new Client();
        let query = UserQueries.authenticate;

        let result = await client.query(
            gql`
                ${query}
            `,
            { email: email, password: password }
        );

        if (result.data) {
            return result.data.authenticate as LoginResult;
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
     *
     */
    public static async getFromAuthentication(
        token: string,
        meta: string = ""
    ): Promise<User | null> {
        const client = new Client();
        let query = UserQueries.verifyAuthentication;

        if (token === "error" || token === "2fa") return null;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        let result = await client.query(
            gql`
                ${query}
            `,
            { token: token }
        );

        if (result.data && result.data.verifyAuthenticationToken) {
            return result.data.verifyAuthenticationToken as User;
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
    public static async verifyTFA(
        user_id: string,
        code: string,
        meta: string = ""
    ): Promise<User | null> {
        const client = new Client();
        let query = UserQueries.verifyTFA;

        if (code === "") return null;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        let result = await client.query(
            gql`
                ${query}
            `,
            { user_id: user_id, code: code }
        );

        if (result.data && result.data.verifyTFA) {
            return result.data.verifyTFA as User;
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
    public static async forgotPassword(email: string): Promise<boolean> {
        const client = new Client();
        let query = UserQueries.forgotPassword;

        let result = await client.query(
            gql`
                ${query}
            `,
            { email: email }
        );

        if (result.data) {
            return (result.data.forgotPassword as boolean) || false;
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
    public static async resetPassword(
        code: string,
        password: string
    ): Promise<PasswordChangeResult> {
        const client = new Client();
        let query = UserQueries.resetPassword;

        let result = await client.mutation(
            gql`
                ${query}
            `,
            { code: code, password: password }
        );

        if (result.data) {
            return (
                (result.data.changePassword as PasswordChangeResult) || {
                    password_check: false,
                    code_check: false,
                }
            );
        }

        return { password_check: false, code_check: false };
    }

    /**
     *
     * Log user in only with the access token
     *
     * @param meta
     *
     */
    public static async userWithToken(meta: string = ""): Promise<User | null> {
        const client = new Client();
        let query = UserQueries.userWithToken;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        let result = await client.query(
            gql`
                ${query}
            `,
            {}
        );

        if (result.data && result.data.userWithToken) {
            return result.data.userWithToken as User | null;
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
    public static async user(
        id: string,
        meta: string = ""
    ): Promise<User | null> {
        const client = new Client();
        let query = UserQueries.user;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        let result = await client.query(
            gql`
                ${query}
            `,
            { id: id }
        );

        if (result.data) {
            return result.data.user as User;
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
    public static async users(
        args: UserListArguments,
        meta: string = ""
    ): Promise<UserListing> {
        const client = new Client();
        let query = UserQueries.users;

        if (meta !== "") {
            query = query.replace("#meta#", `meta { ${meta} }`);
        } else {
            query = query.replace("#meta", "");
        }

        let result = await client.query(
            gql`
                ${query}
            `,
            args
        );

        if (result.data) {
            return result.data.users as UserListing;
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
    public static async createUser(
        data: UserData,
        forceNewPassword: boolean
    ): Promise<string> {
        const client = new Client();
        let query = UserQueries.createUser;

        const store = useAppStore();

        let result = await client.mutation(
            gql`
                ${query}
            `,
            {
                name: data.name,
                email: data.email,
                password: data.password,
                roles: data.roles,
                group: data.group,
                meta: { flags: { use2fa: false } },
                avatar: data.avatar,
                locale: store.locales[0],
                createWithSetPassword: forceNewPassword,
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
    public static async updateUser(
        id: string,
        data: UserData
    ): Promise<string> {
        const client = new Client();
        let query = UserQueries.updateUser;

        const store = useAppStore();

        let result = await client.mutation(
            gql`
                ${query}
            `,
            {
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
    public static async enableUsers(ids: string[]): Promise<boolean> {
        return await Users.changeStatus(ids, true);
    }

    /**
     *
     * Disable given users
     *
     * @param ids
     *
     */
    public static async disableUsers(ids: string[]): Promise<boolean> {
        return await Users.changeStatus(ids, false);
    }

    /**
     *
     * Delete a list of users
     *
     * @param ids
     *
     */
    public static async deleteUsers(ids: string[]): Promise<boolean> {
        const client = new Client();
        let query = UserQueries.deleteUsers;

        let result = await client.query(
            gql`
                ${query}
            `,
            { ids: ids }
        );

        if (result.data) {
            return result.data.deleteUsers;
        }

        return false;
    }

    private static async changeStatus(
        ids: string[],
        status: boolean
    ): Promise<boolean> {
        const client = new Client();
        let query = UserQueries.changeUserStatus;

        let result = await client.query(
            gql`
                ${query}
            `,
            { ids: ids, status: status }
        );

        if (result.data) {
            return result.data.changeUserStatus;
        }

        return false;
    }
}
