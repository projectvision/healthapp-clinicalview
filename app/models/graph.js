import DS from 'ember-data';

export default DS.Model.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  title: DS.attr('string'),

  /****************************************************************************
  /* RELATIONSHIPS
  /***************************************************************************/

  patient: DS.belongsTo('patient')

});