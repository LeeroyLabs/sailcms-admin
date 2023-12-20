import { sortBy } from "lodash";
import { _ } from 'svelte-i18n';
// import TextField from "@/components/entries/fields/types/Text.vue";
// import TextArea from "@/components/entries/fields/types/Textarea.vue";
// import Empty from "@/components/entries/fields/types/Empty.vue";
// import Phone from "@/components/entries/fields/types/Phone.vue";
// import AssetFile from "@/components/entries/fields/types/AssetFile.vue";
// import Asset from "@/components/entries/fields/types/Asset.vue";
// import Select from "@/components/entries/fields/types/Select.vue";
// import Entry from "@/components/entries/fields/types/Entry.vue";
// import Date from "@/components/entries/fields/types/Date.vue";
// import Matrix from "@/components/entries/fields/types/Matrix.vue";

export const availableTypes = sortBy([
    {
        value: 'text',
        //component: TextField,
        hideRepeat: false,
        title: 'fields.types.text',
        description: 'fields.descriptions.text'
    },
    {
        value: 'textarea',
       // component: TextArea,
        hideRepeat: false,
        title: 'fields.types.textarea',
        description: 'fields.descriptions.textarea'
    },
    {
        value: 'html',
       // component: Empty,
        hideRepeat: false,
        title: 'fields.types.html',
        description: 'fields.descriptions.html'
    },
    {
        value: 'numeric',
       // component: TextField,
        hideRepeat: false,
        title: 'fields.types.numeric',
        description: 'fields.descriptions.numeric'
    },
    {
        value: 'integer',
       // component: TextField,
        hideRepeat: false,
        title: 'fields.types.integer',
        description: 'fields.descriptions.integer'
    },
    {
        value: 'float',
      //  component: TextField,
        hideRepeat: false,
        title: 'fields.types.float',
        description: 'fields.descriptions.float'
    },
    {
        value: 'password',
        //component: TextField,
        hideRepeat: false,
        title: 'fields.types.password',
        description: 'fields.descriptions.password'
    },
    {
        value: 'email',
       // component: Empty,
        hideRepeat: false,
        title: 'fields.types.email',
        description: 'fields.descriptions.email'
    },
    {
        value: 'phone',
       // component: Phone,
        hideRepeat: true,
        title: 'fields.types.phone',
        description: 'fields.descriptions.phone'
    },
    {
        value: 'asset_file',
       // component: AssetFile,
        hideRepeat: false,
        title: 'fields.types.asset_file',
        description: 'fields.descriptions.asset_file'
    },
    {
        value: 'asset_image',
       // component: Asset,
        hideRepeat: false,
        title: 'fields.types.asset_image',
        description: 'fields.descriptions.asset_image'
    },
    {
        value: 'url',
     //   component: Empty,
        hideRepeat: false,
        title: 'fields.types.url',
        description: 'fields.descriptions.url'
    },
    {
        value: 'domain',
     //   component: Empty,
        hideRepeat: false,
        title: 'fields.types.domain',
        description: 'fields.descriptions.domain'
    },
    {
        value: 'ip',
     //   component: Empty,
        hideRepeat: false,
        title: 'fields.types.ip',
        description: 'fields.descriptions.ip'
    },
    {
        value: 'select',
     //   component: Select,
        hideRepeat: true,
        title: 'fields.types.select',
        description: 'fields.descriptions.select'
    },
    {
        value: 'entry',
     //   component: Entry,
        hideRepeat: true,
        hideExplain: true,
        title: 'fields.types.entry',
        description: 'fields.descriptions.entry'
    },
    {
        value: 'switch',
     //   component: Empty,
        hideRepeat: true,
        hideRequired: true,
        hideExplain: true,
        title: 'fields.types.switch',
        description: 'fields.descriptions.switch'
    },
    {
        value: 'hex',
     //   component: Empty,
        hideRepeat: false,
        title: 'fields.types.hex',
        description: 'fields.descriptions.hex'
    },
    {
        value: 'postal',
    //    component: Phone,
        hideRepeat: false,
        title: 'fields.types.postal',
        description: 'fields.descriptions.postal'
    },
    {
        value: 'country',
     //   component: Empty,
        hideRepeat: false,
        title: 'fields.types.country',
        description: 'fields.descriptions.country'
    },
    {
        value: 'date',
    //    component: Date,
        hideRepeat: false,
        title: 'fields.types.date',
        description: 'fields.descriptions.date'
    },
    {
        value: 'datetime',
    //    component: Date,
        hideRepeat: false,
        title: 'fields.types.datetime',
        description: 'fields.descriptions.datetime'
    },
    {
        value: 'year',
     //   component: Empty,
        hideRepeat: false,
        title: 'fields.types.year',
        description: 'fields.descriptions.year'
    },
    {
        value: 'checkbox',
    //    component: Select,
        hideRepeat: true,
        hideExplain: true,
        title: 'fields.types.checkbox',
        description: 'fields.descriptions.checkbox'
    },
    {
        value: 'radio',
    //    component: Select,
        hideRepeat: true,
        hideRequired: true,
        hideExplain: true,
        title: 'fields.types.radio',
        description: 'fields.descriptions.radio'
    },
    {
        value: 'id',
    //    component: Empty,
        hideRepeat: false,
        title: 'fields.types.id',
        description: 'fields.descriptions.id'
    },
    {
        value: 'matrix',
    //    component: Matrix,
        hideRepeat: true,
        hideRequired: true,
        title: 'fields.types.matrix',
        description: 'fields.descriptions.matrix'
    }
], ['title']);
