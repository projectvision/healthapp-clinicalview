import DS, { belongsTo } from 'ember-data';

export default DS.Model.extend({
  firstName: attr('string'),
  lastName: attr('string'),
  patients: hasMany('patient')
});
