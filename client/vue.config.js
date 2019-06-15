const path = require("path");

console.log("in config");

module.exports = {
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "scss",
      patterns: [path.resolve(__dirname, "./src/styles/global.scss")]
    }
  }
};

module.exports = {
  css: {
    loaderOptions: {
      sass: {
        data: `@import "~@/styles/global.scss";`
      }
    }
  }
};

module.exports = {
  devServer: {
    proxy: {
      "^/api": {
        target: "http://localhost:8090",
        ws: true,
        changeOrigin: true
      }
    }
  }
};
