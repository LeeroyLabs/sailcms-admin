import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";
import { setContext } from '@apollo/client/link/context';
import { SailCMS } from "@graphql/index";

export class Client
{
    static client;
    static headers = [];

    static link = null;

    constructor()
    {
        Client.link = createHttpLink({
            uri: SailCMS.getURL(),
            fetch: fetch,
            // @ts-ignore
            headers: {
                ...Client.headers,
                'x-access-token': SailCMS.getToken(),
            }
        });

        const cache = new InMemoryCache({addTypename: false});
        Client.client = new ApolloClient({link: Client.link, cache});
    }

    version()
    {
        return '1.0.0';
    }

    /**
     *
     * Update the GraphQL client with the new headers and access token
     *
     */
    static updateClient()
    {
        // const authLink = setContext((_, { headers }) => {
        //     return {
        //         headers: {
        //             ...Client.headers,
        //             'x-access-token': SailCMS.getToken(),
        //         }
        //     }
        // });
        //
        // const cache = new InMemoryCache({addTypename: false});
        // Client.client = new ApolloClient({link: authLink.concat(Client.link), cache});
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
    async query(query, variables, useCache = false)
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
            let error = e;

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
    async mutation(query, variables)
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
            let error = e;

            return {
                error: error.message,
                detailed: error,
                data: null
            }
        }
    }
}
