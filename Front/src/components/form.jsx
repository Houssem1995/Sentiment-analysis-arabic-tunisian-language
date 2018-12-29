import React, { Component } from 'react';
import Upload from './upload';
import {
  Button,
  Progress,
  InputGroup,
  InputGroupAddon,
  Input
} from 'reactstrap';
class Form extends Component {
  state = {
    value: '',
    RES: 'Nothing',
    ARA: '0',
    TUN: '0'
  };
  style = {
    width: 800,
    height: 50
  };
  styleRes = {
    width: 250,
    height: 50
  };
  styleBar = {
    width: 800,
    height: 20
  };
  getLang = () => {
    fetch('http://localhost:5000/' + this.state.value.toString())
      .then(response => {
        return response.json();
      })
      .then(json => {
        this.setState({
          ARA: parseFloat(json.ARA) * 100,
          TUN: parseFloat(json.TUN) * 100,
          RES: json.res
        });
        console.log('parsed json', json);
      })
      .catch(ex => {
        console.log('parsing failed', ex);
      });
    console.log(this.state);
  };

  handleChange = event => {
    this.setState({ value: event.target.value });
    //this.setState({ value: this.state.value });
    console.log(this.state.value);
  };

  reset = () => {
    this.setState({
      value: '',
      RES: 'Nothing',
      ARA: '0',
      TUN: '0'
    });
    this.state.value = '';
  };
  render() {
    return (
      <div className="form-group ">
        <br />
        <InputGroup
          type="text"
          onChange={this.handleChange}
          className="form-control "
          id="ex1"
          type="text"
          style={this.style}
        >
          <InputGroupAddon addonType="prepend">@Input Text</InputGroupAddon>
          <Input value={this.state.value} />
          &nbsp; &nbsp;
          <Button color="warning" onClick={this.reset}>
            reset
          </Button>
          &nbsp; &nbsp; &nbsp;
          <Button color="primary" onClick={this.getLang}>
            Sumbit
          </Button>
        </InputGroup>
        <br />
        <InputGroup
          type="text"
          value={this.state.RES}
          onChange={this.handleChange}
          className="form-control"
          id="ex1"
          type="text"
          style={this.styleRes}
          left="200px"
        >
          <InputGroupAddon addonType="prepend">@Result</InputGroupAddon>
          <Input value={this.state.RES} />
        </InputGroup>
        <br />

        <div style={this.style} className="text-center col-md-5">
          ARABIC <p>{this.state.ARA}</p>
        </div>
        <Progress style={this.styleBar} value={this.state.ARA} />
        <br />
        <div style={this.style} className="text-center">
          TUNISIAN <p>{this.state.TUN}</p>
        </div>
        <Progress style={this.styleBar} value={this.state.TUN} />
        <br />
        <br />
        <br />
        <br />

        <Upload />
      </div>
    );
  }
}

export default Form;
