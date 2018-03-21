import React from 'react';
import PropTypes from 'prop-types';

const {string} = PropTypes;

/**
 * 扇形区域
 */
class Sector extends React.Component {

  static propTypes = {
    d: string.isRequired,
    fill: string.isRequired,
  };


  render() {
    // console.log('====props Sector')
    // console.log(this.props)

    const {d, data, fill, onMouseEnter, onMouseLeave,} = this.props;

    return (
      <path
        fill={fill}
        d={d}
        onMouseMove={evt => onMouseEnter(evt, data)}
        onMouseLeave={evt => onMouseLeave(evt)}
      />
    );
  }

}

export default Sector;
