import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios';
import {
  Progress,
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap';
class Upload extends Component {
  state = {
    name: '',
    selectedFile: null,
    value: 0
  };
  styleBar = {
    width: 800,
    height: 20,
    top: 0,
    right: 0
  };
  styleRes = {
    width: 250,
    height: 50
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
      <InputGroup>
        <InputGroupAddon addonType="prepend">
          {' '}
          <Button
            class="input-group-text"
            id="inputGroupFileAddon01"
            onClick={this.fileUploadHandler}
          >
            Upload
          </Button>
          <br />
          <div class="custom-file">
            <input
              type="file"
              class="custom-file-input col-md-8"
              onChange={this.fileSelectedHandler}
            />
            <label class="custom-file-label">{this.state.name}</label>
          </div>
          <InputGroup className="col-md-3">
            {' '}
            <InputGroupAddon addonType="prepend">
              <Button>@Accuracy</Button>
            </InputGroupAddon>
            <Input value={'100'} className="input-group col-md-9 " />
          </InputGroup>
        </InputGroupAddon>
        <br />
        <Progress animated style={this.styleBar} value={this.state.value}>
          {this.state.value} %
        </Progress>
        <br />
        <br />
        <br />
      </InputGroup>
    );
  }
}

export default Upload;
