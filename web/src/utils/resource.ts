import _ from 'lodash';

import { Patient } from 'shared/src/contrib/aidbox';

export function getPatientFullName(resource: Patient) {
    const name = _.get(resource, 'name.0.given', []).join(' ');
    const surname = _.get(resource, 'name.0.family', '');

    return `${name} ${surname}`;
}
