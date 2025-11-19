/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
import EmptyLayout from '@/layouts/EmptyLayout'
import {publicPath, routerMode} from '@/config'

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
]

export const asyncRoutes = [
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },
  {
    path: "/personalCenter",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "personalCenter",
        name: "PersonalCenter",
        component: () => import("@/views/personalCenter/index"),
        meta: {
          title: "个人中心",
          icon: "map-pin",
          permissions: ["admin"],
        },
      },
    ],
  },{
    path: "/alarm",
    component: Layout,
    redirect: "/alarm/index",
    meta: {
      title: "报警中心",
      icon: "mars",
      permissions: ["admin"],
    },
    children: [
      // {
      //   path: "index",
      //   name: "AlarmMain",
      //   component: () => import("@/views/alarm/index"),
      //   meta: {
      //     title: "报警概览",
      //     icon: "home",
      //     permissions: ["admin"],
      //   },
      // },
      {
        path: "config",
        name: "AlarmConfig",
        component: () => import("@/views/alarm/config/index"),
        meta: {
          title: "报警配置",
          icon: "ambulance",
          permissions: ["admin"],
        },
      },
      // {
      //   path: "report",
      //   name: "AlarmConfigReport",
      //   component: () => import("@/views/alarm/configReport/index"),
      //   meta: {
      //     title: "报警记录",
      //     icon: "air-freshener",
      //     permissions: ["admin"],
      //   },
      // },
    ],
  },
  {
    path: "/aimodel",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "aimodel",
        name: "Aimodel",
        component: () => import("@/views/aimodel/index"),
        meta: {
          title: "我的AI模型",
          icon: "oil-can",
          permissions: ["admin"],
        },
      },
    ],
  },
    {
    path: "/prompt",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "prompt",
        name: "Prompt",
        component: () => import("@/views/prompt/index"),
        meta: {
          title: "提示词配置",
          icon: "neuter",
          permissions: ["admin"],
        },
      },
    ],
  },
  {    path: "/aiTrading",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "aiTrading",
        name: "AiTrading",
        component: () => import("@/views/aiTrading/index"),
        meta: {
          title: "实时AI交易",
          icon: "chart-line",
          permissions: ["admin"],
        },
      },
    ],
  },
  {
    path: "/tradingCenter",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "tradingCenter",
        name: "TradingCenter",
        component: () => import("@/views/tradingCenter/index"),
        meta: {
          title: "交易中心",
          icon: "dollar-sign",
          permissions: ["admin"],
        },
      },
    ],
  },
  // {
  //   path: "/localTrading",
  //   component: Layout,
  //   redirect: "noRedirect",
  //   children: [
  //     {
  //       path: "localTrading",
  //       name: "LocalTrading",
  //       component: () => import("@/views/localTrading/index"),
  //       meta: {
  //         title: "实时本地交易",
  //         icon: "chart-pie",
  //         permissions: ["preview"],
  //       },
  //     },
  //   ],
  // },
  {
    path: "/backtest",
    component: Layout,
    redirect: "noRedirect",
    children: [
      {
        path: "backtest",
        name: "Backtest",
        component: () => import("@/views/backtest/index"),
        meta: {
          title: "回测中心",
          icon: "pallet",
          permissions: ["admin"],
        },
      },
    ],
  },
  {
    path: "/strategicMarket",
    component: Layout,
    redirect: "noRedirect",
    meta: {
        title: "策略市场",
        icon: "biohazard",
        permissions: ["admin"],
    },
    children: [
      {
        path: "indicatorCenter",
        name: "IndicatorCenter",
        component: () => import("@/views/strategicMarket/indicatorCenter/index"),
        meta: {
          title: "公布指标",
          icon: "book-open",
          permissions: ["admin"],
        },
      },
        {
        path: "strategicMarket",
        name: "StrategicMarket",
        component: () => import("@/views/strategicMarket/strategy/index"),
        meta: {
          title: "公布策略",
          icon: "brain",
          permissions: ["admin"],
        },
      },
      // 我的指标、我的策略、我的提示词
      // 指标扩展
      // {
      //   path: "indicatorCenter",
      //   name: "IndicatorCenter",
      //   component: () => import("@/views/strategicMarket/indicatorCenter/index"),
      //   meta: {
      //     title: "我的指标",
      //     icon: "book-open",
      //     permissions: ["admin"],
      //   },
      // },
      //   {
      //   path: "strategicMarket",
      //   name: "StrategicMarket",
      //   component: () => import("@/views/strategicMarket/strategy/index"),
      //   meta: {
      //     title: "我的策略",
      //     icon: "brain",
      //     permissions: ["admin"],
      //   },
      // },
    ],
  },
  {
    path: "/exchange",
    component: Layout,
    redirect: "noRedirect",
    meta: {
        title: "交易所管理",
        icon: "mars-double",
        permissions: ["admin"],
    },
    children: [
      // {
      //   path: "exchangeApi",
      //   name: "ExchangeApi",
      //   component: () => import("@/views/exchange/supportApi/index"),
      //   meta: {
      //     title: "API中心",
      //     icon: "mars-stroke",
      //     permissions: ["admin"],
      //   },
      // },{
      //   path: "crawler",
      //   name: "Crawler",
      //   component: () => import("@/views/exchange/crawler/index"),
      //   meta: {
      //     title: "爬虫中心",
      //     icon: "mars-stroke-h",
      //     permissions: ["admin"],
      //   },
      // },
      {
        path: "klineHistory",
        name: "KlineHistory",
        component: () => import("@/views/exchange/klineHistory/index"),
        meta: {
          title: "K线历史数据",
          icon: "chart-pie",
          permissions: ["admin"],
        },
      },
    ],
  },
  // {
  //   path: '/personnelManagement',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'PersonnelManagement',
  //   meta: {title: '配置中心', icon: 'users-cog', permissions: ['admin']},
  //   children: [
  //     {
  //       path: 'userManagement',
  //       name: 'UserManagement',
  //       component: () => import('@/views/personnelManagement/userManagement/index'),
  //       meta: {title: '用户管理', icon: 'users', permissions: ['admin']},
  //     },
  //     {
  //       path: 'roleManagement',
  //       name: 'RoleManagement',
  //       component: () => import('@/views/personnelManagement/roleManagement/index'),
  //       meta: {title: '角色管理', icon: 'user-shield', permissions: ['admin']},
  //     },
  //     {
  //       path: 'menuManagement',
  //       name: 'MenuManagement',
  //       component: () => import('@/views/personnelManagement/menuManagement/index'),
  //       meta: {title: '菜单管理', icon: 'bars', permissions: ['admin']},
  //     },
  //     {
  //       path: 'personAuth',
  //       name: 'PersonAuth',
  //       component: () => import('@/views/personnelManagement/personAuth/index'),
  //       meta: {
  //         title: '角色权限',
  //         icon: 'barcode',
  //         permissions: ['admin'],
  //       },
  //     },
  //   ],
  // },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  location.reload()
}

export default router
