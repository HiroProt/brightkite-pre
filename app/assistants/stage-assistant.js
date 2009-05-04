function StageAssistant () {}

StageAssistant.prototype.setup = function() {
  this.controller.pushScene('main')
};

StageAssistant.prototype.handleCommand = function(event) {
  if (event.type == Mojo.Event.command)
    if (event.command.include('scene-'))
      Mojo.Controller.stageController.swapScene(event.command.replace('scene-', ''));
}