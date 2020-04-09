var dt = new Date();
var Punched_in_min;
var Punched_in_hour;
var Punch_state = 0;
//==================================================
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBlnQth5n313UnOz3FiPoeLfOvwxRz2Vvw",
    authDomain: "punchclock-356e3.firebaseapp.com",
    databaseURL: "https://punchclock-356e3.firebaseio.com",
    projectId: "punchclock-356e3",
    storageBucket: "punchclock-356e3.appspot.com",
    messagingSenderId: "5810207321",
    appId: "1:5810207321:web:02e1044415a5164ab30f48",
    measurementId: "G-LGQHHPLD79"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
//=====================================================
var database = firebase.database();
var total = 0;
var data = database.ref('rows');
data.on('value', function(hello) {
    total = 0;
    var row_data = hello.val();
    console.log(Object.keys(row_data).length);
    var table = document.getElementById("punchtable");
    for(var i = table.rows.length - 1; i > 0; i--){
    table.deleteRow(i);
    }
    console.log(table.length);
    for(var key in row_data){
        var row = table.insertRow(-1);
        var Date = row.insertCell(0);
        var Punch_in = row.insertCell(1);
        var Punch_out = row.insertCell(2);
        var Time = row.insertCell(3);
        var Delete = row.insertCell(4);
        var trash_icon = document.createElement("I");
        trash_icon.setAttribute("class", "fas fa-edit");
        Delete.appendChild(trash_icon);
        Delete.width = "30px";
        Date.innerHTML = row_data[key].Date;
        Punch_in.innerHTML = row_data[key].Punch_in;
        Punch_out.innerHTML = row_data[key].Punch_out;
        Time.innerHTML = row_data[key].Time;
        total += row_data[key].Time;
        Delete.setAttribute("onclick", "delrow(this)");
        Delete.setAttribute("id", key);
        Delete.setAttribute("class", "delbtn");
        document.getElementById("total").innerHTML = "Total worked - " + Math.floor(total/60) + " hours and " + total%60 + " minutes";
    }
  });

function min(time){
    if(time < 10){
        console.log("hrell");
        return "0" + time;
    }else{
        return time;
    }
}
var obj_id;
function delrow(r){
    console.log("hello");
    $(document).ready(function(){
        $("#edit").modal("show");
        $("#edit_date").val(r.parentNode.cells[0].innerHTML);
        $("#edit_in").val(r.parentNode.cells[1].innerHTML);
        $("#edit_out").val(r.parentNode.cells[2].innerHTML);
    });
    obj_id = r.id;
}
function derow(){
    database.ref('rows/' + obj_id).remove()
    $(document).ready(function(){
        $("#edit").modal("hide");
    });
}
function edit(){
    register('edit_',obj_id);
    $(document).ready(function(){
        $("#edit").modal("hide");
    });
}
function punch(){
    document.getElementById("punch-body-mod").innerHTML =  dt.getHours() + ":" + min(dt.getMinutes());
}
function punched(){
    if(Punch_state == 0){
        Punched_in_min = dt.getMinutes();
        Punched_in_hour = dt.getHours();
        document.getElementById("punch-title-mod").innerHTML = "Punch out at";
        document.getElementById("punch-state").innerHTML = "Punch out";
        Punch_state = 1;
    }else if(Punch_state == 1){
        document.getElementById("punch-title-mod").innerHTML = "Punch in at";
        document.getElementById("punch-state").innerHTML = "Start your shift";
        Punch_state = 0;
        enter_data();
    }

}
function putter(){
    var table = document.getElementById("punchtable");
    var is = 0
    for(i = 0; i < table.rows.length; i++){
        var date = table.rows[i].cells[0].innerHTML == document.getElementById("man_date").value;
        var pin = table.rows[i].cells[1].innerHTML == document.getElementById("man_in").value;
        var pout = table.rows[i].cells[2].innerHTML == document.getElementById("man_out").value;
        if(date & pin & pout){
            console.log("gello");
            $(document).ready(function(){
                $("#enter_manually").modal("hide");
                $("#duplicate-time").modal("show");
            });
            is = 1;
            break;
        }
    }
    if(is == 0){register('man_','');}
}
function register(target, key){
    var k = document.getElementById(target + "date");
    var tin = new Date("1/1/2013 " + document.getElementById(target + 'in').value); 
    var tout = new Date("1/1/2013 " + document.getElementById(target + 'out').value); 
    var difference = (tout.getHours()*60 + tout.getMinutes()) - (tin.getHours()*60 + tin.getMinutes());
    if(k.value.length == 10 && difference >= 0){
        var Data = {
            Date: k.value,
            Punch_in: min(tin.getHours()) + ':' + min(tin.getMinutes()),
            Punch_out: min(tout.getHours()) + ':' + min(tout.getMinutes()),
            Time: difference
        }
        console.log("nilered");
        if(key.length == 0){
            database.ref('rows' + '/' + key).push(Data);
        }else{
            database.ref('rows' + '/' + key).set(Data);
            console.log(key);
        }
        $(document).ready(function(){
            $("#enter_manually").modal("hide");
        });
    }else if(difference < 0){
        document.getElementById("alert_msg").innerHTML = "&#9888; You cannot punch out earlier than you punch in";
        document.getElementById("alerte_msg").innerHTML = "&#9888; You cannot punch out earlier than you punch in";
        document.getElementById("edit_out").style.border = "2px solid red";
        document.getElementById("man_out").style.border = "2px solid red";
    }else{
        document.getElementById("alert_msg").innerHTML = "&#9888; Please enter a valid date";
        document.getElementById("alerte_msg").innerHTML = "&#9888; Please enter a valid date";
        k.style.border = "2px solid red";
    }
}
function enter_data(){
    console.log("hello");
    var Data = {
        Date: min(dt.getFullYear()) + "-" + min(dt.getMonth()) + "-" + min(dt.getDate()),
        Punch_in: min(Punched_in_hour)  + ":" + min(Punched_in_min),
        Punch_out: min(dt.getHours())  + ":" + min(dt.getMinutes()),
        Time: (dt.getHours()*60 + dt.getMinutes()) - (Punched_in_hour*60 + Punched_in_min),
    }
    data.push(Data);
}
