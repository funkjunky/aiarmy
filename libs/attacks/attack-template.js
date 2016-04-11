var AttackTemplate = function(props, attrs) {
  this.prototype = Object.create(Attack.prototype);  
  Attack.call(this, props, attrs); 
};

AttackTemplate.prototype.finishAttack = function(victim) {
    console.log('TEST ATTACK FINISHED. Test: ', this.attrs.test);
    victim.takeDamage(this.modifyDamage(2));
};
