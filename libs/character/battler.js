var Battler = Engager.extend({
    maxHp: 1,
    hp: 1,
    healthBar: null,
    ctor: function(resource, tags) {
        tags.push('battler');
        this._super(resource, tags);
        //console.log(this._rect.height, this);

        var healthBackground = cc.Sprite.create();
        healthBackground.setColor(cc.color(255,255,255,1));
        healthBackground.setPosition(0,0);
        healthBackground.setAnchorPoint(cc.p(0, 0));
        healthBackground.setTextureRect(cc.rect(0,0,32, 5));

        this.healthBar = cc.Sprite.create();
        this.healthBar.setColor(cc.color(255,0,0,1));
        this.healthBar.setPosition(0,0);
        this.healthBar.setAnchorPoint(cc.p(0, 0));
        this.healthBar.setTextureRect(cc.rect(0,0,32, 5));
        healthBackground.addChild(this.healthBar);


        this.addChild(healthBackground);
    },
    takeAttack: function(attack, attacker) {
        if(this.dodge && Math.random() < this.dodge)
            BubbleText.quickPrint('Miss!', this, {panOffset: {x: 32 - Math.random() * 64, y: 64}, color: cc.color(122,122,255)});
        else {
            var dmg = attack.dmg;
            if(this.dmgTakenMod)
                dmg *= this.dmgTakenMod;
            this.takeDamage(dmg, attacker);
            Event.trigger('attackTaken', [this], {attacker: attacker});
        }
    },
    takeDamage: function(dmg, attacker) {
        var color = ((this.tags.indexOf('player') != -1)?cc.color(255,122,122):cc.color(255,255,255));
        BubbleText.quickPrint(dmg, this, {panOffset: {x: 32 - Math.random() * 64, y: 64}, color: color});
        this.hp -= dmg;
        this.healthBar.setTextureRect(cc.rect(0, 0, 32 * (this.hp / this.maxHp), 5));
        if(this.hp <= 0) {
            this.defeated(attacker);
            Event.trigger('enemyDefeated', [attacker], {victim: this});
        }
    },
    defeated: function(enemy) {
        this.removeAsInteractive();
        Event.trigger('defeated', [enemy], {attacker: enemy});
    },
});
