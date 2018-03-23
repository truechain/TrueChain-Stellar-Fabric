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
    path: '/chain',
    name: 'Chain',
    component: Chain
  },
  {
    path: '/chaincode',
    name: 'Chaincode',
    component: Chaincode
  },
  {
    path: '/log',
    name: 'Log',
    component: Log
  }
]
