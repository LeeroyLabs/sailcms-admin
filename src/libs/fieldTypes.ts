import { computed } from "vue";
import { sortBy } from "lodash";
import TextField from "@/components/entries/fields/types/Text.vue";
import TextArea from "@/components/entries/fields/types/Textarea.vue";
import Empty from "@/components/entries/fields/types/Empty.vue";
import Phone from "@/components/entries/fields/types/Phone.vue";
import AssetFile from "@/components/entries/fields/types/AssetFile.vue";
import Asset from "@/components/entries/fields/types/Asset.vue";
import Select from "@/components/entries/fields/types/Select.vue";
import Entry from "@/components/entries/fields/types/Entry.vue";
import Date from "@/components/entries/fields/types/Date.vue";
import Matrix from "@/components/entries/fields/types/Matrix.vue";
import { i18n } from "@/plugins/i18n";

// @ts-ignore
const t = i18n.global.t;

export const availableTypes = computed(() =>
{
    return sortBy([
        {
            value: 'text',
            component: TextField,
            hideRepeat: false,
            title: t('fields.types.text'),
            description: t('fields.descriptions.text')
        },
        {
            value: 'textarea',
            component: TextArea,
            hideRepeat: false,
            title: t('fields.types.textarea'),
            description: t('fields.descriptions.textarea')
        },
        {
            value: 'html',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.html'),
            description: t('fields.descriptions.html')
        },
        {
            value: 'numeric',
            component: TextField,
            hideRepeat: false,
            title: t('fields.types.numeric'),
            description: t('fields.descriptions.numeric')
        },
        {
            value: 'integer',
            component: TextField,
            hideRepeat: false,
            title: t('fields.types.integer'),
            description: t('fields.descriptions.integer')
        },
        {
            value: 'float',
            component: TextField,
            hideRepeat: false,
            title: t('fields.types.float'),
            description: t('fields.descriptions.float')
        },
        {
            value: 'password',
            component: TextField,
            hideRepeat: false,
            title: t('fields.types.password'),
            description: t('fields.descriptions.password')
        },
        {
            value: 'email',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.email'),
            description: t('fields.descriptions.email')
        },
        {
            value: 'phone',
            component: Phone,
            hideRepeat: true,
            title: t('fields.types.phone'),
            description: t('fields.descriptions.phone')
        },
        {
            value: 'asset_file',
            component: AssetFile,
            hideRepeat: true,
            title: t('fields.types.asset_file'),
            description: t('fields.descriptions.asset_file')
        },
        {
            value: 'asset_image',
            component: Asset,
            hideRepeat: true,
            title: t('fields.types.asset_image'),
            description: t('fields.descriptions.asset_image')
        },
        {
            value: 'url',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.url'),
            description: t('fields.descriptions.url')
        },
        {
            value: 'domain',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.domain'),
            description: t('fields.descriptions.domain')
        },
        {
            value: 'directory',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.directory'),
            description: t('fields.descriptions.directory')
        },
        {
            value: 'file',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.file'),
            description: t('fields.descriptions.file')
        },
        {
            value: 'ip',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.ip'),
            description: t('fields.descriptions.ip')
        },
        {
            value: 'select',
            component: Select,
            hideRepeat: true,
            title: t('fields.types.select'),
            description: t('fields.descriptions.select')
        },
        {
            value: 'entry',
            component: Entry,
            hideRepeat: true,
            title: t('fields.types.entry'),
            description: t('fields.descriptions.entry')
        },
        {
            value: 'switch',
            component: Empty,
            hideRepeat: true,
            hideRequired: true,
            title: t('fields.types.switch'),
            description: t('fields.descriptions.switch')
        },
        {
            value: 'hex',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.hex'),
            description: t('fields.descriptions.hex')
        },
        {
            value: 'postal',
            component: Phone,
            hideRepeat: false,
            title: t('fields.types.postal'),
            description: t('fields.descriptions.postal')
        },
        {
            value: 'country',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.country'),
            description: t('fields.descriptions.country')
        },
        {
            value: 'date',
            component: Date,
            hideRepeat: false,
            title: t('fields.types.date'),
            description: t('fields.descriptions.date')
        },
        {
            value: 'datetime',
            component: Date,
            hideRepeat: false,
            title: t('fields.types.datetime'),
            description: t('fields.descriptions.datetime')
        },
        {
            value: 'time',
            component: Date,
            hideRepeat: false,
            title: t('fields.types.time'),
            description: t('fields.descriptions.time')
        },
        {
            value: 'year',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.year'),
            description: t('fields.descriptions.year')
        },
        {
            value: 'checkbox',
            component: Select,
            hideRepeat: false,
            title: t('fields.types.checkbox'),
            description: t('fields.descriptions.checkbox')
        },
        {
            value: 'radio',
            component: Select,
            hideRepeat: false,
            title: t('fields.types.radio'),
            description: t('fields.descriptions.radio')
        },
        {
            value: 'id',
            component: Empty,
            hideRepeat: false,
            title: t('fields.types.id'),
            description: t('fields.descriptions.id')
        },
        {
            value: 'matrix',
            component: Matrix,
            hideRepeat: false,
            title: t('fields.types.matrix'),
            description: t('fields.descriptions.matrix')
        }
    ], ['title']);
});
