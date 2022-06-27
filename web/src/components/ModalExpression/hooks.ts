import { useCallback, useEffect, useState } from 'react';
import fhirpath from 'fhirpath';
import yaml from 'js-yaml';
import YAML, { visitor } from 'yaml';
import { isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { AidboxResource, Parameters, QuestionnaireResponse } from 'shared/src/contrib/aidbox';
import { ExpressionModalInfo, ExpressionResultOutput } from 'web/src/containers/Main/types';
import { extractParameterName } from 'web/src/components/ModalExpression/utils';
import { useService } from 'aidbox-react/lib/hooks/service';
import { service } from 'aidbox-react/lib/services/service';

export function useExpressionModal(
    expressionModalInfo: ExpressionModalInfo,
    launchContext: Parameters,
    questionnaireResponseRD: RemoteData<AidboxResource>,
    closeExpressionModal: () => void,
) {
    const [expressionResultOutput, setExpressionResultOutput] =
        useState<ExpressionResultOutput | null>(null);
    const [fullLaunchContext, setFullLaunchContext] = useState<Record<string, any>>([]);

    const [fullLaunchContextRD] = useService(async () => {
        return await service<Record<string, QuestionnaireResponse>>({
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
        if (isSuccess(questionnaireResponseRD)) {
            return questionnaireResponseRD.data;
        }
        if (expressionModalInfo.type === 'LaunchContext') {
            return fullLaunchContext[parameterName];
        }
        return launchContext.parameter?.map((item) => item.name);
    }, [
        expressionModalInfo.type,
        launchContext.parameter,
        fullLaunchContext,
        parameterName,
        questionnaireResponseRD,
    ]);

    const saveExpression = () => {
        const doc = expressionModalInfo.doc;
        const newDoc = YAML.parseDocument(expressionModalInfo.doc.getValue());
        const index = doc.getEditor()?.indexFromPos(expressionModalInfo.cursorPosition);

        const questionnaireVisitor: visitor = {
            Scalar(key, node) {
                if (index && node.range && index >= node.range[0] && index <= node.range[2]) {
                    node.value = expressionModalInfo.expression;
                }
            },
        };

        if (expressionModalInfo.type === 'LaunchContext') {
            YAML.visit(newDoc, questionnaireVisitor);
            doc.setValue(YAML.stringify(newDoc));
        }

        closeExpressionModal();
    };

    useEffect(() => {
        try {
            const evaluate = fhirpath.evaluate(
                setContextData(),
                expressionModalInfo.expression,
                fullLaunchContext,
            );
            setExpressionResultOutput({
                type: 'success',
                result: yaml.dump(JSON.parse(JSON.stringify(evaluate))),
            });
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
