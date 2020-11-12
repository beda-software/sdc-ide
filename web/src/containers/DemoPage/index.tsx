import React from 'react';
import s from './DemoPage.module.scss';

import { Logo } from 'src/components/Logo';
import { MappingBox } from 'src/containers/DemoPage/MappingBox';
import { PatientResourceBox } from 'src/containers/DemoPage/PatientResourceBox';
import { PatientFormBox } from 'src/containers/DemoPage/PatientFormBox';
import { PatientBatchRequestBox } from 'src/containers/DemoPage/PatientBatchRequestBox';
import { QuestionnaireResourceBox } from 'src/containers/DemoPage/QuestionnaireResourceBox';

export function DemoPage() {
    return (
        <div className={s.mainContainer}>
            <div className={s.upperRowContainer}>
                <div className={s.patientFHIRResourceBox}>
                    <PatientResourceBox />
                </div>
                <div className={s.questFHIRResourceBox}>
                    <QuestionnaireResourceBox />
                </div>
                <div className={s.patientFormBox}>
                    <PatientFormBox />
                </div>
                <div className={s.patientBatchRequestBox}>
                    <PatientBatchRequestBox />
                </div>
            </div>

            <div className={s.lowerRowContainer}>
                <div className={s.patientMapperBox}>
                    <MappingBox />
                </div>
            </div>
            <Logo />
        </div>
    );
}
