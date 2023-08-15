import { Patient } from 'fhir/r4b';
import _ from 'lodash';

export function getPatientFullName(resource: Patient) {
    const name = _.get(resource, 'name.0.given', []).join(' ');
    const surname = _.get(resource, 'name.0.family', '');

    return `${name} ${surname}`;
}
