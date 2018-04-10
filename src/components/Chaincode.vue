<template>
  <div id="chaincode" :style="{transform: `translateY(${pageTranslateY}px)`}">
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
    <div class="tc-ccinfos">
      <transition-group tag="ul" class="tc-chaincode-lists" name="fade">
        <li v-for="item in ccList" :key="ccList.indexOf(item)">
          <div class="tc-chaincode" :style="{'border-left-color': item.isInstantiated ? '#091' : '#ddd'}">
            <div class="tc-chaincode-l">
              <p class="tc-chaincode-name">{{item.name}}</p>
              <p class="tc-chaincode-intro">{{item.version}}</p>
            </div>
            <ul class="tc-chaincode-r" :class="{'tc-chaincode-not-active': !item.isInstantiated}">
              <li class="tc-ccinfo-peer" @click="loadCcInfo(item, 'peer')"></li>
              <li class="tc-ccinfo-block" @click="loadCcInfo(item, 'block')"></li>
              <li class="tc-ccinfo-trans" @click="loadCcInfo(item, 'trans')"></li>
            </ul>
          </div>
          <div class="tc-card tc-chaincode-args" v-if="!item.isInstantiated">
            <p class="tc-input-title">Args <span>use "," separate</span></p>
            <input type="text" v-model="item.args">
            <span class="tc-chaincode-args-sub" @click="instantiateCc(item)">Instantiate</span>
            <div class="mask" v-if="item.isWaiting">waiting...</div>
          </div>
        </li>
      </transition-group>
      <!-- <div class="tc-chaincode-info">
        <p class="tc-chaincode-info-title">{{info.chaincode}} / {{info.type}}</p>
      </div> -->
    </div>
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
// const ccList = [
//   {name: 'Chaincode 1', version: 'v1', isWaiting: false, isInstantiated: false, args: ''},
//   {name: 'Chaincode 2', version: 'v1', isWaiting: false, isInstantiated: false, args: ''}
// ]

export default {
  name: 'chaincode',
  data: () => {
    return {
      isInputing: false,
      fileInput: null,
      chaincodeFileName: '',
      uploadStatus: 'end',
      ccInfo,
      ccList: [],
      info: {
        chaincode: '',
        type: ''
      },
      chaincodePath: '',
      pageTranslateY: 0,
      height: 0
    }
  },
  created () {
    this.$emit('routerinit', this)
    this.queryCcList()
  },
  mounted () {
    this.height = this.$el.getBoundingClientRect().height
    this.$el.addEventListener('mousewheel', this.onMousewheel)
    window.addEventListener('resize', this.updateSize)

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
    queryCcList () {
      let installedCc
      if (!window.installedCcInfo) {
        installedCc = api.queryChaincodes('peer1', 'installed')
        installedCc.then((res) => {
          window.installedCcInfo = res.data
        })
      } else {
        installedCc = new Promise((resolve, reject) => {
          resolve({ data: window.installedCcInfo })
        })
      }
      let instantiatedCc = api.queryChaincodes('peer1', 'instantiated')
      Promise.all([installedCc, instantiatedCc]).then((values) => {
        let data = values[0].data
        let iData = values[1].data
        this.ccList = data.map((item) => {
          return {
            name: item.match(/name: (\S*),/)[1],
            version: item.match(/version: (\S*),/)[1],
            isInstantiated: iData.indexOf(item) > -1,
            args: '',
            isWaiting: false
          }
        })
        this.$nextTick(this.updateSize)
        this.info.chaincode = this.ccList[0].name
        this.info.type = 'peer'
      }).catch(() => {
        window.notice('#d21107', 'Network Error!', 3000)
      })
    },
    addChaincode () {
      this.ccInfo.name = ''
      this.ccInfo.nameIsOk = false
      this.ccInfo.version = ''
      this.ccInfo.versionIsOk = false
      this.ccInfo.description = ''
      this.ccInfo.descIsOk = false

      this.isInputing = true
    },
    stopInput () {
      this.fileInput.value = ''
      this.chaincodeFileName = ''
      this.uploadStatus = 'end'
      this.isInputing = false
      setTimeout(this.updateSize, 1000)
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
          this.chaincodePath = data.path
          window.notice('#4596f5', 'Upload success.', 3000)
        } else {
          this.uploadStatus = 'failed'
          window.notice('#f78432', 'Upload failed, please check your chaincode.', 4000)
        }
        this.$nextTick(this.updateSize)
      }).catch(() => {
        this.uploadStatus = 'failed'
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
      let i = this.ccInfo
      api.installChaincode(['peer1', 'peer2'], i.name, this.chaincodePath, i.version).then((res) => {
        if (res.status === 200) {
          window.notice('#4596f5', res.data, 3000)
        }
        this.queryCcList()
      }).catch(() => {
        window.notice('#d21107', 'Network Error!', 3000)
      })
      this.stopInput()
    },
    loadCcInfo (item, type) {
      this.info.chaincode = item.name
      this.info.type = type
    },
    instantiateCc (item) {
      item.isWaiting = true
      api.instantiateChaincode('mychannel', item.name, item.version, item.args.split(',')).then((res) => {
        if (res.status === 200) {
          let data = res.data
          if (/Error/.test(data)) {
            window.notice('#d21107', data, 4000)
          } else {
            window.notice('#4596f5', data, 4000)
            window.installedCcInfo = false
            this.queryCcList()
          }
        }
        item.isWaiting = false
      }).catch(() => {
        window.notice('#d21107', 'Network Error!', 3000)
      })
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
.tc-ccinfos {
  display: flex;
  flex-flow: row wrap-reverse;
  margin-top: 30px;
  padding: 20px 0;
  border-top: solid 1px #ddd;
}
.tc-chaincode-lists {
  flex: 0 0 320px;
}
.tc-chaincode-lists li {
  position: relative;
  padding: 10px;
}
.tc-chaincode-info {
  flex: auto;
  margin: 10px;
  padding: 19px;
  border: solid 1px #ddd;
  background-color: #fff;
  border-radius: 3px;
}
.tc-chaincode-info-title {
  line-height: 22px;
  padding-bottom: 7px;
  border-bottom: solid 1px #ddd;
}
.tc-chaincode {
  height: 140px;
  width: 300px;
  background-color: #fff;
  border-radius: 3px;
  box-shadow: 0 2px 4px #0001;
  box-sizing: border-box;
  color: #333;
  border-left: solid 6px #ddd;
  overflow: hidden;
  position: relative;
  z-index: 5;
}
.tc-chaincode-name {
  line-height: 22px;
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
  transition: opacity .4s;
  opacity: .6;
  background-repeat: no-repeat;
  background-position: 50%;
  background-size: 80%;
}
.tc-chaincode-r li:hover {
  opacity: 1;
}
.tc-chaincode-not-active li {
  background-color: #ddd;
  opacity: 1;
  cursor: default;
}
.tc-ccinfo-peer {
  background-color: #f727b0;
  background-image: url(../assets/icon/peer_small.png);
}
.tc-ccinfo-block {
  background-color: #3da3fe;
  background-image: url(../assets/icon/block_small.png);
  margin:4px 0;
}
.tc-ccinfo-trans {
  background-color: #f9a942;
  background-image: url(../assets/icon/trans_small.png);
}
.tc-chaincode-args {
  position: absolute;
  z-index: 3;
  top: 10px;
  left: 320px;
  height: 140px;
  box-sizing: border-box;
}
.tc-chaincode-args input {
  width: 160px;
  margin-right: 10px;
}
.tc-chaincode-args .mask {
  position: absolute;
  background-color: #0003;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 3px;
  color: #fff;
  font-weight: 800;
  text-align: center;
  line-height: 140px;
}
.tc-chaincode-args-sub {
  margin: 20px 10px 0;
  float: right;
  line-height: 18px;
  font-size: 14px;
  color: #999;
  cursor: pointer;
  transition: color .5s;
}
.tc-chaincode-args-sub:hover {
  color: #014676;
}

.fade-enter-active, .fade-leave-active {
  transition: transform .4s, opacity .4s;
}
.fade-enter, .fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
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
