var MM = MM || {};

MM.soundCloudID = "3b2585ef4a5eff04935abe84aad5f3f3";
MM.clientID = "client_id=3b2585ef4a5eff04935abe84aad5f3f3";
MM.soundcloudURL = 'https://api.soundcloud.com/tracks/293';


MM.audioContext = new AudioContext();
MM.audioElement = new Audio();
MM.audioElement.crossOrigin = 'anonymous';

MM.getFrequencies = function() {
  analyser.getByteFrequencyData(frequencyData);
  return frequencyData;
};

MM.getStream = $.ajax({
  url: MM.soundcloudURL + '?' + MM.clientID
}).done(function(res){
  MM.streamURL = res.stream_url + '?' + MM.clientID;
  MM.audioElement.src = MM.streamURL;

  MM.source = MM.audioContext.createMediaElementSource(MM.audioElement);
  MM.source.connect(MM.audioContext.destination);

  MM.analyser = MM.audioContext.createAnalyser();
  MM.analyser.fftSize = 128;
  MM.analyser.smoothingTimeConstant = 0.3;

  MM.source.connect(MM.analyser);

  MM.arrTimeDomainData = new Uint8Array(MM.analyser.frequencyBinCount);
  MM.arrFrequencyData = new Uint8Array(MM.analyser.frequencyBinCount);
  MM.javascriptNode = MM.audioContext.createScriptProcessor(2048, 1, 1);
  MM.analyser.connect(MM.javascriptNode);
  MM.javascriptNode.connect(MM.audioContext.destination);
});

$('#play').on('click', function() {
  MM.audioElement.play();
  MM.javascriptNode.onaudioprocess = function() {

    // copies the current waveform, or time-domain
    MM.analyser.getByteTimeDomainData(MM.arrTimeDomainData);

    // current frequency data
    // we will use this for the chart
    MM.analyser.getByteFrequencyData(MM.arrFrequencyData);
  };
});

$('#stop').on('click', function() {
  MM.audioElement.pause();
});

$('#snapshot').on('click', function() {
  console.log(MM.arrFrequencyData);
  console.log(MM.arrTimeDomainData);

  drawStuff();
});


// d3.select('#blob-svg').selectAll('rect')
// .data(MM.arrFrequencyData)
// .enter()
// .append('rect')
// .attr('x', function(d) { return d.x; })
// .attr('y', function(d) { return d.y; })
// .attr('height', function(d) { return 255 - d.x; })
// .attr('width', 25)
// .style('fill', 'red');


// d3.select('#blob-svg').selectAll('rect')
// .data(MM.arrFrequencyData)
// .enter()
// .append('rect')
// .attr('x', 20 )
// .attr('y', 20 )
// .attr('height', 30 )
// .attr('width', 25 )
// .style('fill', 'red');



var drawStuff = function() {

  var width = 800;
  var height = 400;

  var y = d3.scale
  .linear()
  .range([height, 0])
  .domain([0, d3.max(MM.arrFrequencyData, function(d) { return d; })]);


  console.log(y(100));

  var chart = d3.select('#blob-svg')
  .attr('width', width)
  .attr('height', height);

  var barWidth = width / MM.arrFrequencyData.length;

  var bar = chart.selectAll('g')
  .data(MM.arrFrequencyData)
  .enter()
  .append('g')
  .attr('transform', function(d, i) { return 'translate(' + (i * barWidth) +  ',0)'; });

  bar.append('rect')
  .attr('y', function(d) { return y(d); })
  .attr('height', function(d) { return height - y(d); })
  .attr('width', barWidth - 1);

  bar.append('text')
  .attr('x', barWidth / 2)
  .attr('y', function(d) { return y(d) + 3; })
  .attr('dy', '0.75em')
  .text(function (d) { return d; });
};
