import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/index.js'
import LoginForm from '@/views/Forms/LoginForm.vue'
import RegisterForm from '@/views/Forms/RegisterForm.vue'
import Admin from "@/views/Admin";

import guest from './middleware/guest'
import auth from './middleware/auth'

import middlewarePipeline from './middlewarePipeline'
import Offers from "@/views/Offers";
import Statistics from "@/views/Statistics";
import Flows from "@/views/Flows";
import Orders from "@/views/Orders";
import Finance from "@/views/Finance";
import Profile from "@/views/Profile";
import DailyTab from "@/components/statisticTabs/DailyTab";
import HourlyTab from "@/components/statisticTabs/HourlyTab";
import OfferTab from "@/components/statisticTabs/OfferTab";
import FlowTab from "@/components/statisticTabs/FlowTab";
import SubTab from "@/components/statisticTabs/SubTab";
import SkuTab from "@/components/statisticTabs/SkuTab";
import OffersLiveTab from "@/components/statisticTabs/OffersLiveTab";
import GeoLiveTab from "@/components/statisticTabs/GeoLiveTab";
import Form from "@/views/Integration/Form";
import Api from "@/views/Integration/Api";
import Domains from "../views/Integration/Domains";
import IndividualPostback from "../views/Integration/IndividualPostback";
import GlobalPostback from "../views/Integration/GlobalPostback";

Vue.use(Router)

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/login',
            name: 'login',
            component: LoginForm,
            meta: {
                middleware: [
                    guest
                ]
            },
        },
        {
            path: '/register',
            name: 'register',
            component: RegisterForm,
            meta: {
                middleware: [
                    guest
                ]
            },
        },
        {
            path: '/',
            name: 'Admin',
            component: Admin,
            redirect: '/offers',
            meta: {
                middleware: [
                    auth
                ]
            },
            children: [
                {
                    path: '/profile',
                    name: 'Profile',
                    component: Profile,
                    meta: {
                        middleware: [
                            auth
                        ]
                    },
                },
                {
                    path: '/offers',
                    name: 'Offers',
                    component: Offers,
                    meta: {
                        middleware: [
                            auth
                        ]
                    },
                },
                {
                    path: '/statistics',
                    name: 'Statistics',
                    component: Statistics,
                    meta: {
                        middleware: [
                            auth
                        ]
                    },
                    children: [
                        {
                            name: 'Statistics by days',
                            path: 'daily',
                            component: DailyTab
                        },
                        {
                            name: 'Statistics by hours',
                            path: 'hourly',
                            component: HourlyTab
                        },
                        {
                            name: 'Statistics by offers',
                            path: 'offer',
                            component: OfferTab
                        },
                        {
                            name: 'Statistics by flows',
                            path: 'flow',
                            component: FlowTab
                        },
                        {
                            name: 'Statistics by sub',
                            path: 'sub',
                            component: SubTab
                        },
                        {
                            name: 'Delivery sku',
                            path: 'sku',
                            component: SkuTab
                        },
                        {
                            name: 'Offers Live',
                            path: 'offers-live',
                            component: OffersLiveTab
                        },
                        {
                            name: 'Geo Live',
                            path: 'geo-live',
                            component: GeoLiveTab
                        }
                    ]
                },
                {
                    path: '/flows',
                    name: 'Flows',
                    component: Flows,
                    meta: {
                        middleware: [
                            auth
                        ]
                    }
                },
                {
                    path: '/integration/api',
                    name: 'Api',
                    component: Api,
                    meta: {
                        middleware: [
                            auth
                        ]
                    }
                },
                {
                    path: '/integration/form',
                    name: 'Form',
                    component: Form,
                    meta: {
                        middleware: [
                            auth
                        ]
                    }
                },
                {
                    path: '/integration/postback/individual',
                    name: 'Individual Postback',
                    component: IndividualPostback,
                    meta: {
                        middleware: [
                            auth
                        ]
                    }
                },
                {
                    path: '/integration/postback/global',
                    name: 'Global Postback',
                    component: GlobalPostback,
                    meta: {
                        middleware: [
                            auth
                        ]
                    }
                },
                {
                    path: '/orders',
                    name: 'Orders',
                    component: Orders,
                    meta: {
                        middleware: [
                            auth
                        ]
                    }
                },
                {
                    path: '/integration/domains',
                    name: 'Domains',
                    component: Domains,
                    meta: {
                        middleware: [
                            auth
                        ]
                    }
                },
                {
                    path: '/finance',
                    name: 'Finance',
                    component: Finance,
                    meta: {
                        middleware: [
                            auth
                        ]
                    }
                },
            ],

        },
    ]
})

router.beforeEach((to, from, next) => {
    if (!to.meta.middleware) {
        return next()
    }
    const middleware = to.meta.middleware
    const context = {
        to,
        from,
        next,
        store
    }
    return middleware[0]({
        ...context,
        next: middlewarePipeline(context, middleware, 1)
    })
})

export default router