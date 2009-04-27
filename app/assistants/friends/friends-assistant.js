function FriendsAssistant() {}

FriendsAssistant.prototype = {
  setup: function() {
    var user = new Mojo.Model.Cookie('credentials').get();
    console.log("got user");
    
    this.stream_model = { items: [] };
    
    this.controller.setupWidget('stream', { itemTemplate: 'friends/list-item' }, this.stream_model);
    this.controller.setupWidget(Mojo.Menu.viewMenu, undefined,
      { items: [
        { items: [
          { label: "Activity", command: 'list-activity', width: 160 },
          { label: "People", command: 'list-people', width: 160 }
        ]} 
      ]}
    );
    
    var url = 'http://brightkite.com/people/' + user.login + '/friendstream.json';
    console.log("getting " + url);
    $j.ajax({
      url: url,
      success: function(response) {
        console.log("success");
        $j.each(response, function(index, object) {
          console.log(object);
          this.stream_model.items.push({ login: object.creator.login });
          this.controller.modelChanged(this.stream_model);
        }.bind(this));
      }.bind(this),
      error: function(response) {
        Mojo.Log.error("Error getting friendstream");
      }
    });
  }
}

/*FriendsAssistant.prototype.setup = function() {
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

FriendsAssistant.prototype.handleCommand = function(event) {
  if (event.type == Mojo.Event.command) {
    if (event.command.startsWith('scene-'))
      Mojo.Controller.stageController.swapScene(event.command.gsub('scene-', ''));
    else if (event.command.startsWith('list-'))
      alert("switching to list: " + event.command.gsub('list-', ''));
  }
}*/