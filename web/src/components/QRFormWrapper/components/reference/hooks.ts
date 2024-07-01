import {
    parseFhirQueryExpression,
    QuestionItemProps,
} from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import { ResourcesMap } from '@beda.software/fhir-react';
import { isSuccess, buildQueryParams } from '@beda.software/remote-data';
import fhirpath from 'fhirpath';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { loadResourceOptions } from 'web/src/services/questionnaire';

import {
    QuestionnaireItemAnswerOption,
    QuestionnaireResponseItemAnswer,
    Resource,
} from 'shared/src/contrib/aidbox';

export type AnswerReferenceProps<R extends Resource, IR extends Resource> = QuestionItemProps & {
    overrideGetDisplay?: (resource: R, includedResources: ResourcesMap<R | IR>) => string;
    overrideGetLabel?: (
        o: QuestionnaireItemAnswerOption['value'] | QuestionnaireResponseItemAnswer['value'],
    ) => React.ReactElement | string;
};

export function useAnswerReference<R extends Resource = any, IR extends Resource = any>({
    questionItem,
    parentPath,
    context,
    overrideGetDisplay,
}: AnswerReferenceProps<R, IR>) {
    const { linkId, repeats, required, answerExpression, choiceColumn } = questionItem;
    const getDisplay =
        overrideGetDisplay ??
        ((resource: R) => fhirpath.evaluate(resource, choiceColumn![0]!.path!, context)[0]);

    const rootFieldPath = [...parentPath, linkId];
    const fieldPath = [...rootFieldPath, ...(repeats ? [] : ['0'])];
    const rootFieldName = rootFieldPath.join('.');

    const fieldName = fieldPath.join('.');

    // TODO: add support for fhirpath and application/x-fhir-query
    const [resourceType, searchParams] = parseFhirQueryExpression(
        answerExpression!.expression!,
        context,
    );

    const loadOptions = async (searchText: string): Promise<QuestionnaireItemAnswerOption[]> => {
        const response = await loadResourceOptions(
            resourceType as any,
            { ...(typeof searchParams === 'string' ? {} : searchParams ?? {}), _ilike: searchText },
            getDisplay,
        );

        if (isSuccess(response)) {
            return response.data as QuestionnaireItemAnswerOption[];
        }

        return [];
    };

    const onChange = (
        _value:
            | SingleValue<QuestionnaireItemAnswerOption>
            | MultiValue<QuestionnaireItemAnswerOption>,
        action: ActionMeta<QuestionnaireItemAnswerOption>,
    ) => {
        if (!repeats || action.action !== 'select-option') {
            return;
        }
    };

    const validate = required
        ? (inputValue: any) => {
              if (repeats) {
                  if (!inputValue || !inputValue.length) {
                      return 'Choose at least one option';
                  }
              } else {
                  if (!inputValue) {
                      return 'Required';
                  }
              }

              return undefined;
          }
        : undefined;

    const depsUrl = `${resourceType}?${buildQueryParams(searchParams as any)}`;

    const deps = [linkId, depsUrl];

    return {
        rootFieldName,
        fieldName,
        loadOptions,
        onChange,
        validate,
        searchParams,
        resourceType,
        deps,
    };
}
