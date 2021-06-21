import { useReducer } from 'react';
import { Parameters as ParametersBase, QuestionnaireLaunchContext, Resource } from 'shared/src/contrib/aidbox';

type Parameters = ParametersBase & Required<Pick<ParametersBase, 'parameter'>>;

// SetResource action
type SetResource = 'SetResource';

interface SetResourceAction {
    type: SetResource;
    name: string;
    resource: Resource;
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
    launchContext: QuestionnaireLaunchContext[];
}

export function init(launchContext: QuestionnaireLaunchContext[]): InitAction {
    return {
        type: 'Init',
        launchContext,
    };
}
// Init action

type Action = SetResourceAction | InitAction;

function reducer(state: Parameters, action: Action) {
    if (action.type == 'SetResource') {
        return {
            ...state,
            parameter: state.parameter.map((p) => (p.name == action.name ? { ...p, resource: action.resource } : p)),
        };
    } else if (action.type == 'Init') {
        return {
            ...state,
            parameter: action.launchContext.map(({ name }) => {
                if (name) {
                    return { name };
                } else {
                    throw new Error('Name is missing in launchContext');
                }
            }),
        };
    } else {
        const _action: never = action;
        console.error(`Unknown action ${_action}`);
    }
    return state;
}

export function useLaunchContext(): [Parameters, any] {
    return useReducer(reducer, { resourceType: 'Parameters', parameter: [] });
}
