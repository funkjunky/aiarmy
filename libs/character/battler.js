var Battler = Engager.extend({
    hp: 1,
    attacks: [],
    ctor: function(resource, tags) {
        if(!hp)
            this.error('Health not set for character.', this.id, this.tags, this);

        tags.push('battler');
        this._super(resource, tags);
    },
    takeAttack: function(attack, attacker) {
        this.trigger('takeDamage', attack.dmg, attacker);
    },
    takeDamage: function(dmg, attacker) {
        this.hp -= dmg;
        if(this.hp <= 0) {
            this.trigger('defeated', attacker);
            attacker.trigger('enemyDefeated', this);
        }
    },
    defeated: function(enemy) {
        this.removeFromParent();
    },
});
