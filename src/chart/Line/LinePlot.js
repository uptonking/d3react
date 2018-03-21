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

class LinePlot extends React.Component {

  static defaultProps = {
    interpolate: 'linear',
    defined: () => true,
    shape: 'circle',
    shapeColor: null,
    showCustomLine: false,
    lineStructureClassName: "dot",
    customPointColor: "blue",
    customPointShape: "circle",
  };

  static propTypes = {
    interpolate: string,
    defined: func,
  };

  //======== private method start =========

  _tooltipHtml(data, position) {
    const {x, y, values, label} = this.props;
    const xScale = this.props._xScale;
    const yScale = this.props._yScale;

    const xValueCursor = xScale.invert(position[0]);
    const yValueCursor = yScale.invert(position[1]);

    const xBisector = d3.bisector(e => x(e)).left;
    const valuesAtX = data.map(stack => {
      const idx = xBisector(values(stack), xValueCursor);

      const indexRight = idx === values(stack).length ? idx - 1 : idx;
      const valueRight = x(values(stack)[indexRight]);

      const indexLeft = idx === 0 ? idx : idx - 1;
      const valueLeft = x(values(stack)[indexLeft]);

      let index;
      if (Math.abs(xValueCursor - valueRight) < Math.abs(xValueCursor - valueLeft)) {
        index = indexRight;
      } else {
        index = indexLeft;
      }

      return {label: label(stack), value: values(stack)[index]};
    });

    valuesAtX.sort((a, b) => y(a.value) - y(b.value));

    const yBisector = d3.bisector(e => y(e.value)).left;
    const yIndex = yBisector(valuesAtX, yValueCursor);

    const yIndexRight = yIndex === valuesAtX.length ? yIndex - 1 : yIndex;
    const yIndexLeft = yIndex === 0 ? yIndex : yIndex - 1;

    const yValueRight = y(valuesAtX[yIndexRight].value);
    const yValueLeft = y(valuesAtX[yIndexLeft].value);

    let index;
    if (Math.abs(yValueCursor - yValueRight) < Math.abs(yValueCursor - yValueLeft)) {
      index = yIndexRight;
    } else {
      index = yIndexLeft;
    }

    this._tooltipData = valuesAtX[index];

    const html = this.props.tooltipHtml(
      valuesAtX[index].label,
      valuesAtX[index].value
    );

    const xPos = xScale(valuesAtX[index].value.x);
    const yPos = yScale(valuesAtX[index].value.y);

    return [html, xPos, yPos];
  }

  //======== private method end =========

  render() {
    // console.log('====props LinePlot');
    // console.log(this.props);

    const {
      height,
      width,
      margin,
      viewBox,
      preserveAspectRatio,
      colorScale,
      interpolate,
      defined,
      stroke,
      values,
      label,
      x,
      y,
      xAxis,
      yAxis,
      shape,
      shapeColor,
      showCustomLine,
      lineStructureClassName,
      customPointColor,
      customPointShape,
    } = this.props;

    const {
      _data: data,
      _innerWidth: innerWidth,
      _innerHeight: innerHeight,
      _xScale: xScale,
      _yScale: yScale,
      _xIntercept:xIntercept,
      _yIntercept: yIntercept,
      onMouseEnter: onMouseEnter,
      onMouseLeave: onMouseLeave,
    } = this.props;


    const line = d3.svg.line()
      .x(e => xScale(x(e)))
      .y(e => yScale(y(e)))
      .interpolate(interpolate)
      .defined(defined);

    let tooltipSymbol = null, points = null;
    if (!this.props.tooltip.hidden) {
      const symbol = d3.svg.symbol().type(shape);
      const symbolColor = shapeColor ? shapeColor : colorScale(this._tooltipData.label);

      const translate = this._tooltipData ? `translate(${xScale(x(this._tooltipData.value))}, ${yScale(y(this._tooltipData.value))})` : '';
      tooltipSymbol = this.props.tooltip.hidden ? null :
        <path
          className="dot"
          d={symbol()}
          transform={translate}
          fill={symbolColor}
          onMouseEnter={evt => onMouseEnter(evt, data)}
          onMouseLeave={evt => onMouseLeave(evt)}
        />;
    }

    if (showCustomLine) {
      let translatePoints = function (point) {
        return `translate(${xScale(x(point))}, ${yScale(y(point))})`;
      };

      points = data.map((d, dataIndex) =>
        d.values.map((p, i) => (
          <path
            key={i}
            className={lineStructureClassName}
            d={d3.svg.symbol().type(customPointShape)()}
            transform={translatePoints(p)}
            fill={customPointColor}
            onMouseEnter={evt => onMouseEnter(evt, data)}
            onMouseLeave={evt => onMouseLeave(evt)}
          />
        )));
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
            height={innerHeight}
            width={innerWidth}
            data={data}
            line={line}
            colorScale={colorScale}
            values={values}
            label={label}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            {...stroke}
          />
          {this.props.children}
          {tooltipSymbol}
          {points}
        </Plot>
        <Tooltip {...this.props.tooltip} />
      </div>
    );
  }

}


export default withDefaultProps(withCalSize(withArrayify(withAccessor(withScales(withTooltip(LinePlot))))));
