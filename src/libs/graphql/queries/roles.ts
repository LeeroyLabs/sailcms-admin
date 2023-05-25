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
                    member_count
                }
                allowedPermissions
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
                member_count
                permissions
            }
        }
    `,
    permissions: `
        query permissions {
            permissions {
                name
                category
                group
                unnormalized_name
                description {
                    fr
                    en
                }
            }
        }
    `,
    createRole: `
        mutation createRole($name: String!, $description: String!, $level: Int!, $permissions: [String!]!) {
            createRole(name: $name, description: $description, level: $level, permissions: $permissions)
        }
    `,
    updateRole: `
        mutation updateRole($id: ID!, $name: String, $description: String, $level: Int, $permissions: [String!]) {
            updateRole(id: $id, name: $name, description: $description, level: $level, permissions: $permissions)
        }
    `
}
