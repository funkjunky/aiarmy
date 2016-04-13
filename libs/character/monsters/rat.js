var Rat = Monster.extend({
    hp: 50,
    exp: 5,
    ctor: function() {
        this._super(res.mouse, ['rat', 'beast']);
        this.bundles.push(AttacksBack);
        this.attacks = [new BasicAttack({
                range: 32 * 2,
                attackCooldown: 2,
                attackAnimationCooldown: 1,
            }, {
                baseDamage: 1,
            },
        })];
    },
});
