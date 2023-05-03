import { Client } from "./client";
import { LoginResult, PasswordChangeResult, User, UserListArguments, UserListing } from "../types/users";
import UserQueries from "../queries/user";
import gql from "graphql-tag";

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
    public static async authenticate(email: string, password: string): Promise<LoginResult>
    {
        const client = new Client();
        let query = UserQueries.authenticate;

        let result = await client.query(gql`${query}`, {email: email, password: password});

        if (result.data) {
            return result.data.authenticate as LoginResult;
        }

        return {
            user_id: '',
            message: 'error'
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
    public static async getFromAuthentication(token: string, meta: string = ''): Promise<User|null>
    {
        const client = new Client();
        let query = UserQueries.verifyAuthentication;

        if (token === 'error' || token === '2fa') return null;

        if (meta !== '') {
            query = query.replace('#meta#', `meta { ${meta} }`);
        } else {
            query = query.replace('#meta', '');
        }

        let result = await client.query(gql`${query}`, {token: token});

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
    public static async verifyTFA(user_id: string, code: string, meta: string = ''): Promise<User|null>
    {
        const client = new Client();
        let query = UserQueries.verifyTFA;

        if (code === '') return null;

        if (meta !== '') {
            query = query.replace('#meta#', `meta { ${meta} }`);
        } else {
            query = query.replace('#meta', '');
        }

        let result = await client.query(gql`${query}`, {user_id: user_id, code: code});

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
    public static async forgotPassword(email: string): Promise<boolean>
    {
        const client = new Client();
        let query = UserQueries.forgotPassword;

        let result = await client.query(gql`${query}`, {email: email});

        if (result.data) {
            return result.data.forgotPassword as boolean || false;
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
    public static async resetPassword(code: string, password: string): Promise<PasswordChangeResult>
    {
        const client = new Client();
        let query = UserQueries.resetPassword;

        let result = await client.mutation(gql`${query}`, {code: code, password: password});

        if (result.data) {
            return result.data.changePassword as PasswordChangeResult || {password_check: false, code_check: false};
        }

        return {password_check: false, code_check: false};
    }

    /**
     *
     * Log user in only with the access token
     *
     * @param meta
     *
     */
    public static async userWithToken(meta: string = ''): Promise<User|null>
    {
        const client = new Client();
        let query = UserQueries.userWithToken;

        if (meta !== '') {
            query = query.replace('#meta#', `meta { ${meta} }`);
        } else {
            query = query.replace('#meta', '');
        }

        let result = await client.query(gql`${query}`, {});

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
    public static async user(id: string, meta: string = ''): Promise<User|null>
    {
        const client = new Client();
        let query = UserQueries.user;

        if (meta !== '') {
            query = query.replace('#meta#', `meta { ${meta} }`);
        } else {
            query = query.replace('#meta', '');
        }

        let result = await client.query(gql`${query}`, {id: id});

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
    public static async users(args: UserListArguments, meta: string = ''): Promise<UserListing>
    {
        const client = new Client();
        let query = UserQueries.users;

        if (meta !== '') {
            query = query.replace('#meta#', `meta { ${meta} }`);
        } else {
            query = query.replace('#meta', '');
        }

        let result = await client.query(gql`${query}`, args);

        if (result.data) {
            return result.data.users as UserListing;
        }

        return {
            pagination: {
                total: 0,
                totalPages: 0,
                current: 1
            },
            list: []
        };
    }
}
