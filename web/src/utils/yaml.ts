import _ from 'lodash';

const yaml = require('js-yaml');

export function objectToDisplay(resource: object) {
    const preparedResource = _.omit(resource, 'meta');

    if (_.isEmpty(resource)) {
        return '';
    }

    try {
        const yamlString: string = yaml.safeDump(preparedResource);
        return yamlString;
    } catch (e) {
        console.log(e);
        return JSON.stringify(preparedResource, undefined, 2);
    }
}

export function displayToObject(yamlString: string) {
    try {
        const obj = yaml.safeLoad(yamlString);
        return obj;
    } catch (e) {
        console.log(e);
        return {};
    }
}
