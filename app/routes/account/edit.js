import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.get('store').modelFor('parse-user').current(this.get('store'));
  }
});
