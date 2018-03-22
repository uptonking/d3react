import React from 'react';
import PropTypes from "prop-types";

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

function withResponsive(WrappedComponent) {

  return class  extends React.Component {

    constructor() {
      super();
      this.state = {
        size: {
          w: 0,
          h: 0,
        }
      };
    }

    static defaultProps = {
      margin: {
        top: 12,
        bottom: 12,
        left: 12,
        right: 12,
      },
    };
    static propTypes = {
      width: number,
      height: number,
      margin: object,
    };

    fitToParentSize() {

      // console.log('====hocWithResponsive fitToParentSize')

      let w1 = this.wrapper.offsetWidth;
      let h1 = this.wrapper.offsetHeight;

      const {w, h} = this.state.size;

      // console.log('new w, h:', w1, h1);
      // console.log('old w, h:', this.state.size.w, this.state.size.h);

      const currentSize = this.state.size;

      ///第一次使用浏览器宽度和高度
      if (w === 0 || h === 0) {
        this.setState({
          size: {
            w: w1,
            h: h1,
          }
        });
        return;
      }

      ///第二次以后，以宽度为基准，按比例调整高度
      if (w1 !== currentSize.w || h1 !== currentSize.h) {
        h1 = w1 * currentSize.h / currentSize.w;
        this.setState({
          // size: { w, h },
          size: {
            w: w1,
            h: h1,
          },
        });
      }

    }

    componentDidMount() {
      window.addEventListener('resize', ::this.fitToParentSize);
      this.fitToParentSize();
    }

    componentWillReceiveProps(nextProps) {
      this.fitToParentSize();
    }

    componentWillUnmount() {
      window.removeEventListener('resize', ::this.fitToParentSize);
    }

    render() {
      // console.log('====props hocWithResponsive');
      // console.log(this.props);
      // console.log(this.state.size.w, this.state.size.h);

      let {width, height, margin,} = this.props;

      width = this.state.size.w || width || 320;
      height = this.state.size.h || height || 320;

      const newProps = {
        width: width,
        height: height,
        // margin: margin,
      };

      return (
        <div
          ref={(c) => {
            this.wrapper = c;
          }}
          // style={{backgroundColor: '#eee'}}
        >

          <WrappedComponent {...this.props} {...newProps}/>

        </div>
      );
    }

  }

}

export default withResponsive;
