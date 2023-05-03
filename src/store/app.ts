// Utilities
import { defineStore } from 'pinia';
import { User } from "@/libs/graphql/types/users";

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
        }
    }
});
