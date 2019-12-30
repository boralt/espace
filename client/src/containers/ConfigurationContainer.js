import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class SimulationContainer extends Component {
    static propTypes = {
        Layout: PropTypes.func.isRequired,
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
            bandwidth: PropTypes.number.isRequired,
        })).isRequired,
        fecs: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            multiplier: PropTypes.number.isRequired,
            divider: PropTypes.number.isRequired,
        })).isRequired,
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
            channels,
            trafficClasses,
            fecs,
        } = this.props;

        const { loading, error } = this.state;

        return (
            <Layout
                error={error}
                loading={loading}
                channels={channels}
                fecs={fecs}
                trafficClasses={trafficClasses}
            />
        );
    }
}

const mapStateToProps = state => ({
    channels: state.configurations.channels || [],
    trafficClasses: state.configurations.trafficClasses || [],
    fecs: state.configurations.fecs || [],
});

const mapDispatchToProps = dispatch => ({
    fetchMeals: dispatch.recipes.getMeals,
    fetchRecipes: dispatch.recipes.getRecipes,
});

export default connect(mapStateToProps, mapDispatchToProps)(SimulationContainer);
