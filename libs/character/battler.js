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
        takeDamage(attack.dmg, attacker);
        this.modules.forEach(function(module) {
            if(module.takeAttack)
                module.takeAttack.call(this, attack, attacker);
        }, this);
    },
    takeDamage: function(dmg, attacker) {
        this.hp -= dmg;
        this.modules.forEach(function(module) {
            if(module.takeDamage)
                module.takeDamage.call(this, attack, attacker);
        }, this);
        if(this.hp <= 0)
            this.defeated(attacker);
    },
    defeated: function(enemy) {
        this.modules.forEach(function(module) {
            if(module.defeated)
                module.defeated.call(this, enemy);
        }, this);
        enemy.modules.forEach(function(module) {
            if(module.enemyDefeated)
                module.defeated.call(this, enemy);
        }, this);
    },
});
