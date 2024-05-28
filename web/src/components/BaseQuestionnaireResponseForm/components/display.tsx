import { QuestionItemProps } from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';

import s from '../QuestionnaireResponseForm.module.scss';

export function QuestionDisplay({ questionItem }: QuestionItemProps) {
    const { text, helpText } = questionItem;

    return (
        <div className={s.display}>
            {text && <p className={s.displayLabel}>{text}</p>}
            {helpText && <p className={s.helpText}>{helpText}</p>}
        </div>
    );
}
