import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';

/**
 * multer.distkStorage 磁盘存储
 */
const storage = multer.diskStorage({
  // 指定保存的目录
  destination: function (req, file, cb) {
    try {
      // path.join(process.cwd() 绝对路径
      fs.mkdirSync(path.join(process.cwd(), 'my-uploads'));
    } catch (e) {}

    cb(null, path.join(process.cwd(), 'my-uploads'));
  },
  // 设置文件名
  filename: function (req, file, cb) {
    // 时间戳 Date.now() 加上Math.random() 乘以 10 的 9 次方，然后取整，之后加上原来的文件名
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9) + '-' + file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export { storage };
