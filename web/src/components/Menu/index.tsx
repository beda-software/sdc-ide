import classNames from 'classnames';
import _ from 'lodash';
import { Dispatch, useState } from 'react';
import Select from 'react-select';
import { useMenu } from 'web/src/components/Menu/hooks';
import { RemoteResourceSelect } from 'web/src/components/ResourceSelect';
import { Action, setResource } from 'web/src/containers/Main/hooks/launchContextHook';
import { version } from 'web/src/version';

import { RenderRemoteData } from 'aidbox-react/lib/components/RenderRemoteData';
import { RemoteData } from 'aidbox-react/lib/libs/remoteData';

import {
    Questionnaire,
    QuestionnaireLaunchContext,
    Parameters,
    ParametersParameter,
} from 'shared/src/contrib/aidbox';

import { Arrow } from '../Icon/Arrow';
import s from './Menu.module.scss';

interface MenuProps {
    launchContext: Parameters;
    dispatch: Dispatch<Action>;
    questionnaireId: string;
    questionnaireRD: RemoteData<Questionnaire>;
    fhirMode: boolean;
    setFhirMode: (flag: boolean) => void;
}

export function Menu({
    questionnaireId,
    fhirMode,
    setFhirMode,
    questionnaireRD,
    launchContext,
    dispatch,
}: MenuProps) {
    const { toggleMenu, getMenuStyle, questionnairesRD, direction, history } = useMenu();
    const [isChecked, setIsChecked] = useState(false);
    return (
        <>
            <div className={s.control} onClick={toggleMenu}>
                <span className={s.symbol}>
                    <Arrow direction={direction} fill="white" />
                </span>
            </div>
            <div className={s.box} style={getMenuStyle}>
                <div className={s.menuItem}>
                    <div className={s.header}>Questionnaire</div>
                    <RenderRemoteData remoteData={questionnairesRD}>
                        {(questionnaires) => (
                            <div className={s.reactResourceSelect}>
                                <Select
                                    value={{
                                        value: questionnaireId,
                                        label: questionnaireId,
                                    }}
                                    options={questionnaires.map((questionnaire) => ({
                                        value: questionnaire.id,
                                        label: questionnaire.title ?? questionnaire.id,
                                    }))}
                                    onChange={(option) => {
                                        if (option) {
                                            history.push(option.value);
                                        }
                                    }}
                                />
                            </div>
                        )}
                    </RenderRemoteData>
                </div>
                <div className={s.menuItem}>
                    <RenderRemoteData remoteData={questionnaireRD}>
                        {(questionnaire) => (
                            <EditLaunchContext
                                parameters={launchContext}
                                launchContext={questionnaire.launchContext ?? []}
                                dispatch={dispatch}
                            />
                        )}
                    </RenderRemoteData>
                </div>
                <div className={s.menuItem}>
                    <div className={s.header}>
                        <label htmlFor="fhir-mode">FhirMode</label>
                    </div>
                    <div>
                        <label>
                            <input
                                className={s.fhirModeCheck}
                                name="fhir-mode"
                                type="checkbox"
                                checked={fhirMode}
                                onChange={() => {
                                    setFhirMode(!fhirMode);
                                    setIsChecked(!isChecked);
                                }}
                            />
                            <span
                                className={`checkbox ${isChecked ? 'checkbox--active' : ''}`}
                                aria-hidden="true"
                            />
                        </label>
                    </div>
                </div>
                <div className={classNames(s.menuItem, s.submitButton)}>
                    <div className={s.version}>{version}</div>
                </div>
            </div>
        </>
    );
}

interface LaunchContextProps {
    launchContext: QuestionnaireLaunchContext[];
    parameters: Parameters;
    dispatch: Dispatch<Action>;
}

function EditLaunchContext({ launchContext, parameters, dispatch }: LaunchContextProps) {
    return (
        <>
            {launchContext.map((launchContextItem, index) => {
                return (
                    <LaunchContextElement
                        key={`${launchContextItem.name?.code}-${index}`}
                        launchContext={launchContextItem}
                        value={_.find(parameters.parameter, { name: launchContextItem.name?.code })}
                        onChange={(parameter) =>
                            dispatch(
                                setResource({
                                    name: launchContextItem.name?.code!,
                                    parameter: parameter!,
                                }),
                            )
                        }
                    />
                );
            })}
        </>
    );
}

interface LaunchContextElementProps {
    launchContext: QuestionnaireLaunchContext;
    value: ParametersParameter | null | undefined;
    onChange: (r: ParametersParameter | null | undefined) => void;
}

function LaunchContextElement({ launchContext, value, onChange }: LaunchContextElementProps) {
    return (
        <>
            <div className={s.header}>
                {launchContext.name?.code}
                <br />
                <span>{launchContext.description}</span>
            </div>
            <LaunchContextElementWidget
                launchContext={launchContext}
                value={value}
                onChange={onChange}
            />
        </>
    );
}

function LaunchContextElementWidget({ launchContext, value, onChange }: LaunchContextElementProps) {
    if (launchContext.type === 'string') {
        return (
            <input
                value={(value as any)?.value?.string}
                onChange={(e) =>
                    onChange({ value: { string: e.target.value }, name: launchContext.name?.code! })
                }
            />
        );
    }
    return (
        <RemoteResourceSelect
            resourceType={launchContext.type as any}
            value={value?.resource}
            onChange={(resource) =>
                onChange({ resource: resource!, name: launchContext.name?.code! })
            }
        />
    );
}
