import { useCallback, useContext, useEffect, useState } from 'react';

import { CursorPosition } from './types';
import { CodeEditorContext } from '../context';

export function useContextMenu(menuRef: React.RefObject<HTMLDivElement>) {
    const { editor } = useContext(CodeEditorContext);
    const [menuOpened, setMenuOpened] = useState(false);
    const [position, setPosition] = useState<CursorPosition | undefined>();

    const onContextMenuOpen = useCallback((e: MouseEvent) => {
        e.preventDefault();
        setPosition({ left: e.x, top: e.y });
        setMenuOpened(true);
    }, []);

    useEffect(() => {
        editor?.addEventListener('contextmenu', onContextMenuOpen);

        return () => {
            editor?.removeEventListener('contextmenu', onContextMenuOpen);
        };
    }, [editor, onContextMenuOpen]);

    const closeMenu = useCallback(() => {
        setMenuOpened(false);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as any)) {
                closeMenu();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef, closeMenu]);

    return { menuOpened, position, closeMenu };
}
