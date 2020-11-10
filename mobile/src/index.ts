import { Navigation } from 'react-native-navigation';

import { openSignInScreen } from './containers/Auth/SignIn/screen';

Navigation.events().registerAppLaunchedListener(async () => {
    openSignInScreen();
});
