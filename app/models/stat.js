import DS from 'ember-data';

// Similar to Chart

export default DS.Model.extend({
  title: DS.attr('string'),
  stat: DS.attr('string'),
  description: DS.attr('string')
});
