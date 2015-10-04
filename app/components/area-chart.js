export default Ember.Component.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  chart: null,

  /****************************************************************************
  /* EVENTS
  /***************************************************************************/

  didInsertElement: function() {

    // Create chart using data injected via template
    this.chart = new Morris.Area({
      element: this.get('elementId'),
      data: this.get('data'),
      xkey: 'y',
      ykeys: ['a', 'b'],
      labels: ['Total Income', 'Total Outcome'],
      fillOpacity: 0.2,
      hideHover: 'auto',
      behaveLikeLine: true,
      resize: true,
      pointFillColors:['#848484','#4BB3D2'],
      lineColors:['#848484','#4BB3D2']
    });
  }
});
