import { Field } from 'react-final-form';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf/src';

export function QuestionInteger({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'integer'];
    const fieldName = fieldPath.join('.');

    return (
        <Field name={fieldName}>
            {({ input, meta }) => (
                <div>
                    <label>{text}</label>
                    <input
                        type="number"
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
                </div>
            )}
        </Field>
    );
}
