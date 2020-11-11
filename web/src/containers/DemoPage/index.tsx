import React from 'react';
import s from './DemoPage.module.scss';

import { Button } from 'src/components/Button';
import { Logo } from 'src/components/Logo';

export function DemoPage() {
    return (
        <div className={s.mainContainer}>
            <div className={s.upperRowContainer}>
                <div className={s.patientFHIRResourceBox}>
                    <h2>Patient FHIR Resource</h2>
                </div>
                <div className={s.questFHIRResourceBox}>
                    <h2>Questionanire FHIR Resource</h2>
                </div>
                <div className={s.patientFormBox}>
                    <h2>Patient Form</h2>
                    <Button variant="primary">Save</Button>
                </div>
                <div className={s.patientBatchRequestBox}>
                    <h2>Patient batch request</h2>
                </div>
            </div>

            <div className={s.lowerRowContainer}>
                <div className={s.patientMapperBox}>
                    <h2>Patient JUTE Mapping</h2>
                </div>
            </div>
            <Logo />
        </div>
    );
}
