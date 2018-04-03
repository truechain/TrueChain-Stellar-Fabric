<template>
  <div id="tc-app">
    <nav :class="{'tc-nav-login': $route.name === null}">
      <img class="tc-nav-logo" src="./assets/logo.png" alt="logo" height="60">
      <div v-if="$route.name !== null">
        <div class="tc-nav-title" v-for="item in routes" :key="routes.indexOf(item)" :class="{'tc-nav-title-focus': $route.name === item.name}" @click="$router.push(item.path)">{{item.name}}</div>
      </div>
      <div class="tc-login" v-if="$route.name === null">
        <div>Name<input type="text" v-model="username"></div>
        <div>orgName<input type="text" v-model="orgname"></div>
        <span @click.stop="signIn">Sign in</span>
      </div>
    </nav>
    <div id="tc-content">
      <div id="tc-user" @mouseleave="closeUserCtrl" :class="{'tc-user-hide': $route.name === null, 'tc-user-ctrl-open': userCtrlisOpen}">
        <div class="tc-user-info" @mouseover="openUserCtrl">
          {{userInfo.name}}
        </div>
        <div class="tc-user-ctrl">
          <span @click.stop="signOut">Sign out</span>
        </div>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
import routes from './router/routes.js'
import api from '@/api-config'

window.api = api

export default {
  name: 'App',
  data: () => {
    return {
      routes,
      userInfo: {
        name: 'testUser'
      },
      username: '',
      orgname: '',
      userCtrlisOpen: false
    }
  },
  mounted () {
    window.el = this
  },
  methods: {
    signIn () {
      api.enroll(this.username, this.orgname).then(function (response) {
        // do something to get token
        let d = new Date()
        d.setMinutes(d.getMinutes + 30)
        window.cookieStorage.setItem('userToken', 'anyValue', {
          expires: d
        })
        console.log(response)
      }).catch(function (error) {
        console.log(error)
      })
      this.$router.push('/chain')
    },
    signOut () {
      window.cookieStorage.setItem('userToken', 'anyValue', {
        expires: new Date()
      })
      this.$router.push('/')
    },
    openUserCtrl () {
      this.userCtrlisOpen = true
    },
    closeUserCtrl () {
      this.userCtrlisOpen = false
    }
  }
}
</script>

<style>
#tc-app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  display: flex;
}
nav {
  color: #fff;
  width: 200px;
  height: 100vh;
  flex: 0 0 200px;
  background-color: #014676;
  box-shadow: 4px 0 8px #0001;
  position: relative;
  z-index: 10;
  transition: flex 1s;
  overflow: hidden;
}
.tc-nav-login {
  flex: 0 0 400px;
}
.tc-nav-logo {
  display: block;
  margin: auto;
  height: 60px;
  padding: 30px 0;
}
.tc-nav-title {
  cursor: pointer;
  padding-left: 20px;
  height: 50px;
  line-height: 50px;
  opacity: .6;
  transition: opacity 1s, background 0.6s;
  margin: 5px 0;
}
.tc-nav-title-focus {
  opacity: 1;
  color: #014676;
  background-color: #fff;
}
.tc-nav-title:hover {
  opacity: 1;
}
.tc-login {
  padding: 60px;
  width: 280px;
}
.tc-login input {
  float: right;
  width: 200px;
}
.tc-login div {
  height: 30px;
  line-height: 30px;
  margin-bottom: 20px;
  clear: both;
}
.tc-login span {
  clear: both;
  cursor: pointer;
}
#tc-content {
  flex: auto;
  background-color: #f0f4f8;
}
#tc-user {
  position: relative;
  z-index: 9;
  height: 60px;
  background-color: #fff;
  box-shadow: 0 2px 4px #0001;
  transition: transform .4s;
}
.tc-user-hide {
  transform: translateY(-70px);
}
.tc-user-info {
  float: right;
  padding: 0 20px;
  margin-right: 10px;
  line-height: 60px;
  cursor: pointer;
  background-color: #fff;
  position: relative;
  z-index: 11;
  transition: background-color .5s;
}
.tc-user-ctrl {
  line-height: 60px;
  float: right;
  transition: .5s;
  transform: translateX(100%)
}
.tc-user-ctrl span {
  padding: 0 10px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: color .5s;
}
.tc-user-ctrl span:hover {
  color: #014676;
}
.tc-user-ctrl-open .tc-user-info {
  background-color: #eef4f9;
}
.tc-user-ctrl-open .tc-user-ctrl {
  transform: translateX(0)
}
</style>
