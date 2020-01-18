/* eslint-disable indent */
import React from "react";
import ReactEcharts from "echarts-for-react";
import { Card, CardBody, Row, Col, Button } from "reactstrap";

class ChannelDistributionGraph extends React.Component {
  state = {
    channels: [],
    step: 0,
    length: 0
  }

  generateGraphData(data, length) {
    let graphData = [];
    for (let i = 0; i < data.channels.length; i++) {
      let cdata = {

      };
      let channel = data.channels[i];
      cdata.name = channel.id;
      cdata.datas = [];
      for (let j = 0; j < channel.data.length; j++) {
        let timeData = {};
        let tdata = channel.data[j];
        let legends = Object.keys(tdata);
        timeData.time = tdata[legends.shift()];
        let series = [];
        legends.forEach(legend => {
          let dt = tdata[legend];
          series.push({
            name: legend,
            type: 'bar',
            stack: 'STACK',
            label: {
              show: true,
              position: 'insideRight'
            },
            data: dt
          })
        });
        timeData.option = {
          height: "150px",
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              let html = "";
              params.forEach(element => {
                if (element.data != null) {
                  html += "<div>"
                  html += element.marker;
                  html += ("<span>" + element.seriesName + " : " + element.data + "</span>")
                  html += "</div>"
                }
              });
              return html;
            }
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '10px',
            top: 0,
            containLabel: true
          },
          xAxis: {
            type: 'value',
            max: 50000
          },
          yAxis: {
            type: 'category',
            data: channel.fec.map(f => f.name)
          },
          series: series

        };
        cdata.datas.push(timeData);
      }
      graphData.push(cdata);
    }
    console.log("graphdata", graphData);
    console.log(length);
    this.setState({ channels: graphData, length: length });
  }

  componentDidUpdate(prevProps) {
    let sessionData = [];
    let sLength = 0;
    if (this.props.data.length > 0) {
      this.props.data.map(d => {
        if (d.status == "COMPLETED")
          sLength++;
      })
    }
    console.log("length", sLength, this.state.length);
    if (this.props.sessionId !== "" && (prevProps.sessionId != this.props.sessionId ||
      this.state.length != sLength)) {

      sessionData = this.props.data.filter((sim) => {
        return sim.sessionId === this.props.sessionId && sim.status == "COMPLETED";
      })

      let data = {
        channels: Object.values(this.props.channels)
      };
      let trafficClasses = Object.values(this.props.trafficClasses);
      for (let i = 0; i < data.channels.length; i++) {
        let channel = data.channels[i];
        channel.fec = Object.values(this.props.fecs);
        channel.data = [];
        sessionData.map(sData => {
          let tdata = {
            name: sData.name,
            time: sData.request.start_ts,
          };
          trafficClasses.map((tClass, index) => {
            let dt = Object.values(sData.response.values[index].values[i + 1])[0];
            let newdt = dt.map(v => {
              if (v == 0) {
                return null
              } else {
                return v;
              }
            });
            tdata[tClass.name] = newdt;
          })
          channel.data.push(tdata)
        })
      }
      this.generateGraphData(data, sessionData.length);
    }
  }

  incrementStep = () => {
    if (this.state.step < this.state.channels[0].datas.length - 2) {
      this.setState({
        step: this.state.step + 1
      })
    }
  }

  decrementStep = () => {
    if (this.state.step > 0) {
      this.setState({
        step: this.state.step - 1
      })
    }
  }

  render() {

    return (<div>
      <Card>
        <CardBody>
          {this.state.channels[0] && this.state.channels[0].datas &&
            <Row className="no-gutters">
              <Col md="2">
                Channels
                        </Col>
              <Col md="5" className="text-center">
                {
                  // new Date(this.state.channels[0].datas[this.state.step].time).toLocaleString()
                  <div onClick={this.props.simChange.bind(this, this.state.step)}>
                    {this.state.channels[0].datas[this.state.step].time}
                  </div>
                }
              </Col>
              {this.state.channels[0].datas.length > 1 && <Col md="5" className="text-center">
                {
                  // new Date(this.state.channels[0].datas[this.state.step + 1].time).toLocaleString()
                  this.state.channels[0].datas[this.state.step + 1].time
                }
              </Col>}
            </Row>}
          {this.state.channels.map((data, index) => {
            return (
              <Row className="no-gutters align-items-center" key={index}>
                <Col md="2">
                  {data.name}
                </Col>
                <Col md="5">
                  <ReactEcharts option={data.datas[this.state.step].option} style={{ height: "170px" }}></ReactEcharts>
                </Col>
                <Col md="5">
                  {this.state.channels[0].datas.length > 1 &&
                    <ReactEcharts option={data.datas[this.state.step + 1].option} style={{ height: "170px" }}></ReactEcharts>
                  }
                </Col>
              </Row>
            )
          })}
          {this.state.channels.length > 0 && this.state.channels[0].datas.length > 1 &&
            <div>
              <Button onClick={this.decrementStep}>Previous</Button>
              <Button onClick={this.incrementStep}>Next</Button>
            </div>
          }
        </CardBody>
      </Card>
    </div>)
  }
}

export default ChannelDistributionGraph;
