// Utilities
import { defineStore } from 'pinia';
import { User } from "@/libs/graphql/types/users";
import { AssetConfig, Folder } from "@/libs/graphql/types/assets";
import { data } from "autoprefixer";

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
        }
    }
});
