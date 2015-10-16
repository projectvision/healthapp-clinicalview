import Ember from 'ember';
import adapter from 'ember-parse-adapter/adapters/application';

/****************************************************************************
/* EMBER PARSE ADAPTER
/***************************************************************************/

// Extend adapter to connect models to Parse functions that bring data together
export default adapter.extend({

  pathForType: function(type) {
    if ('parseUser' === type || 'parse-user' === type) {
      return 'users';
    }
    else if ('login' === type) {
      return 'login';
    }
    else if ('function' === type) {
      return 'functions';
    }
    // APP SPECIFIC: Patient data is fragmented so it's a function instead
    else if ('patients' === type) {
      return 'functions/patients';
    }
    // APP SPECIFIC: Graph data is fragmented so it's a function instead
    else if ('graphs' === type) {
      return 'functions/graphs';
    }
    else {
      return 'classes/' + Ember.String.capitalize(Ember.String.camelize(type));
    }
  }
});
