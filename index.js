const inquirer = require("inquirer");
const { parse } = require('svg-parser');
const fs = require('fs');
const { resolve } = require("path");
const { rejects } = require("assert");

var neighborcontainer = [];
var neighbornamelist = [];
var tidgen = 1
var sqllist = [];

const territorypromise = new Promise((resolve, reject) => [
    fs.readFile('map.svg', function(err, data) {
        const parsed = parse(data.toString());
        var territorycontainer = [];
        for (const i of parsed.children[0].children) {
            if (i.properties.id === 'Territories') {
                var namepath = i.children;
                for (const j of namepath) {
                    var territorydump;
                    territorydump = {name: j.properties.id, id: tidgen, region: j.properties.region}
                    territorycontainer.push(territorydump);
                    neighbornamelist.push(j.properties.id);
                    tidgen = tidgen + 1;
                }
                resolve(territorycontainer);
            }
        }
    })
])

const timer = (ms) => new Promise(res => setTimeout(res, ms))
const terrprompt = (terrname) => new Promise((resolve, reject) => [
    inquirer.prompt([
        {
            type: 'input',
            name: terrname,
            message: `List the neighbors of the territory ${terrname} (case insensitive, only list neighbors)`,
            validate(answer) {
                        tempanscont = [];
                        neighbors = answer.split(" ");
                        for (const j of neighbors) {
                            for (const i of neighbornamelist) {
                                if (j.toLowerCase() === i.toString().toLowerCase()) {
                                    tempanscont.push(i);
                                    break;
                                }
                            }
                        }
                        if (tempanscont.length === neighbors.length) {
                            for (const i of tempanscont) {
                                neighborcontainer.push([terrname, i]);
                            }
                            neighborcontainer.push([terrname, terrname]);
                            return true;
                        } else {
                        return 'One of the territories you entered either does not exist or was typed incorrectly (extra space somewhere also possible), please try again';
                        }
                    }
        }
    ]).then(answers => {
            neighbors = JSON.stringify(answers)
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'terrconfirmation',
                    message: `You've inputted the following as neighbors of ${neighbors} ... is this correct?`
                }
            ])
            .then( ans => {
                if (ans.terrconfirmation === true) {
                    resolve(true);
                }
                if (ans.terrconfirmation === false) {
                    resolve(false);
                }
            })
    })
])

territorypromise.then( async (tcs) => {
    for (const i of tcs) {
        async function checkterr(name) {
            var terr = await terrprompt(name);
            if (terr === true) {
                return;
            } else if (terr === false) {
                await checkterr(name);
                return;
            }
        }
        await checkterr(i.name);
        await timer(500);
    }
    for (const s of neighborcontainer) {
        for (const j of tcs) {
            if (s[0] === j.name) {
                s[0] = j.id;
            }
            if (s[1] === j.name) {
                s[1] = j.id;
            }
        }
    }
    for (const y of neighborcontainer) {
        sqllist.push(`INSERT INTO territory_adjacency(territory_id, adjacent_id) VALUES (${y[0]}, ${y[1]});`);
    }
    for (const t of tcs) {
        sqllist.push(`INSERT INTO territories (id, name, region) VALUES (${t.id}, '${t.name}', ${t.region});`)
    }
    fs.writeFile('output.txt', sqllist.join(`\n`), err => {
        if (err) {
            console.error(err)
            return;
        }
    })
})