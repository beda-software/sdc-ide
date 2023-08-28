import _ from 'lodash';
// eslint-disable-next-line import/named
import { FieldInputProps } from 'react-final-form';
import { ActionMeta, PropsValue } from 'react-select';
import { AsyncSelect } from 'web/src/components/Select';

interface Props<T> {
    label?: string;
    id?: string;
    placeholder?: string;
    helpText?: string;
    input: FieldInputProps<any, HTMLElement>;
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
        input,
        id,
        placeholder = 'Select...',
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
        <AsyncSelect
            defaultOptions
            isDisabled={readOnly}
            loadOptions={debouncedLoadOptions}
            placeholder={placeholder}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            id={id}
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
}
