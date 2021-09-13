import React from 'react';
import { RemoteData } from 'aidbox-react/src/libs/remoteData';
import { AidboxResource, Parameters } from 'shared/src/contrib/aidbox';
import { ResourceCodeDisplay } from 'src/components/ResourceCodeDisplay';
import { CodeEditor } from 'src/components/CodeEditor';
import { InputField } from 'src/components/InputField';
import { Button } from 'src/components/Button';
import { ValueObject } from 'src/containers/Main/types';
import s from './ModalExpression.module.scss';

interface ModalExpressionProps {
    launchContext: Parameters;
    modalType: string;
    expression: string;
    expressionResultOutput: string;
    questionnaireResponseRD: RemoteData<AidboxResource>;
    setShowModalExpression: (show: boolean) => void;
    setExpression: (path: string) => void;
    setContextData: () => ValueObject | undefined;
    saveExpression: () => void;
}

export function ModalExpression(props: ModalExpressionProps) {
    const {
        launchContext,
        modalType,
        expression,
        expressionResultOutput,
        questionnaireResponseRD,
        setShowModalExpression,
        setExpression,
        setContextData,
        saveExpression,
    } = props;

    const launchContextValue = setContextData(); // TODO data for Questionnaire FHIR Resource and Patient JUTE Mapping

    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div className={s.header}>
                    <div className={s.inputPathContainer}>
                        <InputField
                            input={{
                                name: 'fhirpath expression',
                                value: expression,
                                onChange: (e) => setExpression(e.target.value),
                                onBlur: () => {},
                                onFocus: () => {},
                            }}
                            meta="testmeta"
                            label="FHIRpath expression"
                            placeholder="FHIRpath expr..."
                        />
                    </div>
                </div>
                <div className={s.data}>
                    <div className={s.inputData}>
                        {launchContext || questionnaireResponseRD ? (
                            <InputData
                                modalType={modalType}
                                questionnaireResponseRD={questionnaireResponseRD}
                                launchContextValue={launchContextValue}
                            />
                        ) : (
                            <div>Error: no data</div>
                        )}
                    </div>
                    <div className={s.outputData}>
                        <div>{expressionResultOutput}</div>
                    </div>
                </div>
                <div className={s.buttonContainer}>
                    <div className={s.button}>
                        <Button variant="secondary" onClick={() => setShowModalExpression(false)}>
                            Close
                        </Button>
                    </div>
                    <div className={s.button}>
                        <Button onClick={() => saveExpression()}>Save</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

interface InputDataProps {
    modalType: string;
    questionnaireResponseRD: RemoteData<AidboxResource>;
    launchContextValue?: ValueObject;
}

function InputData({ modalType, questionnaireResponseRD, launchContextValue }: InputDataProps) {
    if (modalType === 'Launch Context') {
        return (
            <CodeEditor
                valueObject={launchContextValue}
                options={{
                    readOnly: true,
                }}
            />
        );
    } else if (modalType === 'QuestionnaireResponse FHIR resource') {
        return <ResourceCodeDisplay resourceResponse={questionnaireResponseRD} />;
    } else return <div>Error: Invalid modal type</div>;
}
