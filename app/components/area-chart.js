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
      resize: true,
      xkey: 'y',
      ykeys: ['a', 'b'],
      fillOpacity: 0.2,
      hideHover: 'auto',
      behaveLikeLine: true,
      labels: ['Patient', 'Demographic'],      
      pointFillColors:['#848484','#4BB3D2'],
      lineColors:['#848484','#4BB3D2']
    });
  }
});
