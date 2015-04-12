//
var EventDispatcher = function (game, maingame, object)
{
    this.game = game;
    this.maingame = maingame;
    this.object = object;
    
    GlobalEvents.allEventDispatchers.push(this);
}
EventDispatcher.prototype.receiveData = function(triggers) 
{
    //
    //this.onTouchSignal = new Phaser.Signal();
    this.onTouchAction;
    this.onLookAction;
    this.onTalkAction;
    //this.onEnterSignal = new Phaser.Signal();
    this.onEnterAction;//done
    this.onStartAction;//not done
    //onActivateAction//not done
    //
    this.init(triggers);
};
EventDispatcher.prototype.testAction = function() 
{
    if(this.object)
    {
        this.object.inputEnabled = this.shouldBeActive();
    }
}
EventDispatcher.prototype.shouldBeActive = function() 
{
    if(GlobalEvents.currentacion == GlobalEvents.WALK)
        return false;
    else if(GlobalEvents.currentacion == GlobalEvents.TOUCH && this.onTouchAction)
        return true;
    else if(GlobalEvents.currentacion == GlobalEvents.LOOK && this.onLookAction)
        return true;
    else if(GlobalEvents.currentacion == GlobalEvents.TALK && this.onTalkAction)
        return true;
    return false;
}//if all action is null. clear out array?
//this.onEnterSignal.dispatch([this])
EventDispatcher.prototype.init = function(triggers)    
{
    var trigger;
    var action;
    var activation;
    var eventAction;
    for(var i=0;i<triggers.length;i++)
    {
        trigger = triggers[i];
        activation = trigger.trigger;
        if(trigger.actions)
        {
            for(var j=0;j<trigger.actions.length;j++)
            {
                action = trigger.actions[j];
                eventAction = this.getEventType(activation);
                if(action.type=="ChangeMap")
                {
                    //console.log(action);
                    eventAction.push({func:this.maingame.userExit, para:[action], removeself:trigger.once, callee:this.maingame});
                }
                //
                else if(action.type=="CONVERSATION")
                {
                    eventAction.push({func:this.maingame.showDialog, para:[action.id], removeself:trigger.once, callee:this.maingame});
                }
                else if(action.type=="SIMPLE")
                {
                    eventAction.push({func:this.maingame.showJustTextDialog, para:[action.id], removeself:trigger.once, callee:this.maingame});
                }
                else if(action.type=="BARK")
                {
                }
                //
                else if(action.type=="THIS")//call function on this
                {
                    eventAction.push({func:this.object.callFunction, para:[action.function,action.parameters], removeself:false, callee:this.object});
                }
                else if(action.type=="Item")
                {
                    eventAction.push({func:this.maingame.globalHandler.updateItem, para:[action.name,action.mode,action.variable,action.value],  removeself:false, callee:this.maingame.globalHandler});

                }
                else if(action.type=="Actor")
                {
                    eventAction.push({func:this.maingame.globalHandler.updateVariableByID, para:[action.name,action.mode,action.value],  removeself:false, callee:this.maingame.globalHandler});
                }
                else if(action.type=="Variable")
                {
                    eventAction.push({func:this.maingame.globalHandler.updateVariableByID, para:[action.name,action.mode,action.value],  removeself:false, callee:this.maingame.globalHandler});
                }
                else if(action.type=="Quest")
                {
                }
            }
        }
        else if(trigger.type=="actiontext")
        {//need touch and talk actives
            if(trigger.lookatactive)
            {
                this.getEventType("OnLook").push({func:this.maingame.showJustText, para:trigger.lookat, removeself:false, callee:this.maingame});
            }
        }
    }
};
//
EventDispatcher.prototype.doAction = function(activation) 
{
    var actionEvent = this.getEventType(activation); 
    if(actionEvent.length>0)
    {
        for(var i=0;i<actionEvent.length;i++)
        {
            if(actionEvent[i])
            {
                //check condition?
                //this.onEnterSignal.dispatch([actionEvent[i].para]);
                actionEvent[i].func.apply(actionEvent[i].callee, actionEvent[i].para);
                if(actionEvent[i].removeself)
                {
                    actionEvent[i] = null;//splice too?
                    console.log("remove event");
                }
            }
        }
    }
};
//
EventDispatcher.prototype.getEventType = function(activation) 
{
    if(activation=="OnEnter")
    {
        this.onEnterAction = this.onEnterAction || [];
        return this.onEnterAction;
    }
    else if(activation=="OnStart")
    {
        this.onStartAction = this.onStartAction || [];
        return this.onStartAction;
    }
    else if(activation=="OnTouch")
    {
        this.onTouchAction = this.onTouchAction || [];
        return this.onTouchAction;
    }
    else if(activation=="OnTalk")
    {
        this.onTalkAction = this.onTalkAction || [];
        return this.onTalkAction;
    }
    else if(activation=="OnLook")
    {
        this.onLookAction = this.onLookAction || [];
        return this.onLookAction;
    }
};
EventDispatcher.prototype.destroy = function() 
{
    this.onTouchAction = null;
    this.onLookAction = null;
    this.onTalkAction = null;
    this.onEnterAction = null;
    this.onStartAction = null;
}

/*
//inputEnabled 

register list of active objects for each event: touch, talk, look, (invectory item?)

turn on inputEnabled for current
turn off inputEnabled for last (if not current also)

- walk shuts all off





*/
/*

"triggers": [
        {
            "trigger": "OnEnter",
            "actions": [
                {
                    "type": "ChangeMap",
                    "tmap": "Map1 - Beach",
                    "tx": 4,
                    "ty": 1
                }
            ],
            "conditions": "[]"
        }
    ]
}


*/


//***** EventConv ********
var EventConv = function (game, maingame, destroyfunc, json) 
{
    //this.convid = json.convid;
    //this.once = json.once;
    //if json.once destroy self on use
}
EventConv.prototype.removeSelf = function() 
{
    
}
EventConv.prototype.activateEvent = function() 
{
    this.maingame.showDialog(this.convid);
    if(this.once){
        //call destroy func
    }
}
//
var EventnText = function (json) 
{
}
/* 
Actors/enemies animations
- move x6
- attaks? x6 (per attack type)
- hurt x6
- die
- knockdown
- use/action x6
- idle x6


for normal objects (called automatically)
- idle
- destroy
- use


OTHER ACTIONS
done - load special animations - (array) - animationid, animationname, #frames
- activate other interactive object (ie go alive to dead)
- create named object? 

- destroy graphic(self)
- hide graphic, show graphic 
- change graphic/play animation
- set tile walkable, unwalkable

actor
- move to tile
- combat editor(later)
- start combat if enter range

- ondie?

- display message



//what - id - function or var - parameters as array


Item[\"BabyCrab\"].Inventory = true
Item[\"BabyCrab\"].pickup();
- destroy graphic
- set walkable?


//Variable - special case
{
    "Variable": {
        "name": "FireLit",
        "value": "true",
    }
}
//
{
    "actionSpots": [
        {
            "x": 2,
            "y": 3,
            "triggers": [
                {
                    "trigger": "OnEnter",
                    "once": false,
                    "actions": [
                        {
                            "type": "ChangeMap",
                            "tmap": "Map2",
                            "tx": 0,
                            "ty": 2
                        }
                    ],
                    "conditions": []
                }
            ]
        }
    ]
}

//
//Item - Action
{
    "trigger": "onTouch",
    "once": false,
    "actions": [
        {
            "type": "Item",
            "name": "BabyCrab",
            "set": "Inventory",
            "value": "true"
        },
        {
            "type": "Item",
            "name": "BabyCrab",
            "function": "pickup",
            "parameters": []
        },
        {
            "type": "this",
            "name": "",
            "function": "destroySelf",
            "parameters": []
        }
    ]
}

//All - Condition
//any vs all
{
    "conditions": {
        "testrequire": "All",
        "tests": [
            {
                "type": "Item",
                "name": "BabyCrab",
                "var": "Inventory",
                "condition": "==",
                "value": "true"
            }
        ]
    }
}

//Quest

//player, gameworld

//call knows it's a function call, not just a set?


this.interactiveobject = destroy (remove graphic), no longer interactive(graphic stays, no longer touchable)
//click once for pickup, click again says you can't? or just can't
//does visual state change?
//ininventory means it starts there when you enter the game


Variable
- onchange - allow objects to register waiting for changes?


Quest
state
Entry_#_state //# is 1,2,3


Convo
- branching
- single in row
- bark


- on range?

//move to tile(x,y), map 1
Actor[\"Player\"].moveTo(1,2,1);

*/