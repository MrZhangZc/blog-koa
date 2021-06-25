
const qiniu = require('qiniu')
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)
const path = require('path')
const options = {
  scope: bucket,
}
export const saveToQiNIu = async (name) => {
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  console.log(uploadToken)
  const config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z2
  // 开始上传文件
  const localFile = path.join(__dirname, `./${name}`)
  const putExtra = new qiniu.form_up.PutExtra()
  const key = name
  const formUploader = new qiniu.form_up.FormUploader(config)
  formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
    if (respErr) {
      throw respErr
    }
    if (respInfo.statusCode == 200) {
  
      // console.log({respBody}, {respInfo})
    }
  })
}
