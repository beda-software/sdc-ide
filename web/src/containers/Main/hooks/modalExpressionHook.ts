import { useCallback, useEffect, useState } from 'react';
import CodeMirror, { Position } from 'codemirror';
import fhirpath from 'fhirpath';
import yaml from 'js-yaml';
import { isSuccess, RemoteData } from 'aidbox-react/src/libs/remoteData';
import { AidboxResource, Parameters } from 'shared/src/contrib/aidbox';
import { ValueObject } from 'src/containers/Main/types';

export function useModalExpression(launchContext: Parameters, questionnaireResponseRD: RemoteData<AidboxResource>) {
    const [showModalExpression, setShowModalExpression] = useState(false);
    const [modalType, setModalType] = useState('');
    const [expression, setExpression] = useState('');
    const [doc, setDoc] = useState<CodeMirror.Doc | undefined>();
    const [cursorPosition, setCursorPosition] = useState<Position | undefined>();
    const [expressionResultOutput, setExpressionResultOutput] = useState('');
    const [indexOfContext, setIndexOfContext] = useState(0);

    const setContextData = useCallback(() => {
        if (modalType === 'Launch Context') {
            launchContext?.parameter?.map((parameter, index) => {
                if (parameter.name === String(expression.split('.')[0]).slice(1)) {
                    setIndexOfContext(index);
                }
            });
            return launchContext?.parameter?.[indexOfContext]?.resource;
        }
        if (modalType === 'QuestionnaireResponse FHIR resource') {
            if (isSuccess(questionnaireResponseRD)) {
                return questionnaireResponseRD.data;
            } else {
                console.log('Error: questionnaireResponseRD failure');
            }
        }
    }, [modalType, launchContext, indexOfContext, expression, questionnaireResponseRD]);

    const selectContext = useCallback(() => {
        const contextData: Record<string, any> = {};
        if (modalType === 'Launch Context') {
            launchContext.parameter?.map((parameter) => {
                contextData[parameter.name] = setContextData();
            });
            return contextData;
        }
        if (modalType === 'QuestionnaireResponse FHIR resource') {
            if (isSuccess(questionnaireResponseRD)) {
                contextData[questionnaireResponseRD.data.resourceType] = setContextData();
                return contextData;
            }
        }
    }, [launchContext.parameter, modalType, questionnaireResponseRD, setContextData]);

    const setExpressionInfo = (_editor: CodeMirror.Editor, choosenExpression: string) => {
        CodeMirror.commands.goLineStartSmart(_editor);
        setExpression(choosenExpression);
        setShowModalExpression(true);
        setDoc(_editor.getDoc());
        setCursorPosition(_editor.getDoc().getCursor());
    };

    const openExpressionModal = (_editor: CodeMirror.Editor, event: any, valueObject: ValueObject) => {
        if (hasOwnProperty(valueObject, 'resourceType')) {
            if (valueObject.resourceType === 'Questionnaire' && event.target.innerText.split('')[0] === "'") {
                const choosenExpression = event.target.innerText.replaceAll("'", '');
                setModalType('Launch Context');
                setExpressionInfo(_editor, choosenExpression);
            }
            if (valueObject.resourceType === 'Mapping' && event.target.innerText.split('')[0] === '"') {
                const choosenExpression = event.target.innerText.replaceAll('"', '');
                setModalType('QuestionnaireResponse FHIR resource');
                setExpressionInfo(_editor, choosenExpression);
            }
        }
    };

    const tryEvaluate = useCallback(() => {
        try {
            const evaluate = fhirpath.evaluate(setContextData(), expression, selectContext());
            setExpressionResultOutput(yaml.dump(JSON.parse(JSON.stringify(evaluate))));
        } catch (e) {
            setExpressionResultOutput(String(e));
        }
    }, [expression, selectContext, setContextData, setExpressionResultOutput]);

    const saveExpression = () => {
        if (doc && cursorPosition) {
            const lineLength = doc.getLine(cursorPosition.line).length;
            const replacingFromPosition = { line: cursorPosition.line, ch: cursorPosition.ch };
            const replacingToPosition = { line: cursorPosition.line, ch: lineLength };
            let newLine = '';
            if (modalType === 'Launch Context') {
                newLine = `expression: '${expression}'`;
            }
            if (modalType === 'QuestionnaireResponse FHIR resource') {
                newLine = `fhirpath("${expression}")`;
            }
            doc.replaceRange(newLine, replacingFromPosition, replacingToPosition);
        }
        setShowModalExpression(false);
    };

    useEffect(() => {
        tryEvaluate();
    }, [tryEvaluate]);

    return {
        showModalExpression,
        modalType,
        setShowModalExpression,
        expression,
        setExpression,
        openExpressionModal,
        expressionResultOutput,
        saveExpression,
        setContextData,
    };
}

function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}
