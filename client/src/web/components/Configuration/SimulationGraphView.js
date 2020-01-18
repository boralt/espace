import React from 'react';
import PropTypes from 'prop-types';
import { Chart } from 'react-charts';
import ReactEcharts from 'echarts-for-react';
import ChannelDistributionGraph from '../Pages/channel-demo';
import {
  Row,
  Col,
  Label,
  Input,
  FormGroup,
} from 'reactstrap';

class SimulationGraphView extends React.Component {
  static getDerivedStateFromProps(props, state) {
    let initialState = {
      trafficClasses: {},
      channels: {},
      fecs: {},
      mapPerSim: [],
      completedSimulations: null,
      // TODO: Follwing line should be replaced with something elegent.
      // Because there is a chance for no TCs to exist in the first run
      selectedTc: '',
      selectedSim: '',
      sessionId: '',
    };

    const { simulations } = props;

    console.info(state);
    console.info(simulations);

    if (
      state !== null
      && simulations.length > 0
      && state.sessionId === simulations[0].sessionId
    ) {
      initialState = {
        ...initialState,
        ...state,
      };
    }

    const {
      trafficClasses,
      channels,
      fecs,
      mapPerSim,
      selectedTc,
      selectedSim,
    } = initialState;

    let { completedSimulations } = initialState;


    const currentSimulationCount = mapPerSim.length;
    const newCompletedSims = 0;

    // Recalculate the number of completed sims.
    for (let i = 0; i < simulations.length; i++) {
      if (simulations.status === 'COMPLETED') {
        newCompletedSims++;
      }
    }

    console.info('New sims ' + newCompletedSims);

    if (simulations.length > currentSimulationCount) {
      const tcMapping = {};
      const channelMapping = {};
      const fecMapping = {};
      const rTcMapping = {};
      const rChannelMapping = {};

      for (let i = currentSimulationCount; i < props.simulations.length; i++) {
        const sim = props.simulations[i];

        for (let j = 0; j < sim.request.traffic_classes.length; j++) {
          trafficClasses[sim.request.traffic_classes[j].id] = {
            id: sim.request.traffic_classes[j].id,
            name: sim.request.traffic_classes[j].name,
          };

          tcMapping[sim.request.traffic_classes[j].id] = j;
          rTcMapping[j] = sim.request.traffic_classes[j].id;
        }

        for (let j = 1; j < sim.request.channels.length; j++) {
          channels[sim.request.channels[j].id] = {
            id: sim.request.channels[j].id,
            name: sim.request.channels[j].name,
          };

          channelMapping[sim.request.channels[j].id] = j;
          rChannelMapping[j] = [sim.request.channels[j].id];
        }

        for (let j = 0; j < sim.request.fec.length; j++) {
          fecs[sim.request.fec[j].id] = {
            id: sim.request.fec[j].id,
            name: sim.request.fec[j].name,
          };

          fecMapping[j] = sim.request.fec[j].id;
        }

        mapPerSim.push({
          trafficClasses: tcMapping,
          channels: channelMapping,
          reverseTc: rTcMapping,
          reverseChannel: rChannelMapping,
          fecs: fecMapping,
        });
      }
    } else if (newCompletedSims === completedSimulations && completedSimulations !== null) {
      return null;
    } else {
      completedSimulations = newCompletedSims;
    }

    // Map the allocations for each TC
    return {
      trafficClasses,
      channels,
      fecs,
      mapPerSim,
      selectedTc,
      selectedSim,
      sessionId: simulations.length > 0 ? simulations[0].sessionId : '',
      plotData: SimulationGraphView.generatePlotData({
        simulations,
        mapPerSim,
        channels,
        fecs,
      }, selectedTc),
      sankeyGraphData: SimulationGraphView.generateSankeyData({
        simulations,
        mapPerSim,
        channels,
        trafficClasses,
        fecs,
      }, selectedSim),
      completedSimulations,
    };
  }

  static generatePlotData = (state, tc) => {
    const { simulations, mapPerSim, channels, fecs } = state;
    console.info(fecs);
    const data = [];

    if (!tc) {
      return data;
    }

    Object.keys(channels).forEach((chId) => {
      const datums = [];
      for (let i = 0; i < simulations.length; i++) {
        if (simulations[i].status !== 'COMPLETED') {
          continue;
        }

        const simMap = mapPerSim[i];

        let fec = '';
        let bw = 0;

        if (typeof (simMap.trafficClasses[tc]) === 'undefined') {
          // This traffic class was not in this sim. So 0 for all.
          datums.push({
            r: fec,
            x: i + 1,
            y: 0,
          });
        } else {
          // Get the allocation for the TC for current channel.
          if (typeof (simMap.channels[chId]) === 'undefined') {
            // This channel did not exist in this sim. So set zero.
            datums.push({
              r: fec,
              x: i + 1,
              y: 0,
            });
          } else {
            if (simulations[i].response.values) {
              simulations[i]
                .response
                .values[simMap.trafficClasses[tc]]
                .values[simMap.channels[chId]]
                .chan_per_fec_bw
                .forEach((value, index) => {
                  const intVal = parseInt(value, 10);
                  if (intVal > 0) {
                    fec = simMap.fecs[index] ? fecs[simMap.fecs[index]].name : '';
                  }
                  bw += intVal;
                });
              datums.push({
                r: fec,
                x: i + 1,
                y: bw,
              });
            } else {
              datums.push({
                r: fec,
                x: i + 1,
                y: 0,
              });
            }
          }
        }
      }

      data.push({
        datums,
        label: channels[chId].name,
      });
    });

    return data;
  }

  static generateSankeyData = (state, simulationIndex) => {
    const sankeyData = {};

    const fecIds = {};
    const {
      channels,
      trafficClasses,
      fecs,
      mapPerSim,
    } = state;

    const { simulations } = state;

    if (simulations[simulationIndex]) {
      const sim = simulations[simulationIndex];
      const simMap = mapPerSim[simulationIndex];
      if (sim.status === 'COMPLETED' && sim.response.values) {
        Object.keys(channels).forEach((id) => {
          sankeyData[id] = {
            nodes: [{ name: channels[id].name }],
            links: [],
          };
          fecIds[id] = [];
        });
        // Iterate through the traffic class allocations. Identify channel and FEC
        for (let i = 0; i < sim.response.values.length; i++) {
          const tcName = trafficClasses[simMap.reverseTc[i]].name;
          // Identiy the channels and FEC.
          for (let j = 1; j < sim.response.values[i].values.length; j++) {
            let tcPushed = false;
            const fecAlloc = sim.response.values[i].values[j].chan_per_fec_bw;
            for (let k = 0; k < fecAlloc.length; k++) {
              const alloc = parseInt(fecAlloc[k], 10);
              if (alloc > 0) {
                // There is an allocation within this channel for this fEC
                const chId = simMap.reverseChannel[j];
                const fecId = simMap.fecs[k];
                // Add traffic class as a node.
                if (!tcPushed) {
                  sankeyData[chId].nodes.push({
                    name: tcName,
                  });
                  tcPushed = true;
                }

                // Add a link from channel to traffic class
                sankeyData[chId].links.push({
                  source: channels[chId].name,
                  target: tcName,
                  value: alloc,
                });

                // Add a link from traffic class to fec
                sankeyData[chId].links.push({
                  source: tcName,
                  target: fecs[fecId].name,
                  value: alloc,
                });

                // Add this FEC to the list if its not there already.
                if (fecIds[chId].indexOf(fecId) < 0) {
                  fecIds[chId].push(fecId);
                }
              }
            }
          }
        }
        // Add the FEC nodes of each channel.
        Object.keys(fecIds).forEach((chId) => {
          fecIds[chId].forEach((fecId) => {
            sankeyData[chId].nodes.push({
              name: fecs[fecId].name,
            });
          });
        });
      }
    }

    return sankeyData;
  }

  static propTypes = {
    simulations: PropTypes.arrayOf(PropTypes.shape({
      requestId: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      request: PropTypes.shape().isRequired,
      response: PropTypes.shape().isRequired,
      status: PropTypes.string.isRequired,
    })).isRequired,
  }

  static defaultProps = {
    error: null,
    success: null,
  }

  constructor(props) {
    super(props);
    this.state = {
      ...SimulationGraphView.getDerivedStateFromProps(props, null),
    };
  }

  handleTrafficClassChange = (e) => {
    const { mapPerSim, channels, fecs } = this.state;
    const { simulations } = this.props;
    const tc = e.target.value;
    const plotData = SimulationGraphView.generatePlotData({
      simulations,
      mapPerSim,
      channels,
      fecs,
    }, tc);

    this.setState({
      selectedTc: tc,
      plotData,
    });
  }

  handleSimulationChange = (e) => {
    console.log(e);
    const value = parseInt(e,10);
    const { mapPerSim, channels, fecs, trafficClasses } = this.state;
    const { simulations } = this.props;
    const sankeyGraphData = SimulationGraphView.generateSankeyData({
      mapPerSim,
      trafficClasses,
      channels,
      fecs,
      simulations,
    }, value);
    console.info(sankeyGraphData);

    this.setState({
      selectedSim: value,
      sankeyGraphData,
    });
  }

  render() {
    const { trafficClasses, plotData, selectedTc, selectedSim, sankeyGraphData, channels, sessionId, fecs } = this.state;
    const { simulations } = this.props;
    const series = {
      type: 'bar',
    };
    const axes = [
      { type: 'linear', position: 'left', stacked: true },
      { position: 'bottom', type: 'ordinal', primary: true },
    ];
    return (
      <div style={{ padding: '20px' }}>
        <ChannelDistributionGraph
          channels={channels} sessionId={sessionId} data={this.props.simulations}
          trafficClasses={trafficClasses} fecs={fecs} simChange={this.handleSimulationChange}
        />
        {
          /*<Row>
                    <Col sm="4">
                        <FormGroup>
                            <Label>Traffic Class</Label>
                            <Input type="select" value={selectedTc} onChange={this.handleTrafficClassChange}>
                                <option value="">Select a Traffic Class</option>
                                {Object.keys(trafficClasses).map(index => (
                                    <option
                                        key={trafficClasses[index].id}
                                        value={trafficClasses[index].id}
                                    >
                                        {trafficClasses[index].name}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm="12">
                        <div style={{ width:'100%', height: '800px' }}>
                            <Chart data={plotData} series={series} axes={axes} tooltip />
                        </div>
                    </Col>
                </Row>*/}
        <Row>
          <Col sm="4">
            <FormGroup>
              <Label>Simulations</Label>
              <div>{simulations[selectedSim] && simulations[selectedSim].name}</div>
              </FormGroup>
          </Col>
        </Row>
        <Row>
          {
            Object.keys(sankeyGraphData).map((chId) => {
              console.info(sankeyGraphData[chId]);
              const channel = channels[chId];
              const options = {
                title: {
                  text: `Channel Distribution - ${channel.name}`,
                },
                tooltip: {
                  trigger: 'item',
                  triggerOn: 'mousemove',
                },
                series: [
                  {
                    top: 50,
                    left: 0,
                    right: 150,
                    type: 'sankey',
                    data: sankeyGraphData[chId].nodes,
                    links: sankeyGraphData[chId].links,
                    focusNodeAdjacency: false,
                    itemStyle: {
                      borderWidth: 1,
                      borderColor: '#aaa',
                    },
                    lineStyle: {
                      color: 'source',
                      curveness: 0.5,
                    },
                  },
                ],
              };

              return (
                <Col key={chId} lg="6" md="12" sm="12">
                  <ReactEcharts option={options} style={{ height: '350px' }} />
                </Col>
              );
            })
          }
        </Row>
      </div>
    );
  }
}

export default SimulationGraphView;
