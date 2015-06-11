Schemas.dynamicStep1 = new SimpleSchema({
  fields: {
    type: String,
    label: 'Number of dynamic fields?',
    allowedValues: ["1", "2", "3", "4", "5"]
  }
});

Schemas.dynamicField = new SimpleSchema({
  name: {
    type: String,
    label: 'Name'
  }
});

Schemas.dynamicStep2 = new SimpleSchema({
  fields: {
    type: [Schemas.dynamicField]
  }
});

Template.dynamicFields.helpers({
  steps: function() {
    return [{
      id: 'dynamic-step1',
      title: 'Step 1',
      schema: Schemas.dynamicStep1
    }, {
      id: 'dynamic-step2',
      title: 'Step 2',
      schema: Schemas.dynamicStep2,
      template: 'dynamicStep2',
      onSubmit: function(data, wizard) {
        var self = this;
      }
    }];
  }
});

Template.dynamicStep2.events({
  'click .wizard-back-button': function(e, template) {
    e.preventDefault();
    this.wizard.previous();
  }
});

Template.dynamicStep2.helpers({
  dynamicFields: function() {
    var data = this.wizard.mergedData();
    var amount = data && data.fields;
    var fields = [];
    for (var i = 0; i < amount; i++ ) {
      fields.push({
        index: i,
        name: 'fields.' + i + '.name'
      });
    }
    return fields;
  }
});

Router.route('/dynamic', {
  name: 'dynamic',
  template: 'dynamicFields'
});