import {
    OptionsTopBar,
    OptionsTopBarBackButton,
    Options,
    OptionsModalPresentationStyle,
    OptionsLayout,
} from 'react-native-navigation';

import { colors } from 'src/styles/colors';

export interface NavigationProps {
    componentId: string;
}

export const topBarWithoutBorder: Partial<OptionsTopBar> = {
    noBorder: true,
    borderHeight: 0,
    elevation: 0,
};

export const backButtonProps: OptionsTopBarBackButton = {
    color: colors.blue,
    title: '',
};

export function getDarkTopBarProps(text?: string): OptionsTopBar {
    return {
        title: {
            text,
            fontSize: 16,
            fontWeight: 'medium',
        },
        ...topBarWithoutBorder,
        backButton: backButtonProps,
    };
}

const layoutBackgroundTransparent: OptionsLayout = {
    backgroundColor: 'transparent',
    componentBackgroundColor: 'transparent',
};

export const modalOptions: Options = {
    layout: layoutBackgroundTransparent,
    modalPresentationStyle: OptionsModalPresentationStyle.overFullScreen,
};

export const overlayOptions: Options = {
    layout: layoutBackgroundTransparent,
};
