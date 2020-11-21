import { Patient } from 'shared/lib/contrib/aidbox';

export const patientExpected: Patient = {
    name: [
        {
            given: ['Jane', 'Jr.'],
            family: 'Smith',
        },
    ],
    gender: 'female',
    telecom: [
        {
            use: 'Mobile',
            value: '+123456789d',
            system: 'phone',
        },
        {
            use: 'Mobile',
            value: '+198765432',
            system: 'phone',
        },
    ],
    birthDate: '1980-01-01',
    id: 'patient',
    resourceType: 'Patient',
};
