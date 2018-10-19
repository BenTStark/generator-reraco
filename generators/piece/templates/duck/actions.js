import types from './types.js';

const defaultAction = (value) => {
    type: types.DEFAULT_ACTION,
    value: value
};

export default {
    defaultAction
}
