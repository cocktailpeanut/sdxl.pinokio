const os = require('os')
module.exports = async (kernel) => {
  return {
    run: [{
      method: "shell.start",
      params: {
        path: "automatic1111",
        env: {
          HF_HOME: "../huggingface"
        },
      }
    }, {
      method: "shell.enter",
      params: {
        message: "{{os.platform() === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f'}}",
        on: [{
          event: "/(http:\/\/127.0.0.1:[0-9]+)/",
          return: "{{event.matches[1]}}"
        }]
      }
    }, {
      method: "notify",
      params: {
        html: "Successfully launched. Go to the dashboard to open the web ui",
        href: "/"
      }
    }, {
      method: "process.wait"
    }]
  }
}