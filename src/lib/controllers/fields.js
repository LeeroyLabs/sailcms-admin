import { Entries } from '@graphql/lib/entries.js';
import { SailCMS } from '@graphql/index.js';
import { hasPermission } from '$lib/helpers/permissions.js';
import { linkTo } from '$lib/helpers/navigation.js';
import { tableMap } from '$lib/helpers/table.js';
import { _ } from 'svelte-i18n';
import { AppStore } from '@stores/app.js';
import { get } from 'svelte/store';

const columns = [
    {title: 'check', center: true, css: 'w-[44px]'},
    {title: 'fields.columns.name', center: false, css: 'w-[30%]'},
    {title: 'fields.columns.key', center: false, css: 'w-[20%]'},
    {title: 'fields.columns.type', center: false},
    {title: 'fields.columns.repeatable', center: true, css: ''},
    {title: 'fields.columns.required', center: true, css: ''},
];

export class FieldsController
{
    static async loadList()
    {
        if (!hasPermission('read_entry_fields')) {
            linkTo('/settings');
            return {rows: [], columns: []};
        }

        return FieldsController.loadData();
    }

    static async loadData()
    {
        let rows = [];

        const fields = await Entries.fields(SailCMS.getLocales());
        const keys = ['name', 'key', 'type', 'repeatable', 'required'];

        for (let field of fields) {
            let obj = {
                name: field.name,
                key: field.key,
                type: field.type,
                repeatable: field.repeatable,
                required: field.required
            };

            const link = '/settings/fields/' + field.key;
            const center = [3, 4];
            const bools = [3, 4];

            rows = [
                ...rows,
                tableMap(obj, keys, { id: field._id, check: true, link: link, center: center, booleans: bools  })
            ];
        }

        return {
            rows: rows,
            columns: columns
        }
    }

    static async fieldInit(data)
    {
        let breadcrumb = [
            {url: get(AppStore).baseURL + '/dashboard', label: 'systembar.dashboard', active: false},
            {url: get(AppStore).baseURL + '/settings', label: 'system.settings', active: false},
            {url: get(AppStore).baseURL + '/settings/fields', label: 'fields.title', active: false}
        ];

        let keyAllowEdit = false;
        let title = 'fields.new';
        let field = null;

        if (data.id === 'new') {
            keyAllowEdit = true;
            breadcrumb = [...breadcrumb, {url: '', label: get(_)('fields.new'), active: true}];
        } else {
            field = await Entries.entryField(data.id);
            title = field.name;

            breadcrumb = [...breadcrumb, {url: '', label: field.name, active: true}];
        }

        AppStore.setBreadcrumbs(breadcrumb);

        return {
            keyAllowEdit: keyAllowEdit,
            breadcrumb: breadcrumb,
            title: title,
            field: field
        }
    }

    // TODO: ADD INIT, SAVE CALLS FROM SINGLE FIELD PAGE
}