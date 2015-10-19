import Ember from 'ember';

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
      data: this.get('values'),
      ykeys: 'y', //['p', 'd'], // patient, demographic
      xkey: 'x',
      xLabels: "week",
      xLabelFormat: function (date) {
        // convert date string or timestamp to just month
        //return months[new Date(date).getMonth()];
        return "Week " + moment(date).week();
      },
      hoverCallback: function (index, options, content, row) {
        return '<strong>' + row.y + '</strong> ' + options.postUnits + ' - ' + moment(row.x).format('MMM Do');
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
