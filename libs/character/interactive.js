var eventIncrement = 0;
var Interactive = cc.Sprite.extend({
    eventsInteractivesInRange: {},
    goingTo: null,      //TODO: move these into their own object.
    goingToLastLoc: null,   //TODO: messy
    goingToAction: null,
    goingToTTL: 0,
    ctor: function(resource, tags) {
        this._super(resource);

        this.setAnchorPoint(0,0);

        this.tags = [];
        this.selectEvents = [];
        this.fenceEvents = [];

        if(tags)
            this.tags = tags;

        this.scheduleUpdate();

        //TODO: find a simpler way to do events, or make my own event wrapper.
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touches, event) {
                for(var i=0; i!=this.selectEvents.length; ++i)
                    this.selectEvents[i](touches[0].getLocation());
            }.bind(this),
        }, this);
    },

    update: function(dt) {
        var goingToTTL = 0.5;
        if(this.goingTo && (this.goingToTTL -= dt) <= 0) {
            this.updatePath();
            this.goingToTTL = goingToTTL;
        }
    },

    updatePath: function() {
        var gameMap = _globals.gameMap;
        if(MathHelper.dist(this.goingToLastLoc, this.goingTo) > 32) {
            this.setNewSeek();
        }
    },

    onSelect: function(cb, stopPropagation) {
        this.selectEvents.push(function(point) {
            if(MathHelper.isPointInsideRect(point, this)) {
                cb(point);
                if(stopPropagation)
                    __stopPropagation = true;
            }
        }.bind(this));
    },
    onFenceEnter: function(tagOrInteractive, range, cb) {
        var event = {type: 'onEnter', tagOrInteractive: tagOrInteractive, range: range, cb: cb, id: ++eventIncrement};
        this.fenceEvents.push(event);
        this.eventsInteractivesInRange[eventIncrement] = [];
        return event;
    },
    onFenceExit: function(tagOrInteractive, range, cb) {
        var event = {type: 'onExit', tagOrInteractive: tagOrInteractive, range: range, cb: cb, id: ++eventIncrement};
        this.fenceEvents.push(event);
        this.eventsInteractivesInRange[eventIncrement] = [];
        return event;
    },

    //TODO: add this as part of another package for AI controls or something
    path: function(loc) {
        var gameMap = _globals.gameMap;
        this.goingTo = loc;
        this.goingToAction = gameMap.move(this, loc, 0.1);    //TODO: dont' hardcore speed. It should be on a lower level class I think? Not Interactive.
    },

    //TODO: I shouldn't use actions for seeking. This one is very dynamic. I should simply use update and move myself? maybe move from tile to tile during update?
    seek: function(object) {
        this.goingTo = object;
        this.setNewSeek();
    },

    setNewSeek: function() {
        var gameMap = _globals.gameMap;
        var oldAction = this.goingToAction;
        this.goingToAction = gameMap.move(this, object, 0.1);    //TODO: dont' hardcore speed. It should be on a lower level class I think? Not Interactive.
        if(oldAction)
            this.stopAction(oldAction);
    },
});
