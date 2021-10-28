import React, { useRef, useState } from 'react';
import { showError } from 'src/containers/Main/hooks';
import { ErrorDebugState } from 'src/containers/Main/hooks/errorDebugHook';
import { Mapping, Reference } from 'shared/src/contrib/aidbox';

import s from './ExpandableElement.module.scss';

interface ExpandableElementProps {
    cssClass: string;
    title: string | React.ReactElement;
    children: React.ReactElement;
    errorState?: ErrorDebugState;
    mappingList?: Reference<Mapping>[];
}

export function ExpandableElement(props: ExpandableElementProps) {
    const { title, cssClass, children, errorState, mappingList } = props;
    const [expanded, setExpanded] = useState(false);
    const headerRef = useRef(null);

    return (
        <div className={cssClass} style={expanded ? { flex: 4 } : {}}>
            <div>
                <h2
                    className={s.title}
                    ref={headerRef}
                    onClick={(e) => {
                        if (e.target === headerRef.current) {
                            setExpanded((f) => !f);
                        }
                    }}
                >
                    {title}
                    {title === 'Questionnaire FHIR Resource' && errorState?.showQuestionnaireErrors && (
                        <span className={s.error} onClick={() => showError(errorState, title)}>
                            <span className={s.count}>{errorState.questionnaireErrorCount}</span>
                            ERR!
                        </span>
                    )}
                    {title === 'Patient JUTE Mapping' && errorState?.showMappingErrors && mappingList?.length === 1 && (
                        <span className={s.error} onClick={() => showError(errorState, title)}>
                            <span className={s.count}>{errorState.mappingErrorCount}</span>
                            ERR!
                        </span>
                    )}
                </h2>
            </div>
            {children}
        </div>
    );
}
