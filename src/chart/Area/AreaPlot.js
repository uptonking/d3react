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

class AreaPlot extends React.Component {

  static defaultProps = {
    interpolate: 'linear',
    stroke: d3.scale.category20(),

  };

  static propTypes = {
    interpolate: string,
    stroke: func,

  };

  //======== private method start =========

  _tooltipHtml(d, position) {
    const {x, y0, y, values, _xScale: xScale, _yScale: yScale} = this.props;

    const xValueCursor = xScale.invert(position[0]);

    const xBisector = d3.bisector(e => x(e)).right;
    let xIndex = xBisector(values(d[0]), xScale.invert(position[0]));
    xIndex = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;

    const xIndexRight = xIndex == values(d[0]).length ? xIndex - 1 : xIndex;
    const xValueRight = x(values(d[0])[xIndexRight]);

    const xIndexLeft = xIndex == 0 ? xIndex : xIndex - 1;
    const xValueLeft = x(values(d[0])[xIndexLeft]);

    if (Math.abs(xValueCursor - xValueRight) < Math.abs(xValueCursor - xValueLeft)) {
      xIndex = xIndexRight;
    } else {
      xIndex = xIndexLeft;
    }

    const yValueCursor = yScale.invert(position[1]);

    const yBisector = d3.bisector(e => y0(values(e)[xIndex]) + y(values(e)[xIndex])).left;
    let yIndex = yBisector(d, yValueCursor);
    yIndex = yIndex == d.length ? yIndex - 1 : yIndex;

    const yValue = y(values(d[yIndex])[xIndex]);
    const yValueCumulative = y0(values(d[d.length - 1])[xIndex]) + y(values(d[d.length - 1])[xIndex]);

    const xValue = x(values(d[yIndex])[xIndex]);

    const xPos = xScale(xValue);
    const yPos = yScale(y0(values(d[yIndex])[xIndex]) + yValue);

    return [this.props.tooltipHtml(yValue, yValueCumulative, xValue), xPos, yPos];
  }

  //======== private method end =========

  render() {
    // console.log('====props AreaPlot');
    // console.log(this.props);

    const {
      height,
      width,
      margin,
      viewBox,
      preserveAspectRatio,
      colorScale,
      interpolate,
      stroke,
      values,
      label,
      x,
      y,
      y0,
      xAxis,
      yAxis,
      yOrientation,
    } = this.props;

    const {
      _data: data,
      _innerWidth: innerWidth,
      _innerHeight: innerHeight,
      _xScale: xScale,
      _yScale: yScale,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
    } = this.props;

    const line = d3.svg.line()
      .x(e => xScale(x(e)))
      .y(e => yScale(y0(e) + y(e)))
      .interpolate(interpolate);

    const area = d3.svg.area()
      .x(e => xScale(x(e)))
      .y0(e => yScale(yScale.domain()[0] + y0(e)))
      .y1(e => yScale(y0(e) + y(e)))
      .interpolate(interpolate);

    return (
      <div>
        <Plot height={height} width={width} margin={margin} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio}>
          <DataSet
            data={data}
            line={line}
            area={area}
            colorScale={colorScale}
            stroke={stroke}
            label={label}
            values={values}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          <Axis
            className="x axis"
            orientation="bottom"
            scale={xScale}
            height={innerHeight}
            width={innerWidth}
            {...xAxis}
          />
          <Axis
            className="y axis"
            orientation={yOrientation ? yOrientation : 'left'}
            scale={yScale}
            height={innerHeight}
            width={innerWidth}
            {...yAxis}
          />
          {this.props.children}
        </Plot>
        <Tooltip {...this.props.tooltip}/>
      </div>
    );
  }

}


export default withDefaultProps(withCalSize(withArrayify(withStackAccessor(withStackData(withScales(withTooltip(AreaPlot)))))));
