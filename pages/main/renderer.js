const API_DATA_URL = "https://taxitracker-machinelearning.freemyip.com";

const map = L.map('map').setView([16.7510073, -93.0998758], 14);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    minZoom: 13,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const taxiIcon = L.icon({
    iconUrl: '../../public/taxi.png',
    shadowUrl: "../../public/sombra.png",
    iconSize: [35, 30],
    shadowSize: [35, 30],
    iconAnchor: [35, 30],
    shadowAnchor: [35, 30],
    popupAnchor: [-3, -76]
});

let marker = null;

function logout() {
    window.loader.loadLogin();
}

async function getCurrentLocation() {
    const notification = document.querySelector("#notification");
    const POLLING_INTERVAL = 3100; // 5 seconds

    while (true) {
        try {
            const response = await fetch("http://localhost:8000/geolocation");
            const data = await response.json();

            if (!notification.classList.contains("hidden")) {
                notification.classList.add("hidden");
            }

            const { lat, long } = data.data;
            console.log(lat, long);

            if(lat === 0 && long === 0) {
                continue;
            }

            if (marker) {
                marker.setLatLng([lat, long]);
            } else {
                marker = L.marker([lat, long], { icon: taxiIcon }).addTo(map);
            }

            map.setView([lat, long]);
        } catch (error) {
            console.error("Error fetching geolocation:", error);
            if (notification.classList.contains("hidden")) {
                notification.classList.remove("hidden");
            }
        }

        // Wait for the specified interval before the next request
        await new Promise(resolve => setTimeout(resolve, POLLING_INTERVAL));
    }
}

// Start the polling
getCurrentLocation();

async function fetchHeatmapData(hour) {
    try {
        const response = await fetch(`${API_DATA_URL}/api/heatmap-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ hour })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log("Heatmap Data:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch heatmap data:", error);
        return null;
    }
}

async function updateHeatmap(hour) {
    const heatmapData = await fetchHeatmapData(hour);
    if (!heatmapData) {
        console.error("No heatmap data available for the given hour");
        return;
    }

    // Limpia los mapas de calor existentes antes de agregar los nuevos
    map.eachLayer(layer => {
        if (layer instanceof L.HeatLayer) {
            map.removeLayer(layer);
        }
    });

    for (const quadrant in heatmapData) {
        const { x, y, z } = heatmapData[quadrant];
        console.log(`Quadrant ${quadrant}:`, { x, y, z });

        // Crear un array de puntos para el heatmap
        const heatmapPoints = x.map((lat, i) => {
            return [lat, y[i], z[i]];
        });

        // Asegúrate de que los valores de z están normalizados correctamente
        const maxIntensity = Math.max(...z);
        const normalizedPoints = heatmapPoints.map(point => [point[0], point[1], point[2] / maxIntensity]);

        const heatmapLayer = L.heatLayer(normalizedPoints, {
            radius: 22,
            blur: 15,
            maxZoom: 17,
            max: 1.0,  // Asegúrate de que esto coincida con tu normalización
            gradient: {0.4: 'blue', 0.6: 'lime', 0.7: 'yellow', 0.8: 'orange', 1.0: 'red'}
        }).addTo(map);

        console.log("Heatmap layer added to map");
    }
}

function getCurrentHour() {
    const now = new Date();
    return now.getHours();
}

function startHeatmapUpdates() {
    updateHeatmap(getCurrentHour());

    setInterval(() => {
        updateHeatmap(getCurrentHour());
    }, 3600000);
}

// Start heatmap updates
startHeatmapUpdates();

let hours = 0;
let minutes = 0;
let seconds = 0;
let hundredths = 0;
let control = null;

const hoursSpan = document.querySelector("#hours");
const minutesSpan = document.querySelector("#minutes");
const secondsSpan = document.querySelector("#seconds");
const buttonCounter = document.querySelector("#buttonCounter");

async function startCounter() {
    const driverId = await window.loader.getDriverId();
    console.log(driverId);
    if (!control) {
        try {
            control = setInterval(cronometro, 10);
            buttonCounter.classList.remove("start");
            buttonCounter.classList.add("finish");
            buttonCounter.innerHTML = "fin";
        } catch {
            alert("no hay conexion con los sensores");
        }
    } else {
        try {
            clearInterval(control);
            buttonCounter.classList.add("start");
            buttonCounter.classList.remove("finish");
            buttonCounter.innerHTML = "inicio";
            control = null;
            secondsSpan.innerHTML = "00";
            minutesSpan.innerHTML = "00";
            hoursSpan.innerHTML = "00";
            hundredths = 0;
            seconds = 0;
            minutes = 0;
            hours = 0;
        } catch {
            alert("no hay conexion con los sensores");
        }
    }
}

function cronometro() {
    if (hundredths < 99) {
        hundredths++;
    }
    if (hundredths == 99) {
        hundredths = -1;
    }
    if (hundredths == 0) {
        seconds++;
        if (seconds < 10) { seconds = "0" + seconds; }
        secondsSpan.innerHTML = seconds;
    }
    if (seconds == 59) {
        seconds = -1;
    }
    if ((hundredths == 0) && (seconds == 0)) {
        minutes++;
        if (minutes < 10) { minutes = "0" + minutes; }
        minutesSpan.innerHTML = minutes;
    }
    if (minutes == 59) {
        minutes = -1;
    }
    if ((hundredths == 0) && (seconds == 0) && (minutes == 0)) {
        hours++;
        if (hours < 10) { hours = "0" + hours; }
        hoursSpan.innerHTML = hours;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateHeatmap(getCurrentHour());
});