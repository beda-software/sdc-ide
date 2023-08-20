import { selectAll, undo, redo } from '@codemirror/commands';
import { Transaction } from '@codemirror/state';
import { useCallback, useContext, useState } from 'react';

import { getExpression } from './getExpression';
import { DebuggerState, CursorPosition } from './types';
import { CodeEditorContext } from '../context';

interface Props {
    closeMenu: () => void;
    reload?: () => void;
    position?: CursorPosition;
}

export function useMenuActions(props: Props) {
    const { view } = useContext(CodeEditorContext);
    const { closeMenu, reload, position } = props;
    const [debuggerState, setDebuggerState] = useState<DebuggerState | undefined>();

    const updateExpression = useCallback(
        (expression: string) =>
            setDebuggerState((state) =>
                state
                    ? {
                          ...state,
                          expression,
                      }
                    : undefined,
            ),
        [],
    );

    const menuDebug = useCallback(async () => {
        if (view && position) {
            getExpression({
                view,
                position,
                openDebugger: (expression, type) => setDebuggerState({ expression, type }),
            });
        }
        closeMenu();
    }, [view, closeMenu, position]);

    const menuReload = useCallback(async () => {
        reload?.();
        closeMenu();
    }, [reload, closeMenu]);

    const menuUndo = useCallback(async () => {
        if (view) {
            undo({
                state: view.state,
                dispatch: view.dispatch,
            });
        }
        closeMenu();
    }, [view, closeMenu]);

    const menuRedo = useCallback(async () => {
        if (view) {
            redo({
                state: view.state,
                dispatch: view.dispatch,
            });
        }
        closeMenu();
    }, [view, closeMenu]);

    const menuCut = useCallback(async () => {
        if (view) {
            const selection = view.state.selection.main;

            if (!selection.empty) {
                const contentToCut = view.state.sliceDoc(selection.from, selection.to);

                const tr = view.state.update({
                    changes: {
                        from: selection.from,
                        to: selection.to,
                        insert: '',
                    },
                    annotations: Transaction.userEvent.of('cut'),
                });

                view.dispatch(tr);

                await navigator.clipboard.writeText(contentToCut);
            }
        }
        closeMenu();
    }, [view, closeMenu]);

    const menuCopy = useCallback(async () => {
        if (view) {
            const selection = view.state.selection.main;

            if (!selection.empty) {
                const copiedText = view.state.sliceDoc(selection.from, selection.to);
                await navigator.clipboard.writeText(copiedText);
            }
        }
        closeMenu();
    }, [view, closeMenu]);

    const menuPaste = useCallback(async () => {
        if (view) {
            const clipboardContent = await navigator.clipboard.readText();
            view.dispatch({
                changes: {
                    from: view.state.selection.main.from,
                    to: view.state.selection.main.to,
                    insert: clipboardContent,
                },
            });
        }
        closeMenu();
    }, [view, closeMenu]);

    const menuSelectAll = useCallback(() => {
        if (view) {
            view.focus();
            selectAll({
                state: view.state,
                dispatch: view.dispatch,
            });
        }
        closeMenu();
    }, [view, closeMenu]);

    return {
        debuggerState,
        closeDebugger: () => setDebuggerState(undefined),
        updateExpression,
        actions: {
            debug: menuDebug,
            reload: reload ? menuReload : undefined,
            undo: menuUndo,
            redo: menuRedo,
            cut: menuCut,
            copy: menuCopy,
            paste: menuPaste,
            selectAll: menuSelectAll,
        },
    };
}
