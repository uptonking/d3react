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
import withAccessor from '../common/hocWithAccessor';
import withScales from '../common/hocWithScales';
import withTooltip from '../common/hocWithTooltip';

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

class ScatterPlot extends React.Component {

  static defaultProps = {
    rScale: null,
    shape: 'circle',
  };

  static propTypes = {
    rScale: func,
    shape: string,
  };

  //======== private method start =========

  _tooltipHtml(d) {
    const html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));

    const xPos = this.props._xScale(this.props.x(d));
    const yPos = this.props._yScale(this.props.y(d));

    return [html, xPos, yPos];
  }

  //======== private method end =========

  render() {
    // console.log('====props ScatterPlot');
    // console.log(this.props);

    const {
      height,
      width,
      margin,
      viewBox,
      preserveAspectRatio,
      colorScale,
      rScale,
      shape,
      label,
      values,
      x,
      y,
      xAxis,
      yAxis,
    } = this.props;


    const {
      _data: data,
      _innerWidth: innerWidth,
      _innerHeight: innerHeight,
      _xScale: xScale,
      _yScale: yScale,
      _xIntercept: xIntercept,
      _yIntercept: yIntercept,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
    } = this.props;

    let symbol = d3.svg.symbol().type(shape);

    if (rScale) {
      symbol = symbol.size(rScale);
    }

    return (
      <div>
        <Plot height={height} width={width} margin={margin} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio}>
          <Axis
            className="x axis"
            orientation="bottom"
            scale={xScale}
            height={innerHeight}
            width={innerWidth}
            zero={yIntercept}
            {...xAxis}
          />
          <Axis
            className="y axis"
            orientation="left"
            scale={yScale}
            height={innerHeight}
            width={innerWidth}
            zero={xIntercept}
            {...yAxis}
          />
          <DataSet
            data={data}
            xScale={xScale}
            yScale={yScale}
            colorScale={colorScale}
            symbol={symbol}
            label={label}
            values={values}
            x={x}
            y={y}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
          />
          {this.props.children}
        </Plot>
        <Tooltip {...this.props.tooltip}/>
      </div>
    );
  }

}


// export default ScatterPlot;
export default withDefaultProps(withCalSize(withArrayify(withAccessor(withScales(withTooltip(ScatterPlot))))));
