import React, { Component, Fragment } from 'react';
import JerForm from './JerForm';

class App extends Component {
  render() {
    return (
      <Fragment>
        <h1>JerForm</h1>
        <JerForm
          buttonText='Submit'
          inputs={['phone', 'email', 'password', 'remember']}
          onSubmit={(args) => {
            console.log(args);
          }}
        />
      </Fragment>
    );
  }
}

export default App;
