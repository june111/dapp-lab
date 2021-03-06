let path = require('path')
let glob = require('glob')
const resolve = (dir) => path.join(__dirname, dir);

//配置pages多页面获取当前文件夹下的html和js
function getEntry(globPath) {
  let entries = {},
    basename, tmp, pathname, appname;

  glob.sync(globPath).forEach(function(entry) {
    basename = path.basename(entry, path.extname(entry));
    // console.log(entry)
    tmp = entry.split('/').splice(-3);
    console.log(tmp)
    pathname = basename; // 正确输出js和html的路径

    // console.log(pathname)
    entries[pathname] = {
      entry: 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[1] + '.js',
      template: 'src/' + tmp[0] + '/' + tmp[1] + '/' + tmp[2],
      title: tmp[2],
      filename: tmp[2],
      favicon:'src/static/favicon.ico'
    };
  });
  return entries;
}

let pages = getEntry('./src/pages/**?/*.html');
console.log(pages)
//配置end

module.exports = {
  lintOnSave: false, //禁用eslint
  // baseUrl:process.env.NODE_ENV === "production"?'https://www.mycdn.com/':'/',
  publicPath: 'dapp-lab/',
  outputDir: 'docs',
  productionSourceMap: false,
  pages,
  devServer: {
    index: 'index.html', //默认启动serve 打开page1页面
    open: process.platform === 'darwin',
    host: '',
    port: 8088,
    https: false,
    hotOnly: false,
    proxy: {
      '/xrf/': {
        target: 'http://reg.tool.hexun.com/',
        changeOrigin: true,
        pathRewrite: {
          '^/xrf': ''
        }
      },
    }, 
    // 设置代理
    before: app => {}
  },
  chainWebpack: config => {
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        // 修改它的选项...
        options.limit = 100
        return options
      })
    Object.keys(pages).forEach(entryName => {
      config.plugins.delete(`prefetch-${entryName}`);
    });
    // 添加别名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('static', resolve('src/static'))
      .set('utils', resolve('src/utils'))
      .set('contracts', resolve('src/contracts'));

  },
  configureWebpack: config => {
 // cdn引用时配置externals
    externals: {
      'vue': 'Vue',
      'vuex': 'Vuex',
      'vue-router': 'VueRouter',
      'vue-i18n': 'VueI18n',
      'vuetify': 'Vuetify',
    }
  }
}
