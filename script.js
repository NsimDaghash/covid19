  const chartContainer = document.querySelector(".chart-container");
  const confirmed = document.querySelector(".confirmed");
  const deaths = document.querySelector(".deaths");
  const recovered = document.querySelector(".recovered");
  const critical = document.querySelector(".critical");
  const asia = document.querySelector(".asia");
  const americas = document.querySelector(".americas");
  const africa = document.querySelector(".africa");
  const europe = document.querySelector(".europe");
  const world = document.querySelector(".world");
  const select = document.querySelector("#select");

  /* querySelector for the select bar */
  let countrytotalcase=document.querySelector('.total-cases')
  let countrytotaldeaths=document.querySelector('.total-deaths')
  let countryrecovered=document.querySelector('.total-recovered')
  let countrynewcase=document.querySelector('.new-cases')
  let countrynewdeaths=document.querySelector('.new-deaths')
  let countrycritical=document.querySelector('.critical')
  let countryselect=document.querySelector('#select')

  let region='';
  let myChart='';

/* -----------------select ether region or country for adding data ----------------- */
  function selectSetuation() {
      addbycase('asia')
    confirmed.addEventListener("click", function () {
      addbycase(region,"confirmed");
      
    });
    deaths.addEventListener("click", function () {
      addbycase(region,"deaths");
    });
    recovered.addEventListener("click", function () {
      addbycase(region,"recovered");
    });
    critical.addEventListener("click", function () {
      addbycase(region,"critical");
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
        
        //  let data1 = await (await fetch('https://corona-api.com/countries')).json();
        //  let data2 = await (await fetch('https://api.allorigins.win/raw?url=https://restcountries.herokuapp.com/api/v1')).json();
          
  data2.forEach(e => {
      data1.data.forEach(element => {
          selectRegion.world[e.cca2] = { country: e.name.common ,data: element.latest_data,today:{
            deaths:element.today.deaths,
            confirmed:element.today.confirmed
          }};
          if (e.region === "Asia" && element.code == e.cca2) {
              selectRegion.asia[e.cca2] = { country: e.name.common, data: element.latest_data,today:{
                deaths:element.today.deaths,
                confirmed:element.today.confirmed
              } };
          } else if (e.region === "Europe" && element.code == e.cca2) {
              selectRegion.europe[e.cca2] = { country: e.name.common, data: element.latest_data ,today:{
                deaths:element.today.deaths,
                confirmed:element.today.confirmed
              }};
          } else if (e.region === "Americas" && element.code == e.cca2) {
             selectRegion.americas[e.cca2] = { country: e.name.common, data: element.latest_data ,today:{
              deaths:element.today.deaths,
              confirmed:element.today.confirmed
            }}
          } else if (e.region === "Africa" && element.code == e.cca2) {
              selectRegion.africa[e.cca2] = { country: e.name.common, data: element.latest_data ,today:{
                deaths:element.today.deaths,
                confirmed:element.today.confirmed
              }};
          }   
      })
  })
      //-----------------------  store data at windows local storage -------------------------  
  window.localStorage.setItem('asia',JSON.stringify(selectRegion.asia))
  window.localStorage.setItem('europe',JSON.stringify(selectRegion.europe))
  window.localStorage.setItem('americas',JSON.stringify(selectRegion.americas))
  window.localStorage.setItem('africa',JSON.stringify(selectRegion.africa))
  window.localStorage.setItem('world',JSON.stringify(selectRegion.world))
      }
  }
  
  
  /*  ----------------------------------------  add all cases by setuations  ---------------------------*/

  function addbycase(reg,latest_data='confirmed'){

    let  lest=[],num=[];
    let add1=JSON.parse(localStorage.getItem(reg))
    for (const key in add1) {
        lest.push(add1[key].country)
        num.push(add1[key].data[latest_data])
        }
    console.log(lest);
    console.log(num);
    addcountrynamestoselect(lest);
    graphchart({data:num,country:lest})
}  

 /* ------------------------- fill the select option wuth country names ---------------------- */
  function addcountrynamestoselect(country){

  let data=JSON.parse(localStorage.getItem(region));
  let key=Object.keys(data);
  let countryname="";
  for(i=0;i<country.length;i++){
    countryname+=`<option id="${key[i]}" value="${key[i]}">${country[i]}</option>`
  }
  console.log(data);
    select.addEventListener('change', (event) => {
    let coviddata = data[event.target.value]
    countrytotalcase.textContent = `${coviddata.data.confirmed}`;
    countrytotaldeaths.textContent = `${coviddata.data.deaths}`;
    countryrecovered.textContent = `${coviddata.data.recovered}`;
    countrynewcase.textContent = `${coviddata.today.confirmed}`;
    countrynewdeaths.textContent = `${coviddata.today.deaths}`;
    countrycritical.textContent = `${coviddata.data.critical}`;
    console.log(event.target.value)
  });
  select.innerHTML=countryname;
  console.log(countryname);
  }
  
/* ----------------------------------- drew the graph in the canvas ---------------------------------*/

function graphchart(data){
  const ctx = document.querySelector("#chart").getContext("2d");
    if(myChart){                    // if there is a graph in the canvas 
        myChart.destroy();            // remove it
    }
    myChart = new Chart(ctx, {
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
                },
                x:{
                  autoSkip: false     // don't skip any country

                }
            }
        }
    });
}


  getData()
  selectSetuation()
  
  
  
  
  
  
  