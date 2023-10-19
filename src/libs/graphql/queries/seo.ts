export default {
    getSeoSettings: `
        query getSeoSettings {
            getSeoSettings {
                separator_character
                sitename
                sitename_position
                gtag
            }
        }
    `,
    getSeoDefaultConfig: `
        query getSeoDefaultConfig {
            getSeoDefaultConfig {
                title
                description
                keywords
                robots
                sitemap
                default_image
                social_metas {
                    handle
                    content {
                        name
                        content
                    }
                }
            }
        }
    `,
    getRedirection: `
        query getRedirection($id: ID!) {
            getRedirection(id: $id) {
                _id
                url
                redirect_url
                redirect_type
                hit_count
                last_attempt
            }
        }
    `,
    getRedirections: `
        query getRedirections($page: Int!, $limit: Int!, $search: String, $sort: String, $order: SortingOrder) {
            getRedirections(
                page: $page
                limit: $limit
                search: $search
                sort: $sort
                order: $order
            ) {
                pagination {
                    current
                    totalPages
                    total
                }
                list {
                    _id
                    url
                    redirect_url
                    redirect_type
                    hit_count
                    last_attempt
                }
            }
        }
    `,
    getBrokenLinks: `
        query getBrokenLinks($page: Int!, $limit: Int!, $search: String, $sort: String, $order: SortingOrder) {
            getBrokenLinks(
                page: $page
                limit: $limit
                search: $search
                sort: $sort
                order: $order
            ) {
                pagination {
                    current
                    totalPages
                    total
                }
                list {
                    url
                    hit_count
                    last_attempt
                }
            }
        }
    `,
    generateSitemap: `
        mutation generateSitemap($template: String!) {
            generateSitemap(template: $template)
        }
    `,
    generateRobot: `
        mutation generateRobot($template: String!) {
            generateRobot(template: $template)
        }
    `,
    setSeoDefaultConfig: `
        mutation setSeoDefaultConfig($config: SeoDefaultConfigInput) {
            setSeoDefaultConfig(config: $config)
        }
    `,
    setSeoSettings: `
        mutation setSeoSettings($settings: SeoSettingsInput) {
            setSeoSettings(settings: $settings)
        }
    `,
    createRedirection: `
        mutation createRedirection ($url: String!, $redirect_url: String!, $redirect_type: RedirectType!) {
            createRedirection (url: $url, redirect_url: $redirect_url, redirect_type: $redirect_type)
        }
    `,
    updateRedirection: `
        mutation updateRedirection ($id: ID!, $url: String!, $redirect_url: String!, $redirect_type: RedirectType!) {
            updateRedirection (id: $id, url: $url, redirect_url: $redirect_url, redirect_type: $redirect_type)
        }
    `,
    deleteRedirection: `
        mutation deleteRedirection ($ids: [ID!]!) {
            deleteRedirection (ids: $ids)
        }
    `,
};
