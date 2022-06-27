import { useState } from 'react';
import YAML, { visitor, visitorFn } from 'yaml';
import { Pair } from 'yaml/types';
import { ContextMenuInfo, ExpressionModalInfo, ModalType } from 'web/src/containers/Main/types';
import { hasOwnProperty } from 'web/src/utils/common';

interface QuestionnaireVisitor {
    Pair?: visitorFn<Pair>;
}

// no more strict type
type Path = readonly any[];

export function useExpressionModal() {
    const [expressionModalInfo, setExpressionModalInfo] = useState<ExpressionModalInfo | null>(
        null,
    );

    const openExpressionModal = (contextMenuInfo: ContextMenuInfo) => {
        let modalType: ModalType | undefined;
        let choosenExpression = '';

        const doc = YAML.parseDocument(contextMenuInfo.editor.getDoc().getValue());
        const index = contextMenuInfo.editor.indexFromPos(contextMenuInfo.cursorPosition);

        const questionnaireVisitor: QuestionnaireVisitor = {
            Pair(_, pair, path: Path) {
                if (index >= pair.value.range[0] && index <= pair.value.range[2]) {
                    const length = path.length;
                    if (
                        pair.key.value === 'expression' &&
                        path[length - 1].items[0].key.value === 'language' &&
                        path[length - 1].items[0].value.value === 'text/fhirpath'
                    ) {
                        modalType = 'LaunchContext';
                        choosenExpression = pair.value.value;
                        return YAML.visit.BREAK;
                    }
                    if (
                        pair.key.value === 'localRef' &&
                        path[length - 3].key.value === 'sourceQueries'
                    ) {
                        modalType = 'SourceQueries';
                        choosenExpression = pair.value.value.split('#')[1];
                        return YAML.visit.BREAK;
                    }
                    if (
                        pair.key.value === 'reference' &&
                        pair.value.value.slice(0, 7) === '#Bundle' &&
                        path[length - 2].key.value === 'valueReference' &&
                        path[length - 3].items[0].key.value === 'url'
                    ) {
                        modalType = 'SourceQueries';
                        choosenExpression = pair.value.value.split('#')[2];
                        return YAML.visit.BREAK;
                    }
                }
            },
        };

        if (contextMenuInfo && hasOwnProperty(contextMenuInfo.valueObject, 'resourceType')) {
            if (contextMenuInfo.valueObject.resourceType === 'Questionnaire') {
                YAML.visit(doc, questionnaireVisitor as visitor);
            }
        }

        if (modalType) {
            setExpressionModalInfo({
                type: modalType,
                expression: choosenExpression,
                doc: contextMenuInfo.editor.getDoc(),
                cursorPosition: contextMenuInfo.cursorPosition,
            });
        }
    };

    const closeExpressionModal = () => {
        setExpressionModalInfo(null);
    };

    const setExpression = (expression: string) => {
        setExpressionModalInfo((modalInfo) => modalInfo && { ...modalInfo, expression });
    };

    return {
        openExpressionModal,
        expressionModalInfo,
        closeExpressionModal,
        setExpression,
    };
}
