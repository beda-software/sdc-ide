import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';
import { isSuccess } from 'aidbox-react/src/libs/remoteData';
import { Link } from 'react-router-dom';

import { useMenu } from 'src/components/Menu/hooks';

import s from './Menu.module.scss';
import { Arrow } from 'src/components/Icon/Arrow';
import { ResourceFormat } from 'src/containers/Main/hooks';

interface MenuProps {
    resourceFormat: ResourceFormat;
    setResourceFormat: (resourceFormat: ResourceFormat) => void;
}

export function Menu({ resourceFormat, setResourceFormat }: MenuProps) {
    const { toggleMenu, getMenuStyle, questionnaireIdList, direction } = useMenu();
    const createBtnClickHandler = (resourceFormat: ResourceFormat) => () => setResourceFormat(resourceFormat);

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
                    <div className={s.btnGroup}>
                        <button
                            className={classnames(s.btn, {
                                [s.btnPrimary]: resourceFormat === ResourceFormat.fhir,
                            })}
                            onClick={createBtnClickHandler(ResourceFormat.fhir)}
                        >
                            FHIR
                        </button>
                        <button
                            className={classnames(s.btn, {
                                [s.btnPrimary]: resourceFormat === ResourceFormat.aidbox,
                            })}
                            onClick={createBtnClickHandler(ResourceFormat.aidbox)}
                        >
                            Aidbox
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
