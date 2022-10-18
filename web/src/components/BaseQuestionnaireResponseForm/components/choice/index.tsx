import { QuestionItemProps, useQuestionnaireResponseFormContext } from "sdc-qrf/src";

import { QuestionnaireItemAnswerOption, QuestionnaireResponseItemAnswerValue } from "shared/src/contrib/aidbox";

import { useAnswerChoice } from "./hook";
import { AsyncSelectField } from "./select";

export function getAnswerDisplay(
    o: QuestionnaireItemAnswerOption['value'] | QuestionnaireResponseItemAnswerValue,
) {
    if (o?.Coding) {
        return o.Coding.display!;
    }
    if (o?.string) {
        return o.string;
    }

    if (o?.Reference) {
        return o.Reference.display ?? '';
    }

    return JSON.stringify(o);
}

export function getAnswerCode(
    o: QuestionnaireItemAnswerOption['value'] | QuestionnaireResponseItemAnswerValue,
) {
    if (o?.Coding) {
        return o.Coding.code!;
    }
    if (o?.string) {
        return o.string;
    }

    if (o?.Reference) {
        return o.Reference.id;
    }

    return JSON.stringify(o);
}



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
