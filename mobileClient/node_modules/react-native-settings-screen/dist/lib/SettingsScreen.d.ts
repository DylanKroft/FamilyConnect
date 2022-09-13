import * as React from 'react';
import { ViewStyle, TextStyle, ScrollViewProps } from 'react-native';
import { SectionData } from './Section';
export declare type SettingsData = SettingsDatum[];
export declare type SettingsDatum = CustomViewData | SectionData;
export interface CustomViewData {
    type: 'CUSTOM_VIEW';
    key?: string;
    render: () => React.ReactElement<any>;
}
export interface Props {
    style?: ViewStyle;
    data: SettingsData;
    globalTextStyle?: TextStyle;
    scrollViewProps?: Partial<ScrollViewProps>;
}
export declare class SettingsScreen extends React.Component<Props> {
    state: {
        refreshing: boolean;
    };
    render(): JSX.Element;
}
