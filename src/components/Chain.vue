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
              <td>{{item.hash}}</td>
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
            <tr v-for="item in transInfo" :key="transInfo.indexOf(item)">
              <td>{{item.hash}}</td>
              <td>{{item.time}}</td>
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
import api from '@/api-config'

export default {
  name: 'chain',
  data: () => {
    return {
      baseInfo: [
        {name: 'Peer', value: '...', img: require('@/assets/icon/peer.png')},
        {name: 'Block', value: '...', img: require('@/assets/icon/block.png')},
        {name: 'Chaincode', value: '...', img: require('@/assets/icon/contract.png')},
        {name: 'Transaction', value: '...', img: require('@/assets/icon/transaction.png')}
      ],
      blockInfo: [],
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
    this.$emit('routerinit', this)

    if (!window.installedCcInfo) {
      this.getInstalledCc()
    } else {
      this.baseInfo[2].value = window.installedCcInfo.length
    }

    api.getRecentBlock().then((res) => {
      let data = res.data
      this.baseInfo[0].value = 4
      this.baseInfo[1].value = data.count
      this.blockInfo = data.rows.map((item) => {
        return {
          id: item.blockId,
          hash: item.data_hash,
          trans: item.transNum,
          time: item.timestamp
        }
      })
      this.$nextTick(this.updateSize)
    })
    api.getRecentTrans().then((res) => {
      let data = res.data
      this.baseInfo[3].value = data.count
      this.transInfo = data.rows.map((item) => {
        return {
          hash: item.hash,
          time: item.timestamp
        }
      })
      this.$nextTick(this.updateSize)
    }).catch(() => {
      window.notice('#d21107', 'Network Error! Can not get the transaction info!', 3000)
    })
  },
  mounted () {
    this.height = this.$el.getBoundingClientRect().height
    this.$el.addEventListener('mousewheel', this.onMousewheel)
    window.addEventListener('resize', this.updateSize)
  },
  methods: {
    getInstalledCc () {
      api.queryChaincodes('peer1', 'installed').then((res) => {
        if (typeof (res.data) === 'object') {
          window.installedCcInfo = res.data
          this.baseInfo[2].value = res.data.length
        } else {
          setTimeout(this.getInstalledCc, 2000)
        }
      }).catch(() => {
        window.notice('#d21107', 'Network Error! Can not get the Chaincode info!', 3000)
      })
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
