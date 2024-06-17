import Editor from '@monaco-editor/react';
import { Allotment } from 'allotment';
import { FhirResource } from 'fhir/r4b';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from 'web/src/components/Button';
import { Cell } from 'web/src/components/Cell';
import { CodeEditor } from 'web/src/components/CodeEditor';
import { LaunchContextEditor } from 'web/src/components/LaunchContextEditor';
import { Logo } from 'web/src/components/Logo';
import 'react-toastify/dist/ReactToastify.css';
import { ResourceCodeDisplay } from 'web/src/components/ResourceCodeDisplay';
import { version } from 'web/src/version';

import { RenderRemoteData } from '@beda.software/fhir-react';
import { isSuccess } from '@beda.software/remote-data';


import { FormRenderContext } from './context';
import s from './Main.module.scss';
import { MappingEditor } from './MappingEditor';
import { QuestionnaireEditor } from './QuestionnaireEditor';
import { useFHIRMappingLanguage } from './useFHIRMappingLanguage';
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
            isSuccess(questionnaireResponseRD) ? questionnaireResponseRD.data : undefined,
        );

    const QRFormWrapper = useContext(FormRenderContext);

    return (
        <>
            <div className={s.editor}>
                <Allotment vertical>
                    <Allotment>
                        <Cell title="Launch Context">
                            <RenderRemoteData remoteData={originalQuestionnaireRD}>
                                {(resource) => (
                                    <LaunchContextEditor
                                        questionnaire={resource}
                                        launchContext={launchContext}
                                        onChange={manager.setLaunchContext}
                                        onRemove={manager.clearLaunchContext}
                                    />
                                )}
                            </RenderRemoteData>
                        </Cell>
                        <Cell title="Questionnaire FHIR Resource" even={true}>
                            <QuestionnaireEditor
                                questionnaireRD={originalQuestionnaireRD}
                                onSave={manager.saveQuestionnaire}
                                launchContext={launchContext}
                                questionnaireResponseRD={questionnaireResponseRD}
                                reload={manager.reloadQuestionnaire}
                                generateQuestionnaire={manager.generateQuestionnaire}
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
                            <QRFormWrapper
                                questionnaireRD={assembledQuestionnaireRD}
                                questionnaireResponseRD={questionnaireResponseRD}
                                saveQuestionnaireResponse={manager.setQuestionnaireResponse}
                                launchContextParameters={launchContext.parameter}
                            />
                        </Cell>
                    </Allotment>
                    <Allotment>
                        <Cell title="QuestionnaireResponse FHIR resource">
                            <ResourceCodeDisplay resourceResponse={questionnaireResponseRD} />
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
                                    questionnaireResponseRD={questionnaireResponseRD}
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
                                <ResourceCodeDisplay resourceResponse={extractRD} />
                            )}
                            {isSuccess(extractRD) && (
                                <Button
                                    onClick={() => {
                                        if (isSuccess(extractRD)) {
                                            manager.applyMapping(extractRD.data);
                                        }
                                    }}
                                    disabled={!isSuccess(extractRD)}
                                    className={s.applyButton}
                                >
                                    Apply
                                </Button>
                            )}
                        </Cell>
                    </Allotment>
                </Allotment>
            </div>
            <div className={s.footer}>
                <div className={s.version}>{`v${version}`}</div>
                <Logo />
            </div>
        </>
    );
}
