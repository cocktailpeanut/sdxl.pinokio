const os = require('os')
const fs = require('fs')
const path = require('path')
class Automatic1111 {
  // set up COMMANDLINE_ARGS inside webui-user.sh or webui-user.bat
  async config(req, ondata, kernel) {
    let graphics = await kernel.system.graphics()
    let platform = os.platform()
    let vendor = graphics.controllers[0].vendor
    if (platform === 'darwin') {
      let defaultArgs = "--no-download-sd-model --skip-torch-cuda-test --upcast-sampling --use-cpu interrogate --no-half --api"
      let text = await fs.promises.readFile(path.resolve(__dirname, "automatic1111", "webui-user.sh"), "utf8")
      let re = /^(#?)(export COMMANDLINE_ARGS=)(.+)$/m
      let newtext = text.replace(re, `$2"${defaultArgs}"`)
      await fs.promises.writeFile(path.resolve(__dirname, "automatic1111", "webui-user.sh"), newtext)
    } else if (platform === 'win32') {
      let defaultArgs = "--no-download-sd-model --api"
      let text = await fs.promises.readFile(path.resolve(__dirname, "automatic1111", "webui-user.bat"), "utf8")
      let re = /^(set COMMANDLINE_ARGS=)(.*)$/m
      let newtext = text.replace(re, `$1"${defaultArgs}"`)
      await fs.promises.writeFile(path.resolve(__dirname, "automatic1111", "webui-user.bat"), newtext)
    } else {
      // linux
      let defaultArgs
      if (/amd/i.test(vendor)) {
        // lshqqytiger
        defaultArgs = "--no-download-sd-model --precision full --no-half --api"
      } else {
        defaultArgs = "--no-download-sd-model --api"
      }
      let text = await fs.promises.readFile(path.resolve(__dirname, "automatic1111", "webui-user.sh"), "utf8")
      let re = /^(#?)(export COMMANDLINE_ARGS=)(.+)$/m
      let newtext = text.replace(re, `$2"${defaultArgs}"`)
      await fs.promises.writeFile(path.resolve(__dirname, "automatic1111", "webui-user.sh"), newtext)
    }
  }
}
module.exports = Automatic1111
