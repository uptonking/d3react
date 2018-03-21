import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';

import DataSet from './DataSet';
import Plot from '../common/Plot';
import Axis from '../Axis/Axis';
import Tooltip from '../Tooltip/Tooltip';
import withDefaultProps from '../common/hocWithDefaultProps';
import withCalSize from '../common/hocWithCalSize';
import withArrayify from '../common/hocWithArrayify';
import withStackAccessor from '../common/hocWithStackAccessor';
import withStackData from '../common/hocWithStackData';
import withScales from '../common/hocWithScales';
import withTooltip from '../common/hocWithTooltip';

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

class BarPlot extends React.Component {

  static defaultProps = {
    colorByLabel: true
  };


  //======== private method start =========


  _tooltipHtml(d) {
    const xScale = this.props._xScale;
    const yScale = this.props._yScale;

    const html = this.props.tooltipHtml(
      this.props.x(d),
      this.props.y0(d),
      this.props.y(d)
    );

    const midPoint = xScale.rangeBand() / 2;
    const xPos = midPoint + xScale(this.props.x(d));

    const topStack = this.props._data[this.props._data.length - 1].values;
    let topElement = null;

    // TODO: this might not scale if dataset is huge.
    // consider pre-computing yPos for each X
    for (let i = 0; i < topStack.length; i++) {
      if (this.props.x(topStack[i]) === this.props.x(d)) {
        topElement = topStack[i];
        break;
      }
    }
    const yPos = yScale(this.props.y0(topElement) + this.props.y(topElement));

    return [html, xPos, yPos];
  }

  //======== private method end =========

  render() {

    // console.log('====props BarPlot')
    // console.log(this.props)

    const {
      xAxis,
      yAxis,
      height,
      width,
      margin,
      viewBox,
      preserveAspectRatio,
      colorScale,
      values,
      label,
      y,
      y0,
      x,
      groupedBars,
      colorByLabel,
      tickFormat,
    } = this.props;

    const {
      _data: data,
      _innerWidth: innerWidth,
      _innerHeight: innerHeight,
      _xScale: xScale,
      _yScale: yScale,
      _yIntercept: yIntercept,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
    } = this.props;

    return (
      <div>
        <Plot height={height} width={width} margin={margin} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio}>
          <DataSet
            data={data}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            values={values}
            label={label}
            y={y}
            y0={y0}
            x={x}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            groupedBars={groupedBars}
            colorByLabel={colorByLabel}
          />
          <Axis
            className="x axis"
            orientation="bottom"
            scale={xScale}
            height={innerHeight}
            width={innerWidth}
            zero={yIntercept}
            tickFormat={tickFormat}
            {...xAxis}
          />
          <Axis
            className="y axis"
            orientation="left"
            scale={yScale}
            height={innerHeight}
            width={innerWidth}
            tickFormat={tickFormat}
            {...yAxis}
          />
          {this.props.children}
        </Plot>
        <Tooltip {...this.props.tooltip}/>
      </div>
    );
  }

}

export default withDefaultProps(withCalSize(withArrayify(withStackAccessor(withStackData(withScales(withTooltip(BarPlot)))))));

