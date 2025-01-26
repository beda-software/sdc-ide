import s from './InputField.module.scss';

interface InputFieldProps {
    label: string;
    children: React.ReactNode;
}

export function FieldWrapper({ label, children }: InputFieldProps) {
    return (
        <div className={s.wrapper}>
            <label className={s.label}>{label}</label>
            {children}
        </div>
    );
}
