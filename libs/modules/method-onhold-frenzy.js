var OnHoldFrenzy = function() {
    return {
        onHoldEnter: function() {
            this.attacks[0].props.attackCooldown /= 2;
            this.attacks[0].props.attackAnimationCooldown /= 2;
            this.dmgTakenMod = 2;
        },
        onHoldExit: function() {
            this.attacks[0].props.attackCooldown *= 2;
            this.attacks[0].props.attackAnimationCooldown *= 2;
            this.dmgTakenMod = 1;
        },
    };
}
