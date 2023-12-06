import { AppStore } from '@stores/app.js';
import { get } from 'svelte/store';

/**
 *
 * Check if current user has permission
 *
 * @param permission
 *
 */
export function hasPermission(permission)
{
    // Any, if you are logged in, you have it
    if (permission === 'any' || permission === '') return true;

    const userPermissions = get(AppStore).currentUser.permissions;

    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
}