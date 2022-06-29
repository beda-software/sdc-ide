import _ from 'lodash';
import { MappingSelectError } from 'web/src/components/MappingSelectError';
import { MappingErrorManager, Title } from 'web/src/containers/Main/types';

import { Mapping, Reference } from 'shared/src/contrib/aidbox';

import s from './MappingSelect.module.scss';

interface MappingSelectProps {
    mappingList: Reference<Mapping>[];
    activeMappingId: string | undefined;
    setActiveMappingId: (mappingId: string | undefined) => void;
    title: Title;
    mappingErrorManager: MappingErrorManager;
}

export function MappingSelect(props: MappingSelectProps) {
    const { mappingList, activeMappingId, mappingErrorManager } = props;

    if (mappingList.length === 1) {
        return <div />;
    }

    return (
        <div className={s.wrapper}>
            {_.map(mappingList, ({ id }, index) => (
                <button
                    type={'button'}
                    key={id + String(index)}
                    onClick={() => mappingErrorManager.selectMapping(id)}
                    className={id === activeMappingId ? s.checked : s.item}
                >
                    <MappingSelectError mappingErrorManager={mappingErrorManager} id={id} />
                </button>
            ))}
        </div>
    );
}
