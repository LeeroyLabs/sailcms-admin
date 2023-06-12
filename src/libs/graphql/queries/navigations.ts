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
    mutation updateNavigation($id: ID!, $name: String!, $structure: [NavigationItemInput!]!, $locale: String!) {
        updateNavigation(id: $id, name: $name, structure: $structure, locale: $locale)
    }
`,
};
