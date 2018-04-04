<template>
  <div id="tc-chain" :style="{transform: `translateY(${pageTranslateY}px)`}">
    <ul class="tc-chain-baseinfo">
      <li v-for="item in baseInfo" :key="baseInfo.indexOf(item)">
        <div class="tc-card" :style="{backgroundImage: `url(${item.img}`}">
          <p class="tc-chain-baseinfo-name">{{item.name}}</p>
          <p class="tc-chain-baseinfo-value">{{item.value}}</p>
        </div>
      </li>
    </ul>
    <div class="clear"></div>
    <ul class="tc-chain-boxs">
      <li>
        <div class="tc-card">
          <p class="tc-chain-box-title">Recent Block</p>
          <table class="tc-table">
            <colgroup>
              <col style="width: 10%; min-width: 10%;">
              <col style="width: 35%; min-width: 35%;">
              <col style="width: 20%; min-width: 20%;">
              <col style="width: 35%; min-width: 35%;">
            </colgroup>
            <tr>
              <th>ID</th>
              <th>Hash</th>
              <th>Transactions</th>
              <th>Creating Time</th>
            </tr>
            <tr v-for="item in blockInfo" :key="blockInfo.indexOf(item)">
              <td>{{item.id}}</td>
              <td>{{item.hash.slice(0, 15)}}...</td>
              <td>{{item.trans}}</td>
              <td>{{item.time}}</td>
            </tr>
          </table>
          <!-- <div v-if="blockPagedInfo.isPaged" class="tc-page-ctrl">
            <input type="text" v-model="blockPagedInfo.nowInPage"> / {{blockPagedInfo.pageNum}}
          </div> -->
          <div v-if="blockInfo.length === 0" class="no-data">No data</div>
        </div>
      </li>
      <li>
        <div class="tc-card">
          <p class="tc-chain-box-title">Recent Transaction</p>
          <table class="tc-table">
            <colgroup>
              <col style="width: 60%; min-width: 60%;">
              <col style="width: 40%; min-width: 40%;">
            </colgroup>
            <tr>
              <th>Transaction Content</th>
              <th>Creating Time</th>
            </tr>
          </table>
          <div v-if="transInfo.length === 0" class="no-data">No data</div>
        </div>
      </li>
    </ul>
    <div class="clear"></div>
  </div>
</template>

<script>
export default {
  name: 'chain',
  data: () => {
    return {
      baseInfo: [
        {name: 'Peer', value: '3', img: require('@/assets/icon/peer.png')},
        {name: 'Block', value: '0', img: require('@/assets/icon/block.png')},
        {name: 'Chaincode', value: '0', img: require('@/assets/icon/contract.png')},
        {name: 'Transaction', value: '0', img: require('@/assets/icon/transaction.png')}
      ],
      blockInfo: [
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'},
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'},
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'},
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'},
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'},
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'},
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'},
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'},
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'},
        // {id: 0, hash: 'b333288559db46ba9933fd30345fa4f415d533f5e852d5945d919e0e9d7bb87e', trans: 1, time: '2018-03-14 17:06:48'}
      ],
      blockPagedInfo: {
        isPaged: true,
        pageNum: 230,
        nowInPage: 5
      },
      transInfo: [],
      pageTranslateY: 0,
      height: 0
    }
  },
  created () {
    if (!window.cookieStorage.getItem('userToken')) {
      this.$router.push('/')
    }
  },
  mounted () {
    this.height = this.$el.getBoundingClientRect().height
    this.$el.addEventListener('mousewheel', this.onMousewheel)
    window.addEventListener('resize', this.updateSize)
  },
  methods: {
    updateSize () {
      this.height = this.$el.getBoundingClientRect().height
      this.onMousewheel()
    },
    onMousewheel (e) {
      if (e) {
        this.pageTranslateY += e.deltaY > 0 ? -90 : 90
      }
      if (this.pageTranslateY > 0) {
        this.pageTranslateY = 0
      }
      let contentH = window.innerHeight - 60
      if (this.height + this.pageTranslateY < contentH) {
        this.pageTranslateY = Math.min(contentH - this.height, 0)
      }
    }
  }
}
</script>

<style>
#tc-chain {
  padding: 30px;
}
.tc-chain-baseinfo li {
  width: 25%;
  float: left;
  padding: 10px;
  box-sizing: border-box;
}
.tc-chain-baseinfo li>div {
  background-size: 60px;
  background-repeat: no-repeat;
  background-position: 90% 50%;
}
.tc-chain-boxs li {
  width: 50%;
  float: left;
  padding: 10px;
  box-sizing: border-box;
}
.tc-chain-boxs li>div {
  min-height: 400px;
}
.tc-chain-baseinfo-name {
  font-size: 14px;
  line-height: 20px;
  color: #666;
}
.tc-chain-baseinfo-value {
  font-size: 20px;
  line-height: 30px;
}
.tc-chain-box-title {
  font-size: 18px;
  line-height: 30px;
  padding-bottom: 10px;
  border-bottom: solid 1px #bbb;
}
.tc-table {
  width: 100%;
  font-size: 14px;
  padding: 10px;
}
.tc-table th {
  font-weight: 400;
  padding: 10px;
}
.tc-table td {
  font-size: 12px;
  word-break: break-all;
  padding: 10px;
}
.tc-page-ctrl {
  display: table;
  font-size: 14px;
  margin: auto;
}
.tc-page-ctrl input {
  background-color: #fff;
  border: solid 1px #ddd;
  border-radius: 3px;
  padding: 3px 6px;
  width: 3em;
  box-sizing: border-box;
  display: inline-block;
}
@media screen and (max-width: 1300px) {
  .tc-chain-boxs li {
    width: 100%;
  }
}
@media screen and (max-width: 1000px) {
  .tc-chain-baseinfo li {
    width: 50%;
  }
}
</style>
