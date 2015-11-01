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
      ykeys: ['d', 'p'], // demographic, patient
      xkey: 'x',
      xLabels: "week",
      xLabelFormat: function (date) {
        return "Week " + moment(date).week();
        // convert date string or timestamp to just month
        //return months[new Date(date).getMonth()];
      },
      hoverUnits: this.get('hoverUnits'), // NOT Morris.js API
      hoverCallback: function (index, options, content, row) {
        return '<strong>' + row.p + '</strong> ' + options.hoverUnits + ' - ' + moment(row.x).format('MMM Do');
      },
      resize: true,
      hideHover: true,
      fillOpacity: 0.2,
      behaveLikeLine: true,
      continuousLine: false,
      lineColors:['#848484','#4BB3D2'],
      labels: ['Demographic', 'Patient'],
      pointFillColors:['#848484','#4BB3D2']
    });
  }
});
