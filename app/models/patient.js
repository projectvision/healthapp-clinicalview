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
  activityLevelScore: DS.attr('number'),
  zScore: DS.attr('number'),

  /****************************************************************************
  /* COMPUTED PROPERTIES
  /***************************************************************************/

  healthRisk: Ember.computed('zScore', function() {

    // The normal range (given human height, weight, and waist circumfirence values) is between -2 and 2.
    // Below 0 is healthy while above 0 is unhealthy. Z score shows the total relative to the entire population
    if (this.get('zScore') < -1) {
      return 'Healthy';
    }
    else if (this.get('zScore') < 0) {
      return 'Low Risk';
    }
    else if (this.get('zScore') < 1) {
      return 'Moderate Risk';
    }
    else if (this.get('zScore') > 1) {
      return 'High Risk';
    }
  }),

  activityLevel: Ember.computed('activityLevelScore', function() {
    // 4 - 7 Sedentary
    if (this.get('activityLevelScore') <= 7) {
      return 'Sedentary';
    }
    // 8 - 10 Moderate
    else if (this.get('activityLevelScore') <= 10) {
      return 'Moderate';
    }
    // 11 - 13 Active
    else if (this.get('activityLevelScore') <= 13) {
      return 'Active';
    }
    // 14 - 16 Very Active
    else if (this.get('activityLevelScore') <= 16) {
      return 'Very Active';
    }
  }),

  /****************************************************************************
  /* RELATIONSHIPS
  /***************************************************************************/

  physician: DS.belongsTo('parse-user'),
  graphs: DS.hasMany('graph'),
  stats: DS.hasMany('stat')

});
