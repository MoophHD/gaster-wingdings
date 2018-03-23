import { Dimensions, Platform } from 'react-native';

const IS_ANDROID = Platform.OS === 'android';
const { height, width } = Dimensions.get('window');

export const ANDROID_STATUSBAR = 24;
export const AD_HEIGHT = 50;

export const DEVICE_HEIGHT = height;
export const DEVICE_WIDTH = width;
export const BOARD_MARGIN = 5;