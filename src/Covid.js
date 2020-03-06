import React, { Component } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { Doughnut } from 'react-chartjs-2';

import 'react-bulma-components/dist/react-bulma-components.min.css';
import './assets/stylesheets/style.scss';

const BASE_API = "https://covid2019-api.herokuapp.com/";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      world: {
        confirmed: 0,
        deaths: 0,
        recovered: 0
      },
      china: {
        confirmed: 0,
        deaths: 0,
        recovered: 0
      },
      rest: {
        confirmed: 0,
        deaths: 0,
        recovered: 0    
      }
    }
  }

  componentDidMount() {
    this.setState({isLoading: true}, () => {
      $.ajax({
        url: `${BASE_API}/total`,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        dataType: "text json",
        crossDomain: false,
        success: function(response) {
          this.setState({
              isLoading: false,
              world: {
                confirmed: response.confirmed,
                deaths: response.deaths,
                recovered: response.recovered
              }
          });
        }.bind(this),
        error: function(_xhr, _status, _err) {
          this.setState({ isLoading: false });
        }.bind(this)
      });   
    });
  }


  render() {
    let {confirmed, deaths, recovered} = this.state.world;
    let active = confirmed - deaths - recovered;

    let data = {
      datasets: [{
          data: [active, deaths, recovered]
      }],
      labels: [
        'Active',
        'Deaths',
        'Recovered'
      ],        
      backgroundColor: [
        "#f38b4a",
        "#56d798",
        "#ff8397"
      ],
    };

    return (
      
      <div className="columns">
        <div className="column" id="world">
          <h2>World</h2>
          <div className="columns">
            <div className="column">
              <Doughnut data={data} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const yieldNode = document.querySelector("#yield");

ReactDOM.render(
  <Covid />,
  yieldNode
);