import { QuestionnaireItemAnswerOption } from '@beda.software/aidbox-types';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';
import { getAnswerCode, getAnswerDisplay } from 'web/src/utils/questionnaire';

import { useAnswerChoice } from './hook';
import { AsyncSelectField } from './select';
import { QuestionField } from '../field';
import { QuestionLabel } from '../label';

export function QuestionChoice(props: QuestionItemProps) {
    const { questionItem } = props;
    const { fieldName, loadOptions, validate, deps } = useAnswerChoice(props);
    const { text, repeats, readOnly, hidden, linkId } = questionItem;
    const qrfContext = useQuestionnaireResponseFormContext();

    if (hidden) {
        return null;
    }

    const fieldProps = { validate };

    return (
        <QuestionField name={fieldName} {...fieldProps}>
            {({ input }) => {
                return (
                    <>
                        <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
                        <AsyncSelectField<QuestionnaireItemAnswerOption>
                            key={`answer-choice-${deps.join('-')}`}
                            data-testid={`choice-${linkId}`}
                            id={fieldName}
                            input={input}
                            label={text}
                            loadOptions={loadOptions}
                            isMulti={!!repeats}
                            getOptionLabel={(option) => getAnswerDisplay(option.value)}
                            getOptionValue={(option) => getAnswerCode(option.value)}
                            readOnly={qrfContext.readOnly || readOnly}
                        />
                    </>
                );
            }}
        </QuestionField>
    );
}
