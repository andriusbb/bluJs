var app = new Blu({
  el: '#app',
  data: {
    databases: []
  }
})

function loadSamples() {
  app.databases = Object.freeze(ENV.generateData().toArray());
  Monitoring.renderRate.ping();
  setTimeout(loadSamples, ENV.timeout);
}

loadSamples()
