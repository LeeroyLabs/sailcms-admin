import { ApolloClient, createHttpLink, DocumentNode, InMemoryCache } from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { GraphQLError } from 'graphql';
import { SailCMS } from "../index";
import { GraphQLHeaders, GraphQLOutput } from "../types/general";
import { ApolloLink } from "@apollo/client/link/core";

let link: ApolloLink|null = null;

export class Client
{
    private static client: ApolloClient<any>;
    public static headers: GraphQLHeaders[] = [];

    constructor()
    {
        link = createHttpLink({
            uri: SailCMS.getURL(),
            fetch: fetch,
            // @ts-ignore
            headers: {
                ...Client.headers,
                'x-access-token': SailCMS.getToken(),
            }
        });

        const cache = new InMemoryCache({addTypename: false});
        Client.client = new ApolloClient({link, cache});
    }

    public version(): string
    {
        return '1.0.0-next.51';
    }

    /**
     *
     * Update the GraphQL client with the new headers and access token
     *
     */
    public static updateClient(): void
    {
        const authLink = setContext((_, { headers }) => {
            return {
                headers: {
                    ...Client.headers,
                    'x-access-token': SailCMS.getToken(),
                }
            }
        });

        const cache = new InMemoryCache({addTypename: false});
        Client.client = new ApolloClient({link: authLink.concat(link!), cache});
    }

    /**
     *
     * Execute a query on the server
     *
     * @param query
     * @param variables
     * @param useCache
     *
     */
    public async query(query: DocumentNode, variables: object, useCache: boolean = false): Promise<GraphQLOutput>
    {
        try {
            let response = await Client.client.query({
                query: query,
                variables: variables,
                fetchPolicy: useCache ? 'cache-first' : 'no-cache'
            });

            if (response.data) {
                return {error: null, detailed: null, data: response.data};
            }

            return {
                error: response.error?.message || 'unknown error',
                detailed: response.error,
                data: null
            }
        } catch (e) {
            let error = e as GraphQLError;

            return {
                error: error.message,
                detailed: error,
                data: null
            }
        }
    }

    /**
     *
     * Execute a mutation on the server
     *
     * @param query
     * @param variables
     *
     */
    public async mutation(query: DocumentNode, variables: object): Promise<GraphQLOutput>
    {
        try {
            let response = await Client.client.mutate({
                mutation: query,
                variables: variables
            });

            if (response.data) {
                return {error: null, detailed: null, data: response.data};
            }

            return {
                error: (response.errors) ? response.errors[0].toString() : 'unknown error',
                detailed: response.errors,
                data: null
            }
        } catch (e) {
            let error = e as GraphQLError;

            return {
                error: error.message,
                detailed: error,
                data: null
            }
        }
    }
}
