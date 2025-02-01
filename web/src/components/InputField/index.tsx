import s from './InputField.module.scss';

interface InputFieldProps {
    input: React.InputHTMLAttributes<HTMLInputElement>;
    label?: string;
    placeholder?: string;
    required?: boolean;
}

export function InputField({ input, label, placeholder, required }: InputFieldProps) {
    return (
        <div className={s.wrapper}>
            <label className={s.label}>
                {label}
                {required ? '*' : null}
            </label>
            <input className={s.input} type="text" {...input} placeholder={placeholder} />
        </div>
    );
}
