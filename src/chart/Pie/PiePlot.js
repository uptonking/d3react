import React from 'react';
import PropTypes from 'prop-types';
import d3 from 'd3';

import DataSet from './DataSet';
import Plot from '../common/Plot';
import Tooltip from '../Tooltip/Tooltip';
import withDefaultProps from '../common/hocWithDefaultProps';
import withCalSize from '../common/hocWithCalSize';
import withAccessor from '../common/hocWithAccessor';
import withTooltip from '../common/hocWithTooltip';

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

class PiePlot extends React.Component {

  static defaultProps = {
    innerRadius: null,
    outerRadius: null,
    labelRadius: null,
    padRadius: 'auto',
    cornerRadius: 0,
    sort: undefined,
    hideLabels: true,
  };

  static propTypes = {
    innerRadius: number,
    outerRadius: number,
    labelRadius: number,
    padRadius: string,
    cornerRadius: number,
    sort: any,
    hideLabels: bool,
  };

  //======== private method start =========

  _tooltipHtml(d) {
    const html = this.props.tooltipHtml(this.props.x(d), this.props.y(d));
    return [html, 0, 0];
  }

  //======== private method end =========

  render() {

    // console.log('====props PiePlot');
    // console.log(this.props);

    const {
      data,
      width,
      height,
      margin,
      viewBox,
      preserveAspectRatio,
      colorScale,
      padRadius,
      cornerRadius,
      sort,
      x,
      y,
      values,
      hideLabels,
    } = this.props;

    let {
      innerRadius,
      outerRadius,
      labelRadius,
      _innerWidth: innerWidth,
      _innerHeight: innerHeight,
      onMouseEnter,
      onMouseLeave,
    } = this.props;


    let pie = d3.layout.pie()
      .value(e => y(e));


    if (typeof sort !== 'undefined') {
      pie = pie.sort(sort);
    }

    const radius = Math.min(innerWidth, innerHeight) / 2;
    if (!innerRadius) {
      innerRadius = radius * 0.8;
    }

    if (!outerRadius) {
      outerRadius = radius * 0.4;
    }

    if (!labelRadius) {
      labelRadius = radius * 0.9;
    }

    const arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .padRadius(padRadius)
      .cornerRadius(cornerRadius);


    const outerArc = d3.svg.arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    const pieData = pie(values(data));

    // console.log('====PiePlot pieData');
    // console.log(pieData);

    const translation = `translate(${innerWidth / 2}, ${innerHeight / 2})`;

    return (
      <div>
        <Plot height={height} width={width} margin={margin} viewBox={viewBox} preserveAspectRatio={preserveAspectRatio}>

          <g transform={translation}>
            <DataSet
              width={innerWidth}
              height={innerHeight}
              colorScale={colorScale}
              pie={pieData}
              arc={arc}
              outerArc={outerArc}
              radius={radius}
              x={x}
              y={y}
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
              hideLabels={hideLabels}
            />
          </g>
          {this.props.children}
        </Plot>
        <Tooltip {...this.props.tooltip} />
      </div>
    );
  }

}

export default withDefaultProps(withCalSize(withAccessor(withTooltip(PiePlot))));
