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
}
