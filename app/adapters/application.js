import adapter from 'ember-parse-adapter/adapters/application';

/****************************************************************************
/* EMBER PARSE ADAPTER
/***************************************************************************/

// Extend adapter to cater for models that connect to functions NOT classes
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
    // Patient model has no corresponding Parse class, instead it's a function
    else if ('patients' === type) {
      return 'functions/patients';
    }
    else {
      return 'classes/' + Ember.String.capitalize(Ember.String.camelize(type));
    }
  }
});
