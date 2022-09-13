"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsScreen = void 0;
const React = require("react");
const react_native_1 = require("react-native");
const native_1 = require("styled-components/native");
const Section_1 = require("./Section");
class SettingsScreen extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { refreshing: false };
    }
    render() {
        const elements = this.props.data.map((item, i) => {
            switch (item.type) {
                case 'CUSTOM_VIEW':
                    return React.createElement(react_native_1.View, { key: item.key || i }, item.render());
                case 'SECTION':
                    return (React.createElement(Section_1.Section, { key: item.header || i, section: item, globalTextStyle: this.props.globalTextStyle }));
            }
        });
        const scrollViewProps = Object.assign(Object.assign({}, (this.props.scrollViewProps || {})), { style: this.props.style });
        return (React.createElement(SettingsScrollView, Object.assign({}, scrollViewProps), elements));
    }
}
exports.SettingsScreen = SettingsScreen;
const SettingsScrollView = native_1.default.ScrollView `
  flex: 1;
  align-self: stretch;
  background-color: hsl(0, 0%, 97%);
`;
