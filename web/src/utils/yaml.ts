import yaml from 'js-yaml';
import _ from 'lodash';

export function toYaml<R>(resource: R): string {
    if (_.isEmpty(resource)) {
        return '';
    }

    try {
        return yaml.dump(resource);
    } catch (e) {
        console.log(e);
        return JSON.stringify(resource, undefined, 2);
    }
}
