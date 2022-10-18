import { Field } from 'react-final-form';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf/src';

import s from './BooleanField.module.scss';

export function QuestionBoolean({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'string'];
    const fieldName = fieldPath.join('.');
    return (
        <Field name={fieldName}>
            {({ input }) => (
                <label className={s.groupLabel}>
                    {text}
                    <input className={s.checkbox} disabled={qrfContext.readOnly || readOnly || hidden} type="checkbox" checked={input.value} onChange={input.onChange} />
                </label>
            )}
        </Field>
    );
}
