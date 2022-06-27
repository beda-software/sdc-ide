import React, { useRef } from 'react';
import { useOutsideClick } from 'web/src/components/ContextMenuModal/hooks';
import { ContextMenu, ContextMenuPosition } from 'web/src/containers/Main/types';

import s from './ContextMenuModal.module.scss';

interface ContextMenuModalProps {
    contextMenuPosition: ContextMenuPosition;
    contextMenu: ContextMenu;
}

export function ContextMenuModal({ contextMenuPosition, contextMenu }: ContextMenuModalProps) {
    const wrapperRef = useRef(null);
    useOutsideClick(wrapperRef, contextMenu);

    const position = {
        top: contextMenuPosition.top,
        left: contextMenuPosition.left,
    };

    if (contextMenuPosition.top > document.documentElement.clientHeight - 165) {
        position.top -= 165;
    }

    return (
        <div
            style={{ top: position.top, left: position.left }}
            className={s.wrapper}
            ref={wrapperRef}
        >
            <>
                <div
                    className={contextMenu.debugger ? s.button : s.buttonDisable}
                    onClick={contextMenu.debugger}
                >
                    - Debugger
                </div>
                <div
                    className={contextMenu.reload ? s.button : s.buttonDisable}
                    onClick={contextMenu.reload}
                >
                    - Reload
                </div>
                <div className={s.separater}>-------------</div>
            </>

            <div className={s.button} onClick={contextMenu.undo}>
                - Undo {'<--'}{' '}
            </div>
            <div className={s.button} onClick={contextMenu.redo}>
                - Redo {'-->'}{' '}
            </div>
            <div className={s.separater}>-------------</div>
            <div className={s.button} onClick={contextMenu.cut}>
                - Cut
            </div>
            <div className={s.button} onClick={contextMenu.copy}>
                - Copy
            </div>
            <div className={s.button} onClick={contextMenu.paste}>
                - Paste
            </div>
            <div className={s.button} onClick={contextMenu.selectAll}>
                - Select All
            </div>
        </div>
    );
}
