import React from 'react';
import PropTypes from "prop-types";

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

function withStackData(WrappedComponent) {

  return class extends React.Component {

    static defaultProps = {
      offset: 'zero',
      order: 'default',
    };

    static propTypes = {
      offset: string,
    };

    componentWillMount() {
      this._stackData(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this._stackData(nextProps);
    }

    _stackData(props) {
      const {offset, order, x, y, values} = props;

      const stack = d3.layout.stack()
        .offset(offset)
        .order(order)
        .x(x)
        .y(y)
        .values(values);

      this._data = stack(props._data);

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


    render() {
      // console.log('==== render withStackData ');
      // console.log('====props withStackData');
      // console.log(this.props);

      const newProps = {
        _data: this._data,
      };

      return <WrappedComponent {...this.props} {...newProps}/>
      // return <WrappedComponent {...this.props}  />

    }
  }

}

export default withStackData;
