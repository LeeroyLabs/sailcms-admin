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
    `
}
