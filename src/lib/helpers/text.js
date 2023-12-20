import { deburr, lowerCase } from 'lodash';

export function searchable(text)
{
    return deburr(lowerCase(text));
}