import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'web/src/components/Button';

import { RemoteDataResult, isFailure, isSuccess } from '@beda.software/remote-data';

import s from '../../../components/QRFormWrapper/QuestionnaireResponseForm.module.scss';

interface PromptFormInterface {
    prompt: string;
}

interface Props {
    id: string;
    onSubmit: (prompt: string) => Promise<RemoteDataResult<any>>;
    goBack: () => void;
    label: string;
}

export function PromptForm(props: Props) {
    const { id, onSubmit, goBack, label } = props;
    const [isLoading, setIsLoading] = useState(false);
    const disabled = isLoading;

    const { handleSubmit, control } = useForm<PromptFormInterface>();

    const handleFormSubmit = async (values: PromptFormInterface) => {
        setIsLoading(true);
        const response = await onSubmit(values.prompt);

        if (isSuccess(response)) {
            setIsLoading(false);
            goBack();
        }

        if (isFailure(response)) {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className={s.form}>
            <div className={s.field}>
                <label className={s.label} htmlFor={`prompt-${id}`}>
                    {label}
                </label>
                <Controller
                    name="prompt"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                        <textarea
                            {...field}
                            rows={5}
                            style={{ resize: 'vertical' }}
                            id={`prompt-${id}`}
                        />
                    )}
                />
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <Button type="submit" disabled={disabled}>
                        {'Submit'}
                    </Button>
                    {isLoading ? <div className={s.label}>Loading... </div> : null}
                </div>
            </div>
            {isLoading ? (
                <div className={s.label}>
                    The process of generating may require some time to complete. Please wait.
                </div>
            ) : null}
        </form>
    );
}
