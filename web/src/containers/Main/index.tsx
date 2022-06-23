import React from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { useMain } from 'src/containers/Main/hooks';
import { Menu } from 'src/components/Menu';
import { Logo } from 'src/components/Logo';
import { ExpandableRow } from 'src/components/ExpandableRow';
import { ExpandableElement } from 'src/components/ExpandableElement';
import { ResourceCodeDisplay } from 'src/components/ResourceCodeDisplay';
import { LaunchContextDisplay } from 'src/components/LaunchContextDisplay';
import { MappingSelect } from 'src/components/MappingSelect';
import { QRFormWrapper } from 'src/components/QRFormWrapper';
import { Button } from 'src/components/Button';
import { ResourceCodeEditor } from 'src/components/ResourceCodeEditor';
import { ModalCreateMapper } from 'src/components/ModalCreateMapper';
import { Mapping, Questionnaire } from 'shared/src/contrib/aidbox';
import { TitleWithErrors } from 'src/components/TitleWithErrors';
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
