import {map} from 'lodash/fp';

// key is undefined for regular lodash map
export const uncappedMap = map.convert({
    cap: false,
});