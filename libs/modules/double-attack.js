var DoubleAttack = function(chance) {
    var doubled = false;
    return {
        finishAttack: function(theAttack, victim) {
            if(Math.random() < 1.0 && !doubled && victim.hp > 0) {      //if chance has it...
                console.log('double attacking...');
                doubled = true;
                this.startAttack(theAttack);
            } else
                doubled = false;
        },
    };
};
