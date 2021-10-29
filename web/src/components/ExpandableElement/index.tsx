import React, { useRef, useState } from 'react';
import { ErrorDebugState } from 'src/containers/Main/hooks/errorDebugHook';
import { Mapping, Reference } from 'shared/src/contrib/aidbox';
import { ErrorButton } from 'src/components/ErrorButton';

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
                        <ErrorButton errorState={errorState} title={title} />
                    )}
                    {title === 'Patient JUTE Mapping' && errorState?.showMappingErrors && mappingList?.length === 1 && (
                        <ErrorButton errorState={errorState} title={title} />
                    )}
                </h2>
            </div>
            {children}
        </div>
    );
}
