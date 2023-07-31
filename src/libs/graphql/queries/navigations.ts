export default {
    navigation: `
        query navigation($name: String!) {
            navigation(name: $name) {
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
                name
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
        query navigationDetails($name: String!) {
            navigationDetails(name: $name) {
                _id
                title
                name
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
        mutation createNavigation($name: String!, $structure: [NavigationItemInput!]!, $locale: String!, $site_id: String!) {
            createNavigation(name: $name, structure: $structure, locale: $locale, site_id: $site_id)
        }
    `,
    updateNavigation: `
        mutation updateNavigation($id: ID!, $title: String!, $name: String!, $structure: [NavigationItemInput!]!, $locale: String!) {
            updateNavigation(id: $id, title: $title, name: $name, structure: $structure, locale: $locale)
        }
    `,
    deleteNavigation: `
        mutation deleteNavigation($id: ID!) {
            deleteNavigation(id: $id)
        }
    `,
};
