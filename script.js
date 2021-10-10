const chartContainer = document.querySelector(".chart-container"),
  confirmed = document.querySelector(".confirmed"),
  deaths = document.querySelector(".deaths"),
  recovered = document.querySelector(".recovered"),
  critical = document.querySelector(".critical"),
  asia = document.querySelector(".asia"),
  americas = document.querySelector(".americas"),
  africa = document.querySelector(".africa"),
  europe = document.querySelector(".europe"),
  world = document.querySelector(".world"),
  select = document.querySelector("#select");

/* querySelector for the select bar */
let countrytotalcase = document.querySelector('.total-cases')
let countrytotaldeaths = document.querySelector('.total-deaths')
let countryrecovered = document.querySelector('.total-recovered')
let countrynewcase = document.querySelector('.new-cases')
let countrynewdeaths = document.querySelector('.new-deaths')
let countrycritical = document.querySelector('.critical')
let countryselect = document.querySelector('#select')

let region = '';
let myChart = '';

/* -----------------select ether region or country for adding data ----------------- */
function selectSetuation() {
  confirmed.addEventListener("click", function () {
    addbycase(region, "confirmed");
  });
  deaths.addEventListener("click", function () {
    addbycase(region, "deaths");
  });
  recovered.addEventListener("click", function () {
    addbycase(region, "recovered");
  });
  critical.addEventListener("click", function () {
    addbycase(region, "critical");
  });

  asia.addEventListener("click", function () {
    addbycase('asia');
  });
  americas.addEventListener("click", function () {
    addbycase("americas");
  });
  africa.addEventListener("click", function () {
    addbycase("africa");
  });
  europe.addEventListener("click", function () {
    addbycase("europe");
  });
  world.addEventListener("click", function () {
    addbycase("world");
  });
}
/*  ----------------------   get data from database   ----------------------------- */
async function getData() {
  const selectRegion = {
    asia: {},
    europe: {},
    americas: {},
    africa: {},
    world: {},
  };
  if (!localStorage.getItem("world")) {

    let data1 = await (await fetch('https://corona-api.com/countries')).json();
    let data2 = await (await fetch('https://api.allorigins.win/raw?url=https://restcountries.herokuapp.com/api/v1')).json();

    data2.forEach(e => {
      data1.data.forEach(element => {
        if (element.code == e.cca2) {
          selectRegion.world[e.cca2] = {
            country: e.name.common, data: element.latest_data
          };
        }
        if (e.region === "Asia" && element.code == e.cca2) {
          selectRegion.asia[e.cca2] = {
            country: e.name.common, data: element.latest_data
          };
        }
        if (e.region === "Europe" && element.code == e.cca2) {
          selectRegion.europe[e.cca2] = {
            country: e.name.common, data: element.latest_data
          };
        }
        if (e.region === "Americas" && element.code == e.cca2) {
          selectRegion.americas[e.cca2] = {
            country: e.name.common, data: element.latest_data
          };
        }
        if (e.region === "Africa" && element.code == e.cca2) {
          selectRegion.africa[e.cca2] = {
            country: e.name.common, data: element.latest_data
          };
        }
      })
    })
    //-----------------------  store data at windows local storage -------------------------  
    window.localStorage.setItem('asia', JSON.stringify(selectRegion.asia))
    window.localStorage.setItem('europe', JSON.stringify(selectRegion.europe))
    window.localStorage.setItem('americas', JSON.stringify(selectRegion.americas))
    window.localStorage.setItem('africa', JSON.stringify(selectRegion.africa))
    window.localStorage.setItem('world', JSON.stringify(selectRegion.world))
  }
}

/*  ----------------------------------------  add all cases by setuations  ---------------------------*/

function addbycase(reg, latest_data = 'confirmed') {
  region = reg;
  let countrylest = [], number = [];
  let add1 = JSON.parse(localStorage.getItem(region))
  console.log(add1);
  for (const key in add1) {
    countrylest.push(add1[key].country)
    number.push(add1[key].data[latest_data])
  }
  document.querySelector('.selectcountry').innerHTML = `<span>select country: </span> <select type="text" id="select" class="select" ></select>`;
  addcountrynamestoselect(countrylest);
  graphchart({ data: number, country: countrylest })
}

/* ------------------------- fill the select option wuth country names ---------------------- */

function addcountrynamestoselect(country) {
  let countrytotalcase = document.querySelector('.total-cases')
  let countrytotaldeaths = document.querySelector('.total-deaths')
  let countryrecovered = document.querySelector('.total-recovered')
  // let countrynewcase=document.querySelector('.new-cases')
  // let countrynewdeaths=document.querySelector('.new-deaths')
  let countrycritical = document.querySelector('.critical')
  let countryselect = document.querySelector('#select')
  let data = JSON.parse(localStorage.getItem(region));
  let key = Object.keys(data);
  let countryname = "";
  for (i = 0; i < country.length; i++) {
    countryname += `<option id="${key[i]}" value="${key[i]}">${country[i]}</option>`
  }
  countryselect.addEventListener('change', (event) => {
    let coviddata = data[event.target.value]
    console.log(coviddata);
    countrytotalcase.textContent = `${coviddata.data.confirmed}`;
    countrytotaldeaths.textContent = `${coviddata.data.deaths}`;
    countryrecovered.textContent = `${coviddata.data.recovered}`;
    // countrynewcase.textContent = `${coviddata.data.today.confirmed}`;
    // countrynewdeaths.textContent = `${coviddata.data.today.deaths}`;
    countrycritical.textContent = `${coviddata.data.critical}`;

  });
  countryselect.innerHTML = countryname;
}

/* ----------------------------------- drew the graph in the canvas ---------------------------------*/

function graphchart(data) {
  console.log(data);
  if (myChart) {                    // if there is a graph in the canvas 
    myChart.destroy();            // remove it
  }
  myChart = new Chart(document.querySelector("#chart").getContext("2d"), {
    type: 'line',
    data: {
      labels: data.country,
      datasets: [{
        label: 'world',
        data: data.data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    fontColor: "white",
    options: {
      plugins: {
        legend: {
          labels: {
            fontColor: "black",
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
        //,
        // x:{
        //   autoSkip: false     // don't skip any country

        // }
      }
    }
  });
}

window.onload = async function () {
  await getData()
  selectSetuation()
  addbycase('asia')
}