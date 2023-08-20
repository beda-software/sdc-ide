import { Button } from 'web/src/components/Button';
import { CodeEditor } from 'web/src/components/CodeEditor';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';

import { useSourceQueryDebugModal } from './hooks';
import s from './SourceQueryDebugModal.module.scss';
import { Props } from './types';

export function SourceQueryDebugModal(props: Props) {
    const { sourceQueryId, closeExpressionModal, resource } = props;
    const { rawSourceQuery, response, onChange, onSave } = useSourceQueryDebugModal(props);

    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div className={s.header}>
                    <div className={s.inputPath}>
                        <h2>ID: {sourceQueryId}</h2>
                    </div>
                    <div className={s.save}>
                        <Button onClick={() => onSave(resource)}>save</Button>
                    </div>
                    <div className={s.close}>
                        <Button variant="secondary" onClick={closeExpressionModal}>
                            close
                        </Button>
                    </div>
                </div>
                <RenderRemoteData remoteData={response}>
                    {({ bundleResult, preparedSourceQuery }) => (
                        <div className={s.data}>
                            <div className={s.inputData}>
                                <h2>Raw</h2>
                                {rawSourceQuery && (
                                    <CodeEditor
                                        key={sourceQueryId}
                                        value={rawSourceQuery}
                                        onChange={onChange}
                                    />
                                )}
                                <div className={s.separator} />
                                <h2>Prepared</h2>
                                <CodeEditor
                                    key={preparedSourceQuery.id}
                                    value={preparedSourceQuery}
                                    readOnly
                                />
                            </div>
                            <div className={s.outputData}>
                                <CodeEditor value={bundleResult} readOnly />
                            </div>
                        </div>
                    )}
                </RenderRemoteData>
            </div>
        </div>
    );
}
