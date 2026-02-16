// Tabla simple de alimentos -> gramos de alimento por 1 ración de HC
// Basado en tu PDF (ejemplos, amplía con más filas):
const foodDatabase = [
  { name: "Pan blanco", gramsPerExchange: 20 },   // 20 g pan ≈ 1 ración
  { name: "Manzana", gramsPerExchange: 100 },     // 100 g manzana ≈ 1 ración
  { name: "Melón", gramsPerExchange: 150 },       // 150 g melón ≈ 1 ración
  { name: "Patata cocida", gramsPerExchange: 50 } // 50 g patata ≈ 1 ración
];

const foodListDiv = document.getElementById("foodList");
const addFoodBtn = document.getElementById("addFoodBtn");
const calculateBtn = document.getElementById("calculateBtn");

const gramsPerExchangeInput = document.getElementById("gramsPerExchange");
const insulinPerExchangeInput = document.getElementById("insulinPerExchange");
const targetGlucoseInput = document.getElementById("targetGlucose");
const correctionFactorInput = document.getElementById("correctionFactor");
const currentGlucoseInput = document.getElementById("currentGlucose");

const totalExchangesSpan = document.getElementById("totalExchanges");
const mealInsulinSpan = document.getElementById("mealInsulin");
const correctionInsulinSpan = document.getElementById("correctionInsulin");
const totalInsulinSpan = document.getElementById("totalInsulin");

const platePhotoInput = document.getElementById("platePhoto");
const photoPreviewDiv = document.getElementById("photoPreview");

// --- Foto del plato (solo previsualización) ---
platePhotoInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const img = document.createElement("img");
  img.className = "preview-img";
  img.src = URL.createObjectURL(file);
  photoPreviewDiv.innerHTML = "";
  photoPreviewDiv.appendChild(img);
});

// --- Gestión de alimentos en el plato ---
let foodRows = [];

function createFoodRow() {
  const row = document.createElement("div");
  row.className = "food-row";

  const select = document.createElement("select");
  foodDatabase.forEach((food) => {
    const opt = document.createElement("option");
    opt.value = food.name;
    opt.textContent = `${food.name} (${food.gramsPerExchange} g/ración)`;
    select.appendChild(opt);
  });

  const gramsInput = document.createElement("input");
  gramsInput.type = "number";
  gramsInput.min = "0";
  gramsInput.placeholder = "Gramos en el plato";

  const exchangesSpan = document.createElement("span");
  exchangesSpan.className = "exchanges-span";
  exchangesSpan.textContent = "0 raciones";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.textContent = "X";
  removeBtn.className = "remove-btn";

  row.appendChild(select);
  row.appendChild(gramsInput);
  row.appendChild(exchangesSpan);
  row.appendChild(removeBtn);

  // Actualizar raciones cuando cambian gramos o alimento
  function updateRowExchanges() {
    const food = foodDatabase.find((f) => f.name === select.value);
    const grams = parseFloat(gramsInput.value) || 0;
    if (!food || grams <= 0) {
      exchangesSpan.textContent = "0 raciones";
      return;
    }
    const exchanges = grams / food.gramsPerExchange;
    exchangesSpan.textContent = `${exchanges.toFixed(2)} raciones`;
  }

  gramsInput.addEventListener("input", updateRowExchanges);
  select.addEventListener("change", updateRowExchanges);

  removeBtn.addEventListener("click", () => {
    foodListDiv.removeChild(row);
    foodRows = foodRows.filter((r) => r !== row);
  });

  foodListDiv.appendChild(row);
  foodRows.push(row);
}

addFoodBtn.addEventListener("click", () => {
  createFoodRow();
});

// Crear una fila inicial
createFoodRow();

// --- Cálculo de raciones e insulina ---
calculateBtn.addEventListener("click", () => {
  const gramsPerExchange = parseFloat(gramsPerExchangeInput.value) || 10;
  const insulinPerExchange = parseFloat(insulinPerExchangeInput.value) || 0;
  const targetGlucose = parseFloat(targetGlucoseInput.value) || 100;
  const correctionFactor = parseFloat(correctionFactorInput.value) || 50;
  const currentGlucose = parseFloat(currentGlucoseInput.value) || 0;

  // 1) Raciones totales del plato
  let totalExchanges = 0;
  foodRows.forEach((row) => {
    const select = row.querySelector("select");
    const gramsInput = row.querySelector("input[type='number']");
    const food = foodDatabase.find((f) => f.name === select.value);
    const grams = parseFloat(gramsInput.value) || 0;
    if (!food || grams <= 0) return;
    const exchanges = grams / food.gramsPerExchange;
    totalExchanges += exchanges;
  });

  // 2) Insulina para la comida (HC)
  // Si quieres trabajar directamente con gramos de HC, podrías usar:
  // insulina = (gramosHC / gramosPorRación) * ratio
  const mealInsulin = totalExchanges * insulinPerExchange;

  // 3) Insulina de corrección
  let correctionInsulin = 0;
  if (currentGlucose > targetGlucose && correctionFactor > 0) {
    correctionInsulin = (currentGlucose - targetGlucose) / correctionFactor;
  }

  const totalInsulin = mealInsulin + correctionInsulin;

  totalExchangesSpan.textContent = totalExchanges.toFixed(2);
  mealInsulinSpan.textContent = mealInsulin.toFixed(2);
  correctionInsulinSpan.textContent = correctionInsulin.toFixed(2);
  totalInsulinSpan.textContent = totalInsulin.toFixed(2);
});
