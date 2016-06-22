var AttackSelected = function(character, attack) {
    var selected = null;
    var theModule = this;

    //this module uses fullAttack
    //character.modules.push(FullAttack(character, attack));

    _globals.game.onCreateAttackable(function(attackableCharacter) {
        attackableCharacter.onSelect(function(point) {
            if(theModule.disabled)
                return;

            if(selected == attackableCharacter && character.attacks[0].activeAttack && !character.attacks[0].activeAttack.done())
                return;

            selected = attackableCharacter;

            character.fullAttack(attack, selected);
        }, true);

        attackableCharacter.onExit(function() {
            selected = null;
            this._super();
        });
    });

    return {};
};
