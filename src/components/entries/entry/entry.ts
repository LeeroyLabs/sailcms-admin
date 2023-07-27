import { ref } from "vue";
import { SailCMS } from "@/libs/graphql";

export const entry = ref({
    _id: '',
    entry_type: '',
    parent: null,
    site_id: SailCMS.getSiteId(),
    locale: SailCMS.getLocales()[0],
    alternates: [],
    is_homepage: false,
    publication: null,
    trashed: false,
    title: '',
    template: '',
    slug: '',
    url: '',
    authors: {
        created_by: null,
        updated_by: null,
        deleted_by: null
    },
    dates: {
        created: Math.floor(Date.now() / 1000),
        updated: Math.floor(Date.now() / 1000),
        deleted: 0,
    },
    categories: [],
    content: {
        html: '<p>This is the html code of the page!</p>'
    },
    seo: {
        title: '',
        alternates: [],
        url: '',
        locale: SailCMS.getLocales()[0],
        description: '',
        keywords: '',
        robots: false,
        sitemap: true,
        default_image: '',
        social_metas: []
    }
});
