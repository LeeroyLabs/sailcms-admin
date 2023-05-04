import { User } from "@/libs/graphql/types/users";
import { useAppStore } from "@/store/app";

/**
 *
 * Is the user an admin
 *
 */
export function isAdmin(user: User|null): boolean
{
    const store = useAppStore();

    if (user) {
        return (user.roles.includes('administrator') || user.roles.includes('super-administrator'));
    }

    const currentUser = store.currentUser;
    return (currentUser.roles.includes('administrator') || currentUser.roles.includes('super-administrator'));
}

/**
 *
 * Check if current user has permission
 *
 * @param permission
 *
 */
export function hasPermission(permission: string): boolean
{
    // Any, if you are logged in, you have it
    if (permission === 'any' || permission === '') return true;

    const store = useAppStore();
    const userPermissions = store.currentUser.permissions;

    if (userPermissions.includes('*')) return true;
    return userPermissions.includes(permission);
}

// ================================= Export utilities to global scope of the window ================================= //

declare global {
    interface Window {
        hasPermission: Function;
        isAdmin: Function
        baseURL: String
    }
}

window.hasPermission = hasPermission;
window.isAdmin = isAdmin;
