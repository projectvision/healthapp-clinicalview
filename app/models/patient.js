import DS from 'ember-data';

// @TODO: Decide wether to define a patient model at all

export default DS.Model.extend({
  physician: DS.belongsTo('parse-user', {async: true})
});
