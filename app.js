const RATIO = 4;
const FS = 50;
const OBJETIVO = 130;

let alimentoDetectado = null;
let raciones = 0;

async function iniciarCamara(){

const video = document.getElementById("video");

const stream = await navigator.mediaDevices.getUserMedia({
video: { facingMode: "environment" }
});

video.srcObject = stream;

}

iniciarCamara();

async function tomarFoto(){

const video = document.getElementById("video");

const canvas = document.createElement("canvas");

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

const ctx = canvas.getContext("2d");

ctx.drawImage(video, 0, 0);

const image = canvas.toDataURL();

await reconocerAlimento(image);

}

async function reconocerAlimento(image){

// ejemplo provisional
alimentoDetectado = "pizza";

await consultarBaseDatos(alimentoDetectado);

}

async function consultarBaseDatos(nombre){

const url =
`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${nombre}&search_simple=1&json=1`;

const response = await fetch(url);

const data = await response.json();

const carbs =
data.products[0].nutriments.carbohydrates_100g;

raciones = carbs / 10;

}

function calcularInsulina(){

const glucose =
parseFloat(document.getElementById("glucose").value);

const insulinaComida = raciones / RATIO;

let insulinaCorrectora =
(glucose - OBJETIVO) / FS;

if(insulinaCorrectora < 0)
insulinaCorrectora = 0;

const total =
insulinaComida + insulinaCorrectora;

document.getElementById("resultado").innerHTML =

`
Alimento: ${alimentoDetectado}<br>
Raciones: ${raciones.toFixed(2)}<br>
Insulina comida: ${insulinaComida.toFixed(2)}<br>
Insulina correctora: ${insulinaCorrectora.toFixed(2)}<br>
Insulina total: ${total.toFixed(2)}
`;

}
