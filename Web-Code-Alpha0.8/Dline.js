/* 喵了个大咪的 Sqlite在JS没有个好的应用方式
    只能聊天记录用Sqlite了
    而剧本只能json了...不能太多，多了效率跟不上...
    /home/bxv/.config/google-chrome/Default/databases/http_127.0.0.1_5500/
*/
//localStorage.removeItem("Story")
//Dline.js
var Debug = 0
$("#Activity_Set").hide()
$("#Activity_Space").hide()
var Options_A_Jump_ID,Options_B_Jump_ID,op1,op2,SWait_Time,Message_Type,SContent
var SNode_ID,SLast_Time
var PMessageID
var StoryLink,SpaceLog
var El_ChatRoom = document.getElementById('ChatRoom')
El_ChatRoom.innerHTML=""
var Message_int3
var ChatHistory
SetOpinionState(3)
// let Worker1 = new Worker("./MessageDeal.js")
let Worker1 = new Worker(URL.createObjectURL(new Blob(["("+MessageDeal.toString()+")()"], {type: 'text/javascript'})));
Worker1.onmessage = function(e){
  switch(e.data[0]){
    case 1://AddChatMessage
      console.log(e.data[2]+"A")
      localStorage.setItem("SNode_ID",e.data[2])
      localStorage.setItem("SLast_Time",e.data[3])
      AddChatMessage(e.data[1])
    break
    case 2://SetChatOpinion
      SetOpinionState(1)
      document.getElementById("OpinionA").innerHTML = e.data[1]
      document.getElementById("OpinionB").innerHTML = e.data[2]
    break
    case 3://AddSpaceLog
      AddSpaceLog(e.data[1])
    break
    case 4://Set innerHtml
      $("#" + e.data[1]).text(e.data[2])
    break
    case 5://Set css
      $("#" + e.data[1]).css(e.data[2],e.data[3])
    break
    case 6://Set UserName
      SetUserName(e.data[1])
    break
    case 7://Set UserAvatar
      SetAvatar(e.data[1])
    break
    case 8://Set SpaceIntroduction
      SetSpaceIntroduction(e.data[1])
    break
  }
}
main()
//Click
function main(){
  var Story = localStorage.getItem('Story')
  var initialization = 1
  if(Debug == 0){
    SNode_ID = localStorage.getItem("SNode_ID")
    SLast_Time = localStorage.getItem("SLast_Time")
    PMessageID = localStorage.getItem("PMessageID")
    ChatHistory = localStorage.getItem("ChatHistory")
    StoryLink = localStorage.getItem("StoryLink")
    SpaceLog = localStorage.getItem("SpaceLog")
  }else{
    Story = null
    StoryLink = "./src/Story.json"
  }
  if(SNode_ID == null){
    SNode_ID = 0
  }
  if(SLast_Time == null){
    var date = new Date
    SLast_Time = date.getTime()
  }
  if(PMessageID == null){
    PMessageID = 0
  }
  if(Story == null){
    if(StoryLink == "Local" || StoryLink == null){
      AddChatMessage(GenerateChatMessage(6,"未检测到通行证",GetMessageData_NOW()))
      return
    }else{
      AddChatMessage(GenerateChatMessage(6,"时空拟合系统启动..",GetMessageData_NOW()))
      GetStoryFromURL(StoryLink)
    }
  }else{
    if(ChatHistory != null){
      El_ChatRoom.innerHTML = ChatHistory
      initialization = 0
    }
    if(SpaceLog != null){
      document.getElementById('Space_LogBox').innerHTML = SpaceLog
    }
    Worker1.postMessage([1,Story,SLast_Time,initialization])//初始化
    //加载当前选项
    LoadStoryMessage()
  }
}
function Click_OpinionA(){
  SetOpinionState(0)
  Worker1.postMessage([3,1])//选项按下
}
function Click_OpinionB(){
  SetOpinionState(0)
  Worker1.postMessage([3,2])
}
function Click_Menu(){
  $("#Set_Box_LinkInput").val("")
  $("#Set_Box_LinkInput").attr("placeholder", "PassCard")
  $("#Activity_Chat").hide()
  $("#Activity_Set").show()
}
function Click_Return_Set(){
  $("#Activity_Set").hide()
  $("#Activity_Chat").show()
}
function Click_Avatar(){
  $("#Activity_Chat").hide()
  $("#Activity_Space").show()
}
function Click_Return_Space(){
  $("#Activity_Space").hide()
  $("#Activity_Chat").show()
}
function Click_PassCard_Upload_Button(){
  $("#PassCard_Upload").click();
}
function PassCard_Upload(){
  files = $("#PassCard_Upload").get(0).files[0];
  if(files){
      if(files.size>0){
        var reader = new FileReader()
        reader.readAsText(files,'utf-8')
        reader.onload = function(){
          if(reader.result != null){
            var date = new Date
            localStorage.setItem("StoryLink","Local")
            localStorage.setItem("Story",reader.result)
            localStorage.setItem("SNode_ID",0)
            SNode_ID = 0
            localStorage.setItem("SLast_Time",date.getTime())
            SLast_Time = date.getTime()
            localStorage.setItem("PMessageID",0)
            PMessageID = 0
            localStorage.setItem("ChatHistory",null)
            ChatHistory = null
            localStorage.setItem("SpaceLog",null)
            SpaceLog = null
            El_ChatRoom.innerHTML=""
            SetOpinionState(3)
            Worker1.postMessage([1,reader.result,SLast_Time,1])
            AddChatMessage(GenerateChatMessage(6,"时空拟合系统启动..",GetMessageData_NOW()))
            AddChatMessage(GenerateChatMessage(6,"拟合时空隧道已建立",GetMessageData_NOW()))
            LoadStoryMessage()
            $("#Set_Box_LinkInput").val("")
            $("#Set_Box_LinkInput").attr("placeholder", "时空通行证已变更")
            
          }
        }
      }
  }
}
function Click_PassCard_LinkChange_Button(){
  //./src/Story.json
  var Link = $("#Set_Box_LinkInput").val()
  if(Link == null || Link.length == 0){
    $("#Set_Box_LinkInput").attr("placeholder", "PassCard不能为空")
  }else{
    var date = new Date
    localStorage.setItem("StoryLink",Link)
    localStorage.setItem("Story",null)
    localStorage.setItem("SNode_ID",0)
    SNode_ID = 0
    localStorage.setItem("SLast_Time",date.getTime())
    localStorage.setItem("PMessageID",0)
    PMessageID = 0
    localStorage.setItem("ChatHistory",null)
    ChatHistory = null
    localStorage.setItem("SpaceLog",null)
    SpaceLog = null
    El_ChatRoom.innerHTML=""
    SetOpinionState(3)
    GetStoryFromURL(Link)
    $("#Set_Box_LinkInput").val("")
    $("#Set_Box_LinkInput").attr("placeholder", "时空通行证已变更")
  }
}
//从URL读取剧本并set
function GetStoryFromURL(file_url) {
  let xhr = new XMLHttpRequest();
  xhr.open("get", file_url, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    if (this.status == 200) {
      const reader = new FileReader()
      reader.onload = function () {
          if(reader.result != null){
              var date = new Date
              localStorage.setItem("Story",reader.result)
              Worker1.postMessage([1,reader.result,date.getTime(),1])
              AddChatMessage(GenerateChatMessage(6,"时空隧道已建立",GetMessageData_NOW()))
              LoadStoryMessage()
              //调用Story reload函数
          }
      }
      reader.readAsText(this.response)
    }else{
      AddChatMessage(GenerateChatMessage(6,"时空通行证错误",GetMessageData_NOW()))
    }
  };
  try {
    xhr.send()
  } catch (error) {
    AddChatMessage(GenerateChatMessage(6,"时空通行证错误",GetMessageData_NOW()))
  }
}
function LoadStoryMessage(){
  Worker1.postMessage([2,SNode_ID])//加载记录
}
function SetOpinionState(type){
  if(type == 0){//隐藏
    document.getElementById("ChatRoom").style.height="calc(100% - 120px)"//calc(100% - 200px - 120px)
    $('#Chat_OpinionBox').animate({
      height: "0px"
    }, 200);
  }
  if(type == 1){//显示
    document.getElementById("ChatRoom").style.height="calc(100% - 200px - 120px)"//calc(100% - 200px - 120px)
    $('#Chat_OpinionBox').animate({
      height: "200px"
    }, 500);
  }
  if(type == 3){//强制隐藏
    document.getElementById("ChatRoom").style.height="calc(100% - 120px)"//calc(100% - 200px - 120px)
    document.getElementById("Chat_OpinionBox").style.height="0px"//200px
  }
  $('#ChatRoom').animate({
    scrollTop: El_ChatRoom.scrollHeight
  }, 500);
}

function AddChatMessage(content){
  content = content.replace("ChatMessageID","ChatMessageID_" + ++PMessageID)
  $("#ChatRoom").append(content)
  $('#ChatRoom').animate({
    scrollTop: El_ChatRoom.scrollHeight
  }, 500);
  try{if(ChatHistory.length >= 1024*1024*3){ChatHistory = null}}catch(err){} //聊天记录过多，硬清除（懒得做动态清理了...）
  if(ChatHistory == null){ChatHistory = content}else(ChatHistory += content)
  localStorage.setItem("PMessageID",PMessageID)
  localStorage.setItem("ChatHistory",ChatHistory)
}
function AddSpaceLog(content){
  $("#Space_LogBox").before(content)
  // document.getElementById('Space_ContentBox').scrollTop = "0px"
  try{if(SpaceLog.length >= 1048576){SpaceLog = null}}catch(err){} //硬清除（懒得做动态清理了...）
  if(SpaceLog == null){SpaceLog = content}else(SpaceLog += content)
  localStorage.setItem("SpaceLog",SpaceLog)
}
function GetMessageData_NOW(){
  var date = new Date()
  var year = date.getFullYear()    //  返回的是年份
  var month = date.getMonth() + 1  //  返回的月份上个月的月份，记得+1才是当月
  var dates = date.getDate()       //  返回的是几号
  var day = date.getDay()          //  周一返回的是1，周六是6，但是周日是0
  var hours = date.getHours()
  var minutes = date.getMinutes()
  if(minutes<9){minutes = "0" + minutes}
  return(month + "/" + dates + " " + hours + ":" + minutes)
}
function GenerateChatMessage(type,content,send_date){
  var message
  if(type == null || type == 0){type = 1}

  switch(type){
      case 1://other
      message = `
      <div class="message_row other-message">
      <div class="message-content">
      <div class="message-text" id="ChatMessageID">` + content + `</div>
      <div class="message-time">` + send_date + `</div>
      </div>
      </div>
      `
      break
      case 2: //self
      message = `
      <div class="message_row you-message">
      <div class="message-content">
      <div class="message-text" id="ChatMessageID">` + content + `</div>
      <div class="message-time">` + send_date + `</div>
      </div>
      </div>
      `
      break
      case 3://other photo
      message = `
      <div class="message_row other-message">
      <div class="message-content">
      <img class="me_photo" src="` + content + `" alt="" id="ChatMessageID">
      <div class="message-time">` + send_date + `</div>
      </div>
      </div>
      `
      break
      case 4://self photo
      message = `
      <div class="message_row you-message">
      <div class="message-content">
      <img class="me_photo" src="` + content + `" alt="" id="ChatMessageID">
      <div class="message-time">` + send_date + `</div>
      </div>
      </div>
      `
      break
      case 5://动态

      break
      case 6://System
      message = `
      <div class="System-message-text" id="ChatMessageID">` + content + `</div>
      `
      break
  }
  return(message)
}
function SetAvatar(AvatarPatch){
  // 推荐640*640
  $("#Chat_Avatar").attr("src", AvatarPatch)
  $("#Space_Avatar").attr("src", AvatarPatch)
}
function SetUserName(Name){
  $("#Chat_Header_Name").text(Name)
  $("#Space_Name").text(Name)
}
function SetSpaceIntroduction(Introduction){
  $("#Space_Introduction").text(Introduction)
}
//Dline.js
function MessageDeal(){
  // debugger
  //MessageDeal.js
  // 这不能用那不能用的，worker真麻烦
  var MessageWaitMultiple = 1 //1ms 1000s
  var obj,date
  var Story,SNode_ID
  var SLast_Time = 0
  var Options_A_Jump_ID,Options_B_Jump_ID,op1,op2,SWait_Time
  var SUserName,SAvatar,SUserIntroduction
  var initialization = 0
  this.addEventListener("message",function MessageDeal(e){
      switch(e.data[0])
      {
        case 1://初始化
            Story = e.data[1]
            SLast_Time = parseInt(e.data[2])
            initialization = e.data[3]
            try{
              obj = JSON.parse(Story)
            }catch(err){
              AddChatMessage(6,"时空通行证错误")
              return
            }
            if(obj == null){
              return
            }
            if((["Info"] in obj) == false){
              AddChatMessage(6,"读取用户信息错误")
              return
            }
            if(([0] in obj["Info"]) == false){
              AddChatMessage(6,"读取用户信息错误")
              return
            }
            if((["UserAvatar"] in obj["Info"][0]) == true){
              SAvatar = obj["Info"][0]["UserAvatar"]
              if(SAvatar != null && SAvatar != ""){
                postMessage([7,SAvatar])
              }
            }
            if((["UserName"] in obj["Info"][0]) == true){
              SUserName = obj["Info"][0]["UserName"]
              if(SUserName != null && SUserName != ""){
                postMessage([6,SUserName])
              }
            }
            if((["UserIntroduction"] in obj["Info"][0]) == true){
              SUserIntroduction = obj["Info"][0]["UserIntroduction"]
              if(SUserIntroduction != null && SUserIntroduction != ""){
                postMessage([8,SUserIntroduction])
              }
            }
            if((["MessageWaitMultiple"] in obj["Info"][0]) == true){
              MessageWaitMultiple = obj["Info"][0]["MessageWaitMultiple"]
              if(MessageWaitMultiple == null || MessageWaitMultiple <= 0){
                MessageWaitMultiple = 1
              }
            }
        break
        case 2://加载记录
        console.log(e.data[1])
            SNode_ID = parseInt(e.data[1])
            if(SNode_ID != null){
                do{
                  if(obj == null){
                    return
                  }
                  if((["RECORDS"] in obj) == false){
                    AddChatMessage(6,"时空通行证错误",GetMessageData_NOW())
                    return
                  }
                  if(([SNode_ID] in obj["RECORDS"]) == false){
                    AddChatMessage(6,"时空通行证错误",GetMessageData_NOW())
                    return
                  }
                  if((["Options_A"] in obj["RECORDS"][SNode_ID]) == true){
                    op1 = obj["RECORDS"][SNode_ID]["Options_A"]
                  }else{
                    op1 = null
                  }
                  if((["Options_B"] in obj["RECORDS"][SNode_ID]) == true){
                    op2 = obj["RECORDS"][SNode_ID]["Options_B"]
                  }else{
                    op2 = null
                  }
                  if((["Options_A_Jump_ID"] in obj["RECORDS"][SNode_ID]) == true){
                    Options_A_Jump_ID = obj["RECORDS"][SNode_ID]["Options_A_Jump_ID"] - 1
                  }else{
                    Options_A_Jump_ID = -1
                  }
                  if((["Options_B_Jump_ID"] in obj["RECORDS"][SNode_ID]) == true){
                    Options_B_Jump_ID = obj["RECORDS"][SNode_ID]["Options_B_Jump_ID"] - 1
                  }else{
                    Options_B_Jump_ID = -1
                  }
                  if((["WaitTime"] in obj["RECORDS"][SNode_ID]) == true){
                    SWait_Time = obj["RECORDS"][SNode_ID]["WaitTime"]
                  }else{
                    SWait_Time = 0
                  }
                  if((["Message_Type"] in obj["RECORDS"][SNode_ID]) == true){
                    Message_Type = obj["RECORDS"][SNode_ID]["Message_Type"]
                  }else{
                    Message_Type = 1
                  }
                  if((["Node_Content"] in obj["RECORDS"][SNode_ID]) == true){
                    SContent = obj["RECORDS"][SNode_ID]["Node_Content"]
                  }else{
                    SContent = ""
                  }
                  if(SWait_Time*MessageWaitMultiple <= 180000){
                    //180000ms = 3min
                    postMessage([4,"Chat_Header_State","在线"])
                    postMessage([5,"Chat_Header_State","color","rgb(62, 114, 252)"])//离线 rgb(206,202,195) | 在线 对方正在输入 rgb(62, 114, 252)
                  }else{
                    postMessage([4,"Chat_Header_State","离线"])
                    postMessage([5,"Chat_Header_State","color","rgb(206,202,195)"])//离线 rgb(206,202,195) | 在线 对方正在输入 rgb(62, 114, 252)
                  }
                  if(Message_Type == 7){
                    SNode_ID = undefined
                    date = new Date
                    SLast_Time = date.getTime()
                    AddChatMessage(6,"时空通行证已过期",GetMessageData_NOW(),SNode_ID,SLast_Time)
                    return
                  }
                  if(SNode_ID != 0 && initialization == 0){
                    initialization = 1
                  }else{
                    do{
                      date = new Date
                      continue
                    }while(SLast_Time + SWait_Time*MessageWaitMultiple > date.getTime())//date.getTime()
                    date = new Date
                    SLast_Time = date.getTime()
                    AddChatMessage(Message_Type,SContent,GetMessageData_NOW(),SNode_ID,SLast_Time)
                  }
                  if(op1 == null && op2 != null){
                    op1 = op2
                  }
                  if(op1 != null && op2 == null){
                    op2 = op1
                  }
                  if(Options_A_Jump_ID == null && Options_B_Jump_ID != null){
                      Options_B_Jump_ID = Options_A_Jump_ID
                  }
                  if(Options_A_Jump_ID != null && Options_B_Jump_ID == null){
                      Options_A_Jump_ID = Options_B_Jump_ID
                  }

                  if(op1 == null && op2 == null){ 
                  if(Options_A_Jump_ID != -1){
                      SNode_ID = Options_A_Jump_ID
                      continue
                  }
                  else{
                      if(Options_B_Jump_ID != -1){
                          SNode_ID = Options_B_Jump_ID
                          continue
                      }
                      else{
                          SNode_ID++
                          Options_A_Jump_ID = SNode_ID
                          Options_B_Jump_ID = SNode_ID
                      }
                  }
                  }else{
                    if(Options_A_Jump_ID == -1 && Options_B_Jump_ID == -1 || Options_A_Jump_ID == null && Options_B_Jump_ID == null){
                      SNode_ID++
                      Options_A_Jump_ID = SNode_ID
                      Options_B_Jump_ID = SNode_ID
                    }
                    break
                  }
                }while(true)
                SetChatOpinion(op1,op2)
            }
        break
        case 3://选项按下
            if(e.data[1] == 1){
                //A
                SNode_ID = Options_A_Jump_ID
                AddChatMessage(2,op1,GetMessageData_NOW(),SNode_ID,SLast_Time)
            }
            else{
                //B
                SNode_ID = Options_B_Jump_ID
                AddChatMessage(2,op2,GetMessageData_NOW(),SNode_ID,SLast_Time)
            }
            MessageDeal({"data":[2,SNode_ID]})
        break
      }
  })

  function GetMessageData_NOW(){
      var date = new Date()
      var year = date.getFullYear()    //  返回的是年份
      var month = date.getMonth() + 1  //  返回的月份上个月的月份，记得+1才是当月
      var dates = date.getDate()       //  返回的是几号
      var day = date.getDay()          //  周一返回的是1，周六是6，但是周日是0
      var hours = date.getHours()
      var minutes = date.getMinutes()
      if(minutes<9){minutes = "0" + minutes}
      return(month + "/" + dates + " " + hours + ":" + minutes)
  }
  function AddChatMessage(type,content,send_date,Node_ID,Last_Time){
      var message
      if(type == null || type == 0){type = 1}
      switch(type){
          case 1://other
          message = `
          <div class="message_row other-message">
          <div class="message-content">
          <div class="message-text" id="ChatMessageID">` + content + `</div>
          <div class="message-time">` + send_date + `</div>
          </div>
          </div>
          `
          break
          case 2: //self
          message = `
          <div class="message_row you-message">
          <div class="message-content">
          <div class="message-text" id="ChatMessageID">` + content + `</div>
          <div class="message-time">` + send_date + `</div>
          </div>
          </div>
          `
          break
          case 3://other photo
          message = `
          <div class="message_row other-message">
          <div class="message-content">
          <img class="me_photo" src="` + content + `" alt="" id="ChatMessageID">
          <div class="message-time">` + send_date + `</div>
          </div>
          </div>
          `
          break
          case 4://self photo
          message = `
          <div class="message_row you-message">
          <div class="message-content">
          <img class="me_photo" src="` + content + `" alt="" id="ChatMessageID">
          <div class="message-time">` + send_date + `</div>
          </div>
          </div>
          `
          break
          case 5://动态
          var imgLink
          if(content.indexOf(`[img]`) != -1){
            imgLink = content.slice(content.indexOf(`[img]`) + 5 )
            content = content.slice(0,content.indexOf(`[img]`))
          }
          
          message = `
          <div class="Space_Log">
          <div class="Content">` + content + `</div>`
          if(imgLink != null && imgLink != ""){
            message += `<img src="` + imgLink + `">`
          }
          message +=
          `
          <div class="date"> — ` + send_date + `</div>
          </div>
          <hr>
          `
          postMessage([3,message,Node_ID,Last_Time])
          message = `
          <div class="System-message-text" id="ChatMessageID">` + "对方发布了新动态" + `</div>
          `
          break
          case 6://System
          message = `
          <div class="System-message-text" id="ChatMessageID">` + content + `</div>
          `
          break
      }
      postMessage([1,message,Node_ID,Last_Time])
  }
  function SetChatOpinion(Top1,Top2){
      postMessage([2,Top1,Top2])
  }
  //MessageDeal.js
}