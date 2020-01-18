import React from 'react';
import { Row, Col, Progress } from 'reactstrap';
import PropTypes from "prop-types";
import ReactEcharts from 'echarts-for-react';

const SmallGraph = (props) => (
  <div>
       <ReactEcharts option={props.data} style={{height:"80px"}}/>
  </div>
);

SmallGraph.propTypes = {
    data:PropTypes.array
}
SmallGraph.defaultProps = { 
  
    data: [0,0,0,0,0,0,0,0]
} 

export default SmallGraph;