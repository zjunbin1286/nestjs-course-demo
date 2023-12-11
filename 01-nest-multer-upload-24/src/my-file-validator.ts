import { FileValidator } from '@nestjs/common';

// 也可以自己实现这样的 validator，只要继承 FileValidator 就可以
export class MyFileValidator extends FileValidator {
  constructor(options: any) {
    super(options);
  }
  isValid(file: Express.Multer.File): boolean | Promise<boolean> {
    if (file.size > 10000) {
      return false;
    }
    return true;
  }
  buildErrorMessage(file: Express.Multer.File): string {
    return `文件${file.originalname}大小超出10k`;
  }
}
