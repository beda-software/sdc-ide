import Editor from '@monaco-editor/react';
import { Allotment } from 'allotment';
import { FhirResource } from 'fhir/r4b';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Button } from 'web/src/components/Button';
import { CachedRemoteData } from 'web/src/components/CachedRemoteData';
import { Cell } from 'web/src/components/Cell';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { ErrorBoundary } from 'web/src/components/ErrorBoundary';
import { LaunchContextEditor } from 'web/src/components/LaunchContextEditor';
import { Logo } from 'web/src/components/Logo';
import 'react-toastify/dist/ReactToastify.css';
import { QRFormWrapper } from 'web/src/components/QRFormWrapper';
import { ResourceCodeDisplay } from 'web/src/components/ResourceCodeDisplay';
import { version } from 'web/src/version';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isSuccess } from 'fhir-react/lib/libs/remoteData';

import s from './Main.module.scss';
import { MappingEditor } from './MappingEditor';
import { QuestionnaireEditor } from './QuestionnaireEditor';
import { useFHIRMappingLanguage } from './useFHIRMappingLanguage';
import { useIDELayout } from './useIDELayout';
import { useMain } from './useMain';

import 'allotment/dist/style.css';
// eslint-disable-next-line import/order
import { mapSuccess } from 'aidbox-react/lib/services/service';

export function Main() {
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const {
        launchContext,
        originalQuestionnaireRD,
        assembledQuestionnaireRD,
        questionnaireResponseRD,
        mappingRD,
        extractRD,
        manager,
    } = useMain(questionnaireId!);
    const { mapString, setMapString, mappingResult, fhirMappingLangMode, toggleMappingMode } =
        useFHIRMappingLanguage(
            isSuccess(questionnaireResponseRD)
                ? questionnaireResponseRD.data.completedQR
                : undefined,
        );
    const { layout, setLayout } = useIDELayout();

    return (
        <>
            <div className={s.editor}>
                <Allotment
                    vertical
                    defaultSizes={layout.vertical}
                    onChange={(newSizes) => setLayout('vertical', newSizes)}
                >
                    <Allotment
                        defaultSizes={layout.horizontal1}
                        onChange={(newSizes) => setLayout('horizontal1', newSizes)}
                    >
                        <Cell title="Launch Context">
                            <RenderRemoteData remoteData={originalQuestionnaireRD}>
                                {(resource) => (
                                    <LaunchContextEditor
                                        questionnaire={resource}
                                        launchContext={launchContext}
                                        onChange={manager.setLaunchContext}
                                        onRemove={manager.clearLaunchContext}
                                        createLaunchContext={manager.createLaunchContext}
                                    />
                                )}
                            </RenderRemoteData>
                        </Cell>
                        <Cell title="Questionnaire FHIR Resource" even={true}>
                            <QuestionnaireEditor
                                questionnaireRD={originalQuestionnaireRD}
                                onSave={manager.saveQuestionnaire}
                                launchContext={launchContext}
                                questionnaireResponseRD={mapSuccess(
                                    questionnaireResponseRD,
                                    ({ inProgressQR }) => inProgressQR,
                                )}
                                reload={manager.reloadQuestionnaire}
                                generateQuestionnaire={manager.generateQuestionnaire}
                                createBlankQuestionnaire={manager.createBlankQuestionnaire}
                            />
                        </Cell>
                        <Cell
                            title={
                                isSuccess(originalQuestionnaireRD)
                                    ? originalQuestionnaireRD.data.title ||
                                      originalQuestionnaireRD.data.name ||
                                      originalQuestionnaireRD.data.id
                                    : ''
                            }
                        >
                            <ErrorBoundary
                                resetKeys={[assembledQuestionnaireRD, launchContext.parameter]}
                            >
                                <QRFormWrapper
                                    questionnaireRD={assembledQuestionnaireRD}
                                    questionnaireResponseRD={questionnaireResponseRD}
                                    saveQuestionnaireResponse={manager.setQuestionnaireResponse}
                                    launchContextParameters={launchContext.parameter}
                                />
                            </ErrorBoundary>
                        </Cell>
                    </Allotment>
                    <Allotment
                        defaultSizes={layout.horizontal2}
                        onChange={(newSizes) => setLayout('horizontal2', newSizes)}
                    >
                        <Cell title="QuestionnaireResponse FHIR resource">
                            <ResourceCodeDisplay
                                resourceResponse={mapSuccess(
                                    questionnaireResponseRD,
                                    ({ completedQR }) => completedQR,
                                )}
                            />
                        </Cell>
                        <Cell title="Mapping" even={true}>
                            {fhirMappingLangMode ? (
                                <Editor
                                    key="fhir-mapping-language-editor"
                                    defaultLanguage="ruby"
                                    onChange={(value) => {
                                        setMapString(value as string);
                                    }}
                                    value={mapString}
                                    options={{
                                        formatOnPaste: true,
                                        formatOnType: true,
                                        autoIndent: 'full',
                                        minimap: {
                                            enabled: false,
                                        },
                                    }}
                                />
                            ) : (
                                <MappingEditor
                                    mappingRD={mappingRD}
                                    questionnaireRD={originalQuestionnaireRD}
                                    onSave={manager.saveMapping}
                                    onChange={manager.setMapping}
                                    launchContext={launchContext}
                                    questionnaireResponseRD={mapSuccess(
                                        questionnaireResponseRD,
                                        ({ completedQR }) => completedQR,
                                    )}
                                    reload={manager.reloadMapping}
                                    createMapping={manager.createMapping}
                                    generateMapping={manager.generateMapping}
                                    toggleMappingMode={toggleMappingMode}
                                />
                            )}
                        </Cell>
                        <Cell title="Bundle transaction for extraction">
                            {fhirMappingLangMode ? (
                                <CodeEditor
                                    readOnly={true}
                                    value={mappingResult as FhirResource}
                                    key={JSON.stringify(mappingResult)}
                                />
                            ) : (
                                <CachedRemoteData remoteData={extractRD}>
                                    {(cachedExtractRD) => (
                                        <>
                                            <ResourceCodeDisplay
                                                resourceResponse={cachedExtractRD}
                                            />
                                            {isSuccess(cachedExtractRD) && (
                                                <Button
                                                    key="button"
                                                    onClick={() => {
                                                        if (isSuccess(cachedExtractRD)) {
                                                            manager.applyMapping(
                                                                cachedExtractRD.data,
                                                            );
                                                        }
                                                    }}
                                                    disabled={!isSuccess(cachedExtractRD)}
                                                    className={s.applyButton}
                                                >
                                                    Apply
                                                </Button>
                                            )}
                                        </>
                                    )}
                                </CachedRemoteData>
                            )}
                        </Cell>
                    </Allotment>
                </Allotment>
            </div>
            <div className={s.footer}>
                <div className={s.version}>{`v${version}`}</div>
                <Logo />
            </div>
            <ToastContainer autoClose={500} />
        </>
    );
}
