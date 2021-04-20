const { exec, spawn } = require('child_process');

playMusic();

function playMusic() {
  const player2 = spawn('omxplayer', [ "/home/pi/JackTheAssistant/resources/Bells.mp3", "-o", "both"]);

  setTimeout(() => {
    player2.stdin.write('q');
  }, 2000)
}
