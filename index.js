var mb= document.getElementById('menuPanel');
if(!mb){
//------- CSS ----------------------------
   var newStyle = document.createElement('style');
    newStyle.type = 'text/css';
    newStyle.innerText = `
.select-css {
	display: block;
	float: left;
	font-size: 12px;
	font-family: sans-serif;
	font-weight: 700;
	color: #444;
	line-height: 1.2;
	padding: .4em 1.5em .2em .3em;
	box-sizing: border-box;
	margin: 0;
	border: 1px solid #aaa;
	box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
	border-radius: .3em;
	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;
	background-color: #fff;
	background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23007CB2%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E"),
	  linear-gradient(to bottom, #ffffff 0%,#e5e5e5 100%);
	background-repeat: no-repeat, repeat;
	background-position: right .7em top 50%, 0 0;
	background-size: .65em auto, 100%;
    z-index: 100;
}
.select-css::-ms-expand {
	display: none;
}
.select-css:hover {
	border-color: #888;
}
.select-css:focus {
	border-color: #aaa;
	box-shadow: 0 0 1px 3px rgba(59, 153, 252, .7);
	box-shadow: 0 0 0 3px -moz-mac-focusring;
	color: #222; 
	outline: none;
}
.select-css option {
	font-weight:normal;
}

.button-css {
	display: block;
	float: left;
	font-size: 12px;
	font-family: sans-serif;
	font-weight: 700;
	color: #444;
	line-height: 1.2;
	padding: .4em 1.5em .2em .3em;
	box-sizing: border-box;
	margin: 0;
	border: 1px solid #aaa;
	box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
	border-radius: .3em;
	-moz-appearance: none;
	-webkit-appearance: none;
	appearance: none;
	background-color: #faa;
	background-repeat: no-repeat, repeat;
	background-position: right .7em top 50%, 0 0;
	background-size: .65em auto, 100%;
}
.btn {
    vertical-align: top;
    display: block;
    float: left;
    font-size: 12px;
    font-family: sans-serif;
    font-weight: 700;
    color: #444;
    line-height: 1.2;
    padding: .4em 0.2em .2em .3em;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid #aaa;
    box-shadow: 0 1px 0 1px rgba(0,0,0,.04);
    border-radius: .3em;
    -moz-appearance: none;
    -webkit-appearance: none;
    appearance: none;
    background-color: #fff;
    background-repeat: no-repeat, repeat;
    background-position: right .1em top 50%, 0 0;
    background-size: .65em auto, 100%;
}
	#sortable {
	  list-style-type: none; margin: 0px; padding: 0px; width: 100%; 
	}
	#sortable li {
	  width: 24.5%; height: 24.5%; font-size: 1em; align: left;
	  margin: 0px 1px 0px 0px; padding: 0px; float: left; 
	}
`;
document.getElementsByTagName('HEAD').item(0).appendChild(newStyle);


//------- HTML --------------------------
var el= document.createElement('dev');
  document.body.appendChild(el);
  el.id = 'index';
  el.innerHTML = `
<svg id="MTsvg" width="100%" height="100%" style="position: fixed;  z-index: 100; top: 0px; left: 0px; width: 100%; height: 100%; ">
<rect width="100%" height="100%" fill="#ffffff"></rect>
</svg>
<div id="MT" style="position: fixed;  z-index: 100; top: 0px; left: 5px; width: 100%; height: 100%; ">
<table>
<tr><td>
<input type="button" id="pineCompile" value="保存"  class="btn">
<textarea id="scriptTxt" class="btn" style="margin: 0px; width: 250px; height: 22px; background-color:#e5ffc180;"></textarea>
<textarea id="rsltTxt"    class="btn" style="display:none; margin: 0px; width: 320px; height: 23px;"></textarea>
<input type="button" id="sqlCompile" value="保存"  class="btn">
<textarea id="sqlTxt"    class="btn"  style="margin: 0px; width: 350px; height: 22px; background-color:#f0f0ff;"></textarea>
</td></tr>
<tr><td>
<div style="font-size:8px " align="left">
<a class="apndW0" href="javascript:">SELECT</a>&nbsp; 
<a class="apndW0" href="javascript:">CSVout</a>&nbsp; 
<a class="apndW0" href="javascript:">code</a>&nbsp; 
<a class="apndW0" href="javascript:">FROM</a>&nbsp; 
<a class="apndW0" href="javascript:">all</a>&nbsp; 
<a class="apndW0" href="javascript:">disp</a>&nbsp; 
<a class="apndW0" href="javascript:">WHERE</a>&nbsp; 
<a class="apndW0" href="javascript:">ORDER BY</a>&nbsp; 
<a class="apndW0" href="javascript:">ASC</a>&nbsp; 
<a class="apndW0" href="javascript:">DESC</a>&nbsp;&nbsp;
<a class="apndW0" href="javascript:">AND</a>&nbsp; 
<a class="apndW0" href="javascript:">OR</a>&nbsp; 
<a class="apndW0" href="javascript:">NOT</a>&nbsp; 
</div>
<div id="sqlVars" style="font-size: 8px"></div>
<div id="sqlVars2" style="font-size: 8px"></div>
</td>
</tr>
<!-- </table> -->

<!-- //body領域のhtml -->
<!-- //unCheck, checkAll, +5, 除く, 無除,Sort -->
<!-- <table style="margin:1px 0px; background-color:#e0e0e0; z-index: 100" width=100%> -->
<tbody>
<tr><td  colspan="5" align="left">
<select id="arFname"　 class="select-css" style="background-color:#ffe8ec;"> <option value="0">銘柄Group</option></select>
<input id="fName" value="" class="btn" style="width: 80px; background-color:#ffe8ec;" placeholder="group-name">
<input type="button" id="doSave"     class="btn" value="< Save <" onclick="doSavePlus()" style="background-color:#ffe8ec;">
<textarea id="txtCode" rows=1 cols=25    class="btn" placeholder="銘柄コードを貼付け" style="background-color:#ffe8ec;"></textarea>
<input type="button" id="MC"          class="btn" value="ＭＣ"  style="background-color:#FECCCC80;">
<input type="button" id="MPlus"      class="btn" value="Ｍ+"  >
<input type="button" id="MR"          class="btn" value="ＭＲ"  > &nbsp;
<input type="button" id="reDraw"     class="btn"  value="再表示"  >
<input type="button" id="tglClickMode"    class="btn"  value="&#x1f446;">
<input type="button" id="SORT"       class="btn"  value="&#x2714; ▼"  > &nbsp;
<input type="button" id="colorSort"  class="btn"  value="色 ▼"       >
<input type="button" id="unCheck"    class="btn"  value="un&#x2714;"  >
<input type="button" id="checkAll"   class="btn"  value="all&#x2714;" >&nbsp;
<input type="button" id="delChecked" class="btn"  value="&#x2714;除"  style="background-color:#FECCCC80;">
<input type="button" id="delNoMark"  class="btn"  value="無除"  style="background-color:#FECCCC80;">
</td></tr>
<tr><td>
<select id="menuPerTerm" class="select-css"><option value="0">足設定</option></select>
<input  type="button"   id="tglHeikin"           value="平" class="btn"> &nbsp;
<select id="menuAutoUpdate" class="select-css"><option value="0">更新</option></select>
<input type="button" id="tglSpeak"           value="🔕"  class="btn">
<select id="menuStudy"  class="select-css" style="background-color:#e5ffc180;"><option value="0">Study</option></select> 
<select id="menuSignal"    class="select-css" style="background-color:#f0f0ff"><option value="0">SQL</option></select> 
<input  type="button"   id="runSqlSignal"           value="R" class="btn"> &nbsp;
<select id="menuScreening"    class="select-css" style="background-color:#f0f0ff"><option value="0">スクリーニング</option></select> 
<input type="button"    id="runSqlScreening"     value="R" class="btn" style="background-color:#f0f0ff;">
</td></tr>
</tbody></table>

<ul id="sortable" style="display:on; z-index: 100"></ul>
</div>
<script>
function tglARGUS() {
	var _argus=document.getElementById('TM');
	var _tglargus=document.getElementById('TMsvg');
	if(_argus.style.zIndex<0){
		_argus.style.zIndex=101;
		_tglargus.style.zIndex=101;
	}else{
		_argus.style.zIndex=-101;
		_tglargus.style.zIndex=-101;
	}
}
</script>
`;
}
