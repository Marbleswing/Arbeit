function id() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
    function(c) {
       var uuid = Math.random() * 16 | 0, v = c == 'x' ? uuid : (uuid & 0x3 | 0x8);
       return uuid.toString(16);
    });
}

class Project{
    constructor(type, title, name, tasks){
        this.type = type ?? 0;
        this.title = title ?? "";
        this.name = name ?? "";
        this.tasks = tasks ?? [];
    }
}

class Task{
    constructor(question, type, solution, points, correction){
        this.question = question ?? "";
        this.type = type ?? 0;
        this.solution = solution ?? "";
        this.points = points ?? "";
        this.correction = correction ?? "";
    }
}

let wich_project = "";
let arbeit_save = {}
let temp = localStorage.getItem("arbeit_save");
if (temp) {
    arbeit_save = JSON.parse(temp);
    wich_project = localStorage.getItem("wich_project");
}

function read_url(url){
    const parts = decodeURIComponent(url.substring(1)).split("~");
    const variables = {};
    parts.forEach((part, index) => {
        variables[`v${index}`] = part;
    });
    wich_project = variables.v0;
    let project = new Project();
    project.type = Number(variables.v1);
    project.title = variables.v2;
    let position = 2;

    if (project.type > 0){
        project.name = variables.v3;
        position = 3;
    }

    let i = 0;
    while(true){
        position ++;
        if(!variables["v"+position]){
            arbeit_save[wich_project] = project;
            load_test();
            save();
            return;
        }
        project.tasks.push(new Task);
        let task = project.tasks[i];
        task.question = variables["v"+position];
        position++;
        task.points = variables["v"+position];
        if(project.type > 0){
            position++;
            task.solution = variables["v"+position];
        }
        if(project.type > 1){
            position++;
            task.correction = variables["v"+position];
        }
        i++;
    }
}

function generate_url() {
    const project = arbeit_save[wich_project];
    let parts = [wich_project, String(project.type), project.title];
    if(project.type > 0){
        parts.push(project.name);
    }
    for(let position = 0; position < project.tasks.length; position++){
        const task = project.tasks[position];
        parts.push(task.question, task.points);
        if (project.type > 0){
            parts.push(task.solution);
        }
        if (project.type > 1){
            parts.push(task.correction);
        }
    }
    parts = parts.map(str => str.replace(/~/g, ""));
    const url = encodeURIComponent(parts.join("~"));
    return "https://marbleswing.github.io/Arbeit/#" + url;
}

function save() {
    const value = JSON.stringify(arbeit_save);
    localStorage.setItem("arbeit_save", value);
    localStorage.setItem("wich_project", wich_project);
}

function load() {
    wich_project = "";
    document.getElementById("inhalt").innerHTML = "";
    for (const [id, project] of Object.entries(arbeit_save)) {
        const project = arbeit_save[id]
        $("#inhalt").append('<div> <button data-story-id="'+ id +'" class="open">'+ project.title +'</button> <button data-story-id="'+ id +'" class="delete">-</button> </div>');
    };

    $("#inhalt").append('<div> <button class="add_project">+</button> </div>')

    $(".open").on("click", function() {
        wich_project = this.dataset.storyId;
        load_test();
        save();
    });

    $(".delete").on("click", function() {
        delete arbeit_save[this.dataset.storyId];
        load();
        save();
    });

    $(".add_project").on("click", function() {
        wich_project = id();
        arbeit_save[wich_project] = new Project();
        load_test();
    });
}

function grade(max, points) {
    const prozent = (points / max) * 100;
    if (prozent > 100) return "1+";
    if (prozent >= 97) return "1";
    if (prozent >= 90) return "1-";
    if (prozent >= 83) return "2+";
    if (prozent >= 77.5) return "2";
    if (prozent >= 70) return "2-";
    if (prozent >= 63.5) return "3+";
    if (prozent >= 57) return "3";
    if (prozent >= 50) return "3-";
    if (prozent >= 43.5) return "4+";
    if (prozent >= 37) return "4";
    if (prozent >= 30) return "4-";
    if (prozent >= 23.5) return "5+";
    if (prozent >= 17) return "5";
    if (prozent >= 10) return "5-";
    return "6";
}


function save_test(){
    let project = arbeit_save[wich_project];
    if (project.type == 0){
        const title = document.querySelector('#title');
        project.title = title.value;
    } else if(project.type == 1){
        const name = document.querySelector('#name');
        project.name = name.value;
    }
    
    const input_question = document.querySelectorAll('.input_question');
    input_question.forEach((feld, index) => {
        if (project.tasks[index]){
            project.tasks[index].question = feld.value;
        }
    });
    const input_solution = document.querySelectorAll('.input_solution');
    input_solution.forEach((feld, index) => {
        if (project.tasks[index]){
            project.tasks[index].solution = feld.value;
        }
    });     
    const input_points = document.querySelectorAll('.input_points');
    input_points.forEach((feld, index) => {
        if (project.tasks[index]){
            project.tasks[index].points = feld.value;
        }
    });     
    const input_correction = document.querySelectorAll('.input_correction');
    input_correction.forEach((feld, index) => {
        if (project.tasks[index]){
            project.tasks[index].correction = feld.value;
        }
    });     
   
}

function load_test(){
    let project = arbeit_save[wich_project];
    let html = "";
    let max = 0;
    let points = 0;
    document.getElementById("inhalt").innerHTML = "";
    if (project.type == 0){
        $("#inhalt").append('<div> <input type="text" id="title" value="'+ project.title +'"> </div>');
    } else if (project.type == 1){
        html = '<div> <span class="h1">' + project.title + '</span>';
        html += '<span class="h2" style="margin-left: 50px;">Name:</span>'
        html += '<input type="text" value="'+ project.name +'" id="name"/> </div>';
        $("#inhalt").append(html);
    } else if (project.type == 2){
        html = '<div> <span class="h1">' + project.title + '</span>';
        html += '<span class="h2" style="margin-left: 50px;">Name: '+ project.name +'</span> </div>';
        $("#inhalt").append(html);
    } else{
        html = '<div> <span class="h1">' + project.title + '</span>';
        html += '<span class="h2" style="margin-left: 50px;">Name: '+ project.name +'</span> </div>';
        $("#inhalt").append(html);
    }
    
    
    for(let position = 0; position < project.tasks.length; position++){
        const task = project.tasks[position];
        if (project.type == 0){
            html = '<div> <span class="h2">'+ (position + 1) + '. </span>';
            html += '<input type="text" class="input_question" value="'+ task.question +'">';
            html += '<button class="remove" data-value="'+ position +'">-</button> </div>';
            $("#inhalt").append(html);

            html ='<div> <span>Punkte:</span>';
            html += '<input type="number" class="input_points" value="'+ (task.points ?? '') +'"/> </div> ';
            $("#inhalt").append(html);

        } else if (project.type == 1){
            $("#inhalt").append('<div class="h2">'+ (position + 1) + '. ' + task.question + '<span style="margin-left: 100px;">/'+ task.points +'</div>');
            $("#inhalt").append('<textarea class="input_solution" rows="4" cols="50">'+ task.solution +'</textarea>');
        } else if (project.type == 2){
            html = '<div> <span class="h2">'+ (position + 1) + '. ' + task.question + '<span style="margin-left: 50px;"></span>';
            html += '<input class="input_correction" type="number" value="'+ task.correction +'"/>'
            html += '<span>/'+ task.points +'</span> </div>'
            $("#inhalt").append(html);
            $("#inhalt").append('<div>'+ task.solution +'</div>');
        } else{
            points += Number(task.correction);
            max += Number(task.points);
            html = '<div> <span class="h2">'+ (position + 1) + '. ' + task.question + '<span style="margin-left: 100px;">'
            html += '<span> '+ task.correction + '/' + task.points + '</span> </div>'
            html += '<div>'+ task.solution +'</div>';
            $("#inhalt").append(html);
        }
    }
    if (project.type == 0){
        $("#inhalt").append('<button id="add">+</button>');

        $("#add").on("click", function() {
            project.tasks.push(new Task());
            save_test();
            load_test();
        });

    } else if (project.type == 3){
        $("#inhalt").append('<div class="h2">Punkte: '+ points +'/'+ max +'<span style="margin-left: 100px;">Note:'+ grade(max, points) +'</div>');
    }

    html = '<div> <button class="switch">switch</button>';
    html += '<button id="url">URL generieren</button>';
    html += '<button id="save">Speichern</button></div>'
    $("#inhalt").append(html);
    $("#inhalt").append('<div> <button class="back">--></button> </div>');
    $("#inhalt").append('<input id="input_url" type="text">');

    $(".back").on("click", function() {
        save_test();
        load();
        save();
    });

    $("#url").on("click", function() {
        save_test();
        save();
        $('#input_url').val(generate_url());
        var copyText = document.getElementById("input_url");
        copyText.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(copyText.value);
        alert("In zwischenablage kopiert");
    });

    $("#save").on("click", function() {
        save_test();
        save();
    });

    $(".switch").on("click", function() {
        save_test();
        if (project.type < 3){
            project.type ++;
        } else {
            project.type = 0;
        }
        load_test(); 
        save();
    });

    $(".remove").on("click", function() {
        save_test();
        const value = Number(this.dataset.value);
        project.tasks.splice(value, 1);
        load_test();
    });
}

$(document).ready(function() {
    const hash = window.location.hash;
    if (hash){
        read_url(hash);
    } else{
        if(wich_project){
            load_test();
        } else{
            load();
        }
    }
    
});