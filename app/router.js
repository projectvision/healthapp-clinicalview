import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('patients', function () {
    this.route('index');
  });
  this.route('patient', {path: 'patient/:patient_id'});
});

export default Router
