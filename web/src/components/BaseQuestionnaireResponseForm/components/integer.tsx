import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionField } from './field';
import { QuestionLabel } from './label';

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'integer'];
    const fieldName = fieldPath.join('.');

    return (
        <QuestionField name={fieldName}>
            {({ input, meta }) => (
                <>
                    <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
                    <input
                        type="number"
                        id={fieldName}
                        {...input}
                        readOnly={qrfContext.readOnly || readOnly || hidden}
                        onChange={(e) => {
                            const value = e.target.value
                                ? parseInt(e.target.value, 10)
                                : e.target.value;
                            input.onChange(value);
                        }}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                </>
            )}
        </QuestionField>
    );
}
