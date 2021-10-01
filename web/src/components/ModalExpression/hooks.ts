import { useCallback, useEffect, useState } from 'react';
import fhirpath from 'fhirpath';
import yaml from 'js-yaml';
import { isSuccess, RemoteData } from 'aidbox-react/src/libs/remoteData';
import { AidboxResource, Parameters } from 'shared/src/contrib/aidbox';
import { ExpressionModalInfo, ExpressionResultOutput } from 'src/containers/Main/types';
import { chooseMultiLineExpression, replaceLine, replaceMultiLine } from 'src/utils/codemirror';
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
        if (expressionModalInfo.type === 'QuestionnaireResponse' && isSuccess(questionnaireResponseRD)) {
            return questionnaireResponseRD.data;
        }
        return launchContext.parameter?.map((item) => item.name);
    }, [expressionModalInfo.type, launchContext.parameter, fullLaunchContext, parameterName, questionnaireResponseRD]);

    const saveExpression = () => {
        const cursorPosition = expressionModalInfo.cursorPosition;
        const lineBefore = expressionModalInfo.doc.getLine(cursorPosition.line);
        const doc = expressionModalInfo.doc;

        if (expressionModalInfo.type === 'LaunchContext' && lineBefore.trimStart()[0] === '%') {
            const multiLineExpression = chooseMultiLineExpression(lineBefore, doc, cursorPosition);
            multiLineExpression.text = expressionModalInfo.expression;
            replaceMultiLine(doc, cursorPosition, multiLineExpression);
        }
        if (expressionModalInfo.type === 'LaunchContext' && lineBefore.trimStart()[0] !== '%') {
            const array = lineBefore.split("'");
            array[1] = expressionModalInfo.expression;
            const expression = array.join("'");
            replaceLine(doc, cursorPosition, expression);
        }
        if (expressionModalInfo.type === 'QuestionnaireResponse') {
            const array = lineBefore.split('"');
            array[1] = expressionModalInfo.expression;
            const expression = array.join('"');
            replaceLine(doc, cursorPosition, expression);
        }
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
