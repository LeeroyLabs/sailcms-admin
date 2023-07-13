// Utilities
import { defineStore } from 'pinia';
import { User } from "@/libs/graphql/types/users";
import { AssetConfig, Folder } from "@/libs/graphql/types/assets";
import { RouteLocationNormalizedLoaded } from "vue-router";

const toastLength = 3_500;

export const useAppStore = defineStore('app', {
    state: () => ({
        theme: 'light',
        currentTitle: '',
        breadcrumbs: [] as any[],
        graphQLURL: '',
        baseURL: '',
        locales: ['fr', 'en'],
        showGQLError: false,
        currentUser: {} as User,
        isLoggedIn: false,
        configuration: {
            dataTypes: [] as any[],
            dynamicNavigationElements: {post_entries: [], pre_users: [], pre_settings: []},
            dynamicSettingsElements: {entries: [], emails: [], others: []},
            customLocales: {fr: [], en: []}
        },
        toast: {
            show: false,
            text: '',
            mode: 'success'
        },
        assets: {
            currentPage: 1,
            maxPage: 1,
            selected: [] as string[],
            loadingMorePage: true,
            loadingPage: true,
            folders: [] as Folder[],
            config: {maxSize: 0, blacklist: []} as AssetConfig
        }
    }),
    actions: {
        setCurrentTheme(theme: string)
        {
            this.theme = theme;
        },
        setPageTitle(title: string)
        {
            this.currentTitle = title;
        },
        setBreadcrumbs(list: any[])
        {
            this.breadcrumbs = [];
            this.breadcrumbs = list;
        },
        setGraphQLURL(url: string)
        {
            this.graphQLURL = url;
        },
        setBaseURL(url: string)
        {
            this.baseURL = url;
        },
        setLocales(locales: string[])
        {
            this.locales = locales;
        },
        showGraphQLError()
        {
            this.showGQLError = true;
        },
        setNavigationElements(elements: object)
        {
            // @ts-ignore
            for (let element of elements.post_entries) {
                // @ts-ignore
                const keys = Object.keys(element.label);

                for (let locale of keys) {
                    // @ts-ignore
                    this.configuration.customLocales[locale][element.slug] = element.label[locale];
                }
            }

            // @ts-ignore
            for (let element of elements.pre_users) {
                // @ts-ignore
                const keys = Object.keys(element.label);

                for (let locale of keys) {
                    // @ts-ignore
                    this.configuration.customLocales[locale][element.slug] = element.label[locale];
                }
            }

            // @ts-ignore
            for (let element of elements.pre_settings) {
                // @ts-ignore
                const keys = Object.keys(element.label);

                for (let locale of keys) {
                    // @ts-ignore
                    this.configuration.customLocales[locale][element.slug] = element.label[locale];
                }
            }

            // @ts-ignore
            this.configuration.dynamicNavigationElements = elements;
        },
        setSettingsElements(elements: object)
        {
            // @ts-ignore
            this.configuration.dynamicSettingsElements = elements;
        },
        setCurrentUser(user: User|null)
        {
            // @ts-ignore
            this.currentUser = user;
        },
        setLoginState(state: boolean)
        {
            this.isLoggedIn = state;
        },
        displayToast(mode: string, message: string)
        {
            this.toast.text = message;
            this.toast.mode = (mode === 'error') ? 'error' : 'success';
            this.toast.show = true;

            setTimeout(() =>
            {
                this.toast.show = false;
            }, toastLength);
        },
        setSelectedFile(file: string, inout: boolean, multi: boolean)
        {
            if (multi) {
                if (!inout) {
                    // remove
                    this.assets.selected = this.assets.selected.filter(f => f !== file);
                } else {
                    this.assets.selected.push(file);
                }
            } else {
                if (!inout) {
                    this.assets.selected = [];
                } else {
                    this.assets.selected = [file];
                }
            }
        },
        clearSelectedAssets()
        {
            this.assets.selected = [];
        },
        setAssetPagination(current: number, total: number)
        {
            this.assets.currentPage = current;
            this.assets.maxPage = total;
        },
        incrementAssetPage()
        {
            this.assets.currentPage++;
        },
        setLoadingPage(status: boolean)
        {
            this.assets.loadingPage = status;
        },
        setLoadingMorePage(status: boolean)
        {
            this.assets.loadingMorePage = status;
        },
        setAvailableFolders(list: Folder[])
        {
            this.assets.folders = list;
        },
        setAssetConfig(config: AssetConfig)
        {
            this.assets.config = config;
        },
        setDataTypes(dataTypes: any[])
        {
            this.configuration.dataTypes = dataTypes;
        },
        customLocales(locales: object)
        {
            // @ts-ignore
            this.configuration.customLocales = locales;
        },
        getCurrentThirdPartyUI(route: RouteLocationNormalizedLoaded): object|null
        {
            let param = route.params.param;

            // @ts-ignore
            let found = this.configuration.dynamicNavigationElements.post_entries.find(n => n.url === param);

            if (!found) {
                // @ts-ignore
                found = this.configuration.dynamicNavigationElements.pre_users.find(n => n.url === param);

                if (!found) {
                    // @ts-ignore
                    found = this.configuration.dynamicNavigationElements.pre_settings.find(n => n.url === param);
                }
            }

            return found || null;
        },
        getCurrentThirdPartySettingsUI(route: RouteLocationNormalizedLoaded): object|null
        {
            let param = route.params.param;

            // @ts-ignore
            let found = this.configuration.dynamicSettingsElements.entries.find(n => n.url === param);

            if (!found) {
                // @ts-ignore
                found = this.configuration.dynamicSettingsElements.emails.find(n => n.url === param);

                if (!found) {
                    console.log(this.configuration.dynamicSettingsElements);
                    // @ts-ignore
                    found = this.configuration.dynamicSettingsElements.others.find(n => n.url === param);
                    console.log("HERE");
                }
            }

            return found || null;
        }
    }
});
