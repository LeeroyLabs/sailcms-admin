import Text from "./Text.vue";
import Date from "./Date.vue";
import Color from "./Color.vue";

export const AvailableFields = {
    phone: {
        component: Text,
        type: 'phone'
    },
    email: {
        component: Text,
        type: 'email'
    },
    date: {
        component: Date
    },
    id: {
        component: Text,
        type: 'id'
    },
    url: {
        component: Text,
        type: 'url'
    },
    domain: {
        component: Text,
        type: 'domain'
    },
    numeric: {
        component: Text,
        type: 'numeric'
    },
    integer: {
        component: Text,
        type: 'integer'
    },
    float: {
        component: Text,
        type: 'float'
    },
    password: {
        component: Text,
        type: 'password'
    },
    directory: {
        component: Text,
        type: 'directory'
    },
    file: {
        component: Text,
        type: 'file'
    },
    ip: {
        component: Text,
        type: 'numeric'
    },
    hex: {
        component: Color,
    }
}
