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
                title {
                    #locale#
                }
                content {
                    #locale#
                }
                cta {
                    #locale#
                }
                cta_title {
                    #locale#
                }
                template
                created_at
                last_modified
            }
        }
    `,
    emails: `
        query {
            emails {
                _id
                name
                slug
                subject {
                    #locale#
                }
                title {
                    #locale#
                }
                content {
                    #locale#
                }
                cta {
                    #locale#
                }
                cta_title {
                    #locale#
                }
                template
                created_at
                last_modified
            }
        }
    `
}