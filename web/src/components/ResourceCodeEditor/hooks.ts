import { useState } from 'react';
import { ContextMenuInfo, ExpressionModalInfo, ModalType } from 'src/containers/Main/types';
import { hasOwnProperty } from 'src/utils/common';

export function useExpressionModal() {
    const [expressionModalInfo, setExpressionModalInfo] = useState<ExpressionModalInfo | null>(null);

    const openExpressionModal = (contextMenuInfo: ContextMenuInfo) => {
        let modalType: ModalType | undefined;
        let choosenExpression;
        if (contextMenuInfo && hasOwnProperty(contextMenuInfo.valueObject, 'resourceType')) {
            if (contextMenuInfo.valueObject.resourceType === 'Questionnaire') {
                if (contextMenuInfo.event.target.innerText.split('')[0] === "'") {
                    modalType = 'LaunchContext';
                    choosenExpression = contextMenuInfo.event.target.innerText.replaceAll("'", '');
                }
                if (contextMenuInfo.event.target.innerText.split('')[0] === '"') {
                    modalType = 'LaunchContext';
                    choosenExpression = contextMenuInfo.event.target.innerText.replaceAll('"', '');
                }
                if (contextMenuInfo.event.target.innerText.includes('localRef')) {
                    modalType = 'SourceQueries';
                    choosenExpression = contextMenuInfo.event.target.innerText.split('#')[1];
                }
            }
            if (contextMenuInfo.valueObject.resourceType === 'Mapping') {
                if (contextMenuInfo.event.target.innerText.split('')[0] === "'") {
                    modalType = 'QuestionnaireResponse';
                    choosenExpression = contextMenuInfo.event.target.innerText.replaceAll("'", '');
                }
                if (contextMenuInfo.event.target.innerText.split('')[0] === '"') {
                    modalType = 'QuestionnaireResponse';
                    choosenExpression = contextMenuInfo.event.target.innerText.replaceAll('"', '');
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
