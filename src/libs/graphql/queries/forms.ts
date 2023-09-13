export default {
    getForm: `
        query form($handle: String) {
            form(handle: $handle) {
                _id
                title
                handle
                settings {
                    to
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
                settings {
                    to
                    cc
                    bcc
                    success_email_handle
                }
            }
        }
    `,
    getFormEntries: `
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
    `,
    createForm: `
        mutation createForm($handle: String!, $title: String!, $fields: [String!]!, $settings: FormSettingsInput) {
            createForm(handle: $handle, title: $title, fields: $fields, settings: $settings)
        }
    `,
    updateForm: `
        mutation updateForm($id: ID!, $handle: String!, $title: String!, $form_layout_id: ID, $settings: FormSettingsInput) {
            updateForm(id: $id, handle: $handle, title: $title, form_layout_id: $form_layout_id, settings: $settings)
        }
    `,
    deleteForm: `
        mutation deleteForm($ids: [ID!]!) {
            deleteForm(ids: $ids)
        }
    `,
};
