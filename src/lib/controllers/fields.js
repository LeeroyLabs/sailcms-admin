import { Entries } from '@graphql/lib/entries.js';
import { SailCMS } from '@graphql/index.js';
import { hasPermission } from '$lib/helpers/permissions.js';
import { linkTo } from '$lib/helpers/navigation.js';
import { tableMap } from '$lib/helpers/table.js';

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

            const link = '/settings/fields/' + field._id;
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
}