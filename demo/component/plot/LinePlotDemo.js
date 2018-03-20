import React, {Component} from 'react';
import {LinePlot} from 'recharts';
// import {changeNumberOfData} from './utils';

import {numNumArrObjArr4AreaStacked} from "../../data/SamplePlotData";

export default class LinePlotDemo extends Component {

  static displayName = 'LinePlotDemo';

  render() {

    const data = numNumArrObjArr4AreaStacked;

    const dashFunc = function (label) {
      if (label === "somethingA") {
        return "4 4 4";
      }
      if (label === "somethingB") {
        return "3 4 3";
      }
    }

    const widthFunc = function (label) {
      if (label === "somethingA") {
        return "4";
      }
      if (label === "somethingB") {
        return "2";
      }
    }

    const tooltipLine = function (label, data) {
      return label + " x: " + data.x + " y: " + data.y;
    }

    return (
      <div>
        <p>Simple Line Plot</p>
        <LinePlot
          data={data}
          width={400}
          height={400}
          margin={{top: 10, bottom: 50, left: 50, right: 10}}
          tooltipHtml={tooltipLine}
          tooltipContained
          xAxis={{innerTickSize: 6, label: "x-label"}}
          yAxis={{label: "y-label"}}
          shapeColor={"red"}
          stroke={{strokeDasharray: dashFunc, strokeWidth: widthFunc}}
        />
      </div>
    );
  }
}

