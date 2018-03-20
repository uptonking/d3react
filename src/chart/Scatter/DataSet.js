import React from 'react';
import PropTypes from 'prop-types';

const {string, number, bool, func, array} = PropTypes;

/**
 * 散点图数据容器
 */
class DataSet extends React.Component {

  render() {

    const {
      data,
      symbol,
      xScale,
      yScale,
      colorScale,
      label,
      values,
      x,
      y,
      onMouseEnter,
      onMouseLeave
    } = this.props;

    const circles = data.map(stack => values(stack).map((e, index) => {

      const translate = `translate(${xScale(x(e))}, ${yScale(y(e))})`;
      return (
        <path
          key={`${label(stack)}.${index}`}
          className="dot"
          d={symbol()}
          transform={translate}
          fill={colorScale(label(stack))}
          onMouseOver={evt => onMouseEnter(evt, e)}
          onMouseLeave={evt => onMouseLeave(evt)}
        />
      );
    }));

    return <g>{circles}</g>;
  }

}

DataSet.propTypes = {
  data: array.isRequired,
  symbol: func.isRequired,
  xScale: func.isRequired,
  yScale: func.isRequired,
  colorScale: func.isRequired,
  onMouseEnter: func,
  onMouseLeave: func
};

export default DataSet;
