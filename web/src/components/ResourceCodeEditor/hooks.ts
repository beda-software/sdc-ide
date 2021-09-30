import { useState } from 'react';
import { ContextMenuInfo, ExpressionModalInfo, ModalType } from 'src/containers/Main/types';
import { hasOwnProperty } from 'src/utils/common';

export function useExpressionModal() {
    const [expressionModalInfo, setExpressionModalInfo] = useState<ExpressionModalInfo | null>(null);

    const openExpressionModal = (contextMenuInfo: ContextMenuInfo) => {
        let modalType: ModalType | undefined;
        let choosenExpression;

        const innerText = contextMenuInfo.event.target.innerText;

        if (contextMenuInfo && hasOwnProperty(contextMenuInfo.valueObject, 'resourceType')) {
            if (contextMenuInfo.valueObject.resourceType === 'Questionnaire') {
                if (innerText.split('')[0] === "'") {
                    modalType = 'LaunchContext';
                    choosenExpression = innerText.replaceAll("'", '');
                }
                if (innerText.split('')[0] === '"') {
                    modalType = 'LaunchContext';
                    choosenExpression = innerText.replaceAll('"', '');
                }
                if (innerText.includes('localRef')) {
                    modalType = 'SourceQueries';
                    choosenExpression = innerText.split('#')[1];
                }
                if (innerText.includes('#Bundle')) {
                    modalType = 'SourceQueries';
                    choosenExpression = innerText.split('#')[2].replace("'", '');
                }
            }
            if (contextMenuInfo.valueObject.resourceType === 'Mapping') {
                if (innerText.split('')[0] === "'") {
                    modalType = 'QuestionnaireResponse';
                    choosenExpression = innerText.replaceAll("'", '');
                }
                if (innerText.split('')[0] === '"') {
                    modalType = 'QuestionnaireResponse';
                    choosenExpression = innerText.replaceAll('"', '');
                }
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
