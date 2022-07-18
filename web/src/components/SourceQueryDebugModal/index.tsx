import { Button } from 'web/src/components/Button';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { useSourceQueryDebugModal } from 'web/src/components/SourceQueryDebugModal/hooks';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';

import { Parameters, Questionnaire } from 'shared/src/contrib/aidbox/index';

import s from './SourceQueryDebugModal.module.scss';

interface Props {
    sourceQueryId: string;
    closeExpressionModal: () => void;
    launchContext: Parameters;
    resource: Questionnaire;
    fhirMode: boolean;
}

export function SourceQueryDebugModal(props: Props) {
    const { sourceQueryId, closeExpressionModal, launchContext, resource, fhirMode } = props;
    const { rawSourceQuery, response, onChange, onSave } = useSourceQueryDebugModal({
        launchContext,
        sourceQueryId,
        closeExpressionModal,
        fhirMode,
    });
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
                                        valueObject={rawSourceQuery}
                                        onChange={onChange}
                                    />
                                )}
                                <div className={s.separator} />
                                <h2>Prepared</h2>
                                <CodeEditor
                                    key={preparedSourceQuery.id}
                                    valueObject={preparedSourceQuery}
                                    options={{
                                        readOnly: true,
                                    }}
                                />
                            </div>
                            <div className={s.outputData}>
                                <CodeEditor
                                    valueObject={bundleResult}
                                    options={{
                                        readOnly: true,
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </RenderRemoteData>
            </div>
        </div>
    );
}
