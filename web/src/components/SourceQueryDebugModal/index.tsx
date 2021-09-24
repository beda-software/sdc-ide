import React from 'react';

import { Parameters } from 'shared/src/contrib/aidbox/index';

import { CodeEditor } from 'src/components/CodeEditor';
import { Button } from 'src/components/Button';
import { useSourceQueryDebugModal } from 'src/components/SourceQueryDebugModal/hooks';

import s from './SourceQueryDebugModal.module.scss';

interface Props {
    sourceQueryId: string;
    closeExpressionModal: () => void;
    launchContext: Parameters;
}

export function SourceQueryDebugModal(props: Props) {
    const { sourceQueryId, closeExpressionModal, launchContext } = props;
    const { rawSourceQuery, preparedSourceQuery, bunleResult } = useSourceQueryDebugModal(launchContext, sourceQueryId);
    return (
        <div className={s.wrapper}>
            <div className={s.window}>
                <div className={s.header}>
                    <div className={s.inputPath}>
                        <h2>ID: {sourceQueryId}</h2>
                    </div>
                    <div className={s.save}>
                        <Button onClick={console.log}>save</Button>
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
                            <CodeEditor key={sourceQueryId} valueObject={rawSourceQuery} onChange={console.log} />
                        )}

                        <h2>Prepared</h2>
                        {/*<RenderRemoteData remoteData={preparedSourceQueryRD}>*/}
                        {/*    {(resource) => (*/}
                        {/*        <CodeEditor*/}
                        {/*            key={resource.id}*/}
                        {/*            valueObject={resource}*/}
                        {/*            options={{*/}
                        {/*                readOnly: true,*/}
                        {/*            }}*/}
                        {/*        />*/}
                        {/*    )}*/}
                        {/*</RenderRemoteData>*/}
                        <CodeEditor
                            valueObject={preparedSourceQuery}
                            options={{
                                readOnly: true,
                            }}
                        />
                    </div>
                    <div className={s.outputData}>
                        <CodeEditor
                            valueObject={bunleResult}
                            options={{
                                readOnly: true,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
