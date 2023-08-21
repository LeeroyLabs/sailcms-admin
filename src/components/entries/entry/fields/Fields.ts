import Text from "./Text.vue";
import Date from "./Date.vue";
import Color from "./Color.vue";
import HTML from "./HTML.vue";
import Textarea from "./Textarea.vue";
import Asset from "./Asset.vue";
import Select from "./Select.vue";
import Country from "@/components/entries/entry/fields/Country.vue";

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
    text: {
        component: Text,
        type: 'text'
    },
    postal: {
        component: Text,
        type: 'postal'
    },
    hex: {
        component: Color
    },
    html: {
        component: HTML
    },
    textarea: {
        component: Textarea
    },
    asset_image: {
        component: Asset,
        type: 'image'
    },
    asset_file: {
        component: Asset,
        type: 'file'
    },
    select: {
        component: Select
    },
    country: {
        component: Country
    }
}
