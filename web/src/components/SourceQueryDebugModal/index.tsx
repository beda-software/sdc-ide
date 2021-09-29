import React from 'react';

import { Parameters } from 'shared/src/contrib/aidbox/index';

import { CodeEditor } from 'src/components/CodeEditor';
import { Button } from 'src/components/Button';
import { useSourceQueryDebugModal } from 'src/components/SourceQueryDebugModal/hooks';

import s from './SourceQueryDebugModal.module.scss';
import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

interface Props {
    sourceQueryId: string;
    closeExpressionModal: () => void;
    launchContext: Parameters;
    resource: any; // TODO edit type (Questionnaire or AidboxResource)
}

export function SourceQueryDebugModal(props: Props) {
    const { sourceQueryId, closeExpressionModal, launchContext, resource } = props;
    const { rawSourceQuery, preparedSourceQueryRD, bundleResultRD, onChange, onSave } = useSourceQueryDebugModal({
        launchContext,
        sourceQueryId,
        resource,
        closeExpressionModal,
    });
    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div className={s.header}>
                    <div className={s.inputPath}>
                        <h2>ID: {sourceQueryId}</h2>
                    </div>
                    <div className={s.save}>
                        <Button onClick={onSave}>save</Button>
                    </div>
                    <div className={s.close}>
                        <Button variant="secondary" onClick={closeExpressionModal}>
                            close
                        </Button>
                    </div>
                </div>
                <div className={s.data}>
                    <div className={s.inputData}>
                        <h2>Raw</h2>
                        {rawSourceQuery && (
                            <CodeEditor key={sourceQueryId} valueObject={rawSourceQuery} onChange={onChange} />
                        )}
                        <div className={s.separator} />
                        <h2>Prepared</h2>
                        <RenderRemoteData remoteData={preparedSourceQueryRD}>
                            {(resource) => (
                                <CodeEditor
                                    key={resource.id}
                                    valueObject={resource}
                                    options={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        </RenderRemoteData>
                    </div>
                    <div className={s.outputData}>
                        <RenderRemoteData remoteData={bundleResultRD}>
                            {(resource) => (
                                <CodeEditor
                                    valueObject={resource}
                                    options={{
                                        readOnly: true,
                                    }}
                                />
                            )}
                        </RenderRemoteData>
                    </div>
                </div>
            </div>
        </div>
    );
}
