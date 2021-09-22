import React from 'react';
import { RemoteData } from 'aidbox-react/src/libs/remoteData';
import { UnControlled as CodeMirror } from 'react-codemirror2';
import { AidboxResource, Parameters } from 'shared/src/contrib/aidbox';
import { ResourceCodeDisplay } from 'src/components/ResourceCodeDisplay';
import { CodeEditor } from 'src/components/CodeEditor';
import { InputField } from 'src/components/InputField';
import { Button } from 'src/components/Button';
import { ExpressionModalInfo, ValueObject } from 'src/containers/Main/types';
import { useModal } from 'src/components/ModalExpression/hooks';
import s from './ModalExpression.module.scss';

interface ModalExpressionProps {
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<AidboxResource>;
    expressionModalInfo: ExpressionModalInfo;
    closeExpressionModal: () => void;
    setExpression: (expression: string) => void;
}

export function ModalExpression(props: ModalExpressionProps) {
    const { launchContext, questionnaireResponseRD, expressionModalInfo, closeExpressionModal, setExpression } = props;
    const { expressionResultOutput, saveExpression, launchContextValue } = useModal(
        expressionModalInfo,
        launchContext,
        questionnaireResponseRD,
        closeExpressionModal,
    );

    console.log('expressionModalInfo', expressionModalInfo);

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
                                launchContextValue={launchContextValue}
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
    launchContextValue?: ValueObject;
}

function InputData({ expressionModalInfo, questionnaireResponseRD, launchContextValue }: InputDataProps) {
    if (expressionModalInfo.type === 'LaunchContext') {
        return (
            <CodeEditor
                valueObject={launchContextValue}
                options={{
                    readOnly: true,
                }}
            />
        );
    } else if (expressionModalInfo.type === 'QuestionnaireResponse') {
        return <ResourceCodeDisplay resourceResponse={questionnaireResponseRD} />;
    } else return <div>Error: Invalid modal type</div>;
}
