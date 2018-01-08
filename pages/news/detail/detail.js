//index.js
//获取应用实例
var Api = require('../../../utils/api.js');
var util = require('../../../utils/util.js');

Page({
  data: {
    title: '新闻详情',
    detail: {
      'item': null,
      'title': null,
      'src': null
    },
    hidden: false
  },
  onLoad: function (options) {
    this.fetchData(options.id);
  },
  fetchData: function (id) {
    id = id.replace("http","https");
    console.log(id);
    var self = this;
    self.setData({
      hidden: false
    });
    wx.request({
      url: Api.getNewsByUrl(id),
      success: function (res) {
        var arrContent = [];
        var tmpStr = res.data;
        var doSearch = true;//循环控制
        //object 获取整篇文章的图片和文字段落数量
        var allText = tmpStr.match(/(<p class="section txt">).*(?=\<\/p\>)/ig);
        var allImg = tmpStr.match(/<img width="100%" alt="" src(?:=[^{,},<,>]+)/ig);
        var allImgLen = 0;
        if (allImg !=null && allImg.length<=0){
           allImgLen = allImg.length;
        }
        var allContentNum = allText.length + allImgLen;

        // 获取新闻标题
        var title = tmpStr.match(/(<h1 class="title">).*(?=\<\/h1\>)/ig)[0].replace('<h1 class="title">', '');
        // 获取文章来源
        var srcInfo = tmpStr.match(/(<span class="src">).*(?=\<\/span\>)/ig)[0].replace('<span class="src">', '').replace('&nbsp;&nbsp;&nbsp;&nbsp;', ' ');

        var contentType = null;//接收内容的类型，文字或图片
        var text = {};
        var img = {};
        while (doSearch) {
          var tmpObj = {
            'type': null,
            'content': null
          };

          // 注：这里的正则表达式，跟上面的正则基本是一样的，只是在最后少一个g属性，加上g表示获取所有符合条件的数据，不加g表示获取第一个符合条件的数据
          // 截取文章中出现的第一个文字段落的信息
          text = tmpStr.match(/(<p class="section txt">).*(\<\/p\>)/i);
          // 获取文章中出现的第一张图片的信息
          img = tmpStr.match(/(<a class="img-wrap").*(\<\/a\>)/i);

          img = tmpStr.match(/<img width="100%" alt="" src(?:=[^{,},<,>]+)/ig);
          
          if (text != null && img != null) {

            //if (text.index > img.index) {//第一张图片出现的位置，小于第一段文字出现的位置，所以先显示图片
              contentType = 'text_img';
           
          } else if (text == null && img != null) {
            contentType = 'img';
          } else if (img == null && text != null) {
            contentType = 'text';
          } else {
            contentType = null;
          }

          if (contentType == 'text') {//文字
            text = tmpStr.match(/(<p class="section txt">).*(\<\/p\>)/i);//获取一段文字内容（对象类型）
            var content = text[0].substring(text[0].indexOf(">") + 1, text[0].lastIndexOf("</"));
            tmpObj.type = 'text';
            tmpObj.content = content;
            tmpObj.img = "";
            arrContent.push(tmpObj);
            tmpStr = tmpStr.substring(text.index + text[0].length, tmpStr.length);
          } else if (contentType == 'img') {//图片
            img = tmpStr.match(/(<a class="img-wrap").*(\<\/a\>)/i);
            img = tmpStr.match(/<img width="100%" alt="" src(?:=[^{,},<,>]+)/ig);
            // console.log(img);
            // 默认图片类型为jpg
            var imgType = 'jpeg';
            if (img[0].indexOf(".png") != -1) {
              imgType = 'png';
            } else if (img[0].indexOf(".gif") != -1) {
              imgType = 'gif';
            }
            var content = img[0].substring(img[0].indexOf("http"), img[0].indexOf(imgType) + imgType.length);
            tmpObj.type = 'img';
            tmpObj.content = "";
            tmpObj.img = content;
            arrContent.push(tmpObj);
           var  index = tmpStr.indexOf('</figure>');

            tmpStr = tmpStr.substring(index + 11, tmpStr.length);
          } else if (contentType == "text_img"){
            text = tmpStr.match(/(<p class="section txt">).*(\<\/p\>)/i);//获取一段文字内容（对象类型）
            var content = text[0].substring(text[0].indexOf(">") + 1, text[0].lastIndexOf("</"));
     

            img = tmpStr.match(/(<a class="img-wrap").*(\<\/a\>)/i);
            img = tmpStr.match(/<img width="100%" alt="" src(?:=[^{,},<,>]+)/ig);
            // console.log(img);
            // 默认图片类型为jpg
            var imgType = 'jpeg';
            if (img[0].indexOf(".png") != -1) {
              imgType = 'png';
            } else if (img[0].indexOf(".gif") != -1) {
              imgType = 'gif';
            }
            var  contentImg = img[0].substring(img[0].indexOf("http"), img[0].indexOf(imgType) + imgType.length);
   
            tmpObj.type = 'text_img';
            tmpObj.content = content;
            tmpObj.img = contentImg;
            arrContent.push(tmpObj);
            tmpStr = tmpStr.substring(index + 11, tmpStr.length);
           content = img[0].substring(img[0].indexOf("http"), img[0].indexOf(imgType) + imgType.length);

          }
          else{

            doSearch = false;
          }


          if (arrContent.length >= allContentNum) {
            doSearch = false;
          }

        }


        var DATA = {
          'title': title,
          'src': srcInfo,
          'item': arrContent
        }
        self.setData({
          detail: DATA
        });
        setTimeout(function () {
          self.setData({
            hidden: true
          });
        }, 300);
      }
    });
  }
})