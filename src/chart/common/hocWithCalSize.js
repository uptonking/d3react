import React from 'react';

function withCalSize(WrappedComponent) {

  return class extends React.Component {

    constructor() {
      super();
      this.state = {
        _innerHeight: '',
        _innerWidth: '',
      }
    }

    componentWillMount() {
      this._calculateInner(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this._calculateInner(nextProps);
    }

    _calculateInner(props) {
      const {height, width, margin} = props;

      this.setState({
        _innerHeight: height - margin.top - margin.bottom,
        _innerWidth: width - margin.left - margin.right,
      })
    }

    render() {
      // console.log('==== render withCalSize ');
      // console.log('====props withCalSize');
      // console.log(this.props);

      return <WrappedComponent {...this.props} {...this.state} />

    }
  }

}

export default withCalSize;
