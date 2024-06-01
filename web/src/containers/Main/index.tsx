import { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Button } from 'web/src/components/Button';
import { ExpandableElement } from 'web/src/components/ExpandableElement';
import { ExpandableRow } from 'web/src/components/ExpandableRow';
import { LaunchContextEditor } from 'web/src/components/LaunchContextEditor';
import { Logo } from 'web/src/components/Logo';
import 'react-toastify/dist/ReactToastify.css';
import { ResourceCodeDisplay } from 'web/src/components/ResourceCodeDisplay';
import { version } from 'web/src/version';

import { RenderRemoteData } from 'fhir-react/lib/components/RenderRemoteData';
import { isSuccess } from 'fhir-react/lib/libs/remoteData';

import { FormRenderContext } from './context';
import s from './Main.module.scss';
import { MappingEditor } from './MappingEditor';
import { QuestionnaireEditor } from './QuestionnaireEditor';
import { useMain } from './useMain';

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

    const QRFormWrapper = useContext(FormRenderContext);

    return (
        <>
            <div className={s.editor}>
                <ToastContainer />
                <ExpandableRow className={s.upperRowContainer}>
                    <ExpandableElement title="Launch Context" className={s.patientFHIRResourceBox}>
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
                    </ExpandableElement>
                    <ExpandableElement title={'Questionnaire FHIR Resource'}>
                        <QuestionnaireEditor
                            questionnaireRD={originalQuestionnaireRD}
                            onSave={manager.saveQuestionnaire}
                            launchContext={launchContext}
                            questionnaireResponseRD={questionnaireResponseRD}
                            reload={manager.reloadQuestionnaire}
                            generateQuestionnaire={manager.generateQuestionnaire}
                        />
                    </ExpandableElement>
                    <ExpandableElement
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
                    </ExpandableElement>
                </ExpandableRow>
                <ExpandableRow className={s.lowerRowContainer}>
                    <ExpandableElement title="QuestionnaireResponse FHIR resource">
                        <ResourceCodeDisplay resourceResponse={questionnaireResponseRD} />
                    </ExpandableElement>
                    <ExpandableElement title={'Mapping'}>
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
                        />
                    </ExpandableElement>
                    <ExpandableElement title="Bundle transaction for extraction">
                        <ResourceCodeDisplay resourceResponse={extractRD} />
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
                    </ExpandableElement>
                </ExpandableRow>
            </div>
            <div className={s.footer}>
                <div className={s.version}>{`v${version}`}</div>
                <Logo />
            </div>
        </>
    );
}
