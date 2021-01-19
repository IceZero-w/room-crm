## 项目介绍（环城建设合同管理）

```
项目地址：https://github.com/IceZero-w/room-crm.git
```

## 项目启动命令
```
1.git clone https://github.com/IceZero-w/room-crm.git (下载项目到本地)
2.cd room-crm (进入项目根目录)
3.npm install (安装依赖)
4.npm run dev (本地启动项目)

....控制台出现本地服务地址，复制到浏览器访问即可访问页面...

输入：
  手机号：18116449846
  密码：123456

（即可登陆系统！！！）
```

## 项目打包命令
```
1.npm run build:prod(会生成dist文件夹，放到域名服务器下即可)
```

## 项目隐藏彩蛋
```
.....本地起服务的时候，跨域的问题，前端帮你解决了....

1.如果需要更改接口访问域名的话，全局搜索下这个，把http://307m931w46.wicp.vip:31854替换掉就好了
【搜索关键字】    target: `http://307m931w46.wicp.vip:31854`

2.想要展示所有的【权限按钮】。在浏览器的控制台输入localStorage.setItem('showAllFlag', '1')，然后刷新页面即可

3.想要恢复【按钮权限】使其根据用户所设定的显示/隐藏，在浏览器控制台输入localStorage.removeItem('showAllFlag')，然后刷新页面即可
```
