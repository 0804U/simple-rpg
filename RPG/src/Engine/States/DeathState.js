DeathState = function (statemachine, game, gameref, uigroup) {
    this.statemachine = statemachine;
    this.game = game;
    this.gameref = gameref;
    this.uiGroup = uigroup;
    
    
}
DeathState.prototype = Object.create(EmptyState.prototype);
DeathState.constructor = DeathState;

DeathState.prototype.init = function(map) 
{
}
DeathState.prototype.update = function(elapsedTime) 
{
}
DeathState.prototype.render = function() 
{
}
DeathState.prototype.onEnter = function(params) 
{
    this.deathGroup = new DeathScreen(this.tryAgain, this. returnToMenu, this.gameref);
}
DeathState.prototype.tryAgain = function() 
{
    //load screen like you just walked in
    console.log('try again');
    
    this.gameref.gGameMode.change("normal");
    this.gameref.map.tryMapAgain();
}
DeathState.prototype.returnToMenu = function() 
{
    this.game.state.start('MainMenu');
}
DeathState.prototype.onExit = function() 
{
    this.gameref.normalUI.show();
    this.deathGroup.destroy(true);
}


 
DeathScreen = function (tryAgain, returnToMenu, gameref) 
{
    gameref.normalUI.hide();
    gameref.textUIHandler.showDeadText("Your mortal shell was destroyed.");
    
    var btn = this.game.add.button(200, 400, 'ui', tryAgain, this, 'button_blue_up.png', 'button_blue_over.png', 'button_blue_over.png','button_blue_up.png');
    var newtext = this.game.add.bitmapText(230, 410, "simplefont", "Turn Back Time", 20); 
    
    this.addChild(btn);
    this.addChild(newtext);
        
    var btn = this.game.add.button(500, 400, 'ui', returnToMenu, this, 'button_blue_up.png', 'button_blue_over.png', 'button_blue_over.png','button_blue_up.png');
    var newtext = this.game.add.bitmapText(530, 410, "simplefont", "Return To Menu", 20); 
    
    this.addChild(btn);
    this.addChild(newtext);
}
DeathScreen.prototype = Object.create(Phaser.Group.prototype);
DeathScreen.constructor = DeathScreen;
