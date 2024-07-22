const API_DATA_URL = "http://localhost:8000"

const map = L.map('map').setView([16.7510073, -93.0998758], 15)
const route = L.polyline(ruta_tuxtla, {color: "green"}).addTo(map)

const taxiIcon = L.icon({
    iconUrl: '../../public/taxi.png',
    shadowUrl: "../../public/sombra.png",
    iconSize:     [35, 30], // size of the icon
    shadowSize:   [35, 30], // size of the shadow
    iconAnchor:   [35, 30], // point of the icon which will correspond to marker's location
    shadowAnchor: [35, 30],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
})

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 13,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([16.7510073, -93.0998758], {icon: taxiIcon}).addTo(map);

var circle = L.circle([16.7510073, -93.0998758], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

function logout () {
    window.loader.loadLogin()
}

let hours = 0
let minutes = 0
let seconds = 0
let hundredths = 0
let control = null

const hoursSpan = document.querySelector("#hours")
const minutesSpan = document.querySelector("#minutes")
const secondsSpan = document.querySelector("#seconds")
const buttonCounter = document.querySelector("#buttonCounter")

async function startCounter () {
    const driverId = await window.loader.getDriverId()
    console.log(driverId)
    if(!control){
        await fetch(`${API_DATA_URL}/travels/init`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({driver_id: driverId})
        })
        .then(res => res.json())
        .then(data => {console.log(data)})
        control = setInterval(cronometro,10);
        buttonCounter.classList.remove("start")
        buttonCounter.classList.add("finish")
        buttonCounter.innerHTML = "fin"
    } else {
        await fetch(`${API_DATA_URL}/travels/finish`, {
            method: "POST",
        })
        .then(res => res.json())
        .then(data => {console.log(data)})
        clearInterval(control)
        buttonCounter.classList.add("start")
        buttonCounter.classList.remove("finish")
        buttonCounter.innerHTML = "inicio"
        control = null
        secondsSpan.innerHTML = "00"
        minutesSpan.innerHTML = "00"
        hoursSpan.innerHTML = "00"
        hundredths = 0
        seconds = 0
        minutes = 0
        hours = 0
    }

}

function cronometro () {
	if (hundredths < 99) {
		hundredths++;
	}
	if (hundredths == 99) {
		hundredths = -1;
	}
	if (hundredths == 0) {
		seconds ++;
		if (seconds < 10) { seconds = "0"+seconds }
		secondsSpan.innerHTML = seconds;
	}
	if (seconds == 59) {
		seconds = -1;
	}
	if ( (hundredths == 0)&&(seconds == 0) ) {
		minutes++;
		if (minutes < 10) { minutes = "0"+minutes }
		minutesSpan.innerHTML = minutes;
	}
	if (minutes == 59) {
		minutes = -1;
	}
	if ( (hundredths == 0)&&(seconds == 0)&&(minutes == 0) ) {
		hours ++;
		if (hours < 10) { hours = "0"+hours }
		hoursSpan.innerHTML = hours;
	}
}
