 const { override, fixBabelImports,addLessLoader} = require('customize-cra');
 module.exports = override(
      fixBabelImports('import', {
             libraryName: 'antd',
         libraryDirectory: 'es',
         style: true,
       }),
     addLessLoader({
         javascriptEnabled: true,
         /*这里可以更改主题色*/
         modifyVars: {
             '@primary-color': '#1DA57A',
             '@success-color': 'red'
         },
     })
 );