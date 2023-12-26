/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * * 上传文件
   * @param files 文件
   * @param body 参数
   */
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      dest: 'uploads',
    }),
  )
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body) {
    console.log('body', body);
    console.log('files', files);

    // 用正则匹配出文件名
    const fileName = body.name.match(/(.+)\-\d+$/)[1];
    // 1、在 uploads 下创建 chunks_文件名 的目录
    const chunkDir = 'uploads/chunks_' + fileName;
    if (!fs.existsSync(chunkDir)) {
      fs.mkdirSync(chunkDir);
    }
    // 2、把文件复制过去
    fs.cpSync(files[0].path, chunkDir + '/' + body.name);
    // 3、然后删掉原始文件
    fs.rmSync(files[0].path);
  }

  /**
   * * 合并分片文件
   * @param name 文件名
   */
  @Get('merge')
  merge(@Query('name') name: string) {
    // 对应文件夹
    const chunkDir = 'uploads/chunks_' + name;

    // 读取文件夹内所有文件
    const files = fs.readdirSync(chunkDir);

    let count = 0;
    // 开始合并文件夹内文件
    let startPos = 0;
    files.map((file) => {
      const filePath = chunkDir + '/' + file;
      const stream = fs.createReadStream(filePath);
      stream.pipe(fs.createWriteStream('uploads/' + name, {
        start: startPos,
      })).on('finish', () => {
        // 合并完成之后把 chunks 目录删掉
        count++;
        if (count === files.length) {
          fs.rm(chunkDir, {
            recursive: true, // 格式问题爆红没关系
          });
        }
      });

      startPos += fs.statSync(filePath).size;
    });

    return {
      code: 200,
      msg: '合并成功！',
    };
  }
}
