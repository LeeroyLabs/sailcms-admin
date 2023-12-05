import { writable } from 'svelte/store';

export const Session = writable({
    user: null,
    loggedIn: false,
    id: "",
    token: "",
    incognito: false
});