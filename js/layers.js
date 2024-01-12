addLayer("p", {
    name: "factory", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "W", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "brown",
    requires: new Decimal(10), // Can be a function that takes requirement increases into account
    resource: "wheels", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        if (hasUpgrade('p', 13)) mult = mult.times(upgradeEffect('p', 13))
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "p", description: "P: Reset for prestige points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return true},
    upgrades: {
        11: {
            title: "Second Gear",
            description: "Double your point gain.",
            cost: new Decimal(1),
        },

        12: {
            title: "Rotate faster",
            description: "Wheels boost points",
            cost: new Decimal(2),
            unlocked() {
                if(hasUpgrade(this.layer, 11)) return true
            },
            effect() {
                return player[this.layer].points.add(1).pow(0.6)
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },

        13: {
            title: "Better Productivity",
            description: "Points boost wheels",
            cost: new Decimal(5),
            unlocked() {
                if(hasUpgrade(this.layer, 12)) return true
            },
            effect() {
                return player.points.add(1).pow(new Decimal(0.02).add(new Decimal(0.1).mul(getBuyableAmount(this.layer, 11))))
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },

        14: {
            title: "Self-Spiral",
            description: "Points boost points",
            cost: new Decimal(30),
            unlocked() {
                if(hasUpgrade(this.layer, 13)) return true
            },
            effect() {
                return player.points.add(1).sqrt()
            },
            effectDisplay() {
                return format(upgradeEffect(this.layer, this.id))+"x"
            },
        },

        21: {
            title: "Cogwheel",
            description: "Unlock a buyable",
            cost: new Decimal(100),
            unlocked() {
                if(hasUpgrade(this.layer, 14)) return true
            },
        }
    },
    buyables: {
        11: {
            title: "Bigger Cog",
            cost() {
                return new Decimal(100).mul(new Decimal(2).pow(getBuyableAmount(this.layer, this.id)))
            },
            effect() {
                return new Decimal(0.02).mul(getBuyableAmount(this.layer, this.id))
            },
            display() {
                return "Add 0.02 to Better Productivity exponent\nLevel: " + getBuyableAmount(this.layer, this.id) + "\n" + "Cost: " + format(this.cost()) + "\n" + "Effect: +" + this.effect()
            },
            unlocked() {
                if (hasUpgrade(this.layer, 21)) return true
            },
            canAfford() {
                return player[this.layer].points.gte(this.cost())
            },
            buy() {
                player[this.layer].points = player[this.layer].points.sub(this.cost())
                setBuyableAmount(this.layer, this.id, getBuyableAmount(this.layer, this.id).add(1))
            }
        }
    }
}
)

addLayer("achievement", {
    name: "Achievement",
    symbol: "A",
    resource: "Achievements",
    row: "side",
    achievements: {
        11: {
            name: "Everything starts somewhere",
            done() {
                if (hasUpgrade('p', 11)) return true
            },
            tooltip: "Buy the first prestige upgrade"
        },
        12: {
            name: "More things to click on",
            done() {
                if (hasUpgrade('p', 21)) return true
            },
            tooltip: 'Unlock the first buyable<br>Reward : Gain 100 wheels',
            onComplete() {
                player['p'].points = player['p'].points.add(100)
            },
        },
    }
}
)