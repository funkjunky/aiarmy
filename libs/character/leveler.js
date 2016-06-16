var Leveler = Battler.extend({
    level: 1,
    exp: 0,
    expForNextLevel: 10,
    expBar: null,
    ctor: function(resource, tags, level) {
        tags.push('leveler');
        this._super(resource, tags);

        if(level)
            this.level = level;

        var expBackground = cc.Sprite.create();
        expBackground.setColor(cc.color(0,0,0,1));
        expBackground.setPosition(0,5);
        expBackground.setAnchorPoint(cc.p(0, 0));
        expBackground.setTextureRect(cc.rect(0,0,32, 5));

        this.expBar = cc.Sprite.create();
        this.expBar.setColor(cc.color(122,122,122,1));
        this.expBar.setPosition(0,0);
        this.expBar.setAnchorPoint(cc.p(0, 0));
        this.expBar.setTextureRect(cc.rect(0,0,0, 5));
        expBackground.addChild(this.expBar);

        this.addChild(expBackground);

        this.modules.push(GainExpFromMonsters());

        Event.subscribe('enemyDefeated', this, function(data) {
            this[0].gainExp(data.victim.exp);
        });
    },
    gainExp: function(exp) {
        this.exp += exp;
        if(this.exp >= this.expForNextLevel) {
            this.levelUp();
            this.expForNextLevel = this.exp + (10 * this.level + Math.pow(2, Math.ceil(this.level / 5)));
        }
        this.expBar.setTextureRect(cc.rect(0, 0, 32 * (this.exp / this.expForNextLevel), 5));
        //TODO: do other level stuff.
    },
    levelUp: function() {
        ++this.level;
    },
});
