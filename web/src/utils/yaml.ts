import yaml from 'js-yaml';
import _ from 'lodash';

export function toYaml<R>(resource: R): string {
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

export function fromYaml<R>(yamlString: string): R | undefined {
    try {
        const obj = yaml.load(yamlString);

        return obj as R;
    } catch (e) {
        console.log(e);
        return undefined;
    }
}
