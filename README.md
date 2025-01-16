# Island Survival Challenge
A dynamic webpage using "vanilla" JavaScript game where you have to survive on a stranded island by gathering resources, crafting tools, managing energy, and building a boat to escape. RESTful API is used to provide data for available tools that can be crafted, each with specific effects on actions.
API Endpoint: https://thoughtful-vagabond-fibre.glitch.me/tools

Link to web page: https://3sapham.github.io/IslandSurvivalChallenge/

## Game description
The final objective is to gather enough resources to craft a boat and sail away from the island.

If you are out of food (you cannot rest to get energy) and do not have enough energy to perform an action to get food you will perish.

### Actions
These resources can be used for crafting tools and performing actions.
You start with:
- wood: 20
- vines: 10
- food: 30
- stone: 20
- energy: 70

Your survival actions deplete energy. Display an energy bar that decreases with each action, such as gathering or hunting. This energy refills by resting, which consumes food.

#### Gather Button
Simulates gathering food, wood, vines and stone. Each gather produces a random amount of each resource.
- Energy cost: 10
- Payoff: 1-10 vines, 1-10 food, 1-10 wood and 1-5 stone
Gathering consumes energy. If energy is lower than the energy cost, no more resources can be gathered until energy is restored.
Each time the survivor performs a Gather action 10 percent chance is added to find a piece of obsidian.

#### Hunt Button
Simulates hunting for food. Each hunt produces a potentially large amount of food.
- Energy cost: 20
- Payoff: 1-20 food
Hunting consumes energy. If energy is lower than the energy cost, no more hunting can occur until energy is restored.
Each time the survivor performs a Hunt action 10 percent chance is added to find a rare fang.

#### Rest Button
Simulates eating and resting. Each rest consumes food to gain energy.
- Energy cost: 0
- Food Cost: 10
- Payoff: 1-20 energy
Resting consumes food. If food is less than the cost, no more resting can occur until food is restored.

#### Sail Away Button
Simulates sailing away and winning the game. Sailing away consumes alot of energy and requires a boat.
- Energy cost: 40
- Payoff: YOU WIN!!
Sailing Away consumes energy. If energy is lower than the energy cost, you cannot sail away until energy is restored.


