const os = require('os')
const fs = require('fs')
const path = require('path')
class Automatic1111 {
  // set up COMMANDLINE_ARGS inside webui-user.sh or webui-user.bat
  async config(req, ondata, kernel) {
    let graphics = await kernel.system.graphics()
    let platform = os.platform()
    let vendor = graphics.controllers[0].vendor
    ondata({ raw: `\r\nVendor: ${vendor}\r\n` })
    if (platform === 'darwin') {
      let defaultArgs
      if (/apple/i.test(vendor)) {
        defaultArgs = "--no-download-sd-model --skip-torch-cuda-test --upcast-sampling --use-cpu interrogate --no-half --api"
      } else {
        defaultArgs = "--no-download-sd-model --skip-torch-cuda-test --upcast-sampling --use-cpu all --no-half --api"
      }
      let text = await fs.promises.readFile(path.resolve(__dirname, "automatic1111", "webui-user.sh"), "utf8")
      let re = /^(#?)(export COMMANDLINE_ARGS=)(.+)$/m
      let newtext = text.replace(re, `$2"${defaultArgs}"`)
      await fs.promises.writeFile(path.resolve(__dirname, "automatic1111", "webui-user.sh"), newtext)
    } else if (platform === 'win32') {
      let defaultArgs = "--no-download-sd-model --xformers --no-half-vae --api"
      let text = await fs.promises.readFile(path.resolve(__dirname, "automatic1111", "webui-user.bat"), "utf8")
      let re = /^(set COMMANDLINE_ARGS=)(.*)$/m
      let newtext = text.replace(re, `$1${defaultArgs}`)
      await fs.promises.writeFile(path.resolve(__dirname, "automatic1111", "webui-user.bat"), newtext)
    } else {
      // linux
      let defaultArgs
      if (/amd/i.test(vendor)) {
        // lshqqytiger
        defaultArgs = "--no-download-sd-model --precision full --no-half-vae --xformers --api"
      } else {
        defaultArgs = "--no-download-sd-model --xformers --no-half-vae --api"
      }
      let text = await fs.promises.readFile(path.resolve(__dirname, "automatic1111", "webui-user.sh"), "utf8")
      let re = /^(#?)(export COMMANDLINE_ARGS=)(.+)$/m
      let newtext = text.replace(re, `$2"${defaultArgs}"`)
      await fs.promises.writeFile(path.resolve(__dirname, "automatic1111", "webui-user.sh"), newtext)
    }
  }
}
module.exports = Automatic1111
