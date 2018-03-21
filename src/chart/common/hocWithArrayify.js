import React from 'react';

function withArrayify(WrappedComponent) {

  return class extends React.Component {

    constructor() {
      super();
      this.state = {
        _data: '',
      }
    }

    componentWillMount() {
      this._arrayify(this.props);
    }

    componentWillReceiveProps(nextProps) {
      this._arrayify(nextProps);
    }

    _arrayify(props) {
      if (props.data === null) {
        this.setState({
          _data: [{
            label: 'No data available',
            values: [{x: 'No data available', y: 1}]
          }]
        });
      } else if (!Array.isArray(props.data)) {
        this.setState({_data: [props.data]});
      } else {
        this.setState({_data: props.data});
      }
    }

    render() {
      // console.log('==== render withArrayify ');
      // console.log('====props withArrayify');
      // console.log(this.props);

      return <WrappedComponent {...this.props} {...this.state} />

    }

  }

}

export default withArrayify;
