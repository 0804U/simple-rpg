var InputHandler = function (game, gameref)
{
    
    this.game = game;
    this.gameref = gameref;
    
    this.dragScreen = false;
    this.didDrag = false;
    this.dragPoint = new Point(0,0);
    this.overGuy = null;
};
//
InputHandler.prototype.turnOn = function()
{
    this.gameref.input.addMoveCallback(this.onMove, this); 
    this.gameref.input.onDown.add(this.doDragScreen, this);
    this.gameref.input.onUp.add(this.clickedHex, this);
    this.gameref.input.priorityID = 0;
    //
    this.dragScreen = false;
    this.didDrag = false;
}
InputHandler.prototype.turnOff = function()
{
    console.log("inputhandler turnoff")
    this.gameref.input.deleteMoveCallback(this.onMove, this); 
    this.gameref.input.onDown.remove(this.doDragScreen, this);
    this.gameref.input.onUp.remove(this.clickedHex, this);
}

//
InputHandler.prototype.onMove = function(pointer, x, y)
{
    //console.log("move ",pointer.active);
    //if(!pointer.active)
    //    return;
    this.doDragScreenMove(x,y)
    
    if(GlobalEvents.currentAction != GlobalEvents.WALK)
    {
        //return;
    }
    if(this.game.global.pause)
    {
        return;
    }
    //these number have to be adjuested 94, 60?
    //85, 51
    //var pointerx = (this.gameref.input.worldX-this.gameref.map.mapGroup.x+ this.gameref.map.hexHandler.halfHex/2) / this.gameref.map.scaledto;
    //var pointery = (this.gameref.input.worldY-this.gameref.map.mapGroup.y+ this.gameref.map.hexHandler.bottomOffset + this.gameref.map.hexHandler.halfHexHeight) / this.gameref.map.scaledto;
    
    var pointerx = (this.gameref.input.worldX-this.gameref.map.mapGroup.x) / this.gameref.map.scaledto;
    var pointery = (this.gameref.input.worldY-this.gameref.map.mapGroup.y) / this.gameref.map.scaledto;

    //pointerx -= this.gameref.map.hexHandler.halfHex;
    //pointery += this.gameref.map.hexHandler.bottomOffset + this.gameref.map.hexHandler.halfHexHeight;
    //console.log(this.gameref.input.worldX, this.gameref.input.worldY, this.gameref.map.mapGroup.scale, this.gameref.map.scaledto)
    //console.log(this.gameref.map.x, this.gameref.map.mapGroup.x)
    //console.log((this.gameref.input.worldX-this.gameref.map.mapGroup.x), (this.gameref.input.worldY-this.gameref.map.mapGroup.y))
    //console.log(pointerx,pointery)
    var moveIndex =  this.gameref.map.hexHandler.checkHex(pointerx, pointery);
    
    /*var playertile = this.gameref.map.hexHandler.checkHex(
        this.gameref.map.playerCharacter.x + this.gameref.map.hexHandler.halfHex/2, this.gameref.map.playerCharacter.y + this.gameref.map.hexHandler.bottomOffset + this.gameref.map.hexHandler.halfHexHeight);*/
    //console.log(moveIndex.posx,moveIndex.posy);
    //var playertile = this.gameref.map.hexHandler.checkHex( this.gameref.map.playerCharacter.x, this.gameref.map.playerCharacter.y);
    //console.log("width "+moveIndex.width,moveIndex.height);
    //console.log(playertile,this.gameref.map.playerCharacter.x, this.gameref.map.playerCharacter.y);
    if(moveIndex)
    {
        //this.gameref.map.hexHandler.sprite.x = moveIndex.x;
        //this.gameref.map.hexHandler.sprite.y = moveIndex.y;// - this.gameref.map.hexHandler.bottomOffset;
        //this.tiletest.y = moveIndex.y;
    }
    //console.log(playertile);
    //console.log(playertile.posx,playertile.posy,this.playerCharacter.x,this.playerCharacter.y);
    //if(moveIndex)
    //    console.log(moveIndex.posx,moveIndex.posy);

    //console.log(this.input.worldX,this.gameref.map.mapGroup.x,this.input.worldX-this.gameref.map.mapGroup.x);
    if(GlobalEvents.currentAction == GlobalEvents.WALK)
    {
        //this.gameref.map.highlightHex.doShowPath(this.gameref.pathfinder,playertile,moveIndex);
        //this.gameref.map.hexHandler.dolines(playertile, moveIndex, false, //this.gameref.map.highlightHex);
        //var fridges = this.gameref.map.hexHandler.doFloodFill(moveIndex,3,false,true);
        //this.gameref.map.highlightHex.drawFringes(fridges);
        this.gameref.map.highlightHex.moveCursor(moveIndex);
    }
    else
    {
        this.gameref.map.highlightHex.cleanuptiles();
    }
    //console.log('mover on tile: ',moveIndex.moverontile);
    //this.gameref.map.highlightHex.highilightneighbors(playertile);
},
InputHandler.prototype.doDragScreen = function(pointer)
{
    //console.log("drag",pointer.active);
    if(!pointer.active)
        return;
    
    this.dragScreen = true;
    this.dragPoint.x = pointer.x;
    this.dragPoint.y = pointer.y;
}
InputHandler.prototype.doDragScreenMove = function(x,y)
{
    if(this.dragScreen)
    {
        var diffx = this.dragPoint.x-x;
        var diffy = this.dragPoint.y-y;

        this.dragPoint.x = x;
        this.dragPoint.y = y;

        if(diffx!=0||diffy!=0)
            this.didDrag = true;
        this.gameref.camera.adjustPosition(-diffx, -diffy);
        return;
    }
}
InputHandler.prototype.clickedObject = function(clickedObject)
{
}
InputHandler.prototype.clickedHex = function(pointer,eventt)
{
    if (!pointer.withinGame) { return; }
    //this needs to be blocked if clicking ui
    this.dragScreen = false;
    if(this.didDrag)//test distance did it actually drag. or do I make a drag screen button?
    {
        this.didDrag = false;
        return;
    }
    //pointers will be false by other input ui methods so the character isn't randomly walking around
    if(!pointer.active)
        return;
    //
    if(GlobalEvents.currentAction != GlobalEvents.WALK)
        return;
    if(this.game.global.pause)
    {
        return;
    }
    //
    this.handleCharMove();
} 
InputHandler.prototype.handleCharMove = function()
{
    var pointerx = (this.gameref.input.worldX-this.gameref.map.mapGroup.x)/this.gameref.map.scaledto;
    var pointery = (this.gameref.input.worldY-this.gameref.map.mapGroup.y)/this.gameref.map.scaledto;
    var moveIndex =  this.gameref.map.hexHandler.checkHex(pointerx,pointery);
    
    
    if(moveIndex!=null)
    {
        if(moveIndex!=undefined)
        {
           
            if(moveIndex.moverontile!=null)
            {
                //this.gameref.map.highlightHex.moveCursor(moveIndex);
                moveIndex.moverontile.handleOver();
                this.overGuy = moveIndex.moverontile;
            }
        }
        //if moveIndex contains another player don't move
        if(this.game.currentAction==this.game.WALK && !(this.overGuy!=null && !this.overGuy.IsPlayer))
        {
            this.gameref.map.playerCharacter.moveto(moveIndex, {x:pointerx, y:pointery});
        }
    }
    else
    {
        this.overGuy = null;
    }
}