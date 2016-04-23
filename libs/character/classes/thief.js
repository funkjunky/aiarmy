var Thief = Leveler.extend({
    ctor: function(level) {
        this._super(res.jane, ['thief'], level); //TODO: need a better resource manager than 'res'
        this.hp = 200;

        this.attacks = [
            new BasicAttack(this, {
                range: 32 * 2,
                attackCooldown: 1,
                attackAnimationCooldown: 0.5,
            }, {
                baseDamage: 5,
            }),
            new BasicAttack(this, {
                range: 32 * 6,
                attackCooldown: 3,
                attackAnimationCooldown: 0.5,
            }, {
                baseDamage: 8,
            }),
        ];
        this.modules.push(EngageFirst(this));
        this.modules.push(SeekToEngage());
        this.modules.push(DoubleAttack(0.5));
        this.modules.push(MutuallyExclusiveAttacks(this.attacks, function comp(a, b) {
            console.log('dps: ', a.getDps(), b.getDps());
            return a.getDps() > b.getDps();
        }));
    },
});
