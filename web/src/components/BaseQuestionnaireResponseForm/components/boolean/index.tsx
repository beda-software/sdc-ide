import { Field } from 'react-final-form';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import s from './BooleanField.module.scss';
import { QuestionLabel } from '../label';

export function QuestionBoolean({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'boolean'];
    const fieldName = fieldPath.join('.');

    return (
        <Field name={fieldName}>
            {({ input }) => (
                <div className={s.group}>
                    <input
                        className={s.checkbox}
                        disabled={qrfContext.readOnly || readOnly || hidden}
                        type="checkbox"
                        checked={input.value}
                        onChange={input.onChange}
                        id={fieldName}
                    />
                    <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
                </div>
            )}
        </Field>
    );
}
