import _ from 'lodash';
import { AnswerValue, QuestionItemProps } from 'sdc-qrf/src';

import { isSuccess, RemoteDataResult, success } from 'aidbox-react/lib/libs/remoteData';
import { applyDataTransformer, service } from 'aidbox-react/lib/services/service';

import {
    QuestionnaireItem,
    QuestionnaireItemAnswerOption,
    ValueSet,
} from 'shared/src/contrib/aidbox';

export function getDisplay(value: AnswerValue): string {
    const valueType = _.keys(value)[0];
    //@ts-ignore
    const output = value[valueType];
    return output;
}
export async function loadAnswerOptions(
    questionnaireItem: QuestionnaireItem,
    searchText?: string,
    count = 50,
): Promise<RemoteDataResult<QuestionnaireItemAnswerOption[]>> {
    const { answerOption, answerValueSet } = questionnaireItem;

    if (answerOption) {
        const options = searchText
            ? answerOption.filter(
                  (answer) =>
                      getDisplay(answer.value!).toLowerCase().indexOf(searchText.toLowerCase()) !==
                      -1,
              )
            : answerOption;

        return success(options);
    }

    let valuesetId: string = answerValueSet ?? '';
    if (valuesetId.startsWith('http')) {
        valuesetId = valuesetId.split('/').reverse()[0]!;
    }

    return applyDataTransformer<ValueSet>(
        service({
            method: 'GET',
            url: `/ValueSet/${valuesetId}/$expand`,
            params: {
                filter: searchText?.replace(' ', ','),
                count,
            },
        }),
        (expandedValueSet) => {
            // ValueSet.expansion.contains might be an Object with error if no ValueSet with the `url` exists
            // Aidbox issue: https://github.com/Aidbox/Issues/issues/168
            const expansionEntries = Array.isArray(expandedValueSet.expansion?.contains)
                ? expandedValueSet.expansion!.contains
                : [];

            return expansionEntries.map(
                (expansion): QuestionnaireItemAnswerOption => ({
                    value: {
                        Coding: {
                            code: expansion.code,
                            system: expansion.system,
                            display: expansion.display,
                        },
                    },
                }),
            );
        },
    );
}

export function useAnswerChoice({ questionItem, parentPath }: QuestionItemProps) {
    const { linkId, repeats, required } = questionItem;

    const fieldPath = [...parentPath, linkId, ...(repeats ? [] : ['0'])];
    const fieldName = fieldPath.join('.');

    const loadOptions = async (searchText: string) => {
        const response = await loadAnswerOptions(questionItem, searchText);
        if (isSuccess(response)) {
            return [...response.data];
        }

        return [];
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

    const deps = [linkId];

    return { fieldName, loadOptions, validate, deps };
}
