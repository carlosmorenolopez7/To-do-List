if(localStorage.reminders != null)
    var reminders = JSON.parse(localStorage.getItem('reminders'))
else
    var reminders = [];

$(document).ready(function() {
    var notCompleted = 0;
    var total = reminders.length;
    if (localStorage.getItem('reminders') != null) {
        saveLocal();
    }
    $("input").keyup(function(e) {
        if (e.keyCode == 13) {
            addReminder();
            total ++;
            notCompleted ++;
            $("#pendientes").text(`${notCompleted} pendientes de un total de ${total}`);
        }
    });
    $("#recordatorios").on("click", ".fa-square-minus", function() {
        $(this).fadeOut("normal", function() {
            $(this).parent().parent().remove()
        });
        reminders.splice($(this).parent().parent().index(), 1);
        localStorage.reminders = JSON.stringify(reminders);
        total --;
        notCompleted --;

        if(notCompleted > 0){
            $("#pendientes").text(`${notCompleted} pendientes de un total de ${total}`);
        } else {
            $("#pendientes").text(`0 pendientes de un total de ${total}`);
        }
    });
    $("#recordatorios").on("click", ".fa-circle", function() {
        $(this).toggleClass("fa-circle fa-check-circle");
        $(this).siblings("h2").toggleClass("checked");
        var index = $(this).parent().parent().index();
        reminders[index].completed = true;
        localStorage.reminders = JSON.stringify(reminders);
        notCompleted --;
        if(notCompleted > 0){
            $("#pendientes").text(`${notCompleted} pendientes de un total de ${total}`);
        } else {
            $("#pendientes").text(`0 pendientes de un total de ${total}`);
        }
    });
    $("#recordatorios").on("click", ".fa-check-circle", function() {
        $(this).toggleClass("fa-check-circle fa-circle");
        $(this).siblings("h2").removeClass("checked");
        var index = $(this).parent().parent().index();
        reminders[index].completed = false;
        localStorage.reminders = JSON.stringify(reminders);
        notCompleted ++;
        $("#pendientes").text(`${notCompleted} pendientes de un total de ${total}`);
    });
    $("#deleteAll").click(function() {
        var removed = 0;
        $(".fa-check-circle").parent().parent().hide("normal", function() {
            $(".fa-check-circle").parent().parent().remove();
            for (var i = 0; i < reminders.length; i++) {
                if (reminders[i].completed) {
                    removed ++;
                    reminders.splice(i, 1);
                    i--;
                }
            }
            total -= Math.floor(removed/2);
            localStorage.reminders = JSON.stringify(reminders);
            if(notCompleted > 0){
                $("#pendientes").text(`${notCompleted} pendientes de un total de ${total}`);
            } else {
                $("#pendientes").text(`0 pendientes de un total de ${total}`);
            }
        });
    });
    $("h2:not(.checked)").each(function() {
        notCompleted++;
    });
    if(notCompleted > 0){
            $("#pendientes").text(`${notCompleted} pendientes de un total de ${total}`);
    } else {
            $("#pendientes").text(`0 pendientes de un total de ${total}`);
    }
    changePriority("low");
    changePriority("medium");
    changePriority("high");
});

function addReminder(){
    var inputContent = $('#tarea').val();
    var container = $('#recordatorios');
    var createdReminder = {
        title: inputContent,
        priority: "medium",
        date: Date.now(),
        completed: false
    }
    var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${createdReminder.title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - createdReminder.date)/1000)/60)} minutos</p></div></div>`).hide();
    if(inputContent != ''){
        container.append(newReminder);
        $('#tarea').val('');
        newReminder.show("normal");
        reminders.push(createdReminder);
        localStorage.reminders = JSON.stringify(reminders);
    }
}

function changePriority(priority){
    $("#recordatorios").on("click", `#${priority}`, function() {
        $(this).toggleClass("not_marked marked");
        $(this).siblings().removeClass("marked");
        $(this).siblings().addClass("not_marked");
        var index = $(this).parent().parent().index();
        reminders[index].priority = `${priority}`;
        localStorage.reminders = JSON.stringify(reminders);
    });
}

function saveLocal() {
    var reminders = JSON.parse(localStorage.getItem('reminders'));
    var container = $('#recordatorios');
    for (var i = 0; i < reminders.length; i++) {
        if(reminders[i].completed == false){
            if(reminders[i].priority == "low"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            }else if(reminders[i].priority == "medium"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            }else if(reminders[i].priority == "high"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-circle'></i><h2>${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            }
        }else {
            if(reminders[i].priority == "low"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            }else if(reminders[i].priority == "medium"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="marked">Normal</button><button id='high' class="not_marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            }else if(reminders[i].priority == "high"){
                var newReminder = $(`<div class='singleReminder'><div class='reminder--text'><i class='fa-regular fa-check-circle'></i><h2 class="checked">${reminders[i].title}</h2><i class='fa-solid fa-square-minus'></i></div><div class='reminder--data'><p>Prioridad</p><button id='low' class="not_marked"><i class='fa-solid fa-arrow-down'></i> Low</button><button id='medium' class="not_marked">Normal</button><button id='high' class="marked"><i class='fa-solid fa-arrow-up'></i> High</button><i class='fa-regular fa-clock'></i><p>Añadido hace ${Math.floor(((Date.now() - reminders[i].date)/1000)/60)} minutos</p></div></div>`).hide();
            }
        }
        container.append(newReminder);
        newReminder.show('normal');
    }
}
