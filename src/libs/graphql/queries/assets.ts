export default {
    asset: `
        query asset($id: ID!) {
            asset(id: $id) {
                filename
                site_id
                name
                title {
                    #locale#
                }
                folder
                url
                filesize
                size {
                    width
                    height
                }
                is_image
                uploader {
                    _id
                    email
                    name {
                        first
                        last
                        full
                    }
                }
                created_at
                transforms {
                    transform
                    filename
                    name
                    url
                }
            }
        }
    `,
    assets: `
        query assets($page: Int!, $limit: Int!, $folder: String, $search: String, $sort: String, $direction: SortingOrder) {
            assets(page: $page, limit: $limit, folder: $folder, search: $search, sort: $sort, direction: $direction) {
                pagination {
                    current
                    totalPages
                    total
                }
                list {
                    filename
                    site_id
                    name
                    title {
                        #locale#
                    }
                    folder
                    url
                    filesize
                    size {
                        width
                        height
                    }
                    is_image
                    uploader {
                        _id
                        email
                        name {
                            first
                            last
                            full
                        }
                    }
                    created_at
                    transforms {
                        transform
                        filename
                        name
                        url
                    }
                }
            }
        }
    `,
}