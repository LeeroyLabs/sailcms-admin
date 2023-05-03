import { Client } from "./client";
import AssetsQueries from "../queries/assets";
import gql from "graphql-tag";
import { Asset, AssetListing, AssetsOptions } from "types/assets";

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

    private static parseLocales(locales: string[]): string
    {
        let out = ``;

        for (let locale of locales) {
            out += `${locale}\n`;
        }

        return out;
    }
}