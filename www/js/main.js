(function () {
  var hoodie  = new Hoodie()
    , store = hoodie.open("hoodie-plugin-plugins")
    , pluginsList = $("#plugins-list")
    , searchField = $("#search")
    , loading = $("#loading")

  function filterList () {
    var q = searchField.val().toLowerCase()
      , plugins = $(".plugin", pluginsList)

    if (!q) return plugins.removeClass("hidden")

    plugins.each(function () {
      var plugin = $(this)
      if (plugin.text().toLowerCase().indexOf(q) == -1) {
        plugin.addClass("hidden")
      }
    })
  }

  searchField.keyup(filterList)

  hoodie.reactive(pluginsList, $("script", pluginsList).text(), function (store) {
    var defer = hoodie.defer()

    store.findAll("plugin").done(function (plugins) {
      plugins.forEach(function (p) {
        p.name = p.id.replace("hoodie-plugin-", "")

        if (p.maintainers) {
          p.maintainers = p.maintainers.map(function (m, i) {
            if (Object.prototype.toString.call(m) == "[object String]") {
              return {name: m.replace("=", "")}
            }
            return m
          })
        }
      })

      if (plugins.length) {
        searchField.prop("disabled", false)
        $("#loading").hide()
      }

      plugins.sort(function (a, b) {
        return a.time > b.time ? -1 : a.time < b.time ? 1 : 0
      })

      plugins = plugins.filter(function (p) {
        return p.id != "hoodie-plugin-plugins"
      })

      defer.then(filterList)
      defer.resolve({plugins: plugins})
    })

    return defer.promise()
  }, {store: store})

  store.connect()

  loading.addClass("fade-in")

})()

