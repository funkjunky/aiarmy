var EngageClosest = function(character) {
    var monstersInRange = [];
    character.onFenceEnter('monster', 10, function(monster, distance) {
        monstersInRange.push(monster);
    });
    character.onFenceExit('monster', 10, function(monster, distance) {
        monstersInRange.splice(monstersInRange.indexOf(monster), 1);
    });
    return {
        update: function(dt) {
            if(!monstersInRange.length)
                return;

            var closest = monstersInRange.reduce(function(closest, monster) {
                if(MathHelper.dist(this, monster) < closest)
                    return monster;
                else
                    return closest;
            }.bind(this), monstersInRange[0]); 

            //engage the closest monster for each attack, if it's not already engaged.
            this.attacks.forEach(function(attack) {
                if(!attack.engagedEvents[closest])
                    attack.engage(attack, closest); //TODO: passing attack is really weird here... I think I should disconnect attack's engage and modules engage. Different names, slightly different purposes.
            }, this);
        },
    };
};
