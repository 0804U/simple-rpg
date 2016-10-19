//
BattleHeroTurnState = function (statemachine, game, gameref, isPlayerTurn) {
    this.statemachine = statemachine;
    this.game = game;
    this.gameref = gameref;
    
    this.mActions = [];//actions
    this.mEntities = [];//entitys
    this.actionStates = new StateMachine();
    
    this.actionStates.add("tick", new BattleTick(this.actionStates, this));
    this.actionStates.add("execute", new BattleExecute(this.actionStates));
    
    this.iteractor = -1;
    this.team = [];
    
    this.isPlayerTurn = isPlayerTurn;
    //
}
BattleHeroTurnState.prototype = Object.create(EmptyState.prototype);
BattleHeroTurnState.constructor = BattleHeroTurnState;
//
BattleHeroTurnState.prototype.init = function(map) 
{
}
//
BattleHeroTurnState.prototype.SortByTime = function(a,b)
{
    return a.TimeRemaining() > b.TimeRemaining()
}
BattleHeroTurnState.prototype.update = function(elapsedTime) 
{
    this.actionStates.update(elapsedTime);    
}
BattleHeroTurnState.prototype.render = function() 
{
    this.actionStates.render();
}
BattleHeroTurnState.prototype.getActiveCombater = function()
{
    this.mEntities[this.iteractor];
}
BattleHeroTurnState.prototype.NextTick = function()
{
    this.actionStates.change("tick");
}
BattleHeroTurnState.prototype.onEnter = function(params) 
{
    console.log("BattleTurn")
    this.createTeam();
    if(this.isPlayerTurn)
    {
        if(this.mActions.length>0)
            this.mActions[0].execute();
    }
}
BattleHeroTurnState.prototype.setTeam = function(team) 
{
    this.mEntities = team;
}
BattleHeroTurnState.prototype.addTeamate = function(teammate) 
{
    this.mEntities.push(teammate);
}
BattleHeroTurnState.prototype.createTeam = function() 
{
    //every time?
    for(var i=0;i<this.mEntities.length;i++)
    {
        this.mEntities[i].startCombat();
    }
    //
    this.NextTick();
    console.log("num: "+this.mEntities.length);
    for(var i=0;i<this.mEntities.length;i++)
    {
        var e = this.mEntities[i];
        if(e.IsPlayer)
        {
            var action = new PlayerDecide(this.game, this.gameref, e,  e.Speed(), this);
            this.mActions.push(action);
        }
        else
        {
            var action = new AIDecide(this.game, this.gameref, e, e.Speed(), this);
            this.mActions.push(action);
        }
    }
}
BattleHeroTurnState.prototype.findDecideByActor = function(actor)
{
    for(var x=0;x<this.mActions.length;x++)
    {
        if(this.mActions[x].combater == actor)
        {
            return this.mActions[x];
        }
    }
    return null;
}
BattleHeroTurnState.prototype.placeAtEnd = function()
{
    var a = this.mActions.pop();
    this.mActions.unshift(val);
}
BattleHeroTurnState.prototype.removeTopAction = function()
{
    var a = this.mActions.pop();
    return a;
}
BattleHeroTurnState.prototype.addToActionsRear = function(val)
{
    this.mActions.unshift(val);
    this.NextTick();
}
BattleHeroTurnState.prototype.addToActionsFront = function(val)
{
    this.mActions.push(val);
    this.NextTick();
}
BattleHeroTurnState.prototype.moveOn = function()
{
    GlobalEvents.currentAction = GlobalEvents.COMBATSELECT;
    this.NextTick();
}
BattleHeroTurnState.prototype.onExit = function() 
{
    this.mActions = [];
}
BattleHeroTurnState.prototype.leaveThisState = function() 
{
    //can be used to warn if player still has actions
    return true;
}
BattleHeroTurnState.prototype.getActions = function()
{
    return this.mActions;
}