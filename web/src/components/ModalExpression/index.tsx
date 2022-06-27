import React from 'react';
import { isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { AidboxResource, Parameters } from 'shared/src/contrib/aidbox';
import { InputField } from 'web/src/components/InputField';
import { Button } from 'web/src/components/Button';
import { ExpressionModalInfo } from 'web/src/containers/Main/types';
import { useExpressionModal } from 'web/src/components/ModalExpression/hooks';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { ResourceCodeDisplay } from 'web/src/components/ResourceCodeDisplay';
import s from './ModalExpression.module.scss';

interface ModalExpressionProps {
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<AidboxResource>;
    expressionModalInfo: ExpressionModalInfo;
    closeExpressionModal: () => void;
    setExpression: (expression: string) => void;
}

export function ModalExpression(props: ModalExpressionProps) {
    const {
        launchContext,
        questionnaireResponseRD,
        expressionModalInfo,
        closeExpressionModal,
        setExpression,
    } = props;
    const { expressionResultOutput, saveExpression, parameterName, fullLaunchContext } =
        useExpressionModal(
            expressionModalInfo,
            launchContext,
            questionnaireResponseRD,
            closeExpressionModal,
        );

    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div className={s.header}>
                    <div className={s.inputPath}>
                        <InputField
                            input={{
                                name: 'fhirpath expression',
                                value: expressionModalInfo.expression,
                                onChange: (e) => setExpression(e.target.value),
                                onBlur: () => {},
                                onFocus: () => {},
                            }}
                            meta="testmeta"
                            placeholder="FHIRpath expr..."
                        />
                    </div>
                    <div className={s.save}>
                        <Button onClick={saveExpression}>save</Button>
                    </div>
                    <div className={s.close}>
                        <Button variant="secondary" onClick={closeExpressionModal}>
                            close
                        </Button>
                    </div>
                </div>
                <div className={s.data}>
                    <div className={s.inputData}>
                        {launchContext || questionnaireResponseRD ? (
                            <InputData
                                expressionModalInfo={expressionModalInfo}
                                questionnaireResponseRD={questionnaireResponseRD}
                                fullLaunchContext={fullLaunchContext}
                                parameterName={parameterName}
                                setExpression={setExpression}
                            />
                        ) : (
                            <div>Error: no data</div>
                        )}
                    </div>
                    <div className={s.outputData}>
                        {expressionResultOutput?.type === 'success' && (
                            <CodeMirror
                                value={expressionResultOutput.result}
                                options={{
                                    readOnly: true,
                                }}
                            />
                        )}
                        {expressionResultOutput?.type === 'error' && (
                            <div className={s.error}>{expressionResultOutput.result}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface InputDataProps {
    expressionModalInfo: ExpressionModalInfo;
    questionnaireResponseRD: RemoteData<AidboxResource>;
    fullLaunchContext: Record<string, any>;
    parameterName: string;
    setExpression: (expression: string) => void;
}

function InputData({
    expressionModalInfo,
    questionnaireResponseRD,
    fullLaunchContext,
    parameterName,
    setExpression,
}: InputDataProps) {
    if (expressionModalInfo.type === 'LaunchContext') {
        if (parameterName in fullLaunchContext) {
            return (
                <CodeEditor
                    valueObject={fullLaunchContext[parameterName]}
                    options={{
                        readOnly: true,
                    }}
                />
            );
        } else if (
            isSuccess(questionnaireResponseRD) &&
            parameterName === 'QuestionnaireResponse'.slice(1)
        ) {
            return <ResourceCodeDisplay resourceResponse={questionnaireResponseRD} />;
        } else {
            return (
                <div>
                    {Object.keys(fullLaunchContext).map((key: string) => (
                        <p
                            className={s.parameterName}
                            key={key}
                            onClick={() => setExpression('%' + key)}
                        >
                            %{key}
                        </p>
                    ))}
                    {isSuccess(questionnaireResponseRD) && (
                        <p
                            className={s.parameterName}
                            onClick={() => setExpression(questionnaireResponseRD.data.resourceType)}
                        >
                            {questionnaireResponseRD.data.resourceType}
                        </p>
                    )}
                </div>
            );
        }
    } else return <div>Error: Invalid modal type</div>;
}
