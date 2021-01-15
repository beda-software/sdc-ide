import React from 'react';
import _ from 'lodash';
import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { Link } from 'react-router-dom';

import { useMenu } from 'src/components/Menu/hooks';

import s from './Menu.module.scss';
import { Arrow } from 'src/components/Icon/Arrow';

export function Menu() {
    const { toggleMenu, getMenuStyle, questionnaireIdList, direction } = useMenu();
    return (
        <>
            <div className={s.control} onClick={toggleMenu}>
                <span className={s.symbol}>
                    <Arrow direction={direction} fill="white" />
                </span>
            </div>
            {isSuccess(questionnaireIdList) && (
                <div className={s.box} style={getMenuStyle}>
                    {_.map(questionnaireIdList.data, (id) => (
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
