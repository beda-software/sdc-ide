import React from 'react';

import { ResourceSelect } from 'src/components/ResourceSelect';
import { useMenu } from 'src/components/Menu/hooks';

import s from './Menu.module.scss';
import { Arrow } from 'src/components/Icon/Arrow';
import { RemoteData } from 'aidbox-react/src/libs/remoteData';
import { Questionnaire, QuestionnaireLaunchContext, Parameters } from 'shared/src/contrib/aidbox';
import { RenderRemoteData } from 'aidbox-react/src/components/RenderRemoteData';

interface MenuProps {
    launchContext: Parameters;
    dispatch: any;
    questionnaireId: string;
    questionnaireRD: RemoteData<Questionnaire>;
    fhirMode: boolean;
    setFhirMode: (flag: boolean) => void;
}

export function Menu({ questionnaireId, fhirMode, setFhirMode, questionnaireRD }: MenuProps) {
    const { toggleMenu, getMenuStyle, questionnairesRD, direction, configForm } = useMenu();
    return (
        <>
            <div className={s.control} onClick={toggleMenu}>
                <span className={s.symbol}>
                    <Arrow direction={direction} fill="white" />
                </span>
            </div>
            <div className={s.box} style={getMenuStyle}>
                <div className={s.menuItem}>Questionnaire</div>
                <div className={s.menuItem}>
                    <ResourceSelect
                        value={questionnaireId}
                        bundleResponse={questionnairesRD}
                        onChange={(id) => {
                            window.location.hash = id;
                        }}
                        display={({ id }) => id!}
                    />
                </div>
                <RenderRemoteData remoteData={questionnaireRD}>
                    {(questionnaire) => <EditLaunchContext launchContext={questionnaire.launchContext ?? []} />}
                </RenderRemoteData>
                <div className={s.menuItem}>
                    <label htmlFor="fhir-mode">FhirMode</label>
                </div>
                <div className={s.menuItem}>
                    <input
                        name="fhir-mode"
                        type="checkbox"
                        checked={fhirMode}
                        onChange={() => setFhirMode(!fhirMode)}
                    />
                </div>
                <div className={s.menuItem} />
                <div className={s.menuItem} />
                <div className={s.menuItem}>
                    <b>Config</b>
                </div>
                <div className={s.menuItem} />
                <div className={s.menuItem}>
                    <label>Base URL</label>
                </div>
                <div className={s.menuItem}>
                    <input value={configForm.baseUrl} onChange={(e) => configForm.setBaseUrl(e.target.value)} />
                </div>
                <div className={s.menuItem}>
                    <label>Username</label>
                </div>
                <div className={s.menuItem}>
                    <input value={configForm.username} onChange={(e) => configForm.setUsername(e.target.value)} />
                </div>
                <div className={s.menuItem}>
                    <label>Password</label>
                </div>
                <div className={s.menuItem}>
                    <input value={configForm.password} onChange={(e) => configForm.setPassword(e.target.value)} />
                </div>
                <div className={s.menuItem} />
                <div className={s.menuItem}>
                    <button onClick={configForm.applyConfig}>Apply config</button>
                </div>
            </div>
        </>
    );
}

interface LaunchContextProps {
    launchContext: QuestionnaireLaunchContext[];
}

function EditLaunchContext({ launchContext }: LaunchContextProps) {
    return (
        <>
            {launchContext.map((l) => (
                <LaunchContextElement launchContext={l} />
            ))}
        </>
    );
}

interface LaunchContextElementProps {
    launchContext: QuestionnaireLaunchContext;
}

function LaunchContextElement({ launchContext }: LaunchContextElementProps) {
    console.log(launchContext);
    return (
        <>
            <div className={s.menuItem}>
                {launchContext.name}
                <br />
                <span>{launchContext.description}</span>
            </div>
            <div className={s.menuItem}>{launchContext.type}</div>
        </>
    );
}

/* <div className={s.menuItem}>Patient</div>
 * <div className={s.menuItem}>
 * <ResourceSelect
 * cssClass={s.resourceSelect}
 * value={patientId}
 * bundleResponse={patientsRD}
 * onChange={setPatientId}
 * display={getPatientFullName}
 * />
 * </div> */
