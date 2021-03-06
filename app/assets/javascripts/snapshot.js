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
  console.log('end of getStream');
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


$('#snapshot').on('click', function() {
  console.log(MM.arrFrequencyData);
  console.log(MM.arrTimeDomainData);
  MM.audioElement.pause();

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



  var width = 600;
  var height = 400;

  var y = d3.scale
  .linear()
  .range([height, 0])
  .domain([0, d3.max(MM.arrFrequencyData, function(d) { return d; })]);


  var monsterText = d3.select('.monster-text');
  // console.log(y(100));

  var chart = d3.select('#snapshot-svg')
  .attr('width', width)
  .attr('height', height);

  var old = d3.select('#snapshot-svg').selectAll('g').remove();

  var tooltip = d3.select('.snapshot__tooltip');
  var line1 = d3.select('.snapshot__tooltip--line1');
  var line2 = d3.select('.snapshot__tooltip--line2-details');

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

  // bar.append('circle')
  // .attr('cx', function(d, i) { return (i * barWidth); })
  // .attr('cy', function(d) { return y(d); })
  // .attr('r', 5)
  // .attr('fill', 'red');


  // bar.append("text")
  //     .attr("x", barWidth / 2 )
  //     .attr("y", function(d) { return y(d) + 3; })
  //     .attr("dy", '-10')
  //     .attr('fill', 'white')
  //     .text(function(d) {
  //       var text = (d / 255 * 100).toFixed(1) + '%';
  //       return text;
  //     });


  bar.on('mouseover', function(data, i) {
    var total = 44100;
    var bin = 44100 / 128; // we divide by fftSize
    var lower = i * bin;
    var higher = lower + bin;
    // console.log('lower: ' + lower + 'higher: ' + higher);
    // console.log(data);

    d3.select(this)
    .style('fill', 'tomato');


    // tooltip
    //   .transition()
    //   .duration(200)
    //   .style('opacity', 0.9);

    console.log(d3.event);

    // tooltip
    //   .style('left', (d3.event.pageX) + 'px')
    //   .style('top', (d3.event.pageY - 300) + 'px');

    line2.html(lower.toFixed(0) + ' – ' + higher.toFixed(0) + 'Hz');

    monsterText.text((data/255 * 100).toFixed(0) + '%');

  })
  .on('mouseout', function(data) {
    d3.select(this)
    .style('fill', '#000000');

    // tooltip
    // .transition()
    // .style('opacity', 0);
  });
};
