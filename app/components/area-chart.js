export default Ember.Component.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  chart: null,

  /****************************************************************************
  /* EVENTS
  /***************************************************************************/

  didInsertElement: function() {

    var months = new Array("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec");

    // Create chart using data injected via template
    this.chart = new Morris.Area({
      element: this.get('elementId'),
      data: this.get('data'),
      ykeys: ['p', 'd'], // patient, demographic
      xkey: 'x',
      xLabels: "month",
      xLabelFormat: function (date) {
        // convert date string or timestamp to just month
        return months[new Date(date).getMonth()];
      },
      resize: true,
      hideHover: true,
      fillOpacity: 0.2,
      behaveLikeLine: true,
      lineColors:['#848484','#4BB3D2'],
      labels: ['Patient', 'Demographic'],
      pointFillColors:['#848484','#4BB3D2']
    });
  }
});
