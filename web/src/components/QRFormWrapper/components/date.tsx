import { useFieldController } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import {
    QuestionItemProps,
    useQuestionnaireResponseFormContext,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import moment from 'moment';

import { FHIRDateTimeFormat } from 'fhir-react/lib/utils/date';

import { QuestionLabel } from './label';

export function QuestionDate({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'date'];
    const fieldName = fieldPath.join('.');
    const { value, onChange } = useFieldController(fieldPath, questionItem);

    return (
        <>
            <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
            <input
                type="date"
                id={fieldName}
                onChange={onChange}
                value={value ?? ''}
                readOnly={qrfContext.readOnly || readOnly || hidden}
            />
            {/* {meta.touched && meta.error && <span>{meta.error}</span>} */}
        </>
    );
}

export function QuestionDateTime({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden } = questionItem;
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
    const { value, onChange } = useFieldController(fieldPath, questionItem);
    return (
        <>
            <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
            <input
                type="datetime-local"
                id={fieldName}
                readOnly={qrfContext.readOnly || readOnly || hidden}
                value={value}
                onChange={onChange}
            />
            {/* {meta.touched && meta.error && <span>{meta.error}</span>} */}
        </>
    );
}
