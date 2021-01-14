import React from 'react';
import { View, Text } from 'react-native';

import { getWelcomeString } from 'shared/src/utils/misc';

import { SafeAreaView } from 'src/components/SafeAreaView';

import s from './styles';

export const App = () => {
    return (
        <SafeAreaView>
            <View style={s.body}>
                <View style={s.sectionContainer}>
                    <Text style={s.sectionTitle}>{getWelcomeString('World')}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};
