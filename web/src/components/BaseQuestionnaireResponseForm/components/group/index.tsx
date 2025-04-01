import _ from 'lodash';
import { GroupItemProps, QuestionItems } from 'sdc-qrf';

import s from './Group.module.scss';
import { GroupLabel } from './label';
import { RepeatableGroups } from './RepeatableGroups';

export function Group(props: GroupItemProps) {
    const { parentPath, questionItem, context } = props;
    const { linkId, item, repeats } = questionItem;

    if (item) {
        if (repeats) {
            return <RepeatableGroups groupItem={props} />;
        }

        return (
            <div className={s.group}>
                <GroupLabel questionItem={questionItem} />
                <QuestionItems
                    questionItems={item!}
                    parentPath={[...parentPath, linkId, 'items']}
                    context={context[0]!}
                />
            </div>
        );
    }
    return null;
}

export { Row, Col, GTable } from './flex';
