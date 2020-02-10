function showDice() {
  document.getElementById("dicepage").classList.remove("hidden");
  document.getElementById("oraclepage").classList.add("hidden");
  document.getElementById("infopage").classList.add("hidden");
}

function showOracle() {
  document.getElementById("dicepage").classList.add("hidden");
  document.getElementById("oraclepage").classList.remove("hidden");
  document.getElementById("infopage").classList.add("hidden");
}

function showInfo() {
  document.getElementById("dicepage").classList.add("hidden");
  document.getElementById("oraclepage").classList.add("hidden");
  document.getElementById("infopage").classList.remove("hidden");
}

function displayAction() {
  document.getElementById("action-roller").classList.remove("hidden");
  document.getElementById("progress-roller").classList.add("hidden");
  document.getElementById("actiontab").classList.add("tabactive");
  document.getElementById("progresstab").classList.remove("tabactive");
}

function displayProgress() {
  document.getElementById("action-roller").classList.add("hidden");
  document.getElementById("progress-roller").classList.remove("hidden");
  document.getElementById("actiontab").classList.remove("tabactive");
  document.getElementById("progresstab").classList.add("tabactive");
}

function getEleArr(idArr) {
  let eleArr = [];
  for (let i=0; i<idArr.length; i++) {
    eleArr.push(document.getElementById(idArr[i]));
  }
  return eleArr;
}

function getSelected(eleArr) {
  let selDice = [];
  for (let i=0; i<eleArr.length; i++) {
    if (eleArr[i].classList.contains("selected")) {
      selDice.push(eleArr[i]);
    }
  }
  return selDice;
}

function toggleSelect(ele) {
  if (ele.classList.contains("selected")) {
    ele.classList.remove("selected");
  } else {
    if (ele.classList.contains("pressable")) {
      ele.classList.add("selected");
    }
  }
}

function deselect(eleArr) {
  for (let i=0; i<eleArr.length; i++) {
    eleArr[i].classList.remove("selected");
  }
}

function makePressable(eleArr) {
  for (let i=0; i<eleArr.length; i++) {
    eleArr[i].classList.add("pressable");
  }
}

function removePressable(eleArr) {
  for (let i=0; i<eleArr.length; i++) {
    eleArr[i].classList.remove("pressable");
  }
}

function removeShake(eleArr) {
  for (let i=0; i<eleArr.length; i++) {
    eleArr[i].classList.remove("shaking");
  }
}

function updateButton(idArr, buttonId) {
  selDice = getSelected(getEleArr(idArr));
  const rollbutton = document.getElementById(buttonId);
  if (selDice.length > 0) {
    rollbutton.firstChild.data = "Reroll";
  } else {
    rollbutton.firstChild.data = "Roll";
  }
}

function checkSelectAction(ele) {
  toggleSelect(ele);
  updateButton(['challengedie_a1', 'challengedie_a2', 'actiondie'],
    'roll-button_a');
}

function checkSelectProgress(ele) {
  toggleSelect(ele);
  updateButton(['challengedie_p1', 'challengedie_p2'], 'roll-button_p');
}

function shakeDice(eleArr) {
  for (let i=0; i<eleArr.length; i++) {
    eleArr[i].firstChild.data = "";
    eleArr[i].classList.add("shaking");
  }
}

function getDiceToRoll(eleArr) {
  let selDice = getSelected(eleArr);
  let diceToRoll = [];
  if (selDice.length == 0) {
    diceToRoll = eleArr;
  } else {
    diceToRoll = selDice;
  }
  return diceToRoll;
}

function shakeAction() {
  document.getElementById("roll-button_a").classList.add("pressed")
  let eleArr = getEleArr(['challengedie_a1', 'challengedie_a2', 'actiondie']);
  let diceToRoll = getDiceToRoll(eleArr);
  shakeDice(diceToRoll);
}

function shakeProgress() {
  document.getElementById("roll-button_p").classList.add("pressed")
  const cdie1 = document.getElementById("challengedie_p1");
  const cdie2 = document.getElementById("challengedie_p2");
  shakeDice([cdie1, cdie2]);
}

function rollDie(sides) {
  return Math.floor((Math.random() * sides) + 1);
}

function rollAction() {
  const buttonId = "roll-button_a";
  const chal1Id = "challengedie_a1";
  const chal2Id = "challengedie_a2";
  const actId = "actiondie";
  const resultId = "result_a";
  const statId = "extra-stat-val";
  const bonusId = "extra-bonus-val";
  const button = document.getElementById(buttonId);
  const result = document.getElementById(resultId);
  const statVal = parseInt(document.getElementById(statId).firstChild.data);
  const bonusVal = parseInt(document.getElementById(bonusId).firstChild.data);

  button.classList.remove("pressed");

  let eleArr = getEleArr([chal1Id, chal2Id, actId]);
  const dieVals = [10, 10, 6];
  removeShake(eleArr);
  let diceToRoll = getDiceToRoll(eleArr);
  let logMessage = "Action " + button.firstChild.data + ": ";

  // Roll all or only selected.
  if (button.firstChild.data == "Roll") {
    // roll all
    for (let i=0; i<eleArr.length; i++) {
      eleArr[i].firstChild.data = String(rollDie(dieVals[i]));
    }
  } else {
    // roll selected
    for (let i=0; i<eleArr.length; i++) {
      if (eleArr[i].classList.contains("selected")) {
        eleArr[i].firstChild.data = String(rollDie(dieVals[i]));
      }
    }
  }

  // Update the button and make dice non-selectable.
  if (button.firstChild.data == "Roll") {
    makePressable(diceToRoll);
  } else {
    button.firstChild.data = "Roll";
    deselect(eleArr);
    removePressable(eleArr);
  }

  // Get the roll result, update the result text and log.

  const c1Val = parseInt(eleArr[0].firstChild.data);
  const c2Val = parseInt(eleArr[1].firstChild.data);
  const aVal = parseInt(eleArr[2].firstChild.data);
  const aTotal = aVal + statVal + bonusVal;
  logMessage += "(" + c1Val + ", " + c2Val + ") vs (" + aVal + " + ";
  logMessage += statVal + " + " + bonusVal + " = " + aTotal + ")";
  let resultText = "";
  if (aTotal > c1Val && aTotal > c2Val) {
    resultText = "Strong Hit";
  } else if (aTotal > c1Val || aTotal > c2Val) {
    resultText = "Weak Hit";
  } else {
    resultText = "Miss";
  }
  if (c1Val == c2Val) {
    resultText += " & Match";
  }
  result.firstChild.data = resultText;
  logMessage += ": " + resultText;
  addToLog(logMessage);
}

function rollProgress() {
  const buttonId = "roll-button_p";
  const chal1Id = "challengedie_p1";
  const chal2Id = "challengedie_p2";
  const resultId = "result_p";
  const progressId = "extra-progress-val";
  const button = document.getElementById(buttonId);
  const result = document.getElementById(resultId);
  const pTotal = parseInt(document.getElementById(progressId).firstChild.data);

  button.classList.remove("pressed");

  let eleArr = getEleArr([chal1Id, chal2Id]);
  removeShake(eleArr);
  let logMessage = "Progress Roll: ";

  // Always roll all for progress.
  rollVals = [];
  for (let i=0; i<eleArr.length; i++) {
    let roll = rollDie(10);
    eleArr[i].firstChild.data = String(roll);
    rollVals.push(roll);
  }

  logMessage += "(" + rollVals[0] + ", " + rollVals[1] + ") vs " + pTotal + ": ";

  // Get the roll result, update the result text and log.

  let resultText = "";
  if (pTotal > rollVals[0] && pTotal > rollVals[1]) {
    resultText = "Strong Hit";
  } else if (pTotal > rollVals[0] || pTotal > rollVals[1]) {
    resultText = "Weak Hit";
  } else {
    resultText = "Miss";
  }
  if (rollVals[0] == rollVals[1]) {
    resultText += " & Match";
  }
  result.firstChild.data = resultText;
  logMessage += resultText;
  addToLog(logMessage);
}

function addToIDVal(eleID, num) {
  ele = document.getElementById(eleID);
  const eleVal = parseInt(ele.firstChild.data);
  if (num > 0 || eleVal + num >= 0) {
    ele.firstChild.data = String(eleVal + num);
  }
}

function addToLog(message) {
  logArea = document.getElementById("dicelog");
  logArea.value = message + "\n" + logArea.value;
}

function clearEle(eleId) {
  const ele = document.getElementById(eleId);
  ele.firstChild.data = "";
}

function rollOracle(options, eleId) {
  const ele = document.getElementById(eleId);
  const choice = Math.floor((Math.random() * options.length));
  ele.firstChild.data = options[choice];
}

function oracleAction() {
  const options = ["Scheme", "Clash", "Weaken", "Initiate", "Create", "Swear",
            "Avenge", "Guard", "Defeat", "Control", "Break", "Risk",
            "Surrender", "Inspect", "Raid", "Evade", "Assualt", "Deflect",
            "Threaten", "Attack", "Leave", "Preserve", "Manipulate",
            "Remove", "Eliminate", "Withdraw", "Abandon", "Investigate",
            "Hold", "Focus", "Uncover", "Breach", "Aid", "Uphold", "Falter",
            "Suppress", "Hunt", "Share", "Destroy", "Avoid", "Reject",
            "Demand", "Explore", "Bolster", "Seize", "Mourn", "Reveal",
            "Gather", "Defy", "Transform", "Persevere", "Serve", "Begin",
            "Move", "Coordinate", "Resist", "Await", "Impress", "Take",
            "Oppose", "Capture", "Overwhelm", "Challenge", "Acquire",
            "Protect", "Finish", "Strengthen", "Restore", "Advance",
            "Command", "Refuse", "Find", "Deliver", "Hide", "Fortify",
            "Betray", "Secure", "Arrive", "Affect", "Change", "Defend",
            "Debate", "Support", "Follow", "Construct", "Locate", "Endure",
            "Release", "Lose", "Reduce", "Escalate", "Distract", "Journey",
            "Escort", "Learn", "Communicate", "Depart", "Search", "Charge",
            "Summon"];
  rollOracle(options, "oracleaction");
}

function oracleTheme() {
 const options = ["Risk", "Ability", "Price", "Ally", "Battle", "Safety",
            "Survival", "Weapon", "Wound", "Shelter", "Leader", "Fear",
            "Time", "Duty", "Secret", "Innocence", "Renown", "Direction",
            "Death", "Honor", "Labor", "Solution", "Tool", "Balance", "Love",
            "Barrier", "Creation", "Decay", "Trade", "Bond", "Hope",
            "Superstition", "Peace", "Deception", "History", "World",
            "Vow", "Protection", "Nature", "Opinion", "Burden", "Vengeance",
            "Opportunity", "Faction", "Danger", "Corruption", "Freedom",
            "Debt", "Hate", "Possession", "Stranger", "Passage", "Land",
            "Creature", "Disease", "Advantage", "Blood", "Language", "Rumor",
            "Weakness", "Greed", "Family", "Resource", "Structure", "Dream",
            "Community", "War", "Portent", "Prize", "Destiny", "Momentum",
            "Power", "Memory", "Ruin", "Mysticism", "Rival", "Problem",
            "Idea", "Revenge", "Health", "Fellowship", "Enemy", "Religion",
            "Spirit", "Fame", "Desolation", "Strength", "Knowledge", "Truth",
            "Quest", "Pride", "Loss", "Law", "Path", "Warning",
            "Relationship", "Wealth", "Home", "Strategy", "Supply"]
  rollOracle(options, "oracletheme");
}

function genOptions(optionWgts) {
    let options = [];
    for (let i=0; i<optionWgts.length; i++) {
      for (let j=0; j<optionWgts[i][0]; j++) {
        options.push(optionWgts[i][1]);
      }
    }
    return options;
}

function oracleRegion() {
  const optionWgts = [[12, "Barrier Islands"], [12, "Ragged Coast"],
            [10, "Deep Wilds"], [12, "Flooded Lands"], [14, "Havens"],
            [12, "Hinterlands"], [12, "Tempest Hills"],
            [10, "Veiled Mountains"], [5, "Shattered Wastes"],
            [1, "Elsewhere"]];
  const options = genOptions(optionWgts);
  rollOracle(options, "oracleregion");
}

function oracleLocation() {
  const optionWgts = [[1, "Hideout"], [1, "Ruin"], [1, "Mine"], [1, "Waste"],
            [1, "Mystical Site"], [1, "Path"], [1, "Outpost"], [1, "Wall"],
            [1, "Battlefield"], [1, "Hovel"], [1, "Spring"], [1, "Layer"],
            [1, "Fort"], [1, "Bridge"], [1, "Camp"], [1, "Cairn/Grave"],
            [2, "Caravan"], [2, "Waterfall"], [2, "Cave"], [2, "Swamp"],
            [2, "Fen"], [2, "Ravine"], [2, "Road"], [2, "Tree"], [2, "Pond"],
            [2, "Fields"], [2, "Marsh"], [2, "Steading"], [2, "Rapids"],
            [2, "Pass"], [2, "Trail"], [2, "Glade"], [2, "Plain"],
            [2, "Ridge"], [2, "Cliff"], [2, "Grove"], [2, "Village"],
            [2, "Moor"], [2, "Thicket"], [2, "River Ford"], [2, "Valley"],
            [2, "Bay/Fjord"], [2, "Foothills"], [2, "Lake"], [3, "River"],
            [4, "Forest"], [4, "Coast"], [5, "Hill"], [5, "Mountain"],
            [6, "Woods"], [1, "Anomaly"]];
  const options = genOptions(optionWgts);
  rollOracle(options, "oraclelocation");
}

function oracleCoastalLocation() {
 // Note - there's a typo in the rulebook for this oracle - number 23 points
 // to two values - "Ship" and "Rocks". I resolve this here by effectively
 // assigning it to "Rocks"
 const optionWgts = [[1, "Fleet"], [1, "Sargassum"], [1, "Flotsam"],
            [1, "Mystical Site"], [1, "Lair"], [5, "Wreck"], [5, "Harbor"],
            [7, "Ship"], [8, "Rocks"], [8, "Fjord"], [8, "Estuary"],
            [8, "Cove"], [8, "Bay"], [8, "Ice"], [15, "Island"],
            [14, "Open Water"], [1, "Anomaly"]];
  const options = genOptions(optionWgts);
  rollOracle(options, "oraclecoastalloc");
}

function oracleLocationDescriptor() {
 const options = ["High", "Remote", "Exposed", "Small", "Broken", "Diverse",
            "Rough", "Dark", "Shadowy", "Contested", "Grim", "Wild",
            "Fertile", "Blocked", "Ancient", "Perilous", "Hidden",
            "Occupied", "Rich", "Big", "Savage", "Defended", "Withered",
            "Mystical", "Inaccessible", "Protected", "Abandoned", "Wide",
            "Foul", "Dead", "Ruined", "Barren", "Cold", "Blighted",
            "Low", "Beautiful", "Abundant", "Lush", "Flooded", "Empty",
            "Strange", "Corrupted", "Peaceful", "Forgotten",
            "Expansive", "Settled", "Dense", "Civilized", "Desolate",
            "Isolated"];
  rollOracle(options, "oraclelocdescr");
}

function oracleSettName() {
  const optionWgts = [[3, "A feature of the landscape"],
            [3, "A manmade edifice"], [3, "A creature"],
            [3, "A historical event"],
            [3, "A word in an Old World Language"],
            [3, "A season or environmental aspect"],
            [2, "Something Else..."]];
  const options = genOptions(optionWgts);
  const options2 = [
            ["Highmount", "Brackwater", "Frostwood", "Redcrest",
            "Grimtree", "Stoneford", "Deepwater", "Whitefall", "Graycliff",
            "Three Rivers"],
            ["Whitebridge", "Lonefort", "Highcairn", "Redhall", "Darkwell",
                "Timberwall", "Stonetower", "Thornhall", "Cinderhome",
                "Fallowfield"],
            ["Ravencliff", "Bearmark", "Wolfcrag", "Eaglespire",
                "Wyvern's Rest", "Boarwood", "Foxhollow", "Elderwatch",
                "Elkfield", "Dragonshadow"],
            ["Swordbreak", "Fool's Fall", "Firstmeet", "Brokenhelm",
                "Mournhaunt", "Olgar's Stand", "Lostwater",
                "Rojirra's Lament", "Lastmarch", "Rockfall"],
            ["Abon", "Daveza", "Damula", "Essus", "Sina", "Kazerra", "Khazu",
                "Sova", "Nabuma", "Tiza"],
            ["Winterhome", "Windhaven", "Stormrest", "Bleakfrost",
                "Springtide", "Duskmoor", "Frostcrag", "Springbrook",
                "Icebreak", "Summersong"],
            ["a trade good (Ironhome)", "an Old World city (New Arkesh)",
                "a founder or famous settler (Kei's Hall)",
                "a god (Elisora)", "a historical item (Blackhelm)",
                "a firstborn race (Elfbrook)",
                "an elvish word or name (Nessana)",
                "a mythic belief or event (Ghostwalk)",
                "a positive term (Hope)", "a negative term (Forsaken)"]];
  roll = Math.floor((Math.random() * options.length));
  roll1 = Math.floor(roll / 3);
  roll2 = Math.floor((Math.random() * options2[roll1].length));
  const ele = document.getElementById('oraclesettname');
  ele.firstChild.data = options[roll] + " e.g. " + options2[roll1][roll2];
}

function oracleSettNameGen() {
  const optionsPre = ["Bleak", "Green", "Wolf", "Raven", "Gray", "Red", "Axe",
            "Great", "Wood", "Low", "White", "Storm", "Black", "Mourn",
            "New", "Stone", "Grim", "Lost", "High", "Rock", "Shield",
            "Sword", "Frost", "Thorn", "Long"];
  const optionsSuff = ["moor", "ford", "crag", "watch", "hope", "wood", "ridge",
            "stone", "haven", "fall(s)", "river", "field", "hill", "bridge",
            "mark", "cairn", "land", "hall", "mount", "rock", "brook",
            "barrow", "stead", "home", "wick"];
  roll1 = Math.floor((Math.random() * optionsPre.length));
  roll2 = Math.floor((Math.random() * optionsSuff.length));
  const ele = document.getElementById('oraclesettnamegen');
  ele.firstChild.data = optionsPre[roll1] + optionsSuff[roll2];
}

function oracleSettTrouble() {
  let options = ["Outsiders rejected", "Dangerous discovery", "Dreadful omens",
            "Natural disaster", "Old wounds reopened",
            "Important object is lost", "Someone is captured",
            "Mysterious phenomenon", "Revolt against a leader",
            "Vengeful outcast", "Rival settlement", "Nature strikes back",
            "Someone is missing", "Production halts", "Mysterious murders",
            "Debt comes due", "Unjust leadership", "Disastrous accident",
            "In league with the enemy", "Raiders prey on the weak",
            "Cursed past", "An innocent is accused",
            "Corrupted by dark magic", "Isolated by brutal weather",
            "Provisions are scarce", "Sickness run amok",
            "Allies become enemies", "Attack is imminent", "Lost caravan",
            "Dark secret revealed", "Urgent expedition", "A leader falls",
            "Families in conflict", "Incompetent leadership",
            "Reckless warmongering", "Beast on the hunt",
            "Betrayed from within", "Broken truce", "Wrathful haunt",
            "Conflict with a firstborn", "Trade route blocked",
            "In the crossfire", "Stranger causes discord",
            "Important event threatened", "Dangerous tradition"]
  for (let i=0; i<5; i++) {
    options.push("Roll Twice");
  }
  rollOracle(options, "oraclesetttroub");
}

function oracleCharRole() {
  const optionWgts = [[2, "Criminal"], [2, "Healer"], [2, "Bandit"],
            [3, "Guide"], [3, "Performer"], [3, "Miner"], [3, "Mercenary"],
            [3, "Outcast"], [3, "Vagrant"], [3, "Forester"], [3, "Traveler"],
            [3, "Mystic"], [3, "Priest"], [3, "Sailor"], [3, "Pilgrim"],
            [3, "Thief"], [3, "Adventurer"], [3, "Forager"], [3, "Leader"],
            [4, "Guard"], [4, "Artisan"], [4, "Scout"], [4, "Herder"],
            [4, "Fischer"], [5, "Warrior"], [5, "Hunter"], [5, "Raider"],
            [5, "Trader"], [5, "Farmer"], [1, "Unusual Role"]];
  const options = genOptions(optionWgts);
  rollOracle(options, "oraclecharrole");
}

function oracleCharGoal() {
  const optionsWgt3 = ["Obtain an object", "Make an agreement",
            "Build a relationship", "Undermine a relationship",
            "Seek a truth", "Pay a debt", "Refute a falsehood",
            "Harm a rival", "Cure an ill", "Find a person", "Find a home",
            "Sieze power", "Restore a relationship", "Create an item",
            "Travel to a place", "Secure provisions", "Rebel against power",
            "Collect a debt", "Protect a secret", "Spread faith",
            "Enrich themselves", "Protect a person",
            "Protect the status quo", "Advance status", "Defend a place",
            "Avenge a wrong", "Fulfill a duty", "Gain knowledge",
            "Prove worthiness", "Find redemption", "Resolve a dispute"]
  let options = [];
  for (let i=0; i<optionsWgt3.length; i++) {
    for (let j=0; j<3; j++) {
      options.push(optionsWgt3[i]);
    }
  }
  for (let i=0; i<2; i++) {
    options.push("Escape from something");
  }
  for (let i=0; i<5; i++) {
    options.push("Roll Twice");
  }
  rollOracle(options, "oraclechargoal");
}

function oracleCharDescr() {
  const options = ["Stoic", "Attractive", "Passive", "Aloof", "Affectionate",
            "Generous", "Smug", "Armed", "Clever", "Brave", "Ugly",
            "Sociable", "Doomed", "Connected", "Bold", "Jealous", "Active",
            "Angry", "Suspicious", "Hostile", "Hardhearted", "Successful",
            "Talented", "Experienced", "Deceitful", "Ambitious",
            "Aggressive", "Conceited", "Proud", "Stern", "Dependent", "Wary",
            "Strong", "Inciteful", "Dangerous", "Quirky", "Cheery",
            "Disfigured", "Intolerent", "Skilled", "Stingy", "Timid",
            "Insensitive", "Wild", "Bitter", "Cunning", "Remorseful",
            "Kind", "Charming", "Oblivious", "Critical", "Cautious",
            "Resourceful", "Weary", "Wounded", "Anxious", "Powerful",
            "Athletic", "Driven", "Cruel", "Quiet", "Honest", "Infamous",
            "Dying", "Reclusive", "Artistic", "Disabled", "Confused",
            "Manipulative", "Relaxed", "Smug", "Confident", "Weak",
            "Friendly", "Wise", "Influential", "Young", "Adventurous",
            "Oppressed", "Vengeful", "Cooperative", "Armored", "Apathetic",
            "Determined", "Loyal", "Sick", "Religious", "Selfish", "Old",
            "Fervent", "Violent", "Agreeable", "Hot-tempered", "Stubborn",
            "Incompotent", "Greedy", "Cowardly", "Obsessed", "Careless",
            "Ironsworn"];
  rollOracle(options, "oraclechardescr");
}

function oracleIronlanderName() {
  const options = ["Solana", "Keelan", "Cadigan", "Sola", "Kodroth", "Kione",
            "Katja", "Tio", "Artiga", "Eos", "Bastien", "Elli", "Maura",
            "Haleema", "Abella", "Morter", "Wulan", "Mai", "Farina", "Pearce",
            "Wynne", "Haf", "Aeddon", "Khinara", "Milla", "Nakata", "Kynan",
            "Kiah", "Jagger", "Beca", "Ikram", "Melia", "Sidan", "Deshi",
            "Tessa", "Sibila", "Morien", "Mona", "Padma", "Avella", "Naila",
            "Lio", "Cera", "Ithela", "Zhan", "Kaivan", "Valeri", "Hirsham",
            "Pemba", "Edda", "Lestara", "Lago", "Elstan", "Saskia",
            "Kabeera", "Caldas", "Nisus", "Serene", "Chenda", "Themon",
            "Erin", "Alban", "Parcell", "Jelma", "Willa", "Nadira", "Gwen",
            "Amara", "Masias", "Kanno", "Razeena", "Mira", "Perella",
            "Myrick", "Qamar", "Kormak", "Zura", "Zanita", "Brynn", "Tegan",
            "Pendry", "Quinn", "Fanir", "Glain", "Emelyn", "Kendi", "Althus",
            "Leela", "Ishana", "Flint", "Delkash", "Nia", "Nan", "Keeara",
            "Katania", "Morell", "Temir", "Bas", "Sabine", "Tallus",
            "Sagura", "Gethin", "Bataar", "Basira", "Joa", "Glynn", "Toran",
            "Arasen", "Kuron", "Griff", "Owena", "Adda", "Euros", "Kova",
            "Kara", "Morgan", "Nanda", "Tamara", "Asha", "Delos", "Torgan",
            "Makari", "Selva", "Kimura", "Rhian", "Tristan", "Siorra",
            "Sayer", "Cortina", "Vesna", "Kataka", "Keyshia", "Mila",
            "Lili", "Vigo", "Sadia", "Malik", "Dag", "Kuno", "Reva", "Kai",
            "Kalina", "Jihan", "Hennion", "Abram", "Aida", "Myrtle", "Nekun",
            "Menna", "Tahir", "Sarria", "Nakura", "Akiya", "Talan", "Mattick",
            "Okoth", "Khulan", "Verena", "Beltran", "Del", "Ranna", "Alina",
            "Muna", "Mura", "Torrens", "Yuda", "Nazmi", "Ghalen", "Sarda",
            "Shona", "Kalidas", "Wena", "Sendra", "Kori", "Setara", "Lucia",
            "Maya", "Reema", "Yorath", "Rhoddri", "Shekhar", "Servan",
            "Reese", "Kendrick", "Indirra", "Giliana", "Jebran", "Kotama",
            "Fara", "Katrin", "Namba", "Lona", "Taylah", "Kato", "Esra",
            "Eleri", "Irsia", "Kayu", "Bevan", "Chandra"];
  rollOracle(options, "oracleilandername");
}

function oracleElfName() {
  const options = ["Arsula", "Naidita", "Belesunna", "Vidarna", "Ninsuna",
            "Balathu", "Dorosi", "Gezera", "Zursan", "Seleeku", "Utamara",
            "Nebakay", "Dismashk", "Mitunu", "Atani", "Kinzura", "Sumula",
            "Ukames", "Ahmeshki", "Ilsit", "Mayatanay", "Etana", "Gamanna",
            "Nessana", "Uralar", "Tishetu", "Leucia", "Sutahe", "Dotani",
            "Uktannu", "Retenay", "Kendalanu", "Tahuta", "Mattissa",
            "Anatu", "Aralu", "Arakhi", "Ibrahem", "Sinosu", "Jemshida",
            "Visapni", "Hullata", "Sidura", "Kerihu", "Ereshki", "Cybela",
            "Anunna", "Otani", "Ditani", "Faraza"];
  rollOracle(options, "oracleelfname");
}

function oracleGiantName() {

  const options = ["Chony", "Banda", "Jochu", "Kira", "Khatir", "Chaidu", "Atan",
            "Buandu", "Javyn", "Khashin", "Bayara", "Temura", "Kidha",
            "Kathos", "Tanua", "Bashtu", "Jaran", "Othos", "Khutan", "Otaan",
            "Martu", "Baku", "Tuban", "Qudan", "Denua"];
  rollOracle(options, "oraclegiantname");
}

function oracleVarouName() {
 const options = ["Vata", "Zora", "Jasna", "Charna", "Tana", "Soveen", "Radka",
            "Zlata", "Leesla", "Byna", "Meeka", "Iskra", "Jarek", "Darva",
            "Neda", "Keha", "Zhivka", "Kvata", "Staysa", "F", "Vuksha",
            "Muko", "Dreko", "Aleko", "Vojan"];
  rollOracle(options, "oraclevarouname");
}

function oracleTrollName() {
  const options = ["Rattle", "Scratch", "Wallow", "Groak", "Gimble", "Scar",
            "Cratch", "Creech", "Shush", "Glush", "Slar", "Gnash", "Stoad",
            "Grig", "Bleat", "Chortle", "Cluck", "Slith", "Mongo", "Creak",
            "Burble", "Vrusk", "Snuffle", "Leech", "Herk"];
  rollOracle(options, "oracletrollname");
}

function oracleCombatAction() {
  const optionWgts = [[3, "Compel a surrender"],
            [3, "Coordinate with allies"], [3, "Gather reinforcements"],
            [4, "Sieze something or someone"],
            [4, "Provoke a reckless response"], [4, "Intimidate or frighten"],
            [4, "Reveal a surprising truth"],
            [4, "Shift focus to someone or something else"],
            [4, "Destroy something or render it useless"],
            [6, "Take a decisive action"], [6, "Reinforce defenses"],
            [7, "Ready an action"], [8, "Use the terrain to gain advantage"],
            [8, "Leverage the advantage of a weapon or ability"],
            [10, "Create an opportunity"], [11, "Attack with precision"],
            [10, "Attack with power"],
            [1, "Take a completely unexpected action"]];
  const options = genOptions(optionWgts);
  rollOracle(options, "oraclecombataction");
}

function oracleMysticBacklash() {
  const options = ["Your ritual has the opposite effect",
            "You are sapped of strength",
            "Your friend, ally, or companion is adversely affected",
            "You destroy an important object",
            "You inadvertently summon a horror",
            "You collapse, and drift into a troubled sleep",
            "You undergo a physical torment which leaves its mark upon you",
            "You hear ghostly voices whispering of dark portents",
            "You are lost in shadow, and find yourself in another place"
            + " without memory of how you got there",
            "You alert someone or something to your presence",
            "You are not yourself, and act against a friend, ally, or"
            + " companion",
            "You affect or damage your surroundings, causing a disturbance"
            + " or potential harm",
            "You waste resources",
            "You suffer the loss of a sense for several hours",
            "You lose your connection to magic for a day or so and cannot"
            + " perform rituals",
            "Your ritual affects the target in an unexpected and"
            + " problematic way",
            "Your ritual reveals a surprising and troubling truth",
            "You are tempted by dark powers",
            "You see a troubling vision of your future",
            "You can't perform this ritual again until you acquire an"
            + " important component",
            "You develop a strange fear or compulsion",
            "Your ritual causes creatures to exhibit strange or aggressive"
            + " behavior",
            "You are tormented by an apparition from your past",
            "You are wracked with sudden sickness",
            "Roll twice more on this table. Both results occur. If they are"
            + " the same result, make it worse"];
  rollOracle(options, "oraclemysticbacklash");
}

function oraclePlotTwist() {
  const options = ["It was all a diversion", "A dark secret is revealed",
            "A trap is sprung", "An assumption is revealed to be false",
            "A secret alliance is revealed",
            "Your actions benefit an enemy",
            "Someone returns unexpectedly",
            "A more dangerous foe is revealed",
            "You and an enemy share a common goal",
            "A true identity is revealed",
            "You are betrayed by someone who was trusted",
            "You are too late", "The true enemy is revealed",
            "The enemy gains new allies", "A new danger appears",
            "Someone or something goes missing",
            "The truth of a relationship is revealed",
            "Two seemingly unconnected situations are shown to be connected",
            "Unexpected powers or abilities are revealed",
            "Roll twice more on this table. Both results occur. If they are"
            + " the same result, make it more dramatic."];
  rollOracle(options, "oracleplottwist");
}

function oraclePayThePrice() {
  const weights = [[2,"Roll again and apply that result but make it worse"],
                   [3,"A person or community you trusted loses faith in you "
                      + "or acts against you."],
                   [4,"A person or community you care about is exposed to danger"],
                   [7,"You are separated from something or someone"],
                   [7,"Your action has an unintended effect"],
                   [9,"Something of value is lost or destroyed"],
                   [9,"The current situation worsens"],
                   [9,"A new danger or foe is revealed"],
                   [9,"It causes a delay or puts you at a disadvantage"],
                   [9,"It is harmful"],
                   [9,"It is stressful"],
                   [8,"A surprising development complicates your quest"],
                   [5,"It wastes resources"],
                   [4,"It forces you to act against your best intentions"],
                   [4,"A friend, companion or ally is put in harm's way "
                      + "(or you are, if alone)"],
                   [2,"Roll twice more on this table. Both results occur"]];
  const options = genOptions(weights);
  rollOracle(options, "oraclepaytheprice");
}

function oracleOdds() {
  const buttons = document.getElementsByName('odds');
  var threshold = 51; // default 50/50 odds
  for (i = 0; i < buttons.length; i++) {
    if (buttons[i].checked) {
      threshold = parseInt(buttons[i].value);
    }
  }
  const roll = rollDie(100);
  const match = roll == 100 || (roll % 11) == 0;
  const ele = document.getElementById('oracleodds');
  if (roll < threshold) {
    ele.firstChild.data = match ? "HELL NO!" : "No";
  } else {
    ele.firstChild.data = match ? "HELL YES!" : "Yes";
  }
}

function oracleChallengeRank() {
  const optionWgts = [[20, "Troublesome"], [35, "Dangerous"],
            [25, "Formidable"], [13, "Extreme"], [7, "Epic"]];
  const options = genOptions(optionWgts);
  rollOracle(options, "oraclechallrank");
}

function oracleRoll100() {
  const roll = rollDie(100);
  document.getElementById("oracleroll100").firstChild.data = String(roll);
}
