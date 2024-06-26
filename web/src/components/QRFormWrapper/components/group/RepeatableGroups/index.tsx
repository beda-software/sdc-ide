import { useFieldController } from '@beda.software/fhir-questionnaire';
import { GroupItemProps } from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import _ from 'lodash';
import React from 'react';
import { useWatch } from 'react-hook-form';

import s from './RepeatableGroups.module.scss';
import { QuestionItems } from '../../questionItems';
import { GroupLabel } from '../label';

interface RepeatableGroupsProps {
    groupItem: GroupItemProps;
    renderGroup?: (props: RepeatableGroupProps) => React.ReactNode;
}

export function RepeatableGroups(props: RepeatableGroupsProps) {
    const { groupItem, renderGroup } = props;
    const { parentPath, questionItem } = groupItem;
    const { linkId, required } = questionItem;
    const baseFieldPath = [...parentPath, linkId];
    const fieldName = baseFieldPath.join('.');

    const { onChange } = useFieldController(baseFieldPath, questionItem);
    const value = useWatch({ name: fieldName });
    const items = value.items && value.items.length ? value.items : required ? [{}] : [];

    const append = () => {
        const existingItems = value.items || [];
        const updatedInput = { items: [...existingItems, {}] };
        onChange(updatedInput);
    };

    const remove = (index: number) => {
        const filteredArray = _.filter(value.items, (_val, valIndex: number) => valIndex !== index);
        onChange({
            items: [...filteredArray],
        });
    };

    return (
        <div className={s.group}>
            {_.map(items, (_elem, index: number) => {
                return renderGroup ? (
                    <React.Fragment key={`${fieldName}-${index}`}>
                        {renderGroup({
                            index,
                            groupItem,
                            remove: () => remove(index),
                        })}
                    </React.Fragment>
                ) : (
                    <RepeatableGroupDefault
                        key={index}
                        index={index}
                        groupItem={groupItem}
                        remove={() => remove(index)}
                    />
                );
            })}
            <div>
                <button className={s.addButton} onClick={append}>
                    + Add another answer
                </button>
            </div>
        </div>
    );
}

interface RepeatableGroupProps {
    index: number;
    groupItem: GroupItemProps;
    remove: () => void;
}

function useRepeatableGroup(props: RepeatableGroupProps) {
    const { index, groupItem, remove } = props;
    const { parentPath, questionItem, context } = groupItem;
    const { linkId } = questionItem;

    return {
        onRemove: remove,
        parentPath: [...parentPath, linkId, 'items', index.toString()],
        context: context[0]!,
    };
}

export function RepeatableGroupDefault(props: RepeatableGroupProps) {
    const { index, groupItem } = props;
    const { questionItem } = groupItem;
    const { item } = questionItem;
    const { onRemove, parentPath, context } = useRepeatableGroup(props);

    return (
        <>
            <div className={s.groupHeader}>
                <GroupLabel>{`${questionItem.text} #${index + 1}`}</GroupLabel>
                <button onClick={onRemove} className={s.removeButton} type="button">
                    Remove
                </button>
            </div>
            <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
        </>
    );
}

export function RepeatableGroupRow(props: RepeatableGroupProps) {
    const { groupItem } = props;
    const { questionItem } = groupItem;
    const { item } = questionItem;
    const { onRemove, parentPath, context } = useRepeatableGroup(props);

    return (
        <div className={s.row}>
            <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
            <div className={s.rowControls}>
                <button onClick={onRemove} className={s.removeIconButton} type="button">
                    Remove
                </button>
            </div>
        </div>
    );
}
