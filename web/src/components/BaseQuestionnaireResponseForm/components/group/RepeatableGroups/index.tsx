import _ from 'lodash';
import React from 'react';
// eslint-disable-next-line import/named
import { Field, FieldInputProps } from 'react-final-form';
import { GroupItemProps, QuestionItems } from 'sdc-qrf/src';

import s from './RepeatableGroups.module.scss';
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

    return (
        <Field name={fieldName}>
            {({ input }) => {
                const items =
                    input.value.items && input.value.items.length
                        ? input.value.items
                        : required
                        ? [{}]
                        : [];

                return (
                    <div className={s.group}>
                        {_.map(items, (_elem, index: number) => {
                            if (!input.value.items[index]) {
                                return null;
                            }

                            return renderGroup ? (
                                <React.Fragment key={`${fieldName}-${index}`}>
                                    {renderGroup({
                                        index,
                                        input,
                                        groupItem,
                                    })}
                                </React.Fragment>
                            ) : (
                                <RepeatableGroupDefault
                                    key={index}
                                    index={index}
                                    groupItem={groupItem}
                                    input={input}
                                />
                            );
                        })}
                        <div>
                            <button
                                className={s.addButton}
                                onClick={() => {
                                    const existingItems = input.value.items || [];
                                    const updatedInput = { items: [...existingItems, {}] };
                                    input.onChange(updatedInput);
                                }}
                            >
                                {`+ Add another answer`}
                            </button>
                        </div>
                    </div>
                );
            }}
        </Field>
    );
}

interface RepeatableGroupProps {
    index: number;
    input: FieldInputProps<any, HTMLElement>;
    groupItem: GroupItemProps;
}

function useRepeatableGroup(props: RepeatableGroupProps) {
    const { index, input, groupItem } = props;
    const { parentPath, questionItem, context } = groupItem;
    const { linkId } = questionItem;

    const onRemove = () => {
        const filteredArray = _.filter(
            input.value.items,
            (_val, valIndex: number) => valIndex !== index,
        );
        input.onChange({
            items: [...filteredArray],
        });
    };

    return {
        onRemove,
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
                    +
                </button>
            </div>
        </div>
    );
}
