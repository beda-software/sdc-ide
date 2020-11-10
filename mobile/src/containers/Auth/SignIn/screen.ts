import { LayoutStackChildren, Navigation } from 'react-native-navigation';

// import { name as appName } from 'app.json';
import { SignInScreen } from '.';

const componentName = `AppName.SignIn`;

Navigation.registerComponent(componentName, () => SignInScreen);

export function getSignInScreenConfig(): LayoutStackChildren {
    return {
        component: {
            name: componentName,
            options: {
                topBar: {
                    visible: false,
                },
            },
        },
    };
}

export function openSignInScreen() {
    Navigation.setRoot({
        root: {
            stack: {
                children: [getSignInScreenConfig()],
            },
        },
    });
}
