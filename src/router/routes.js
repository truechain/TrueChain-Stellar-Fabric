// import Home from '@/components/Home'
import Chaincode from '@/components/Chaincode'
import Invoke from '@/components/Invoke'
import Chain from '@/components/Chain'
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
    path: '/invoke',
    name: 'Invoke',
    component: Invoke
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
