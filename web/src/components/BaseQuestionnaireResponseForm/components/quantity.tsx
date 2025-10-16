import { Coding } from 'fhir/r4b';
import React from 'react';
import { useField } from 'react-final-form';
import { QuestionItemProps, useQuestionnaireResponseFormContext } from 'sdc-qrf';

import { QuestionField } from './field';
import { QuestionLabel } from './label';

export function QuestionQuantity({ parentPath, questionItem }: QuestionItemProps) {
    const qrfContext = useQuestionnaireResponseFormContext();
    const { linkId, readOnly, hidden, unitOption } = questionItem;
    const fieldPath = [...parentPath, linkId, 0, 'value', 'Quantity'];
    const fieldName = fieldPath.join('.');

    const { input, meta } = useField(fieldName);
    const [selectedUnit, setSelectedUnit] = React.useState<Coding | undefined>({
        code: input.value?.code,
        system: input.value?.system,
        display: input.value?.unit,
    });

    const InputWithUnit = () => {
        return (
            <>
                <QuestionLabel questionItem={questionItem} htmlFor={fieldName} />
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="number"
                        id={fieldName}
                        readOnly={qrfContext.readOnly || readOnly || hidden}
                        value={input.value?.value}
                        onChange={(e) => {
                            console.log('e.target.value', e.target.value);
                            input.onChange({
                                value: e.target.value,
                                unit: selectedUnit?.display,
                                system: selectedUnit?.system,
                                code: selectedUnit?.code,
                            });
                        }}
                    />
                    <select
                        style={{ marginLeft: '8px' }}
                        value={selectedUnit?.display}
                        disabled={qrfContext.readOnly || readOnly || hidden}
                        onChange={(e) => {
                            const newUnit = (unitOption ?? []).find(
                                (unit) => unit.display === e.target.value,
                            );
                            if (newUnit) {
                                setSelectedUnit(newUnit);
                                input.onChange({
                                    value: input.value?.value,
                                    unit: newUnit.display,
                                    system: newUnit.system,
                                    code: newUnit.code,
                                });
                            }
                        }}
                    >
                        {(unitOption ?? []).map((unit) => (
                            <option key={unit.code} value={unit.display}>
                                {unit.display}
                            </option>
                        ))}
                    </select>
                </div>
                {meta.touched && meta.error && <span>{meta.error}</span>}
            </>
        );
    };

    return <QuestionField name={fieldName} component={InputWithUnit} />;
}
