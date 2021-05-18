import React from 'react';

import { ResourceSelect } from 'src/components/ResourceSelect';
import { useMenu } from 'src/components/Menu/hooks';

import s from './Menu.module.scss';
import { Arrow } from 'src/components/Icon/Arrow';
import { getPatientFullName } from 'src/utils/resource';
import { RemoteData } from 'aidbox-react/src/libs/remoteData';
import { Bundle, Patient } from 'shared/src/contrib/aidbox';

interface MenuProps {
    patientId: string;
    setPatientId: (id: string) => void;
    patientsRD: RemoteData<Bundle<Patient>>;
    questionnaireId: string;
}

export function Menu({ patientId, setPatientId, patientsRD, questionnaireId }: MenuProps) {
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
                            window.location.replace(id);
                        }}
                        display={({ id }) => id!}
                    />
                </div>
                <div className={s.menuItem}>Patient</div>
                <div className={s.menuItem}>
                    <ResourceSelect
                        cssClass={s.resourceSelect}
                        value={patientId}
                        bundleResponse={patientsRD}
                        onChange={setPatientId}
                        display={getPatientFullName}
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
