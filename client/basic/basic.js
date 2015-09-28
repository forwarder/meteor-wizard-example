Orders = new Meteor.Collection('orders', {connection: null});

Schemas.contactInformation = new SimpleSchema({
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

Schemas.paymentInformation = new SimpleSchema({
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
  Schemas.contactInformation,
  Schemas.paymentInformation
]);

Template.basic.helpers({
  steps: function() {
    return [{
      id: 'contact-information',
      title: 'Contact information',
      schema: Schemas.contactInformation
    }, {
      id: 'payment-information',
      title: 'Payment & confirm',
      schema: Schemas.paymentInformation,
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

Wizard.useRouter('iron:router');

Router.route('/basic/:step?', {
  name: 'basic',
  onBeforeAction: function() {
    if (!this.params.step) {
      this.redirect('basic', {
        step: 'contact-information'
      });
    } else {
      this.next();
    }
  }
});

Router.route('/orders/:_id', {
  name: 'viewOrder',
  template: 'viewOrder',
  data: function() {
    return Orders.findOne(this.params._id);
  }
});
