import { QuestionnaireResponseItemAnswer } from 'fhir/r4b';
import _ from 'lodash';
import { ActionMeta, PropsValue } from 'react-select';
import { AsyncSelect } from 'web/src/components/Select';
// eslint-disable-next-line import/named

interface Props<T> {
    label?: string;
    id?: string;
    placeholder?: string;
    helpText?: string;
    formItemProps?: any;
    loadOptions: (searchText: string) => Promise<T[]>;
    readOnly?: boolean;
    onChange?: (v: PropsValue<T>, action: ActionMeta<T>) => void;
    getOptionLabel: (option: T) => string;
    getOptionValue: (option: T) => string;
    isMulti?: boolean;
    testId?: string;
    value?: QuestionnaireResponseItemAnswer[];
}

export function AsyncSelectField<T>(props: Props<T>) {
    const {
        readOnly,
        id,
        placeholder = 'Select...',
        getOptionLabel,
        getOptionValue,
        onChange,
        isMulti,
        loadOptions,
        value,
    } = props;

    const debouncedLoadOptions = _.debounce(
        (searchText: string, callback: (options: T[]) => void) => {
            (async () => callback(await loadOptions(searchText)))();
        },
        500,
    );

    return (
        <AsyncSelect
            value={value}
            defaultOptions
            isDisabled={readOnly}
            loadOptions={debouncedLoadOptions}
            placeholder={placeholder}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            id={id}
            onChange={(value, action) => {
                // onChange(value ?? undefined);

                if (onChange) {
                    onChange(value, action);
                }
            }}
            isMulti={isMulti}
            // styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
        />
    );
}
