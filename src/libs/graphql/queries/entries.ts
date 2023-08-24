export default {
    entryTypes: `
        query entryTypes {
            entryTypes {
                _id
                title
                handle
                url_prefix {
                    #locale#
                }
                entry_layout_id
            }
        }
    `,
    entryType: `
        query entryType($handle: String!) {
            entryType(handle: $handle) {
                _id
                title
                handle
                url_prefix {
                    #locale#
                }
                entry_layout_id
            }
        }
    `,
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
    createEntryType: `
        mutation createEntryType($handle: String!, $title: String!, $url_prefix: LocaleFieldInput!) {
            createEntryType(handle: $handle, title: $title, url_prefix: $url_prefix) {
                title
            }
       }
    `,
    updateEntryType: `
        mutation updateEntryType($handle: String!, $title: String!, $url_prefix: LocaleFieldInput!) {
            updateEntryType(handle: $handle, title: $title, url_prefix: $url_prefix)
       }
    `,
    deleteEntryType: `
        mutation deleteEntryType($id: ID!) {
            deleteEntryType(id: $id)
        }
    `,
    entryLayouts: `
        query entryLayouts {
            entryLayouts {
                _id
                slug
                title
                schema {
                    label
                    fields {
                        _id
                        key
                        name
                        label {
                            #locale#
                        }
                        placeholder {
                            #locale#
                        }
                        explain {
                            #locale#
                        }
                        validation
                        required
                        repeatable
                        type
                        config
                    }
                }
                authors {
                    created_by {
                        _id
                        name {
                            full
                        }
                    }
                }
                dates {
                    updated
                }
                is_trashed
                record_count
                used_by
            }
        }
    `,
    fields: `
        query fields {
            entryFields {
                _id
                key
                name
                label {
                    #locale#
                }
                placeholder {
                    #locale#
                }
                explain {
                    #locale#
                }
                repeatable
                validation
                required
                type
                config
            }
        }
    `,
    createEntryLayout: `
        mutation createEntryLayout($titles: LocaleFieldInput!, $schema: [EntryLayoutTabInput!]!, $slug: String) {
            createEntryLayout(titles: $titles, schema: $schema, slug: $slug) {
                _id
            }
        }
    `,
    entryLayout: `
        query entryLayoutById($id: ID!) {
            entryLayoutById(id: $id) {
                _id
                slug
                title
                schema {
                    label
                    fields {
                        _id
                        key
                        name
                        label {
                            #locale#
                        }
                        placeholder {
                            #locale#
                        }
                        explain {
                            #locale#
                        }
                        validation
                        required
                        repeatable
                        type
                        config
                        width
                    }
                }
                authors {
                    created_by {
                        _id
                        name {
                            full
                        }
                    }
                    updated_by {
                        _id
                        name {
                            full
                        }
                    }
                    deleted_by {
                        _id
                        name {
                            full
                        }
                    }
                }
                dates {
                    created
                    updated
                    deleted
                }
                is_trashed
                used_by
                record_count
            }
        }
    `,
    entryField: `
        query entryField($key: String!) {
            entryField(key: $key) {
                _id
                key
                name
                label {
                    #locale#
                }
                placeholder {
                    #locale#
                }
                explain {
                    #locale#
                }
                validation
                required
                repeatable
                type
                config
            }
        }
    `,
    createEntryField: `
        mutation createEntryField($key: String!, $name: String!, $label: LocaleFieldInput!, $placeholder: LocaleFieldInput, $explain: LocaleFieldInput, $type: String!, $validation: String, $repeatable: Boolean, $required: Boolean!, $config: Json) {
            createEntryField(key: $key, name: $name, label: $label, placeholder: $placeholder, explain: $explain, type: $type, validation: $validation, repeatable: $repeatable, required: $required, config: $config) {
                _id
            }
        }
    `,
    updateEntryField: `
        mutation updateEntryField($_id: ID!, $name: String, $label: LocaleFieldInput, $placeholder: LocaleFieldInput, $explain: LocaleFieldInput, $type: String, $validation: String, $repeatable: Boolean, $required: Boolean, $config: Json) {
            updateEntryField(id: $_id, name: $name, label: $label, placeholder: $placeholder, explain: $explain, type: $type, validation: $validation, repeatable: $repeatable, required: $required, config: $config)
        }
    `,
    entryFieldValidateKey: `
        query entryFieldValidateKey($key: String!) {
            entryFieldValidateKey(key: $key)
        }
    `,
    deleteEntryFields: `
        mutation deleteEntryFields($ids: [ID!]!) {
            deleteEntryFields(ids: $ids)
        }
    `,
    updateEntryLayout: `
        mutation updateEntryLayout($id: ID!, $title: String!, $schema: [EntryLayoutTabInput!]!, $slug: String!) {
            updateEntryLayout(id: $id, title: $title, schema: $schema, slug: $slug)
        }
    `,
    deleteEntryLayouts: `
        mutation deleteEntryLayouts($ids: [ID!]!) {
            deleteEntryLayouts(ids: $ids)
        }
    `,
    restoreEntryLayouts: `
        mutation restoreEntryLayouts($ids: [ID!]!) {
            restoreEntryLayouts(ids: $ids)
        }
    `,
    entries: `
        query entries($entry_type_handle: String!, $page: Int, $limit: Int, $search: String, $sort: String, $direction: Int, $only_trash: Boolean, $locale: String) {
            entries(entry_type_handle: $entry_type_handle, page: $page, limit: $limit, search: $search, sort: $sort, direction: $direction, only_trash: $only_trash, locale: $locale) {
                pagination {
                    current
                    totalPages
                    total
                }
                list {
                    _id
                    site_id
                    locale
                    alternates {
                        locale
                        url
                        entry_id
                    }
                    is_homepage
                    publication {
                        _id
                        entry_id
                        dates {
                            published
                            expired
                        }
                        site_id
                        user_full_name
                        user_email
                    }
                    trashed
                    title
                    slug
                    authors {
                        created_by {
                            name {
                                full
                            }
                        }
                        updated_by {
                            name {
                                full
                            }
                        }
                        deleted_by {
                            name {
                                full
                            }
                        }
                    }
                    dates {
                        created
                        updated
                        deleted
                    }
                }
            }
        }
    `,
    entry: `
        query entry($id: ID!, entry_type_handle: String!) {
            entry(id: $id, entry_type_handle: $entry_type_handle) {
                _id
                entry_type {
                    _id
                    handle
                    title
                    url_prefix {
                        #locale#
                    }
                    entry_layout_id
                    use_categories
                }
                parent {
                    _id
                    title
                    locale
                    url
                    slug
                }
                site_id
                locale
                alternates {
                    locale
                    url
                    entry_id
                }
                is_homepage
                publication {
                    _id
                    entry_id
                    version {
                        _id
                        created_at
                        user_full_name
                        entry_id
                        entry {
                            _id
                            title
                        }
                    }
                    dates {
                        published
                        expired
                    }
                    site_id
                    entry_url
                    user_full_name
                    user_email
                }
                trashed
                title
                template
                slug
                url
                authors {
                    created_by {
                        name {
                            full
                        }
                    }
                    updated_by {
                        name {
                            full
                        }
                    }
                    deleted_by {
                        name {
                            full
                        }
                    }
                }
                dates {
                    created
                    updated
                    deleted
                }
                categories {
                    _id
                    name {
                        #locale#
                    }
                    slug
                    order
                    parent_id
                    children
                }
                content {
                    key
                    content
                }
                seo {
                    _id
                    title
                    alternates {
                        locale
                        url
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
    entriesForListing: `
        query entriesForListing($locale: String!, $type: String!) {
            query entriesForListing(locale: $locale, type: $type) {
                _id
                title
            }
        }
    `
}
