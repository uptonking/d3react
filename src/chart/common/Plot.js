import React from 'react';
import PropTypes from 'prop-types';

const {number, shape} = PropTypes;

/**
 * 所有图表的 通用最外层svg
 */
class Plot extends React.Component {

  static propTypes = {
    height: number.isRequired,
    width: number.isRequired,
    margin: shape({
      top: number,
      bottom: number,
      left: number,
      right: number,
    }).isRequired
  };

  render() {
    // console.log('====props Plot');
    // console.log(this.props);

    const {
      width,
      height,
      margin,
      viewBox,
      preserveAspectRatio,
      children,
    } = this.props;

    return (
      <svg ref="svg"
           width={width}
           height={height}
           viewBox={viewBox}
           preserveAspectRatio={preserveAspectRatio}>

        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {children}
        </g>

      </svg>
    );
  }
}


export default Plot;
