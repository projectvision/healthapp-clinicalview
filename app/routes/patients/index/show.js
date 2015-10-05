import Ember from 'ember';

export default Ember.Route.extend({
  // Render Patient Show into detail template
  renderTemplate: function() {
    this.render({
      outlet: 'detail',
    });
  },
  // Return the selected patient
  model: function(params) {
    return this.modelFor('patients.index').findBy('patientId', parseInt(params.id));
  },
});
