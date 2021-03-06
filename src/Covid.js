import React, { Component } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import { Pie } from 'react-chartjs-2';
import "chartjs-plugin-datalabels";
import 'react-bulma-components/dist/react-bulma-components.min.css';
import './assets/stylesheets/style.scss';

const BASE_API = "https://covid2019-api.herokuapp.com";

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
        confirmedChina: 0,
        deathsChina: 0,
        recoveredChina: 0
      }
    }
  }

  componentDidMount() {
    this.setState({isLoading: true}, () => {
      $.ajax({
        url: `${BASE_API}/total`,
        type: "GET",
        dataType: "json",
        crossDomain: true,
        success: function(response) {
          let res = response;

          let world = {
            confirmed: res.confirmed,
            deaths: res.deaths,
            recovered: res.recovered  
          }

          this.setState({
            isLoading: false,
            world: world
          });
        }.bind(this),
        error: function(_xhr, _status, _err) {
          this.setState({ isLoading: false });
        }.bind(this)
      });   

      $.ajax({
        url: `${BASE_API}/country/China`,
        type: "GET",
        dataType: "json",
        crossDomain: true,
        success: function(response) {
          let resChina = response.China;

          let china = {
            confirmedChina: resChina.confirmed,
            deathsChina: resChina.deaths,
            recoveredChina: resChina.recovered  
          }

          this.setState({
            isLoading: false,
            china: china
          });
        }.bind(this),
        error: function(_xhr, _status, _err) {
          this.setState({ isLoading: false });
        }.bind(this)
      }); 
    });
  }


  render() {
    console.log(this.state);

    let {confirmed, deaths, recovered} = this.state.world;
    let active = confirmed - deaths - recovered;



    let {confirmedChina, deathsChina, recoveredChina} = this.state.china;
    let activeChina = confirmedChina - deathsChina - recoveredChina;

    console.log(this.state.china.confirmed)

    let worldGeneralData = {
      datasets: [{
        backgroundColor: [
          "#f4c558",
          "#ed5555",
          "#56f78c"
        ],
        data: [active, deaths, recovered]
      }],
      labels: [
        'Active',
        'Deaths',
        'Recovered'
      ]
    };

    let worldGeneralWithoutActiveData = {
      datasets: [{
        backgroundColor: [
          "#ed5555",
          "#56f78c"
        ],
        data: [deaths, recovered]
      }],
      labels: [
        'Deaths',
        'Recovered'
      ]
    }

    let chinaGeneralData = {
      datasets: [{
        backgroundColor: [
          "#f4c558",
          "#ed5555",
          "#56f78c"
        ],
        data: [activeChina, deathsChina, recoveredChina]
      }],
      labels: [
        'Active',
        'Deaths',
        'Recovered'
      ]
    };
    
    let chinaGeneralWithoutActiveData = {
      datasets: [{
        backgroundColor: [
          "#ed5555",
          "#56f78c"
        ],
        data: [deathsChina, recoveredChina]
      }],
      labels: [
        'Deaths',
        'Recovered'
      ]
    }

    let excludingChinaGeneralData = {
      datasets: [{
        backgroundColor: [
          "#f4c558",
          "#ed5555",
          "#56f78c"
        ],
        data: [active - activeChina, deaths - deathsChina, recovered - recoveredChina]
      }],
      labels: [
        'Active',
        'Deaths',
        'Recovered'
      ]
    };

    let excludingChinaGeneralWithoutActiveData = {
      datasets: [{
        backgroundColor: [
          "#ed5555",
          "#56f78c"
        ],
        data: [deaths - deathsChina, recovered - recoveredChina]
      }],
      labels: [
        'Deaths',
        'Recovered'
      ]
    }

    let options = {
      tooltips: {
        enabled: false
      },
      plugins: {
        datalabels: {
          font: {
            weight: 'bold',
            size: 14,
          },
          color: "#023147"
        }
      }
    }

    let percentOptions = {
      tooltips: {
        enabled: false
      },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            let datasets = ctx.chart.data.datasets;
   
            if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
              let sum = datasets[0].data.reduce((a, b) => a + b, 0);
              let percentage = Math.round((value / sum) * 10000)/100 + '%';
              return percentage;
            } else {
              return percentage;
            }
          },
          font: {
            weight: 'bold',
            size: 14,
          },
          color: '#023147',
        }
      }
    }

    return (
      <div>
        <div className="columns">
          <div className="column panel" id="world">
            <h2>World</h2>
            <div className="columns">
              <div className="column sub-panel">
                <h3>All</h3>
                <Pie data={worldGeneralData} options={options}/>
              </div>
              <div className="column sub-panel">
                <h3>Excluded active</h3>
                <Pie data={worldGeneralWithoutActiveData} options={percentOptions} />
              </div>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column panel" id="china">
            <h2>China</h2>
            <div className="columns">
              <div className="column sub-panel">
                <h3>All</h3>
                <Pie data={chinaGeneralData} options={options}/>
              </div>
              <div className="column sub-panel">
                <h3>Excluded active</h3>
                <Pie data={chinaGeneralWithoutActiveData} options={percentOptions} />
              </div>
            </div>
          </div>
          <div className="column panel" id="china">
            <h2>Excluded China</h2>
            <div className="columns">
              <div className="column sub-panel">
                <h3>All</h3>
                <Pie data={excludingChinaGeneralData} options={options}/>
              </div>
              <div className="column sub-panel">
                <h3>Excluded active</h3>
                <Pie data={excludingChinaGeneralWithoutActiveData} options={percentOptions} />
              </div>
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