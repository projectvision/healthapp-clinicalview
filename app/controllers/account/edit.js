import Ember from 'ember';

export default Ember.Controller.extend({

  /****************************************************************************
  /* ACTIONS
  /***************************************************************************/

  actions: {
    update: function() {
      console.log('user edit');
      console.log(this.get('model'));
      console.log(user);
    }
  }
});
