import { Field } from "react-final-form";
import { QuestionItemProps, useQuestionnaireResponseFormContext } from "sdc-qrf/src";

export function QuestionDecimal({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'decimal'];
    const fieldName = fieldPath.join('.');

    return (
        <Field name={fieldName}>
            {({ input, meta }) => (
                <div>
                    <label>{text}</label>
                    <input
                        type="numeric"
                        {...input}
                        readOnly={qrfContext.readOnly || readOnly || hidden}
                        onChange={(e) => input.onChange(parseInt(e.target.value))}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                </div>
            )}
        </Field>
    );
}

