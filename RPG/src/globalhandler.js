//***** GlobalHandler ********
var GlobalHandler = function (game, maingame, actors, variables, quests, items)
{
    this.game = game;
    this.maingame = maingame;
    //
    this.actors = [];
    for(var i=0;i<actors.length;i++)
    {
        this.actors[actors[i].id.toString()] = new ActorObject(actors[i]);
    }
    //
    this.variables = [];
    for(var i=0;i<variables.length;i++)
    {
        this.variables[variables[i].id.toString()] = new VariableObject(variables[i]);
    }
    //
    this.items = [];
    for(var i=0;i<items.length;i++)
    {
        this.items[items[i].id.toString()] = new ItemObject(items[i]);
    }
    //
   /* this.quests = [];
    for(var i=0;i<quests.length;i++)
    {
        this.quests[quests[i].id.toString()] = new QuestObject(quests[i]);
    }*/
}
//
GlobalHandler.prototype.updateQuestByID = function(id,mode,value)
{
    if(!this.quests[id])
        return false;
    if(mode=="Add")
        this.quests[id].value += parseFloat(value);
    else
        this.quests[id].value = value;
    return true;
}
//
GlobalHandler.prototype.updateVariableByID = function(id,mode,value)
{
    if(!this.variables[id])
        return false;
    if(mode=="Add")
        this.variables[id].value += parseFloat(value);
    else
        this.variables[id].value = value;
    
    return true;
}
//
GlobalHandler.prototype.getItemByID = function(id)
{
    if(!this.items[id])
        return null;
    return this.items[id];
}
GlobalHandler.prototype.updateItem = function(id,mode,variable,value)
{
    var item = this.getItemByID(id);
    if(item)
    {
        if(mode=="Add")
            item.addValue(variable,value);
        else 
            item.updateValue(variable,value);
    }
    else
        console.log(id,"not found");
}
//
GlobalHandler.prototype.getActorByID = function(id)
{
    if(!this.actors[id])
        return null;
    return this.actors[id];
}
GlobalHandler.prototype.updateItem = function(id,mode,variable,value)
{
    var actor = this.getActorByID(id);
    if(actor)
    {
        if(mode=="Add")
            actor.addValue(variable,value);
        else 
            actor.updateValue(variable,value);
    }
    else
        console.log(id,"not found");
}
//
GlobalHandler.prototype.setActor = function(id,object)
{
    if(this.actors[id])
    {
        this.actors[i].bind.push(object);
    }
}
//
//this.OnChangeSignal.dispatch([this])
//
var BaseObject = function (){
    this.OnChangeSignal = new Phaser.Signal();
};
//should do value type
BaseObject.prototype.updateValue = function(variable,value){
    if(this.json[variable]){
        this.json[variable] = value;
    }
    this.OnChangeSignal.dispatch([this]); 
}
BaseObject.prototype.addValue = function(variable,value){
    if(this.json[variable]){
        this.json[variable] += parseFloat(value);
    }
    this.OnChangeSignal.dispatch([this]); 
}
//
var ItemObject = function (json)
{
    BaseObject.call(this);
    this.json = json;
}
ItemObject.prototype = Object.create(BaseObject.prototype);
ItemObject.constructor = ItemObject;
//
var ActorObject = function (json)
{
    BaseObject.call(this);
    this.bind = [];
    this.json = json;
}
ActorObject.prototype = Object.create(BaseObject.prototype);
ActorObject.constructor = ActorObject;
//
var QuestObject = function (json)
{
    BaseObject.call(this);
    this.json = json;
}
QuestObject.prototype = Object.create(BaseObject.prototype);
QuestObject.constructor = QuestObject;

Object.defineProperty(QuestObject, "value", {
    get: function() {return this._value },
    set: function(v) { this._value = v; this.OnChangeSignal.dispatch([this]); }//throw on change
});

//
var VariableObject = function (json)
{
    BaseObject.call(this);
    this.json = json;
    this.id = json.id;
    this.name = json.Name;
    this._value = json["Initial Value"];
    this.description = json.Description;
};

//
VariableObject.prototype = Object.create(BaseObject.prototype);
VariableObject.constructor = VariableObject;

Object.defineProperty(VariableObject, "value", {
    get: function() {return this._value },
    set: function(v) { this._value = v; this.OnChangeSignal.dispatch([this]); }//throw on change
});

/*
    this.OnChangeEvent;
};
BaseObject.prototype.registerOnChange = function(id,func,callee,params)
{
    this.OnChangeEvent = this.OnChangeEvent || [];
    this.OnChangeEvent.push({func:func, para:params, callee:callee});
};
//async this?
BaseObject.prototype.doOnChangeEvent = function()
{
    if(this.OnChangeEvent.length>0)
    {
        for(var i=0;i<this.OnChangeEvent.length;i++)
        {
            if(this.OnChangeEvent[i])
            {
               this.OnChangeEvent[i].func.apply(this.OnChangeEvent[i].callee,[this.OnChangeEvent[i].para]);
            }
        }
    }
}*/
//actors and items on map with actor set will register with this class
//invetory? ui?
//quests ui will pull from this
//