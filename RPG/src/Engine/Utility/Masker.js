// This was an attempt to cut background sprites so that characters are visible behind objects.
// The masking wasn't working properly for the calculations
var Masker = function (game, maingame, maskableobjects)
{
    this.game = game;
    this.maingame = maingame;

    this.maskedobjects = [];
    this.maskDistance = 2000;//distance*distance
    
    this.maskableobjects = maskableobjects;
    //?
    //this.mask = new Phaser.Image(game, 0, 0, "standardimages", "box/seethrough.png")
    
    //this.maingame.objectGroup.add(this.mask);
    //this.maingame.objectGroup.add(mask);
}
//Masker.prototype = Object.create(Phaser.Group.prototype);
//Masker.constructor = Masker;

Masker.prototype.createCircleMask = function(radius) {
        var mask = this.game.add.graphics(0, 0);
        mask.beginFill(0xffffff11);
        mask.drawCircle(0, 0, radius);
        this.maingame.objectGroup.add(mask);
        return mask;
}
Masker.prototype.createRectMask = function(x,y,w,h) {
        var mask = this.game.add.graphics(0, 0);
        mask.beginFill(0x00000000);
        mask.drawRect(x,y,w/2,h);
        this.maingame.objectGroup.add(mask);
        return mask;
}
//get list of maskedobjects
//if already has mask, then move it, else create a new one
Masker.prototype.cleanUp = function() 
{
}
Masker.prototype.updateMasks = function(locx,locy) {
    if(this.maskableobjects)
    {
        var object;
        for(var i=0;i<this.maskableobjects.length;i++)
        {
            object = this.maskableobjects[i];
            if(object!=null)
            {
                if(object.left <= locx && locx < object.right && object.top <= locy && locy < object.bottom)
                {
                    if(this.maskedobjects[i] == null)
                    {
                        var maskedObject = new MaskedObject();
                        var bmd = this.game.make.bitmapData(object.width, object.height);
                        var mask = this.game.make.bitmapData(object.width, object.height);
                        
                        mask.ctx.beginPath();
                        mask.ctx.rect(0,0,object.width, object.height);
                        mask.ctx.fillStyle = '#ffff00';
                        mask.ctx.fill();
                        
                        mask.draw(this.mask);
                        
                        var x = object.x;
                        var y = object.y;
                        
                        object.x = 0;
                        object.y = 0;
                        object.anchor.x = 0.0;
                        object.anchor.y = 0.0; 
                        
                        bmd.alphaMask(object, mask);
                        //bmd.alphaMask(bmd, object);
                        //bmd.draw(object, -object.width/2, -object.height, object.width,  object.height);
                       // bmd.draw(object);
                        object.anchor.x = 0.5;
                        object.anchor.y = 1.0; 
                        
                        //
                        maskedObject.thebitmapdata = bmd;
                        maskedObject.object = object;
                        //
                        maskedObject.image = new Phaser.Image(this.game, x, y, bmd);          
                        this.game.add.existing(maskedObject.image);
                        //console.log(maskedObject.image.width, bmd);
                        //this.game.add.image(x, y, bmd);
                        maskedObject.image.anchor.x = 0.5;
                        maskedObject.image.anchor.y = 1.0;                        
                        this.maingame.objectGroup.add(maskedObject.image);

                        this.maskedobjects[i] = maskedObject;
                        
                        object.visible  = false;
                        object.x  = object.x;
                        object.y  = object.y;
                    }
                    else
                    {
                        //this.maskedobjects[i]
                    }
                   /* if(object.mask==null)
                    {
                       object.mask =  this.createCircleMask(100);
                    }
                    object.mask.x = locx;
                    object.mask.y = locy;                    */
                }
                else
                {
                    if(this.maskedobjects[i] != null)
                    {
                     //   object.visible = true; 
                    //    this.maskedobjects[i].cleanup();
                    //    this.maskedobjects[i] = null;
                    }
                }
            }
        } 
    }
}

Masker.prototype.fasterDistance = function(x1,y1,x2,y2){
    var a = x1 - x2
    var b = y1 - y2
    //var c = Math.sqrt( a*a + b*b );
    return (a*a + b*b);
}
//
var MaskedObject = function ()
{
    this.thebitmapdata;
    this.object;
    this.image;
}
MaskedObject.prototype.cleanup = function()
{
    if(this.image)
    {
        this.image.destroy();
        this.thebitmapdata = null;
        this.object = null;
        this.image = null;
    }
}