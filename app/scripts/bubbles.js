// generate random colors
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
var diameter = 700;

// viz stage
var container = d3.select('#viz').append('svg')
  .attr('height', diameter)
  .attr('width', diameter)
  .attr('class', 'container')
  .append('g');

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

  var group = container.selectAll('.bubble')
    .data(nodes);

  var groupEnter = group.enter()
    .append('g')
    .attr('class', 'bubble');
    // .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';});

  groupEnter.append('circle')
    .attr('r', function(d) {return d.r;})

  groupEnter.append('text')
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .text(function(d){
      var text = d.name;
      return text;
    })
    // font sizing http://stackoverflow.com/questions/20115090/d3-js-auto-font-sizing-based-on-nodes-individual-radius-diameter
    .style('font-size', '1px')
    .each(getSize)
    .style('font-size', function(d){return d.scale + 'px';});

  group.transition()
    .duration(1000)
    .ease('cubic')
    .attr('transform', function(d) {return 'translate(' + d.x + ',' + d.y + ')';});

  group.select('text')
    .text('');

  group.select('circle').transition()
    .duration(1000)
    .attr('r', function(d) {return d.r;})
    .style('fill', randomColor)
    .each('end', function(){
      group.select('text')
        .style('fill', randomColor)
        .text(function(d){
          var text = d.name;
          return text;
        })
        .style('font-size', '1px')
        .transition()
        .duration(1000)
        .each(getSize)
        .style('font-size', function(d){return d.scale + 'px';});
    });

  group.exit().remove();

};

// build data into children array
function processData(data) {
  var newDataSet = [];
  for(var i = 0; i < data.length; i++) {
    newDataSet.push({name: data[i].name, size: data[i].playcount});
  }
  return {children: newDataSet};
}

// get bounding boxes
function getSize(d) {
  var bbox = this.getBBox(),
    cbbox = this.parentNode.getBBox(),
    scale = Math.min((cbbox.width/bbox.width)-2, cbbox.height/bbox.height);
  d.scale = scale;
}
