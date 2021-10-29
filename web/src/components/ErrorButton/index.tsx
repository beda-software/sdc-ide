import React from 'react';
import { showError } from 'src/containers/Main/hooks';
import { ErrorDebugState } from 'src/containers/Main/hooks/errorDebugHook';

import s from './ErrorButton.module.scss';

interface ErrorButtonProps {
    title: string;
    errorState: ErrorDebugState;
}

export function ErrorButton({ errorState, title }: ErrorButtonProps) {
    let count;
    if (title === 'Questionnaire FHIR Resource') {
        count = errorState.questionnaireErrorCount;
    }
    if (title === 'Patient JUTE Mapping') {
        count = errorState.mappingErrorCount;
    }
    return (
        <span className={s.error} onClick={() => showError(errorState, title)}>
            <span className={s.count}>{count}</span>
            ERR!
        </span>
    );
}
