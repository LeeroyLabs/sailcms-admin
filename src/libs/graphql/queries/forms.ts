export default {
    getForm: `
        query form($handle: String) {
            form(handle: $handle) {
                _id
                title
                handle
                form_layout_id
                settings {
                    from
                    to
                    subject {
                        en
                        fr
                    }
                    cc
                    bcc
                    success_email_handle
                }
            }
        }
    `,
    getForms: `
        query forms {
            forms {
                _id
                title
                handle
                form_layout_id
                settings {
                    from
                    to
                    subject {
                        en
                        fr
                    }
                    cc
                    bcc
                    success_email_handle
                }
            }
        }
    `,
    formLayout: `
        query formLayout($id: ID!) {
            formLayout(id: $id) {
                _id
                slug
                titles {
                    fr
                    en
                }
                schema {
                    label
                    fields {
                        _id
                        key
                        name
                        label {
                            en
                            fr
                        }
                        placeholder {
                            en
                            fr
                        }
                        explain {
                            en
                            fr
                        }
                        validation
                        required
                        repeatable
                        searchable!
                        type
                        config
                    }
                }
                authors {
                    created_by {
                        _id
                    }
                    updated_by {
                        _id
                    }
                    deleted_by {
                        _id
                    }
                }
                dates {
                    created
                    updated
                    deleted
                }
                is_trashed
              }
            }
        }
    `,
    formLayouts: `
        query formLayout {
            formLayout {
                _id
                slug
                titles {
                    fr
                    en
                }
                schema {
                    label
                    fields {
                        _id
                        key
                        name
                        label {
                            en
                            fr
                        }
                        placeholder {
                            en
                            fr
                        }
                        explain {
                            en
                            fr
                        }
                        validation
                        required
                        repeatable
                        searchable!
                        type
                        config
                    }
                }
                authors {
                    created_by {
                        _id
                    }
                    updated_by {
                        _id
                    }
                    deleted_by {
                        _id
                    }
                }
                dates {
                    created
                    updated
                    deleted
                }
                is_trashed
              }
            }
        }
    `,
    formEntry: `
        query formEntry($id: ID!, $form_handle: String!) {
            formEntry(id: $id, form_handle: $form_handle) {
                form_handle
                locale
                title
                template
                dates {
                    created
                    updated
                    deleted
                }
                content
                site_id
              }
            }
        }
    `,
    formEntries: `
        query formEntries($form_handle: String!, $page: Int!, $limit: Int!, $dateSearch: FormDate, $search: String, $sort: String, $order: SortingOrder) {
            formEntries(form_handle: $form_handle, page: $page, limit: $limit, dateSearch: $dateSearch, search: $search, sort: $sort, order: $order) {
                form_handle
                locale
                title
                template
                dates {
                    created
                    updated
                    deleted
                }
                content
                site_id
              }
            }
        }
    `,
    createForm: `
        mutation createForm($handle: String!, $title: String!, $form_layout_id: ID, $settings: FormSettingsInput) {
            createForm(handle: $handle, title: $title, form_layout_id: $form_layout_id, settings: $settings)
        }
    `,
    updateForm: `
        mutation updateForm($id: ID!, $handle: String!, $title: String!, $form_layout_id: ID, $settings: FormSettingsInput) {
            updateForm(id: $id, handle: $handle, title: $title, form_layout_id: $form_layout_id, settings: $settings)
        }
    `,
    deleteForm: `
        mutation deleteForm($id: ID!) {
            deleteForm(id: $id)
        }
    `,
    createFormLayout: `
        mutation createFormLayout($title: String!, $schema: [EntryLayoutTabInput!]!, $slug: String) {
            createFormLayout(title: $title, schema: $schema, slug: $slug) {
                _id
                slug
                title
                authors {
                    created_by {
                        _id
                    }
                     updated_by {
                        _id
                    }
                    deleted_by {
                        _id
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
                schema {
                    label
                    fields {
                        _id
                        name
                    }
                }
            }
        }
    `,
};
