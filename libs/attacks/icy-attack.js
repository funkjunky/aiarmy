//TODO: this is a lame implementation, mostly just to see what i can do.
//      I should use some kind of debuffing system to do this in the future.
var IcyAttack = function(props, attrs) {
  this.prototype = Object.create(Attack.prototype);  
  Attack.call(this, props, attrs); 
};

TestAttack.prototype.finishAttack = function(victim) {
    victim.attackCooldown += 0.5;
    victim.attackAnimationCooldown += 0.5;
    Attack.prototype.call(this, victim);
};
