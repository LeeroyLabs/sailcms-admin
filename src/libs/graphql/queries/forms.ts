export default {
    getForm: `
        query form($id: ID!) {
            form(id: $id) {
                _id
                title
                handle
                fields
                settings {
                    to
                    cc
                    bcc
                    success_email_handle
                    action
                    entry_title
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
                fields
                settings {
                    to
                    cc
                    bcc
                    success_email_handle
                    action
                    entry_title
                }
            }
        }
    `,
    getFormEntries: `
        query formEntries($form_handle: String!, $page: Int!, $limit: Int!, $dateSearch: FormDate, $search: String, $sort: String, $order: SortingOrder) {
            formEntries(form_handle: $form_handle, page: $page, limit: $limit, dateSearch: $dateSearch, search: $search, sort: $sort, order: $order) {
                pagination {
                    current
                    totalPages
                    total
                }
                list {
                    _id
                    form_handle
                    locale
                    title
                    template
                    dates {
                        created
                        updated
                        deleted
                    }
                    content {
                        key
                        value
                    }
                    site_id
                    viewed
                }
            }
        }
    `,
    createForm: `
        mutation createForm($handle: String!, $title: String!, $fields: [String!]!, $settings: FormSettingsInput) {
            createForm(handle: $handle, title: $title, fields: $fields, settings: $settings)
        }
    `,
    updateForm: `
        mutation updateForm($id: ID!, $handle: String!, $title: String!, $fields: [String!]!, $settings: FormSettingsInput) {
            updateForm(id: $id, handle: $handle, title: $title, fields: $fields, settings: $settings)
        }
    `,
    deleteForm: `
        mutation deleteForm($ids: [ID!]!) {
            deleteForm(ids: $ids)
        }
    `,
    viewedFormEntry: `
        mutation viewedFormEntry($id: ID!, $form_handle: String!) {
            viewedFormEntry(id: $id, form_handle: $form_handle)
        }
    `,
    deleteFormEntry: `
        mutation deleteFormEntry($ids: [ID!]!, $form_handle: String!) {
            deleteFormEntry(ids: $ids, form_handle: $form_handle)
        }
    `,
};
