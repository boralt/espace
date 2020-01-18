import Axios from 'axios';
import initState from '../store/simulations';
const hostIp = '3.85.7.255';

window.Axios = Axios;
export default {
    /**
     *  Initial state
     */
    state: {
        simulations: initState.simulations,
        sessions: initState.sessions,
    },

    /**
     * Reducers
     */
    reducers: {
        replaceSims(state, payload) {
            return {
                ...state,
                simulations: payload,
            };
        },

        addSimulation(state, payload) {
            const { simulations } = state;
            simulations.push(payload);

            return {
                ...state,
                simulations,
            };
        },

        updateSimulations(state, payload) {
            const { simulations } = state;
            console.info(payload);
            Object.keys(payload).forEach((requestId) => {
                console.info(requestId);
                // Find the index of this request in the state and update
                for (let i = simulations.length - 1; i >= 0; --i) {
                    if (parseInt(requestId, 10) === simulations[i].requestId) {
                        simulations[i] = {
                            ...simulations[i],
                            response: payload[requestId],
                            status: 'COMPLETED',
                        };
                        break;
                    }
                }
            });

            return {
                ...state,
                simulations: [...simulations],
            };
        },

        addSession(state, payload) {
            const { sessions } = state;

            sessions[payload.sessionId] = {
                id: payload.sessionId,
                name: payload.name,
                simulations: payload.simulations ? payload.simulations : [],
            };

            return {
                ...state,
                sessions,
            };
        },

        addSimulation2(state, payload) {
            const { sessions } = state;

            if (sessions[payload.sessionId]) {
                sessions[payload.sessionId].simulations.push({
                    sessionId: payload.sessionId,
                    requestId: payload.requestId,
                    name: payload.name,
                    request: payload.request,
                    response: payload.response ? payload.response : {},
                    status: payload.status ? payload.status : 'PENDING',
                });
            }

            console.info(sessions);
            return {
                ...state,
                sessions,
            };
        },

        updateSimulations2(state, payload) {
            const { sessions } = state;
            console.info(payload);
            if (sessions[payload.sessionId]) {
                const { simulations } = sessions[payload.sessionId];
                Object.keys(payload.results).forEach((requestId) => {
                    console.info(requestId);
                    // Find the index of this request in the state and update
                    for (let i = simulations.length - 1; i >= 0; --i) {
                        if (parseInt(requestId, 10) === simulations[i].requestId) {
                            simulations[i] = {
                                ...simulations[i],
                                response: payload.results[requestId],
                                status: 'COMPLETED',
                            };
                            break;
                        }
                    }
                });
                sessions[payload.sessionId].simulations = [...simulations];

                return {
                    ...state,
                    sessions: { ...sessions },
                };
            }

            return state;
        },
    },

    /**
     * Effects/Actions
     */
    effects: () => ({
        submitSimulation(simulation) {
            return new Promise((resolve, reject) => Axios.post(`http://${hostIp}:7777`, JSON.stringify(simulation), {})
                .then(() => {
                    this.addSimulation({
                        name: `Simulation #${simulation.request_id}`,
                        requestId: simulation.request_id,
                        request: simulation,
                        status: 'PENDING',
                        response: {},
                    });
                    return resolve();
                }).catch(reject)).catch((err) => { throw err.message; });
        },

        pollSimulationResults() {
            return new Promise((resolve, reject) => Axios.get(`http://${hostIp}:7777`)
                .then((response) => {
                    const { data } = response;
                    const resolvedRequestIds = [];
                    if (data.results.length > 0) {
                        const mappedResults = {};
                        data.results.forEach((result) => {
                            resolvedRequestIds.push(result.request.request_id);
                            mappedResults[result.request.request_id] = result.result;
                        });
                        this.updateSimulations(mappedResults);
                    }
                    return resolve(resolvedRequestIds);
                }).catch(reject)).catch((err) => { throw err.message; });
        },

        submitSimulation2(payload) {
            const { simulation, sessionId } = payload;
            simulation.session_id = sessionId;
            return new Promise((resolve, reject) => Axios.post(`http://${hostIp}:7777`, JSON.stringify({ requests: [simulation] }))
                .then(() => {
                    this.addSimulation2({
                        name: `Simulation #${simulation.request_id}`,
                        requestId: simulation.request_id,
                        request: simulation,
                        status: 'PENDING',
                        response: {},
                        sessionId,
                    });
                    return resolve();
                }).catch(reject)).catch((err) => { throw err.message; });
        },

        pollSimulationResults2(sessionId) {
            return new Promise((resolve, reject) => Axios.get(`http://${hostIp}:7777?session_id=${sessionId}`)
                .then((response) => {
                    const { data } = response;
                    const resolvedRequestIds = [];
                    if (data.results.length > 0) {
                        const mappedResults = {};
                        data.results.forEach((result) => {
                            resolvedRequestIds.push(result.request.requests[0].request_id);
                            mappedResults[result.request.requests[0].request_id] = result.result;
                        });
                        this.updateSimulations2({
                            sessionId,
                            results: mappedResults,
                        });
                    }
                    return resolve(resolvedRequestIds);
                }).catch(reject)).catch((err) => { console.info(err); throw err.message; });
        },

        createSession(sessionId) {
            return new Promise((resolve, reject) => {
                this.addSession({
                    sessionId,
                    name: sessionId,
                    simulations: [],
                });

                return resolve(sessionId);
            });
        },
    }),
};
