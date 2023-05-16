export default {
    asset: `
        query asset($id: ID!) {
            asset(id: $id) {
                _id
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
                    _id
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
    folders: `
        query folders {
            assetFolders {
                slug
                name
                deletable
            }
        }
    `,
    moveFiles: `
        mutation moveFiles($ids: [ID!]!, $folder: String!) {
            moveFiles(ids: $ids, folder: $folder)
        }
    `,
    addFolder: `
        mutation addFolder($folder: String!) {
            addFolder(folder: $folder)
        }
    `,
    removeFolder: `
        mutation removeFolder($folder: String!, $move_to: String!) {
            removeFolder(folder: $folder, move_to: $move_to)
        }
    `,
    removeAssets: `
        mutation removeAssets($assets: [ID!]!) {
            removeAssets(assets: $assets)
        }
    `
}
