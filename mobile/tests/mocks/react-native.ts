export const alertMock = jest.fn();
export const promptMock = jest.fn();

export const enterPromptText = jest.fn();

type PromptCallback = (text: string) => Promise<void>;

export const mockAleart = () => {
    return {
        alert: alertMock,
        prompt: (title: string, message: string, callback: PromptCallback) => {
            promptMock(title, message, callback);
            enterPromptText.mockImplementation(callback);
        },
    };
};

export const mockKeyboard = () => {
    return {
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dismiss: jest.fn(),
        keyboardWillShow: jest.fn(),
        keyboardWillHide: jest.fn(),
    };
};

export const mockDimensions = () => {
    return {
        get: jest.fn().mockReturnValue({ width: 375 }),
    };
};

const NativeModules = {
    SettingsManager: {
        settings: {
            AppleLocale: 'he_IL',
        },
    },
    I18nManager: {
        localeIdentifier: 'he_IL',
    },
    ImagePickerManager: jest.fn(),
};

export const mockNativeModules = () => {
    return NativeModules;
};

export const mockTurboModuleRegistry = () => {
    return {
        get: jest.fn(),
        getEnforcing: jest.fn(),
    };
};

const obj = { ios: 'ios', android: 'android' };

export const mockPlatform = () => {
    // TODO: Update mock to check 'ios' also
    return {
        OS: 'android',
        select: (OS: string) => obj[OS as 'ios' | 'android'],
    };
};

export const mockStyleSheet = () => {
    return jest.requireActual('react-native/Libraries/StyleSheet/StyleSheet');
};

export const mockDeviceInfo = () => {
    return {
        getConstants: () => {
            return {};
        },
    };
};

jest.mock('react-native/Libraries/Utilities/Platform', () => {
    return {
        select: jest.fn(),
        OS: 'ios',
    };
});

jest.mock('react-native/Libraries/Linking/Linking', () => {
    return {
        openURL: jest.fn(),
    };
});

jest.mock('react-native/Libraries/Alert/Alert', () => mockAleart());

jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => mockKeyboard());

jest.mock('react-native/Libraries/Utilities/Dimensions', () => mockDimensions());

jest.mock('react-native/Libraries/BatchedBridge/NativeModules', () => mockNativeModules());

jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => mockTurboModuleRegistry());

jest.mock('react-native/Libraries/StyleSheet/StyleSheet', () => mockStyleSheet());

jest.mock('react-native/Libraries/Utilities/Platform', () => mockPlatform());

jest.mock('react-native/Libraries/Utilities/DeviceInfo', () => mockDeviceInfo());
