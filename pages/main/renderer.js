ruta_tuxtla = [
    [16.7548, -93.1074],
    [16.7550, -93.1075],
    [16.7552, -93.1077],
    [16.7554, -93.1076],
    [16.7555, -93.1078],
    [16.7556, -93.1080],
    [16.7558, -93.1082],
    [16.7559, -93.1084],
    [16.7560, -93.1086],
    [16.7561, -93.1088],
    [16.7562, -93.1090],
    [16.7564, -93.1091],
    [16.7565, -93.1093],
    [16.7566, -93.1095],
    [16.7567, -93.1097],
    [16.7569, -93.1098],
    [16.7570, -93.1100],
    [16.7571, -93.1102],
    [16.7573, -93.1104],
    [16.7574, -93.1106],
    [16.7575, -93.1107],
    [16.7576, -93.1109],
    [16.7577, -93.1111],
    [16.7578, -93.1112],
    [16.7579, -93.1114],
    [16.7580, -93.1115],
    [16.7581, -93.1117],
    [16.7582, -93.1119],
    [16.7583, -93.1120],
    [16.7584, -93.1122],
    [16.7585, -93.1123],
    [16.7586, -93.1125],
    [16.7587, -93.1126],
    [16.7588, -93.1128],
    [16.7589, -93.1129],
    [16.7590, -93.1131],
    [16.7591, -93.1132],
    [16.7592, -93.1134],
    [16.7593, -93.1135],
    [16.7594, -93.1136],
    [16.7595, -93.1138],
    [16.7596, -93.1139],
    [16.7597, -93.1140],
    [16.7598, -93.1142],
    [16.7599, -93.1143],
    [16.7600, -93.1144],
    [16.7601, -93.1146],
    [16.7602, -93.1147],
    [16.7603, -93.1148],
    [16.7604, -93.1150],
    [16.7605, -93.1151]
]

const map = L.map('map').setView([16.7510073, -93.0998758], 13)
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
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

var marker = L.marker([16.7510073, -93.0998758], {icon: taxiIcon}).addTo(map);

var circle = L.circle([16.7510073, -93.0998758], {
    color: 'red',
    fillColor: '#f03',
    fillOpacity: 0.5,
    radius: 500
}).addTo(map);

var marker2
setTimeout(()=>{
    marker2 = L.marker([16.0, -93.0]).addTo(map);
    
console.log('negro')
},5000)


