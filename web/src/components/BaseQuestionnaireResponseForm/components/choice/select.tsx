import _ from 'lodash';
import { Field } from 'react-final-form';
import { ActionMeta, PropsValue } from 'react-select';
import { AsyncSelect } from 'web/src/components/Select';

interface Props<T> {
    name: string;
    label?: string;
    placeholder?: string;
    helpText?: string;
    fieldProps?: any;
    formItemProps?: any;
    loadOptions: (searchText: string) => Promise<T[]>;
    readOnly?: boolean;
    onChange?: (v: PropsValue<T>, action: ActionMeta<T>) => void;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
    isMulti?: boolean;
    testId?: string;
}

export function AsyncSelectField<T>(props: Props<T>) {
    const {
        readOnly,
        name,
        placeholder = 'Select...',
        fieldProps,
        getOptionLabel,
        getOptionValue,
        onChange,
        isMulti,
        loadOptions,
    } = props;

    const debouncedLoadOptions = _.debounce(
        (searchText: string, callback: (options: T[]) => void) => {
            (async () => callback(await loadOptions(searchText)))();
        },
        500,
    );

    return (
        <Field name={name} {...fieldProps}>
            {({ input }) => {
                return (
                    <AsyncSelect
                        defaultOptions
                        isDisabled={readOnly}
                        loadOptions={debouncedLoadOptions}
                        placeholder={placeholder}
                        getOptionLabel={getOptionLabel}
                        getOptionValue={getOptionValue}
                        {...input}
                        onChange={(value, action) => {
                            input.onChange(value ?? undefined);

                            if (onChange) {
                                onChange(value, action);
                            }
                        }}
                        isMulti={isMulti}
                        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                        menuPortalTarget={document.body}
                    />
                );
            }}
        </Field>
    );
}
