import React from 'react';
import s from './DemoPage.module.scss';
import { Button } from 'src/components/Button';

export function DemoPage() {
    return (
        <div className={s.container}>
            <header className={s.header} />
            <div className={s.patientFHIRResourceBox}>patientFHIRResourceBox</div>
            <div className={s.questFHIRResourceBox}>questFHIRResourceBox</div>
            <div className={s.patientBatchRequestBox}>patientBatchRequestBox</div>
            <div className={s.patientFormBox}>
                patientFormBox
                <Button variant="primary">Save</Button>
            </div>
            <div className={s.patientMapperBox}>patientMapperBox</div>
        </div>
    );
}
