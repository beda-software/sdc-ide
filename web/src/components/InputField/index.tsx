import s from './InputField.module.scss';

interface InputFieldProps {
    input: React.InputHTMLAttributes<HTMLInputElement>;
    label?: string;
    placeholder?: string;
}

export function InputField({ input, label, placeholder }: InputFieldProps) {
    return (
        <div className={s.wrapper}>
            <label className={s.label}>{label}</label>
            <input className={s.input} type="text" {...input} placeholder={placeholder} />
        </div>
    );
}
