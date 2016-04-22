var Battler = Engager.extend({
    hp: 1,
    ctor: function(resource, tags) {
        tags.push('battler');
        this._super(resource, tags);
    },
    takeAttack: function(attack, attacker) {
        this.trigger('takeDamage', attack.dmg, attacker);
    },
    takeDamage: function(dmg, attacker) {
        BubbleText.quickPrint(dmg, this, {panOffset: {x: 0, y: 64}});
        this.hp -= dmg;
        if(this.hp <= 0) {
            this.trigger('defeated', attacker);
            attacker.trigger('enemyDefeated', this);
        }
    },
    defeated: function(enemy) {
        this.removeAsInteractive();
    },
});
