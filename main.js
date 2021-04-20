require("dotenv").config();
var gpio = require('rpi-gpio');
const delay = require('delay');
const Sonus = require("sonus");
const speech = require("@google-cloud/speech");
const say = require('say');
const { exec, spawn } = require('child_process');
var audioPlayer;
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
textToSpeech("Hi, I am Jack")

sonus.on("hotword", (index, keyword) => {
  console.log("!", index, keyword)
  spawn('omxplayer', ["/home/pi/JackTheAssistant/resources/ding.mp3", "-o", "both"]);
});


sonus.on("partial-result", (result) => console.log("Partial", result));

sonus.on("error", (error) => console.log(error));

sonus.on("final-result", (result) => {
  console.log("Final", result);
  var data = result.toLowerCase();
  console.log(data)
  if (data.includes("forward")) {
    gpioControl(1);
  }
  else if (data.includes("backward")) {
    gpioControl(2);
  }
  else if (data.includes("right")) {
    gpioControl(3);
  }
  else if (data.includes("left")) {
    gpioControl(4);
  }
  else if (data.includes("one") || data.includes("1")) {
    gpioControl(5);
  }
  else if (data.includes("two")|| data.includes("2")) {
    gpioControl(6);
  }
  else if (data.includes("three")|| data.includes("3")) {
    gpioControl(7);
  }
  else {
    textToSpeech("Sorry, I couldn't understand, please try again")
    gpio.write(12, false);
    gpio.write(13, false);
    gpio.write(24, false);
    gpio.write(04, false);
  }
});

async function textToSpeech(phrase) {
  say.speak(phrase, 0.7);
}

async function musicPlayer(state = false, duration = 0) {
  if (state && duration == 5)
    audioPlayer = spawn('omxplayer', ["/home/pi/JackTheAssistant/resources/bell.mp3", "-o", "both"]);
  else if (state && duration > 5)
    audioPlayer = spawn('omxplayer', ["/home/pi/JackTheAssistant/resources/bell3.mp3", "-o", "both"]);
  else
    if (audioPlayer) audioPlayer.stdin.write('q');
}

async function forwardMove(delayTime) {
  gpio.write(12, false);
  gpio.write(13, false);
  gpio.write(24, false);
  gpio.write(04, true);
  await delay(delayTime);
  gpio.write(12, false);
  gpio.write(13, false);
  gpio.write(24, false);
  gpio.write(04, false);
}

async function backwardMove(delayTime) {
  gpio.write(12, false);
  gpio.write(13, false);
  gpio.write(24, true);
  gpio.write(04, false);
  await delay(delayTime);
  gpio.write(12, false);
  gpio.write(13, false);
  gpio.write(24, false);
  gpio.write(04, false);
}

async function rightMove(delayTime) {
  gpio.write(12, false);
  gpio.write(13, true);
  gpio.write(24, false);
  gpio.write(04, false);
  await delay(delayTime);
  gpio.write(12, false);
  gpio.write(13, false);
  gpio.write(24, false);
  gpio.write(04, false);
}
async function leftMove(delayTime) {
  gpio.write(12, true);
  gpio.write(13, false);
  gpio.write(24, false);
  gpio.write(4, false);
  await delay(delayTime);
  gpio.write(12, false);
  gpio.write(13, false);
  gpio.write(24, false);
  gpio.write(04, false);
}
async function stop() {
  gpio.write(12, false);
  gpio.write(13, false);
  gpio.write(24, false);
  gpio.write(04, false);
}



async function gpioControl(number) {
  try {
    switch (number) {
      case 1:
        musicPlayer(true, 5);
        await forwardMove(5000);
        musicPlayer();
        break;
      case 2:
        musicPlayer(true, 5);
        await backwardMove(5000);
        musicPlayer(false, 0);
        break;
      case 3:
        musicPlayer(true, 5)
        await rightMove(5000)
        musicPlayer(false, 0)
        break;
      case 4:
        musicPlayer(true, 5)
        await leftMove(5000)
        musicPlayer(false, 0)
        break;
      case 5:
        musicPlayer(true, 15)
        await forwardMove(10000)
        await leftMove(5000)
        musicPlayer(false, 0)
        break;
      case 6:
        musicPlayer(true, 15)
        await rightMove(5000)
        await forwardMove(5000)
        await leftMove(5000)
        musicPlayer(false, 0)
        break;
      case 7:
        musicPlayer(true, 15)
        await rightMove(5000)
        await forwardMove(5000)
        await leftMove(5000)
        musicPlayer(false, 0)
        break;
        
      default:
        stop()
        break;
    }
  } catch (e) {
    console.log(e);
  }
}
