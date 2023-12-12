import { hasPermission } from '$lib/helpers/permissions.js';
import { goto } from '$app/navigation';
import { Entries } from '@graphql/lib/entries.js';
import { SailCMS } from '@graphql/index.js';
import { format } from 'date-fns';
import { tableMap } from '$lib/helpers/table.js';

export class LayoutsController
{
    static async listing()
    {
        let rows = [];
        let trashRows = [];

        if (!hasPermission('read_entry_layout')) {
            goto('/settings');
            return;
        }

        const cols = [
            {title: 'check', center: true, css: 'w-[44px]'},
            {title: 'layouts.columns.title', center: false, css: 'w-[30%]'},
            {title: 'layouts.columns.created_by', center: false, css: 'w-[30%]'},
            {title: 'layouts.columns.last_update', center: false},
            {title: 'layouts.columns.used_by', center: true, css: 'w-[12%]'},
            {title: 'layouts.columns.num_records', center: true, css: 'w-[12%]'},
        ];

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