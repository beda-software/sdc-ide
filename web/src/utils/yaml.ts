import yaml from 'js-yaml';
import _ from 'lodash';

export function objectToDisplay(resource: object) {
    const preparedResource = resource;

    if (_.isEmpty(resource)) {
        return '';
    }

    try {
        const yamlString: string = yaml.dump(preparedResource);
        return yamlString;
    } catch (e) {
        console.log(e);
        return JSON.stringify(preparedResource, undefined, 2);
    }
}

export function displayToObject(yamlString: string) {
    try {
        const obj = yaml.load(yamlString);
        return obj;
    } catch (e) {
        console.log(e);
        return {};
    }
}
