let model;
let raciones = 0;
let alimento = "";

const RATIO = 4;
const FS = 50;
const OBJETIVO = 130;

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");

async function iniciarCamara(){

const stream = await navigator.mediaDevices.getUserMedia({
video:{ facingMode:"environment" }
});

video.srcObject = stream;

}

async function cargarModelo(){

model = await mobilenet.load();

console.log("Modelo IA cargado");

}

iniciarCamara();
cargarModelo();

async function capturar(){

const ctx = canvas.getContext("2d");

canvas.width = video.videoWidth;
canvas.height = video.videoHeight;

ctx.drawImage(video,0,0);

await reconocer();

}

async function reconocer(){

const prediction = await model.classify(canvas);

alimento = prediction[0].className.split(",")[0];

console.log("Detectado:", alimento);

await buscarCarbohidratos();

}

async function buscarCarbohidratos(){

const url =
`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${alimento}&json=1`;

const response = await fetch(url);

const data = await response.json();

if(data.products.length === 0){

alert("Alimento no encontrado");
return;

}

const carbs =
data.products[0].nutriments.carbohydrates_100g;

raciones = carbs / 10;

document.getElementById("resultado").innerHTML =
`
Alimento detectado: ${alimento}<br>
Carbohidratos: ${carbs}g<br>
Raciones: ${raciones.toFixed(2)}
`;

}

function calcular(){

const glucosa =
parseFloat(document.getElementById("glucose").value);

const insulinaComida = raciones / RATIO;

let correctora =
(glucosa - OBJETIVO) / FS;

if(correctora < 0) correctora = 0;

const total =
insulinaComida + correctora;

document.getElementById("resultado").innerHTML +=
`
<br>
Insulina comida: ${insulinaComida.toFixed(2)}<br>
Insulina correctora: ${correctora.toFixed(2)}<br>
Insulina total: ${total.toFixed(2)}
`;

}
