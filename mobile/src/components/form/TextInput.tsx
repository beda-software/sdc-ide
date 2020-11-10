import _ from 'lodash';
import React, { Component } from 'react';
import { StyleProp, TextInput as RNTextInput, TextInputProps as RNTextInputProps, TextStyle } from 'react-native';

export interface TextInputProps extends RNTextInputProps {
    focusedStyles?: StyleProp<TextStyle>;
    disabledStyles?: StyleProp<TextStyle>;
}

interface TextInputState {
    focused: boolean;
}

export interface MeasureProps {
    x: number;
    y: number;
    width: number;
    height: number;
    pageX: number;
    pageY: number;
}

export class TextInput extends Component<TextInputProps, TextInputState> {
    private inputRef: React.RefObject<RNTextInput>;

    constructor(props: TextInputProps) {
        super(props);

        this.inputRef = React.createRef();

        this.state = {
            focused: false,
        };
    }

    public componentDidMount() {
        if (this.props.autoFocus) {
            console.error(
                'Do not use autoFocus in input! Follow: https://github.com/wix/react-native-navigation/issues/2622',
            );
        }
    }

    public focus() {
        if (this.inputRef) {
            this.inputRef.current!.focus();
        }
    }

    public blur() {
        if (this.inputRef) {
            this.inputRef.current!.blur();
        }
    }

    public measure(onMeasure: (v: MeasureProps) => void) {
        if (this.inputRef) {
            this.inputRef.current!.measure((x, y, width, height, pageX, pageY) =>
                onMeasure({
                    x,
                    y,
                    width,
                    height,
                    pageX,
                    pageY,
                }),
            );
        }
    }

    public render() {
        const { focused } = this.state;
        const {
            style: baseStyle = {},
            onFocus,
            onBlur,
            focusedStyles = {},
            disabledStyles = {},
            editable,
        } = this.props;
        let style = baseStyle;

        if (focused) {
            style = _.merge({}, baseStyle, focusedStyles);
        }

        if (!editable) {
            style = _.merge({}, baseStyle, disabledStyles);
        }

        return (
            <RNTextInput
                {...this.props}
                ref={this.inputRef}
                style={style}
                onFocus={(e) => {
                    this.setState({ focused: true });

                    if (onFocus) {
                        onFocus(e);
                    }
                }}
                onBlur={(e) => {
                    this.setState({ focused: false });

                    if (onBlur) {
                        onBlur(e);
                    }
                }}
            />
        );
    }
}
