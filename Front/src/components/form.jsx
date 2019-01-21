import React, { Component } from 'react';
import Upload from './upload';
import './style.css';
import ParticleAnimation from 'react-particle-animation';
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
    RES: '',
    ARA: '0',
    TUN: '0',
    NEG: '0',
    POS: '0'
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
          NEG: parseFloat(json.NEG) * 100,
          POS: parseFloat(json.POS) * 100,
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
      RES: '',
      ARA: '0',
      TUN: '0',
      POS: '0',
      NEG: 0
    });
  };
  render() {
    return (
      <div className="text-center">
        <ParticleAnimation
          numParticles={900}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        />
        <InputGroup>
          <div className="container">
            &nbsp; &nbsp;&nbsp;
            <input
              type="image"
              alt=""
              src="http://www.ensi-uma.tn/wp-content/uploads/2017/01/cropped-Logo-p.png"
              width="100px"
            />
          </div>
        </InputGroup>

        <div className="container text-center ">
          <br />
          &nbsp; &nbsp;&nbsp;
          <br />
          <InputGroup
            type="text"
            onChange={this.handleChange}
            className="form-control "
            id="ex1"
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
            style={this.styleRes}
            left="200px"
          >
            <InputGroupAddon addonType="prepend">@Result</InputGroupAddon>
            <Input value={this.state.RES} />
          </InputGroup>
          <br />
          <InputGroup>
            {' '}
            <div class="container">
              <div style={this.style} className="text-center">
                ARABIC <p>{Math.round(this.state.ARA)} %</p>
              </div>
              <Progress striped style={this.styleBar} value={this.state.ARA} />
              <br />
              <div striped style={this.style} className="text-center">
                TUNISIAN <p>{Math.round(this.state.TUN)} % </p>
              </div>
              <Progress
                vertical
                striped
                style={this.styleBar}
                value={this.state.TUN}
              />
              <br />
              <br />
              <div striped style={this.style} className="text-center">
                Positive <p>{Math.round(this.state.POS)} % </p>{' '}
              </div>
              <Progress
                color="success"
                value={this.state.POS}
                style={this.styleBar}
              />
              <br />
              <div striped style={this.style} className="text-center">
                Negative <p>{Math.round(this.state.NEG)} % </p>{' '}
              </div>
              <Progress
                color="danger"
                value={this.state.NEG}
                style={this.styleBar}
              />
              <br />
              <br />
              <br />
              <br />
            </div>
          </InputGroup>
          <Upload />
        </div>
      </div>
    );
  }
}

export default Form;
