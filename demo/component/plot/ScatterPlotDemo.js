import React, {Component} from 'react';
import {ScatterPlot} from 'recharts';
// import {changeNumberOfData} from './utils';

import {numNumArrObjArr4Area} from "../../data/SamplePlotData";

export default class ScatterPlotDemo extends Component {

  static displayName = 'ScatterPlotDemo';

  render() {

    var tooltipScatter = function (x, y) {
      return "x: " + x + " y: " + y;
    };

    const data = numNumArrObjArr4Area;

    return (
      <div>
        <p>Simple Scatter Plot</p>
        <ScatterPlot
          data={data}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltipScatter}
          xAxis={{innerTickSize: 6, label: "x-label"}}
          yAxis={{label: "y-label"}}
        />
      </div>
    );
  }
}

