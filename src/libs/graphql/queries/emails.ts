export default {
    email: `
        query email($id: ID!) {
            email(id: $id) {
                _id
                name
                slug
                subject {
                    #locale#
                }
                fields {
                    key
                    value {
                        #locale#
                    }
                }
                template
                created_at
                last_modified
            }
        }
    `,
    emails: `
        query emails($site_id: String!) {
            emails(site_id: $site_id) {
                _id
                name
                slug
                template
                created_at
                last_modified
            }
        }
    `,
    emailTemplates: `
        query emailTemplates($site_id: String!) {
            emailTemplates(site_id: $site_id) {
                name
                configs {
                    type
                    key
                    label {
                        #locale#
                    }
                }
            }
        }
    `,
    createEmail: `
        mutation createEmail($name: String!, $subject: LocaleFieldInput!, $fields: [EmailFieldInput!]!, $template: String!, $site_id: String!, $preview: Boolean) {
            createEmail(name: $name, subject: $subject, fields: $fields, template: $template, site_id: $site_id, preview: $preview)
        }
    `,
    createPreviewEmail: `
        mutation createPreviewEmail($name: String!, $subject: LocaleFieldInput!, $fields: [EmailFieldInput!]!, $template: String!, $site_id: String!) {
            createPreviewEmail(name: $name, subject: $subject, fields: $fields, template: $template, site_id: $site_id)
        }
    `,
    updateEmail: `
        mutation updateEmail($id: ID!, $name: String, $subject: LocaleFieldInput, $fields: [EmailFieldInput!]!, $template: String) {
            updateEmail(id: $id, name: $name, subject: $subject, fields: $fields, template: $template)
        }
    `,
    deleteEmails: `
        mutation deleteEmails($emails: [ID!]!) {
            deleteEmails(emails: $emails)
        }
    `
}
