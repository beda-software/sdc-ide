import { Field } from 'react-final-form';

import s from './BooleanField.module.scss';

interface BooleanFieldProps {
    name: string;
    label: string;
}

export function BooleanField({ label, name }: BooleanFieldProps) {
    return (
        <Field name={name}>
            {({ input }) => (
                <label className={s.groupLabel}>
                    {label}
                    <input type="checkbox" checked={input.value} onChange={input.onChange} />
                </label>
            )}
        </Field>
    );
}
