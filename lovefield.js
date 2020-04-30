//lovefield 仕様　===> https://github.com/google/lovefield/tree/master/docs/spec

//===============================================
// lovefieldのschemabuilderのソースを、SQLの形式のcolumnsDefinitionから作成する
//===============================================
/*  lfType*/
//  ARRAY_BUFFER,  BOOLEAN,  DATE_TIME,  INTEGER,  NUMBER,  STRING,  OBJECT;
// データベースを作成
var dbName= 'hist';
var lfDb, lfTbl; // DBとスキーマを退避するための変数
var schemaBuilder;

function lfOpen(dbName) {
    return new Promise(resolve => {
        // console.time("lfOpen");    
        schemaBuilder = lf.schema.create(dbName, 1);
        schemaBuilder.createTable('W1')
            .addColumn("id",  lf.Type.INTEGER)
            .addColumn("obj", lf.Type.OBJECT)
            .addPrimaryKey(["id"])  ;
        schemaBuilder.createTable('D1')
            .addColumn("id",  lf.Type.INTEGER)
            .addColumn("obj", lf.Type.OBJECT)
            .addPrimaryKey(["id"])  ;
        schemaBuilder.createTable('H1')
            .addColumn("id",  lf.Type.INTEGER)
            .addColumn("obj", lf.Type.OBJECT)
            .addPrimaryKey(["id"])  ;
        schemaBuilder.createTable('m15')
            .addColumn("id",  lf.Type.INTEGER)
            .addColumn("obj", lf.Type.OBJECT)
            .addPrimaryKey(["id"])  ;
        schemaBuilder.connect().then(function(thisDb) {     // 接続に成功したときの処理を書く
            lfDb = thisDb;                     // DBが存在しない場合はここで作成される
            resolve(resolve);
        });
    });
}
// @timeFrame: 'D1'
function lf2hist(timeFrame){
    popupGenie('lf2hist-'+timeFrame);
    return new Promise(resolve => {
        lfTbl = lfDb.getSchema().table(timeFrame);   // lfTbl テーブルのスキーマ情報取得(同期)
        lfDb.select().from(lfTbl).exec()   /*SELECT文実行結果をPromiseで返す*/
            .then(function(rows) {
                if(hist==undefined) hist={};
                hist[timeFrame] = [];
                rows.forEach(function(row) {
                    hist[timeFrame]= row.obj ;
                });
            resolve(resolve);
        });
    });
}

async function hist2lf(timeFrame) {
    console.time("loop time");
    lfTbl = lfDb.getSchema().table(timeFrame);   // table名=timeFrame
    var row = lfTbl.createRow({id:0, obj:hist[timeFrame]});
    lfDb.insertOrReplace().into(lfTbl).values([row]).exec();
    console.timeEnd("loop time");
}

//動作確認済み
// @ tf: 'D1'
async function test(tf){
// console.log('1');
    await lfOpen('hist','D1');
// console.log('2');
    await lf2hist();
// console.log('3');
}




// function lfCreate(ar) {       
    // // lovefieldでは生のObjectを直接登録はできない
    // // createRow関数でRowオブジェクトを生成してこれを登録する
    // var row = lfTbl.createRow({co:ar[0], t:ar[1], ohlc:ar.slice(2)});
    // var query = lfDb.insertOrReplace().into(lfTbl).values([row]);   // INSERT OR REPLACE INTO lfTbl VALUES row;
    // //console.log(query.toSql()); // 実行されるSQLを確認できる
    // query.exec();    // クエリ実行(非同期処理でPromiseを返す)
// }

// function lfRead(code) {   
    // // SELECT * FROM lfTbl WHERE lfTbl.co == 7203 ORDER lfTbl.t BY DESC;
    // // lfDb.select().from(lfTbl).where(lfTbl.co.eq(code)).orderBy(lfTbl.t, lf.Order.DESC).exec()   /*SELECT文実行結果をPromiseで返す*/
        // // .then(function(rows) {
    // // console.time("loop time");
            // // rows.forEach(function(row) {
                // // console.log( [row.co, row.t].concat(row.ohlc) );
            // // });
    // // console.timeEnd("loop time");
    // // });
// }

// function lfUpdate() {   
    // // lfDb.update(lfTbl).set(lfTbl.o, 1234).where(lfTbl.co.eq(7203)).exec(); 
// }

// function lfDelete(code) {   
    // // lfDb.delete().from(lfTbl).where(lfTbl.co.eq(code)).exec();
// }

//========================================
//========================================
//========================================


//Google Spreadsheetからデータを取得
//lfに登録されている最終日を調べ
//この日付以降のデータをDL
//日付をUTC秒に変換してhistにセット
//hist2lfで保存
