import React from 'react';
import { Button } from 'src/components/Button';

interface MappingsApplyButtonProps {
    applyMappings: () => void;
}

export function MappingsApplyButton({ applyMappings }: MappingsApplyButtonProps) {
    return <Button onClick={applyMappings}>Apply</Button>;
}
