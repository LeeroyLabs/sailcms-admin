import { Client } from "./lib/client";
export { Client } from "./lib/client";
export { Users } from './lib/users';
export { Roles } from './lib/roles';
export { Assets } from "./lib/assets";
export { Emails } from "./lib/emails";
export { Misc } from "./lib/misc";

export class SailCMS
{
    private static url: string = '';
    private static accessToken: string = '';

    /**
     *
     * Set both url and token for the cms
     *
     * @param url
     * @param accessToken
     *
     */
    public static setConfig(url: string, accessToken: string = ''): void
    {
        SailCMS.url = url;
        SailCMS.accessToken = accessToken;
    }

    /**
     *
     * Get the GraphQL URL
     *
     */
    public static getURL(): string
    {
        return SailCMS.url;
    }

    /**
     *
     * Get the Access Token
     *
     */
    public static getToken(): string
    {
        return SailCMS.accessToken;
    }

    /**
     *
     * Set the access token to be used
     *
     * @param token
     *
     */
    public static setToken(token: string): void
    {
        SailCMS.accessToken = token;
        Client.updateClient();
    }
}
