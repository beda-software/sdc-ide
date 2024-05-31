import { useState } from 'react';
import { Field, Form } from 'react-final-form';
import { Button } from 'web/src/components/Button';

import { RemoteDataResult, isFailure, isSuccess } from 'fhir-react/lib/libs/remoteData';

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

    return (
        <Form<PromptFormInterface>
            onSubmit={async (values) => {
                setIsLoading(true);
                const response = await onSubmit(values.prompt);

                if (isSuccess(response)) {
                    setIsLoading(false);
                    goBack();
                }

                if (isFailure(response)) {
                    setIsLoading(false);
                }
            }}
            render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit} className={s.form}>
                    <div className={s.field}>
                        <label className={s.label} htmlFor={`prompt-${id}`}>
                            {label}
                        </label>
                        <Field
                            name="prompt"
                            component="textarea"
                            rows={5}
                            style={{ resize: 'vertical' }}
                            id={`prompt-${id}`}
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
                            The process of generating may require some time to complete. Please
                            wait.
                        </div>
                    ) : null}
                </form>
            )}
        />
    );
}
