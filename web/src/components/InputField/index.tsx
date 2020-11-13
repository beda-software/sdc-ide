import * as React from 'react';
import { FieldInputProps, FieldMetaState } from 'react-final-form';

import s from './InputField.module.scss'

interface InputFieldProps {
    input: FieldInputProps<string>;
    meta: FieldMetaState<string>;
    label?: string;
    placeholder?: string;
}

export function InputField({ input, meta, label, placeholder }: InputFieldProps) {
    return (
        <div className={s.wrapper}>
            <label className={s.label}>{label}</label>
            <input className={s.input} type="text" {...input} placeholder={placeholder} />
            {meta.touched && meta.error && <span>{meta.error}</span>}
        </div>
    );
}
