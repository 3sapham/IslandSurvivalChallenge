let resources = {
    wood: 20,
    vine: 10,
    food: 30,
    stone: 20,
    energy: 70,
    obsidian: 0,
    rare: 0,
}

let obsChance = 1;
let fangChance = 1;
let craftedTools = [];
let selectedTool;
let numOfClicks = 0;
if (!localStorage.bestscore) {
    localStorage.setItem("bestscore", 0);
}

async function fetchData() {
    try {
        let response = await fetch("https://thoughtful-vagabond-fibre.glitch.me/tools");
        return data = await response.json();
    } catch (error) {
        console.log("Error:", error);
        document.getElementById("toolName").textContent = "Error finding tools";
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
    image.setAttribute('src', data["img-url"]);
}

function checkStatus() {
    if (resources.food < 10 && resources.energy < 10) gameOver("lose");
    
    if (resources.energy < 10) {
        disableBtn(true, "gatherBtn");
        document.getElementById("gatherTooltip").textContent = "Need at least 10% energy💪";
    } else {
        disableBtn(false, "gatherBtn");
    }

    if (resources.energy < 20) {
        disableBtn(true, "huntBtn");
        document.getElementById("huntTooltip").textContent = "Need at least 20% energy💪";
    } else {
        disableBtn(false, "huntBtn");
    }

    if (resources.food < 10 || resources.energy > 100) {
        disableBtn(true, "restBtn");
        document.getElementById("restTooltip").textContent = "Need at least 10 food🍖";
    } else {
        disableBtn(false, "restBtn");
    }

    if (craftedTools.includes("HOME!!!") && resources.energy >= 40) {
        disableBtn(false, "sailBtn");
    } else {
        disableBtn(true, "sailBtn");
        document.getElementById("sailTooltip").textContent = "Need at least 40% energy💪 and a boat";
    }
}

function update() {
    checkStatus();
    document.getElementById("bestscore").textContent = localStorage.getItem("bestscore");
    document.getElementById("score").textContent = numOfClicks;

    for (const res in resources) {
        if (res === "energy") {
            document.getElementById(res).value = resources[res];
            if (resources[res]>100) {
                document.getElementById("progressText").textContent = 100 + "%";
            } else {
                document.getElementById("progressText").textContent = resources[res] + "%";
            }
        }
        document.getElementById(res).textContent = resources[res];
    }
    if (selectedTool) canCraft(selectedTool);
}

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
        if (resources[res] < amount) possible = false;
    })

    possible ? disableBtn(false, "craftBtn") : disableBtn(true, "craftBtn");
}

function craft(tool) {
    let reqArray = tool.requirements;
    reqArray.forEach(element => {
        const req = element.split(" ");
        const amount = req[0];
        const res = req[1];
        resources[res] -= amount;
    })

    const effect = tool.effect;
    const efArray = effect.split("_");
    const eff = efArray[0];
    const type = efArray[1];

    if (eff === "quadruple" && craftedTools.includes("double_"+type)) {
        document.getElementById("double_"+type).remove();
        craftedTools = craftedTools.filter((r) => r !== "double_"+type);
    }
    
    craftedTools.push(tool.effect);

    let img = document.createElement("img");
    img.setAttribute('src', tool["img-url"]);
    img.id = tool.effect;

    img.className = "tools";
    document.getElementById("toolsBox").appendChild(img);
    canCraft(selectedTool);
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
        if (numOfClicks < localStorage.getItem("bestscore") || localStorage.getItem("bestscore") == 0) {
            localStorage.setItem("bestscore", numOfClicks);
            scoretext.textContent = "New best score: " + numOfClicks + "!!";
        }
    } else if (status === "lose") {
        title.textContent = "YOU PERISHED...";
        emojiText.textContent = "😵💀🪦";
        scoretext.textContent = "Your number of clicks: " + numOfClicks;
    }
    paragraph.textContent = "Best score: " + localStorage.bestscore;

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

    document.getElementById("toolName").textContent = "";
    document.getElementById("toolDescription").textContent = "";
    document.getElementById("toolReqTitle").textContent = "";
    document.getElementById("toolImage").setAttribute('src', " " );
    document.getElementById("itemSelect").value = "0";

    let points = document.getElementById("toolRequirements");
    while (points.firstChild) {
        points.removeChild(points.firstChild)
    }

    let toolsBox = document.getElementById("toolsBox");
    while (toolsBox.firstChild) {
        toolsBox.removeChild(toolsBox.firstChild)
    }

    craftedTools = [];
    numOfClicks = 0;

    update();
}

function disableBtn(state, btnName) {
    document.getElementById(btnName).disabled = state;
}

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

document.getElementById("modalBtn").addEventListener("click", reset);

document.getElementById("resetBtn").addEventListener("click", reset);

document.getElementById("itemSelect").addEventListener("change", (event) => {
    let points = document.getElementById("toolRequirements");
    while (points.firstChild) {
        points.removeChild(points.firstChild)
    }
    displayTool(data[event.target.value - 1]);
    selectedTool = data[event.target.value - 1];
    canCraft(selectedTool);
});

document.getElementById("craftBtn").addEventListener("click", () => {
    craft(selectedTool)
    update();
});

document.getElementById("huntBtn").addEventListener("click", () => {
    let toolEffect = null;
    if (craftedTools.length > 0) {
        craftedTools.forEach(element => {
            const effect = element.split("_");
            if (effect[1] === "hunt") {
                    toolEffect = effect[0];
               
            }
        });
    }
    hunt(toolEffect);

    update();
});

document.getElementById("gatherBtn").addEventListener("click", () => {
    let toolEffect = null;
    if (craftedTools.length > 0) {
        craftedTools.forEach(element => {
            const effect = element.split("_");
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

document.getElementById("restBtn").addEventListener("click", () => {
    rest();
    update();
});

document.getElementById("sailBtn").addEventListener("click", () => {
    sail();
});