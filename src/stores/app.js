// Utilities
import { writable } from 'svelte/store';

const store = () =>
{
    let store = {
        theme: 'light',
        currentTitle: '',
        breadcrumbs: [],
        graphQLURL: '',
        baseURL: '',
        locales: ['fr', 'en'],
        showGQLError: false,
        currentUser: {},
        isLoggedIn: false,
        configuration: {
            dataTypes: [],
            dynamicNavigationElements: { post_entries: [], pre_users: [], pre_settings: [] },
            dynamicSettingsElements: { entries: [], emails: [], others: [] },
            customLocales: { fr: [], en: [] }
        },
        assets: {
            currentPage: 1,
            maxPage: 1,
            selected: [],
            loadingMorePage: true,
            loadingPage: true,
            folders: [],
            config: { maxSize: 0, blacklist: [] }
        },
        guardCheck: null
    };

    const { subscribe, set, update} = writable(store);

    const setKeyValue = (key, value) =>
    {
        update((store) =>
        {
            store[key] = value;
            return store;
        });
    }

    const get = (key) =>
    {
        return store[key] || null;
    }

    const methods = {
        setBreadcrumbs: (list) => setKeyValue('breadcrumbs', list),
        setGraphQLURL: (url) => setKeyValue('graphQLURL', url),
        setBaseURL: (url) => setKeyValue('baseURL', url),
        setLocales: (locales) => setKeyValue('locales', locales),
        showGraphQLError: () => setKeyValue('showGQLError', true),
        setCurrentUser: (user) => setKeyValue('currentUser', user),
        setLoginState: (state) => setKeyValue('isLoggedIn', state),
        setGuardCheck: (guard) => setKeyValue('guardCheck', guard),
        setSettingsElements: (elements) =>
        {
            update((store) =>
            {
                store.configuration.dynamicSettingsElements = elements;
                return store;
            });
        },
        setNavigationElements: (elements) =>
        {
            update((store) =>
            {
                for (let element of elements.post_entries) {
                    // @ts-ignore
                    const keys = Object.keys(element.label);

                    for (let locale of keys) {
                        // @ts-ignore
                        store.configuration.customLocales[locale][element.slug] = element.label[locale];
                    }
                }

                for (let element of elements.pre_users) {
                    // @ts-ignore
                    const keys = Object.keys(element.label);

                    for (let locale of keys) {
                        // @ts-ignore
                        store.configuration.customLocales[locale][element.slug] = element.label[locale];
                    }
                }

                for (let element of elements.pre_settings) {
                    // @ts-ignore
                    const keys = Object.keys(element.label);

                    for (let locale of keys) {
                        // @ts-ignore
                        store.configuration.customLocales[locale][element.slug] = element.label[locale];
                    }
                }

                store.configuration.dynamicNavigationElements = elements;

                return store;
            });
        },
        setSelectedFile: (file, inout, multi) =>
        {
            update((store) =>
            {
                if (multi) {
                    if (!inout) {
                        // remove
                        store.assets.selected = this.assets.selected.filter(f => f!==file);
                    } else {
                        store.assets.selected.push(file);
                    }
                } else {
                    if (!inout) {
                        store.assets.selected = [];
                    } else {
                        store.assets.selected = [file];
                    }
                }
                return store;
            });
        },
        clearSelectedAssets: () =>
        {
            update((store) =>
            {
                store.assets.selected = [];
                return store;
            });
        },
        setAssetPagination: (current, total) =>
        {
            update((store) =>
            {
                store.assets.currentPage = current;
                store.assets.maxPage = total;
                return store;
            });
        },
        incrementAssetPage: () =>
        {
            update((store) =>
            {
                store.assets.currentPage++;
                return store;
            });
        },
        setLoadingPage: (status) =>
        {
            update((store) =>
            {
                store.assets.loadingPage = status;
                return store;
            });
        },
        setLoadingMorePage: (status) =>
        {
            update((store) =>
            {
                store.assets.loadingMorePage = status;
                return store;
            });
        },
        setAvailableFolders: (list) =>
        {
            update((store) =>
            {
                store.assets.folders = list;
                return store;
            });
        },
        setAssetConfig: (config) =>
        {
            update((store) =>
            {
                store.assets.config = config;
                return store;
            });
        },
        setDataTypes: (dataTypes) =>
        {
            update((store) =>
            {
                store.configuration.dataTypes = dataTypes;
                return store;
            });
        },
        customLocales: (locales) =>
        {
            update((store) =>
            {
                store.configuration.customLocales = locales;
                return store;
            });
        },
        getCurrentThirdPartyUI: (route) =>
        {
            let param = route.params.param;

            // @ts-ignore
            let found = store.configuration.dynamicNavigationElements.post_entries.find(n => n.url === param);

            if (!found) {
                // @ts-ignore
                found = store.configuration.dynamicNavigationElements.pre_users.find(n => n.url === param);

                if (!found) {
                    // @ts-ignore
                    found = store.configuration.dynamicNavigationElements.pre_settings.find(n => n.url === param);
                }
            }

            return found || null;
        },
        getCurrentThirdPartySettingsUI: (route) =>
        {
            let param = route.params.param;

            // @ts-ignore
            let found = store.configuration.dynamicSettingsElements.entries.find(n => n.url===param);

            if (!found) {
                // @ts-ignore
                found = store.configuration.dynamicSettingsElements.emails.find(n => n.url===param);

                if (!found) {
                    // @ts-ignore
                    found = store.configuration.dynamicSettingsElements.others.find(n => n.url===param);
                }
            }

            return found || null;
        }
    }

    return {
        subscribe,
        get,
        ...methods
    }
};

export const AppStore = store();