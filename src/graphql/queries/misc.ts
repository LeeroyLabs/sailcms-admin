export default {
    registeredExtensions: `
        query registeredExtensions {
            registeredExtensions {
                modules {
                    name
                    info {
                        name
                        description
                        version
                        semver
                        author
                        link
                    }
                    class
                    middlewares {
                        type
                        name
                    }
                }
                containers {
                    name
                    info {
                        name
                        description
                        version
                        semver
                        author
                        link
                    }
                    class
                    middlewares {
                        type
                        name
                    }
                    graphql {
                        queries {
                            operation
                            handler
                            method
                        }
                        mutations {
                            operation
                            handler
                            method
                        }
                        resolvers {
                            operation
                            handler
                            method
                        }
                    }
                    routes {
                        post
                        get
                        put
                        delete
                        redirect
                    }
                }
            }
        }
    `,
    testEmail: `
        mutation testEmail($email: String!) {
            testEmail(email: $email)
        }
    `,
    navigationElements: `
        query navigationElements {
            navigationElements {
                post_entries {
                    icon
                    url
                    slug
                    label {
                        #locale#
                    }
                    parent
                    permission
                }
                pre_users {
                    icon
                    url
                    slug
                    label {
                        #locale#
                    }
                    parent
                    permission
                }
                pre_settings {
                    icon
                    url
                    slug
                    label {
                        #locale#
                    }
                    parent
                    permission
                }
            }
        }
    `,
    handshakeKey: `
        query handshakeKey {
            handshakeKey
        }
    `,
    settingsElements: `
        query settingsElements {
            settingsElements {
                entries {
                    name
                    icon
                    url
                    slug
                    label {
                        #locale#
                    }
                    permission
                }
                emails {
                    name
                    icon
                    url
                    slug
                    label {
                        #locale#
                    }
                    permission
                }
                others {
                    name
                    icon
                    url
                    slug
                    label {
                        #locale#
                    }
                    permission
                }
            }
        }
    `,
    availableTemplates: `
        query availableTemplates {
            availableTemplates {
                name
                filename
            }
        }
    `,
    getSailLogs: `
        query getSailLogs($page: Int!, $limit: Int!, $date_search: Int) {
            getSailLogs(page: $page, limit: $limit, date_search: $date_search) {
                pagination {
                    current
                    totalPages
                    total
                }
                list {
                    _id
                    message
                    date
                }
            }
        }
    `,
    getPHPLogs: `
        query getPHPLogs {
            getPHPLogs
        }
    `,
    monitoringSample: `
        query monitoringSample {
            monitoringSample {
                warning
                timestamp
                php_tested
                ram {
                    total
                    available
                    used
                    percent
                }
                disk {
                    total
                    available
                    used
                    percent
                }
                cpu {
                    cores
                    percent
                }
                boot {
                    boot_time
                    uptime
                }
                php {
                    installed
                    current
                    latest
                    secure
                    supported
                }
            }
        }
    `,
    getRangeSample: `
        query getRangeSample($start: Int!, $end: Int!) {
            getRangeSample(start: $start, end: $end) {
                timestamp
                ram {
                    percent
                }
                disk {
                    percent
                }
                cpu {
                    percent
                }
            }
        }
    `,
    addBookmark: `
        mutation addBookmark($user_id: ID!, $url: String!, $name: LocaleFieldInput!) {
            addBookmark(user_id: $user_id, url: $url, name: $name)
        }
    `,
    removeBookmark: `
        mutation removeBookmark($user_id: ID!, $url: String!) {
            removeBookmark(user_id: $user_id, url: $url)
        }
    `
}
