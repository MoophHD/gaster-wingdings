import { DEVICE_HEIGHT } from 'config/metrics';

const adjustFontSize = ( size ) => {
    return Math.round(size * DEVICE_HEIGHT / 375);
}

export default adjustFontSize;