
import * as qiniu from 'qiniu'
const mac = new qiniu.auth.digest.Mac(process.env.ACCESS_KEY, process.env.SECRET_KEY)
const path = require('path')
const options = {
  scope: process.env.BUCKET,
}
export const saveToQiNIu = async (name) => {
  const putPolicy = new qiniu.rs.PutPolicy(options)
  const uploadToken = putPolicy.uploadToken(mac)
  const config = new qiniu.conf.Config()
  config.zone = qiniu.zone.Zone_z2
  const localFile = path.join(__dirname, `../../public/tmp/${name}`)
  const putExtra = new qiniu.form_up.PutExtra()
  const key = name
  const formUploader = new qiniu.form_up.FormUploader(config)
  return new Promise((resolve, reject) => {
    formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
      if (respErr) {
        reject(respErr)
      }
      if (respInfo.statusCode == 200) {
        resolve(respBody)
      }
    })
  })
}
