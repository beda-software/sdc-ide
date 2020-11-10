import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

import s from './styles';

interface Props extends TouchableOpacityProps {
    onPress: () => void | Promise<any>;
    children?: any;
    title?: string;
    variant?: 'primary' | 'secondary';
}

export function Button(props: Props) {
    const { variant = 'primary', title, style, children, onPress, disabled: originalDisabled, ...other } = props;

    const [isLoading, setIsLoading] = React.useState(false);

    const disabled = originalDisabled || isLoading;
    const disabledStyle = disabled
        ? s[`${variant}ButtonDisabled` as 'primaryButtonDisabled' | 'secondaryButtonDisabled']
        : {};

    return (
        <TouchableOpacity
            style={[s.button, s[`${variant}Button` as 'primaryButton' | 'secondaryButton'], disabledStyle, style]}
            onPress={async () => {
                setIsLoading(true);
                await onPress();
                setIsLoading(false);
            }}
            disabled={disabled}
            {...other}
        >
            {children}
            {title ? (
                <Text
                    style={[s.buttonText, s[`${variant}ButtonText` as 'primaryButtonText' | 'secondaryButtonText']]}
                    numberOfLines={1}
                >
                    {title}
                </Text>
            ) : null}
        </TouchableOpacity>
    );
}
