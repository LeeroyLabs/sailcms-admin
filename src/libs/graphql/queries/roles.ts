export default {
    role: `
        query role($id: ID!) {
            role(id: $id) {
                role {
                    _id
                    name
                    description
                    slug
                    level
                    permissions
                }
                allowedPermissions
                permissions {
                    group
                    type
                    value
                } 
            }
        }
    `,
    roles: `
        query roles {
            roles {
                _id
                name
                description
                slug
                level
                permissions
            }
        }
    `
}