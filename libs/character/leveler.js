var Leveler = Battler.extend({
    level: 1,
    exp: 0,
    expForNextLevel: 10,
    ctor: function(resource, tags, level) {
        tags.push('leveler');
        this._super(resource, tags);

        this.modules.push(GainExpFromMonsters);
        if(level)
            this.level = level;
    },
    gainExp: function(exp) {
        this.exp += exp;
        if(this.exp >= this.expForNextLevel) {
            this.levelUp();
            this.expForNextLevel = 10 * this.level + Math.pow(2, Math.ceil(this.level / 5));
        }
        //TODO: do other level stuff.
    },
    levelUp: function() {
        ++this.level;
    },
});
