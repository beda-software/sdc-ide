import React, { useEffect, useState } from 'react';
import _ from 'lodash';
import { ResourceCodeDisplay } from 'src/components/ResourceCodeDisplay';
import { Parameters } from 'shared/src/contrib/aidbox';
import { success } from 'aidbox-react/src/libs/remoteData';
import { OpenContextMenu } from 'src/containers/Main/types';

import s from './LaunchContextDisplay.module.scss';

interface LaunchContextDisplayProps {
    parameters: Parameters;
    openContextMenu: OpenContextMenu;
}

export function LaunchContextDisplay({ parameters, openContextMenu }: LaunchContextDisplayProps) {
    const params = parameters.parameter?.filter((p) => p.name !== 'Questionnaire') || [];
    const defaultName = params[0]?.name;
    const [activeTabName, setActiveTabName] = useState(defaultName);

    useEffect(() => {
        if (typeof activeTabName === 'undefined' || !_.find(params, { name: activeTabName })) {
            setActiveTabName(defaultName);
        }
    }, [defaultName, activeTabName, params]);
    const active = _.find(params, { name: activeTabName })?.resource;
    return (
        <>
            {params.length > 0 && (
                <Tab params={params} activeTabName={activeTabName} setActiveTabName={setActiveTabName} />
            )}
            <ResourceCodeDisplay resourceResponse={success(active!)} openContextMenu={openContextMenu} />
        </>
    );
}

function Tab({ params, setActiveTabName, activeTabName }: any) {
    return (
        <div className={s.wrapper}>
            {params.map(({ name }: any) => (
                <button
                    type={'button'}
                    key={name}
                    onClick={() => {
                        setActiveTabName(name);
                    }}
                    className={name === activeTabName ? s.checked : s.item}
                >
                    {name}
                </button>
            ))}
        </div>
    );
}
