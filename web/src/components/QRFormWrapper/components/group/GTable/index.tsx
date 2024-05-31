import { GroupItemProps } from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';

import s from './GTable.module.scss';
import { GroupLabel } from '../label';
import { RepeatableGroupRow, RepeatableGroups } from '../RepeatableGroups';

interface Props {
    groupItem: GroupItemProps;
}

export function GTable({ groupItem }: Props) {
    const { questionItem } = groupItem;
    const { item = [] } = questionItem;

    return (
        <>
            <div className={s.header}>
                {item.map((i) => (
                    <div className={s.column} key={`column-${i.linkId}`}>
                        <GroupLabel questionItem={i} />
                    </div>
                ))}
            </div>
            <RepeatableGroups
                groupItem={groupItem}
                renderGroup={(props) => <RepeatableGroupRow {...props} />}
            />
        </>
    );
}
