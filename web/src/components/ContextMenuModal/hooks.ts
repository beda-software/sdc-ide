import { useEffect } from 'react';
import { ContextMenu } from 'src/containers/Main/types';

export function useOutsideClick(ref: any, contextMenu: ContextMenu) {
    // TODO ref and event types
    useEffect(() => {
        function handleClickOutside(event: any) {
            if (ref.current && !ref.current.contains(event.target)) {
                contextMenu.close();
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [ref, contextMenu]);
}
