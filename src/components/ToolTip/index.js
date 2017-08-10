import React from 'react';
import ToolTip from 'rc-tooltip';
import getPlacements from './placements';

import './index.less';

const propTypes = {
  title: React.PropTypes.node,
  placement: React.PropTypes.string,
  trigger: React.PropTypes.string,
  arrowPointAtCenter: React.PropTypes.bool,
};

const defaultProps = {
  placement: 'bottomLeft',
  trigger: 'click',
};

class UCSToolTip extends React.Component {
  getPlacements() {
    const { builtinPlacements, arrowPointAtCenter } = this.props;
    return builtinPlacements || getPlacements({
      arrowPointAtCenter,
      verticalArrowShift: 8,
    });
  }

  render() {
    const { title, overlay, placement, trigger, ...others } = this.props;
    return (
      <ToolTip
        {...others}
        trigger={trigger}
        overlay={overlay || title}
        builtinPlacements={this.getPlacements()}
        placement={placement}
      />
    );
  }
}

UCSToolTip.propTypes = propTypes;
UCSToolTip.defaultProps = defaultProps;

export default UCSToolTip;
