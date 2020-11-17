import React, { useState } from 'react';
import _ from 'lodash';
import s from './Menu.module.scss';
import { useService } from 'aidbox-react/lib/hooks/service';
import { getFHIRResources } from 'aidbox-react/lib/services/fhir';
import { isSuccess } from 'aidbox-react/lib/libs/remoteData';
import { mapSuccess } from 'aidbox-react/lib/services/service';
import { Link } from 'react-router-dom';
import { arrowDown, arrowUp } from 'src/components/Icon';

function useMenu() {
    const [showMenu, setShowMenu] = useState<boolean>(false);

    const toggleMenu = () => {
        setShowMenu(!showMenu);
    };

    const getMenuStyle = showMenu ? { display: 'block' } : { display: 'none' };

    const [patientsIdList] = useService<string[]>(async () => {
        const response = await getFHIRResources('Questionnaire', {});
        return mapSuccess(response, (data) => {
            return _.map(data.entry, (item) => item.resource.id);
        });
    });

    const symbol = showMenu ? arrowUp('white') : arrowDown('white');

    return { toggleMenu, getMenuStyle, patientsIdList, symbol };
}

export function Menu() {
    const { toggleMenu, getMenuStyle, patientsIdList, symbol } = useMenu();
    return (
        <>
            <div
                className={s.control}
                onClick={() => {
                    toggleMenu();
                }}
            >
                <span className={s.symbol}>{symbol}</span>
            </div>
            {isSuccess(patientsIdList) && (
                <div className={s.box} style={getMenuStyle}>
                    {_.map(patientsIdList.data, (id) => (
                        <Link to={id} key={id}>
                            <p key={id} className={s.link} onClick={toggleMenu}>
                                {id}
                            </p>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
