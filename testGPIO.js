//sets gpio in BCM mode and writes HIGH to pin 24 in js

var gpio = require('rpi-gpio');

gpio.setMode(gpio.MODE_BCM);
gpio.setup(24, gpio.DIR_LOW, write);


function write(err) {
    if (err) throw err;
    gpio.write(24, true, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}
