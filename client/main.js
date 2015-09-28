Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', function() {
  this.redirect('basic');
});

Meteor.startup(function() {
  AutoForm.setDefaultTemplate("semanticUI");
});
