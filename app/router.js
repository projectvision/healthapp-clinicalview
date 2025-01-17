import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {

  this.route('session', function() {
    this.route('login');
    this.route('signup');
  });

  this.route('account', function() {
    this.route('edit');
  });

  this.route('patients', function() {
    this.route('index', function() {
      this.route('show', { path: ':id' });
    });
  });
});

export default Router;
