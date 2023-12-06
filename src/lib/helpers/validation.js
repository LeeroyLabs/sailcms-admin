import Joi from 'joi';
import { tlds } from '@hapi/tlds';

export class Validation
{
    static validate(value, rule)
    {
        switch (rule)
        {
            case 'required':
                return (value.trim() !== '');

            case 'email':
                const schema = Joi.object({
                    email: Joi.string().email({minDomainSegments: 2, tlds: { allow: tlds}})
                });

                const result = schema.validate({email: value});
                return (!result.error);
        }
    }
}