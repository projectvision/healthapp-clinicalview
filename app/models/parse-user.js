import DS from 'ember-data';

export default DS.Model.extend({
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  createdAt: DS.attr( 'date' ),  
  patients: DS.hasMany('patient', {async: true})
});
