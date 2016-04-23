var Battler = Engager.extend({
    hp: 1,
    ctor: function(resource, tags) {
        tags.push('battler');
        this._super(resource, tags);
    },
    takeAttack: function(attack, attacker) {
        this.takeDamage(attack.dmg, attacker);
    },
    takeDamage: function(dmg, attacker) {
        console.log('TAKE ATTACK!!!!');
        BubbleText.quickPrint(dmg, this, {panOffset: {x: 0, y: 64}});
        this.hp -= dmg;
        if(this.hp <= 0) {
            this.defeated(attacker);
            attacker.trigger('enemyDefeated', this);
        }
        this.trigger('takeDamage', dmg, attacker);
    },
    defeated: function(enemy) {
        this.removeAsInteractive();
        this.trigger('defeated', enemy);
    },
});
