import { QuestionItemProps, useQuestionnaireResponseFormContext } from "sdc-qrf/src";
import { getAnswerCode, getAnswerDisplay } from "web/src/utils/questionnaire";

import { QuestionnaireItemAnswerOption } from "shared/src/contrib/aidbox";


import { useAnswerChoice } from "./hook";
import { AsyncSelectField } from "./select";

export function QuestionChoice(props: QuestionItemProps) {
    const { questionItem } = props;
    const { fieldName, loadOptions, validate, deps } = useAnswerChoice(props);
    const { text, repeats, readOnly, hidden, linkId } = questionItem;
    const qrfContext = useQuestionnaireResponseFormContext();

    if (hidden) {
        return null;
    }

    return (
        <AsyncSelectField<QuestionnaireItemAnswerOption>
            key={`answer-choice-${deps.join('-')}`}
            data-testid={`choice-${linkId}`}
            name={fieldName}
            label={text}
            loadOptions={loadOptions}
            isMulti={!!repeats}
            getOptionLabel={(option) => getAnswerDisplay(option.value)}
            getOptionValue={(option) => getAnswerCode(option.value)}
            fieldProps={{
                validate,
            }}
            readOnly={qrfContext.readOnly || readOnly}
        />
    );
}
