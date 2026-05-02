const map = L.map('map').setView([17.3850, 78.4867], 14);

L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

const busIcon = L.icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/3448/3448339.png',
    iconSize: [40, 40]
});

let busMarker = L.marker([17.3850, 78.4867], { icon: busIcon }).addTo(map)
    .bindPopup('<b>College Bus A-1</b><br>Status: Moving')
    .openPopup();