// miniprogram/pages/index/index.js

function setTimeout2(milliseconds, callback) {
  return setTimeout(callback, milliseconds);
}

function promisify(f, ...args) {
  return () => {
    new Promise((resolve, reject) => {
      f.apply(this, ...args, resolve);
    })
  };
}

(async () => {
  let x = 0;
  x++;
  // setTimeout(() => {
  //   x++;
  // }, 1000);
  await promisify(setTimeout2, 1000);
  x++;
})();


Page({

  /**
   * Page initial data
   */
  data: {
    setID: null, //"be7fb3985ff40a4c02d995ba70470ee3",
    setOpenID: null,
    listID: null, //"ce805e785ff40a4c0350122530c654e5"
  },

  async addSet() {
    const db = wx.cloud.database();
    db.collection('set').add({
      data: {
        name: "看电影",
        description: "一起去看《2001太空漫游》",
        location: "博纳影院西溪店",
        date: new Date("2021-01-20 21:30:00"),
        geo_point: new db.Geo.Point(113.4323, 23.2115),
        contact: "13901220010",
      },
      success: res => {
        this.setData({
          setID: res._id
        })
        console.log("Add set success");
        //this.getSetOpenID();/////////////////
        //await this.addList()
      },
      fail: err => {
        console.log("Error: Add set failed");
        console.log(err);
      }
    })
  },

  async getSetOpenID() {
    const db = wx.cloud.database();
    db.collection('set').doc(this.data.setID).field({
      _openid: true
    }).get({
      success: res => {
        console.log(`Get set openid completed: ${res.data._openid}`)
        this.setData({
          setOpenID: res.data._openid
        })
        //this.addList();
        console.log(this.data.setOpenID)
      },
      fail: err => {
        console.log("Error: Get set openid failed");
        console.log(err);
      }
    })
  },

  async addList() {
    const db = wx.cloud.database();
    db.collection('list').add({
      data: {
        set_id: this.data.setID,   // this.data.setID needs to be set previously
        set_openid: this.data.setOpenID,    // this.data.setOpenID needs to be set previously
      },
      success: function(res) {
        console.log("Add list succeeded");
      },
      fail: function(err) {
        console.log("Error: Add list failed");
        console.log(err);
      }
    })
  },

  async addSetFinal() {
    await this.addSet();
    //console.log(qwerty)
    await this.getSetOpenID();
    await this.addList();
    //await this.getSetOpenID();
    //await this.addList();
  },

  removeList: function() {
    const db = wx.cloud.database();
    db.collection("list").doc(this.data.listID).remove({
      success: function(res) {
        console.log("Remove list succeeded")
      },
      fail: function(err) {
        console.log("Error: Remove list failed");
        console.log(err);
      }
    })
    /*
    where({
      _id: _.eq(this.data.listID)
    }).
    */
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})