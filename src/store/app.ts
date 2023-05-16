// Utilities
import { defineStore } from 'pinia';
import { User } from "@/libs/graphql/types/users";
import { Folder } from "@/libs/graphql/types/assets";

const toastLength = 3_500;

export const useAppStore = defineStore('app', {
    state: () => ({
        theme: 'light',
        currentTitle: '',
        breadcrumbs: [] as any[],
        graphQLURL: '',
        baseURL: '',
        showGQLError: false,
        currentUser: {} as User,
        isLoggedIn: false,
        toast: {
            show: false,
            text: '',
            mode: 'success'
        },
        assets: {
            currentPage: 1,
            maxPage: 1,
            selected: [] as string[],
            loadingPage: true,
            folders: [] as Folder[]
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
        setAvailableFolders(list: Folder[])
        {
            this.assets.folders = list;
        }
    }
});
