export function fieldName(id, fields)
{
    const field = fields.find(f => f._id === id);

    if (field) {
        return field.name;
    }

    return '';
}