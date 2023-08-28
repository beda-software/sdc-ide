import { useQuestionnaireResponseFormContext } from 'sdc-qrf/src';
import { getAnswerCode, getAnswerDisplay } from 'web/src/utils/questionnaire';

import { AidboxResource, QuestionnaireItemAnswerOption, Resource } from 'shared/src/contrib/aidbox';

import { AnswerReferenceProps, useAnswerReference } from './hooks';
import { AsyncSelectField } from '../choice/select';
import { QuestionField } from '../field';
import { QuestionLabel } from '../label';

function QuestionReferenceUnsafe<R extends Resource = any, IR extends Resource = any>(
    props: AnswerReferenceProps<R, IR>,
) {
    const { questionItem, parentPath } = props;
    const { loadOptions, onChange, deps, validate } = useAnswerReference(props);
    const { text, repeats, linkId, helpText, readOnly } = questionItem;
    const qrfContext = useQuestionnaireResponseFormContext();

    const fieldPath = [...parentPath, questionItem.linkId!];
    const fieldName = fieldPath.join('.');

    const fieldProps = { validate };

    return (
        <QuestionField name={fieldName} {...fieldProps}>
            {({ input }) => {
                return (
                    <>
                        <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
                        <AsyncSelectField<QuestionnaireItemAnswerOption>
                            key={`answer-choice-${deps.join('-')}`}
                            input={input}
                            id={fieldName}
                            testId={linkId!}
                            label={text}
                            loadOptions={loadOptions}
                            isMulti={!!repeats}
                            getOptionLabel={(option) => getAnswerDisplay(option.value)}
                            getOptionValue={(option) => getAnswerCode(option.value)}
                            onChange={onChange}
                            readOnly={qrfContext.readOnly || readOnly}
                            helpText={helpText}
                        />
                    </>
                );
            }}
        </QuestionField>
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
