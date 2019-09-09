import { Request, Response } from 'express';
import { parse } from 'url';
import { TableListItem, TableListParams } from './data.d';

// mock tableListDataSource
let tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 1; i++) {
  tableListDataSource.push({
    key: i + '',
    name: `London Park no. ${i}`,
    age: 32,
    address: Math.round(Math.random() * 100000) + `${i}`,
    categoryId: i + '',
    1: Math.round(Math.random() * 100000) ,
    2: Math.round(Math.random() * 100000) ,
    3: Math.round(Math.random() * 100000) ,
    4: Math.round(Math.random() * 100000) ,
    5: Math.round(Math.random() * 100000) ,
    6: Math.round(Math.random() * 100000) ,
    7: Math.round(Math.random() * 100000) ,
    8: Math.round(Math.random() * 100000) ,
    9: Math.round(Math.random() * 100000) ,
    10: Math.round(Math.random() * 100000),
    11: Math.round(Math.random() * 100000),
    12: Math.round(Math.random() * 100000),
    13: Math.round(Math.random() * 100000),
    14: Math.round(Math.random() * 100000),
    15: Math.round(Math.random() * 100000),
    16: Math.round(Math.random() * 100000),
    17: Math.round(Math.random() * 100000),
    18: Math.round(Math.random() * 100000),
    19: Math.round(Math.random() * 100000),
    21: Math.round(Math.random() * 100000),
    22: Math.round(Math.random() * 100000),
    23: Math.round(Math.random() * 100000),
    24: Math.round(Math.random() * 100000),
    25: Math.round(Math.random() * 100000),
    26: Math.round(Math.random() * 100000),
    27: Math.round(Math.random() * 100000),
    28: Math.round(Math.random() * 100000),
    29: Math.round(Math.random() * 100000),
    30: Math.round(Math.random() * 100000),
    31: Math.round(Math.random() * 100000),
  });
}

function getRule(req: Request, res: Response, u: string) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = (parse(url, true).query as unknown) as TableListParams;

  let dataSource = tableListDataSource;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }
      return prev[s[0]] - next[s[0]];
    });
  }

  if (params.year && params.month) {
    dataSource.forEach(data => {
      for (let i = 0; i < 31; i++) {
        data[i + 1 + ''] = params.year + params.month + data[i + 1 + ''];
      }
      data.name = params.year + params.month + data.name;
    })
  }

  if (params.name) {
    // dataSource = dataSource.filter(data => data.name.indexOf(params.name) > -1);
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  return res.json(result);
}

function postRule(req: Request, res: Response, u: string, b: Request) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const body = (b && b.body) || req.body;
  const { method/*, key*/ } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    // case 'delete':
    //   tableListDataSource = tableListDataSource.filter(item => key.indexOf(item.key) === -1);
    //   break;
    // case 'post':
      // const i = Math.ceil(Math.random() * 10000);
      // tableListDataSource.unshift({
        // key: i,
        // href: 'https://ant.design',
        // avatar: [
        //   'https://gw.alipayobjects.com/zos/rmsportal/eeHMaZBwmTvLdIwMfBpg.png',
        //   'https://gw.alipayobjects.com/zos/rmsportal/udxAbMEhpwthVVcjLXik.png',
        // ][i % 2],
        // name: `TradeCode ${i}`,
        // title: `一个任务名称 ${i}`,
        // owner: '曲丽丽',
        // desc,
        // callNo: Math.floor(Math.random() * 1000),
        // status: Math.floor(Math.random() * 10) % 2,
        // updatedAt: new Date(),
        // createdAt: new Date(),
        // progress: Math.ceil(Math.random() * 100),
      // });
    //   break;
    // case 'update':
    //   tableListDataSource = tableListDataSource.map(item => {
    //     if (item.key === key) {
    //       return { ...item, desc, name };
    //     }
    //     return item;
    //   });
    //   break;
    default:
      break;
  }

  const result = {
    list: tableListDataSource,
    pagination: {
      total: tableListDataSource.length,
    },
  };

  return res.json(result);
}

export default {
  'GET /api/rule': getRule,
  'POST /api/rule': postRule,
};
