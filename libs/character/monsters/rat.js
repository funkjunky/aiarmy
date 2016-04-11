var Rat = Monster.extend({
    hp: 50,
    exp: 5,
    ctor: function(resource) {
        this._super(resource, ['rat', 'beast']);
        this.bundles.push(AttacksBack);
        this.attacks = [new BasicAttack({
                range: 1,
                attackCooldown: 2,
                attackAnimationCooldown: 1,
            }, {
                baseDamage: 1,
            },
        })];
    },
});
