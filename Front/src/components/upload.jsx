import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import { Progress } from 'reactstrap';
class Upload extends Component {
  state = {
    name: '',
    selectedFile: null,
    value: 0
  };
  styleBar = {
    width: 800,
    height: 20
  };

  fileSelectedHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      name: event.target.files[0].name
    });
  };

  fileUploadHandler = () => {
    const fd = new FormData();
    fd.append('file', this.state.selectedFile);
    fd.append('filename', this.state.name);
    axios.post('http://localhost:5000/upload', fd, {
      onUploadProgress: ProgressEvent => {
        this.setState({
          value: Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
        });
        console.log(
          Math.round((ProgressEvent.loaded / ProgressEvent.total) * 100)
        );
      }
    });
  };

  render() {
    return (
      <div class="input-group col-md-5">
        <div class="input-group-prepend">
          <button
            class="input-group-text"
            id="inputGroupFileAddon01"
            onClick={this.fileUploadHandler}
          >
            Upload
          </button>
        </div>
        <div class="custom-file">
          <input
            type="file"
            class="custom-file-input"
            id="inputGroupFile01"
            aria-describedby="inputGroupFileAddon01"
            onChange={this.fileSelectedHandler}
          />
          <label class="custom-file-label">{this.state.name}</label>
        </div>
        <Progress animated style={this.styleBar} value={this.state.value}>
          {this.state.value} %
        </Progress>
      </div>
    );
  }
}

export default Upload;
