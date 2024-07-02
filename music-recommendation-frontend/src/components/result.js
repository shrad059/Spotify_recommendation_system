import React from 'react';
import Tracks from './tracks';
import Functions from './functions';

export default class Result extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: true,
    };
  }

  async componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    if (this.props.data) {
      return <Tracks data={this.props.data}></Tracks>;
    } else if (this.props.token && this.props.token !== "access_denied") {
      return <Functions></Functions>;
    } else if (this.props.token && this.props.token === "error") {
      return (
        <div className='results'>
          <div className='error'>
            <h5>Houston, we have a problem.</h5>
            <h5>Let's try again.</h5>
          </div>
        </div>
      );
    } else if (this.state.loading) {
      return (
        <div className='results'>
          <div className='state'>Loading...</div>
        </div>
      );
    } else {
      return null;
    }
  }
}
