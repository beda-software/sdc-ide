import React from 'react';
import { Button } from 'src/components/Button';

export function PatientBatchRequestBox() {
    return (
        <>
            <h2>Patient batch request</h2>
            <Button
                onClick={() => {
                    console.log('apply');
                }}
            >
                Apply
            </Button>
        </>
    );
}
