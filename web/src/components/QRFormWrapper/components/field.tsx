import { ReactNode } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import s from '../QuestionnaireResponseForm.module.scss';

interface Props {
    name: string;
    children: ReactNode | ((props: any) => ReactNode);
}

export function QuestionField({ name, children }: Props) {
    const { control } = useFormContext();

    return (
        <Controller
            name={name}
            control={control}
            render={({ field }) =>
                typeof children === 'function' ? (
                    <div className={s.field}>{children(field)}</div>
                ) : (
                    <div className={s.field}>{children}</div>
                )
            }
        />
    );
}
