import React from 'react';
import '../../assets/less/global.less';

const propTypes = {
  children: React.PropTypes.object.isRequired,
};

const App = ({ children }) => (
  <div className="page">
    { children }
  </div>
);

App.propTypes = propTypes;

export default App;
