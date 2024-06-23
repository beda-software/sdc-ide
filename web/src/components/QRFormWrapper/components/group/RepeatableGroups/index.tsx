import { GroupItemProps } from '@beda.software/fhir-questionnaire/vendor/sdc-qrf';
import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';

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

    const { control } = useForm({
        defaultValues: {
            [fieldName]: {
                items: required ? [{}] : [],
            },
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: `${fieldName}.items`,
    });

    const handleAddAnswer = () => {
        append({});
    };

    return (
        <div className={s.group}>
            {fields.map((item, index) => (
                <React.Fragment key={`${fieldName}-${index}`}>
                    {renderGroup ? (
                        renderGroup({
                            index,
                            input: item,
                            groupItem,
                        })
                    ) : (
                        <RepeatableGroupDefault
                            index={index}
                            groupItem={groupItem}
                            input={item}
                            onRemove={() => remove(index)}
                        />
                    )}
                </React.Fragment>
            ))}
            <div>
                <button className={s.addButton} onClick={handleAddAnswer} type="button">
                    + Add another answer
                </button>
            </div>
        </div>
    );
}

interface RepeatableGroupProps {
    index: number;
    input: any;
    groupItem: GroupItemProps;
    onRemove?: () => void;
}

function useRepeatableGroup(props: RepeatableGroupProps) {
    const { index, input, groupItem } = props;
    const { parentPath, questionItem, context } = groupItem;
    const { linkId } = questionItem;

    const onRemove = () => {
        input.remove(index);
    };

    return {
        onRemove,
        parentPath: [...parentPath, linkId, 'items', index.toString()],
        context: context[0]!,
    };
}

export function RepeatableGroupDefault(props: RepeatableGroupProps) {
    const { index, groupItem, onRemove } = props;
    const { questionItem } = groupItem;
    const { item } = questionItem;
    const { parentPath, context } = useRepeatableGroup(props);

    return (
        <>
            <div className={s.groupHeader}>
                <GroupLabel>{`${questionItem.text} #${index + 1}`}</GroupLabel>
                {onRemove && (
                    <button onClick={onRemove} className={s.removeButton} type="button">
                        Remove
                    </button>
                )}
            </div>
            <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
        </>
    );
}

export function RepeatableGroupRow(props: RepeatableGroupProps) {
    const { groupItem, onRemove } = props;
    const { questionItem } = groupItem;
    const { item } = questionItem;
    const { parentPath, context } = useRepeatableGroup(props);

    return (
        <div className={s.row}>
            <QuestionItems questionItems={item!} parentPath={parentPath} context={context} />
            <div className={s.rowControls}>
                {onRemove && (
                    <button onClick={onRemove} className={s.removeIconButton} type="button">
                        +
                    </button>
                )}
            </div>
        </div>
    );
}
