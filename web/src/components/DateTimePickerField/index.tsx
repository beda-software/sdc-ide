import * as React from 'react';
import { FieldInputProps, FieldMetaState } from 'react-final-form';

import s from './DateTimePickerField.module.scss';
import { dateTime } from 'shared/src/contrib/aidbox';

interface InputFieldProps {
    input: FieldInputProps<dateTime>;
    meta: FieldMetaState<string>;
    label?: string;
    placeholder?: string;
}

export function DateTimePickerField({ input, meta, label, placeholder }: InputFieldProps) {
    return (
        <div className={s.wrapper}>
            <label className={s.label}>{label}</label>
            <input className={s.input} type="date" {...input} placeholder={placeholder} />
            {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
    );
}
