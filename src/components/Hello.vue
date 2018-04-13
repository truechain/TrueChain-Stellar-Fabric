<template>
  <div id="hellopage">
    <div class="tc-card tc-hello-card">
      <h1>Hello!</h1>
      <p>Welcome to Steller. Currently it is a <span class="marked">test network</span>.</p>
      <p>Please <span class="blod">do not</span> upload <span class="marked">code or data that contains any private information</span> to the chain.</p>
    </div>
    <div class="tc-card tc-hello-signup">
      <ul>
        <li class="back" @click="stopSignUp">back</li>
        <li>User Name<input type="text" v-model="name" :class="{'green-border': nameIsOk}" @change="checkName"></li>
        <li>
          Password<input type="password" v-model="password" :class="{'green-border': passwordIsOk}" @change="checkPassword">
          <p class="msg">{{passwordCheckMsg}}</p>
        </li>
        <li>
          Repeat<input type="password" v-model="repeat" :class="{'green-border': repeatIsOk}" @change="repeatPassword">
          <p class="msg">{{repeatCheckMsg}}</p>
        </li>
        <li>Invitation code<input type="text" v-model="invtCode"></li>
      </ul>
      <div class="sign-up" :class="{'sign-up-button': isOpen}" >
        <span @click="signButtonClicked">Sign up</span>
        <loading-animation :color="'#333'" :isActive="signUpWaiting"></loading-animation>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api-config'

import loadingAnimation from '@/components/common/gui/loading'
import passwordStrength from 'owasp-password-strength-test'
passwordStrength.config({
  allowPassphrases: false,
  maxLength: 32,
  minLength: 8,
  minOptionalTestsToPass: 3
})

export default {
  name: 'hello',
  data: () => {
    return {
      name: '',
      nameIsOk: false,
      password: '',
      passwordIsOk: false,
      repeat: '',
      repeatIsOk: false,
      passwordCheckMsg: '',
      repeatCheckMsg: '',
      invtCode: '',
      isOpen: false,
      signUpWaiting: false
    }
  },
  methods: {
    checkName () {
      this.nameIsOk = Boolean(this.name)
    },
    checkPassword () {
      if (this.repeat !== '') {
        this.repeatPassword()
      }
      this.passwordIsOk = false
      let info = passwordStrength.test(this.password)
      if (info.strong) {
        this.passwordCheckMsg = ''
        this.passwordIsOk = true
      } else if (info.requiredTestErrors.length) {
        this.passwordCheckMsg = info.requiredTestErrors[0]
      } else {
        this.passwordCheckMsg = info.optionalTestErrors[0]
      }
    },
    repeatPassword () {
      this.repeatIsOk = false
      if (this.password === this.repeat) {
        this.repeatCheckMsg = ''
        if (this.repeat) {
          this.repeatIsOk = true
        }
      } else {
        this.repeatCheckMsg = 'The password entered twice is inconsistent.'
      }
    },
    signButtonClicked () {
      if (this.isOpen) {
        if (this.signUpWaiting) {
          return window.notice('#f78432', 'Do not submit requests frequently.', 3000)
        } else if (this.nameIsOk && this.passwordIsOk && this.repeatIsOk) {
          this.signUpWaiting = true
          api.signup(this.name, this.password, this.invtCode).then(res => {
            if (res.data.success) {
              window.notice('#4596f5', `Sign up successfully. Welcome ${this.name}`, 3000)
              this.stopSignUp()
            } else {
              return window.notice('#f78432', res.data.message, 4000)
            }
          }).catch(() => {
            window.notice('#d21107', 'Network Error!', 3000)
          }).then(() => { this.signUpWaiting = false })
        } else {
          window.notice('#f78432', 'Check out your Input.', 3000)
        }
      } else {
        let el = this.$el.querySelector('.tc-hello-signup ul')
        el.style.height = '280px'
        setTimeout(() => {
          if (this.isOpen) {
            el.style.height = 'auto'
          }
        }, 610)
        this.isOpen = true
      }
    },
    stopSignUp () {
      this.isOpen = false
      let el = this.$el.querySelector('.tc-hello-signup ul')
      el.style.height = '280px'
      setTimeout(() => {
        el.style.height = '0'
      })
      this.name = ''
      this.nameIsOk = false
      this.password = ''
      this.passwordIsOk = false
      this.repeat = ''
      this.repeatIsOk = false
      this.passwordCheckMsg = ''
      this.repeatCheckMsg = ''
      this.invtCode = ''
    }
  },
  components: {
    loadingAnimation
  }
}
</script>

<style lang="stylus" scoped>
.green-border
  border-left solid 6px #091
#hellopage
  position absolute
  width 100%
  padding 20px
  top 0
  left 0
  box-sizing border-box
  .tc-card
    margin 10px
    line-height 1.5em
    h1
      font-size 1.6em
      line-height 40px
      margin 0
    .blod
      font-weight bold
      text-transform uppercase
      color #014676
    .marked
      color #014676
  input
    transition border-left .4s
.tc-hello-signup
  ul
    height 0px
    transition height .6s
    margin-left 10px
    overflow hidden
    box-sizing border-box
  li
    clear both
    line-height 40px
    margin-bottom 20px
    width 320px
  input
    float right
  .msg
    color red
    font-size 12px
    margin-top 10px
    line-height 20px
  .back
    opacity .6
    cursor pointer
    transition opacity .4s
    font-size 14px
    line-height 20px
    &:hover
      opacity 1
  .sign-up
    line-height 40px
    font-weight bold
    font-size 1.6em
    transition .4s
    span
      cursor pointer
    & svg
      vertical-align bottom
    &:hover
      color #014676
  .sign-up-button
    font-size 1em
    transform translateX(10px)
</style>
