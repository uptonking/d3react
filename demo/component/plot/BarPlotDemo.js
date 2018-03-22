import React, {Component} from 'react';
import {BarPlot, BarPlotr} from 'recharts';
// import {changeNumberOfData} from './utils';

import {strNumArrObj4Pie, strNumArrObjArr4Bar} from "../../data/SamplePlotData";

export default class BarPlotDemo extends Component {

  static displayName = 'BarPlotDemo';

  render() {

    const tooltip = function (x, y0, y, total) {
      return y.toString();
    }

    // ==== option for plot1 - simple bar
    const data1 = strNumArrObj4Pie;

    // ==== option for plot2,3 - grouped ,stacked bar
    const data2 = strNumArrObjArr4Bar;

    return (
      <div>
        <p>Simple Bar Plot</p>
        <BarPlot
          data={data1}
          width={800}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltip}
          colorByLabel={false}
        />

        <p>Simple Bar Plot Responsive</p>
        <BarPlotr
          data={data1}
          width={800}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltip}
          colorByLabel={false}
        />

        <p>Grouped Bar Plot</p>
        <BarPlot
          data={data2}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltip}
          tooltipMode={'mouse'}
          groupedBars
        />

        <p>Stacked Bar Plot</p>
        <BarPlot
          data={data2}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltip}
          tooltipMode={'element'}
        />

      </div>
    );
  }
}

