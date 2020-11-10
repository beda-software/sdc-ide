import React from 'react';
import { SafeAreaView as RNSafeAreaView, StyleSheet, View, ViewProps, Platform } from 'react-native';

const s = StyleSheet.create({
    safeAreaView: {
        flex: 1,
    },
});

interface SafeAreaViewProps extends ViewProps {
    children?: React.ReactNode;
    drawBehind?: boolean;
}

export function SafeAreaView(props: SafeAreaViewProps) {
    const { style: originalStyle, drawBehind, children } = props;

    const style = [s.safeAreaView, originalStyle];

    if (drawBehind) {
        return <View style={style}>{children}</View>;
    }

    return Platform.OS === 'ios' ? (
        <RNSafeAreaView style={style}>{children}</RNSafeAreaView>
    ) : (
        <View style={style}>{children}</View>
    );
}
