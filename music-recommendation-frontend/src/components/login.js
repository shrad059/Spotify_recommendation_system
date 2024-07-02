import React from 'react';
import authHelpers from '../authHelpers';

export default class Login extends React.Component {
  render() {
    if (!this.props.token || this.props.token === "access_denied") {
      return (
        <div className="auth-container">
          <button onClick={Login.getAuth} className="auth-link">Login with Spotify</button>
          {this.props.token === "access_denied" ? <h6>Something went wrong, please try again.</h6> : ""}
        </div>
      );
    } else {
      return null;
    }
  }
}

Login.getAuth = () => {
  authHelpers.getAuth();
};
