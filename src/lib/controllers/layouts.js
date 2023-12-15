import { hasPermission } from '$lib/helpers/permissions.js';
import { Entries } from '@graphql/lib/entries.js';
import { SailCMS } from '@graphql/index.js';
import { format } from 'date-fns';
import { tableMap } from '$lib/helpers/table.js';
import { linkTo } from '$lib/helpers/navigation.js';

const cols = [
    {title: 'check', center: true, css: 'w-[44px]'},
    {title: 'layouts.columns.title', center: false, css: 'w-[30%]'},
    {title: 'layouts.columns.created_by', center: false, css: 'w-[20%]'},
    {title: 'layouts.columns.last_update', center: false},
    {title: 'layouts.columns.used_by', center: true, css: ''},
    {title: 'layouts.columns.num_records', center: true, css: ''},
];

export class LayoutsController
{
    static async listing()
    {
        if (!hasPermission('read_entry_layout')) {
            linkTo('/settings');
            return {rows: [], trash: [], columns: []};
        }

        return LayoutsController.loadData(cols);
    }

    static async loadFields()
    {
        let fields = await Entries.fields(SailCMS.getLocales());

        for (let field of fields) {
            field.used = false;
        }

        return fields;
    }

    static async loadLayout(id, fields)
    {
        let layout = await Entries.entryLayout(id, SailCMS.getLocales());
        let usedFields = [];
        let schema = [];

        if (!layout) return { layouts: null, fields: null};

        for (let tab of layout.schema) {
            usedFields = [...usedFields, ...tab.fields.map(f => f._id)];

            const _fields = tab.fields.map(f => {
                return {id: f._id, width: f.width};
            });

            schema = [...schema, {
                label: tab.label,
                fields: _fields
            }];
        }

        for (let field of fields) {
            if (usedFields.includes(field._id)) {
                field.used = true;
            }
        }

        layout.schema = schema;

        return { layout, fields };
    }

    static handleSelection(ids, action)
    {
        if (ids.length === 0) return -1;
        if (action === 'restore') return 3;
        if (action === 'trash') return 2;
        if (action === 'delete') return 1;

        return -1;
    }

    static async trash(ids)
    {
        await Entries.deleteEntryLayouts(ids, true);
        return await LayoutsController.loadData(cols);
    }

    static async restore(ids)
    {
        await Entries.restoreEntryLayouts(ids);
        return await LayoutsController.loadData(cols);
    }

    static async loadData()
    {
        let rows = [];
        let trashRows = [];

        const layouts = await Entries.entryLayouts(SailCMS.getLocales(), false);
        const keys = ['title', 'author', 'last_update', 'used_by', 'record_count'];

        for (let layout of layouts) {
            let obj = {
                title: layout.title,
                author: layout.authors.created_by.name.full,
                last_update: format(layout.dates.updated * 1000, 'dd-MM-yyyy HH:mm'),
                used_by: layout.used_by,
                record_count: layout.record_count
            };

            const link = '/settings/layouts/' + layout._id;
            const center = [3, 4];

            if (layout.is_trashed) {
                trashRows = [
                    ...trashRows,
                    tableMap(obj, keys, { id: layout._id, check: true, link: link, center: center })
                ];
            } else {
                rows = [
                    ...rows,
                    tableMap(obj, keys, { id: layout._id, check: true, link: link, center: center })
                ];
            }
        }

        return {
            rows: rows,
            trash: trashRows,
            columns: cols
        }
    }
}