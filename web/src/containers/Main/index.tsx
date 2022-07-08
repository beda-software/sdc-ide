import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Button } from 'web/src/components/Button';
import { ExpandableElement } from 'web/src/components/ExpandableElement';
import { ExpandableRow } from 'web/src/components/ExpandableRow';
import { LaunchContextDisplay } from 'web/src/components/LaunchContextDisplay';
import { Logo } from 'web/src/components/Logo';
import { MappingSelect } from 'web/src/components/MappingSelect';
import { Menu } from 'web/src/components/Menu';
import { ModalCreateMapper } from 'web/src/components/ModalCreateMapper';
import { QRFormWrapper } from 'web/src/components/QRFormWrapper';
import { ResourceCodeDisplay } from 'web/src/components/ResourceCodeDisplay';
import { ResourceCodeEditor } from 'web/src/components/ResourceCodeEditor';
import { TitleWithErrors } from 'web/src/components/TitleWithErrors';
import { useMain } from 'web/src/containers/Main/hooks';

import { Mapping, Questionnaire } from 'shared/src/contrib/aidbox';

import 'react-toastify/dist/ReactToastify.css';
import s from './Main.module.scss';

export function Main() {
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const {
        launchContext,
        dispatch,
        fhirMode,
        setFhirMode,
        questionnaireRD,
        questionnaireFHIRRD,
        saveQuestionnaireFHIR,
        questionnaireResponseRD,
        saveQuestionnaireResponse,
        mappingList,
        activeMappingId,
        setActiveMappingId,
        mappingRD,
        saveMapping,
        batchRequestRD,
        applyMappings,
        showModal,
        saveNewMapping,
        closeModal,
        mapperInfoList,
        reload,
        mappingErrorManager,
        titleWithErrorManager,
    } = useMain(questionnaireId);

    return (
        <>
            {showModal && mapperInfoList && (
                <ModalCreateMapper
                    saveNewMapping={saveNewMapping}
                    closeModal={closeModal}
                    mapperInfoList={mapperInfoList}
                />
            )}
            <div className={s.mainContainer}>
                <ToastContainer />
                <ExpandableRow cssClass={s.upperRowContainer}>
                    <ExpandableElement title="Launch Context" cssClass={s.patientFHIRResourceBox}>
                        <LaunchContextDisplay parameters={launchContext} />
                    </ExpandableElement>
                    <ExpandableElement
                        title={
                            <TitleWithErrors
                                title={'Questionnaire FHIR Resource'}
                                titleWithErrorManager={titleWithErrorManager}
                            />
                        }
                        cssClass={s.questFHIRResourceBox}
                    >
                        <ResourceCodeEditor<Questionnaire>
                            resourceRD={questionnaireFHIRRD}
                            onSave={saveQuestionnaireFHIR}
                            launchContext={launchContext}
                            questionnaireResponseRD={questionnaireResponseRD}
                            fhirMode={fhirMode}
                            reload={reload}
                        />
                    </ExpandableElement>
                    <ExpandableElement title="Patient Form" cssClass={s.patientFormBox}>
                        <QRFormWrapper
                            questionnaireRD={questionnaireRD}
                            questionnaireResponseRD={questionnaireResponseRD}
                            saveQuestionnaireResponse={saveQuestionnaireResponse}
                            launchContextParameters={launchContext.parameter}
                        />
                    </ExpandableElement>
                </ExpandableRow>
                <ExpandableRow cssClass={s.lowerRowContainer}>
                    <ExpandableElement
                        title="QuestionnaireResponse FHIR resource"
                        cssClass={s.questionnaireResponseFHIRResourceBox}
                    >
                        <ResourceCodeDisplay resourceResponse={questionnaireResponseRD} />
                    </ExpandableElement>
                    <ExpandableElement
                        title={
                            <TitleWithErrors
                                title={'Patient JUTE Mapping'}
                                titleWithErrorManager={titleWithErrorManager}
                            />
                        }
                        cssClass={s.patientMapperBox}
                    >
                        <div>
                            <MappingSelect
                                mappingList={mappingList}
                                activeMappingId={activeMappingId}
                                setActiveMappingId={setActiveMappingId}
                                title="Patient JUTE Mapping"
                                mappingErrorManager={mappingErrorManager}
                            />
                            <ResourceCodeEditor<Mapping>
                                resourceRD={mappingRD}
                                onSave={saveMapping}
                                launchContext={launchContext}
                                questionnaireResponseRD={questionnaireResponseRD}
                                fhirMode={fhirMode}
                                reload={reload}
                            />
                        </div>
                    </ExpandableElement>
                    <ExpandableElement
                        title="Patient batch request"
                        cssClass={s.patientBatchRequestBox}
                    >
                        <div>
                            <ResourceCodeDisplay resourceResponse={batchRequestRD} />
                            <Button onClick={applyMappings}>Apply</Button>
                        </div>
                    </ExpandableElement>
                </ExpandableRow>
            </div>
            <Menu
                launchContext={launchContext}
                dispatch={dispatch}
                questionnaireId={questionnaireId}
                fhirMode={fhirMode}
                setFhirMode={setFhirMode}
                questionnaireRD={questionnaireRD}
            />
            <Logo />
        </>
    );
}
