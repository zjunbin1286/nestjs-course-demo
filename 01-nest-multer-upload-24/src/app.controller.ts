import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpException,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor, AnyFilesInterceptor } from '@nestjs/platform-express';
import { storage } from './my-file-storage';
import { FileSizeValidationPipe } from './file-size-validation-pipe.pipe';
import { MyFileValidator } from './my-file-validator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // TODO 1、单文件上传
  @Post('aaa')
  // 使用 FileInterceptor 来提取 aaa 字段，然后通过 UploadedFile 装饰器把它作为参数传入。
  // dest: 指定文件存放的目录
  @UseInterceptors(FileInterceptor('aaa', { dest: 'uploads' }))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    console.log('body', body);
    console.log('file', file);
  }

  // TODO 2、多文件上传
  @Post('bbb')
  // 多文件：把 FileInterceptor 换成 FilesInterceptor，把 UploadedFile 换成 UploadedFiles，都是多加一个 s。
  @UseInterceptors(FilesInterceptor('bbb', 3, { dest: 'uploads' }))
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any) {
    console.log('body', body);
    console.log('files', files);
  }

  // TODO 3、多个文件的字段
  @Post('ccc')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'aaa', maxCount: 2 },
        { name: 'bbb', maxCount: 3 },
      ],
      {
        dest: 'uploads',
      },
    ),
  )
  uploadFileFields(@UploadedFiles() files: { aaa?: Express.Multer.File[]; bbb?: Express.Multer.File[] }, @Body() body: any) {
    console.log('body', body);
    console.log('files', files);
  }

  // TODO 4、并不知道有哪些字段是 file 呢？（自动识别前端传递的字段）
  @Post('ddd')
  @UseInterceptors(AnyFilesInterceptor({ dest: 'uploads' }))
  uploadAnyFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any) {
    console.log('body', body);
    console.log('files', files);
  }

  // TODO 5、使用 multer 的 storage
  @Post('eee')
  @UseInterceptors(AnyFilesInterceptor({ storage: storage }))
  uploadAnyFiles1(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: any) {
    console.log('body', body);
    console.log('files', files);
  }

  // TODO 6、对上传的文件做一些限制，比如文件大小、类型等，很明显，这部分可以放在 pipe 里做
  // 大于 10k 就抛出异常，返回 400 的响应
  // @UploadedFile(FileSizeValidationPipe) 使用pipe
  @Post('fff')
  @UseInterceptors(FileInterceptor('aaa', { dest: 'uploads' }))
  uploadFile2(@UploadedFile(FileSizeValidationPipe) file: Express.Multer.File, @Body() body: any) {
    console.log('body', body);
    console.log('files', file);
  }

  // TODO 7、像文件大小、类型的校验这种逻辑太过常见，Nest 给封装好了，可以直接用
  @Post('ggg')
  @UseInterceptors(
    FileInterceptor('aaa', {
      dest: 'uploads',
    }),
  )
  uploadFile3(
    @UploadedFile(
      new ParseFilePipe({
        // 手动更改错误信息（也可以不改）
        exceptionFactory: (err) => {
          throw new HttpException('错误！' + err, 404);
        },
        // 对文件进行校验：MaxFileSizeValidator 是校验文件大小、FileTypeValidator 是校验文件类型
        validators: [new MaxFileSizeValidator({ maxSize: 1000 }), new FileTypeValidator({ fileType: 'image/jpeg' })],
      }),
    )
    file: Express.Multer.File,
    @Body() body: any,
  ) {
    console.log('body', body);
    console.log('file', file);
  }

  // TODO 8、使用自己实现的 validator
  @Post('hhh')
  @UseInterceptors(FileInterceptor('aaa', { dest: 'uploads' }))
  uploadFile4(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MyFileValidator({})], // 自定义的 validator
      }),
    )
    file: Express.Multer.File,
    @Body() body: any,
  ) {
    console.log('body', body);
    console.log('file', file);
  }
}
