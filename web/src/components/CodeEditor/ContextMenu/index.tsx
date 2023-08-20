import { QuestionnaireResponse, Parameters, Questionnaire } from 'fhir/r4b';
import { useRef } from 'react';
import { ModalExpression } from 'web/src/components/ModalExpression';
import { SourceQueryDebugModal } from 'web/src/components/SourceQueryDebugModal';

import { RemoteData } from 'fhir-react/lib/libs/remoteData';

import s from './ContextMenu.module.scss';
import { useContextMenu } from './useContextMenu';
import { useMenuActions } from './useMenuActions';

interface ContextMenuProps<R> {
    resource: R;
    reload?: () => void;
    readOnly?: boolean;
    launchContext: Parameters;
    questionnaireResponseRD: RemoteData<QuestionnaireResponse>;
}

export function ContextMenu<R>(props: ContextMenuProps<R>) {
    const { readOnly = false, launchContext, questionnaireResponseRD, resource, reload } = props;
    const menuRef = useRef<HTMLDivElement>(null);
    const { menuOpened, position, closeMenu } = useContextMenu(menuRef);
    const { actions, debuggerState, closeDebugger, updateExpression } = useMenuActions({
        ...props,
        closeMenu,
        position,
    });

    const renderMenu = () => {
        if (!menuOpened || !position || readOnly) {
            return null;
        }

        if (position.top > document.documentElement.clientHeight - 165) {
            position.top -= 165;
        }

        return (
            <div
                style={{ top: position.top, left: position.left }}
                className={s.wrapper}
                ref={menuRef}
            >
                <>
                    <div className={s.button} onClick={actions.debug}>
                        - Debugger
                    </div>
                    <div
                        className={actions.reload ? s.button : s.buttonDisable}
                        onClick={actions.reload}
                    >
                        - Reload
                    </div>
                    <div className={s.separater}>-------------</div>
                </>

                <div className={s.button} onClick={actions.undo}>
                    - Undo {'<--'}{' '}
                </div>
                <div className={s.button} onClick={actions.redo}>
                    - Redo {'-->'}{' '}
                </div>
                <div className={s.separater}>-------------</div>
                <div className={s.button} onClick={actions.cut}>
                    - Cut
                </div>
                <div className={s.button} onClick={actions.copy}>
                    - Copy
                </div>
                <div className={s.button} onClick={actions.paste}>
                    - Paste
                </div>
                <div className={s.button} onClick={actions.selectAll}>
                    - Select All
                </div>
            </div>
        );
    };

    const renderModals = () => {
        if (!debuggerState || readOnly) {
            return null;
        }

        if (debuggerState?.type === 'SourceQueries') {
            return (
                <SourceQueryDebugModal
                    sourceQueryId={debuggerState?.expression || ''}
                    closeExpressionModal={() => {
                        closeDebugger();
                        reload?.();
                    }}
                    launchContext={launchContext}
                    resource={resource as any as Questionnaire}
                />
            );
        }

        return (
            <ModalExpression
                expression={debuggerState.expression}
                type={debuggerState.type}
                launchContext={launchContext}
                questionnaireResponseRD={questionnaireResponseRD}
                closeExpressionModal={closeDebugger}
                setExpression={updateExpression}
                position={position}
            />
        );
    };

    return (
        <>
            {renderMenu()}
            {renderModals()}
        </>
    );
}
