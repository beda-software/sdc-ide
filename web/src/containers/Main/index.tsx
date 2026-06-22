import { formatError } from '@beda.software/fhir-react';
import { isSuccess, mapSuccess, sequenceMap } from '@beda.software/remote-data';
import Editor from '@monaco-editor/react';
import { Allotment } from 'allotment';
import { FhirResource } from 'fhir/r4b';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BedaFormsRenderer } from 'web/src/components/BedaFormsRenderer';
import { Button } from 'web/src/components/Button';
import { CachedRemoteData } from 'web/src/components/CachedRemoteData';
import { Cell } from 'web/src/components/Cell';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { ErrorBoundary } from 'web/src/components/ErrorBoundary';
import { ExternalRendererConsent } from 'web/src/components/ExternalRendererConsent';
import { LaunchContextEditor } from 'web/src/components/LaunchContextEditor';
import { Logo } from 'web/src/components/Logo';
import { QRFormWrapper } from 'web/src/components/QRFormWrapper';
import { QRFormWrapperLegacy } from 'web/src/components/QRFormWrapperLegacy';
import { RenderRemoteData } from 'web/src/components/RenderRemoteData';
import { ResourceCodeDisplay } from 'web/src/components/ResourceCodeDisplay';
import { version } from 'web/src/version';

import { useLocalStorage } from 'shared/src/hooks/local-storage';

import s from './Main.module.scss';
import { MappingEditor } from './MappingEditor';
import { QuestionnaireEditor } from './QuestionnaireEditor';
import { useFHIRMappingLanguage } from './useFHIRMappingLanguage';
import { useIDELayout } from './useIDELayout';
import { useMain } from './useMain';

import 'allotment/dist/style.css';

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
    const [selectedRenderer, setSelectedRenderer] = useLocalStorage<
        'internal' | 'internal-legacy' | 'beda-forms'
    >('sdc-ide-renderer', 'internal');

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
                                <span
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 8,
                                        width: '100%',
                                    }}
                                >
                                    <span
                                        style={{
                                            flex: 1,
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap',
                                        }}
                                    >
                                        {isSuccess(originalQuestionnaireRD)
                                            ? originalQuestionnaireRD.data.title ||
                                              originalQuestionnaireRD.data.name ||
                                              originalQuestionnaireRD.data.id
                                            : ''}
                                    </span>
                                    <RendererSelector
                                        selected={selectedRenderer}
                                        onChange={setSelectedRenderer}
                                    />
                                </span>
                            }
                        >
                            <ErrorBoundary
                                resetKeys={[assembledQuestionnaireRD, launchContext.parameter]}
                            >
                                {selectedRenderer === 'internal' ? (
                                    <QRFormWrapper
                                        questionnaireRD={assembledQuestionnaireRD}
                                        questionnaireResponseRD={questionnaireResponseRD}
                                        saveQuestionnaireResponse={manager.setQuestionnaireResponse}
                                        launchContextParameters={launchContext.parameter}
                                    />
                                ) : selectedRenderer === 'internal-legacy' ? (
                                    <QRFormWrapperLegacy
                                        questionnaireRD={assembledQuestionnaireRD}
                                        questionnaireResponseRD={questionnaireResponseRD}
                                        saveQuestionnaireResponse={manager.setQuestionnaireResponse}
                                        launchContextParameters={launchContext.parameter}
                                    />
                                ) : (
                                    <ExternalRendererConsent
                                        engineId="beda-forms"
                                        engineName="Beda Forms"
                                        publisher="beda.software"
                                        description="Beda Forms is an open-source SDC questionnaire renderer hosted by beda.software."
                                    >
                                        <RenderRemoteData
                                            remoteData={sequenceMap({
                                                questionnaire: assembledQuestionnaireRD,
                                                questionnaireResponse: questionnaireResponseRD,
                                            })}
                                            renderFailure={(errors: Error[]) => (
                                                <p>{errors.map((e) => formatError(e)).join(',')}</p>
                                            )}
                                        >
                                            {(data) => (
                                                <BedaFormsRenderer
                                                    questionnaire={data.questionnaire}
                                                    questionnaireResponse={
                                                        data.questionnaireResponse.inProgressQR
                                                    }
                                                    launchContextParameters={
                                                        launchContext.parameter ?? []
                                                    }
                                                    onChange={(qr) =>
                                                        manager.setQuestionnaireResponse({
                                                            inProgressQR: qr,
                                                            completedQR: {
                                                                ...qr,
                                                                status: 'completed',
                                                            },
                                                        })
                                                    }
                                                />
                                            )}
                                        </RenderRemoteData>
                                    </ExternalRendererConsent>
                                )}
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

type RendererOption = 'internal' | 'internal-legacy' | 'beda-forms';

const RENDERER_OPTIONS: { id: RendererOption; label: string }[] = [
    { id: 'internal', label: 'fhir-questionnaire' },
    { id: 'internal-legacy', label: 'sdc-qrf' },
    { id: 'beda-forms', label: 'Beda Forms' },
];

function RendererSelector({
    selected,
    onChange,
}: {
    selected: RendererOption;
    onChange: (v: RendererOption) => void;
}) {
    return (
        <span style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
            {RENDERER_OPTIONS.map((opt) => (
                <button
                    key={opt.id}
                    onClick={() => onChange(opt.id)}
                    style={{
                        padding: '1px 8px',
                        fontSize: 11,
                        fontWeight: selected === opt.id ? 600 : 400,
                        border: '1px solid',
                        borderColor: selected === opt.id ? '#1976d2' : '#ccc',
                        borderRadius: 3,
                        background: selected === opt.id ? '#e3f2fd' : 'transparent',
                        color: selected === opt.id ? '#1565c0' : '#666',
                        cursor: 'pointer',
                        lineHeight: '18px',
                    }}
                >
                    {opt.label}
                </button>
            ))}
        </span>
    );
}
