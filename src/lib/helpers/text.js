import { deburr, lowerCase } from 'lodash';
import { snakeCase } from 'lodash/string.js';

export function searchable(text, key = false)
{
    if (key) {
        return snakeCase(deburr(lowerCase(text))).replace(/\s+/, '');
    }

    return deburr(lowerCase(text)).replace(/\s+/, '');
}