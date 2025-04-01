import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionField } from './field';
import { QuestionLabel } from './label';

export function QuestionString({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'string'];
    const fieldName = fieldPath.join('.');

    return (
        <QuestionField name={fieldName}>
            {({ input, meta }) => (
                <>
                    <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
                    <input
                        type="text"
                        id={fieldName}
                        {...input}
                        readOnly={qrfContext.readOnly || readOnly || hidden}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                </>
            )}
        </QuestionField>
    );
}
