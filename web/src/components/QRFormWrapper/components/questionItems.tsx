import { QuestionnaireItem } from '@beda.software/fhir-questionnaire/contrib/aidbox';
import { QuestionItem } from '@beda.software/fhir-questionnaire/vendor/sdc-qrf/components';
import { useQuestionnaireResponseFormContext } from '@beda.software/fhir-questionnaire/vendor/sdc-qrf/hooks';
import { ItemContext } from '@beda.software/fhir-questionnaire/vendor/sdc-qrf/types';
import { getEnabledQuestions } from '@beda.software/fhir-questionnaire/vendor/sdc-qrf/utils';
import React from 'react';

export interface QuestionItemsProps {
    questionItems: QuestionnaireItem[];
    context: ItemContext;
    parentPath: string[];
}

export function QuestionItems(props: QuestionItemsProps) {
    const { questionItems, parentPath, context } = props;
    const { formValues } = useQuestionnaireResponseFormContext();

    return (
        <React.Fragment>
            {getEnabledQuestions(questionItems, parentPath, formValues, context).map(
                (item, index) => {
                    return (
                        <QuestionItem
                            key={index}
                            questionItem={item}
                            context={context}
                            parentPath={parentPath}
                        />
                    );
                },
            )}
        </React.Fragment>
    );
}
