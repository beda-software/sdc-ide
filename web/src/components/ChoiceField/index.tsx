import * as React from 'react';
import _ from 'lodash';
import { Field, FieldProps } from 'react-final-form';

import s from './ChoiceField.module.scss';

interface ChooseFieldOption {
    value: string;
    label: string;
}

interface ChoiceFieldProps {
    options: Array<ChooseFieldOption>;
}

export function ChoiceField<T = any>({ fieldProps, label, name, options }: FieldProps<T, any> & ChoiceFieldProps) {
    return (
        <Field name={name} {...fieldProps}>
            {({ input }) => {
                return (
                    <div className={s.wrapper}>
                        <label className={s.groupLabel}>{label}:</label>
                        <select onChange={input.onChange} className={s.select}>
                            {_.map(options, (option) => {
                                const selected = input.value === option.value ? { selected: true } : {};
                                return (
                                    <option key={option.value} value={option.value} {...selected} className={s.option}>
                                        {option.label}
                                    </option>
                                );
                            })}
                        </select>
                    </div>
                );
            }}
        </Field>
    );
}
