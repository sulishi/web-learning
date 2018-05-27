const n = function(sel){
    return document.querySelector(sel);
}
const Bn = function(sel){
    return document.querySelectorAll(sel);
}

var oAdd = n('.add');

oAdd.onclick =function open() {
    var oListAdd = n(".listadd");
    var oMask = n('.mask');
    oListAdd.style.display = "block";
    oMask.style.display = "block";
}//打开添加todo页面

 
function changeTab() {
    var oTab = Bn('.tab li');
    var oTab_Content = Bn('.main .tab-content');
    for(var i =0;i<oTab.length;i++)
    {
        oTab[i].index = i;
        oTab[i].onclick = function(){
            for(var j  =0;j<oTab.length;j++)
            {
                oTab[j].className =" ";
            }
            this.className = "active";
            for(var j= 0; j<oTab_Content.length;j++ )
            {
                oTab_Content[j].style.display = "none";
            }
            oTab_Content[this.index].style.display ="block";
        }
    }
}//标签页切换

var oClose = n('.close');
var oCancel = n('.cancel');
oClose.onclick=closeAdd;
oCancel.onclick=closeAdd;
function closeAdd(){
    n('.addtext').value='';
    var oListAdd = n(".listadd");
    var oMask = n('.mask');
    oListAdd.style.display = "none";
    oMask.style.display = "none";
}//关闭添加todo页面



function finish(attr){
    attr.parentNode.parentNode.removeChild(attr.parentNode);
    var finishtext = attr.parentNode.childNodes[0].innerHTML;
    var x= attr.title;
    addfinish(x,finishtext,timetim);
}   //todo完成功能

function addfinish(attr,oldtext,time){
    var oLi = document.createElement('li');
    oLi.className ="text";
    var oAttr = document.getElementsByClassName(attr)[1];
    var text = '<span class="content">'+oldtext+'</span>'+
     '<a href="javascript:void(0)" class="btn delete" onclick="Ajaxdel(this)">删除</a>'+
    ' <em>'+time+'</em>'
    oLi.innerHTML =text;
    oAttr.appendChild(oLi);
    oAttr.insertBefore(oLi,oAttr.childNodes[0]);
}//添加至完成

// function Del(Obj){
//     Obj.parentNode.parentNode.removeChild(Obj.parentNode);
//     console.log(Obj.parentNode.childNodes[0].innerHTML);
//     var delText = Obj.parentNode.childNodes[0].innerHTML;
// }//删除功能

function addText(tag,oAAText,time) { 
    var oLi = document.createElement('li');
    oLi.className ="text";
    var oTag = n(tag);
    var oT
    if(tag=='.study')
    {
        oT = 'study';
    }
    else if(tag=='.life')
    {
        oT ='life';
    }
    else{
        oT ='work';
    }
    var text = 
         '<span class="content">'+oAAText+'</span>'
         +'<a href="javascript:void(0)" class="btn" title="'+oT+'" onclick = "Ajaxfinish(this)">完成</a>'+
         '<a href="javascript:void(0)"class="btn">编辑</a>'+
         '<a href="javascript:void(0)" class="btn delete" onclick="Ajaxdel(this)">删除</a>'+
         ' <em>'+time+'</em>';
    oLi.innerHTML = text;
    oTag.appendChild(oLi);
    oTag.insertBefore(oLi,oTag.childNodes[0]);
}//添加todo

function AddContent(oChose,oAddText,timetim){
    if (oChose =="学习") {
        var attr = ".study";
        addText(attr,oAddText,timetim);
    }
    else if(oChose=="工作"){
        var attr = ".work";
        addText(attr,oAddText,timetim);
    }
    else{
        var attr = ".life";
        addText(attr,oAddText,timetim);
    }
    n('.addtext').value = '';
    var oListAdd = n(".listadd");
    var oMask = n('.mask');
    oListAdd.style.display = "none";
    oMask.style.display = "none";
}//确认添加

function edit(attr){

}//编辑功能


// function creatXMLHttpRequest(){
//     var xmlhttp;
// 	if(window.XMLHttpRequest)
// 	{
// 	 //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
// 	xmlhttp=new XMLHttpRequest();
// 	}
// 	else
// 	{
// 		// IE6, IE5 浏览器执行代码
// 		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
//     }
// }
function Ajaxtext(){   
    var oChose = n('.chose').value;
    var oAddText = n('.addtext').value;
	if(oAddText!="")
    {
        var xmlhttp;
        if(window.XMLHttpRequest)
        {
         //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
        xmlhttp=new XMLHttpRequest();
        }
        else
        {
            // IE6, IE5 浏览器执行代码
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        var data = {
            'todo':oAddText,
            "tag":oChose
        };
        var data_json =JSON.stringify(data);
        xmlhttp.open("POST","/api_add_todo",true);
        xmlhttp.onreadystatechange = function(){  
        if(xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            console.log(xmlhttp.responseText);
            var text = JSON.parse(xmlhttp.responseText);
            for(var i =0;i<text.length;i++)
            {
                AddContent(text[i].fields.tag,text[i].fields.todo,text[i].fields.creattime);      	
            }
        }
        xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        xmlhttp.send(data_json);
        } 
    }
}//Ajax添加

function Ajaxall(){
    var xmlhttp;
	if(window.XMLHttpRequest)
	{
	 //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
	xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("POST","/api_all_todo",true);
    xmlhttp.onreadystatechange = function(){  
        if(xmlhttp.readyState==4 && xmlhttp.status==200)
        {
            console.log(xmlhttp.responseText);
            var text = JSON.parse(xmlhttp.responseText);
            for(var i =0;i<text.length;i++)
            {
                if(text[i].fields.flag == 0)
                {
                    AddContent(text[i].fields.tag,text[i].fields.todo,text[i].fields.creattime);
                }
                else if(text[i].fields.flag == 1)
                {
                    addfinish(text[i].fields.tag,text[i].fields.todo,text[i].fields.creattime);
                }
                else
                alert('当前没有要完成的todo');
            }
        }
    }
    xmlhttp.send();
}//页面初始化

function Ajaxfinish(attr){
    var xmlhttp;
	if(window.XMLHttpRequest)
	{
	 //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
	xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    // attr.parentNode.parentNode.removeChild(attr.parentNode);
    var finishtext = attr.parentNode.childNodes[0].innerHTML;
    // var x= attr.title;
    var data ={
        "todo":finishtext,
        "flag":0
    };
    var data_json =JSON.stringify(data);
    xmlhttp.open("POST","/api_flag_todo",true);
    xmlhttp.onreadystatechange = function(){  
    if(xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        console.log(xmlhttp.responseText);
        var text = JSON.parse(xmlhttp.responseText);
        attr.parentNode.parentNode.removeChild(attr.parentNode);
        for(var i =0;i<text.length;i++)
        {
            addfinish(text[i].fields.tag,text[i].fields.todo,text[i].fields.creattime);      	
        }
    }
    xmlhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
    xmlhttp.send(data_json);
    } 
}//todo从完成到未完成

function Ajaxdel(obj){
    var xmlhttp;
	if(window.XMLHttpRequest)
	{
	 //  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
	xmlhttp=new XMLHttpRequest();
	}
	else
	{
		// IE6, IE5 浏览器执行代码
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    // Obj.parentNode.parentNode.removeChild(Obj.parentNode);
    var delText = Obj.parentNode.childNodes[0].innerHTML;
    var data = {
        'todo':delText
    };
    var data_json =JSON.stringify(data);
    xmlhttp.open("POST","/api_delete_todo",true);
    xmlhttp.onreadystatechange = function(){  
    if(xmlhttp.readyState==4 && xmlhttp.status==200)
    {
        console.log(xmlhttp.responseText);
        Obj.parentNode.parentNode.removeChild(Obj.parentNode);
    }
    }
}//删除todo

window.onload = function Myfunction(){
    changeTab();
    Ajaxall();
} 