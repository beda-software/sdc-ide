import classNames from 'classnames';
import { ButtonHTMLAttributes, DetailedHTMLProps, useState } from 'react';

import s from './Button.module.scss';

interface ButtonProps
    extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export function Button(props: ButtonProps) {
    const { variant = 'primary', className, onClick, disabled: originalDisabled, ...other } = props;

    const [isLoading, setIsLoading] = useState(false);

    const disabled = originalDisabled || isLoading;

    return (
        <button
            type="button"
            className={classNames(s.button, `_${variant}`, className)}
            disabled={disabled}
            onClick={async (event) => {
                if (!onClick) {
                    return;
                }

                setIsLoading(true);
                await onClick(event);
                setIsLoading(false);
            }}
            {...other}
        />
    );
}
