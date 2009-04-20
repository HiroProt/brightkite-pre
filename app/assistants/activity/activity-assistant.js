function ActivityAssistant() {}

ActivityAssistant.prototype.setup = function() {
  this.activity_model = {
    listTitle: "Activity",
    items: []
  };
  
  this.controller.setupWidget('friends',
    { itemTemplate: 'friends/list-item' },
    this.activity_model
  );
};