/* @flow */

import React, { PureComponent } from 'react';
import {
  Animated,
  StyleSheet,
} from 'react-native';
import { TabBar } from 'react-native-tab-view';
import TabBarIcon from './TabBarIcon';

import type {
  NavigationState,
  NavigationRoute,
  Style,
} from '../../TypeDefinition';

import type {
  TabScene,
} from './TabView';

type DefaultProps = {
  activeTintColor: string;
  inactiveTintColor: string;
  showIcon: boolean;
  showLabel: boolean;
  upperCaseLabel: boolean;
};

type Props = {
  activeTintColor: string;
  inactiveTintColor: string;
  showIcon: boolean;
  showLabel: boolean;
  upperCaseLabel: boolean;
  position: Animated.Value;
  navigationState: NavigationState;
  getLabel: (scene: TabScene) => ?(React.Element<*> | string);
  renderIcon: (scene: TabScene) => React.Element<*>;
  labelStyle?: Style;
};

export default class TabBarTop extends PureComponent<DefaultProps, Props, void> {

  static defaultProps = {
    activeTintColor: '#fff',
    inactiveTintColor: '#fff',
    showIcon: false,
    showLabel: true,
    upperCaseLabel: true,
  };

  props: Props;

  _renderLabel = (scene: TabScene) => {
    const {
      position,
      navigationState,
      activeTintColor,
      inactiveTintColor,
      showLabel,
      upperCaseLabel,
      labelStyle,
    } = this.props;
    if (showLabel === false) {
      return null;
    }
    const { index } = scene;
    const { routes } = navigationState;
    // Prepend '-1', so there are always at least 2 items in inputRange
    const inputRange = [-1, ...routes.map((x: *, i: number) => i)];
    const outputRange = inputRange.map((inputIndex: number) =>
      (inputIndex === index ? activeTintColor : inactiveTintColor)
    );
    const color = position.interpolate({
      inputRange,
      outputRange,
    });

    const label = this.props.getLabel(scene);
    if (typeof label === 'string') {
      return (
        <Animated.Text style={[styles.label, { color }, labelStyle]}>
          {upperCaseLabel ? label.toUpperCase() : label}
        </Animated.Text>
      );
    }
    if (typeof label === 'function') {
      return label(scene);
    }

    return label;
  };

  _renderIcon = (scene: TabScene) => {
    const {
      position,
      navigationState,
      activeTintColor,
      inactiveTintColor,
      renderIcon,
      showIcon,
      iconStyle,
    } = this.props;
    if (showIcon === false) {
      return null;
    }
    return (
      <TabBarIcon
        position={position}
        navigationState={navigationState}
        activeTintColor={activeTintColor}
        inactiveTintColor={inactiveTintColor}
        renderIcon={renderIcon}
        scene={scene}
        style={[styles.icon, iconStyle]}
      />
    );
  };

  render() {
    // TODO: Define full proptypes
    const props: any = this.props;

    return (
      <TabBar
        {...props}
        renderIcon={this._renderIcon}
        renderLabel={this._renderLabel}
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
  },
  label: {
    textAlign: 'center',
    fontSize: 13,
    margin: 8,
    backgroundColor: 'transparent',
  },
});
