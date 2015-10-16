import DS from 'ember-data';

// Similar to Graph except it just shows a statistic

export default DS.Model.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  title: DS.attr('string'),
  stat: DS.attr('string'),
  description: DS.attr('string'),

  /****************************************************************************
  /* RELATIONSHIPS
  /***************************************************************************/

  patient: DS.belongsTo('patient')

});