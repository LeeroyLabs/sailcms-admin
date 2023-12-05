import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";

const httpLink = createHttpLink({
    // @ts-ignore
    uri: import.meta.env.VITE_BASE_URL,
    headers: {
        "x-access-token":
                localStorage.getItem("ssc") !== ""
                        ? localStorage.getItem("ssc")
                        : "no-token"
    }
});

const cache = new InMemoryCache({ addTypename: false });

export default new ApolloClient({
    link: httpLink,
    cache
});
