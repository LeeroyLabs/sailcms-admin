import { Client } from "./client";
import AssetsQueries from "../queries/assets";
import gql from "graphql-tag";
import { Asset, AssetListing, AssetsOptions, Folder } from "../types/assets";

export class Assets
{
    /**
     *
     * Fetch an asset, pass locales to fetch titles for
     *
     * @param id
     * @param locales
     *
     */
    public static async asset(id: string, locales: string[] = ['fr', 'en']): Promise<Asset|null>
    {
        const client = new Client();
        let query = AssetsQueries.asset;

        query = query.replace('#locale#', Assets.parseLocales(locales));
        let result = await client.query(gql`${query}`, {id: id});

        if (result.data) {
            return result.data.asset as Asset;
        }

        return null;
    }

    /**
     *
     * List assets available
     *
     * @param args
     * @param locales
     *
     */
    public static async assets(args: AssetsOptions, locales: string[] = ['fr', 'en']): Promise<AssetListing>
    {
        const client = new Client();
        let query = AssetsQueries.assets;

        query = query.replace('#locale#', Assets.parseLocales(locales));
        let result = await client.query(gql`${query}`, args);

        if (result.data) {
            return result.data.assets as AssetListing;
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

    /**
     *
     * Get asset folders
     *
     */
    public static async folders(): Promise<Folder[]>
    {
        const client = new Client();
        let query = AssetsQueries.folders;

        let result = await client.query(gql`${query}`, {});

        if (result.data) {
            return result.data.assetFolders as Folder[];
        }

        return [];
    }

    /**
     *
     * Move Files from on folder to the other
     *
     * @param fileIds
     * @param folder
     *
     */
    public static async moveFiles(fileIds: string[], folder: string): Promise<boolean>
    {
        const client = new Client();
        let query = AssetsQueries.moveFiles;

        let result = await client.query(gql`${query}`, {ids: fileIds, folder: folder});

        if (result.data) {
            return result.data.moveFiles;
        }

        return false;
    }

    /**
     *
     * Add a folder
     *
     * response:
     * 1 = OK
     * 2 = Permission Denied
     * 3 = Already Exists
     *
     * @param name
     *
     */
    public static async addFolder(name: string): Promise<number>
    {
        const client = new Client();
        let query = AssetsQueries.addFolder;

        let result = await client.query(gql`${query}`, {folder: name});

        if (result.data) {
            return result.data.addFolder;
        }

        return 2;
    }

    public static async removeFolder(active: string, recipient: string): Promise<boolean>
    {
        const client = new Client();
        let query = AssetsQueries.removeFolder;

        let result = await client.query(gql`${query}`, {folder: active, move_to: recipient});

        if (result.data) {
            return result.data.removeFolder;
        }

        return false;
    }

    private static parseLocales(locales: string[]): string
    {
        let out = ``;

        for (let locale of locales) {
            out += `${locale}\n`;
        }

        return out;
    }
}
