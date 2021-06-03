import * as React from 'react';
import _ from 'lodash';
import { Field, FieldProps } from 'react-final-form';

import s from './ChoiceField.module.scss';

interface ChooseFieldOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface ChoiceFieldProps {
    options: Array<ChooseFieldOption>;
}

export function ChoiceField<T = any>({
    disabled,
    fieldProps,
    label,
    name,
    options,
}: FieldProps<T, any> & ChoiceFieldProps) {
    return (
        <Field name={name} {...fieldProps}>
            {({ input }) => {
                return (
                    <div className={s.wrapper}>
                        <label className={s.groupLabel}>{label}:</label>
                        <select
                            onChange={input.onChange}
                            className={s.select}
                            defaultValue={input.value}
                            disabled={disabled}
                        >
                            {_.map(options, (option) => {
                                return (
                                    <option key={option.value} value={option.value} className={s.option}>
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
