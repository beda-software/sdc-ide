import { useCallback, useEffect, useState } from 'react';
import fhirpath from 'fhirpath';
import yaml from 'js-yaml';
import { isSuccess, RemoteData } from 'aidbox-react/src/libs/remoteData';
import { AidboxResource, Parameters } from 'shared/src/contrib/aidbox';
import { ExpressionModalInfo, ExpressionResultOutput } from 'src/containers/Main/types';
import { replaceLine } from 'src/utils/codemirror';
import { extractParameterName } from './utils';
import { useService } from 'aidbox-react/src/hooks/service';
import { service } from 'aidbox-react/src/services/service';

export function useModal(
    expressionModalInfo: ExpressionModalInfo,
    launchContext: Parameters,
    questionnaireResponseRD: RemoteData<AidboxResource>,
    closeExpressionModal: () => void,
) {
    const [expressionResultOutput, setExpressionResultOutput] = useState<ExpressionResultOutput | null>(null);
    const [fullLaunchContext, setFullLaunchContext] = useState<Record<string, any>>([]);

    const [fullLaunchContextRD] = useService(async () => {
        return await service<Record<string, any>>({
            method: 'POST',
            url: 'Questionnaire/$context',
            data: launchContext,
        });
    });

    useEffect(() => {
        if (isSuccess(fullLaunchContextRD)) {
            setFullLaunchContext(fullLaunchContextRD.data);
        }
    }, [fullLaunchContext, fullLaunchContextRD]);

    const parameterName = extractParameterName(expressionModalInfo.expression);

    const setContextData = useCallback(() => {
        if (expressionModalInfo.type === 'LaunchContext') {
            return fullLaunchContext[parameterName];
        }
        if (expressionModalInfo.type === 'QuestionnaireResponse') {
            if (isSuccess(questionnaireResponseRD)) {
                return questionnaireResponseRD.data;
            }
        }
        return launchContext.parameter?.map((item) => item.name);
    }, [expressionModalInfo.type, launchContext.parameter, fullLaunchContext, parameterName, questionnaireResponseRD]);

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
            const evaluate = fhirpath.evaluate(setContextData(), expressionModalInfo.expression, fullLaunchContext);
            setExpressionResultOutput({ type: 'success', result: yaml.dump(JSON.parse(JSON.stringify(evaluate))) });
        } catch (e) {
            setExpressionResultOutput({ type: 'error', result: String(e) });
        }
    }, [expressionModalInfo.expression, fullLaunchContext, setContextData]);

    return {
        expressionResultOutput,
        saveExpression,
        parameterName,
        fullLaunchContext,
    };
}
