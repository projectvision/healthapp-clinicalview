export default Ember.Component.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  chart: null,
  tagName: 'div',

  /****************************************************************************
  /* EVENTS
  /***************************************************************************/

  renderGraph: function() {
    this.chart.setData(this.get('progress'));
  }.observes('progress'),

  didInsertElement: function() {
    var element = this.get('element').id;
    var self = this;

    this.chart = new Morris.Line({
      element: element,
      xkey: 'date',
      ykeys: ['amount', 'increase'],
      labels: ['Amount', 'increase'],
      resize: true,
      smooth: false,
      parseTime: false
    }).on('click', function(i, row){
      self.set('clicked', row);
      self.sendAction('goToSession');
    });
  }
});
