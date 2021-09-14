import { useCallback, useEffect, useState } from 'react';
import fhirpath from 'fhirpath';
import yaml from 'js-yaml';
import { isSuccess, RemoteData } from 'aidbox-react/src/libs/remoteData';
import { AidboxResource, Parameters, Resource } from 'shared/src/contrib/aidbox';
import { ExpressionResultOutput, ModalInfo } from 'src/containers/Main/types';
import { replaceLine } from 'src/utils/codemirror';

export function useModal(
    modalInfo: ModalInfo,
    launchContext: Parameters,
    questionnaireResponseRD: RemoteData<AidboxResource>,
    closeExpressionModal: () => void,
) {
    const [expressionResultOutput, setExpressionResultOutput] = useState<ExpressionResultOutput | null>(null);
    const [indexOfContext, setIndexOfContext] = useState(0);
    const [launchContextValue, setLaunchContextValue] = useState<Resource | undefined>();

    const setContextData = useCallback(() => {
        if (modalInfo.type === 'LaunchContext') {
            launchContext?.parameter?.map((parameter, index) => {
                if (parameter.name === String(modalInfo.expression.split('.')[0]).slice(1)) {
                    setIndexOfContext(index);
                }
            });
            setLaunchContextValue(launchContext?.parameter?.[indexOfContext]?.resource);
            return launchContext?.parameter?.[indexOfContext]?.resource;
        }
        if (modalInfo.type === 'QuestionnaireResponse') {
            if (isSuccess(questionnaireResponseRD)) {
                return questionnaireResponseRD.data;
            }
        }
    }, [indexOfContext, launchContext.parameter, modalInfo.expression, modalInfo.type, questionnaireResponseRD]);

    const selectContext = useCallback(() => {
        const contextData: Record<string, any> = {};
        if (modalInfo.type === 'LaunchContext') {
            launchContext.parameter?.map((parameter) => {
                contextData[parameter.name] = setContextData();
            });
            return contextData;
        }
        if (modalInfo.type === 'QuestionnaireResponse') {
            if (isSuccess(questionnaireResponseRD)) {
                contextData[questionnaireResponseRD.data.resourceType] = setContextData();
                return contextData;
            }
        }
    }, [launchContext.parameter, modalInfo.type, questionnaireResponseRD, setContextData]);

    const saveExpression = () => {
        let newLine = '';
        if (modalInfo.type === 'LaunchContext') {
            newLine = `expression: '${modalInfo.expression}'`;
        }
        if (modalInfo.type === 'QuestionnaireResponse') {
            newLine = `fhirpath("${modalInfo.expression}")`;
        }
        replaceLine(modalInfo.doc, modalInfo.cursorPosition, newLine);
        closeExpressionModal();
    };

    useEffect(() => {
        try {
            const evaluate = fhirpath.evaluate(setContextData(), modalInfo.expression, selectContext());
            setExpressionResultOutput({ type: 'success', result: yaml.dump(JSON.parse(JSON.stringify(evaluate))) });
        } catch (e) {
            setExpressionResultOutput({ type: 'error', result: String(e) });
        }
    }, [modalInfo.expression, selectContext, setContextData]);

    return {
        expressionResultOutput,
        saveExpression,
        launchContextValue,
    };
}
