var Battler = Engager.extend({
    hp: 1,
    ctor: function(resource, tags) {
        tags.push('battler');
        this._super(resource, tags);
    },
    takeAttack: function(attack, attacker) {
        this.takeDamage(attack.dmg, attacker);
        Event.trigger('attackTaken', this, {attacker: attacker});
    },
    takeDamage: function(dmg, attacker) {
        BubbleText.quickPrint(dmg, this, {panOffset: {x: 0, y: 64}});
        this.hp -= dmg;
        if(this.hp <= 0) {
            this.defeated(attacker);
            Event.trigger('enemyDefeated', attacker, {victim: this});
        }
    },
    defeated: function(enemy) {
        this.removeAsInteractive();
        Event.trigger('defeated', enemy, {attacker: enemy});
    },
});
