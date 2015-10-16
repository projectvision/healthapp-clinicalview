import Ember from 'ember';

export default Ember.Route.extend({
  // Render Patient Show into detail template
  renderTemplate: function() {
    this.render({
      outlet: 'detail',
    });
  },

  /****************************************************************************
  /* GRAPHS FOR PATIENT
  /* Return patient and their graphs
  /***************************************************************************/

  model: function(params) {

    //// Get Store
    var store = this.get('store');

    //// Get Adapter
    var adapter = store.adapterFor('parse-user');
    var serializer = store.serializerFor('parse-user');

    // Get Patient
    var patient = this.modelFor('patients.index').findBy('id', params.id);

    // Get Graphs For Patient
    //adapter.ajax(adapter.buildURL("patients"), "POST", {}).then(function(data) {
    //}

    

    return patient;
  }
});
