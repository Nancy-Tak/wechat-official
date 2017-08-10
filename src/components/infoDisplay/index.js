import React from 'react';
import { withRouter } from 'react-router'
import {
} from 'antd-mobile';
import { axios, session } from 'UTILS';
import './style.less'

export default class InfoDisplay extends React.Component {

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  }

  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {
      const {
          info,
      } = this.props;

      const {
          infos
      } = info;

    return (
      <div className="clearfix"  >
          {
              infos.map( (item, index) => {
                      return (
                          <div
                              className="clearfix"
                              key={ index }
                          >
                              <span>{ item.key }</span>
                              <em>:</em>
                              <span>{ item.val}</span>
                          </div>
                      )
                  }
              )
          }
      </div>
    );
  }
}
