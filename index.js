let resources = {
    wood: 20,
    vine: 10,
    food: 30,
    stone: 20,
    energy: 70,
    obsidian: 0,
    rare: 0,
}

let craftedTools = [];
let selectedTool;
let numOfClicks = 0;
if(!localStorage.highscore) {
    localStorage.setItem("highscore", 0);
}

async function fetchData() {
    try {
        let response = await fetch("https://thoughtful-vagabond-fibre.glitch.me/tools");
        return data = await response.json();
    } catch (error) {
        console.log("Error:", error);
    }
}

async function initializeToolData() {
    const data = await fetchData();

    toolDropdown(data);
};

initializeToolData();

function toolDropdown(data) {
    data.forEach(element => {
        let opt = document.createElement("option");
        opt.setAttribute('value', element["id"]);
        opt.textContent = element["title"];
        document.getElementById("itemSelect").appendChild(opt);
    })
}

function displayTool(data) {
    document.getElementById("toolName").textContent = data.title;
    document.getElementById("toolDescription").textContent = data.description;
    document.getElementById("toolReqTitle").textContent = "Requirements:";
    const requirements = data.requirements;
    requirements.forEach(element => {
        let point = document.createElement("li");
        point.textContent = element;
        document.getElementById("toolRequirements").appendChild(point);
    });
    let image = document.getElementById("toolImage");
    image.setAttribute('src', data["img-url"])
}

function checkStatus() {
    if (resources.food < 10 && resources.energy < 10) {
        gameOver("lose");
    }

    if (resources.energy < 10) {
        disableBtn(true, "gather");
        document.getElementById("gatherTooltip").textContent = "Need at least 10% energy💪";

    } else {
        disableBtn(false, "gather")
    }

    if (resources.energy < 20) {
        disableBtn(true, "hunt");
        document.getElementById("huntTooltip").textContent = "Need at least 20% energy💪";
    } else {
        disableBtn(false, "hunt")
    }

    if (resources.food < 10 || resources.energy > 100) {
        disableBtn(true, "rest");
        document.getElementById("restTooltip").textContent = "Need at least 10 food🍖";
    } else {
        disableBtn(false, "rest")
    }

    if (craftedTools.includes("HOME!!!") && resources.energy > 40) {
        disableBtn(false, "sail")
    } else {
        disableBtn(true, "sail")
        document.getElementById("sailTooltip").textContent = "Need at least 40% energy💪 and a boat";
    }
}

function update() {
    checkStatus();
    document.getElementById("highscore").textContent = localStorage.getItem("highscore");
    document.getElementById("score").textContent = numOfClicks;
    console.log("getitem "+localStorage.getItem("highscore"));
    console.log(".highscore "+localStorage.highscore);

    for (const res in resources) {
        if (res === "energy") {
            document.getElementById(res).value = resources[res];
            if(resources[res]>100) {
                document.getElementById("progressText").textContent = 100 + "%";
            } else {
                document.getElementById("progressText").textContent = resources[res] + "%";
            }
        }
        document.getElementById(res).textContent = resources[res];
    }
    if (selectedTool) canCraft(selectedTool)
}

function craft(tool) {
    let reqArray = tool.requirements;
    reqArray.forEach(element => {
        const req = element.split(" ");
        const amount = req[0];
        const res = req[1];
        resources[res] -= amount
    })

    const effect = tool.effect;
    const efArray = effect.split("_");
    const eff = efArray[0];
    const type = efArray[1];

    if (eff === "quadruple" && craftedTools.includes("double_"+type)) {
        document.getElementById("double_"+type).remove();
        craftedTools = craftedTools.filter((r) => r !== "double_"+type);
    }
    
    craftedTools.push(tool.effect)
    console.log("crafted: "+craftedTools)

    let img = document.createElement("img");
    img.setAttribute('src', tool["img-url"])
    img.id = tool.effect;

    img.className = "tools";
    document.getElementById("toolsBox").appendChild(img);
    canCraft(selectedTool)
}

let obsChance = 1;
let fangChance = 1;

function gather(effect) {
    numOfClicks++;

    resources.energy -= 10;

    resources.vine += Math.floor(Math.random() * 10) + 1;
    resources.food += Math.floor(Math.random() * 10) + 1;
    resources.stone += Math.floor(Math.random() * 5) + 1;

    if ((Math.floor(Math.random() * 10) + 1) < (obsChance += 1)) resources.obsidian += 1;

    if (effect == "quadruple") {
        resources.wood += (Math.floor(Math.random() * 10) + 1) * 4;
    } else if (effect == "double") {
        resources.wood += (Math.floor(Math.random() * 10) + 1) * 2;
    } else {
        resources.wood += Math.floor(Math.random() * 10) + 1;
    }
}

function hunt(effect) {
    numOfClicks++;

    resources.energy -= 20;

    if ((Math.floor(Math.random() * 10) + 1) < (fangChance += 1)) resources.rare += 1;

    if (effect == "quadruple") {
        resources.food += (Math.floor(Math.random() * 10) + 1) * 4;
        console.log("quadruple")
    } else if (effect == "double") {
        resources.food += (Math.floor(Math.random() * 20) + 1) * 2;
        console.log("double")

    } else {
        resources.food += Math.floor(Math.random() * 20) + 1;
        console.log("single")

    }
}

function rest() {
    numOfClicks++;

    resources.food -= 10;
    resources.energy += Math.floor(Math.random() * 20) + 1;
}

function sail() {
    resources.energy -= 40;
    gameOver("win");
}

function gameOver(status) {
    document.getElementById("modal").style.visibility = "visible";
    let title = document.getElementById("modalTitle");
    let emojiText = document.getElementById("modalEmoji");
    let paragraph = document.getElementById("modalParagraph");
    let scoretext = document.getElementById("modalScore");


    if (status === "win") {
        title.textContent = "YOU WON!!";
        emojiText.textContent = "⭐️🤩🏆";
        if (numOfClicks < localStorage.getItem("highscore") || localStorage.getItem("highscore") == 0) {
            localStorage.setItem("highscore", numOfClicks);
            scoretext.textContent = "New high score: " + numOfClicks + "!!";
        }
    } else if (status === "lose") {
        title.textContent = "YOU PERISHED...";
        emojiText.textContent = "😵💀🪦";
        scoretext.textContent = "Your score: " + numOfClicks;
    }
    paragraph.textContent = "High score: " + localStorage.highscore;


    document.getElementById("modalBtn").textContent = "Play again";
}

function reset() {
    document.getElementById("modal").style.visibility = "hidden";
    resources = {
        wood: 20,
        vine: 10,
        food: 30,
        stone: 20,
        energy: 70,
        obsidian: 0,
        rare: 0,
    }

    let toolsBox = document.getElementById("toolsBox");
    while (toolsBox.firstChild) {
        toolsBox.removeChild(toolsBox.firstChild)
    }

    craftedTools = [];
    numOfClicks = 0;

    update();
}

document.getElementById("modalBtn").addEventListener("click", reset)
document.getElementById("resetBtn").addEventListener("click", reset)

function canCraft(data) {
    let reqArray = data.requirements;
    let possible = true;

    const effect = data.effect;
    const efArray = effect.split("_");
    const type = efArray[1];

    if (craftedTools.includes(selectedTool.effect) || craftedTools.includes("quadruple_"+type)) {
        possible = false;
    }

    reqArray.forEach(element => {
        const req = element.split(" ");
        const amount = req[0];
        const res = req[1];
        if (resources[res] < amount) {
            possible = false;
        }
    })

    if (possible) {
        disableBtn(false, "craftBtn");
    } else {
        disableBtn(true, "craftBtn")
    }
}

function disableBtn(state, btnName) {
    document.getElementById(btnName).disabled = state;
}

document.getElementById("itemSelect").addEventListener("change", (event) => {
    let points = document.getElementById("toolRequirements");
    while (points.firstChild) {
        points.removeChild(points.firstChild)
    }
    displayTool(data[event.target.value - 1]);
    selectedTool = data[event.target.value - 1];
    canCraft(selectedTool)
});

document.getElementById("craftBtn").addEventListener("click", () => {
    craft(selectedTool)
    update();
});

document.getElementById("hunt").addEventListener("click", () => {
    let toolEffect = null;
    if (craftedTools.length > 0) {
        craftedTools.forEach(element => {
            const effect = element.split("_")
            if (effect[1] === "hunt") {
                    toolEffect = effect[0];
               
            }
        });
    }
    hunt(toolEffect);

    update();
});

document.getElementById("gather").addEventListener("click", () => {
    let toolEffect = null;
    if (craftedTools.length > 0) {
        craftedTools.forEach(element => {
            const effect = element.split("_")
            if (effect[1] === "wood") {
                if (toolEffect !== "quadruple") {
                    toolEffect = effect[0];
                }
                return
            }
        });
    }
    gather(toolEffect);

    update();
});

document.getElementById("rest").addEventListener("click", () => {
    rest()
    update();
});

document.getElementById("sail").addEventListener("click", () => {
    sail()
});