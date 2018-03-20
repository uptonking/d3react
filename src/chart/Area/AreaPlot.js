import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import d3 from 'd3';

import Plot from '../common/Plot';
import Axis from '../Axis/Axis';
import Tooltip from '../Tooltip/Tooltip';

import DataSet from './DataSet';

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

class AreaPlot extends React.Component {

  constructor() {
    super();
    this.state = {
      tooltip: {
        hidden: true
      }
    };
  }

  componentWillMount() {
    // console.log('====LinePlot componentWillMount')
    // console.log(this.props)

    this._calculateInner(this.props);

    this._arrayify(this.props);

    this._stackData(this.props);

    this._makeScales(this.props);
  }

  componentDidMount() {

    //==
    this._svgNode = ReactDOM.findDOMNode(this).getElementsByTagName('svg')[0];

  }

  componentWillReceiveProps(nextProps) {
    this._calculateInner(nextProps);

    this._stackData(nextProps);

    this._makeScales(nextProps);
  }


  onMouseEnter = (e, data) => {
    // console.log('====onMouseEnter ')
    // console.log(this.props);

    if (!this.props.tooltipHtml) {
      console.log('====onMouseEnter tooltipHtml为空')
      return;
    }

    e.preventDefault();

    const {
      margin,
      tooltipMode,
      tooltipOffset,
      tooltipContained
    } = this.props;

    const svg = this._svgNode;
    let position;

    if (svg.createSVGPoint) {
      let point = svg.createSVGPoint();
      //clientX事件属性返回当事件被触发时鼠标指针向对于浏览器页面（或客户区）的水平坐标。
      point.x = e.clientX;
      point.y = e.clientY;
      // console.log('====point')
      // console.log(point)
      point = point.matrixTransform(svg.getScreenCTM().inverse());
      // console.log(point)
      position = [point.x - margin.left, point.y - margin.top];

    } else {
      const rect = svg.getBoundingClientRect();
      position = [e.clientX - rect.left - svg.clientLeft - margin.left,
        e.clientY - rect.top - svg.clientTop - margin.top];
    }

    const [html, xPos, yPos] = this._tooltipHtml(data, position);

    const svgTop = svg.getBoundingClientRect().top + margin.top;
    const svgLeft = svg.getBoundingClientRect().left + margin.left;

    let top = 0;
    let left = 0;

    if (tooltipMode === 'fixed') {
      // console.log('====tooltipMode fixed')

      top = svgTop + tooltipOffset.top;
      left = svgLeft + tooltipOffset.left;
    } else if (tooltipMode === 'element') {
      // console.log('====tooltipMode element')

      top = svgTop + yPos + tooltipOffset.top;
      left = svgLeft + xPos + tooltipOffset.left;
    } else { // mouse
      // console.log('====tooltipMode mouse')
      top = e.clientY + tooltipOffset.top;
      left = e.clientX + tooltipOffset.left;
    }

    //线性插值函数
    function lerp(t, a, b) {
      return (1 - t) * a + t * b;
    }

    let translate;

    if (tooltipContained) {
      const t = position[0] / svg.getBoundingClientRect().width;
      translate = lerp(t, 0, 100);
    }

    this.setState({
      tooltip: {
        top,
        left,
        hidden: false,
        html,
        translate
      }
    });
  }

  onMouseLeave = (e) => {
    // console.log('====onMouseEnter ')

    if (!this.props.tooltipHtml) {
      console.log('====onMouseLeave tooltipHtml为空')
      return;
    }

    e.preventDefault();

    this.setState({
      tooltip: {
        hidden: true
      }
    });
  }

  //======== private method start =========

  _makeScales(props) {
    // console.log('====LinePlot _makeScales')
    // console.log(props)
    const {xScale, xIntercept, yScale, yIntercept} = props;

    if (!xScale) {
      [this._xScale, this._xIntercept] = this._makeXScale(props);
    } else {
      [this._xScale, this._xIntercept] = [xScale, xIntercept];
    }

    if (!yScale) {
      [this._yScale, this._yIntercept] = this._makeYScale(props);
    } else {
      [this._yScale, this._yIntercept] = [yScale, yIntercept];
    }
  }

  _makeXScale(props) {
    // console.log('====LinePlot _makeXScale')
    // console.log(props)

    const {x, values} = props;
    const data = this._data;

    if (typeof x(values(data[0])[0]) === 'number') {
      return this._makeLinearXScale(props);
    } else if (typeof x(values(data[0])[0]).getMonth === 'function') {
      return this._makeTimeXScale(props);
    } else {
      return this._makeOrdinalXScale(props);
    }
  }

  _makeLinearXScale(props) {
    const {x, values} = props;
    const data = this._data;

    const extentsData = data.map(stack => values(stack).map(e => x(e)));
    const extents = d3.extent(Array.prototype.concat.apply([], extentsData));

    const scale = d3.scale.linear()
      .domain(extents)
      .range([0, this._innerWidth]);

    const zero = d3.max([0, scale.domain()[0]]);
    const xIntercept = scale(zero);

    return [scale, xIntercept];
  }

  _makeOrdinalXScale(props) {
    const {x, values, barPadding} = props;

    const scale = d3.scale.ordinal()
      .domain(values(this._data[0]).map(e => x(e)))
      .rangeRoundBands([0, this._innerWidth], barPadding);

    return [scale, 0];
  }

  _makeTimeXScale(props) {
    const {x, values} = props;

    const minDate = d3.min(values(this._data[0]), x);
    const maxDate = d3.max(values(this._data[0]), x);

    const scale = d3.time.scale()
      .domain([minDate, maxDate])
      .range([0, this._innerWidth]);

    return [scale, 0];
  }

  _makeYScale(props) {
    // console.log('====LinePlot _makeYScale')
    // console.log(props)

    const {y, values} = props;
    const data = this._data;

    if (typeof y(values(data[0])[0]) === 'number') {
      return this._makeLinearYScale(props);
    } else {
      return this._makeOrdinalYScale(props);
    }
  }

  _makeLinearYScale(props) {
    const {y, y0, values, groupedBars} = props;

    const extentsData = this._data.map(stack => values(stack).map(e => groupedBars ? y(e) : y0(e) + y(e)));
    let extents = d3.extent(Array.prototype.concat.apply([], extentsData));

    extents = [d3.min([0, extents[0]]), extents[1]];

    const scale = d3.scale.linear()
      .domain(extents)
      .range([this._innerHeight, 0]);

    const zero = d3.max([0, scale.domain()[0]]);
    const yIntercept = scale(zero);

    return [scale, yIntercept];
  }

  _makeOrdinalYScale() {
    const scale = d3.scale.ordinal()
      .range([this._innerHeight, 0]);

    const yIntercept = scale(0);

    return [scale, yIntercept];
  }

  _tooltipHtml(d, position) {
    const {x, y0, y, values} = this.props;
    const xScale = this._xScale;
    const yScale = this._yScale;

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

  _arrayify(props) {
    if (props.data === null) {
      this._data = [{
        label: 'No data available',
        values: [{x: 'No data available', y: 1}]
      }];
    } else if (!Array.isArray(props.data)) {
      this._data = [props.data];
    } else {
      this._data = props.data;
    }
  }

  _calculateInner(props) {
    const {height, width, margin} = props;

    this._innerHeight = height - margin.top - margin.bottom;
    this._innerWidth = width - margin.left - margin.right;
  }

  _stackData(props) {
    const {offset, order, x, y, values} = props;

    const stack = d3.layout.stack()
      .offset(offset)
      .order(order)
      .x(x)
      .y(y)
      .values(values);

    this._data = stack(this._data);

    for (let m = 0; m < values(this._data[0]).length; m++) {
      let positiveBase = 0;
      let negativeBase = 0;
      for (let n = 0; n < this._data.length; n++) {
        let value = y(values(this._data[n])[m]);
        if (value < 0) {
          values(this._data[n])[m].y0 = negativeBase;
          negativeBase += value;
        } else {
          values(this._data[n])[m].y0 = positiveBase;
          positiveBase += value;
        }
      }
    }
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
      yOrientation
    } = this.props;

    const data = this._data;
    const innerWidth = this._innerWidth;
    const innerHeight = this._innerHeight;
    const xScale = this._xScale;
    const yScale = this._yScale;

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
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
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
        <Tooltip {...this.state.tooltip}/>
      </div>
    );
  }

}

AreaPlot.defaultProps = {

  //== defaultProps
  data: {label: 'No data available', values: [{x: 'No data available', y: 1}]},
  margin: {top: 0, bottom: 0, left: 0, right: 0},
  xScale: null,
  yScale: null,
  colorScale: d3.scale.category20(),
  //== stack accessor
  label: stack => stack.label,
  values: stack => stack.values,
  x: e => e.x,
  y: e => e.y,
  y0: e => e.y0,
  //== stack data
  offset: 'zero',
  order: 'default',
  //== tooltip
  tooltipMode: 'mouse',
  tooltipOffset: {top: 0, left: 0},
  tooltipHtml: null,
  tooltipContained: false,
  //== scale
  barPadding: 0.5,

  // ====
  interpolate: 'linear',
  stroke: d3.scale.category20()
};

AreaPlot.propTypes = {
  data: oneOfType([object, array]).isRequired,
  height: number.isRequired,
  width: number.isRequired,
  margin: shape({
    top: number,
    bottom: number,
    left: number,
    right: number
  }),
  xScale: func,
  yScale: func,
  colorScale: func,
  //==
  label: func,
  values: func,
  x: func,
  y: func,
  y0: func,
  //==
  offset: string,
  //==
  tooltipHtml: func,
  tooltipMode: oneOf(['mouse', 'element', 'fixed']),
  tooltipContained: bool,
  tooltipOffset: objectOf(number),
  //==
  barPadding: number,

  // ====
  interpolate: string,
  stroke: func
};

export default AreaPlot;
