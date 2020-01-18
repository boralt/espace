import React from 'react';
import JSONTree from 'react-json-tree';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Row,
    Col,
    Card,
    Form,
    Label,
    Nav,
    NavItem,
    NavLink,
    TabContent,
    TabPane,
    Input,
    Button,
    CardBody,
    FormGroup,
    CardHeader, CardTitle
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';
import SimulationGraphView from './SimulationGraphView';

class ConfigurationEditor extends React.Component {
    static rebuildState = (props) => {
        const trafficClasses = {};
        const channels = {};
        const fecs = {};
        const { capacity } = props;

        const sessionKeys = Object.keys(props.sessions);

        const currentSessionId = sessionKeys.length > 0 ? sessionKeys[sessionKeys.length - 1] : null;

        props.trafficClasses.forEach((tc) => {
            trafficClasses[tc.id] = tc;
        });

        props.channels.forEach((ch) => {
            channels[ch.id] = ch;
        });

        props.fecs.forEach((fec) => {
            fecs[fec.id] = fec;
        });

        return {
            capacity,
            trafficClasses,
            channels,
            fecs,
            currentSessionId,
        };
    }

    static propTypes = {
        capacity: PropTypes.shape({
            latency: PropTypes.number.isRequired,
            jitter: PropTypes.number.isRequired,
            dropPercent: PropTypes.number.isRequired,
            bandwidth: PropTypes.number.isRequired,
        }).isRequired,
        channels: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            bandwidth: PropTypes.string.isRequired,
            latency: PropTypes.number.isRequired,
            jitter: PropTypes.number.isRequired,
            dropPercent: PropTypes.number.isRequired,
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
            request: PropTypes.shape().isRequired,
            response: PropTypes.shape().isRequired,
            status: PropTypes.string.isRequired,
        })).isRequired,
        sessions: PropTypes.shape().isRequired,
        error: PropTypes.string,
        success: PropTypes.string,
        loading: PropTypes.bool.isRequired,

        submitSimulation: PropTypes.func.isRequired,
        pollSimulationResults: PropTypes.func.isRequired,
        submitSimulation2: PropTypes.func.isRequired,
        pollSimulationResults2: PropTypes.func.isRequired,
        createSession: PropTypes.func.isRequired,
    }

    static defaultProps = {
        error: null,
        success: null,
    }

    constructor(props) {
        super(props);
        this.state = {
            ...ConfigurationEditor.rebuildState(props),
            nextChannelId: props.channels.length + 1,
            nextFecId: props.fecs.length + 1,
            nextTrafficClassId: props.trafficClasses.length + 1,
            tryChunk: 1000,
            simulationTimeout: 5000,
            activeRequestTab: 'raw',
            activeResponseTab: 'raw',
            activeMainTab: 'configs',
            lastRequestId: props.simulations ? props.simulations.length : 0,
            showSimulation: 0,
            activeRequest: {},
            activeResponse: {},
            selectedGraphSessionId: '',
            sankeyData: {
                nodes: [],
                links: [],
            },
        };

        this.pollTimer = null;
    }

    componentDidMount = () => {
        if (! this.state.currentSessionId) {
            this.props.createSession(`SESS_${new Date().getTime()}`)
                .then((sessionId) => {
                    this.setState({
                        currentSessionId: sessionId,
                        lastRequestId: 0,
                    });
                });
        } else {
            if (this.props.sessions[this.state.currentSessionId]) {
                this.setState({
                    lastRequestId: this.props.sessions[this.state.currentSessionId].simulations.length,
                });
            }
        }
    }

    activateRequestTab = (tab) => {
        const { activateRequestTab } = this.state;
        if (activateRequestTab !== tab) {
            this.setState({
                activeRequestTab: tab,
            });
        }
    }

    activateResponseTab = (tab) => {
        const { activeResponseTab } = this.state;
        if (activeResponseTab !== tab) {
            this.setState({
                activeResponseTab: tab,
            });
        }
    }

    activateMainTab = (tab) => {
        const { activeMainTab } = this.state;
        if (activeMainTab !== tab) {
            this.setState({
                activeMainTab: tab,
            });
        }
    }

    handleChannelChange = (id, field) => (e) => {
        const { channels } = this.state;
        const type = e.target.getAttribute('type');

        if (typeof channels[id] !== 'undefined' && typeof channels[id][field] !== 'undefined') {
            channels[id][field] = type === 'number' ? parseInt(e.target.value, 10) : e.target.value;

            this.setState({
                channels,
            });
        }
    }

    handleFecChange = (id, field) => (e) => {
        const { fecs } = this.state;
        const type = e.target.getAttribute('type');

        if (typeof fecs[id] !== 'undefined' && typeof fecs[id][field] !== 'undefined') {
            fecs[id][field] = type === 'number' ? parseInt(e.target.value, 10) : e.target.value;

            this.setState({
                fecs,
            });
        }
    }

    handleTrafficClassChange = (id, field) => (e) => {
        const { trafficClasses } = this.state;
        const type = e.target.getAttribute('type');

        if (typeof trafficClasses[id] !== 'undefined' && typeof trafficClasses[id][field] !== 'undefined') {
            trafficClasses[id][field] = type === 'number' ? parseInt(e.target.value, 10) : e.target.value;

            this.setState({
                trafficClasses,
            });
        }
    }

    handleCapacityChange = field => (e) => {
        const type = e.target.getAttribute('type');
        const { capacity } = this.state;

        if (typeof capacity[field] !== 'undefined') {
            capacity[field] = type === 'number' ? parseInt(e.target.value, 10) : e.target.value;
            console.info(capacity);
            this.setState({
                capacity,
            });
        }
    }

    handleAddChannelClick = () => {
        const { channels, nextChannelId } = this.state;
        const newChannel = {
            id: `gen#${nextChannelId}`,
            name: `Channel #${nextChannelId}`,
            bandwidth: 0,
            latency: 0,
            jitter: 0,
            dropPercent: 0,
        };
        channels[newChannel.id] = newChannel;

        this.setState({
            channels,
            nextChannelId: nextChannelId + 1,
        });
    }

    handleRemoveChannelClick = channelId => () => {
        const { channels } = this.state;
        delete channels[channelId];

        this.setState({
            channels,
        });
    }

    handleAddFecClick = () => {
        const { fecs, nextFecId } = this.state;
        const newFec = {
            id: `gen#${nextFecId}`,
            name: `FEC #${nextFecId}`,
            multiplier: 1,
            divider: 1,
        };
        fecs[newFec.id] = newFec;

        this.setState({
            fecs,
            nextFecId: nextFecId + 1,
        });
    }

    handleRemoveFecClick = fecId => () => {
        const { fecs } = this.state;
        delete fecs[fecId];

        this.setState({
            fecs,
        });
    }

    handleAddTrafficClassClick = () => {
        const { trafficClasses, nextTrafficClassId } = this.state;
        const newTrafficClass = {
            id: `gen#${nextTrafficClassId}`,
            name: `Traffic Class #${nextTrafficClassId}`,
            bandwidthMir: 0,
            bandwidthCir: 0,
            bandwidthMirCost: 0,
            bandwidthCirCost: 0,
            latencyCost: 0,
            jitterCost: 0,
            dropCost: 0,
        };
        trafficClasses[newTrafficClass.id] = newTrafficClass;

        this.setState({
            trafficClasses,
            nextTrafficClassId: nextTrafficClassId + 1,
        });
    }

    handleRemoveTrafficClassClick = trafficClassId => () => {
        const { trafficClasses } = this.state;
        delete trafficClasses[trafficClassId];

        this.setState({
            trafficClasses,
        });
    }

    handleNewSessionClick = () => {
        const sessionId = `SESS_${(new Date()).getTime()}`;
        this.props.createSession(sessionId)
            .then((newSessionId) => {
                console.info(newSessionId);
                this.setState({
                    currentSessionId: sessionId,
                    lastRequestId: 0,
                });
            });
    }

    handleSimulationConfigChange = field => (e) => {
        this.setState({
            [field]: parseInt(e.target.value, 10),
        });
    }

    handleGraphSessionIdChange = (e) => {
        this.setState({
            selectedGraphSessionId: e.target.value,
        });
    }

    handleSimulationChange = (e) => {
        const { value } = e.target;
        const { sessions } = this.props;
        const { currentSessionId } = this.state;
        const { simulations } = sessions[currentSessionId]
            ? sessions[currentSessionId]
            : { simulations: [] };

        if (typeof simulations[value] !== 'undefined') {
            this.setState({
                showSimulation: value,
                activeRequest: simulations[value].request,
                activeResponse: simulations[value].response,
            });
        }
    }

    handleSimulateClick = () => {
        const {
            capacity,
            channels,
            fecs,
            trafficClasses,
            tryChunk,
            simulationTimeout,
            lastRequestId,
        } = this.state;

        const simulationData = {
            try_chunk: tryChunk,
            max_runtime_ms: simulationTimeout,
            start_ts: 0,
            request_id: lastRequestId + 1,
            channels: [{
                bw_kbps: capacity.bandwidth,
                jitter_ms: capacity.jitter,
                latency_ms: capacity.latency,
                drop_percent: capacity.dropPercent,
            }].concat(Object.keys(channels).map(index => ({
                bw_kbps: channels[index].bandwidth,
                latency_ms: channels[index].latency,
                jitter_ms: channels[index].jitter,
                drop_percent: channels[index].dropPercent,
                name: channels[index].name,
                id: channels[index].id,
            }))),
            fec: Object.keys(fecs).map(index => ({
                multiplier: fecs[index].multiplier,
                divider: fecs[index].divider,
                name: fecs[index].name,
                id: fecs[index].id,
            })),
            traffic_classes: Object.keys(trafficClasses).map(index => ({
                latency_cost: trafficClasses[index].latencyCost,
                jitter_cost: trafficClasses[index].jitterCost,
                bw_cir_kbps: trafficClasses[index].bandwidthCir,
                bw_mir_kbps: trafficClasses[index].bandwidthMir,
                bw_cir_cost: trafficClasses[index].bandwidthCirCost,
                bw_mir_cost: trafficClasses[index].bandwidthMirCost,
                drop_cost: trafficClasses[index].dropCost,
                name: trafficClasses[index].name,
                id: trafficClasses[index].id,
            })),
        };

        this.submitSimulation(simulationData)
            .then((response) => {
                console.info('Simulation submitted.');
                toast.success('Simulation request submitted');

                this.setState({
                    lastRequestId: lastRequestId + 1,
                });

                if (!this.pollTimer) {
                    this.pollSimulation();
                }
            })
            .catch((error) => {
                console.error(`Could not submit simulation: ${error}`);
                toast.error(`Could not submit simulation: ${error}`);
            });
    }

    submitSimulation = data => this.props.submitSimulation2({
        simulation: data,
        sessionId: this.state.currentSessionId
    });

    pollSimulation = () => {
        if (!this.pollTimer) {
            this.pollTimer = setInterval(this.pollSimulation, 10000);
            return;
        }

        const { pollSimulationResults2 } = this.props;
        const { currentSessionId } = this.state;

        pollSimulationResults2(currentSessionId)
            .then((response) => {
                if (response && response.length > 0) {
                    toast.success(`Just received results for ${response.length} simulations.`);
                }
            });
    }

    render() {
        const theme = {
            scheme: 'monokai',
            author: 'wimer hazenberg (http://www.monokai.nl)',
            base00: '#272822',
            base01: '#383830',
            base02: '#49483e',
            base03: '#75715e',
            base04: '#a59f85',
            base05: '#f8f8f2',
            base06: '#f5f4f1',
            base07: '#f9f8f5',
            base08: '#f92672',
            base09: '#fd971f',
            base0A: '#f4bf75',
            base0B: '#a6e22e',
            base0C: '#a1efe4',
            base0D: '#66d9ef',
            base0E: '#ae81ff',
            base0F: '#cc6633',
        };
        const { loading, success, error } = this.props;
        const {
            capacity,
            channels,
            trafficClasses,
            fecs,
            tryChunk,
            simulationTimeout,
            activeRequest,
            activeResponse,
            activeRequestTab,
            activeMainTab,
            activeResponseTab,
            showSimulation,
            currentSessionId,
            selectedGraphSessionId,
        } = this.state;

        const { sessions } = this.props;
        const { simulations } = sessions[currentSessionId]
            ? sessions[currentSessionId]
            : { simulations: [] };

        // Show Listing
        return (
            <Card>
                <div style={{ padding: '20px' }}>
                    <Nav tabs>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeMainTab === 'configs' })}
                                onClick={() => this.activateMainTab('configs')}
                            >
                                Configurations
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink
                                className={classnames({ active: activeMainTab === 'graphs' })}
                                onClick={() => this.activateMainTab('graphs')}
                            >
                                Graphs
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab={activeMainTab}>
                        <TabPane tabId="configs">
                            <br />
                            <Card>
                                <CardHeader>
                                    <Row className={loading ? 'content-loading' : ''}>
                                        <Col sm="12" className="card-columns">
                                            <CardTitle>Capacity:</CardTitle>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>

                                    <Row>
                                        <Col sm="12">
                                            <Row form>
                                                <Col md="3">
                                                    <Label className="configLabel">Bandwidth</Label>
                                                </Col>
                                                <Col md="3">
                                                    <Label className="configLabel">Latency</Label>
                                                </Col>
                                                <Col md="3">
                                                    <Label className="configLabel">Jitter</Label>
                                                </Col>
                                                <Col md="3">
                                                    <Label className="configLabel">Drop</Label>
                                                </Col>
                                            </Row>
                                            <Form>
                                                <Row form>
                                                    <Col md="3">
                                                        <FormGroup>
                                                            <Input type="number" value={capacity.bandwidth} onChange={this.handleCapacityChange('bandwidth')} />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="3">
                                                        <FormGroup>
                                                            <Input type="number" value={capacity.latency} onChange={this.handleCapacityChange('latency')} />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="3">
                                                        <FormGroup>
                                                            <Input type="number" value={capacity.jitter} onChange={this.handleCapacityChange('jitter')} />
                                                        </FormGroup>
                                                    </Col>
                                                    <Col md="3">
                                                        <FormGroup>
                                                            <Input type="number" value={capacity.dropPercent} onChange={this.handleCapacityChange('dropPercent')} />
                                                        </FormGroup>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <br />
                            <Card>
                                <CardHeader>
                                    <Row className={loading ? 'content-loading' : ''}>
                                        <Col sm="12" className="card-columns">
                                            <CardTitle>Channels:</CardTitle>
                                            <Button color="primary" onClick={this.handleAddChannelClick}>
                                                <i className="icon-plus" />
                                                Add
                                   </Button>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>

                                    <Row>
                                        <Col sm="12">
                                            <Row form>
                                                <Col md="3">
                                                    <Label className="configLabel">Name</Label>
                                                </Col>
                                                <Col md="2">
                                                    <Label className="configLabel">Bandwidth</Label>
                                                </Col>
                                                <Col md="2">
                                                    <Label className="configLabel">Latency</Label>
                                                </Col>
                                                <Col md="2">
                                                    <Label className="configLabel">Jitter</Label>
                                                </Col>
                                                <Col md="2">
                                                    <Label className="configLabel">Drop</Label>
                                                </Col>
                                                <Col md="1" />
                                            </Row>
                                            <Form>
                                                {
                                                    Object.keys(channels).map((index, order) => (
                                                        <Row form key={index}>
                                                            <Col md="3">
                                                                <FormGroup>
                                                                    <Input type="text" value={channels[index].name} onChange={this.handleChannelChange(index, 'name')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="2">
                                                                <FormGroup>
                                                                    <Input type="number" value={channels[index].bandwidth} onChange={this.handleChannelChange(index, 'bandwidth')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="2">
                                                                <FormGroup>
                                                                    <Input type="number" value={channels[index].latency} onChange={this.handleChannelChange(index, 'latency')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="2">
                                                                <FormGroup>
                                                                    <Input type="number" value={channels[index].jitter} onChange={this.handleChannelChange(index, 'jitter')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="2">
                                                                <FormGroup>
                                                                    <Input type="number" value={channels[index].dropPercent} onChange={this.handleChannelChange(index, 'dropPercent')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="1">
                                                                <Button color="danger" onClick={this.handleRemoveChannelClick(index)}><i className="icon-close" /></Button>
                                                            </Col>
                                                        </Row>
                                                    ))
                                                }
                                            </Form>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <br />
                            <Card>
                                <CardHeader>
                                    <Row className={loading ? 'content-loading' : ''}>
                                        <Col sm="12" className="card-columns">
                                            <CardTitle>FECs:</CardTitle>
                                            <Button color="primary" onClick={this.handleAddFecClick}>
                                                <i className="icon-plus" />
                                                Add
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="12">
                                            <Row form>
                                                <Col md="3">
                                                    <Label className="configLabel">Name</Label>
                                                </Col>
                                                <Col md="3">
                                                    <Label className="configLabel">Multiplier</Label>
                                                </Col>
                                                <Col md="3">
                                                    <Label className="configLabel">Divider</Label>
                                                </Col>
                                                <Col md="1" />
                                            </Row>
                                            <Form>
                                                {
                                                    Object.keys(fecs).map((index, order) => (
                                                        <Row form key={index}>
                                                            <Col md="3">
                                                                <FormGroup>
                                                                    <Input type="text" value={fecs[index].name} onChange={this.handleFecChange(index, 'name')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="3">
                                                                <FormGroup>
                                                                    <Input type="number" value={fecs[index].multiplier} onChange={this.handleFecChange(index, 'multiplier')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="3">
                                                                <FormGroup>
                                                                    <Input type="number" value={fecs[index].divider} onChange={this.handleFecChange(index, 'divider')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="1">
                                                                <Button color="danger" onClick={this.handleRemoveFecClick(index)}><i className="icon-close" /></Button>
                                                            </Col>
                                                        </Row>
                                                    ))
                                                }
                                            </Form>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <br />
                            <Card>
                                <CardHeader>
                                    <Row className={loading ? 'content-loading' : ''}>
                                        <Col sm="12" className="card-columns">
                                            <CardTitle>Traffic Classes:</CardTitle>
                                            <Button color="primary" onClick={this.handleAddTrafficClassClick}>
                                                <i className="icon-plus" />
                                                Add
                                            </Button>
                                        </Col>
                                    </Row>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col sm="12">
                                            <Row form>
                                                <Col md="1">
                                                    <Label className="configLabel">Name</Label>
                                                </Col>
                                                <Col md="1">
                                                    <Label className="configLabel">BW MIR</Label>
                                                </Col>
                                                <Col md="2">
                                                    <Label className="configLabel">BW CIR</Label>
                                                </Col>
                                                <Col md="2">
                                                    <Label className="configLabel">BW MIR Cost</Label>
                                                </Col>
                                                <Col md="2">
                                                    <Label className="configLabel">BW CIR Cost</Label>
                                                </Col>
                                                <Col md="1">
                                                    <Label className="configLabel">Latency</Label>
                                                </Col>
                                                <Col md="1">
                                                    <Label className="configLabel">Jitter</Label>
                                                </Col>
                                                <Col md="1">
                                                    <Label className="configLabel">Drop</Label>
                                                </Col>
                                                <Col md="1" />
                                            </Row>
                                            <Form>
                                                {
                                                    Object.keys(trafficClasses).map((index, order) => (
                                                        <Row form key={index}>
                                                            <Col md="1">
                                                                <FormGroup>
                                                                    <Input type="text" value={trafficClasses[index].name} onChange={this.handleTrafficClassChange(index, 'name')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="1">
                                                                <FormGroup>
                                                                    <Input type="number" value={trafficClasses[index].bandwidthMir} onChange={this.handleTrafficClassChange(index, 'bandwidthMir')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="2">
                                                                <FormGroup>
                                                                    <Input type="number" value={trafficClasses[index].bandwidthCir} onChange={this.handleTrafficClassChange(index, 'bandwidthCir')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="2">
                                                                <FormGroup>
                                                                    <Input type="number" value={trafficClasses[index].bandwidthMirCost} onChange={this.handleTrafficClassChange(index, 'bandwidthMirCost')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="2">
                                                                <FormGroup>
                                                                    <Input type="number" value={trafficClasses[index].bandwidthCirCost} onChange={this.handleTrafficClassChange(index, 'bandwidthCirCost')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="1">
                                                                <FormGroup>
                                                                    <Input type="number" value={trafficClasses[index].latencyCost} onChange={this.handleTrafficClassChange(index, 'latencyCost')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="1">
                                                                <FormGroup>
                                                                    <Input type="number" value={trafficClasses[index].jitterCost} onChange={this.handleTrafficClassChange(index, 'jitterCost')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="1">
                                                                <FormGroup>
                                                                    <Input type="number" value={trafficClasses[index].dropCost} onChange={this.handleTrafficClassChange(index, 'dropCost')} />
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md="1">
                                                                <Button color="danger" onClick={this.handleRemoveTrafficClassClick(index)}><i className="icon-close" /></Button>
                                                            </Col>
                                                        </Row>
                                                    ))
                                                }
                                            </Form>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                            <br />
                            <Card>
                                <CardHeader>
                                    <CardTitle>Simulation:</CardTitle>
                                </CardHeader>
                                <CardBody>
                                    <Row>
                                        <Col md="4">
                                            <FormGroup>
                                                <Label className="configLabel">Try Chunk Size</Label>
                                                <Input type="number" value={tryChunk} onChange={this.handleSimulationConfigChange('tryChunk')} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="2">
                                            <FormGroup>
                                                <Label className="configLabel">Execution Timeout (in ms)</Label>
                                                <Input type="number" value={simulationTimeout} onChange={this.handleSimulationConfigChange('simulationTimeout')} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="2">
                                            <Button color="primary" onClick={this.handleSimulateClick}>
                                                Simulate
                                            </Button>
                                        </Col>
                                        <Col md="2">
                                            <Label>
                                                Current session: {currentSessionId}
                                            </Label>
                                        </Col>
                                        <Col md="2">
                                            <Button color="primary" onClick={this.handleNewSessionClick}>
                                                New Session
                                            </Button>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="4">
                                            <FormGroup>
                                                <Label className="configLabel">Show Simulation</Label>
                                                <Input type="select" onChange={this.handleSimulationChange} value={showSimulation}>
                                                    <option value={0}>--- Select ---</option>
                                                    {
                                                        simulations.map((simulation, index) => (
                                                            <option
                                                                value={index}
                                                                key={`${simulation.sessionId}-${simulation.requestId}`}
                                                            >
                                                                {`${simulation.name} (${simulation.status})`}
                                                            </option>
                                                        ))
                                                    }
                                                </Input>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col md="12">
                                            <Label className="configLabel">Request:</Label>
                                            <Nav tabs>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: activeRequestTab === 'raw' })}
                                                        onClick={() => this.activateRequestTab('raw')}
                                                    >
                                                        Raw
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: activeRequestTab === 'tree' })}
                                                        onClick={() => this.activateRequestTab('tree')}
                                                    >
                                                        Tree
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                            <TabContent activeTab={activeRequestTab}>
                                                <TabPane tabId="raw">
                                                    <Row>
                                                        <Col md="12">
                                                            <Input style={{ fontFamily: 'monospace', wordBreak: 'keep-all' }} type="textarea" value={JSON.stringify(activeRequest)} readOnly />
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                                <TabPane tabId="tree">
                                                    <Row>
                                                        <Col md="12">
                                                            <JSONTree
                                                                data={activeRequest}
                                                                theme={theme}
                                                                invertTheme
                                                            />
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </TabContent>
                                        </Col>
                                    </Row>
                                    <br />
                                    <Row>
                                        <Col md="12">
                                            <Label>Response:</Label>
                                            <Nav tabs>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: activeResponseTab === 'raw' })}
                                                        onClick={() => this.activateResponseTab('raw')}
                                                    >
                                                        Raw
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink
                                                        className={classnames({ active: activeResponseTab === 'tree' })}
                                                        onClick={() => this.activateResponseTab('tree')}
                                                    >
                                                        Tree
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                            <TabContent activeTab={activeResponseTab}>
                                                <TabPane tabId="raw">
                                                    <Row>
                                                        <Col md="12">
                                                            <Input style={{ fontFamily: 'monospace', wordBreak: 'keep-all' }} type="textarea" value={JSON.stringify(activeResponse)} readOnly />
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                                <TabPane tabId="tree">
                                                    <Row>
                                                        <Col md="12">
                                                            <JSONTree
                                                                data={activeResponse}
                                                                theme={theme}
                                                                invertTheme
                                                            />
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </TabContent>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </TabPane>
                        <TabPane tabId="graphs">
                            <Row>
                                <Col md="4">
                                    <FormGroup>
                                        <Label className="configLabel">Session</Label>
                                        <Input type="select" value={selectedGraphSessionId} onChange={this.handleGraphSessionIdChange}>
                                            <option value="">Select a session</option>
                                            {
                                                Object.keys(sessions).map(sessionId => (
                                                    <option
                                                        key={sessionId}
                                                        value={sessionId}
                                                    >
                                                        {sessionId}
                                                    </option>
                                                ))
                                            }
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col md="12">
                                    <SimulationGraphView
                                        simulations={sessions[selectedGraphSessionId] ? sessions[selectedGraphSessionId].simulations : []}
                                    />
                                </Col>
                            </Row>
                        </TabPane>
                    </TabContent>
                </div>
            </Card>
        );
    }
}

export default withRouter(ConfigurationEditor);
