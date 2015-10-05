import DS from 'ember-data';

export default DS.Model.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  challengeFitness:  DS.attr('number'),
  challengeDiet:     DS.attr('number'),
  challengeStrength: DS.attr('number'),

  /****************************************************************************
  /* RELATIONSHIPS
  /***************************************************************************/

  charts: DS.hasMany('chart'),
  physician: DS.belongsTo('parse-user', {async: true})
});
