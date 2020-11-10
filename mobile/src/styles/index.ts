import { Insets, Dimensions } from 'react-native';

export const hitSlop: Insets = { top: 15, left: 15, bottom: 15, right: 15 };

export const isSmallScreen = Dimensions.get('window').width < 375;
export const isMiddleScreen = Dimensions.get('window').width < 414;
