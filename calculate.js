//表單變數
var googleFormID = "1syKUd5c8far8Y8aN1puByhAvkvr6rak7mMzkg7lHs7E";
function FormResponse(){
  // 通過ID打開一個表單，並記錄對每個問題的回答。
  var form = FormApp.openById(googleFormID);//取得表單
  var formResponses = form.getResponses();//得到所有回應
    
  //---- 所有回應
  for (var i = 0; i < formResponses.length; i++) {
    var formResponse = formResponses[i];//每一筆回應
    var itemResponses = formResponse.getItemResponses();//回應內容
    var formResponseTime = formResponse.getTimestamp();//時間戳記    
//    var formRespondentEmail = formResponse.getRespondentEmail();//取得表單上「電子郵件地址」
        
    //----宣告試算表每列變數----
    var rowdata = {};  
    var total = 0;  
      
    //其他自訂欄位(前)
    //rowdata["填報標題"] = "";//填報標題  
    rowdata["時間戳記"] = formResponseTime;//表單回應時間
    //rowdata['電子郵件地址'] = formRespondentEmail; //電子郵件地址
      
    //----取得單筆回應資料
    for (var j = 0; j < itemResponses.length; j++) {
      var itemResponse = itemResponses[j];      
      var title = itemResponse.getItem().getTitle();//問題名稱
      var value = itemResponse.getResponse();//填報內容
      rowdata[title] = value;
      //時間戳記	桌號	雞腿飯-90元	雞排飯-80元	排骨飯-70元	招牌飯-60元	備註
      if (title == "雞腿飯-90元"||title=="雞排飯-80元"||title=="排骨飯-70元"||title=="招牌飯-60元"){
        var subTotal = title.split("-");
        total += parseInt(subTotal[1])*value;
      }

    }
    //其他自訂欄位(尾)
    //----單筆回應資料end  
      rowdata['合計'] = total;
      
    //----單筆要做的事情
    sendToLine(rowdata);//LineNotify通知
    //----單筆要做的事情 end   
      
  }
  //刪除回應問題
  form.deleteAllResponses();
}  
  
//填入Line Notify 權杖
var lineToken = "X7hnGJyIJEGmRPUGFGrSrdEYIwoc6I1wDh7uIizgp7C";  
function sendToLine(rowdata){
  //整理   
  var message = "\n"; 
    
  for (var key in rowdata){
    message += key + " : " + rowdata[key] + "\n";
  }
  var options =
  {
      method  : "post",
      payload : "message=" + message,
      headers : {"Authorization" : "Bearer "+ lineToken},
      muteHttpExceptions : true
  };  
  
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify",options);
}