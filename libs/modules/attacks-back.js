var AttacksBack = function(character, attack) {
    Event.subscribe('attackTaken', character, function(data) {
        character.fullAttack(attack, data.attacker);
    });
    return {};
};
