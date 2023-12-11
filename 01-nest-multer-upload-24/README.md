### Nest 如何使用 multer 实现文件上传（第24节）

#### 项目运行
```shell
nest start --watch
```

#### 运行静态服务
```shell
npx http-server
```
测试就可以直接访问：`http://127.0.0.1:8080/`

#### 文件访问
1、开启静态资源访问
```ts
app.useStaticAssets(join(__dirname, '..', 'my-uploads'), {
  prefix: '/upload',
});
```
访问：`http://127.0.0.1:3000/upload/文件名`

2、开启 http-server 静态服务访问
访问：`http://127.0.0.1:8080/my-uploads/文件名`

#### 总结
* Nest 的文件上传也是基于 `multer` 实现的，它对 multer api 封装了一层，提供了 `FileInterceptor`、`FilesInterceptor`、`FileFieldsInterceptor`、`AnyFilesInterceptor` 的拦截器，分别用到了 multer 包的 single、array、fields、any 方法。

* 它们把文件解析出来，放到 request 的某个属性上，然后再用 `@UploadedFile`、`@UploadedFiles` 的装饰器取出来传入 handler。

* 并且这个过程还可以使用 `ParseFilePipe` 来做文件的验证，它内置了 `MaxFileSizeValidator`、`FileTypeValidator`，你也可以实现自己的 `FileValidator`。

这就是 Nest 里处理文件上传的方式。