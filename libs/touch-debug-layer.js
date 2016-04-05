var TouchDebugLayer = cc.Layer.extend({
    textContainers: [],
    ctor: function() {
        this._super();

        for(var i=0; i!=10; ++i) {
            this.textContainers.push(new cc.LabelTTF('--', 'Verdana', 32));
            this.textContainers[i].attr({x: cc.winSize.width / 2, y: 50 + (i * 50)});
            this.addChild(this.textContainers[i]);
        }

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function(touches, event) {
                var i;
                for(i=0; i!=touches.length; ++i)
                    this.textContainers[i].setString(print_r(touches[i]._point));
                this.textContainers[i].setString('BEGAN');
                console.log(touches[0]);
            }.bind(this),
            onTouchesMoved: function(touches, event) {
                //Note: There is also _prevPoint, _startPoint, and _startPointCaptured on each touch.
                var i;
                for(i=0; i!=touches.length; ++i)
                    this.textContainers[i].setString(print_r(touches[i]._point));
                this.textContainers[i].setString('MOVED');
            }.bind(this),
            onTouchesEnded: function(touches, event) {
                var i;
                for(i=0; i!=touches.length; ++i)
                    this.textContainers[i].setString(print_r(touches[i]._point));
                this.textContainers[i].setString('ENDED');
            }.bind(this),
        }, this);
    },
});

    function print_r(obj) {
        var str = '{';
        for(var key in obj)
            str += key + ': ' + obj[key] + ', ';
        str += '}';

        return str;
    }
