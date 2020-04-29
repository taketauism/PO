//05 study.js
/*
 * study{名前: ["pine script" , "javascript"]}
 * 文字列内の最後は "\r\n\" とする
 *　スクリプト編集ボックス内では、単純に開業するだけでOK
 * 描画時、毎回eval(javascript)された後、各チャートで実行される
 * 描画を修正したいときは、編集ボックス内で変更後保存するだけ
 */
var study = {};

// study.js
//loadHistoricalData(gTimeFrame)が終わったら
stock={};
calcAll={};	//全銘柄計算済み項目
function setupHistoricalDataIx(){
    stock ={};
	var code=hist[gTimeFrame][0][0];
	var bgn,cur=0;	//最新が一番前
	for(var i=1; i<hist[gTimeFrame].length; i++){
		if(hist[gTimeFrame][i][0]!=code){
			stock[code] = {'b':i-1,'c':cur}
			code=hist[gTimeFrame][i][0];
			cur=i;
		}
	}
	stock[code] = {'b':hist[gTimeFrame].length-1,'c':cur};
}

//==================================================	
//==================================================	
//データ構造
//ohlc, hist, study, plot, indi
//ohlcIx[name:秒単位時刻]
//series データ　==> true
//==================================================	
//==================================================
const code_=0, time_=1, open_=2, high_=3, low_=4, close_=5, volume_=6;	

var ohlcIx={'code':[0,9999999999],'time':[1,9999999999],'open':[2,9999999999],'high':[3,9999999999],'low':[4,9999999999],'close':[5,9999999999],'volume':[6,9999999999]};

//----------
function __組み込み関数__bgn__(){}
/*builInFuncの第1argは、変数名に付加するアーギュメント番号,第2argは付加する文字
  最終argは変数名
  builtInFuncを追加するときは、注意して修正 
 */
var builInFunc={'atr':[[1,'']],'ema':[[2,'']],'sma':[[2,'']],'stdev':[[2,'']],'smc':[[3,'']],
				'arsi':[[2,'']],'rsi':[[2,'']],'stoRSI':[[2,'K'],[2,'D']],'laguerre':[[0,'']],
				'highest':[[2,'']],'lowest':[[2,'']]
				}; 

function atr(length, varName) {
	//自分自身(sma.name)がseriesデータとして登録されていohlsIxに存在する調べ、未登録なら登録して計算する。登録済みなら何もしない
//	if(ohlcIx[sma.name+length] != undefined) return;
	var baseName = (varName==undefined) ? atr.name+length : varName;
	var selfIx = funcSelfIx( baseName );	
    eval(baseName + '_ =' + selfIx);
	var pr=2.0/(length+1);
	var k = ohlc.length-1;
	var high_ = getOhlcIx('high');
	var low_ = getOhlcIx('low');
	var close_ = getOhlcIx('close');
	ohlc[k][selfIx]= ohlc[k][high_]-ohlc[k][low_];	//左端の処理
	for(  k--; k>=0; k--){
		var v = Math.max((ohlc[k][high_]-ohlc[k][low_]), (ohlc[k][high_]-ohlc[k+1][close_]), (ohlc[k+1][close_]-ohlc[k][low_]));
		ohlc[k][selfIx] = pr*v + (1-pr)*ohlc[k+1][selfIx];
	}
}

function sma(srcIdx,length, varName){
	//自分自身(sma.name)がseriesデータとして登録されていohlsIxに存在する調べ、未登録なら登録して計算する。登録済みなら何もしない
//	if(ohlcIx[sma.name+length] != undefined) return;
	var baseName = (varName==undefined) ? sma.name+length : varName;
	var selfIx = funcSelfIx( baseName );
    eval(baseName + '_ =' + selfIx);
	var sum=0;
	for(var k=ohlc.length-1; k>=0; k--){
		sum += ohlc[k][srcIdx];
		if(k>=ohlc.length-length){		//左端の処理
			ohlc[k][selfIx] = sum/(ohlc.length-k);	
		}else{
			sum = sum - ohlc[k+length][srcIdx];
			ohlc[k][selfIx] = sum/length;
		}
	}
}
function stdev(srcIdx,length, varName){
	//自分自身(stdev.name)がseriesデータとして登録されていohlsIxに存在する調べ、未登録なら登録して計算する。登録済みなら何もしない
//	if(ohlcIx[stdev.name+length] != undefined) return;
	var baseName = (varName==undefined) ? stdev.name+length : varName;
	var selfIx = funcSelfIx( baseName );	
    eval(baseName + '_ =' + selfIx);
	var sum=0, sum2=0, ave=0;
	for(var k=ohlc.length-1; k>=0; k--){
		var v = ohlc[k][srcIdx];
		sum  = sum  + v;
		sum2 = sum2 + v*v;
		if(k>=ohlc.length-length){		//左端の処理
			ave = sum/(ohlc.length-k);
			ohlc[k][selfIx] = Math.sqrt(sum2/(ohlc.length-k) - ave*ave)
			
		}else{
			var vv = ohlc[k+length][srcIdx];
			sum = sum - vv;
			sum2= sum2- vv*vv;
			ave = sum/length;
			ohlc[k][selfIx] = Math.sqrt(sum2/length - ave*ave);
		}
	}
}


function ema(srcIdx,length, varName){
	//自分自身(ema.name)がseriesデータとして登録されていohlsIxに存在する調べ、未登録なら登録して計算する。登録済みなら何もしない
//	if(ohlcIx[ema.name+length] != undefined) return;
	var baseName = (varName==undefined) ? ema.name+length : varName;
	var selfIx = funcSelfIx( baseName );	
    eval(baseName + '_ =' + selfIx);
	var pr=2.0/(length+1);
	var k=ohlc.length-1;
	ohlc[k][selfIx] = ohlc[k][srcIdx];
	for( k--; k>=0; k--){
		var diff = ohlc[k][srcIdx]-ohlc[k+1][srcIdx];
		ohlc[k][selfIx] = (1-pr)*ohlc[k+1][selfIx] + pr*ohlc[k][srcIdx];
	}
}

//srcIdxが1,0の値と仮定、sma*lengthでカウントを求める
function smc(srcIdx,threshold,length, varName){
	//自分自身(smc.name)がseriesデータとして登録されていohlsIxに存在する調べ、未登録なら登録して計算する。登録済みなら何もしない
//	if(ohlcIx[smc.name+length] != undefined) return;
	var baseName = (varName==undefined) ? smc.name+length : varName;
	var selfIx = funcSelfIx( baseName );	
    eval(baseName + '_ =' + selfIx);
	var sum=0;
	for(var k=ohlc.length-5; k>=0; k--){
		sum += (ohlc[k][srcIdx]>=threshold)? 1: 0;
		if(k>=ohlc.length-5-length){		//左端の処理
			ohlc[k][selfIx] = sum;	
		}else{
			sum = sum - ((ohlc[k+length][srcIdx]>=threshold)? 1: 0); //ohlc[k+length][srcIdx];
			ohlc[k][selfIx] = sum;
		}
	}
}
//heikinは引数が無いので、dummy
function heikin(dummy, varName){
	//自分自身(smc.name)がseriesデータとして登録されていohlsIxに存在する調べ、未登録なら登録して計算する。登録済みなら何もしない
	var selfOIx = funcSelfIx( varName+'O' );	
	var selfCIx = funcSelfIx( varName+'C' );	
    eval(varName + 'O_ =' + selfOIx);
    eval(varName + 'C_ =' + selfCIx);

    var ohlc   = stock[Chart.code].ohlc;
    var k = ohlc.length-1;

    var xC = (ohlc[k][open_] + ohlc[k][high_] + ohlc[k][low_] + ohlc[k][close_])/4;
    var xO = xC;
    ohlc[k][selfOIx] = xO;
    ohlc[k][selfCIx] = xC;
    k--;
    xO = (xO+xC)/2;
    xC = (ohlc[k][open_] + ohlc[k][high_] + ohlc[k][low_] + ohlc[k][close_])/4;
    ohlc[k][selfOIx] = xO;
    ohlc[k][selfCIx] = xC;
	for(k--; k>=0; k--){
        xO = (xO+xC)/2;
        xC = (ohlc[k][open_] + ohlc[k][high_] + ohlc[k][low_] + ohlc[k][close_])/4;
		ohlc[k][selfOIx] = xO;
        ohlc[k][selfCIx] = xC;
	}
}

function laguerre(srcIdx, alpha, varName) {
	// alpha = 0.618
	var selfIx = funcSelfIx( varName );	
    eval(varName + '_ =' + selfIx);
	var L0 =0.0;
	var L1 =0.0;
	var L2 =0.0;
	var L3 =0.0;
	var L0x=0.0;
	var L1x=0.0;
	var L2x=0.0;
	var L3x=0.0;
	for(var k=ohlc.length-5; k>=0; k--){
		L0 = alpha * ohlc[k][srcIdx] +   (1 - alpha) * L0x;
		L1 = -(1 - alpha) * L0 + L0x + (1 - alpha) * L1x;
		L2 = -(1 - alpha) * L1 + L1x + (1 - alpha) * L2x;
		L3 = -(1 - alpha) * L2 + L2x + (1 - alpha) * L3x;
		ohlc[k][selfIx] = (L0 + 2 * L1 + 2 * L2 + L3)/6;
		// for next loop
		L0x=L0; L1x=L1; L2x=L2; L3x=L3;
	}
}
function stoRSI(srcIdx,length, smooth, varName){
	//自分自身(rsi.name)がseriesデータとして登録されていohlsIxに存在する調べ、未登録なら登録して計算する。登録済みなら何もしない
//	if(ohlcIx[stoRSI.name+length] != undefined) return;
	var baseName = (varName==undefined) ? sma.name+length : varName;
	var selfKIx = funcSelfIx( baseName+'K' );	
	var selfDIx = funcSelfIx( baseName+'D' );	
    eval(baseName + 'K_ =' + selfKIx);
    eval(baseName + 'D_ =' + selfDIx);
	
	// TradingViewは、J.W.ワイルダーの計算式
	//------ rsi1 = rsi(src, lengthRSI)----
	var rsi1=[];
	var pr=2.0/(length+1);
	var up=1e-10, dn=1e-10;
	rsi1[ohlc.length-1] = 50;
	for(var k=ohlc.length-2; k>=0; k--){
		var diff = ohlc[k][srcIdx]-ohlc[k+1][srcIdx];
		up *= (1-pr);
		dn *= (1-pr);
		up += diff>0 ? diff * pr: 0;
		dn += diff<0 ? -diff* pr: 0;
		rsi1[k] = up/(up+dn)*100;
	}
	
	//----- stock = stoch(rsi1, rsi1, rsi1, lengthStoch)
	var highest=[], lowest=[];
	var k = ohlc.length-1;
	var vH = rsi1[k];
	var vL = rsi1[k];
	for( var j=length; j>0  && k>=0; k--, j--){		//左端の処理
		var v = rsi1[k];		// ohlc[j][srcIdx];
		if(v >= vH)	vH = v;			
		if(v <= vL)	vL = v;
		highest[k] = v;
		lowest[k]  = v;
	}
	for( ; k>=0; k--){
		var ar = rsi1.slice(k,k+length);
		highest[k] = Math.max(...ar);
		lowest[k]  = Math.min(...ar);
	}
	var stoch = []; stoch[ohlc.length-1] = 50;
	for(var k=ohlc.length-2; k>=0; k--){
		var diff = highest[k] - lowest[k];
		if(diff!=0)
			stoch[k] = ( rsi1[k] - lowest[k] ) / diff * 100;
		else
			stoch[k] = stoch[k+1];
	}
	delete rsi1; delete highest;	delete lowest;
	
	//stoch[ohlc.length-1]がNaNになっていてErrorが発生するので、次の値で置き換える
	for(var j=3; j>=0; j--)
		stoch[ohlc.length-1-j] = stoch[ohlc.length-2-j];
	
	var sumK = 0;
	var sumD = 0;
	for(var k=ohlc.length-1; k>=0; k--){
		//----- k = sma(stoch, smoothK)
		sumK += stoch[k];
		if(k>=ohlc.length-smooth){		//左端の処理
			ohlc[k][selfKIx] = sumK/(ohlc.length-k);
		}else{
			sumK = sumK - stoch[k+smooth];
			ohlc[k][selfKIx] = sumK/smooth;
		}

		sumD += ohlc[k][selfKIx];
		if(k>=ohlc.length-smooth){		//左端の処理
			ohlc[k][selfDIx] = sumD/(ohlc.length-k);
		}else{
			sumD = sumD - ohlc[k+smooth][selfKIx];
			ohlc[k][selfDIx] = sumD/smooth;
		}
	}
}
// adaptive rsi
// 通常のrsiの５０付近では　緩やかなsma-filterをかけ,rsiが0,100に近づくと急速に通常のrsiになる
function arsi(srcIdx,length, varName){
	var baseName = (varName==undefined) ? rsi.name+length : varName;
	var selfIx = funcSelfIx( baseName );	
    eval(baseName + '_ =' + selfIx);
	//最初に通常のrsiの計算を行う
	var rsi=[];
	var pr=2.0/(length+1);
	var up=1e-10, dn=1e-10;
	rsi[ohlc.length-1]= 50;
	for(var k=ohlc.length-2; k>=0; k--){
		var diff = ohlc[k][srcIdx]-ohlc[k+1][srcIdx];
		up *= (1-pr);
		dn *= (1-pr);
		up += diff>0 ? diff * pr: 0;
		dn += diff<0 ? -diff* pr: 0;
		rsi[k] = up/(up+dn)*100;
	}
	//次にadaptive RSIの計算を行う
	ohlc[ohlc.length-1][selfIx] = 50;
	var arsi_1 = 50;
	for(var k=ohlc.length-2; k>=0; k--){
		var alpha = 2 * Math.abs(rsi[k] / 100 - 0.5);
		var arsi = alpha * rsi[k] + (1 - alpha) * arsi_1;
		arsi_1 = arsi;
		ohlc[k][selfIx] = arsi;
	}
}
function rsi(srcIdx,length, varName){
	//自分自身(rsi.name)がseriesデータとして登録されてohlsIxに存在する調べ、未登録なら登録して計算する。登録済みなら何もしない
//	if(ohlcIx[rsi.name+length] != undefined) return;
	var baseName = (varName==undefined) ? rsi.name+length : varName;
	var selfIx = funcSelfIx( baseName );	
    eval(baseName + '_ =' + selfIx);
	
	// TradingViewは、J.W.ワイルダーの計算式
	var pr=2.0/(length+1);
	var up=1e-10, dn=1e-10;
	ohlc[ohlc.length-1][selfIx] = 50;
	for(var k=ohlc.length-2; k>=0; k--){
		var diff = ohlc[k][srcIdx]-ohlc[k+1][srcIdx];
		up *= (1-pr);
		dn *= (1-pr);
		up += diff>0 ? diff * pr: 0;
		dn += diff<0 ? -diff* pr: 0;
		ohlc[k][selfIx] = up/(up+dn)*100;
	}

	// 以下通常のrsi計算
	// var up=1e-20, dn=1e-20;
	// var diffUp=[]; diffDn=[];
	// for(var k=ohlc.length-2; k>=0; k--){
		// var diff = ohlc[k][srcIdx]-ohlc[k+1][srcIdx];
		// var dup, ddn;
		// if(diff > 0) {dup = diff; ddn = 0;}
		// else		 {ddn = -diff;dup = 0;}

		// up += dup;	diffUp[k] = dup;
		// dn += ddn;	diffDn[k] = ddn;
		// if(k<ohlc.length-length){		//length以降の処理
			// up -= diffUp[k+length-1];
			// dn -= diffDn[k+length-1];
		// }

		// ohlc[k][selfIx] = up/(up+dn)*100;		
	// }
	// return;
}
function highest(srcIdx, length, varName){
//	if(ohlcIx[highest.name+length] != undefined) return;
	var baseName = (varName==undefined) ? highest.name+length : varName;
	var selfIx = funcSelfIx( baseName );	
    eval(baseName + '_ =' + selfIx);

	var k;
	var src = [];
	for( k=0; k<ohlc.length; k++)
		src.push(ohlc[k][srcIdx]);
	k = ohlc.length-1;
	var vH = src[k];
	for( var j=length; j>0 && k>=0; k--, j--){		//左端の処理
		var v = src[k];		// ohlc[j][srcIdx];
		if(v >= vH)	vH = v;			
		ohlc[k][selfIx] = vH;
	}
	for( ; k>=0; k--){
		var ar = src.slice(k,k+length);
		ohlc[k][selfIx] = Math.max(...ar);
	}
	delete src;
}



function lowest(srcIdx, length, varName){
//	if(ohlcIx[lowest.name+length] != undefined) return;
	var baseName = (varName==undefined) ? lowest.name+length : varName;
	var selfIx = funcSelfIx( baseName );	
    eval(baseName + '_ =' + selfIx);
	var k;
	var src = [];
	for( k=0; k<ohlc.length; k++)
		src.push(ohlc[k][srcIdx]);
	k = ohlc.length-1;
	var vL = src[k];
	for( var j=length; j>0 && k>=0; k--, j--){		//左端の処理
		var v = src[k];		// ohlc[j][srcIdx];
		if(v <= vL)	vL = v;			
		ohlc[k][selfIx] = vL;
	}
	for( ; k>=0; k--){
		var ar = src.slice(k,k+length);
		ohlc[k][selfIx] = Math.min(...ar);
	}
	delete src;
}
function __組み込み関数__end__(){}

function funcSelfIx(name){
	if(ohlcIx[name] == undefined){
		var allocatedIx = Object.keys(ohlcIx).length;
		ohlcIx[name] = [allocatedIx,0];
	}
	return ohlcIx[name][0];
}
// ohlcのインジで使える次のindex
// @ UTC秒の時間
// ohlcで不要になったixを回収し、さらに追加で50件を加える
function setReUseIxs(latestDT){
	var reUseKeys = Object.keys(ohlcIx).filter((key)=>{
			var dt = ohlcIx[key][1];
			return (dt==0 || dt<latestDT);
		})
	var length = Object.keys(ohlcIx).length;
	reUseKeys.forEach(key =>{
		delete ohlcIx[key];
	});
}
//----------
//pine関数処理
//----------
// @ ohlcIx[name][1]がlatestDT以前ならコンパイルし計算対象とする
// latestDTになっていれば、全銘柄での計算が終わっているので計算対象から外し、高速化する
function pineCompile(studyName, latestDT){	
	//起動直後はChartがundefinedなので
	setReUseIxs(latestDT);	//
	//if(Chart==undefined) testChart();
	var maxPane = 1;	//価格表示のCandle Paneは自動表示
	//pineスクリプト分はChartの最大Bar+20本の繰り返し計算を行う(kはどのプログラムでも使うので他に使わなように)
	var buf=[];		buf.push('studyFunc = function(kmax,kmin){\r\n' +
			'var kmx = (kmax==undefined)? (parseInt(Chart.term)+20): kmax;\r\n' + 
			'var kmn = (kmin==undefined)? 0 : kmin;\r\n' + 
			'kmx = Math.min(kmx, ohlc.length-5);\r\n' +
			'for(var k=kmx-1; k>=0; k--) {\r\n');
	// pre postでは、高速処理が可能な組み込み関数を記述する。postはpineスクリプトの結果に対する処理を付加するときに利用
	var bufPre=[];	bufPre.push ('preFunc  = function(){\r\n');
	var bufPost=[];	bufPost.push('postFunc = function(){\r\n');
	var bufP=[];	bufP.push('gCanvasHeight={h};\r\nplotFunc = function(){\r\n  gCanvasHeight={h};\r\n');
	var constVar={};

	$("#genie").val(''); //エラー出力先をクリア
	var pineScript = study[studyName]? study[studyName]: $("#scriptTxt").val();
	ps = pineScript.replace(/\r/g,'').split('\n');
	for (var i=0; i<ps.length; i++){
		iLine = ps[i].trim();
		if(iLine=='') continue;
		if(iLine.indexOf('//')==0) continue;
		if(iLine.lastIndexOf('//')>=0) iLine = iLine.slice(0,iLine.lastIndexOf('//'));
		//constを最初に数値に置き換える
		Object.keys(constVar).forEach(function(varName){
			if( iLine.indexOf(varName)>=0 ) iLine = iLine.replace(eval('/'+varName+'/g'),constVar[varName]);
		});
		//toknize 下記の項目をデリミタとしてtokenに分離
		iLine = iLine.replace(/\t/g,' ').replace(/    /g,' ').replace(/  /g,' ').replace(/  /g,' '); //single space
		iLine = iLine.replace(/\+/g,' + ').replace(/\-/g,' - ').replace(/\*/g,' * ').replace(/\//g,' / ')
			.replace(/\(/g,' ( ').replace(/\)/g,' ) ').replace(/\[/g,' [ ').replace(/\]/g,' ] ')
			.replace(/=/g,' = ').replace(/>/g,' > ').replace(/</g,' < ').replace(/,/g,' , ').replace(/\?/g,' ? ')
			.replace(/&&/g,' && ').replace(/\|\|/g,' || ').replace(/!/g,' ! ');
		iLine = iLine.replace(/    /g,' ').replace(/  /g,' ').replace(/  /g,' '); //single space
		iLine = iLine.replace(/= =/g,'==').replace(/> =/g,'>=').replace(/< =/g,'<=').replace(/! =/g,'!='); //元に戻す
		token = iLine.trim().split(' ');
		if(token[0]=='') continue;
		//tokenに分離されたので
		//右辺にseriesデータを含む左辺変数を、seriesデータに登録
		//plotはprotFunc()へ、それ以外はstudyFunc()にまとめる
		//plotは単純変数のみとする
		if(token[1]=='=' && builInFunc[token[2]]){	//--- 組み込み関数
			//組み込み関数の変数名登録を行う
			//配列builtInFuncの第一変数は, sma(close,20)の場合の20のアーギュメントの番号2, stoRSIでは2,第2変数は'K','D'
			var ar = builInFunc[token[2]];
			var vNameBase = token[0]; 
			var vName;
			for(var ii=0; ii<ar.length; ii++){
				vName = vNameBase + ar[ii][1];
				if(!ohlcIx[vName])	{//未登録なら
					var allocatedIx = Object.keys(ohlcIx).length;
					ohlcIx[vName] = [ allocatedIx, 0];
                    eval(vName+'_=allocatedIx');
                }
			}
			if(ohlcIx[vName][1]<latestDT　|| latestDT==0) {	//全銘柄計算の最終時刻が古いか、0の場合,全銘柄計算を実行
				ohlcIx[vName][1] = latestDT;
				bufPre.push(token[2]);
				bufPre.push(token[3]);
				bufPre.push(getOhlcIx(token[4]));
				for(var j=5; j<token.length; j++){
					if(token[j]==')') //閉じカッコの前に変数名を付加
						bufPre.push(', "' + vNameBase + '"');
					bufPre.push(token[j]);
				}
				bufPre.push(';\r\n'); 
			}				
			for(var ii=0; ii<ar.length; ii++){
				vName = vNameBase + ar[ii][1];
				ohlcIx[vName][1] = latestDT;
			}

			continue;
		}else if(token[0]=='postuse' && token[2]=='=' && builInFunc[token[3]]){	//--- 組み込み関数
			//組み込み関数の変数名登録を行う
			//配列builtInFuncの第一変数は, sma(close,20)の場合の20のアーギュメントの番号2, stoRSIでは2,第2変数は'K','D'
			var ar = builInFunc[token[3]];
			var vNameBase = token[1]; 
			var vName;
			for(var ii=0; ii<ar.length; ii++){
				vName = vNameBase + ar[ii][1];
				if(!ohlcIx[vName])	{//未登録なら
					var allocatedIx = Object.keys(ohlcIx).length;
					ohlcIx[vName] = [ allocatedIx, 0];
                    eval(vName+'_=allocatedIx');
                }
			}
			if(ohlcIx[vName][1]<latestDT　|| latestDT==0) {	//全銘柄計算の最終時刻が古いか、0の場合,全銘柄計算を実行
				ohlcIx[vName][1] = latestDT;
				bufPost.push('  ' + token[3]);
				bufPost.push(token[4]);
				bufPost.push(getOhlcIx(token[5]));
				for(var j=6; j<token.length; j++) {
					if(token[j]==')') //閉じカッコの前に変数名を付加
						bufPost.push(', "' + vNameBase + '"');
					bufPost.push(token[j]);
				}
				bufPost.push(';\r\n'); 
			}
			for(var ii=0; ii<ar.length; ii++){
				vName = vNameBase + ar[ii][1];
				ohlcIx[vName][1] = latestDT;
			}

			continue;
		}else if(token[0]=='const' && token[2]=='='){	//--- コンスタント
			//Constant の変数名登録を行う
			//constantは、iLineの最初で置換するので、長めの文字列にしないとエラーが発生する
			var conVal = token[3];
			var vName = token[1];
			if(!constVar[vName])	{//未登録なら
				constVar[vName] = token[3];
			}
			continue;
		}else if(token[0]=='plot'){
			if(!ohlcIx[token[4]]){
				$("#genie").val('未定義エラー: '+token[4]+' --> ' + token.join(''));
			}
			bufP.push('  plotFunc_(');
			bufP.push(token[2]);
			bufP.push(token[3]);
//			bufP.push(getOhlcIx(token[4]));
			bufP.push(token[4]+'_');
			for(var j=5; j<token.length; j++) {
				bufP.push(token[j]);
			}
			bufP.push(';\r\n');
			maxPane = Math.max(maxPane,parseInt(token[2]));
			continue;
		}else if(token[0]=='histogram'){
			if(!ohlcIx[token[4]]){
				$("#genie").val('未定義エラー: '+token[4]+' --> ' + token.join(''));
			}
			bufP.push('  histogramFunc_(');
			bufP.push(token[2]);
			bufP.push(token[3]);
//			bufP.push(getOhlcIx(token[4]));
			bufP.push(token[4]+'_');
			for(var j=5; j<token.length; j++) {
				bufP.push(token[j]);
			}
			bufP.push(';\r\n');
			maxPane = Math.max(maxPane,parseInt(token[2]));
			continue;
		}else if(token[0]=='hline'){
			bufP.push('  hlineFunc_(');
			bufP.push(token[2]);
			bufP.push(token[3]);
			bufP.push(token[4]);
			for(var j=5; j<token.length; j++)
				bufP.push(token[j]);
			bufP.push(';\r\n'); 
			maxPane = Math.max(maxPane,parseInt(token[2]));
			continue;
		}else if(token[0]=='bgcolor'){
			bufP.push('  bgcolorFunc_(');
			bufP.push(token[2]);
			bufP.push(token[3]);
			bufP.push(getOhlcIx(token[4]));
			for(var j=5; j<token.length; j++)
				bufP.push(token[j]);
			bufP.push(';\r\n'); 
			maxPane = Math.max(maxPane,parseInt(token[2]));
			continue;
		}else if(token[2]=='input'){
			bufP.push(token[0] + '=');
			bufP.push(token[5] + '\r\n');
			continue;
		}else{
			if(token[1]=='='){ // 代入文
				//左辺の処理
				var selfIx;
				if(hasSeries(token)) { // 右辺にseries変数が含まれていれば、series変数
					var vName = token[0];
					vName = vName;
					if(!ohlcIx[vName]) {	//未登録なら
						var allocatedIx = Object.keys(ohlcIx).length;
						ohlcIx[vName] = [ allocatedIx, 0];
                        eval(vName+'_=allocatedIx');
					}
					if(ohlcIx[vName][1]>=latestDT　&& latestDT>0) 	//全銘柄計算の最終時刻なら再計算の必要が無いので,continueでスルー
						continue
					ohlcIx[vName][1] = latestDT;
					selfIx = funcSelfIx(vName);
					buf.push( '  ohlc[k]['+vName+'_]' );	//左辺の処理から
//					buf.push( '  ohlc[k]['+selfIx+']' );	//左辺の処理から
				}else
					buf.push( '  var '+token[0]);
				buf.push('=');
				//右辺の処理
				for(var ix = 2; ix<token.length; ix++){
					var tk = token[ix];
					if(ohlcIx[tk]) {	//ohlc
						buf.push('ohlc[k');
						if(token[ix+1]=='['){
							buf.push('+');
							buf.push(token[ix+2]);
							ix=ix+3;
						}
						buf.push(']');
						buf.push('['+tk+'_]');
					}else
						buf.push(tk);
				}
				buf.push(';\r\n');
			} 			
		}
	}
	buf.push('}};\r\n');
	bufP.push('}\r\n');
	bufPre.push('}\r\n');
	bufPost.push('}\r\n');
	
	//コンパイル
	try{
		eval(bufPre.join('').replace(/;;/g,';'));
	}catch(e){
		$("#genie").val('preFunc コンパイルエラー:  ' + e.message);
	}
	try{
		eval(bufPost.join('').replace(/;;/g,';'));
	}catch(e){
		$("#genie").val('postFunc コンパイルエラー:  ' + e.message);
	}
	try{
		console.log(buf.join('').replace(/;;/g,';'));   // test here
		eval(buf.join('').replace(/;;/g,';'));
	}catch(e){
		$("#genie").val('studyFunc コンパイルエラー:  ' + e.message );
	}
	try{
		eval(bufP.join('').replace(/{h}/g,''+(210 + 35*maxPane + 10)).replace(/;;/g,';'));
	}catch(e){
		$("#genie").val('plotFunc コンパイルエラー:  ' + e.message );		
	}
}
function getOhlcIx(word){
	if(!ohlcIx[word])  {//new
		ohlcIx[word] = [ Object.keys(ohlcIx).length, 0];
        eval(word+"_=ohlcIx[word][0]");
    }
	return eval(word+'_');
}

function hasSeries(token){
	for(i=1; i<token.length; i++) {
		if(ohlcIx[token[i]]) return true;
		if(builInFunc[token[i]]) return true;
	}
	return false;
}
// error が発生した場合、この関数を実行すると、原因がわかる
function errCheck(){
	preFunc();
	studyFunc();
	postFunc();
	plotFunc();
}
//=====
