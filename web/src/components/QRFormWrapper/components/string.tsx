import { useFieldController } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import {
    QuestionItemProps,
    useQuestionnaireResponseFormContext,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';

import { QuestionField } from './field';
import { QuestionLabel } from './label';

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'string'];
    const fieldName = fieldPath.join('.');
    const { value, onChange, disabled } = useFieldController(fieldPath, questionItem);
    return (
        <>
            <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
            <input
                type="text"
                id={fieldName}
                value={value ?? ''}
                disabled={disabled}
                readOnly={qrfContext.readOnly || readOnly || hidden}
                onChange={(e) => onChange(e.target.value)}
            />
        </>
    );
}
