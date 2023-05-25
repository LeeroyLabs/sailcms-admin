export default {
    categoryFullTree: `
    query categoryFullTree($parent_id: ID!, $site_id: String!) {
        categoryFullTree(parent_id: $parent_id, site_id: $site_id) {
            _id
            name {
                en
                fr
            }
            slug
            order
            parent_id
            children {
                _id
                name {
                    en
                    fr
                }
                slug
                order
                parent_id
                children {
                    _id 
                }
            }
    }
`,
};
