import React from 'react';
import { View } from 'react-native';

import { App } from 'src/containers/App';
import { NavigationProps } from 'src/navigation';

import s from './styles';

interface Props {}

export function SignInScreen(props: NavigationProps & Props) {
    // TODO: this is just a sample component that describes how to properly use props
    // TODO: remove this console.log
    console.log(props);

    return (
        <View style={s.container}>
            <App />
        </View>
    );
}
