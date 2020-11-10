import { StyleSheet } from 'react-native';
import { colors } from '../../styles/colors';

export const buttonDisabled = {
    opacity: 0.3,
};

export default StyleSheet.create({
    button: {
        height: 50,
        borderRadius: 14,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2.5,
    },
    primaryButton: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderColor: colors.primary,
    },
    primaryButtonDisabled: buttonDisabled,
    secondaryButtonDisabled: buttonDisabled,

    buttonText: {
        fontSize: 17,
        lineHeight: 22,
    },
    primaryButtonText: {
        color: colors.white,
    },
    secondaryButtonText: {
        color: colors.primary,
    },
});
