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
                                }
                            }
                        }
                    }
                }
            }
        }
    `,
    createCategory: `
        mutation createCategory($name: LocaleFieldInput!, $parent_id: ID!, $site_id: String!) {
            createCategory(name: $name, parent_id: $parent_id, site_id: $site_id)
        }
    `,
    updateCategory: `
        mutation updateCategory($id: ID!, $name: LocaleFieldInput!, $parent_id: ID!) {
            updateCategory(id: $id, name: $name, parent_id: $parent_id)
        }
    `,
    updateCategoryOrders: `
        mutation updateCategoryOrders($tree: [CategorySortItem!]!, $site_id: String!) {
            updateCategoryOrders(tree: $tree, site_id: $site_id)
        }
    `,
    deleteCategory: `
        mutation deleteCategory($id: ID!) {
            deleteCategory(id: $id)
        }
    `,
};
