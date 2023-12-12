import { get } from 'svelte/store';
import { AppStore } from '@stores/app.js';

export function tableMap(row, keys, opts)
{

    let obj = [];
    let hasLink = (opts.link && opts.link.trim() !== '');

    for (let [i, v] of keys.entries()) {
        let opt = {center: false, check: false};

        // Center Value
        if (opts.center && opts.center.includes(i)) opt.center = true;

        obj.push({data: row[v], options: opt});
    }

    let hasCheck = (opts.check);

    return {data: obj, link: get(AppStore).baseURL + opts.link, hasLink, check: hasCheck, id: opts.id};
}