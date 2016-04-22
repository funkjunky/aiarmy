var EngageFirst = function(character) {
    var monstersInRange = [];
    console.log('engage enter: ', character.onFenceEnter('monster', 40 * 32, function(monster, distance) {
        console.log('adding monster...', monster.__instanceId);
        monstersInRange.push(monster);
    }));
    console.log('engage exit: ', character.onFenceExit('monster', 40 * 32, function(monster, distance) {
        console.log('removing monster...', monster.__instanceId);
        monstersInRange.splice(monstersInRange.indexOf(monster), 1);
    }));
    return {
        update: function(dt) {
            if(!monstersInRange.length)
                return;

            
            LiveDebugger.set('monstersinrange', 'In Range: ' + monstersInRange.reduce(function(col, item) {
                return item.__instanceId + ' ' + col;
            }, ''));

            var firstMonster = monstersInRange[0]; //literally just the first monster in array. Super simple.

            //engage the closest monster for each attack, if it's not already engaged.
            //TODO: move this into owner... if not engaged, engage for all attacks?
            this.attacks.forEach(function(attack) {
                if(!attack.engagedEvents[firstMonster.id])
                    attack.engage(this, firstMonster); //TODO: passing attack is really weird here... I think I should disconnect attack's engage and modules engage. Different names, slightly different purposes.
            }, this);
        },
    };
};
