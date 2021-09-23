import { useCallback, useEffect, useState } from 'react';
import fhirpath from 'fhirpath';
import yaml from 'js-yaml';
import { isSuccess, RemoteData } from 'aidbox-react/src/libs/remoteData';
import { AidboxResource, Parameters, Resource } from 'shared/src/contrib/aidbox';
import { ExpressionModalInfo, ExpressionResultOutput } from 'src/containers/Main/types';
import { replaceLine } from 'src/utils/codemirror';
import { extractParameterName } from './utils';

export function useModal(
    expressionModalInfo: ExpressionModalInfo,
    launchContext: Parameters,
    questionnaireResponseRD: RemoteData<AidboxResource>,
    closeExpressionModal: () => void,
) {
    const [expressionResultOutput, setExpressionResultOutput] = useState<ExpressionResultOutput | null>(null);
    const [indexOfContext, setIndexOfContext] = useState(0);
    const [launchContextValue, setLaunchContextValue] = useState<Resource | undefined>();

    const parameterName = extractParameterName(expressionModalInfo.expression);

    const setContextData = useCallback(() => {
        if (expressionModalInfo.type === 'LaunchContext') {
            launchContext?.parameter?.map((parameter, index) => {
                if (parameter.name === extractParameterName(expressionModalInfo.expression)) {
                    setIndexOfContext(index);
                }
            });
            setLaunchContextValue(launchContext?.parameter?.[indexOfContext]?.resource);
            return launchContext?.parameter?.[indexOfContext]?.resource;
        }
        if (expressionModalInfo.type === 'QuestionnaireResponse') {
            if (isSuccess(questionnaireResponseRD)) {
                return questionnaireResponseRD.data;
            }
        }
        return launchContext.parameter?.map((item) => item.name);
    }, [
        indexOfContext,
        launchContext.parameter,
        expressionModalInfo.expression,
        expressionModalInfo.type,
        questionnaireResponseRD,
    ]);

    const selectContext = useCallback(() => {
        const contextData: Record<string, any> = {};
        if (expressionModalInfo.type === 'LaunchContext') {
            launchContext.parameter?.map((parameter) => {
                contextData[parameter.name] = setContextData();
            });
            return contextData;
        }
        if (expressionModalInfo.type === 'QuestionnaireResponse') {
            if (isSuccess(questionnaireResponseRD)) {
                contextData[questionnaireResponseRD.data.resourceType] = setContextData();
                return contextData;
            }
        }
    }, [launchContext.parameter, expressionModalInfo.type, questionnaireResponseRD, setContextData]);

    const saveExpression = () => {
        let newLine;
        const lineBefore = expressionModalInfo.doc.getLine(expressionModalInfo.cursorPosition.line);
        if (expressionModalInfo.type === 'LaunchContext') {
            const array = lineBefore.split("'");
            array[1] = expressionModalInfo.expression;
            newLine = array.join("'");
        }
        if (expressionModalInfo.type === 'QuestionnaireResponse') {
            const array = lineBefore.split('"');
            array[1] = expressionModalInfo.expression;
            newLine = array.join('"');
        }
        replaceLine(expressionModalInfo.doc, expressionModalInfo.cursorPosition, newLine);
        closeExpressionModal();
    };

    useEffect(() => {
        try {
            const evaluate = fhirpath.evaluate(setContextData(), expressionModalInfo.expression, selectContext());
            setExpressionResultOutput({ type: 'success', result: yaml.dump(JSON.parse(JSON.stringify(evaluate))) });
        } catch (e) {
            setExpressionResultOutput({ type: 'error', result: String(e) });
        }
    }, [expressionModalInfo.expression, selectContext, setContextData]);

    return {
        expressionResultOutput,
        saveExpression,
        launchContextValue,
        parameterName,
    };
}
