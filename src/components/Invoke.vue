<template>
  <div id="invoke">
    <div class="tc-card tc-invoke-box">
      <ul class="tc-invoke-form">
        <li>
          <span class="tc-invoke-form-label">Chaincode</span>
          <div @click.stop="openSelector" class="tc-invoke-form-input tc-invoke-form-cc" :class="{'green-border': submitStatus.chaincode}" >
            {{submitInfo.chaincode}}
            <ul class="tc-invoke-form-select" :class="{'close': closeSelect}">
              <li v-for="item in chaincodeList" :key="chaincodeList.indexOf(item)" @click.stop="selectCc(item)">{{item.name}}</li>
              <li v-if="chaincodeList.length === 0" style="color: #bbb;">Not Found</li>
            </ul>
          </div>
          <div class="clear"></div>
        </li>
        <li>
          <span class="tc-invoke-form-label">Function</span>
          <input class="tc-invoke-form-input tc-invoke-form-func" type="text" :class="{'green-border': submitStatus.func}" @change="checkFuncInput" v-model="submitInfo.funcName">
          <div class="clear"></div>
        </li>
        <li>
          <span class="tc-invoke-form-label">Parameters</span>
          <transition-group tag="div" name="scale-y" class="tc-invoke-form-paras">
            <div v-for="item in submitInfo.paras" :key="item.index">
              <input class="key" type="text" v-model="item.key">
              <span>:</span>
              <input class="value" type="text" v-model="item.value">
              <div class="tc-incoke-para-remove" @click.stop="removeParameter(item)">+</div>
            </div>
            <div key="0" id="tc-incoke-form-addpara" @click.stop="addParameter">+</div>
          </transition-group>
          <div class="clear"></div>
        </li>
        <li>
          <span class="tc-invoke-form-label">Method</span>
          <!-- <input class="tc-invoke-form-input" type="text"> -->
          <ul class="tc-invoke-form-input tc-invoke-form-method">
            <li v-for="item in methods" :key="methods.indexOf(item)" :class="{'focus': submitInfo.method === item}" @click.stop="selectMethod(item)">{{item}}</li>
          </ul>
          <div class="clear"></div>
        </li>
        <li>
          <span class="tc-invoke-form-label"></span>
          <div id="tc-invoke-submit">
            <div :class="{'active': inputValid}">call</div>
          </div>
          <div class="clear"></div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const methods = ['Invoke', 'Query']

export default {
  name: 'invoke',
  data: () => {
    return {
      chaincodeList: [
        {name: 'testData1', value: 'some value 1'},
        {name: 'testData2', value: 'some value 2'},
        {name: 'testData3', value: 'some value 3'},
        {name: 'testData4', value: 'some value 4'}
      ],
      methods,
      submitInfo: {
        chaincode: '',
        funcName: '',
        paras: [],
        method: ''
      },
      closeSelect: true,
      parasIndex: 1,
      submitStatus: {
        chaincode: false,
        func: false
      },
      inputValid: false,
      pageTranslateY: 0,
      height: 0
    }
  },
  created () {
    this.$emit('routerinit', this)
  },
  mounted () {
    window.el = this
    this.height = this.$el.getBoundingClientRect().height
    this.$el.addEventListener('mousewheel', this.onMousewheel)
    window.addEventListener('resize', this.updateSize)
  },
  methods: {
    openSelector () {
      this.closeSelect = false
      document.addEventListener('click', () => {
        this.closeSelect = true
      }, false)
    },
    selectCc (item) {
      this.submitStatus.chaincode = true
      this.submitInfo.chaincode = item.value
      this.closeSelect = true
      this.checkInput()
    },
    addParameter () {
      this.submitInfo.paras.push({
        index: this.parasIndex++,
        key: '',
        value: ''
      })
    },
    removeParameter (item) {
      let i = this.submitInfo.paras.indexOf(item)
      if (i > -1) {
        this.submitInfo.paras.splice(i, 1)
      }
    },
    checkFuncInput () {
      this.submitStatus.func = this.submitInfo.funcName
      this.checkInput()
    },
    selectMethod (item) {
      this.submitInfo.method = item
      this.checkInput()
    },
    checkInput () {
      let s = this.submitStatus
      if (s.chaincode && s.func && this.submitInfo.method) {
        this.inputValid = true
      } else {
        this.inputValid = false
      }
    }
  }
}
</script>

<style>
#invoke {
  padding: 30px;
}
.tc-invoke-box {
  margin: 10px;
}
.tc-invoke-form>li{
  margin: 20px 0;
}
.tc-invoke-form-input {
  float: left;
  margin: 10px;
}
.tc-invoke-form-cc {
  cursor: pointer;
  border: solid 1px #ddd;
  height: 40px;
  width: 180px;
  border-radius: 3px;
  position: relative;
  box-sizing: border-box;
  line-height: 38px;
  padding: 0 9px;
  border-right: solid 6px #d21107;
}
.close {
  height: 0 !important;
  opacity: 0;
}
.tc-invoke-form-select {
  position: absolute;
  width: 100%;
  height: 120px;
  border-radius: 3px;
  border: solid 1px #ddd;
  background-color: #fff;
  left: -1px;
  top: 44px;
  overflow-y: scroll;
  transition: .6s;
}
.tc-invoke-form-select li {
  height: 40px;
  box-sizing: border-box;
  padding: 0 10px;
  line-height: 40px;
  cursor: pointer;
}
.tc-invoke-form-select li:nth-child(odd) {
  background-color: #eee6;
}
.tc-invoke-form-func {
  width: 160px;
  border-right: solid 6px #d21107;
  transition: border-right-color .6s;
}
.green-border {
  border-right-color: #091;
}
.tc-invoke-form-label {
  width: 20%;
  display: block;
  float: left;
  text-align: right;
  margin: 10px;
  line-height: 40px;
}
.tc-invoke-form-paras {
  float: left;
}
.tc-invoke-form-paras>div {
  height: 60px;
  overflow: hidden;
}
.tc-invoke-form-paras .key {
  width: 160px;
  margin: 10px;
}
.tc-invoke-form-paras .value {
  width: 240px;
  margin: 10px;
}
.tc-incoke-para-remove {
  float: right;
  font-size: 20px;
  color: #ddd;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  transform: rotate(45deg);
  cursor: pointer;
  margin: 20px 10px;
  transition: color .3s;
}
.tc-incoke-para-remove:hover {
  color: red;
}
#tc-incoke-form-addpara {
  height: 40px;
  width: 40px;
  border: solid 1px #ddd;
  border-radius: 20px;
  box-sizing: border-box;
  display: inline-block;
  margin: 10px;
  text-align: center;
  line-height: 38px;
  color: #ddd;
  font-size: 20px;
  cursor: pointer;
}
.tc-invoke-form-method li {
  float: left;
  line-height: 38px;
  padding: 0 14px;
  color: #bbb;
  border: solid 1px #ddd;
  border-right: none;
  cursor: pointer;
  transition: color .4s;
  position: relative;
}
.tc-invoke-form-method li:first-child {
  border-radius: 3px 0 0 3px;
}
.tc-invoke-form-method li:last-child {
  border-radius: 0 3px 3px 0;
  border-right: solid 1px #ddd;
}
.tc-invoke-form-method li:hover {
  color: #0d85da;
}
.tc-invoke-form-method .focus {
  border-color: #0d85da !important;
  color: #0d85da;
}
.tc-invoke-form-method .focus:after {
  content: '';
  width: 1px;
  height: 40px;
  position: absolute;
  top: -1px;
  right: -1px;
  background-color: #0d85da;
  z-index: 3;
}
.tc-invoke-form-method .focus:last-child:after {
  width: 0;
}
#tc-invoke-submit {
  height: 40px;
  box-sizing: border-box;
  line-height: 40px;
  border-radius: 3px;
  display: inline-block;
  margin: 10px;
  background-color: #0072c1;
}
#tc-invoke-submit div {
  border-radius: 3px;
  padding: 0 20px;
  height: 100%;
  background-color: #bbb;
  color: #fff;
  transition: .4s;
}
#tc-invoke-submit .active {
  background-color: #0d85da;
  transform: translateY(-6px);
  cursor: pointer;
}
#tc-invoke-submit .active:hover {
  transform: translateY(-3px);
}

.scale-y-enter-active, .scale-y-leave-active {
  transition: height .6s;
}
.scale-y-enter, .scale-y-leave-to {
  height: 0 !important;
}
</style>
