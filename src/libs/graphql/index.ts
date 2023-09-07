import { Client } from "./lib/client";
import { NavigationConfiguration } from "@/libs/graphql/types/misc";
export { Client } from "./lib/client";
export { Users } from "./lib/users";
export { Categories } from "./lib/categories";
export { Roles } from "./lib/roles";
export { Assets } from "./lib/assets";
export { Emails } from "./lib/emails";
export { Misc } from "./lib/misc";
export { Groups } from "./lib/groups";

export class SailCMS {
    private static url: string = "";
    private static accessToken: string = "";

    private static locales: string[] = ["fr", "en"];
    private static baseURL: string = "";
    private static siteId: string = "default";

    private static navigation: NavigationConfiguration;

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
    public static setConfig(
        url: string,
        accessToken: string = "",
        locales: string[] = ["fr", "en"],
        baseURL: string,
        siteId: string,
        navigation: NavigationConfiguration
    ): void {
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
    public static getURL(): string {
        return SailCMS.url;
    }

    /**
     *
     * Get the Access Token
     *
     */
    public static getToken(): string {
        return SailCMS.accessToken;
    }

    /**
     *
     * Get Site ID
     *
     */
    public static getSiteId(): string {
        return SailCMS.siteId;
    }

    public static  getNavigation(): NavigationConfiguration {
        return SailCMS.navigation;
    }

    /**
     *
     * Get available locales in the cms
     *
     */
    public static getLocales(): string[] {
        return SailCMS.locales;
    }

    /**
     *
     * Get admin base url
     *
     */
    public static getBaseURL(): string {
        return SailCMS.baseURL;
    }

    /**
     *
     * Set the access token to be used
     *
     * @param token
     *
     */
    public static setToken(token: string): void {
        SailCMS.accessToken = token;
        Client.updateClient();
    }
}
