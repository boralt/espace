import React from 'react';
import JSONTree from 'react-json-tree';
import PropTypes from 'prop-types';
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
    Alert,
    Input,
    Button,
    CardBody,
    FormGroup,
    CardHeader,
} from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';
import classnames from 'classnames';

class ConfigurationEditor extends React.Component {
    static rebuildState = (props) => {
        const trafficClasses = {};
        const channels = {};
        const fecs = {};

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
            trafficClasses,
            channels,
            fecs,
        };
    }

    static propTypes = {
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
        error: PropTypes.string,
        success: PropTypes.string,
        loading: PropTypes.bool.isRequired,
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
            lastRequest: {},
            lastResponse: {},
            activeRequestTab: 'raw',
            activeResponseTab: 'raw',
        };
        // this.handleChange = this.handleChange.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
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

    handleChannelChange = (id, field) => (e) => {
        const { channels } = this.state;

        if (typeof channels[id] !== 'undefined' && typeof channels[id][field] !== 'undefined') {
            channels[id][field] = e.target.value;

            this.setState({
                channels,
            });
        }
    }

    handleFecChange = (id, field) => (e) => {
        const { fecs } = this.state;

        if (typeof fecs[id] !== 'undefined' && typeof fecs[id][field] !== 'undefined') {
            fecs[id][field] = e.target.value;

            this.setState({
                fecs,
            });
        }
    }

    handleTrafficClassChange = (id, field) => (e) => {
        const { trafficClasses } = this.state;

        if (typeof trafficClasses[id] !== 'undefined' && typeof trafficClasses[id][field] !== 'undefined') {
            trafficClasses[id][field] = e.target.value;

            this.setState({
                trafficClasses,
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
            bandwidth: 0,
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

    handleTryChunkChange = (e) => {
        this.setState({
            tryChunk: e.target.value,
        });
    }

    handleSimulateClick = () => {
        const {
            channels,
            fecs,
            trafficClasses,
            tryChunk,
        } = this.state;

        const simulationData = {
            try_chunk: tryChunk,
            channels: Object.keys(channels).map(index => ({
                latency_ms: channels[index].latency,
                jitter_ms: channels[index].jitter,
                bw_kbps: channels[index].bandwidth,
                drop_percent: channels[index].dropPercent,
            })),
            fec: Object.keys(fecs).map(index => ({
                multiplier: fecs[index].multiplier,
                divider: fecs[index].divider,
            })),
            traffic_classes: Object.keys(trafficClasses).map(index => ({
                latency_cost: trafficClasses[index].latencyCost,
                jitter_cost: trafficClasses[index].jitterCost,
                bw_kbps: trafficClasses[index].bandwidth,
                drop_cost: trafficClasses[index].dropCost,
            })),
        };

        this.setState({
            lastRequest: simulationData,
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
            channels,
            trafficClasses,
            fecs,
            tryChunk,
            lastRequest,
            lastResponse,
            activeRequestTab,
            activeResponseTab,
        } = this.state;

        // Show Listing
        return (
            <div>
                <Row className="pt-4 pt-sm-0">
                    <Col sm="12">
                        <h1>Configurations</h1>
                    </Col>
                </Row>
                <Card>
                    <CardHeader>
                        <Row className={loading ? 'content-loading' : ''}>
                            <Col sm="12" className="card-columns">
                                <h5>Channels:</h5>
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
                                        <Label>Name</Label>
                                    </Col>
                                    <Col md="2">
                                        <Label>Bandwidth</Label>
                                    </Col>
                                    <Col md="2">
                                        <Label>Latency</Label>
                                    </Col>
                                    <Col md="2">
                                        <Label>Jitter</Label>
                                    </Col>
                                    <Col md="2">
                                        <Label>Drop</Label>
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
                                                        <Input vtype="number" alue={channels[index].jitter} onChange={this.handleChannelChange(index, 'jitter')} />
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
                                <h5>FECs:</h5>
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
                                        <Label>Name</Label>
                                    </Col>
                                    <Col md="3">
                                        <Label>Multiplier</Label>
                                    </Col>
                                    <Col md="3">
                                        <Label>Divider</Label>
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
                                <h5>Traffic Classes:</h5>
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
                                    <Col md="3">
                                        <Label>Name</Label>
                                    </Col>
                                    <Col md="2">
                                        <Label>Bandwidth</Label>
                                    </Col>
                                    <Col md="2">
                                        <Label>Latency</Label>
                                    </Col>
                                    <Col md="2">
                                        <Label>Jitter</Label>
                                    </Col>
                                    <Col md="2">
                                        <Label>Drop</Label>
                                    </Col>
                                    <Col md="1" />
                                </Row>
                                <Form>
                                    {
                                        Object.keys(trafficClasses).map((index, order) => (
                                            <Row form key={index}>
                                                <Col md="3">
                                                    <FormGroup>
                                                        <Input type="text" value={trafficClasses[index].name} onChange={this.handleTrafficClassChange(index, 'name')} />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="2">
                                                    <FormGroup>
                                                        <Input type="number" value={trafficClasses[index].bandwidth} onChange={this.handleTrafficClassChange(index, 'bandwidth')} />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="2">
                                                    <FormGroup>
                                                        <Input type="number" value={trafficClasses[index].latencyCost} onChange={this.handleTrafficClassChange(index, 'latencyCost')} />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="2">
                                                    <FormGroup>
                                                        <Input type="number" value={trafficClasses[index].jitterCost} onChange={this.handleTrafficClassChange(index, 'jitterCost')} />
                                                    </FormGroup>
                                                </Col>
                                                <Col md="2">
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
                        <h5>Simulation:</h5>
                    </CardHeader>
                    <CardBody>
                        <Row>
                            <Col md="4">
                                <FormGroup>
                                    <Label>Try Chunk Size</Label>
                                    <Input type="number" value={tryChunk} onChange={this.handleTryChunkChange} />
                                </FormGroup>
                            </Col>
                            <Col md="2">
                                <Button color="primary" onClick={this.handleSimulateClick}>
                                    Simulate
                                </Button>
                            </Col>
                        </Row>
                        <Row>
                            <Col md="12">
                                <Label>Request:</Label>
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
                                                <Input style={{ fontFamily: 'monospace', wordBreak: 'keep-all' }} type="textarea" value={JSON.stringify(lastRequest)} readOnly />
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId="tree">
                                        <Row>
                                            <Col md="12">
                                                <JSONTree data={lastRequest} theme={theme} invertTheme />
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
                                                <Input style={{ fontFamily: 'monospace', wordBreak: 'keep-all' }} type="textarea" value={JSON.stringify(lastResponse)} readOnly />
                                            </Col>
                                        </Row>
                                    </TabPane>
                                    <TabPane tabId="tree">
                                        <Row>
                                            <Col md="12">
                                                <JSONTree data={lastResponse} theme={theme} invertTheme />
                                            </Col>
                                        </Row>
                                    </TabPane>
                                </TabContent>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        );
    }
}

export default withRouter(ConfigurationEditor);
