import { useQuestionnaireResponseFormContext } from 'sdc-qrf/src';
import { getAnswerCode, getAnswerDisplay } from 'web/src/utils/questionnaire';

import { AidboxResource, QuestionnaireItemAnswerOption, Resource } from 'shared/src/contrib/aidbox';

import { AnswerReferenceProps, useAnswerReference } from './hooks';
import { AsyncSelectField } from '../choice/select';

function QuestionReferenceUnsafe<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { questionItem, parentPath } = props;
    const { loadOptions, onChange, deps, validate } = useAnswerReference(props);
    const { text, repeats, linkId, helpText, readOnly } = questionItem;
    const qrfContext = useQuestionnaireResponseFormContext();

    const fieldPath = [...parentPath, questionItem.linkId!];
    const fieldName = fieldPath.join('.');

    return (
        <AsyncSelectField<QuestionnaireItemAnswerOption>
            key={`answer-choice-${deps.join('-')}`}
            name={fieldName}
            testId={linkId!}
            label={text}
            loadOptions={loadOptions}
            isMulti={!!repeats}
            getOptionLabel={(option) => getAnswerDisplay(option.value)}
            getOptionValue={(option) => getAnswerCode(option.value)}
            onChange={onChange}
            readOnly={qrfContext.readOnly || readOnly}
            helpText={helpText}
            fieldProps={{ validate }}
        />
    );
}

export function QuestionReference<R extends AidboxResource = any, IR extends AidboxResource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { answerExpression, choiceColumn, linkId } = props.questionItem;

    if (!answerExpression || !choiceColumn) {
        console.warn(`answerExpression and choiceColumn must be set for linkId '${linkId}'`);
        return null;
    }

    return <QuestionReferenceUnsafe {...props} />;
}
