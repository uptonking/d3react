import React from 'react';
import PropTypes from "prop-types";
import ReactDOM from "react-dom";

const {string, number, bool, func, object, array, shape, any, oneOf, oneOfType, objectOf} = PropTypes;

function withTooltip(WrappedComponent) {

  return class extends React.Component {

    constructor() {
      super();
      this.state = {
        tooltip: {
          hidden: true
        },
      };
    }

    static defaultProps = {

      tooltipMode: 'mouse',
      tooltipOffset: {top: 0, left: 0},
      tooltipHtml: null,
      tooltipContained: false,

    };

    static propTypes = {

      tooltipHtml: func,
      tooltipMode: oneOf(['mouse', 'element', 'fixed']),
      tooltipContained: bool,
      tooltipOffset: objectOf(number),

    };

    componentDidMount() {
      this._svgNode = ReactDOM.findDOMNode(this).getElementsByTagName('svg')[0];
    }

    onMouseEnter = (e, data) => {
      // console.log('====onMouseEnter ')
      // console.log(this.props);

      if (!this.props.tooltipHtml) {
        console.log('====onMouseEnter tooltipHtml为空')
        return;
      }

      e.preventDefault();

      const {
        margin,
        tooltipMode,
        tooltipOffset,
        tooltipContained
      } = this.props;

      const svg = this._svgNode;
      let position;

      if (svg.createSVGPoint) {
        let point = svg.createSVGPoint();
        //clientX事件属性返回当事件被触发时鼠标指针向对于浏览器页面（或客户区）的水平坐标。
        point.x = e.clientX;
        point.y = e.clientY;
        // console.log('====point')
        // console.log(point)
        point = point.matrixTransform(svg.getScreenCTM().inverse());
        // console.log(point)
        position = [point.x - margin.left, point.y - margin.top];

      } else {
        const rect = svg.getBoundingClientRect();
        position = [e.clientX - rect.left - svg.clientLeft - margin.left,
          e.clientY - rect.top - svg.clientTop - margin.top];
      }

      // const [html, xPos, yPos] = this._tooltipHtml(data, position);
      const [html, xPos, yPos] = this.tip._tooltipHtml(data, position);

      const svgTop = svg.getBoundingClientRect().top + margin.top;
      const svgLeft = svg.getBoundingClientRect().left + margin.left;

      let top = 0;
      let left = 0;

      if (tooltipMode === 'fixed') {
        // console.log('====tooltipMode fixed')

        top = svgTop + tooltipOffset.top;
        left = svgLeft + tooltipOffset.left;
      } else if (tooltipMode === 'element') {
        // console.log('====tooltipMode element')

        top = svgTop + yPos + tooltipOffset.top;
        left = svgLeft + xPos + tooltipOffset.left;
      } else { // mouse
        // console.log('====tooltipMode mouse')
        top = e.clientY + tooltipOffset.top;
        left = e.clientX + tooltipOffset.left;
      }

      //线性插值函数
      function lerp(t, a, b) {
        return (1 - t) * a + t * b;
      }

      let translate;

      if (tooltipContained) {
        const t = position[0] / svg.getBoundingClientRect().width;
        translate = lerp(t, 0, 100);
      }

      this.setState({
        tooltip: {
          top,
          left,
          hidden: false,
          html,
          translate
        }
      });

    }

    onMouseLeave = (e) => {
      // console.log('====onMouseEnter ')

      if (!this.props.tooltipHtml) {
        console.log('====onMouseLeave tooltipHtml为空')
        return;
      }

      e.preventDefault();

      this.setState({
        tooltip: {
          hidden: true
        }
      });
    }


    render() {
      // console.log('==== render withTooltip ');
      // console.log('====props withTooltip');
      // console.log(this.props);

      const newProps = {
        ...this.state,
        onMouseEnter: this.onMouseEnter,
        onMouseLeave: this.onMouseLeave,

      };

      return <WrappedComponent {...this.props} ref={(c) => this.tip = c} {...newProps}/>
      // return <WrappedComponent {...this.props}  />

    }

  }

}

export default withTooltip;
