import React from 'react';
import { Field, Form } from 'react-final-form';

export function PatientFormBox() {
    return (
        <>
            <h2>Patient Form</h2>
            <Form
                onSubmit={() => {
                    console.log('submit');
                }}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                        <div>
                            <label>First Name</label>
                            <Field name="firstName" component="input" />
                        </div>
                        <div>
                            <label>Middle Name</label>
                            <Field name="middleName" component="input" />
                        </div>
                        <div>
                            <label>Last Name</label>
                            <Field name="lastName" component="input" />
                        </div>
                        <div>
                            <label>Date of Birth</label>
                            <Field name="dateOfBirth" component="input" />
                        </div>
                    </form>
                )}
            />
        </>
    );
}
