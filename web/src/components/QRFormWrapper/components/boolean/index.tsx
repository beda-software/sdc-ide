import { useFieldController } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import {
    QuestionItemProps,
    useQuestionnaireResponseFormContext,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import { Field } from 'react-final-form';

import s from './BooleanField.module.scss';
import { QuestionLabel } from '../label';


export function QuestionBoolean({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'boolean'];
    const fieldName = fieldPath.join('.');
    const { value, onChange } = useFieldController(fieldPath, questionItem);

    return (
        <div className={s.group}>
            <input
                className={s.checkbox}
                disabled={qrfContext.readOnly || readOnly || hidden}
                type="checkbox"
                checked={value}
                onChange={onChange}
                id={fieldName}
            />
            <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
        </div>
    );
}
