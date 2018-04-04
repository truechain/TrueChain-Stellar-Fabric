// import Home from '@/components/Home'
import Chain from '@/components/Chain'
import Chaincode from '@/components/Chaincode'
import Log from '@/components/Log'

export default [
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  {
    path: '/chaincode',
    name: 'Chaincode',
    component: Chaincode
  },
  {
    path: '/chain',
    name: 'Chain',
    component: Chain
  },
  {
    path: '/log',
    name: 'Log',
    component: Log
  }
]
