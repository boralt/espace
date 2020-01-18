import initState from '../store/configurations';

export default {
    /**
     *  Initial state
     */
    state: {
        capacity: initState.capacity,
        channels: initState.channels,
        trafficClasses: initState.trafficClasses,
        fecs: initState.fecs,
    },

    /**
     * Reducers
     */
    reducers: {
        replaceChannels(state, payload) {
            return {
                ...state,
                channels: payload,
            };
        },
        replaceTrafficClasses(state, payload) {
            return {
                ...state,
                trafficClasses: payload,
            };
        },
        replaceFecs(state, payload) {
            return {
                ...state,
                fecs: payload,
            };
        },
    },

    /**
     * Effects/Actions
     */
    effects: () => ({
    }),
};
