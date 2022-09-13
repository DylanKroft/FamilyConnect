import * as React from 'react';
import { TextStyle } from 'react-native';
import { RowData } from './Row';
export interface SectionData {
    type: 'SECTION';
    key?: string;
    header?: string;
    footer?: string | (() => React.ReactElement<any>);
    rows: RowData[];
}
export interface SectionProps {
    section: SectionData;
    globalTextStyle?: TextStyle;
}
export declare const Section: ({ section, globalTextStyle }: SectionProps) => JSX.Element;
