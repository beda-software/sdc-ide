import { useFieldController } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import {
    QuestionItemProps,
    useQuestionnaireResponseFormContext,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';

import { QuestionLabel } from './label';

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'integer'];
    const fieldName = fieldPath.join('.');
    const { value, onChange, disabled } = useFieldController(fieldPath, questionItem);

    return (
        <>
            <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
            <input
                type="number"
                id={fieldName}
                value={value ?? ''}
                readOnly={qrfContext.readOnly || readOnly || hidden}
                onChange={onChange}
                disabled={disabled}
            />
            {/* {meta.touched && meta.error && <span>{meta.error}</span>} */}
        </>
    );
}
