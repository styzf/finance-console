export default [
  {
    path: '/',
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        component: '../layouts/UserLayout',
        routes: [
          {
            path: '/user',
            redirect: '/user/login',
          },
          {
            name: 'login',
            path: '/user/login',
            component: './user/login',
          },
          {
            name: 'register-result',
            path: '/user/register-result',
            component: './user/register-result',
          },
          {
            name: 'register',
            path: '/user/register',
            component: './user/register',
          },
          {
            component: '404',
          },
        ],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        Routes: ['src/pages/Authorized'],
        authority: ['admin', 'user'],
        routes: [
          {
            path: '/',
            redirect: '/finance/list',
            // authority: ['admin', 'user'],
          },
          // category
          {
            path: '/category',
            name: 'category',
            icon: 'table',
            routes: [
              {
                path: '/category/list',
                name: 'categoryList',
                component: './category/categoryList',
              },
            ],
          },
          // finance
          {
            path: '/finance',
            name: 'finance',
            icon: 'table',
            routes: [
              {
                path: '/finance/list',
                name: 'financeList',
                component: './finance/financeList',
              },
            ],
          },
          {
            name: 'result',
            icon: 'check-circle-o',
            path: '/result',
            routes: [
              {
                name: 'success',
                path: '/result/success',
                component: './result/success',
              },
              {
                name: 'fail',
                path: '/result/fail',
                component: './result/fail',
              },
            ],
          },
          {
            name: 'exception',
            icon: 'warning',
            path: '/exception',
            routes: [
              {
                name: '403',
                path: '/exception/403',
                component: './exception/403',
              },
              {
                name: '404',
                path: '/exception/404',
                component: './exception/404',
              },
              {
                name: '500',
                path: '/exception/500',
                component: './exception/500',
              },
            ],
          },
          {
            component: '404',
          },
        ],
      },
    ],
  },
];
