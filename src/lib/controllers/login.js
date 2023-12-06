import { debug } from '$lib/helpers/debugger.js';
import { Users } from '@graphql/lib/users.js';
import { AppStore } from '@stores/app.js';
import { get } from 'svelte/store';

export class LoginController
{
    /**
     *
     * Perform user login
     *
     * @param fields
     *
     */
    static async performLogin(fields)
    {
        debug('info', 'Login', 'running login graphql endpoint');
        fields.email.validate();
        fields.password.validate();

        // Fields are invalid
        if (!fields.email.isValid || !fields.password.isValid) return {data: '', error: true, invalid: true, mfa: false};

        // Call GraphQL
        const result = await Users.authenticate(fields.email.value, fields.password.value);

        if (result.message !== 'error') {
            return {data: result.message, error: false, invalid: false, mfa: false};
        }

        return {data: '', error: true, invalid: false, mfa: false};
    }

    /**
     *
     * Get user from given token
     *
     * @param token
     *
     */
    static async getUserFromAuthentication(token)
    {
        return await Users.getFromAuthentication(token);
    }
}