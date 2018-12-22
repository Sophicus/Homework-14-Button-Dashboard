function buildMetadata(sample) {
  var url = `/metadata/${sample}`;
  
  d3.json(url).then((data) =>{

    console.log(data);

    var panel = d3.select('#sample-metadata');
    panel.html("");

      Object.entries(data).forEach(([key, value]) => {
        var row = panel.append("tr")
        var cell = panel.append("td").text(`${key}:${value}`)
      });

  });

}

function buildCharts(sample) {
  var url = `/samples/${sample}`;

  d3.json(url).then((data) => {
    console.log(data);

    // Pie Chart
    const vals = data.sample_values.slice(0,10)
    console.log(vals);

    const ids = data.otu_ids.slice(0,10)
    console.log(ids);

    const hovers = data.otu_labels.slice(0,10)
    console.log(hovers);

    var pieData = [{
      labels: ids,
      values: vals,
      type: "pie",
      hovertext: hovers,
      hoverinfo: {text: hovers}
    }];

    var layout = {
      title: "Top Ten Samples",
    };

    Plotly.newPlot("pie", pieData, layout, {responsive: true});

    // Bubble Chart
    var bubbleData = [{
      x: data.otu_ids,
      y: data.sample_values,
      mode: "markers",
      marker: {
        size: data.sample_values,
        color: data.otu_ids},
      hovertext: data.otu_labels,
      hoverinfo: {text: data.otu_labels}
    }];

    var layout = {
      title: "Bubble Plot",
      showlegend: false,
    };

    Plotly.newPlot("bubble", bubbleData, layout, {responsive: true})
  });

};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
