import * as React from 'react';
import { FieldInputProps, FieldMetaState } from 'react-final-form';

import s from './DateTimePickerField.module.scss';
import { dateTime } from 'shared/lib/contrib/aidbox';

interface InputFieldProps {
    input: FieldInputProps<dateTime>;
    meta: FieldMetaState<string>;
    label?: string;
    placeholder?: string;
}

export function DateTimePickerField({ input, meta, label, placeholder }: InputFieldProps) {
    console.log(input);
    return (
        <div className={s.wrapper}>
            <label className={s.label}>{label}</label>
            <input className={s.input} type="text" {...input} placeholder={placeholder} />
            {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
    );
}
