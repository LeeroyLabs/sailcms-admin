import { writable } from 'svelte/store';

export const Message = writable({
    show: false,
    message: '',
    type: 'error',
    ttl: 5000
});