require("dotenv").config();
var gpio = require('rpi-gpio');
const delay = require('delay');
const Sonus = require("sonus");
const speech = require("@google-cloud/speech");
gpio.setMode(gpio.MODE_BCM);
gpio.setup(12, gpio.DIR_LOW);
gpio.setup(13, gpio.DIR_LOW);
gpio.setup(24, gpio.DIR_LOW);
gpio.setup(04, gpio.DIR_LOW);

const client = new speech.SpeechClient({
  projectId: process.env.GOOGLE_APPLICATION_PROJECT_ID,
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});


const hotwords = [{ file: "./resources/jack.pmdl", hotword: "jack" }];
const language = "en-US";
const sonus = Sonus.init(
  { hotwords, language: language, recordProgram: "arecord" },
  client
);

Sonus.start(sonus);
console.log('Say "' + hotwords[0].hotword + '"...');

sonus.on("hotword", (index, keyword) => console.log(">", index, keyword));

sonus.on("partial-result", (result) => console.log("Partial", result));

sonus.on("error", (error) => console.log(error));

sonus.on("final-result", (result) => {
  console.log("Final", result);
  var data = result.toLowerCase();
  if(data.includes("forward")){
    gpioControl(1);
    }
  else if(data.includes("backward")){

    gpioControl(2);
    }
  else if(data.includes("right")){
    gpioControl(3); 
    }
  else if(data.includes("left")){
    gpioControl(4);
    }
  else {
    gpio.write(12, false);
    gpio.write(13, false);
    gpio.write(24, false);
    gpio.write(04, false);
    }
});

async function gpioControl(number) {
    switch(number) {
        case 1:
            gpio.write(12, false);
            gpio.write(13, false);
            gpio.write(24, false);
            gpio.write(04, true);
            await delay(5000);
            gpio.write(12, false);
            gpio.write(13, false);
            gpio.write(24, false);
            gpio.write(04, false);
        break;
        case 2:
            gpio.write(12, false);
            gpio.write(13, false);
            gpio.write(24, true);
            gpio.write(04, false);
            await delay(5000);
            gpio.write(12, false);
            gpio.write(13, false);
            gpio.write(24, false);
            gpio.write(04, false);
        break;
        case 3:
            gpio.write(12, false);
            gpio.write(13, true);
            gpio.write(24, false);
            gpio.write(04, false);
            await delay(5000);
            gpio.write(12, false);
            gpio.write(13, false);
            gpio.write(24, false);
            gpio.write(04, false);
        break;
        case 4:
            gpio.write(12,true);
            gpio.write(13,false);
            gpio.write(24,false);
            gpio.write(4,false);
            await delay(5000);
            gpio.write(12, false);
            gpio.write(13, false);
            gpio.write(24, false);
            gpio.write(04, false);
            break;
        default:
            gpio.write(12, false);
            gpio.write(13, false);
            gpio.write(24, false);
            gpio.write(04, false);
        break;
    }
}
