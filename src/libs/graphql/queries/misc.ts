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
    `
}
