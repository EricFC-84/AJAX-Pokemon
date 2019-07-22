let typeUrl = "https://pokeapi.co/api/v2/type/";
let pokemonUrl = "https://pokeapi.co/api/v2/pokemon/"; //already in types["pokemon"]["url"]
let speciesUrl = "https://pokeapi.co/api/v2/pokemon-species/"; //already in pokemon["species"]["url"]
let imageUrl = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/" //need to add 'id' + .png

let allTypes = [];
let checkedTypes = [];
let filteredByTypePokemons = [];
let singlePokemonData;
let listDamageRelationships = "";

function siteInit() { //body --> onload
    let response;
    httpGetAsync(typeUrl, function (response) {
        allTypes = JSON.parse(response)["results"];
    })
    // callApi(typeUrl);
    setTimeout(() => {
        DOM_checkBoxes(); //uses allTypes to create all the checkboxes+labels and put it in the dom with document.createElement
    }, 200);

    fillRandomPokemonRow();

}

function DOM_checkBoxes() {
    let filterBoxRow = document.getElementById("filterContainer");

    for (let i = 0; i < allTypes.length; i++) {

        let chkDiv = document.createElement("div");
        chkDiv.className = "checkDiv col-lg-3 col-md-4 col-6";
        let chkBox = document.createElement("input");
        let chkLabel = document.createElement("label");
        chkBox.type = "checkbox";
        chkBox.value = `${allTypes[i]["name"]}`;
        chkLabel.appendChild(chkBox);
        chkLabel.appendChild(document.createTextNode(` ${allTypes[i]["name"]}`));
        chkLabel.style.textIndent = "1rem";
        chkDiv.innerHTML = chkLabel.outerHTML;

        filterBoxRow.appendChild(chkDiv);
    }

}

function fillRandomPokemonRow() {
    let randomPokemon = "";
    let randomPokemonId = parseInt(Math.random() * 150 + 1);
    let randomPokemonUrl = pokemonUrl + randomPokemonId;
    console.log(randomPokemonUrl);
    httpGetAsync(randomPokemonUrl, function (response) {
        randomPokemon = JSON.parse(response);
    })
    var timeout = setInterval(function () {
            if (randomPokemon != "") {
                clearInterval(timeout);

                console.log(randomPokemon);
                let randomPokemonTypes = "";
                for (let i = 0; i < randomPokemon["types"].length; i++) {
                    if (i > 0) {
                        randomPokemonTypes += ", " + randomPokemon["types"][i]["type"]["name"];
                    } else {
                        randomPokemonTypes += randomPokemon["types"][i]["type"]["name"];
                    }
                }
                singlePokemonData = {
                    "name": randomPokemon["name"],
                    "image": randomPokemon["sprites"]["front_default"],
                    "types": randomPokemonTypes,
                    "url": randomPokemonUrl
                };
                let pokemonTable = document.getElementById("pokemonTable");
                let tableBody = document.createElement("tbody"); //cambiar
                DOM_tableSingleRow(pokemonTable, tableBody); //creates a table row. In this case, would need to create only 1 row with randomPokemon data: pic, name, types and add pokemonURL too.
            }

        },
        100);
}

function DOM_tableSingleRow(pokemonTable, tableBody) {

    let tableRow = document.createElement("tr");
    let nameCell = document.createElement("td");
    let picCell = document.createElement("td");
    let picData = document.createElement("div");
    let urlCell = document.createElement("td");
    let typeCell = document.createElement("td");

    picData.className = "pokePic";
    picData.style.backgroundImage = `url(${singlePokemonData["image"]})`;
    picCell.appendChild(picData);
    nameCell.innerText = singlePokemonData["name"];
    typeCell.innerText = singlePokemonData["types"];
    var pokemonId = singlePokemonData["url"].substring(34, singlePokemonData["url"].length);
    console.log("pokemon ID =" + pokemonId);
    console.log(singlePokemonData["url"]);

    urlCell.innerHTML = `<a href="#" data-toggle="modal" data-target="#showDetails" onclick="modalPokemon(event, ${pokemonId})">${singlePokemonData["url"]}</a>`

    tableRow.innerHTML = picCell.outerHTML + nameCell.outerHTML + typeCell.outerHTML + urlCell.outerHTML;
    tableBody.appendChild(tableRow);
    pokemonTable.appendChild(tableBody);

}

function filterPokemons() { //Filter button --> onClickç
    resetGlobalVariables();
    whatIsChecked(); //cheks all checkboxes and add the "value" to checkedTypes[] if it was checked
    getCheckedPokemons(); //gets all pokemon of each types. check if repeated and adds all new pokemon in"filteredByTypePokemons

    var timeout = setInterval(function () {
        if (filteredByTypePokemons.length != 0) {
            clearInterval(timeout);
            document.querySelector("#pokemonTable > thead > tr > th:nth-child(3)").innerText = "Matching types";
            DOM_tableAllRows(); //uses "filteredByTypePokemons[]" to create every row of the table. each position of the array should have pic, name, types and url of pokemon
        }
    }, 200)
}



function resetGlobalVariables() {
    checkedTypes = [];
    filteredByTypePokemons = [];
    singlePokemonData = [];
    let body = document.getElementsByTagName("tbody");
    console.log("Reset variables. Tbody count = " + body.length);
    if (body.length > 0) {
        console.log(body);
        body[0].parentNode.removeChild(body[0]);
    }
}

function whatIsChecked() {
    let all_checkbox_elements = document.querySelectorAll('input[type="checkbox"]');

    for (let i = 0; i < all_checkbox_elements.length; i++) {
        if (all_checkbox_elements[i]["checked"] == true) {
            checkedTypes.push(all_checkbox_elements[i].value);
        }
    }
}

function getCheckedPokemons() {

    for (let i = 0; i < checkedTypes.length; i++) {
        let checkedTypeName = checkedTypes[i];



        let currentTypePokemons = [];
        let response;

        httpGetAsync(typeUrl + checkedTypeName, function (response) {
            currentTypePokemons = JSON.parse(response)["pokemon"];
        })

        setTimeout(() => { //TO DO --> cambiar por interval??

            /*  console.log(typeUrl + checkedTypeName);
             console.log(currentTypePokemons);
             console.log(currentTypePokemons.length); */
            // var timeout = setInterval(function () {
            if (currentTypePokemons.length > 0) {
                // clearInterval(timeout);
                /* console.log(typeUrl + checkedTypeName);
                console.log(currentTypePokemons);
                console.log(currentTypePokemons.length); */
                for (let j = 0; j < currentTypePokemons.length; j++) {
                    let pokemonName = currentTypePokemons[j]["pokemon"]["name"]
                    console /*  */ .log(pokemonName);
                    if ((!chosenAlready(pokemonName, checkedTypeName))) {
                        //is a new pokemon
                        addPokemon(currentTypePokemons[j]["pokemon"], checkedTypeName)
                    }
                }
                // console.log(filteredByTypePokemons)
                document.getElementById("pokeCount").style.display = "block";
                document.getElementById("pokeCount").innerText = "Pokemon count: " + filteredByTypePokemons.length;
            }
            // },
            // 100);
        }, 200)
    }
}

function chosenAlready(pokemonName, pokemonType) {
    for (let i = 0; i < filteredByTypePokemons.length; i++) {
        if (filteredByTypePokemons[i]["name"] == pokemonName) {
            filteredByTypePokemons[i]["types"] += ", " + pokemonType;
            return true;
        }
    }
}

function addPokemon(pokemonData, pokemonType) {
    let currentPokemonUrl = pokemonData["url"];

    let currentImageUrl = imageUrl + currentPokemonUrl.substring(34, currentPokemonUrl.length - 1) + ".png";
    currentPokemonUrl = currentPokemonUrl.substring(0, currentPokemonUrl.length - 1);
    // console.log("current pokemon url = " + currentPokemonUrl);
    filteredByTypePokemons.push({
        "image": currentImageUrl,
        "name": pokemonData["name"],
        "types": pokemonType,
        "url": currentPokemonUrl
    })
}

function DOM_tableAllRows() {
    // console.log("all rows")
    let pokemonTable = document.getElementById("pokemonTable");
    let tableBody = document.createElement("tbody"); //cambiar
    for (let i = 0; i < filteredByTypePokemons.length; i++) {
        singlePokemonData = filteredByTypePokemons[i];
        DOM_tableSingleRow(pokemonTable, tableBody);
    }
}


function modalPokemon(e, pokemonId) {

    document.getElementById("modalPokemonTypeData").innerHTML = "";
    let modalObject = document.getElementsByClassName("modal-dialog")[0];
    let singlePokemonUrl = pokemonUrl + pokemonId;
    modalObject.style.display = "none";
    // console.log(singlePokemonUrl);

    singlePokemonData = [];

    // console.log("singlePokemonData: " + singlePokemonData);

    let response;
    httpGetAsync(singlePokemonUrl, function (response) {
        singlePokemonData.push(JSON.parse(response));
    })
    var timeout = setInterval(function () {
        if (singlePokemonData.length >= 1) {
            clearInterval(timeout);
            fillModal();
        }
    }, 100);
}



function fillModal() {

    let pokePic = document.getElementById("modalImage");
    let urlImage = singlePokemonData[0]["sprites"]["front_default"];
    pokePic.style.backgroundImage = `url(${urlImage})`;

    document.getElementById("pokemonModalTitle").innerText = singlePokemonData[0]["name"];

    //"modal-body"
    let modalTypeDataElement = document.getElementById("modalPokemonTypeData");
    getPokemonGeneration(modalTypeDataElement)

    let numTypes = singlePokemonData[0]["types"].length;

    // let pokemonDamageText = "";

    //Fill types
    console.log(numTypes);
    for (let i = 0; i < numTypes; i++) {

        let modalTypeElement = document.createElement("div");
        modalTypeElement.className = "modal-body"
        let currentType = singlePokemonData[0]["types"][i]["type"]["name"]
        modalTypeElement.innerHTML = currentType;
        let damageRelationsHTML = document.createElement("div"); 
        getTypeAndDamages(currentType);
        setTimeout(() => {
            
            console.log(listDamageRelationships);
        // clearInterval(timeout);
        // let singleTypeElementList = ;
        // singleTypeElementList.innerHTML = damageRelationsHTML;
        damageRelationsHTML.innerHTML = listDamageRelationships;
        modalTypeElement.appendChild(damageRelationsHTML);
        console.log(modalTypeElement);
        modalTypeDataElement.appendChild(modalTypeElement);

        }, 500);
        
        /* }
        }, 100) */

        // console.log(modalTypeElement);
    }

}


function getTypeAndDamages(type) {
    let typeDamageData = [];
    let response;
    console.log("typeurl: " + typeUrl + type);
    httpGetAsync(typeUrl + type, function (response) {
        typeDamageData.push(JSON.parse(response));
        console.log(JSON.parse(response));
    })

    setTimeout(() => {

        console.log(typeDamageData)
        //interval
        // var timeout = setInterval(function () {
        // console.log("inside interval. Length = " + typeDamageData.length)

        // while ((typeof typeDamageData === 'undefined' || typeDamageData === null)) {
        // console.log(" Still inside")
        // }

        // if (typeDamageData.length > 0) {
        // clearInterval(timeout);
        // console.log("inside timeout. Length = " + typeDamageData.length)

        // console.log("DOM_MOodalDamage")
        console.log(typeDamageData[0]);
        let damageRelations = typeDamageData[0]["damage_relations"];
        let damageRelationsHTML = DOM_ModalDamage(damageRelations);
console.log(damageRelationsHTML);
        listDamageRelationships = damageRelationsHTML.outerHTML;
    }, 300);

    // }
    // }, 100)
    // console.log("finished getTypeanddamages")

}


function DOM_ModalDamage(damageRelations) {
    console.log("typeDamageData:")
    console.log(damageRelations)
    let damageModalSection = document.createElement("div");
    // damageModalSection.innerText = "Damage Relations";
    let double_damage_to = document.createElement("div");
    let double_damage_from = document.createElement("div");
    let half_damage_to = document.createElement("div");
    let half_damage_from = document.createElement("div");

    //Damage to
    double_damage_to.innerText = "Double Damage To:";
    let damageList = document.createElement("ul");
    for (let i = 0; i < damageRelations["double_damage_to"].length; i++) {
        let damageRelationElement = document.createElement("li");
        damageRelationElement.innerText = damageRelations["double_damage_to"][i]["name"]
        console.log(damageRelationElement);
        damageList.innerHTML += damageRelationElement.outerHTML;
    }
    double_damage_to.innerHTML += damageList.outerHTML;
    console.log(damageList);
    console.log(double_damage_to);
    damageModalSection.appendChild(double_damage_to);
    console.log(damageModalSection)
    half_damage_to.innerText = "Half Damage To:";
    damageList = document.createElement("ul");
    for (let i = 0; i < damageRelations["half_damage_to"].length; i++) {
        let damageRelationElement = document.createElement("li");
        damageRelationElement.innerText = damageRelations["half_damage_to"][i]["name"]
        damageList.innerHTML += damageRelationElement.outerHTML;
    }
    half_damage_to.innerHTML += damageList.outerHTML;
    damageModalSection.appendChild(half_damage_to);
    //Damage From
    double_damage_from.innerText = "Double Damage From:";
    damageList = document.createElement("ul");
    for (let i = 0; i < damageRelations["double_damage_from"].length; i++) {
        let damageRelationElement = document.createElement("li");
        damageRelationElement.innerText = damageRelations["double_damage_from"][i]["name"]
        damageList.innerHTML += damageRelationElement.outerHTML;
    }
    double_damage_from.innerHTML += damageList.outerHTML;
    damageModalSection.appendChild(double_damage_from);

    half_damage_from.innerText = "Half Damage From:";
    damageList = document.createElement("ul");
    for (let i = 0; i < damageRelations["half_damage_from"].length; i++) {
        let damageRelationElement = document.createElement("li");
        damageRelationElement.innerText = damageRelations["half_damage_from"][i]["name"]
        damageList.innerHTML += damageRelationElement.outerHTML;
    }
    half_damage_from.innerHTML += damageList.outerHTML;
    damageModalSection.appendChild(half_damage_from);

    console.log("finished modal DOM")
    console.log(damageModalSection);
    return damageModalSection;
}




function getPokemonGeneration(bodyText) {
    //generation
    let url = singlePokemonData[0]["species"]["url"];
    let response;
    let speciesInfo = 0;
    httpGetAsync(url, function (response) {
        speciesInfo = (JSON.parse(response));
    })
    let modalObject = document.getElementsByClassName("modal-dialog")[0];

    var timeout = setInterval(function () {
        if (speciesInfo != 0) {
            clearInterval(timeout);
            let generationName = speciesInfo["generation"]["name"];
            bodyText.innerText += convertGeneration(generationName);
            modalObject.style.display = "block";
        }
    }, 100);
}

function convertGeneration(generationString) {
    let generationName = "";
    switch (generationString) {
        case "generation-i":
            generationName = "1st Generation";
            break;
        case "generation-ii":
            generationName = "2nd Generation";
            break;
        case "generation-iii":
            generationName = "3rd Generation";
            break;
        case "generation-iv":
            generationName = "4th Generation";
            break;
        case "generation-v":
            generationName = "5th Generation";
            break;
        case "generation-vi":
            generationName = "6th Generation";
            break;
        case "generation-vii":
            generationName = "7th Generation";
            break;
        default:
            generationName = generationString;
            break;

    }
    return generationName;
}



function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}






function filterButtonDelay() {

    let button = document.getElementById("filterButton");
    button.setAttribute("disabled", "disabled");
    setTimeout(() => {
        button.removeAttribute("disabled");
    }, 600);
}