'use strict';

(function () {
  var hoodie  = new window.Hoodie();
  var store = hoodie.open("hoodie-plugin-plugins");
  var pluginsList = $("#plugins-list");
  var searchField = $("#search");
  var loading = $("#loading");

  function filterList () {
    var keywords = $.trim(searchField.val().toLowerCase()),
    plugins = $(".plugin", pluginsList);

    if (!keywords) {
      return plugins.removeClass("hidden");
    }

    keywords = keywords.split(" ");

    plugins.each(function () {
      var plugin = $(this);
      var found = 0;

      for (var i = 0; i < keywords.length; i++) {
        var keyword = $.trim(keywords[i]);
        if (keyword && plugin.text().toLowerCase().indexOf(keyword) > -1) {
          found++;
        }
      }

      if (found !== keywords.length) {
        plugin.addClass("hidden");
      } else {
        plugin.removeClass("hidden");
      }
    });

  }

  searchField.keyup(filterList);

  var dfd = $.Deferred();

  store.findAll("plugin").done(function (plugins) {
    plugins.forEach(function (p) {
      p.name = p.id.replace("hoodie-plugin-", "");

      if (p.maintainers) {
        p.maintainers = p.maintainers.map(function (m, i) {
          if (Object.prototype.toString.call(m) === '[object String]') {
            return {name: m.replace("=", "")};
          }
          return m;
        });
      }
    });

    plugins.sort(function (a, b) {
      return a.time > b.time ? -1 : a.time < b.time ? 1 : 0;
    }),

    plugins = plugins.filter(function (p) {
      return p.id !== 'hoodie-plugin-plugins';
    });

    if (plugins.length) {
      searchField.prop("disabled", false);
      $("#loading").hide();
    }

    dfd.then(filterList);
    dfd.resolve({plugins: plugins});
  });

  dfd.promise();

  dfd.then(function (data) {
    var source = $('#plugin').html();
    $('#plugins-list').append(Handlebars.compile(source)(data));
  });


  store.connect();

  loading.addClass("fade-in");

})();

