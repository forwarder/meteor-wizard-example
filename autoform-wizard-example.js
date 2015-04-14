Orders = new Meteor.Collection('orders');

Schema = {};

Schema.contactInformation = new SimpleSchema({
  name:{
    type: String,
    label: 'Name'
  },
  address: {
    type: String,
    label: 'Address'
  },
  zipcode: {
    type: String,
    label: 'Zipcode'
  },
  city: {
    type: String,
    label: 'City'
  }
});

Schema.paymentInformation = new SimpleSchema({
  paymentMethod: {
    type: String,
    label: 'Payment method',
    allowedValues: ['credit-card', 'bank-transfer'],
    autoform: {
      options: [{
        label: 'Credit card',
        value: 'credit-card'
      }, {
        label: 'Bank transfer',
        value: 'bank-transfer'
      }]
    }
  },
  acceptTerms: {
    type: Boolean,
    label: 'I accept the terms and conditions.',
    autoform: {
      label: false
    },
    autoValue: function() {
      if (this.isSet && this.value !== true) {
        this.unset();
      }
    }
  }
});

Orders.attachSchema([
  Schema.contactInformation,
  Schema.paymentInformation
]);

if (Meteor.isClient) {
  
  Meteor.startup(function() {
    AutoForm.setDefaultTemplate("semanticUI");
    
    Template.afCheckbox_semanticUI.onRendered(function() {
      $(this.firstNode).checkbox();
    });
  });
  
  Template.registerHelper('Schema', function() {
    return Schema;
  });
  
  Template.steps.helpers({
    stepClass: function(id) {
      var activeStep = this.wizard.activeStep();
      var step  = this.wizard.getStep(id);
      if (activeStep && activeStep.id === id) {
        return 'active';
      }
      if (step.data()) {
        return 'completed';
      }
      return 'disabled';
    }
  });

  Template.order.helpers({
    steps: function() {
      return [{
        id: 'contact-information',
        title: 'Contact information',
        schema: Schema.contactInformation,
        // template: 'contactInformation'
      }, {
        id: 'payment-information',
        title: 'Payment & confirm',
        schema: Schema.paymentInformation,
        // template: 'paymentInformation',
        onSubmit: function(data, wizard) {
          var self = this;
          Orders.insert(_.extend(wizard.mergedData(), data), function(err, id) {
            if (err) {
              self.done();
            } else {
              Router.go('viewOrder', {
                _id: id
              });
            }
          });
        }
      }];
    }
  });

}

Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
  this.redirect('order', {
    step: 'contact-information'
  });
});

Router.route('/order/:step', {
  name: 'order'
});

Router.route('/orders/:_id', {
  name: 'viewOrder',
  template: 'viewOrder',
  data: function() {
    return Orders.findOne(this.params._id);
  }
});
