import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf/src';

import { QuestionField } from './field';
import { QuestionLabel } from './label';

export function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'decimal'];
    const fieldName = fieldPath.join('.');

    return (
        <QuestionField name={fieldName}>
            {({ input, meta }) => (
                <>
                    <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
                    <input
                        type="numeric"
                        id={fieldName}
                        {...input}
                        readOnly={qrfContext.readOnly || readOnly || hidden}
                        onChange={(e) => input.onChange(parseInt(e.target.value))}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                </>
            )}
        </QuestionField>
    );
}
