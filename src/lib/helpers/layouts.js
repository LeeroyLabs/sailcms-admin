export function fieldName(id, fields)
{
    const field = fields.find(f => f._id === id);

    if (field) {
        return field.name;
    }

    return '';
}

export function moveItem(array, from, to)
{
    let f = array.splice(from, 1)[0];
    array.splice(to, 0, f);
    return array;
}