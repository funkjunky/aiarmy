var OnHoldDodger = function() {
    return {
        onHoldEnter: function() {
            this.attacks[0].props.attackCooldown *= 2;
            this.attacks[0].props.attackAnimationCooldown *= 2;
            this.dodge = 0.5;
        },
        onHoldExit: function() {
            this.attacks[0].props.attackCooldown /= 2;
            this.attacks[0].props.attackAnimationCooldown /= 2;
            this.dodge = 0;
        },
    };
}
