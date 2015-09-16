import DS from 'ember-data';

export default DS.Model.extend({
  physician: belongsTo('physician')
});
