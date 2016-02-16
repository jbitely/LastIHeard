// color scale based on colorbrewer
// var color = d3.scale.ordinal()
//   .range(colorbrewer.PuRd[9]);

// http://bl.ocks.org/jdarling/06019d16cb5fd6795edf
// Adapted from http://martin.ankerl.com/2009/12/09/how-to-create-random-colors-programmatically/
var randomColor = (function(){
  var golden_ratio_conjugate = 0.618033988749895;
  var h = Math.random();

  var hslToRgb = function (h, s, l){
    var r, g, b;

    if(s == 0){
      r = g = b = l; // achromatic
    }else{
      function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      }

      var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      var p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return '#'+Math.round(r * 255).toString(16)+Math.round(g * 255).toString(16)+Math.round(b * 255).toString(16);
  };

  return function(){
    h += golden_ratio_conjugate;
    h %= 1;
    return hslToRgb(h, 0.9, 0.6);
  };
})();

// stage setup
var diameter = 600;

// viz stage
var container = d3.select('#viz').append('svg')
  .attr('height', diameter)
  .attr('width', diameter)
  .attr('class', 'container');

// setup pack layout
var bubble = d3.layout.pack()
  .size([diameter, diameter])
  .value(function(d){
    return d.size;
  })
  .padding(3);

// generate data
var buildBubbles = function(json){
  var nodes = bubble.nodes(processData(json))
    .filter(function(d){ //filter out outer bubble (any node w/o parent);
      return d.parent;
    });

  var vis = container.selectAll('circle')
    .data(nodes);

  var labels = container.selectAll('text')
    .data(nodes);

  vis.enter().append('circle')
    .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';})
    .attr('r', function(d) {return d.r;})
    .attr('class', 'artist')
    .style('fill', 'white');

  labels.enter().append('text')
    .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';})
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .style('font-size', function(d){
      var len = d.name.substring(0, d.r / 3).length;
      var size = d.r/4;
      size *= 10/len;
      size += 1;
      return Math.round(size)+'px';
    })
    .text(function(d){
      var text = d.name.substring(0, d.r /3);
      return text;
    });

  vis.transition().duration(1000)
    .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';})
    .attr('r', function(d) {return d.r;})
    .style('fill', randomColor);

  labels.transition().duration(1000)
    .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';})
    .attr('r', function(d) {return d.r;})
    .text(function(d){
      var text = d.name.substring(0, d.r /3);
      return text;
    });

  vis.exit().remove();
  labels.exit().remove();
};

// build data into children array
function processData(data) {
  var newDataSet = [];
  for(var i = 0; i < data.length; i++) {
    newDataSet.push({name: data[i].name, size: data[i].playcount});
  }
  return {children: newDataSet};
}
