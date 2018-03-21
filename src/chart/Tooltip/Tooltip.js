import React from 'react';
import PropTypes from 'prop-types';

const {number, node} = PropTypes;

/**
 * 所有图表的 鼠标提示内容
 */
class Tooltip extends React.Component {

  static defaultProps = {
    top: 150,
    left: 100,
    html: '',
    translate: 50,
  };

  static propTypes = {
    top: number.isRequired,
    left: number.isRequired,
    html: node,
    translate: number,
  };

  render() {

    // console.log('====props Tooltip')
    // console.log(this.props)

    const {
      top,
      left,
      hidden,
      html,
      translate,
    } = this.props;

    const style = {
      display: hidden ? 'none' : 'block',
      position: 'absolute',
      top,
      left,
      transform: `translate(-${translate}%, 0)`,
      pointerEvents: 'none',
      padding: '10px 10px 6px 10px',
      lineHeight: '20px',
      background: 'rgba(0, 0, 0, 0.65)',
      color: '#fff',
      borderRadius: '4px',
      whiteSpace: 'nowrap',
      transition: 'visibility 0.2s cubic-bezier(0.23, 1, 0.32, 1), left 0.4s cubic-bezier(0.23, 1, 0.32, 1), top 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      fontSize: '12px'

    };

    //自定义样式可使用css类选择器 .greact-tooltip { }
    return <div className="greact-tooltip" style={style}>{html}</div>;
  }

}


export default Tooltip;
