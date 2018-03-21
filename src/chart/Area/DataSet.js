import React from 'react';
import PropTypes from 'prop-types';
import Path from '../common/Path';

const {string, number, bool, func, array} = PropTypes;

/**
 * 面积图数据容器
 */
class DataSet extends React.Component {

  static propTypes = {
    data: array.isRequired,
    area: func.isRequired,
    line: func.isRequired,
    colorScale: func.isRequired,
    stroke: func.isRequired,
  };
  
  render() {
    const {
      data,
      area,
      colorScale,
      values,
      label,
      onMouseEnter,
      onMouseLeave,
    } = this.props;

    const areas = data.map((stack, index) =>
      <Path
        key={`${label(stack)}.${index}`}
        className="area"
        stroke="none"
        fill={colorScale(label(stack))}
        d={area(values(stack))}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data={data}
      />
    );

    return <g>{areas}</g>;
  }

}

export default DataSet;
