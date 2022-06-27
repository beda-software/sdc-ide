import React from 'react';
import { ErrorButton } from 'web/src/components/ErrorButton';
import { MappingErrorManager } from 'src/containers/Main/types';

interface Props {
    mappingErrorManager: MappingErrorManager;
    id?: string;
}

export function MappingSelectError({ mappingErrorManager, id }: Props) {
    if (mappingErrorManager.isError(id)) {
        return (
            <>
                {id}
                <ErrorButton
                    count={mappingErrorManager.errorCount}
                    showError={mappingErrorManager.showError}
                />
            </>
        );
    } else return <>{id}</>;
}
