import React, {Component} from 'react';
import {AreaPlot} from 'recharts';
// import {changeNumberOfData} from './utils';

import {numNumArrObjArr4Area, numNumArrObjArr4AreaStacked} from "../../data/SamplePlotData";

export default class AreaPlotDemo extends Component {

  static displayName = 'AreaPlotDemo';

  render() {

    var tooltipArea = function (y, cumulative, x) {
      return "Total: " + cumulative + " X: " + x + " Y: " + y;
    }

    const data1 = numNumArrObjArr4Area;
    const data2 = numNumArrObjArr4AreaStacked;

    return (
      <div>
        <p>Simple Area Plot</p>
        <AreaPlot
          data={data1}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltipArea}
        />

        <p>Stacked Area Plot</p>
        <AreaPlot
          data={data2}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          interpolate={"basis"}
          tooltipHtml={tooltipArea}
        />

      </div>
    );
  }
}

