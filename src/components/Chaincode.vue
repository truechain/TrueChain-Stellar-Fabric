<template>
  <div id="chaincode">
    <div class="tc-chaincode-add" :class="{'tc-box-add-focus': isInputing}">
      <div class="tc-box-add">
        <div class="tc-button-add" @click.stop="addChaincode">+ Add Chaincode</div>
        <div class="tc-input-add">
          <p>Select your Chaincode</p>
          <input id="tc-file-button" type="file" accept=".go">
          <div class="tc-input-file" :class="{'tc-input-file-selected': this.chaincodeFileName}">
            <div>{{chaincodeFileName}}</div>
            <div v-if="this.uploadStatus !== 'end'" class="tc-status-bar"></div>
          </div>
          <span style="float: left;" @click.stop="stopInput">back</span>
          <span style="float: right;" @click.stop="uploadChaincode">upload</span>
        </div>
      </div>
    </div>
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

export default {
  name: 'chaincode',
  data: () => {
    return {
      isInputing: false,
      fileInput: null,
      chaincodeFileName: '',
      uploadStatus: 'end'
    }
  },
  mounted () {
    this.fileInput = this.$el.querySelector('#tc-file-button')
    this.fileInput.addEventListener('change', (e) => {
      this.chaincodeFileName = this.fileInput.files[0].name
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
    },
    uploadChaincode () {
      if (!this.chaincodeFileName) {
        window.notice('#f78432', 'Please select your chaincode.', 3000)
        return
      }
      this.uploadStatus = 'uploading'
      api.uploadChaincode(this.chaincodeFileName, this.fileInput.files[0]).then((res) => {
        console.log(res)
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
  margin: 10px 10px 30px;
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
.tc-input-add p {
  font-size: 16px;
  text-align: left;
  line-height: 20px;
  margin-bottom: 10px;
  padding-left: 10px;
}
.tc-input-add input {
  cursor: pointer;
  opacity: 0;
  position: relative;
  z-index: 3;
  height: 40px;
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
  /* background-image: linear-gradient(to left, #fff0 -50%, #fff0 10%, #fffd 50%, #fff0 90%, #fff0 150%);
  background-position-x: -50%;
  transition: 1s; */
}
.tc-chaincode-add:hover {
  border-color: #014676;
}
.tc-button-add:hover {
  color: #014676;
}
.tc-chaincode-lists {
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
</style>
