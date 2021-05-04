// script.js

const img = new Image(); // used to load image from <input> and draw to canvas


const canvas = document.getElementById('user-image');
const can = canvas.getContext('2d');
var sButton = document.querySelector('button[type="submit"]');
var rButton = document.querySelector('button[type="reset"]');
var tButton = document.querySelector('button[type="button"]');
//voice options
var optionButton = document.getElementById("voice-selection");
//text to speech object
var synth = window.speechSynthesis;
//to populate voice list
var inputForm = document.querySelector('form');
var inputTxt = document.querySelector('input');
var voiceSelect = document.querySelector('select');


// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {
//clear canvas
  can.clearRect(0, 0, canvas.width, canvas.height);
  //fill with black
  can.fillStyle = "black";
  can.fillRect(0, 0, canvas.width, canvas.height);
  //get dimensions
  var list = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  //draw image to canvas
  can.drawImage(img, list['startX'], list['startY'], list['width'], list['height']);
  can.globalCompositeOperation = 'source-over';
});
//load img.src
var picture = document.getElementById('image-input');
picture.addEventListener('change', ()=> {
  img.src = picture.value.replace("C:\\fakepath\\", "");
});

//POPULATE VOICE LIST
optionButton.disabled = false;
var select = document.getElementById("voice-selection");

function populateVoiceList() {
  var voices = synth.getVoices();

  for(var i = 0; i < voices.length ; i++) {
    var option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if(voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}
//END POPULATE VOICE LIST

//submit button, creates meme
function subBut(event) {
  var topT = document.getElementById('text-top');
  var botT = document.getElementById('text-bottom');
  can.font = "20px Arial";
  can.textAlign = "center";
  can.fillStyle = "white";
  can.fillText(topT.value, canvas.width/2,canvas.height/4);
  can.fillText(botT.value, canvas.width/2, canvas.height/4*3);
  sButton.disabled = true;
  rButton.disabled = false;
  tButton.disabled = false;
  event.preventDefault();
}
//call subBut when button is clicked
var submitButton = document.getElementById('generate-meme');
submitButton.addEventListener('submit', subBut);


//read button, reads top and bottom text
function readBut(event) {
  var currVal = bar.value;
  var topT = document.getElementById('text-top');
  var botT = document.getElementById('text-bottom');
  console.log(topT.value);
  console.log(botT.value);
  //assign string to object "utter"
  var utter = new SpeechSynthesisUtterance(topT.value, botT.value);
  window.speechSynthesis.cancel();

//volume slider
  if(currVal > 90) {
    //update volume value
    utter.volume = 1;
  } else if(currVal > 70) {
    //update volume value
    utter.volume = 0.75;
  } else if(currVal > 50) {
    //update volume value
    utter.volume = 0.55;
  } else if(currVal > 35) {
    //update volume value
    utter.volume = 0.33;
  }else if(currVal > 0) {
    //update volume value
    utter.volume = 0.20;
  }else {
    //update volume value
    utter.volume = 0;
  }
  event.preventDefault();
  //choose voice
  var voices = synth.getVoices();
  var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
  for(var i = 0; i < voices.length ; i++) {
    if(voices[i].name === selectedOption) {
      utter.voice = voices[i];
    }
  }
  
  //SPEAK
  synth.speak(utter);
  
  sButton.disabled = true;
  rButton.disabled = false;
  tButton.disabled = false;
  event.preventDefault();
}
//call readBut when button is clicked
var readButton = document.querySelector('button[type="button"]');
readButton.addEventListener('click', readBut);

//clear button
function clearBut(event) {
  can.clearRect(0, 0, canvas.width, canvas.height);
  sButton.disabled = false;
  rButton.disabled = true;
  tButton.disabled = true;
}

//var clearButton = document.getElementById
rButton.addEventListener('click', clearBut);

//volume slider
function updateValue(event) {
  var currVal = bar.value;
  if(currVal > 67) {
    //update volume icon
    volImg.src = "icons/volume-level-3.svg";
  } else if(currVal > 33) {
    //update volume icon
    volImg.src = "icons/volume-level-2.svg";
  } else if(currVal > 0) {
    //update volume icon
    volImg.src = "icons/volume-level-1.svg";
  
  } else {
    //update volume icon
    volImg.src = "icons/volume-level-0.svg";
  }
  event.preventDefault();
}

var bar = document.querySelector('input[type="range"]');
var volImg = document.querySelector('img');
bar.addEventListener('input', updateValue);


/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
