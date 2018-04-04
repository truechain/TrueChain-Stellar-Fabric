<template>
  <div id="chaincode">
    <div class="tc-chaincode-add" :class="{'tc-box-add-focus': isInputing}">
      <div class="tc-box-add">
        <div class="tc-button-add" @click.stop="addChaincode">+ Add Chaincode</div>
        <div class="tc-input-add">
          <p class="tc-input-title">Select your Chaincode</p>
          <input id="tc-file-button" type="file" accept=".go">
          <div class="tc-input-file" :class="{'tc-input-file-selected': chaincodeFileName}">
            <div>{{chaincodeFileName}}</div>
            <div v-if="uploadStatus !== 'end' && uploadStatus !== 'success'" class="tc-status-bar" :class="{
              'tc-status-bar-uploading': uploadStatus === 'uploading',
              'tc-status-bar-failed': uploadStatus === 'failed'
            }"></div>
          </div>
          <span style="float: left;" @click.stop="stopInput">back</span>
          <span style="float: right;" @click.stop="uploadChaincode">upload</span>
        </div>
      </div>
    </div>
    <transition-group name="fadeIn"
      :css="false"
      @enter="enter"
      @leave="leave">
      <div data-index="0" key="name" v-show="uploadStatus === 'success'" class="tc-card tc-chaincode-setinfo" :style="{'border-left-color': ccInfo.nameIsOk ? '#091' : '#d21107'}">
        <p class="tc-input-title">Name <span>of the Chaincode</span></p>
        <input id="tc-chaincode-setinfo-name" type="text" v-model="ccInfo.name">
      </div>
      <div data-index="1" key="version" v-show="uploadStatus === 'success'"  class="tc-card tc-chaincode-setinfo" :style="{'border-left-color': ccInfo.versionIsOk ? '#091' : '#d21107'}">
        <p class="tc-input-title">Version</p>
        <input id="tc-chaincode-setinfo-version" type="text" v-model="ccInfo.version">
      </div>
      <div data-index="2" key="description" v-show="uploadStatus === 'success'"  class="tc-card tc-chaincode-setinfo" :style="{'border-left-color': ccInfo.descIsOk ? '#091' : '#ddd'}">
        <p class="tc-input-title">Description</p>
        <textarea id="tc-chaincode-setinfo-desc" v-model="ccInfo.description"/>
      </div>
      <div data-index="3" key="submit" v-show="uploadStatus === 'success'"  class="tc-chaincode-submit">
        <div @click.stop="installCc" class="tc-chaincode-submit-button" :class="{'active': ccInfo.nameIsOk && ccInfo.versionIsOk}">Install</div>
      </div>
    </transition-group>
    <div class="clear"></div>
    <ul class="tc-chaincode-lists">
      <li>
        <div class="tc-card tc-chaincode">
          <div class="tc-chaincode-l">
            <p class="tc-chaincode-name">Chaincode 1</p>
            <p class="tc-chaincode-intro">Introduction</p>
          </div>
          <ul class="tc-chaincode-r">
            <li style="background-color:#f727b0;">1</li>
            <li style="background-color:#3da3fe;margin:4px 0;">2</li>
            <li style="background-color:#f9a942;">3</li>
          </ul>
        </div>
      </li>
      <div class="clear"></div>
    </ul>
  </div>
</template>

<script>
import api from '@/api-config'

const ccInfo = {
  name: '',
  nameIsOk: false,
  version: '',
  versionIsOk: false,
  description: '',
  descIsOk: false
}

export default {
  name: 'chaincode',
  data: () => {
    return {
      isInputing: false,
      fileInput: null,
      chaincodeFileName: '',
      uploadStatus: 'end',
      ccInfo
    }
  },
  mounted () {
    this.fileInput = this.$el.querySelector('#tc-file-button')
    this.fileInput.addEventListener('change', (e) => {
      this.chaincodeFileName = this.fileInput.files[0].name
    })

    let ccNameInput = this.$el.querySelector('#tc-chaincode-setinfo-name')
    ccNameInput.addEventListener('change', (e) => {
      // check the value of ccNameInput
      if (ccNameInput.value) {
        this.ccInfo.nameIsOk = true
      } else {
        this.ccInfo.nameIsOk = false
      }
    })
    let ccVersionInput = this.$el.querySelector('#tc-chaincode-setinfo-version')
    ccVersionInput.addEventListener('change', (e) => {
      // check the value of ccVersionInput
      if (ccVersionInput.value) {
        this.ccInfo.versionIsOk = true
      } else {
        this.ccInfo.versionIsOk = false
      }
    })
    let ccDescription = this.$el.querySelector('#tc-chaincode-setinfo-desc')
    ccDescription.addEventListener('change', (e) => {
      // check the value of ccDescription
      if (ccDescription.value) {
        this.ccInfo.descIsOk = true
      } else {
        this.ccInfo.descIsOk = false
      }
    })
  },
  methods: {
    addChaincode () {
      this.isInputing = true
    },
    stopInput () {
      this.fileInput.value = ''
      this.chaincodeFileName = ''
      this.uploadStatus = 'end'
      this.isInputing = false
      this.ccInfo = ccInfo
    },
    uploadChaincode () {
      if (!this.chaincodeFileName) {
        window.notice('#f78432', 'Please select your chaincode.', 3000)
        return
      }
      this.uploadStatus = 'uploading'
      api.uploadChaincode(this.chaincodeFileName, this.fileInput.files[0]).then((res) => {
        let data = res.data
        if (data.ok) {
          this.uploadStatus = 'success'
          window.notice('#4596f5', 'Upload success.', 3000)
        } else {
          this.uploadStatus = 'failed'
          window.notice('#f78432', 'Upload failed, please check your chaincode.', 4000)
        }
        console.log(res)
      }).catch(() => {
        window.notice('#d21107', 'Network Error!', 3000)
      })
    },
    enter (el, done) {
      let delay = el.dataset.index * 50
      setTimeout(() => {
        el.style.opacity = 1
      }, delay)
      setTimeout(done, delay + 600)
    },
    leave (el, done) {
      let delay = 150 - el.dataset.index * 50
      setTimeout(() => {
        el.style.opacity = 0
      }, delay)
      setTimeout(done, delay + 600)
    },
    installCc () {
      if (!ccInfo.nameIsOk || !ccInfo.versionIsOk) {
        return
      }
      this.stopInput()
    }
  }
}
</script>

<style>
#chaincode {
  padding: 30px;
}
.tc-chaincode-add {
  float: left;
  margin: 10px 10px 0;
  height: 140px;
  width: 300px;
  background-color: #fff;
  border-radius: 3px;
  text-align: center;
  box-sizing: border-box;
  border: dashed 1px #bbb;
  transition: border .5s;
  overflow: hidden;
}
.tc-box-add {
  width: 200%;
  height: 100%;
  transition: transform .6s;
}
.tc-box-add-focus {
  border-style: solid;
  border-color: #bbb !important;
}
.tc-box-add-focus>div {
  transform: translateX(-50%);
}
.tc-button-add {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding-top: 55px;
  line-height: 30px;
  color: #bbb;
  cursor: pointer;
  float: left;
  transition: color .5s;
}
.tc-input-add {
  width: 50%;
  height: 100%;
  box-sizing: border-box;
  padding: 20px;
  float: left;
}
.tc-input-title {
  font-size: 16px;
  text-align: left;
  line-height: 20px;
  margin-bottom: 10px;
  padding-left: 10px;
}
.tc-input-title span {
  font-size: 12px;
  color: #bbb;
}
.tc-input-add input {
  cursor: pointer;
  opacity: 0;
  position: relative;
  z-index: 3;
  width: 100%;
}
.tc-input-add span {
  margin-top: -20px;
  padding: 0 10px 0;
  line-height: 18px;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  transition: color .5s;
}
.tc-input-add span:hover {
  color: #014676;
}
.tc-input-file {
  border-radius: 3px;
  border: dashed 1px #bbb;
  width: 100%;
  height: 40px;
  position: relative;
  box-sizing: border-box;
  top: -40px;
  text-align: left;
  padding-left: 9px;
  line-height: 38px;
}
.tc-input-file-selected {
  border-style: solid;
}
.tc-status-bar {
  position: absolute;
  width: 258px;
  height: 6px;
  background-color: #091;
  top: 45px;
  left: -1px;
  border-radius: 3px;
}
.tc-chaincode-add:hover {
  border-color: #014676;
}
.tc-button-add:hover {
  color: #014676;
}
.tc-status-bar-uploading {
  animation: prograss .3s linear infinite;
  background-image: url(../assets/status_bar_prograss.png)
}
.tc-status-bar-failed {
  background-color: #f78432;
}
.tc-chaincode-setinfo {
  float: left;
  margin: 10px 10px 0 0;
  height: 140px;
  box-sizing: border-box;
  border-left: solid 6px #ddd;
  transition: border-left-color .3s, opacity .6s;
  opacity: 0;
}
.tc-chaincode-submit {
  float: left;
  margin: 10px 10px 0 0;
  height: 140px;
  width: 60px;
  box-sizing: border-box;
  transition: opacity .6s;
  opacity: 0;
  background-color: #0072c1;
  border-radius: 3px;
  box-shadow: 0 2px 4px #0001;
}
.tc-chaincode-submit .active {
  background-color: #0d85da;
  transform: translateX(10px);
}
.tc-chaincode-submit-button {
  text-align: center;
  color: #fff;
  line-height: 140px;
  cursor: pointer;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  background-color: #bbb;
  transition: .4s;
}
.tc-chaincode-submit .active:hover {
  transform: translateX(6px);
}
#tc-chaincode-setinfo-name {
  width: 160px;
}
#tc-chaincode-setinfo-version {
  width: 100px;
}
#tc-chaincode-setinfo-desc {
  width: 254px;
  height: 70px;
  line-height: 30px;
}
.tc-chaincode-lists {
  margin-top: 30px;
  padding: 20px 0;
  width: 100%;
  border-top: solid 1px #ddd;
}
.tc-chaincode-lists li {
  padding: 10px;
}
.tc-chaincode {
  padding: 0;
  height: 140px;
  width: 300px;
  background-color: #fff;
  box-sizing: border-box;
  color: #333;
  border-left: solid 6px #091;
  overflow: hidden;
}
.tc-chaincode-name {
  font-weight: 800;
}
.tc-chaincode-intro {
  font-size: 12px;
  margin-top: 4px;
  line-height: 18px;
  color: #999;
}
.tc-chaincode-l {
  box-sizing: border-box;
  width: 264px;
  height: 140px;
  padding: 20px;
  float: left;
}
.tc-chaincode-r {
  float: right;
  height: 100%;
}
.tc-chaincode-r li {
  height: 44px;
  width: 30px;
  padding: 0;
  font-size: 20px;
  line-height: 44px;
  text-align: right;
  box-sizing: border-box;
  padding-right: 4px;
  color: #fff;
  cursor: pointer;
  transition: transform .4s;
}
.tc-chaincode-r li:hover {
  transform: translateX(4px)
}

@keyframes prograss {
  from {
    background-position-x: 0px;
  }
  to {
    background-position-x: 14px;
  }
}
</style>
