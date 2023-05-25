import { Client } from "./client";
import AssetsQueries from "../queries/assets";
import gql from "graphql-tag";
import { Asset, AssetConfig, AssetListing, AssetsOptions, Folder } from "../types/assets";
import { SailCMS } from "@/libs/graphql";

export class Assets
{
    /**
     *
     * Get the configurations for the asset manager
     *
     */
    public static async getConfig(): Promise<AssetConfig>
    {
        const client = new Client();
        let query = AssetsQueries.assetConfig;

        let result = await client.query(gql`${query}`, {site_id: SailCMS.getSiteId()});

        if (result.data) {
            return result.data.assetConfig;
        }

        return {maxSize: 5_242_880, blacklist: ['php', 'exe', 'sh', 'sql']};
    }

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

        args.site_id = SailCMS.getSiteId();

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
     * Upload an asset
     *
     * @param data
     * @param name
     * @param folder
     * @param locales
     *
     */
    public static async uploadAsset(data: string, name: string, folder: string, locales: string[] = ['fr', 'en']): Promise<Asset|null>
    {
        const client = new Client();
        let query = AssetsQueries.uploadAsset;

        query = query.replace('#locale#', Assets.parseLocales(locales));
        let result = await client.mutation(gql`${query}`, {
            src: data,
            filename: name,
            folder: folder,
            site_id: SailCMS.getSiteId()
        });

        if (result.data) {
            return result.data.uploadAsset;
        }

        return null;
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

        let result = await client.query(gql`${query}`, {site_id: SailCMS.getSiteId()});

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

        let result = await client.mutation(gql`${query}`, {ids: fileIds, folder: folder});

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

        let result = await client.mutation(gql`${query}`, {folder: name, site_id: SailCMS.getSiteId()});

        if (result.data) {
            return result.data.addFolder;
        }

        return 2;
    }

    /**
     *
     * Remove a folder and move all files to another folder
     *
     * @param active
     * @param recipient
     *
     */
    public static async removeFolder(active: string, recipient: string): Promise<boolean>
    {
        const client = new Client();
        let query = AssetsQueries.removeFolder;

        let result = await client.mutation(gql`${query}`, {
            folder: active,
            move_to: recipient,
            site_id: SailCMS.getSiteId()
        });

        if (result.data) {
            return result.data.removeFolder;
        }

        return false;
    }

    /**
     *
     * Delete assets from the given list
     *
     * @param files
     *
     */
    public static async deleteAssets(files: string[]): Promise<boolean>
    {
        const client = new Client();
        let query = AssetsQueries.removeAssets;

        let result = await client.mutation(gql`${query}`, {assets: files});

        if (result.data) {
            return result.data.removeAssets;
        }

        return false;
    }

    /**
     *
     * Update an asset's title
     *
     * @param id
     * @param locale
     * @param title
     *
     */
    public static async updateAssetTitle(id: string, locale: string, title: string): Promise<boolean>
    {
        const client = new Client();
        let query = AssetsQueries.updateAssetTitle;

        let result = await client.mutation(gql`${query}`, {id: id, locale: locale, title: title});

        if (result.data) {
            return result.data.updateAssetTitle;
        }

        return false;
    }

    /**
     *
     * Create a custom transform based on the cropping tool
     *
     * @param id
     * @param name
     * @param src
     *
     */
    public static async createTransform(id: string, name: string, src: string): Promise<string>
    {
        const client = new Client();
        let query = AssetsQueries.customTransformAsset;

        let result = await client.mutation(gql`${query}`, {id: id, name: name, src: src});

        if (result.data) {
            return result.data.customTransformAsset;
        }

        return '';
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
