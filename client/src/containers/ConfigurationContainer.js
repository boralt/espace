import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class SimulationContainer extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
        capacity: PropTypes.shape({
            latency: PropTypes.number.isRequired,
            jitter: PropTypes.number.isRequired,
            dropPercent: PropTypes.number.isRequired,
            bandwidth: PropTypes.number.isRequired,
        }).isRequired,
        channels: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            latency: PropTypes.number.isRequired,
            jitter: PropTypes.number.isRequired,
            dropPercent: PropTypes.number.isRequired,
            bandwidth: PropTypes.number.isRequired,
        })).isRequired,
        trafficClasses: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            latencyCost: PropTypes.number.isRequired,
            jitterCost: PropTypes.number.isRequired,
            dropCost: PropTypes.number.isRequired,
            bandwidthCir: PropTypes.number.isRequired,
            bandwidthMir: PropTypes.number.isRequired,
            bandwidthCirCost: PropTypes.number.isRequired,
            bandwidthMirCost: PropTypes.number.isRequired,
        })).isRequired,
        fecs: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            multiplier: PropTypes.number.isRequired,
            divider: PropTypes.number.isRequired,
        })).isRequired,
        simulations: PropTypes.arrayOf(PropTypes.shape({
            requestId: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
            status: PropTypes.string.isRequired,
            request: PropTypes.shape().isRequired,
            response: PropTypes.shape().isRequired,
        })).isRequired,
        sessions: PropTypes.shape().isRequired,

        submitSimulation: PropTypes.func.isRequired,
        pollSimulationResults: PropTypes.func.isRequired,
        submitSimulation2: PropTypes.func.isRequired,
        pollSimulationResults2: PropTypes.func.isRequired,
        createSession: PropTypes.func.isRequired,
    }

    static defaultProps = {
    }

    state = {
        error: null,
        loading: false,
    }

    componentDidMount = () => this.fetchData();

    fetchData = (data) => {
        // TODO: Fetch actual configuration from the server.
    }

    render = () => {
        const {
            Layout,
            capacity,
            channels,
            trafficClasses,
            fecs,
            simulations,
            sessions,

            submitSimulation,
            pollSimulationResults,
            submitSimulation2,
            pollSimulationResults2,
            createSession,
        } = this.props;

        const { loading, error } = this.state;

        return (
            <Layout
                error={error}
                loading={loading}
                capacity={capacity}
                channels={channels}
                fecs={fecs}
                trafficClasses={trafficClasses}
                simulations={simulations}
                sessions={sessions}
                submitSimulation={submitSimulation}
                pollSimulationResults={pollSimulationResults}
                submitSimulation2={submitSimulation2}
                pollSimulationResults2={pollSimulationResults2}
                createSession={createSession}
            />
        );
    }
}

const mapStateToProps = state => ({
    channels: state.configurations.channels || [],
    trafficClasses: state.configurations.trafficClasses || [],
    fecs: state.configurations.fecs || [],
    capacity: state.configurations.capacity,
    simulations: state.simulations.simulations,
    sessions: state.simulations.sessions,
});

const mapDispatchToProps = dispatch => ({
    fetchMeals: dispatch.recipes.getMeals,
    fetchRecipes: dispatch.recipes.getRecipes,
    submitSimulation: dispatch.simulations.submitSimulation,
    pollSimulationResults: dispatch.simulations.pollSimulationResults,
    submitSimulation2: dispatch.simulations.submitSimulation2,
    pollSimulationResults2: dispatch.simulations.pollSimulationResults2,
    createSession: dispatch.simulations.createSession,
});

export default connect(mapStateToProps, mapDispatchToProps)(SimulationContainer);
