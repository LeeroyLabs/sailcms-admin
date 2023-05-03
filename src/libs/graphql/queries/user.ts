export default {
    authenticate: `
        query authenticate($email: String!, $password: String!) {
            authenticate(email: $email, password: $password) {
                user_id
                message
            }
        }
    `,
    verifyAuthentication: `
        query verifyAuthenticationToken($token: String!) {
            verifyAuthenticationToken(token: $token) {
                _id
                name {
                    first
                    last
                    full
                }
                email
                roles
                status
                avatar
                permissions
                auth_token
                created_at
                validated
                locale
                #meta#
            }
        }
    `,
    verifyTFA: `
        query verifyTFA($user_id: ID!, $code: String!)
        {
            verifyTFA(user_id: $user_id, code: $code) {
                _id
                name {
                    first
                    last
                    full
                }
                email
                roles
                status
                avatar
                permissions
                auth_token
                created_at
                validated
                locale
                #meta#
            }
        }
    `,
    forgotPassword: `
        query forgotPassword($email: String!) {
            forgotPassword(email: $email)
        }
    `,
    resetPassword: `
        mutation resetPassword($code: String!, $password: String!) {
            changePassword(code: $code, password: $password) {
                password_check
                code_check
            }
        }
    `,
    userWithToken: `
        query userWithToken {
            userWithToken {
                _id
                name {
                    first
                    last
                    full
                }
                email
                roles
                status
                avatar
                permissions
                auth_token
                created_at
                validated
                locale
                #meta#
            }
        }
    `,
    user: `
        query user($id: ID!) {
            user(id: $id) {
                _id
                name {
                    first
                    last
                    full
                }
                email
                roles
                status
                avatar
                permissions
                auth_token
                created_at
                validated
                locale
                #meta#
            }
        }
    `,
    users: `
        query users($page: Int!, $limit: Int!, $search: String, $sorting: UserSort, $type: UserType, $meta: MetaSearch, $status: Boolean, $validated: Boolean) {
            users(page: $page, limit: $limit, search: $search, sorting: $sorting, type: $type, meta: $meta, status: $status, validated: $validated) {
                pagination {
                    current
                    totalPages
                    total
                }
                list {
                    _id
                    name {
                        first
                        last
                        full
                    }
                    email
                    roles
                    status
                    avatar
                    permissions
                    auth_token
                    created_at
                    validated
                    locale
                    #meta#
                }
            }
        }
    `
};
