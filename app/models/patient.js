import DS from 'ember-data';

export default DS.Model.extend({

  /****************************************************************************
  /* PROPERTIES
  /***************************************************************************/

  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  email: DS.attr('string'),
  challengeDiet: DS.attr('number'),
  challengeStress: DS.attr('number'),
  challengeFitness: DS.attr('number'),
  activityLevel: DS.attr('number'), // integer from 0 - 13
  zScore: DS.attr('number'),

  /****************************************************************************
  /* COMPUTED PROPERTIES
  /***************************************************************************/

  healthRisk: Ember.computed('zScore', function() {

    // The normal range (given human height, weight, and waist circumfirence values) is between -2 and 2.
    // Below 0 is healthy while above 0 is unhealthy. Z score shows the total relative to the entire population

    if (this.get('zScore') < 0) {
      return 'Healthy';
    }
    else if (this.get('zScore') > 0) {
      return 'Unhealthy';
    }
  }),

  /****************************************************************************
  /* RELATIONSHIPS
  /***************************************************************************/

  charts: DS.hasMany('chart'),
  physician: DS.belongsTo('parse-user', {async: true})
});
