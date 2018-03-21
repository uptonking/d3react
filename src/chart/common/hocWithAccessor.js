import React from 'react';
import PropTypes from "prop-types";

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

function withAccessor(WrappedComponent) {

  return class extends React.Component {

    static defaultProps = {
      label: stack => stack.label,
      values: stack => stack.values,
      x: e => e.x,
      y: e => e.y,
      y0: () => 0,
    };

    static propTypes = {
      label: func,
      values: func,
      x: func,
      y: func,
      y0: func,

    };

    render() {
      // console.log('==== render withAccessor ');
      // console.log('====props withAccessor');
      // console.log(this.props);

      // return <WrappedComponent {...this.props} {...newProps}/>
      return <WrappedComponent {...this.props} />

    }
  }

}

export default withAccessor;
