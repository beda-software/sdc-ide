import React, { useRef } from 'react';
import { useOutsideClick } from 'src/components/ContextMenuModal/hooks';
import { ContextMenu, ContextMenuPosition } from 'src/containers/Main/types';

import s from './ContextMenuModal.module.scss';

interface ContextMenuModalProps {
    contextMenuPosition: ContextMenuPosition;
    contextMenu: ContextMenu;
}

export function ContextMenuModal({ contextMenuPosition, contextMenu }: ContextMenuModalProps) {
    const wrapperRef = useRef(null);
    useOutsideClick(wrapperRef, contextMenu);

    return (
        <div
            style={{
                top: contextMenuPosition.top,
                left: contextMenuPosition.left,
            }}
            className={s.wrapper}
            ref={wrapperRef}
        >
            {contextMenu.debugger && (
                <>
                    <div className={s.button} onClick={contextMenu.debugger}>
                        - Debugger
                    </div>
                    <div className={s.separater}>-------------</div>
                </>
            )}

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
