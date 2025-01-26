import { Questionnaire } from 'fhir/r4b';
import { useState } from 'react';
import { Button } from 'web/src/components/Button';
import { InputField } from 'web/src/components/InputField';

import s from './ModalCreateQuestionnaire.module.scss';

interface ModalCreateQuestionnaireProps {
    saveQuestionnaire: (partialQuestionnaire: Partial<Questionnaire>) => Promise<any>;
    closeModal: () => void;
}

export function ModalCreateQuestionnaire({
    saveQuestionnaire,
    closeModal,
}: ModalCreateQuestionnaireProps) {
    const [questionnaireId, setQuestionnaireId] = useState('');
    const [questionnaireName, setQuestionnaireName] = useState('');

    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div>Do you want to add a new questionnaire?</div>
                <InputField
                    input={{
                        value: questionnaireId,
                        onChange: (e) => setQuestionnaireId(e.target.value),
                        onBlur: () => {},
                        onFocus: () => {},
                    }}
                    label="Questionnaire id"
                />
                <InputField
                    input={{
                        value: questionnaireName,
                        onChange: (e) => setQuestionnaireName(e.target.value),
                        onBlur: () => {},
                        onFocus: () => {},
                    }}
                    label="Questionnaire name"
                />
                <Button
                    onClick={() => {
                        saveQuestionnaire({
                            ...(questionnaireId ? { id: questionnaireId } : {}),
                            ...(questionnaireName ? { name: questionnaireName } : {}),
                        });
                        closeModal();
                    }}
                >
                    Save
                </Button>
                <Button
                    variant="secondary"
                    onClick={() => {
                        closeModal();
                    }}
                >
                    Cancel
                </Button>
            </div>
        </div>
    );
}
