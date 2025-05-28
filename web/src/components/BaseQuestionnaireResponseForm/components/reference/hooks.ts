import { Resource } from 'fhir/r4b';
import fhirpath from 'fhirpath';
import { ActionMeta, MultiValue, SingleValue } from 'react-select';
import { AnswerValue, FormAnswerItems, parseFhirQueryExpression, QuestionItemProps } from 'sdc-qrf';
import { loadResourceOptions } from 'web/src/services/questionnaire';

import { isSuccess } from 'fhir-react/lib/libs/remoteData';
import { ResourcesMap } from 'fhir-react/lib/services/fhir';
import { buildQueryParams } from 'fhir-react/lib/services/instance';

export type AnswerReferenceProps<R extends Resource, IR extends Resource> = QuestionItemProps & {
    overrideGetDisplay?: (resource: R, includedResources: ResourcesMap<R | IR>) => string;
    overrideGetLabel?: (o: AnswerValue) => React.ReactElement | string;
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

    const loadOptions = async (searchText: string): Promise<FormAnswerItems[]> => {
        const response = await loadResourceOptions(
            resourceType as any,
            { ...(typeof searchParams === 'string' ? {} : searchParams ?? {}), _ilike: searchText },
            getDisplay,
        );

        if (isSuccess(response)) {
            return response.data;
        }

        return [];
    };

    const onChange = (
        _value: SingleValue<FormAnswerItems> | MultiValue<FormAnswerItems>,
        action: ActionMeta<FormAnswerItems>,
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
