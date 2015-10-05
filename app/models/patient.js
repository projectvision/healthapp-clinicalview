import DS from 'ember-data';

export default DS.Model.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  challengeDiet: DS.attr('number'),
  challengeStress: DS.attr('number'),
  challengeFitness: DS.attr('number'),

  /****************************************************************************
  /* RELATIONSHIPS
  /***************************************************************************/

  charts: DS.hasMany('chart'),
  physician: DS.belongsTo('parse-user', {async: true})
});
