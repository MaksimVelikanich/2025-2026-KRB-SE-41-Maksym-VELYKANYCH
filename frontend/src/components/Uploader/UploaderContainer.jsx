import React, { Component } from 'react';
import Uploader from './Uploader';

class UploaderContainer extends Component {
  render() {
    return (
      <Uploader 
        onFileUpload={this.props.onFileUpload} 
        fileName={this.props.fileName} 
      />
    );
  }
}

export default UploaderContainer;