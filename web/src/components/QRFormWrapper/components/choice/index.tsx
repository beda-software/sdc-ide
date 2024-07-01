import { useFieldController } from '@beda.software/fhir-questionnaire/components/QuestionnaireResponseForm';
import {
    QuestionItemProps,
    useQuestionnaireResponseFormContext,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import { getAnswerCode, getAnswerDisplay } from 'web/src/utils/questionnaire';

import { QuestionnaireItemAnswerOption } from 'shared/src/contrib/aidbox';

import { useAnswerChoice } from './hook';
import { AsyncSelectField } from './select';
import { QuestionLabel } from '../label';

export function QuestionChoice(props: QuestionItemProps) {
    const { questionItem } = props;
    const { fieldName, loadOptions, deps, fieldPath } = useAnswerChoice(props);
    const { text, repeats, readOnly, hidden, linkId } = questionItem;
    const qrfContext = useQuestionnaireResponseFormContext();
    const { value, onChange } = useFieldController(fieldPath, questionItem);

    if (hidden) {
        return null;
    }

    return (
        <>
            <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
            <AsyncSelectField<QuestionnaireItemAnswerOption>
                key={`answer-choice-${deps.join('-')}`}
                data-testid={`choice-${linkId}`}
                id={fieldName}
                onChange={onChange}
                value={value}
                // input={input}
                label={text}
                loadOptions={loadOptions}
                isMulti={!!repeats}
                getOptionLabel={(option) => getAnswerDisplay(option.value)}
                getOptionValue={(option) => getAnswerCode(option.value)}
                readOnly={qrfContext.readOnly || readOnly}
            />
        </>
    );
}
