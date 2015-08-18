import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({
      outlet: 'detail',
    });
  },
  model: function(params) {
    return this.modelFor('patients.index').findBy('patientId', parseInt(params.id));
  },
});
