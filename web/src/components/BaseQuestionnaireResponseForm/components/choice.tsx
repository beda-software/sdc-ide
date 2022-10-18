import { useCallback, useMemo } from "react";
import { Field } from "react-final-form";
import Select from 'react-select';
import { QuestionItemProps } from "sdc-qrf/src";
import { QuestionnaireItemAnswerOptionValue } from "shared/src/contrib/aidbox";

function toSelectValue(value: QuestionnaireItemAnswerOptionValue){
    return {value, label: value.Coding?.display ?? value.string ?? ''}
}

interface QuestionSelectWrapperProps {
    value: QuestionnaireItemAnswerOptionValue | null;
    onChange: (v:QuestionnaireItemAnswerOptionValue | null) => void
    options: QuestionnaireItemAnswerOptionValue[];
}

function QuestionSelectWrapper({ value, onChange, options }: QuestionSelectWrapperProps) {
    const newValue = useMemo(() => {
        if(value === null || typeof value === 'undefined'){
            return null;
        }
        if(Array.isArray(value)){
            return value.map(toSelectValue);
        } else 
        return toSelectValue(value as QuestionnaireItemAnswerOptionValue);
    }, [value]);

    const newOnChange = useCallback(
        (value: {value: QuestionnaireItemAnswerOptionValue} | null) => {
            onChange && onChange(value?.value ?? null);
        },
        [onChange],
    );

    return (
        <Select
            options={options.map((c) => {
                return {
                    label: c.Coding?.display ?? c.string ?? 'Unknown' ,
                    value: c,
                };
            })}
            onChange={newOnChange}
            value={newValue}
        />
    );
}

export function QuestionChoice({ parentPath, questionItem }: QuestionItemProps) {
    const { linkId, text, answerOption } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value'];
    const fieldName = fieldPath.join('.');
    const children = answerOption ? answerOption : [];

    return (
        <Field name={fieldName}>
            {({ input }) => {
                return (
                    <div>
                        <label>{text}</label>
                        <QuestionSelectWrapper
                            options={children.map(c=>c.value!)}
                            {...input}
                        />
                    </div>
                );
            }}
        </Field>
    );
}
