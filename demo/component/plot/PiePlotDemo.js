import React, {Component} from 'react';
import {PiePlot} from 'recharts';
// import {changeNumberOfData} from './utils';

import {strNumArrObj4Pie} from "../../data/SamplePlotData";

export default class PiePlotDemo extends Component {

  static displayName = 'PiePlotDemo';

  render() {

    var tooltipPie = function (x, y) {
      return y.toString();
    };

    const data = strNumArrObj4Pie;

    return (
      <div>
        <p>Simple Pie Plot</p>
        <PiePlot
          data={data}
          width={800}
          height={480}
          margin={{top: 10, bottom: 10, left: 100, right: 100}}

          tooltipMode={'fixed'}
          tooltipOffset={{top: 210, left: 280}}
          tooltipHtml={tooltipPie}
          sort={null}
        />

      </div>
    );
  }
}

