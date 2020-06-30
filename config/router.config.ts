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
        routes: [
          {
            path: '/',
            redirect: '/category/list',
            authority: ['admin', 'category_list'],
          }, // category
          {
            path: '/category',
            name: 'category',
            icon: 'table',
            authority: ['admin', 'category'],
            routes: [
              {
                path: '/category/list',
                name: 'categoryList',
                component: './category/categoryList',
                authority: ['admin', 'category_list'],
              },
            ],
          }, // finance
          {
            path: '/finance',
            name: 'finance',
            icon: 'table',
            authority: ['admin', 'finance'],
            routes: [
              {
                path: '/finance/list',
                name: 'financeList',
                component: './finance/financeList',
                authority: ['admin', 'finance_list'],
              },
              {
                path: '/finance/book',
                name: 'financeBook',
                component: './finance/financeBook',
                authority: ['admin'],
              },
              {
                path: '/finance/book/detail/:id',
                name: 'financeDetail',
                component: './finance/financeBookDetail',
                authority: ['admin'],
                hideInMenu: true,
              },
            ],
          },
          // user
          {
            path: '/users',
            name: 'users',
            icon: 'table',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/users/list',
                name: 'userList',
                component: './user/userList',
                authority: ['admin', 'user_list'],
              },
            ],
          },
          {
            name: 'result',
            icon: 'check-circle-o',
            path: '/result',
            hideInMenu: true,
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
            hideInMenu: true,
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
