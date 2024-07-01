import fhirpath from 'fhirpath';
import yaml from 'js-yaml';
import { useCallback, useContext, useEffect, useState } from 'react';
import { extractParameterName } from 'web/src/components/ModalExpression/utils';
import { ExpressionResultOutput } from 'web/src/containers/Main/types';
import YAML, { visitor } from 'yaml';

import { useService } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';
import { service } from 'src/services/fhir';

import { QuestionnaireResponse } from 'shared/src/contrib/aidbox';

import { ModalExpressionProps } from './types';
import { CodeEditorContext } from '../CodeEditor/context';

export function useExpressionModal(props: ModalExpressionProps) {
    const {
        type,
        launchContext,
        expression,
        questionnaireResponseRD,
        position,
        closeExpressionModal,
    } = props;
    const { view } = useContext(CodeEditorContext);
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

    const parameterName = extractParameterName(expression);

    const setContextData = useCallback(() => {
        if (isSuccess(questionnaireResponseRD)) {
            return questionnaireResponseRD.data;
        }
        if (type === 'LaunchContext') {
            return fullLaunchContext[parameterName];
        }
        return launchContext.parameter?.map((item) => item.name);
    }, [type, launchContext.parameter, fullLaunchContext, parameterName, questionnaireResponseRD]);

    const saveExpression = () => {
        if (view && position) {
            const doc = YAML.parseDocument(view.state.doc.toString());
            const index = view.posAtCoords({ x: position.left, y: position.top })!;

            const questionnaireVisitor: visitor = {
                Scalar(key, node) {
                    if (index && node.range && index >= node.range[0] && index <= node.range[2]) {
                        node.value = expression;
                    }
                },
            };

            if (type === 'LaunchContext') {
                YAML.visit(doc, questionnaireVisitor);
                const tr = view.state.update({
                    changes: {
                        from: 0,
                        to: view.state.doc.length,
                        insert: YAML.stringify(doc),
                    },
                });
                view.update([tr]);
            }

            closeExpressionModal();
        }
    };

    useEffect(() => {
        try {
            const evaluate = fhirpath.evaluate(setContextData(), expression, fullLaunchContext);
            setExpressionResultOutput({
                type: 'success',
                result: yaml.dump(JSON.parse(JSON.stringify(evaluate))),
            });
        } catch (e) {
            setExpressionResultOutput({ type: 'error', result: String(e) });
        }
    }, [expression, fullLaunchContext, setContextData]);

    return {
        expressionResultOutput,
        saveExpression,
        parameterName,
        fullLaunchContext,
    };
}
