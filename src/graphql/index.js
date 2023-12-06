import { Client } from "./lib/client.js";
export { Client } from "./lib/client.js";
export { Users } from "./lib/users.js";
// export { Categories } from "./lib/categories";
// export { Roles } from "./lib/roles";
// export { Assets } from "./lib/assets";
// export { Emails } from "./lib/emails";
export { Misc } from "./lib/misc.js";
// export { Groups } from "./lib/groups";

export class SailCMS
{
    static url = "";
    static accessToken = "";

    static locales = ["fr", "en"];
    static baseURL = "";
    static siteId  = "default";

    static navigation;

    /**
     *
     * Set both url and token for the cms
     *
     * @param url
     * @param accessToken
     * @param locales
     * @param baseURL
     * @param siteId
     * @param navigation
     *
     */
    static setConfig(url, accessToken = "", locales = ["fr", "en"], baseURL, siteId, navigation)
    {
        SailCMS.url = url;
        SailCMS.accessToken = accessToken;
        SailCMS.locales = locales;
        SailCMS.baseURL = baseURL;
        SailCMS.siteId = siteId;
        SailCMS.navigation = navigation
    }

    /**
     *
     * Get the GraphQL URL
     *
     */
    static getURL()
    {
        return SailCMS.url;
    }

    /**
     *
     * Get the Access Token
     *
     */
    static getToken()
    {
        return SailCMS.accessToken;
    }

    /**
     *
     * Get Site ID
     *
     */
    static getSiteId()
    {
        return SailCMS.siteId;
    }

    static getNavigation()
    {
        return SailCMS.navigation;
    }

    /**
     *
     * Get available locales in the cms
     *
     */
    static getLocales()
    {
        return SailCMS.locales;
    }

    /**
     *
     * Get admin base url
     *
     */
    static getBaseURL()
    {
        return SailCMS.baseURL;
    }

    /**
     *
     * Set the access token to be used
     *
     * @param token
     *
     */
    static setToken(token)
    {
        SailCMS.accessToken = token;
        Client.updateClient();
    }
}
