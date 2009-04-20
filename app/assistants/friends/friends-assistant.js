function FriendsAssistant() {}

FriendsAssistant.prototype.setup = function() {
  
  this.controller.setupWidget(Mojo.Menu.viewMenu, undefined,
    this.model = {
      items: [
        { items: [
          { label: "Activity", command: 'list-activity', width: 160 },
          { label: "People", command: 'list-people', width: 160 }
        ]} 
      ]
    }
  );
  
  this.controller.setupWidget(Mojo.Menu.commandMenu,
    this.attributes = {},
    this.model = {
      items: [
        { label: "Ia", command: 'scene-main' },
        { label: "Fr", command: 'scene-friends' },
        { label: "Ne", command: 'scene-nearby' },
        { label: "Un", command: 'scene-universe' },
        { label: "Ot", command: 'scene-other' }
      ]
    }
  );
  
  this.friendsAttributes = {
    itemTemplate: 'friends/list-item'
  };
  this.friendsModel = {
    listTitle: "Friends",
    items: []
  };
  this.controller.setupWidget('friends', this.friendsAttributes, this.friendsModel);
  
  $j.getJSON('http://brightkite.com/people/complex/friends.json?limit=500', function(response) {
    this.friendsModel.items = [];
    $j.each(response, function(index, friend) {
      this.friendsModel.items.push({ login: friend.login });
      this.controller.modelChanged(this.friendsModel);
    }.bind(this));
  }.bind(this));
}

/*FriendsAssistant.prototype.ajax_success = function(response) {
  console.log("model: " + this.friendsModel.items);
  response.responseText.evalJSON().each(function(friend) {
    this.friendsModel.items.push({ login: friend.login });
  });
  //this.controller.setWidgetModel('friends', this.friendsModel);
  this.controller.modelChanged(this.friendsModel);
}*/

FriendsAssistant.prototype.ajax_failure = function() {}

FriendsAssistant.prototype.handleCommand = function(event) {
  if (event.type == Mojo.Event.command) {
    if (event.command.startsWith('scene-'))
      Mojo.Controller.stageController.swapScene(event.command.gsub('scene-', ''));
    else if (event.command.startsWith('list-'))
      alert("switching to list: " + event.command.gsub('list-', ''));
  }
}