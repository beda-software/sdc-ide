import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { mapSuccess, service } from 'aidbox-react/src/services/service';
import _ from 'lodash';
import * as React from 'react';
import { Field } from 'react-final-form';
import AsyncSelect from 'react-select/async';
import { Coding, ValueSet } from 'shared/src/contrib/aidbox';
import s from './TerminologyField.module.scss';

interface TerminologyFieldProps {
    name: string;
    label: string;
    valueSetId: string;
    repeats: boolean;
}

interface Option {
    value: {
        Coding: Coding;
    };
}

function getOptionLabel({ value }: Option) {
    return value.Coding.display!;
}

function getOptionValue({ value }: Option) {
    return value.Coding.code!;
}

export function TerminologyField({ label, name, valueSetId, repeats }: TerminologyFieldProps) {
    const loadOptions = React.useCallback(
        async (searchText: string) => {
            const response = mapSuccess(
                await service<ValueSet>({
                    url: `ValueSet/${valueSetId}/$expand`,
                    params: {
                        filter: searchText,
                        count: 50,
                    },
                }),
                (expandedValueSet) => {
                    const expansionEntries = Array.isArray(expandedValueSet.expansion?.contains)
                        ? expandedValueSet.expansion!.contains
                        : [];

                    return expansionEntries.map(
                        (expansion): Option => ({
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

            if (isSuccess(response)) {
                return response.data;
            }
            return [];
        },
        [valueSetId],
    );

    const debouncedLoadOptions = _.debounce((searchText: string, callback: (options: Option[]) => void) => {
        (async () => callback(await loadOptions(searchText)))();
    }, 500);

    return (
        <Field name={name}>
            {({ input }) => (
                <div className={s.wrapper}>
                    <label className={s.groupLabel}>{label}</label>
                    <AsyncSelect<Option>
                        loadOptions={debouncedLoadOptions}
                        defaultOptions
                        getOptionLabel={getOptionLabel}
                        getOptionValue={getOptionValue}
                        onChange={input.onChange}
                        value={input.value}
                        isMulti={repeats}
                    />
                </div>
            )}
        </Field>
    );
}
