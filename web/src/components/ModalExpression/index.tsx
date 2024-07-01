import { QuestionnaireResponse } from 'fhir/r4b';
import { Button } from 'web/src/components/Button';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { InputField } from 'web/src/components/InputField';
import { useExpressionModal } from 'web/src/components/ModalExpression/hooks';
import { ResourceCodeDisplay } from 'web/src/components/ResourceCodeDisplay';

import { isSuccess, RemoteData } from '@beda.software/remote-data';

import s from './ModalExpression.module.scss';
import { ModalExpressionProps } from './types';
import { ExpressionType } from '../CodeEditor/ContextMenu/types';

export function ModalExpression(props: ModalExpressionProps) {
    const {
        launchContext,
        questionnaireResponseRD,
        expression,
        type,
        closeExpressionModal,
        setExpression,
    } = props;
    const { expressionResultOutput, saveExpression, parameterName, fullLaunchContext } =
        useExpressionModal(props);

    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div className={s.header}>
                    <div className={s.inputPath}>
                        <InputField
                            input={{
                                name: 'fhirpath expression',
                                value: expression,
                                onChange: (e) => setExpression(e.target.value),
                                onBlur: () => {},
                                onFocus: () => {},
                            }}
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
                        <div className={s.dataHeader}>Input data</div>
                        {launchContext || questionnaireResponseRD ? (
                            <div className={s.codemirror}>
                                <InputData
                                    type={type}
                                    questionnaireResponseRD={questionnaireResponseRD}
                                    fullLaunchContext={fullLaunchContext}
                                    parameterName={parameterName}
                                    setExpression={setExpression}
                                />
                            </div>
                        ) : (
                            <div>Error: no data</div>
                        )}
                    </div>
                    <div className={s.outputData}>
                        <div className={s.dataHeader}>Output data</div>
                        {expressionResultOutput?.type === 'success' && (
                            <CodeEditor value={expressionResultOutput.result as any} readOnly />
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
    type: ExpressionType;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
    fullLaunchContext: Record<string, any>;
    parameterName: string;
    setExpression: (expression: string) => void;
}

function InputData({
    type,
    questionnaireResponseRD,
    fullLaunchContext,
    parameterName,
    setExpression,
}: InputDataProps) {
    if (type === 'LaunchContext') {
        if (parameterName in fullLaunchContext) {
            return <CodeEditor value={fullLaunchContext[parameterName]} readOnly />;
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
