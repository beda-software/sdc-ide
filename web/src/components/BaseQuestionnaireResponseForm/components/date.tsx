import moment from 'moment';
import { Field } from 'react-final-form';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf/src';

import { FHIRDateTimeFormat } from 'aidbox-react/lib/utils/date';

export function QuestionDate({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'date'];
    const fieldName = fieldPath.join('.');

    return (
        <Field name={fieldName}>
            {({ input, meta }) => (
                <div>
                    <label>{text}</label>
                    <input
                        type="date"
                        {...input}
                        readOnly={qrfContext.readOnly || readOnly || hidden}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                </div>
            )}
        </Field>
    );
}

export function QuestionDateTime({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, text, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'dateTime'];
    const fieldName = fieldPath.join('.');
    const parseValue = (value: string) => {
        return moment(value).local().utc().format(FHIRDateTimeFormat);
    };
    const formatValue = (value?: string) => {
        return value
            ? moment.utc(value, FHIRDateTimeFormat).local().format('YYYY-MM-DDTHH:mm:ss')
            : '';
    };
    return (
        <Field name={fieldName} parse={parseValue} format={formatValue}>
            {({ input, meta }) => (
                <div>
                    <label>{text}</label>
                    <input
                        type="datetime-local"
                        {...input}
                        readOnly={qrfContext.readOnly || readOnly || hidden}
                    />
                    {meta.touched && meta.error && <span>{meta.error}</span>}
                </div>
            )}
        </Field>
    );
}

