export default {
    homepageEntry: `
        query homepageEntry($locale: String!, $site_id: ID!) {
            homepageEntry(locale: $locale, site_id: $site_id) {
                _id
                entry_type_id
                parent {
                    handle
                    parent_id 
                }
                site_id
                locale
                alternates {
                    locale
                    entry_id
                }
                is_homepage
                status
                title
                template
                slug
                url
                authors {
                    created_by
                    updated_by
                    published_by
                    deleted_by
                }
                dates {
                    created
                    updated
                    published
                    deleted
                }
                categories
                content {
                    key
                    content
                    handle
                    type
                }
                schema {
                    key
                    fieldConfigs {
                        labels {
                            #locale#
                        }
                        handle
                        inputSettings {
                            inputKey
                            settings {
                                name
                                value
                                choices
                                type
                            }
                        }
                    }
                }
                seo {
                    entry_seo_id
                    title
                    alternates {
                        locale
                        entry_id
                    }
                    url
                    locale
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
        }
    `,
}