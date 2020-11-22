import React from 'react';
import { useParams } from 'react-router-dom';
import { useMain } from 'src/containers/Main/hooks';
import s from 'src/containers/DemoPage/DemoPage.module.scss';
import { Menu } from 'src/components/Menu';
import { Logo } from 'src/components/Logo';
import { ExpandableRow } from 'src/components/ExpandableRow';
import { ExpandableElement } from 'src/components/ExpandableElement';
import { ResourceDisplayBox } from 'src/containers/DemoPage/ResourceDisplayBox';
import { success } from 'aidbox-react/lib/libs/remoteData';
import { QuestionnaireEditor } from 'src/components/QuestionnaireEditor';
import { MappingSelect } from 'src/components/MappingSelect';
import { MappingEditor } from 'src/components/MappingEditor';
import { MappingsApplyButton } from 'src/components/MappingsApplyButton';
import { QRFormWrapper } from 'src/components/QRFormWrapper';

export function Main() {
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const {
        patientRD,
        questionnaireRD,
        questionnaireFHIRRD,
        saveQuestionnaireFHIR,
        questionnaireResponse,
        saveQuestionnaireResponse,
        mappingList,
        activeMappingId,
        setActiveMappingId,
        mappingRD,
        saveMapping,
        batchRequestRD,
        applyMappings,
    } = useMain(questionnaireId);
    return (
        <>
            <div className={s.mainContainer}>
                <ExpandableRow cssClass={s.upperRowContainer}>
                    <ExpandableElement title="Patient FHIR resource" cssClass={s.patientFHIRResourceBox}>
                        <ResourceDisplayBox resourceResponse={patientRD} />
                    </ExpandableElement>
                    <ExpandableElement title="Questionnaire FHIR Resource" cssClass={s.questFHIRResourceBox}>
                        <QuestionnaireEditor
                            questionnaireFHIRRD={questionnaireFHIRRD}
                            saveQuestionnaireFHIR={saveQuestionnaireFHIR}
                        />
                    </ExpandableElement>
                    <ExpandableElement title="Patient Form" cssClass={s.patientFormBox}>
                        <QRFormWrapper
                            questionnaireRD={questionnaireRD}
                            questionnaireResponse={questionnaireResponse}
                            saveQuestionnaireResponse={saveQuestionnaireResponse}
                        />
                    </ExpandableElement>
                </ExpandableRow>
                <ExpandableRow cssClass={s.lowerRowContainer}>
                    <ExpandableElement
                        title="QuestionnaireResponse FHIR resource"
                        cssClass={s.questionnaireResponseFHIRResourceBox}
                    >
                        <ResourceDisplayBox resourceResponse={success(questionnaireResponse)} />
                    </ExpandableElement>
                    <ExpandableElement title="Patient JUTE Mapping" cssClass={s.patientMapperBox}>
                        <div>
                            <MappingSelect
                                mappingList={mappingList}
                                activeMappingId={activeMappingId}
                                setActiveMappingId={setActiveMappingId}
                            />
                            <MappingEditor mappingRD={mappingRD} saveMapping={saveMapping} />
                        </div>
                    </ExpandableElement>
                    <ExpandableElement title="Patient batch request" cssClass={s.patientBatchRequestBox}>
                        <div>
                            <ResourceDisplayBox resourceResponse={batchRequestRD} />
                            <MappingsApplyButton applyMappings={applyMappings} />
                        </div>
                    </ExpandableElement>
                </ExpandableRow>
            </div>
            <Menu />
            <Logo />
        </>
    );
}
