import React from 'react';
import PropTypes from "prop-types";

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

function withScales(WrappedComponent) {

  return class extends React.Component {

    constructor() {
      super();
      this.state = {
        _xScale: null,
        _yScale: null,
        _xIntercept: null,
        _yIntercept: null,
      };
    }

    static defaultProps = {
      barPadding: 0.5
    };

    static propTypes = {
      barPadding: number
    };

    componentWillMount() {
      this._makeScales(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this._makeScales(nextProps);
    }

    _makeScales(props) {
      const {xScale, xIntercept, yScale, yIntercept} = props;
      // console.log('====withScales  _makeScales props');
      // console.log(props);

      let xarr = [];
      let yarr = [];

      if (!xScale) {

        // console.log('====withScales  _makeScales if !xScale ');

        // [this._xScale, this._xIntercept] = this._makeXScale(props);
        xarr = this._makeXScale(props);

      } else {


        // [this._xScale, this._xIntercept] = [xScale, xIntercept];
        xarr = [xScale, xIntercept];
      }

      if (!yScale) {
        // console.log('====withScales  _makeScales if !yScale ');
        // [this._yScale, this._yIntercept] = this._makeYScale(props);
        yarr = this._makeYScale(props);

      } else {
        // console.log('====withScales  _makeScales else !yScale');
        // [this._yScale, this._yIntercept] = [yScale, yIntercept];
        yarr = [yScale, yIntercept];
      }

      // console.log(xarr);
      // console.log(yarr);

      this.setState({
        ...this.state,
        _xScale: xarr[0],
        _xIntercept: xarr[1],
        _yScale: yarr[0],
        _yIntercept: yarr[1],
      });

    }

    _makeXScale(props) {
      const {x, values} = props;
      // const data = this._data;
      const data = props._data;

      if (typeof x(values(data[0])[0]) === 'number') {
        return this._makeLinearXScale(props);
      } else if (typeof x(values(data[0])[0]).getMonth === 'function') {
        return this._makeTimeXScale(props);
      } else {
        return this._makeOrdinalXScale(props);
      }
    }

    _makeLinearXScale(props) {
      // console.log('====hocWithScales _makeLinearXScale');
      // console.log(props);

      const {x, values} = props;
      const data = props._data;
      // const data = props.data;

      const extentsData = data.map(stack => values(stack).map(e => x(e)));
      const extents = d3.extent(Array.prototype.concat.apply([], extentsData));

      const scale = d3.scale.linear()
        .domain(extents)
        .range([0, props._innerWidth]);

      const zero = d3.max([0, scale.domain()[0]]);
      const xIntercept = scale(zero);

      // console.log(scale);
      // console.log(xIntercept);

      return [scale, xIntercept];
    }

    _makeOrdinalXScale(props) {
      const {x, values, barPadding} = props;
      const data = props._data;

      const scale = d3.scale.ordinal()
        .domain(values(data[0]).map(e => x(e)))
        .rangeRoundBands([0, props._innerWidth], barPadding);

      return [scale, 0];
    }

    _makeTimeXScale(props) {
      const {x, values} = props;
      const data = props._data;

      const minDate = d3.min(values(data[0]), x);
      const maxDate = d3.max(values(data[0]), x);

      const scale = d3.time.scale()
        .domain([minDate, maxDate])
        .range([0, props._innerWidth]);

      return [scale, 0];
    }

    _makeYScale(props) {
      const {y, values} = props;
      const data = props._data;
      // const data = props.data;


      if (typeof y(values(data[0])[0]) === 'number') {
        return this._makeLinearYScale(props);
      } else {
        return this._makeOrdinalYScale(props);
      }
    }

    _makeLinearYScale(props) {
      // console.log('====hocWithScales _makeLinearYScale');
      // console.log(props);

      const {y, y0, values, groupedBars} = props;
      const data = props._data;

      const extentsData = data.map(stack => values(stack).map(e => groupedBars ? y(e) : y0(e) + y(e)));
      let extents = d3.extent(Array.prototype.concat.apply([], extentsData));

      extents = [d3.min([0, extents[0]]), extents[1]];

      const scale = d3.scale.linear()
        .domain(extents)
        .range([props._innerHeight, 0]);

      const zero = d3.max([0, scale.domain()[0]]);
      const yIntercept = scale(zero);

      return [scale, yIntercept];
    }

    _makeOrdinalYScale(props) {
      const scale = d3.scale.ordinal()
        .range([props._innerHeight, 0]);

      const yIntercept = scale(0);

      return [scale, yIntercept];
    }

    render() {
      // console.log('==== render withScales ');
      // console.log('====props withScales');
      // console.log(this.props);

      return <WrappedComponent {...this.props} {...this.state} />

    }

  }

}

export default withScales;
