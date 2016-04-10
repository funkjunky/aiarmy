var Battler = Engager.extend({
    hp: 1,
    ctor: function(resource, tags, hp) {
        if(!hp)
            this.error('Health not set for character.', this.id, this.tags, this);

        tags.push('battler');
        this._super(resource, tags);
        this.hp = hp;
    },
    takeAttack: function(attack, attacker) {
        takeDamage(attack.dmg, attacker);
    },
    takeDamage: function(dmg, attacker) {
        this.hp -= dmg;
    },
});
