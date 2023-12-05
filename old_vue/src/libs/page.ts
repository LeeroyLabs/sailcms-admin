import { watch } from "vue";
import { i18n } from "@/plugins/i18n";
import { useAppStore } from "@/store/app";

const store = useAppStore();

const usePage = () =>
{
    return new PageHandler();
}

class PageHandler
{
    private crumbs: Crumb[];
    private title: string = '';

    constructor()
    {
        this.crumbs = [];
        watch(i18n.global.locale, () => this.runSetup());
    }

    public setPageTitle(title: string, untranslatedPart: string = ''): void
    {
        this.title = title;
        const extra = (untranslatedPart.trim() !== '') ? ' ' + untranslatedPart : '';

        // @ts-ignore
        store.setPageTitle(i18n.global.t(title) + extra);
        document.title = `${i18n.global.t(title)}${extra} — SailCMS`;
    }

    public setBreadcrumbs(crumbs: Crumb[]): void
    {
        this.crumbs = crumbs;

        let crumbArr = [{title: "Dashboard", disable: false, to: "/dashboard"}];

        for (let crumb of crumbs) {
            // @ts-ignore
            crumbArr.push({title: i18n.global.t(crumb.title), disable: crumb.disable, to: crumb.to});
        }

        store.setBreadcrumbs(crumbArr);
    }

    private runSetup()
    {
        this.setPageTitle(this.title);
        this.setBreadcrumbs(this.crumbs);
    }
}

export type Crumb = {
    title: string;
    disable: boolean;
    to: string|object;
};

export { usePage };
