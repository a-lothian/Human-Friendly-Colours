// ── Word dictionaries ──
const HUE_WORDS = [

  // Red-Oranges (21-35)
  "Flame","Fire","Blaze","Coral","Salmon","Peach","Apricot","Sunset",
  "Dawn","Amber","Honey","Caramel","Toffee","Bronze","Toast",
  // Oranges (36-50)
  "Tangerine","Clementine","Pumpkin","Carrot","Ginger","Saffron","Marigold",
  "Persimmon","Papaya","Mango","Tiger","Fox","Canyon","Desert","Dune",
  // Yellow-Oranges (51-65)
  "Gold","Brass","Wheat","Corn","Mustard","Curry","Turmeric","Crocus Saffron",
  "Acacia Honey","Butterscotch","Camel","Sand","Beach","Savanna","Prairie",
  // Yellows (66-85)
  "Lemon","Citrus","Canary","Daffodil","Sunflower","Dandelion","Butter",
  "Cream","Vanilla","Banana","Pineapple","Champagne","Sun","Star","Lightning",
  "Sulfur","Neon","Highlighter","Taxi","School",
  // Yellow-Greens (86-105)
  "Lime","Chartreuse","Spring","Pear","Olive","Moss","Fern","Sage",
  "Celery","Pistachio","Avocado","Kiwi","Green Apple","Leaf","Sprout",
  "Grass","Meadow","Valley","Garden","Herb",
  // Greens (106-130)
  "Jade","Emerald","Malachite","Viridian","Kelly","Forest","Pine","Evergreen",
  "Jungle","Rainforest","Ivy","Clover","Shamrock","Mint","Basil",
  "Eucalyptus","Tea","Seaweed","Algae","Green Moss","Lichen","Frog","Lizard",
  "Dragon","Goblin",
  // Cyan-Greens (131-150)
  "Teal","Seafoam","Aquamarine","Turquoise","Cyan","Caribbean","Lagoon",
  "Tropical","Oasis","Pool","Glacier","Ice","Frost","Arctic","Polar",
  "Cool Mint","Spearmint","Wintergreen","Verdigris","Patina",
  // Cyans (151-170)
  "Sky","Azure","Cerulean","Pacific","Ocean","Sea","Wave","Marina",
  "Harbor","Bay","Coast","Tide","Deep","Abyss","Trench","Reef",
  "Aqua","Water","Rain","River",
  // Cyan-Blues (171-190)
  "Cobalt","Sapphire","Lapis","Persian","Egyptian","Mediterranean","Aegean",
  "Adriatic","Fjord","Lake","Pond","Blue Spring","Stream","Falls","Cascade",
  "Powder","Periwinkle","Cornflower","Delft","Denim",
  // Blues (191-210)
  "Blue","Navy","Indigo","Midnight","Royal","Imperial","Prussian","Steel",
  "Slate","Storm","Thunder","Twilight","Dusk","Evening","Night","Stellar",
  "Nebula","Galaxy","Space","Cosmic",
  // Blue-Purples (211-225)
  "Violet","Iris","Blue Periwinkle","Lavender","Lilac","Wisteria","Heather",
  "Hyacinth","Bluebell","Delphinium","Lupine","Purple Crocus","Aster","Thistle","Amethyst",
  // Purples (226-240)
  "Purple","Plum","Eggplant","Aubergine","Grape","Mulberry","Blackberry",
  "Boysenberry","Elderberry","Orchid","Fuchsia","Deep Magenta","Dark Violet","Deep Royal","Majestic",
  // Red-Purples (241-255)
  "Magenta","Raspberry","Cranberry","Rose","Pink","Fuschia","Hot Pink",
  "Cerise","Amaranth","Fandango","Pomegranate","Cyclamen","Peony","Dahlia","Cosmos",
    // Reds (0-20)
  "Ruby","Crimson","Scarlet","Cardinal","Cherry","Blood","Wine","Burgundy",
  "Garnet","Brick","Rust","Cinnamon","Copper","Auburn","Mahogany","Sienna",
  "Terra","Clay","Autumn","Harvest","Ember",
];

const BRIGHTNESS_WORDS = [
  "Abyssal","Pitch","Shadowy","Dim","Gloomy","Dusky","Hazy","Muted",
  "Clear","Fine","Bright","Luminous","Radiant","Blazing","Shining","Spectral"
];

const SATURATION_WORDS = [
  "Dead","Gray","Washed","Pale","Weak","Soft","Mild","Toned",
  "Deep","Rich","Strong","Vivid","Electric","Neon","Pure","Hyper"
];

// ── Reverse lookup maps (lowercase → index, first occurrence wins) ──
function buildLookup(words) {
  const map = {};
  for (let i = 0; i < words.length; i++) {
    const key = words[i].toLowerCase();
    if (!(key in map)) map[key] = i;
  }
  return map;
}
const HUE_LOOKUP = buildLookup(HUE_WORDS);
const BRIGHTNESS_LOOKUP = buildLookup(BRIGHTNESS_WORDS);
const SATURATION_LOOKUP = buildLookup(SATURATION_WORDS);

// ── HSV → RGB ──
function hsvToRgb(h, s, v) {
  // h: 0-360, s: 0-1, v: 0-1
  const c = v * s;
  const x = c * (1 - Math.abs((h / 60) % 2 - 1));
  const m = v - c;
  let r, g, b;
  if (h < 60)       { r = c; g = x; b = 0; }
  else if (h < 120) { r = x; g = c; b = 0; }
  else if (h < 180) { r = 0; g = c; b = x; }
  else if (h < 240) { r = 0; g = x; b = c; }
  else if (h < 300) { r = x; g = 0; b = c; }
  else              { r = c; g = 0; b = x; }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255)
  ];
}

function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
}

// ── RGB → HSV ──
function rgbToHsv(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0, s = max === 0 ? 0 : d / max, v = max;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s, v }; // h: 0-360, s: 0-1, v: 0-1
}

// ── Quantised HSV from indices ──
function indicesToHsv(hueIdx, satIdx, valIdx) {
  return {
    h: (hueIdx / 256) * 360,
    s: satIdx / 15,
    v: valIdx / 15
  };
}

// Continuous HSV → quantised indices
function hsvToIndices(h, s, v) {
  const hueIdx = Math.round((h / 360) * 255) % 256;
  const satIdx = Math.round(s * 15);
  const valIdx = Math.round(v * 15);
  return { hueIdx, satIdx, valIdx };
}

function indicesToPhrase(hueIdx, satIdx, valIdx) {
  return `${BRIGHTNESS_WORDS[valIdx]} ${SATURATION_WORDS[satIdx]} ${HUE_WORDS[hueIdx]}`;
}

// ── Hue slider ──
const hueCanvas = document.getElementById('hueCanvas');
const hueCtx = hueCanvas.getContext('2d');
const hueMarker = document.getElementById('hueMarker');

function drawHueSlider() {
  const w = hueCanvas.width, h = hueCanvas.height;
  const img = hueCtx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const hue = (y / (h - 1)) * 360;
    const [r, g, b] = hsvToRgb(hue, 1, 1);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = 255;
    }
  }
  hueCtx.putImageData(img, 0, 0);
}
drawHueSlider();

function updateHueMarker() {
  const y = (currentHue / 255) * 256;
  hueMarker.style.top = y + 'px';
}

// ── SV picker ──
const svCanvas = document.getElementById('svCanvas');
const svCtx = svCanvas.getContext('2d');
const svMarker = document.getElementById('svMarker');

// Continuous values for smooth picker (hue: 0-255, sat: 0-15, val: 0-15)
let currentHue = 0;
let currentSat = 15;
let currentVal = 15;

function drawSVCanvas(hue) {
  const size = 256;
  const img = svCtx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const s = x / (size - 1);
      const v = 1 - y / (size - 1);
      const [r, g, b] = hsvToRgb(hue, s, v);
      const i = (y * size + x) * 4;
      img.data[i] = r; img.data[i+1] = g; img.data[i+2] = b; img.data[i+3] = 255;
    }
  }
  svCtx.putImageData(img, 0, 0);
}
drawSVCanvas(0);

function updateSVMarker() {
  const x = (currentSat / 15) * 255;
  const y = (1 - currentVal / 15) * 255;
  svMarker.style.left = x + 'px';
  svMarker.style.top = y + 'px';
}
updateSVMarker();
updateHueMarker();

function updateDisplay(skipRgbSync) {
  // Quantized values for preview, phrase, and hex
  const qHue = Math.round(currentHue) % 256;
  const qSat = Math.min(15, Math.max(0, Math.round(currentSat)));
  const qVal = Math.min(15, Math.max(0, Math.round(currentVal)));

  const { h, s, v } = indicesToHsv(qHue, qSat, qVal);
  const [r, g, b] = hsvToRgb(h, s, v);
  const hex = rgbToHex(r, g, b);

  document.getElementById('colourPreview').style.backgroundColor = hex;
  document.getElementById('phraseDisplay').textContent = indicesToPhrase(qHue, qSat, qVal);
  document.getElementById('hexDisplay').textContent = 'Hex: ' + hex;
  document.getElementById('rgbDisplay').textContent = `RGB: ${r}, ${g}, ${b}`;

  // Sync RGB sliders (skip when update comes from RGB sliders to avoid snapping)
  if (!skipRgbSync) {
    document.getElementById('sliderR').value = r;
    document.getElementById('sliderG').value = g;
    document.getElementById('sliderB').value = b;
  }
  document.getElementById('valR').textContent = r;
  document.getElementById('valG').textContent = g;
  document.getElementById('valB').textContent = b;

  // Update RGB slider track gradients
  document.getElementById('sliderR').style.background =
    `linear-gradient(to right, rgb(0,${g},${b}), rgb(255,${g},${b}))`;
  document.getElementById('sliderG').style.background =
    `linear-gradient(to right, rgb(${r},0,${b}), rgb(${r},255,${b}))`;
  document.getElementById('sliderB').style.background =
    `linear-gradient(to right, rgb(${r},${g},0), rgb(${r},${g},255))`;
}
updateDisplay();

// ── Hue slider interaction ──
function pickFromHue(e) {
  const rect = hueCanvas.getBoundingClientRect();
  const y = Math.max(0, Math.min(255, e.clientY - rect.top));
  currentHue = (y / 255) * 255;
  drawSVCanvas((currentHue / 256) * 360);
  updateHueMarker();
  updateDisplay();
}

let hueDown = false;
hueCanvas.addEventListener('mousedown', e => { hueDown = true; pickFromHue(e); });
window.addEventListener('mousemove', e => { if (hueDown) pickFromHue(e); });
window.addEventListener('mouseup', () => { hueDown = false; });

// ── SV picker interaction ──
function pickFromSV(e) {
  const rect = svCanvas.getBoundingClientRect();
  const x = Math.max(0, Math.min(255, e.clientX - rect.left));
  const y = Math.max(0, Math.min(255, e.clientY - rect.top));
  currentSat = (x / 255) * 15;
  currentVal = (1 - y / 255) * 15;
  updateSVMarker();
  updateDisplay();
}

let svDown = false;
svCanvas.addEventListener('mousedown', e => { svDown = true; pickFromSV(e); });
window.addEventListener('mousemove', e => { if (svDown) pickFromSV(e); });
window.addEventListener('mouseup', () => { svDown = false; });

// ── Text input decoding ──
const phraseInput = document.getElementById('phraseInput');

phraseInput.addEventListener('input', () => {
  const raw = phraseInput.value.trim();
  if (!raw) {
    phraseInput.className = '';
    return;
  }

  const words = raw.split(/\s+/);
  if (words.length < 3) {
    phraseInput.className = 'invalid';
    return;
  }

  const brightnessWord = words[0].toLowerCase();
  const saturationWord = words[1].toLowerCase();
  const hueWord = words.slice(2).join(' ').toLowerCase();

  const valIdx = BRIGHTNESS_LOOKUP[brightnessWord];
  const satIdx = SATURATION_LOOKUP[saturationWord];
  const hueIdx = HUE_LOOKUP[hueWord];

  if (valIdx === undefined || satIdx === undefined || hueIdx === undefined) {
    phraseInput.className = 'invalid';
    return;
  }

  phraseInput.className = 'valid';
  currentHue = hueIdx;
  currentSat = satIdx;
  currentVal = valIdx;
  drawSVCanvas((currentHue / 256) * 360);
  updateHueMarker();
  updateSVMarker();
  updateDisplay();
});

// ── RGB slider interaction ──
function onRgbSliderInput() {
  const r = parseInt(document.getElementById('sliderR').value);
  const g = parseInt(document.getElementById('sliderG').value);
  const b = parseInt(document.getElementById('sliderB').value);
  const { h, s, v } = rgbToHsv(r, g, b);
  currentHue = (h / 360) * 255;
  currentSat = s * 15;
  currentVal = v * 15;
  drawSVCanvas((currentHue / 256) * 360);
  updateHueMarker();
  updateSVMarker();
  updateDisplay(true);
}

document.getElementById('sliderR').addEventListener('input', onRgbSliderInput);
document.getElementById('sliderG').addEventListener('input', onRgbSliderInput);
document.getElementById('sliderB').addEventListener('input', onRgbSliderInput);

// ── Copy buttons ──
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const text = target.textContent.replace(/^(Hex: |RGB: )/, '');
    navigator.clipboard.writeText(text);
    btn.classList.add('copied');
    setTimeout(() => btn.classList.remove('copied'), 1000);
  });
});
