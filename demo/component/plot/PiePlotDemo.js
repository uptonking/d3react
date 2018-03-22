import React, {Component} from 'react';
import {PiePlot, PiePlotr} from 'recharts';
// import {changeNumberOfData} from './utils';

import {strNumArrObj4Pie} from "../../data/SamplePlotData";

export default class PiePlotDemo extends Component {

  static displayName = 'PiePlotDemo';

  render() {

    var tooltipPie = function (x, y) {
      return y.toString();
    };

    const data = strNumArrObj4Pie;

    const styleChartWrapper = {
      height: 640,
      width: 640,
      padding: 10,
    }

    return (
      <div>
        <h2>Simple Pie Plot</h2>
        <div>
          <PiePlot
            data={data}
            width={480}
            height={480}
            margin={{top: 10, bottom: 10, left: 10, right: 10}}

            tooltipMode={'fixed'}
            tooltipOffset={{top: 110, left: 140}}
            tooltipHtml={tooltipPie}
            sort={null}
          />
        </div>

        <h2>Simple Pie Plot Responsive</h2>

        {/*<div style={styleChartWrapper}>*/}
        <div>
          <PiePlotr
            data={data}
            width={480}
            height={480}
            margin={{top: 10, bottom: 10, left: 10, right: 10}}
            tooltipMode={'fixed'}
            tooltipOffset={{top: 110, left: 140}}
            tooltipHtml={tooltipPie}
            sort={null}
          />
        </div>

      </div>
    );
  }
}

