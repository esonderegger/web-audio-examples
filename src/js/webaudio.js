var peakMeter = require('web-audio-peak-meter');
var audioControls = require('html5-audio-controls');

var audioCtx = new window.AudioContext();
var myAudio = document.getElementById('htmlAudio');
var sourceNode = audioCtx.createMediaElementSource(myAudio);
sourceNode.connect(audioCtx.destination);

playerElement = document.getElementById('playerControls');
audioControls.createControls(playerElement, '#777', '#555');
dynElement = document.getElementById('dynamicPeaks');
var meterNode = peakMeter.createMeterNode(sourceNode, audioCtx);
var meterOptions = {
  fontSize: 12,
  backgroundColor: '#404',
  dbRange: 48,
  dbTickSize: 6
};
peakMeter.createMeter(dynElement, meterNode, meterOptions);
