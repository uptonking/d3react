import React from 'react';
import PropTypes from "prop-types";

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

function withDefaultProps(WrappedComponent) {

  return class extends React.Component {

    static defaultProps = {
      data: {label: 'No data available', values: [{x: 'No data available', y: 1}]},
      margin: {top: 0, bottom: 0, left: 0, right: 0},
      xScale: null,
      yScale: null,
      colorScale: d3.scale.category20(),
      
    };

    static propTypes = {
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

    };

    render() {
      // console.log('==== render withDefaultProps ');
      // console.log('====props withDefaultProps');
      // console.log(this.props);

      // return <WrappedComponent {...this.props} {...newProps}/>
      return <WrappedComponent {...this.props} />
    }
    
  }

}

export default withDefaultProps;
