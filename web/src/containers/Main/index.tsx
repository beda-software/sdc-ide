import React from 'react';
import { useParams } from 'react-router-dom';
import { useMain } from 'src/containers/Main/hooks';

export function Main() {
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const mainData = useMain(questionnaireId);
    return (
        <>
            <pre>{JSON.stringify(mainData, undefined, 2)}</pre>
        </>
    );
}
