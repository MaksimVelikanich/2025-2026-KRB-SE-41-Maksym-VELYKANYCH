import React, { Component } from 'react';
import Main from './Main';

class MainContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUploaded: false,
      fileName: "",
      stats: {
        total: 0,
        anomalies: 0,
        normal: 0
      }
    };
  }

  handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      this.setState({ fileName: file.name });
      
      setTimeout(() => {
        this.setState({
          isUploaded: true,
          stats: {
            total: 15420,
            anomalies: 42,
            normal: 15378
          }
        });
      }, 1500);
    }
  };

  render() {
    return (
      <Main 
        state={this.state} 
        onFileUpload={this.handleFileUpload} 
      />
    );
  }
}

export default MainContainer;