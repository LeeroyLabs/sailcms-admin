export default {
    navigation: `
        query navigation($slug: String!) {
            navigation(slug: $slug) {
                label
                url
                is_entry
                entry_id
                external
                children {
                  label
                  url
                  is_entry
                  entry_id
                  external
                  children {
                    label
                    url
                    is_entry
                    entry_id
                    external
                    children {
                        label
                        url
                        is_entry
                        entry_id
                        external
                        children {
                            label
                            url
                            is_entry
                            entry_id
                            external
                        }
                    }
                  }
                }
            }
        }
    `,
    navigationDetailsList: `
        query navigationDetailsList($sort: String!, $direction: SortingOrder!, $locale: String, $site_id: String) {
            navigationDetailsList(sort: $sort, direction: $direction, locale: $locale, site_id: $site_id) {
                _id
                title
                slug
                locale
                structure {
                    label
                    url
                    is_entry
                    is_category
                    entry_id
                    external
                    children {
                        label
                        url
                        is_entry
                        is_category
                        entry_id
                        external
                        children {
                            label
                            url
                            is_entry
                            is_category
                            entry_id
                            external
                            children {
                                label
                                url
                                is_entry
                                is_category
                                entry_id
                                external
                                children {
                                    label
                                    url
                                    is_entry
                                    is_category
                                    entry_id
                                    external
                                }
                            }
                        }
                    }
                }
            }
        }
    `,
    navigationDetails: `
        query navigationDetails($slug: String!) {
            navigationDetails(slug: $slug) {
                _id
                title
                slug
                structure {
                    label
                    url
                    is_entry
                    is_category
                    entry_id
                    external
                    children {
                        label
                        url
                        is_entry
                        is_category
                        entry_id
                        external
                        children {
                            label
                            url
                            is_entry
                            is_category
                            entry_id
                            external
                            children {
                                label
                                url
                                is_entry
                                is_category
                                entry_id
                                external
                                children {
                                    label
                                    url
                                    is_entry
                                    is_category
                                    entry_id
                                    external
                                 }
                             }
                         }
                     }
                }
                locale
            }
        }
    `,
    createNavigation: `
        mutation createNavigation($title: String!, $slug: String!, $structure: [NavigationItemInput!]!, $locale: String!, $site_id: String!) {
            createNavigation(title: $title, slug: $slug, structure: $structure, locale: $locale, site_id: $site_id)
        }
    `,
    updateNavigation: `
        mutation updateNavigation($id: ID!, $title: String!, $slug: String!, $structure: [NavigationItemInput!]!, $locale: String!) {
            updateNavigation(id: $id, title: $title, slug: $slug, structure: $structure, locale: $locale)
        }
    `,
    deleteNavigation: `
        mutation deleteNavigation($ids: [ID!]!) {
            deleteNavigation(ids: $ids)
        }
    `,
};
