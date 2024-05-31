import { useFieldController } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import {
    QuestionItemProps,
    useQuestionnaireResponseFormContext,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';

import { QuestionField } from './field';
import { QuestionLabel } from './label';

export function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'decimal'];
    const fieldName = fieldPath.join('.');
    const { value, onChange, disabled, formItem, onBlur } = useFieldController(
        fieldPath,
        questionItem,
    );

    return (
        <>
            <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
            <input
                type="numeric"
                id={fieldName}
                value={value ?? ''}
                disabled={disabled}
                readOnly={qrfContext.readOnly || readOnly || hidden}
                onChange={(e) => onChange(Number(e.target.value))}
            />
        </>
    );
}
