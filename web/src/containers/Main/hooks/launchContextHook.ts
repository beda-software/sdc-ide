import _ from 'lodash';
import { isSuccess, RemoteData } from 'aidbox-react/lib/libs/remoteData';
import { getFHIRResource } from 'aidbox-react/lib/services/fhir';
import { mapSuccess, resolveMap } from 'aidbox-react/lib/services/service';
import { useReducer } from 'react';
import {
    AidboxResource,
    Parameters as ParametersBase,
    ParametersParameter,
    Questionnaire,
} from 'shared/src/contrib/aidbox';
import { getData, setData } from 'web/src/services/localStorage';

type Parameters = ParametersBase & Required<Pick<ParametersBase, 'parameter'>>;

// SetResource action
type SetResource = 'SetResource';

interface SetResourceAction {
    type: SetResource;
    name: string;
    parameter: ParametersParameter;
}

export function setResource(action: Omit<SetResourceAction, 'type'>): SetResourceAction {
    return {
        ...action,
        type: 'SetResource',
    };
}
// SetResource action

// Init action
type Init = 'Init';

interface InitAction {
    type: Init;
    state: Parameters;
}

export async function init(questionnaire: Questionnaire): Promise<InitAction> {
    let empty: Array<ParametersParameter> = [];
    let resourcesRD: Record<string, Promise<RemoteData<AidboxResource>>> = {};
    let resources: Array<ParametersParameter> = [];
    let primitives: Array<ParametersParameter> = [];

    (questionnaire.launchContext ?? []).forEach(({ name }) => {
        if (name) {
            const saved = getData('launchContextParameters')[name];
            if (typeof saved === 'undefined' || saved === null) {
                empty.push({ name });
                return;
            }
            const isResource = typeof saved.resource !== 'undefined';
            if (isResource) {
                resourcesRD[name] = getFHIRResource({
                    resourceType: saved.resource!.resourceType!,
                    id: saved.resource!.id!,
                });
            } else {
                primitives.push(saved);
            }
        }
    });

    const resolved = mapSuccess(await resolveMap(resourcesRD), (resources) => {
        return _.map(resources, (resource, name) => ({ name, resource } as ParametersParameter));
    });

    if (isSuccess(resolved)) {
        resources = resolved.data;
    }

    const state: Parameters = {
        resourceType: 'Parameters',
        parameter: [
            ...primitives,
            ...resources,
            ...empty,
            {
                name: 'Questionnaire',
                resource: questionnaire,
            },
        ],
    };
    return {
        type: 'Init',
        state,
    };
}
// Init action

export type Action = SetResourceAction | InitAction;

function reducer(state: Parameters, action: Action) {
    if (action.type == 'SetResource') {
        const saved = getData('launchContextParameters');
        setData('launchContextParameters', {
            ...saved,
            [action.name]: action.parameter,
        });
        const data = action.parameter;
        const s = {
            ...state,
            parameter: state.parameter.map((p) =>
                p.name == action.name ? { ...p, ...data, name: p.name } : p,
            ),
        };
        return s;
    } else if (action.type == 'Init') {
        return action.state;
    } else {
        const _action: never = action;
        console.error(`Unknown action ${_action}`);
    }
    return state;
}

export function useLaunchContext() {
    return useReducer(reducer, { resourceType: 'Parameters', parameter: [] });
}
