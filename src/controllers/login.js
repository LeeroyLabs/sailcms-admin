import { Session } from '@stores/session.js';
import { Permission } from '@stores/permission.js';

export class LoginController
{
    /**
     *
     * Perform user login
     *
     * @param fields
     * @returns {Promise<{data: (null|{reload: boolean, id: *, user: ((function(*): Promise<GraphQLResult>)|*|DocumentNode|PublicKeyCredentialUserEntity), token}|*), invalid: boolean, mfa: boolean, error: boolean}|{data: string, invalid: boolean, mfa: boolean, error: boolean}>}
     *
     */
    static async performLogin(fields)
    {
        // Fields are invalid
        if (!fields.email.isValid || !fields.password.isValid) return {data: '', error: true, invalid: true, mfa: false};

        // Call GraphQL
        const result = await UserQueries.login(fields.email.value, fields.password.value);

        if (import.meta.env.VITE_SITE === '1') {
            if (!result.error) {
                this.setUserSession(result.data);
                return {data: result.data, error: false, invalid: false, mfa: true};
            }
        } else {
            if (!result.error) {
                this.setUserSession(result.data);
                return {data: result.data, error: false, invalid: false, mfa: false};
            }
        }

        return {data: '', error: true, invalid: false, mfa: false};
    }

    /**
     *
     * Set user session data
     *
     * @param data
     *
     */
    static setUserSession(data)
    {
        Session.set({
            user: data.user,
            id: data.user._id,
            token: data.token,
            loggedIn: true
        });

        localStorage.setItem("ssc", data.token);
        Permission.set({list: data.user.permissions});
    }
}