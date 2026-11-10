import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const TOKEN_KEY = "financy:token";

const httpLink = new HttpLink({
    uri: import.meta.env.VITE_BACKEND_URL,
    fetch: (uri, options) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const headers = new Headers(options?.headers);
        if (token) headers.set("Authorization", `Bearer ${token}`);
        return fetch(uri, { ...options, headers });
    },
});

export const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
});
