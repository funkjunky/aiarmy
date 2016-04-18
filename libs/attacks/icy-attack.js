//TODO: this is a lame implementation, mostly just to see what i can do.
//      I should use some kind of debuffing system to do this in the future.
var IcyAttack = function(owner, props, attrs) {
  BasicAttack.call(this, owner, props, attrs); 
};

IcyAttack.prototype = Object.create(BasicAttack.prototype);
IcyAttack.prototype.constructor = BasicAttack;

//IDEA: some attacks ignore the speed modifier of a character and others don't
//      So icy would slow down a sword, but not a gun or magic.
IcyAttack.prototype.finishAttack = function(theAttack, victim) {
    //TODO: this well only affect attacks in progress. need debuff to do properly.
    victim.attackAnimationCooldown += 0.5;
    BasicAttack.prototype.finishAttack.call(this, theAttack, victim);
};
