import { useState } from 'react';
import CodeMirror from 'codemirror';
import { ModalInfo, ModalType, ValueObject } from 'src/containers/Main/types';

export function useModalExpression() {
    const [modalInfo, setModalInfo] = useState<ModalInfo | null>(null);

    const setExpressionInfo = (_editor: CodeMirror.Editor, choosenExpression: string, type: ModalType) => {
        CodeMirror.commands.goLineStartSmart(_editor);
        setModalInfo({
            type,
            expression: choosenExpression,
            doc: _editor.getDoc(),
            cursorPosition: _editor.getDoc().getCursor(),
        });
    };

    const openExpressionModal = (_editor: CodeMirror.Editor, event: any, valueObject: ValueObject) => {
        if (hasOwnProperty(valueObject, 'resourceType')) {
            if (valueObject.resourceType === 'Questionnaire' && event.target.innerText.split('')[0] === "'") {
                const choosenExpression = event.target.innerText.replaceAll("'", '');
                setExpressionInfo(_editor, choosenExpression, 'LaunchContext');
            }
            if (valueObject.resourceType === 'Mapping' && event.target.innerText.split('')[0] === '"') {
                const choosenExpression = event.target.innerText.replaceAll('"', '');
                setExpressionInfo(_editor, choosenExpression, 'QuestionnaireResponse');
            }
        }
    };

    const closeExpressionModal = () => {
        setModalInfo(null);
    };

    const setExpression = (expression: string) => {
        setModalInfo((modalInfo) => modalInfo && { ...modalInfo, expression });
    };

    return {
        openExpressionModal,
        modalInfo,
        closeExpressionModal,
        setExpression,
    };
}

function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
}
