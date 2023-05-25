export default {
    group: `
        query group($id: ID!) {
            group(id: $id) {
                _id
                name
                slug
            }
        }
    `,
    groups: `
        query groups {
            groups {
                _id
                name
                slug
            }
        }
    `,
    deleteGroup: `
        mutation deleteGroup($id: ID!) {
            deleteGroup(id: $id)
        }
    `,
    createGroup: `
        mutation createGroup($name: String!) {
            createGroup(name: $name)
        }
    `,
    updateGroup: `
        mutation updateGroup($id: ID!, $name: String!) {
            updateGroup(id: $id, name: $name)
        }
    `
}
