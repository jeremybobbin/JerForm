import React, { Component, Fragment } from 'react';
import JerForm from './JerForm';

class App extends Component {
  render() {
    return (
      <Fragment>
        <h1>JerForm</h1>
        <JerForm
          inputs={['phone', 'email', 'password', 'remember', 'submit']}
        />
      </Fragment>
    );
  }
}

export default App;
