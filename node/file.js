var fs=require('fs');
// 异步打开文件
console.log("准备打开文件！");
fs.open('input.txt', 'r+', function(err, fd) {
   if (err) {
       return console.error(err);
   }
  console.log("文件打开成功！");     
});
//r	以读取模式打开文件。如果文件不存在抛出异常。
//r+	以读写模式打开文件。如果文件不存在抛出异常。
//rs	以同步的方式读取文件。
//rs+	以同步的方式读取和写入文件。
//w	以写入模式打开文件，如果文件不存在则创建。
//wx	类似 'w'，但是如果文件路径存在，则文件写入失败。
//w+	以读写模式打开文件，如果文件不存在则创建。
//wx+	类似 'w+'， 但是如果文件路径存在，则文件读写失败。
//a	以追加模式打开文件，如果文件不存在则创建。
//ax	类似 'a'， 但是如果文件路径存在，则文件追加失败。
//a+	以读取追加模式打开文件，如果文件不存在则创建。
//ax+	类似 'a+'， 但是如果文件路径存在，则文件读取追加失败。



console.log("准备打开文件！");
fs.stat('input.txt', function (err, stats) {
   if (err) {
       return console.error(err);
   }
   console.log(stats);
   console.log("读取文件信息成功！");
   // 检测文件类型
   console.log("是否为文件(isFile) ? " + stats.isFile());
   console.log("是否为目录(isDirectory) ? " + stats.isDirectory());    
});
//stats.isFile()	如果是文件返回 true，否则返回 false。
//stats.isDirectory()	如果是目录返回 true，否则返回 false。
//stats.isBlockDevice()	如果是块设备返回 true，否则返回 false。
//stats.isCharacterDevice()	如果是字符设备返回 true，否则返回 false。
//stats.isSymbolicLink()	如果是软链接返回 true，否则返回 false。
//stats.isFIFO()	如果是FIFO，返回true，否则返回 false。FIFO是UNIX中的一种特殊类型的命令管道。
//stats.isSocket()	如果是 Socket 返回 true，否则返回 false。

console.log("准备写入文件");
fs.writeFile('input.txt', '我是通过写入的文件内容！',  function(err) {
   if (err) {
       return console.error(err);
   }
   console.log("数据写入成功！");
   console.log("--------我是分割线-------------")
   console.log("读取写入的数据！");
   fs.readFile('input.txt', function (err, data) {
      if (err) {
         return console.error(err);
      }
      console.log("异步读取文件数据: " + data.toString());
   });
});