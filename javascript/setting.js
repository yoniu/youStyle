/*
  模板设置页 - jQuery + ES6
  Author: https://www.200011.net
  Date  : 2021.09.12
*/
function deleteFriend(key){
  // 删除友链
  $(`.friend-setting-item[data-key=${key}]`).remove();
}
$(document).ready(() => {
  //判断是否存在模板设置
  if($('ul[class*="option-base"').length > 0){
    //定义模板设置导航
    const optionCallback = `<a href="${blogUrl}admin">返回</a>`,
      optionBase = '<a class="current" href="javascript:;" data-url="base-option">基本设置</a>',
      optionList = '<a href="javascript:;" data-url="list-option">列表设置</a>',
      optionSpeed = '<a href="javascript:;" data-url="speed-option">加速设置</a>',
      optionSidebar = '<a href="javascript:;" data-url="sidebar-option">侧栏设置</a>',
      optionDiy = '<a href="javascript:;" data-url="diy-option">自定义设置</a>',
      optionAbout = '<a href="javascript:;" data-url="about-option">关于</a>',
      optionSiteUrl = `<a href="${blogUrl}" target="_blank">站点首页</a>`;
    //渲染模板设置
    $('div[role="form"]')
      .addClass('option-container')
      .prepend(`
        <div class="route-link">
        ${optionCallback}
        ${optionBase}
        ${optionList}
        ${optionSpeed}
        ${optionSidebar}
        ${optionDiy}
        ${optionAbout}
        ${optionSiteUrl}
        </div>
      `)
      .prepend(`
        <div class="theme-carsoul">
          <h2>youStyle<span>${themeVersion}</span></h2>
        </div>
      `);
    $('ul[class~="option-base"]').wrapAll('<div class="base-option option-item-container current"></div>');
    $('ul[class~="option-list"]').wrapAll('<div class="list-option option-item-container"></div>');
    $('ul[class~="option-speed"]').wrapAll('<div class="speed-option option-item-container"></div>');
    $('ul[class~="option-sidebar"]').wrapAll('<div class="sidebar-option option-item-container"></div>');
    $('ul[class~="option-diy"]').wrapAll('<div class="diy-option option-item-container"></div>');
    $('form').prepend('<div class="about-option option-item-container"></div>');
    $.ajax({
      type: 'get',
      url: 'https://cdn.jsdelivr.net/gh/yoniu/youstyle@master/UPDATE.md',
      dataType: 'text',
      success: function(e){
        const converter = new showdown.Converter(),
              html      = converter.makeHtml(e);
        $('.about-option').html(html);
      },
      error: function(){
        $('.about-option').html('<h3>获取信息失败</h3>');
      }
    });
    // 切换页面
    $('.route-link a[data-url]').click(function(){
      const url = '.' + $(this).data('url');
      $('.option-container .route-link a.current').removeClass('current');
      $(this).addClass('current');
      $('.option-container .option-item-container.current').removeClass('current');
      $(url).addClass('current');
    });
    // 友链快速设置
    $('#friendEasygoing').click(function(){
      const friendTextarea = $('textarea[name=friends]').val(); // 获取友链textarea的文本
      const friendArray = friendTextarea.split('\n'); 
      const friendList = friendArray.map((value) => { // 获取友链列表
        const thisFriend = value.split('+');
        return {
          name: thisFriend[0],
          description: thisFriend[2],
          url: thisFriend[1],
          showIndex: thisFriend[3],
          avatar: thisFriend[4]
        };
      });
      let friendEcho = ''; // 获取友链列表转html
      friendList.forEach((item, index)=>{
        friendEcho += `
          <div class="friend-setting-item" data-key="${index}">
            <input name="name" type="text" value="${item.name ? item.name : ''}" placeholder="名称" />
            <input name="description" type="text" value="${item.description ? item.description : ''}" placeholder="描述" />
            <input name="url" type="text" value="${item.url ? item.url : ''}" placeholder="链接" />
            <input name="avatar" type="text" value="${item.avatar ? item.avatar : ''}" placeholder="图标链接" />
            <select name="showIndex">
              <option value="false">首页不显示</option>
              <option value="true">首页显示</option>
            </select>
            <a href="javascript: deleteFriend('${index}');" class="delete-friend">删除</a>
          </div>
        `;
      })
      // 渲染快速输入
      $('body').append(`
        <div id="friend-setting">
          <div class="friend-setting-container">
            <div class="friend-setting-title"><b>友链设置</b></div>
            <div class="friend-setting-list">
              ${friendEcho}
            </div>
            <div class="friend-setting-save">
              <a class="friend-setting-add-button" href="javascript:;">添加</a>
              <a class="friend-setting-save-button" href="JavaScript:;">保存</a>
              <a class="friend-setting-exit-button" href="JavaScript:;">关闭</a>
            </div>
          </div>
        </div>
      `);
      $('.friend-setting-item[data-key]').each(function() {
        // ${item.showIndex}的值是undefined，只能用这个方法了。
        const index = $(this).data('key');
        $(this).find('select[name=showIndex]').val(friendList[index].showIndex);
      });
      $('.friend-setting-add-button').click(function() { // 添加事件
        const friendLength = $('.friend-setting-item').length;
        $('.friend-setting-list').append(`
          <div class="friend-setting-item" data-key="${friendLength}">
            <input name="name" type="text" placeholder="名称" />
            <input name="description" type="text" placeholder="描述" />
            <input name="url" type="text" placeholder="链接" />
            <input name="avatar" type="text" placeholder="图标链接" />
            <select name="showIndex" value="true">
              <option value="false">首页不显示</option>
              <option value="true">首页显示</option>
            </select>
            <a href="javascript: deleteFriend('${friendLength}');" class="delete-friend">删除</a>
          </div>
        `);
      });
      $('.friend-setting-exit-button').click(function() { // 关闭事件
        $('#friend-setting').remove();
      });
      $('.friend-setting-save-button').click(function() { // 保存事件
        let result = [];
        $('.friend-setting-item').each(function() {
          let myArray = [];
          const name = $(this).find('[name=name]').val();
          const description = $(this).find('[name=description]').val();
          const url = $(this).find('[name=url]').val();
          const avatar = $(this).find('[name=avatar]').val();
          const showIndex = $(this).find('[name=showIndex]').val();
          if(description){
            myArray.push(name, url, description, showIndex, avatar);
            result.push(myArray.join('+'));
          }else{
            myArray.push(name);
            result.push(myArray);
          }
        });
        $('textarea[name=friends]').val(result.join('\n'));
        $('#friend-setting').remove();
      });
      return false;
    });
  }
});