var Thief = Leveler.extend({
    modules: [DoubleAttack(0.5)],
    ctor: function(resource, level) {
        this._super(resource, ['thief'], level);
        this.hp = 100;

        this.attacks = [
            new BasicAttack({               //Spikes every 2 seconds
                    range: 1,
                    attackCooldown: 2,
                    attackAnimationCooldown: 0.1,
                }, {
                    baseDamage: 1,
            }),
            new MutuallyExclusiveAttack([new BasicAttack({
                    range: 2,
                    attackCooldown: 1,
                    attackAnimationCooldown: 1,
                }, {
                    baseDamage: 2,
            }), new TestAttack({
                    range: 5,
                    attackCooldown: 2,
                    attackAnimationCooldown: 2,
                }, {
                    test: 'test-value',
                },
            }]),
        ];
    },
});
