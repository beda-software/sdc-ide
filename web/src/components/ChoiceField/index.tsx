import * as React from 'react';
import _ from 'lodash';
import { Field, FieldProps } from 'react-final-form';

import s from './ChoiceField.module.scss';

interface ChooseFieldOption {
    value: string;
    label: string;
}

interface ChoiceFieldProps<T> {
    options: Array<ChooseFieldOption>;
}

export function ChoiceField<T = any>({ fieldProps, label, name, options }: FieldProps<T, any> & ChoiceFieldProps<T>) {
    return (
        <Field name={name} {...fieldProps}>
            {({ input, meta }) => {
                return (
                    <div className={s.wrapper}>
                        <label className={s.groupLabel}>{label}:</label>
                        <select onChange={input.onChange}>
                            {_.map(options, (option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                );
            }}
        </Field>
    );
}
