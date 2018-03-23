<template>
  <div id="chaincode">
    <ul class="tc-chaincode-lists">
      <li>
        <div class="tc-chaincode-add" :class="{'tc-box-add-focus': isInputing}">
          <div class="tc-box-add">
            <div class="tc-button-add" @click.stop="addChaincode">+ Add Chaincode</div>
            <div class="tc-input-add">
              <p>Git of your Chaincode</p>
              <input type="text">
              <span style="float: left;" @click.stop="stopInput">back</span>
              <span style="float: right;" @click.stop="stopInput">deploy</span>
            </div>
          </div>
        </div>
      </li>
      <li>
        <div class="tc-card tc-chaincode">
          <p class="tc-chaincode-name">Chaincode 1</p>
          <p class="tc-chaincode-intro">Introduction</p>
        </div>
      </li>
    </ul>
    <div class="clear"></div>
  </div>
</template>

<script>
export default {
  name: 'chaincode',
  data: () => {
    return {
      isInputing: false
    }
  },
  methods: {
    addChaincode () {
      this.isInputing = true
    },
    stopInput () {
      this.isInputing = false
    }
  }
}
</script>

<style>
#chaincode {
  padding: 30px;
}
.tc-chaincode-add {
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
  width: 100%;
}
.tc-input-add span {
  margin-top: 20px;
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
.tc-chaincode-add:hover {
  border-color: #014676;
}
.tc-button-add:hover {
  color: #014676;
}
.tc-chaincode-lists li {
  padding: 10px;
  float: left;
}
.tc-chaincode {
  height: 140px;
  width: 300px;
  background-color: #fff;
  box-sizing: border-box;
  color: #333;
  border-left: solid 6px #091;
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
</style>
