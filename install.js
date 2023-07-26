const path = require("path")
const os = require('os')
module.exports = async (kernel) => {
  const platform = os.platform()
  const graphics = await kernel.system.graphics()
  const vendor = graphics.controllers[0].vendor
  let setup
  if (platform === "darwin") {
    setup = [{
      method: "shell.run",
      params: { message: "brew install cmake protobuf rust python@3.10 git wget", },
    }, {
      method: "shell.run",
      params: { message: "git clone -b dev https://github.com/AUTOMATIC1111/stable-diffusion-webui automatic1111", path: path.resolve(__dirname) },
    }]
  } else {
    if (/amd/i.test(vendor)) {
      if (platform === 'win32') {
        setup = [{
          method: "shell.run",
          params: { message: "git clone https://github.com/lshqqytiger/stable-diffusion-webui-directml.git automatic1111", path: __dirname }
        }]
      } else {
        setup = [{
          method: "shell.run",
          params: { message: "git clone -b dev https://github.com/AUTOMATIC1111/stable-diffusion-webui automatic1111", path: __dirname },
        }]
      }
    } else {
      setup = [{
        method: "shell.run",
        params: { message: "git clone -b dev https://github.com/AUTOMATIC1111/stable-diffusion-webui automatic1111", path: __dirname },
      }]
    }
  }

  let run = setup.concat([{
    "uri": "./index.js",
    "method": "config",
    "notify": true
  }, {
    "method": "notify",
    "params": {
      "html": "Downloading the Stable Diffusion XL 1.0 model..."
    }
  }, {
    "method": "fs.download",
    "params": {
      //"url": "https://huggingface.co/snowkidy/stable-diffusion-xl-base-0.9/resolve/main/sd_xl_base_0.9.safetensors",
      //"path": "automatic1111/models/Stable-diffusion/sd_xl_base_0.9.safetensors"
      "url": "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0/resolve/main/sd_xl_base_1.0.safetensors",
      "path": "automatic1111/models/Stable-diffusion/sd_xl_base_1.0.safetensors"
    }
  }, {
    "method": "fs.download",
    "params": {
      //"url": "https://huggingface.co/grendarAI/stable-diffusion-xl-refiner-0.9/resolve/main/sd_xl_refiner_0.9.safetensors",
      //"path": "automatic1111/models/Stable-diffusion/sd_xl_refiner_0.9.safetensors"
      "url": "https://huggingface.co/stabilityai/stable-diffusion-xl-refiner-1.0/resolve/main/sd_xl_refiner_1.0.safetensors",
      "path": "automatic1111/models/Stable-diffusion/sd_xl_refiner_1.0.safetensors"
    }
//  }, {
//    "method": "fs.download",
//    "params": {
//      //"url": "https://huggingface.co/madebyollin/sdxl-vae-fp16-fix/resolve/main/sdxl_vae.safetensors",
//      //"path": "automatic1111/models/Stable-diffusion/sd_xl_base_0.9.vae.safetensors"
//      "url": "https://huggingface.co/stabilityai/sdxl-vae/blob/main/sdxl_vae.safetensors",
//      "path": "automatic1111/models/Stable-diffusion/sd_xl_base_1.0.vae.safetensors"
//    }
  }, {
    "method": "notify",
    "params": {
      "html": "All SDXL 1.0 models downloaded successfully. Now setting up Automatic1111/stable-diffusion-webui..."
    }
  }, {
    "method": "shell.start",
    "params": {
      "path": "automatic1111",
      "env": {
        "HF_HOME": "../huggingface"
      },
    }
  }, {
    "method": "shell.enter",
    "params": {
      "message": "{{os.platform() === 'win32' ? 'webui-user.bat' : 'bash webui.sh -f'}}",
      "on": [{
        "event": "/(http:\/\/127.0.0.1:[0-9]+)/",
        "return": "{{event.matches[1]}}"
      }]
    }
  }, {
    "method": "local.set",
    "params": {
      "url": "{{input}}"
    }
  }, {
    "method": "input",
    "params": {
      "title": "Install Success",
      "description": "Go back to the dashboard and launch the app!"
    }
  }, {
    "method": "browser.open",
    "params": {
      "uri": "/"
    }
  }])
  return { run }
}
