var eventIncrement = 0;
var Interactive = cc.Sprite.extend({
    eventsInteractivesInRange: {},
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
});
