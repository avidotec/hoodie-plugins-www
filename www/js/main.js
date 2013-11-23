(function () {
  var hoodie  = new Hoodie()
    , store = hoodie.open("hoodie-plugin-plugins")
    , pluginsList = $("#plugins-list")
    , searchField = $("#search")
    , loading = $("#loading")

  function filterList () {
    var keywords = $.trim(searchField.val().toLowerCase())
      , plugins = $(".plugin", pluginsList)

    if (!keywords) return plugins.removeClass("hidden")

    keywords = keywords.split(" ")

    plugins.each(function () {
      var plugin = $(this)
        , found = 0

      for (var i = 0; i < keywords.length; i++) {
        var keyword = $.trim(keywords[i])
        if (keyword && plugin.text().toLowerCase().indexOf(keyword) > -1) {
          found++
        }
      }

      if (found != keywords.length) {
        plugin.addClass("hidden")
      } else {
        plugin.removeClass("hidden")
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

      plugins.sort(function (a, b) {
        return a.time > b.time ? -1 : a.time < b.time ? 1 : 0
      })

      plugins = plugins.filter(function (p) {
        return p.id != "hoodie-plugin-plugins"
      })

      if (plugins.length) {
        searchField.prop("disabled", false)
        $("#loading").hide()
      }

      defer.then(filterList)
      defer.resolve({plugins: plugins})
    })

    return defer.promise()
  }, {store: store})

  store.connect()

  loading.addClass("fade-in")

})()

