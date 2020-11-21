import React from 'react';
import { useParams } from 'react-router-dom';
import { useMain } from 'src/containers/Main/hooks';
import s from 'src/containers/DemoPage/DemoPage.module.scss';
import { Menu } from 'src/components/Menu';
import { Logo } from 'src/components/Logo';
import { ExpandableRow } from 'src/components/ExpandableRow';
import { ExpandableElement } from 'src/components/ExpandableElement';

export function Main() {
    const { questionnaireId } = useParams<{ questionnaireId: string }>();
    const mainData = useMain(questionnaireId);
    return (
        <>
            <div className={s.mainContainer}>
                <ExpandableRow cssClass={s.upperRowContainer}>
                    <ExpandableElement title="Patient FHIR resource" cssClass={s.patientFHIRResourceBox}>
                        <p>chi</p>
                    </ExpandableElement>
                    <ExpandableElement title="Questionnaire FHIR Resource" cssClass={s.questFHIRResourceBox}>
                        <p>chi</p>
                    </ExpandableElement>
                    <ExpandableElement title="Patient Form" cssClass={s.patientFormBox}>
                        <p>chi</p>
                    </ExpandableElement>
                </ExpandableRow>
                <ExpandableRow cssClass={s.lowerRowContainer}>
                    <ExpandableElement
                        title="QuestionnaireResponse FHIR resource"
                        cssClass={s.questionnaireResponseFHIRResourceBox}
                    >
                        <p>chi</p>
                    </ExpandableElement>
                    <ExpandableElement title="Patient JUTE Mapping" cssClass={s.patientMapperBox}>
                        <p>chi</p>
                    </ExpandableElement>
                    <ExpandableElement title="Patient batch request" cssClass={s.patientBatchRequestBox}>
                        <p>chi</p>
                    </ExpandableElement>
                </ExpandableRow>
            </div>
            <Menu />
            <Logo />
            {/*<pre>{JSON.stringify(mainData, undefined, 2)}</pre>*/}
        </>
    );
}
