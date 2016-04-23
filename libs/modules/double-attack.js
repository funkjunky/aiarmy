var DoubleAttack = function(chance) {
    var doubled = false;
    return {
        doneAttack: function(theAttack, victim) {
            if(Math.random() < 1.0 && !doubled) {      //if chance has it...
                doubled = true;
                this.startAttack(theAttack);
            } else
                doubled = false;
        },
    };
};
