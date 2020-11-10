import React from 'react';
import { renderHook } from '@testing-library/react-hooks';
import { Button } from '../Button';

test('Component `Button`', () => {
    const buttonText = 'submit';
    const handlePress = () => {};

    const { result } = renderHook(() => <Button onPress={handlePress}>{buttonText}</Button>);

    expect(result.current.props.onPress).toBe(handlePress);
    expect(result.current.props.children).toBe(buttonText);
});
