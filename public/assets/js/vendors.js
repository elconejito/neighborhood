!function() {
  var d3 = {
    version: "3.5.17"
  };
  var d3_arraySlice = [].slice, d3_array = function(list) {
    return d3_arraySlice.call(list);
  };
  var d3_document = this.document;
  function d3_documentElement(node) {
    return node && (node.ownerDocument || node.document || node).documentElement;
  }
  function d3_window(node) {
    return node && (node.ownerDocument && node.ownerDocument.defaultView || node.document && node || node.defaultView);
  }
  if (d3_document) {
    try {
      d3_array(d3_document.documentElement.childNodes)[0].nodeType;
    } catch (e) {
      d3_array = function(list) {
        var i = list.length, array = new Array(i);
        while (i--) array[i] = list[i];
        return array;
      };
    }
  }
  if (!Date.now) Date.now = function() {
    return +new Date();
  };
  if (d3_document) {
    try {
      d3_document.createElement("DIV").style.setProperty("opacity", 0, "");
    } catch (error) {
      var d3_element_prototype = this.Element.prototype, d3_element_setAttribute = d3_element_prototype.setAttribute, d3_element_setAttributeNS = d3_element_prototype.setAttributeNS, d3_style_prototype = this.CSSStyleDeclaration.prototype, d3_style_setProperty = d3_style_prototype.setProperty;
      d3_element_prototype.setAttribute = function(name, value) {
        d3_element_setAttribute.call(this, name, value + "");
      };
      d3_element_prototype.setAttributeNS = function(space, local, value) {
        d3_element_setAttributeNS.call(this, space, local, value + "");
      };
      d3_style_prototype.setProperty = function(name, value, priority) {
        d3_style_setProperty.call(this, name, value + "", priority);
      };
    }
  }
  d3.ascending = d3_ascending;
  function d3_ascending(a, b) {
    return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
  }
  d3.descending = function(a, b) {
    return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
  };
  d3.min = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && a > b) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && a > b) a = b;
    }
    return a;
  };
  d3.max = function(array, f) {
    var i = -1, n = array.length, a, b;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null && b > a) a = b;
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b > a) a = b;
    }
    return a;
  };
  d3.extent = function(array, f) {
    var i = -1, n = array.length, a, b, c;
    if (arguments.length === 1) {
      while (++i < n) if ((b = array[i]) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = array[i]) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    } else {
      while (++i < n) if ((b = f.call(array, array[i], i)) != null && b >= b) {
        a = c = b;
        break;
      }
      while (++i < n) if ((b = f.call(array, array[i], i)) != null) {
        if (a > b) a = b;
        if (c < b) c = b;
      }
    }
    return [ a, c ];
  };
  function d3_number(x) {
    return x === null ? NaN : +x;
  }
  function d3_numeric(x) {
    return !isNaN(x);
  }
  d3.sum = function(array, f) {
    var s = 0, n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = +array[i])) s += a;
    } else {
      while (++i < n) if (d3_numeric(a = +f.call(array, array[i], i))) s += a;
    }
    return s;
  };
  d3.mean = function(array, f) {
    var s = 0, n = array.length, a, i = -1, j = n;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) s += a; else --j;
    } else {
      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) s += a; else --j;
    }
    if (j) return s / j;
  };
  d3.quantile = function(values, p) {
    var H = (values.length - 1) * p + 1, h = Math.floor(H), v = +values[h - 1], e = H - h;
    return e ? v + e * (values[h] - v) : v;
  };
  d3.median = function(array, f) {
    var numbers = [], n = array.length, a, i = -1;
    if (arguments.length === 1) {
      while (++i < n) if (d3_numeric(a = d3_number(array[i]))) numbers.push(a);
    } else {
      while (++i < n) if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) numbers.push(a);
    }
    if (numbers.length) return d3.quantile(numbers.sort(d3_ascending), .5);
  };
  d3.variance = function(array, f) {
    var n = array.length, m = 0, a, d, s = 0, i = -1, j = 0;
    if (arguments.length === 1) {
      while (++i < n) {
        if (d3_numeric(a = d3_number(array[i]))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    } else {
      while (++i < n) {
        if (d3_numeric(a = d3_number(f.call(array, array[i], i)))) {
          d = a - m;
          m += d / ++j;
          s += d * (a - m);
        }
      }
    }
    if (j > 1) return s / (j - 1);
  };
  d3.deviation = function() {
    var v = d3.variance.apply(this, arguments);
    return v ? Math.sqrt(v) : v;
  };
  function d3_bisector(compare) {
    return {
      left: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) < 0) lo = mid + 1; else hi = mid;
        }
        return lo;
      },
      right: function(a, x, lo, hi) {
        if (arguments.length < 3) lo = 0;
        if (arguments.length < 4) hi = a.length;
        while (lo < hi) {
          var mid = lo + hi >>> 1;
          if (compare(a[mid], x) > 0) hi = mid; else lo = mid + 1;
        }
        return lo;
      }
    };
  }
  var d3_bisect = d3_bisector(d3_ascending);
  d3.bisectLeft = d3_bisect.left;
  d3.bisect = d3.bisectRight = d3_bisect.right;
  d3.bisector = function(f) {
    return d3_bisector(f.length === 1 ? function(d, x) {
      return d3_ascending(f(d), x);
    } : f);
  };
  d3.shuffle = function(array, i0, i1) {
    if ((m = arguments.length) < 3) {
      i1 = array.length;
      if (m < 2) i0 = 0;
    }
    var m = i1 - i0, t, i;
    while (m) {
      i = Math.random() * m-- | 0;
      t = array[m + i0], array[m + i0] = array[i + i0], array[i + i0] = t;
    }
    return array;
  };
  d3.permute = function(array, indexes) {
    var i = indexes.length, permutes = new Array(i);
    while (i--) permutes[i] = array[indexes[i]];
    return permutes;
  };
  d3.pairs = function(array) {
    var i = 0, n = array.length - 1, p0, p1 = array[0], pairs = new Array(n < 0 ? 0 : n);
    while (i < n) pairs[i] = [ p0 = p1, p1 = array[++i] ];
    return pairs;
  };
  d3.transpose = function(matrix) {
    if (!(n = matrix.length)) return [];
    for (var i = -1, m = d3.min(matrix, d3_transposeLength), transpose = new Array(m); ++i < m; ) {
      for (var j = -1, n, row = transpose[i] = new Array(n); ++j < n; ) {
        row[j] = matrix[j][i];
      }
    }
    return transpose;
  };
  function d3_transposeLength(d) {
    return d.length;
  }
  d3.zip = function() {
    return d3.transpose(arguments);
  };
  d3.keys = function(map) {
    var keys = [];
    for (var key in map) keys.push(key);
    return keys;
  };
  d3.values = function(map) {
    var values = [];
    for (var key in map) values.push(map[key]);
    return values;
  };
  d3.entries = function(map) {
    var entries = [];
    for (var key in map) entries.push({
      key: key,
      value: map[key]
    });
    return entries;
  };
  d3.merge = function(arrays) {
    var n = arrays.length, m, i = -1, j = 0, merged, array;
    while (++i < n) j += arrays[i].length;
    merged = new Array(j);
    while (--n >= 0) {
      array = arrays[n];
      m = array.length;
      while (--m >= 0) {
        merged[--j] = array[m];
      }
    }
    return merged;
  };
  var abs = Math.abs;
  d3.range = function(start, stop, step) {
    if (arguments.length < 3) {
      step = 1;
      if (arguments.length < 2) {
        stop = start;
        start = 0;
      }
    }
    if ((stop - start) / step === Infinity) throw new Error("infinite range");
    var range = [], k = d3_range_integerScale(abs(step)), i = -1, j;
    start *= k, stop *= k, step *= k;
    if (step < 0) while ((j = start + step * ++i) > stop) range.push(j / k); else while ((j = start + step * ++i) < stop) range.push(j / k);
    return range;
  };
  function d3_range_integerScale(x) {
    var k = 1;
    while (x * k % 1) k *= 10;
    return k;
  }
  function d3_class(ctor, properties) {
    for (var key in properties) {
      Object.defineProperty(ctor.prototype, key, {
        value: properties[key],
        enumerable: false
      });
    }
  }
  d3.map = function(object, f) {
    var map = new d3_Map();
    if (object instanceof d3_Map) {
      object.forEach(function(key, value) {
        map.set(key, value);
      });
    } else if (Array.isArray(object)) {
      var i = -1, n = object.length, o;
      if (arguments.length === 1) while (++i < n) map.set(i, object[i]); else while (++i < n) map.set(f.call(object, o = object[i], i), o);
    } else {
      for (var key in object) map.set(key, object[key]);
    }
    return map;
  };
  function d3_Map() {
    this._ = Object.create(null);
  }
  var d3_map_proto = "__proto__", d3_map_zero = "\x00";
  d3_class(d3_Map, {
    has: d3_map_has,
    get: function(key) {
      return this._[d3_map_escape(key)];
    },
    set: function(key, value) {
      return this._[d3_map_escape(key)] = value;
    },
    remove: d3_map_remove,
    keys: d3_map_keys,
    values: function() {
      var values = [];
      for (var key in this._) values.push(this._[key]);
      return values;
    },
    entries: function() {
      var entries = [];
      for (var key in this._) entries.push({
        key: d3_map_unescape(key),
        value: this._[key]
      });
      return entries;
    },
    size: d3_map_size,
    empty: d3_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, d3_map_unescape(key), this._[key]);
    }
  });
  function d3_map_escape(key) {
    return (key += "") === d3_map_proto || key[0] === d3_map_zero ? d3_map_zero + key : key;
  }
  function d3_map_unescape(key) {
    return (key += "")[0] === d3_map_zero ? key.slice(1) : key;
  }
  function d3_map_has(key) {
    return d3_map_escape(key) in this._;
  }
  function d3_map_remove(key) {
    return (key = d3_map_escape(key)) in this._ && delete this._[key];
  }
  function d3_map_keys() {
    var keys = [];
    for (var key in this._) keys.push(d3_map_unescape(key));
    return keys;
  }
  function d3_map_size() {
    var size = 0;
    for (var key in this._) ++size;
    return size;
  }
  function d3_map_empty() {
    for (var key in this._) return false;
    return true;
  }
  d3.nest = function() {
    var nest = {}, keys = [], sortKeys = [], sortValues, rollup;
    function map(mapType, array, depth) {
      if (depth >= keys.length) return rollup ? rollup.call(nest, array) : sortValues ? array.sort(sortValues) : array;
      var i = -1, n = array.length, key = keys[depth++], keyValue, object, setter, valuesByKey = new d3_Map(), values;
      while (++i < n) {
        if (values = valuesByKey.get(keyValue = key(object = array[i]))) {
          values.push(object);
        } else {
          valuesByKey.set(keyValue, [ object ]);
        }
      }
      if (mapType) {
        object = mapType();
        setter = function(keyValue, values) {
          object.set(keyValue, map(mapType, values, depth));
        };
      } else {
        object = {};
        setter = function(keyValue, values) {
          object[keyValue] = map(mapType, values, depth);
        };
      }
      valuesByKey.forEach(setter);
      return object;
    }
    function entries(map, depth) {
      if (depth >= keys.length) return map;
      var array = [], sortKey = sortKeys[depth++];
      map.forEach(function(key, keyMap) {
        array.push({
          key: key,
          values: entries(keyMap, depth)
        });
      });
      return sortKey ? array.sort(function(a, b) {
        return sortKey(a.key, b.key);
      }) : array;
    }
    nest.map = function(array, mapType) {
      return map(mapType, array, 0);
    };
    nest.entries = function(array) {
      return entries(map(d3.map, array, 0), 0);
    };
    nest.key = function(d) {
      keys.push(d);
      return nest;
    };
    nest.sortKeys = function(order) {
      sortKeys[keys.length - 1] = order;
      return nest;
    };
    nest.sortValues = function(order) {
      sortValues = order;
      return nest;
    };
    nest.rollup = function(f) {
      rollup = f;
      return nest;
    };
    return nest;
  };
  d3.set = function(array) {
    var set = new d3_Set();
    if (array) for (var i = 0, n = array.length; i < n; ++i) set.add(array[i]);
    return set;
  };
  function d3_Set() {
    this._ = Object.create(null);
  }
  d3_class(d3_Set, {
    has: d3_map_has,
    add: function(key) {
      this._[d3_map_escape(key += "")] = true;
      return key;
    },
    remove: d3_map_remove,
    values: d3_map_keys,
    size: d3_map_size,
    empty: d3_map_empty,
    forEach: function(f) {
      for (var key in this._) f.call(this, d3_map_unescape(key));
    }
  });
  d3.behavior = {};
  function d3_identity(d) {
    return d;
  }
  d3.rebind = function(target, source) {
    var i = 1, n = arguments.length, method;
    while (++i < n) target[method = arguments[i]] = d3_rebind(target, source, source[method]);
    return target;
  };
  function d3_rebind(target, source, method) {
    return function() {
      var value = method.apply(source, arguments);
      return value === source ? target : value;
    };
  }
  function d3_vendorSymbol(object, name) {
    if (name in object) return name;
    name = name.charAt(0).toUpperCase() + name.slice(1);
    for (var i = 0, n = d3_vendorPrefixes.length; i < n; ++i) {
      var prefixName = d3_vendorPrefixes[i] + name;
      if (prefixName in object) return prefixName;
    }
  }
  var d3_vendorPrefixes = [ "webkit", "ms", "moz", "Moz", "o", "O" ];
  function d3_noop() {}
  d3.dispatch = function() {
    var dispatch = new d3_dispatch(), i = -1, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    return dispatch;
  };
  function d3_dispatch() {}
  d3_dispatch.prototype.on = function(type, listener) {
    var i = type.indexOf("."), name = "";
    if (i >= 0) {
      name = type.slice(i + 1);
      type = type.slice(0, i);
    }
    if (type) return arguments.length < 2 ? this[type].on(name) : this[type].on(name, listener);
    if (arguments.length === 2) {
      if (listener == null) for (type in this) {
        if (this.hasOwnProperty(type)) this[type].on(name, null);
      }
      return this;
    }
  };
  function d3_dispatch_event(dispatch) {
    var listeners = [], listenerByName = new d3_Map();
    function event() {
      var z = listeners, i = -1, n = z.length, l;
      while (++i < n) if (l = z[i].on) l.apply(this, arguments);
      return dispatch;
    }
    event.on = function(name, listener) {
      var l = listenerByName.get(name), i;
      if (arguments.length < 2) return l && l.on;
      if (l) {
        l.on = null;
        listeners = listeners.slice(0, i = listeners.indexOf(l)).concat(listeners.slice(i + 1));
        listenerByName.remove(name);
      }
      if (listener) listeners.push(listenerByName.set(name, {
        on: listener
      }));
      return dispatch;
    };
    return event;
  }
  d3.event = null;
  function d3_eventPreventDefault() {
    d3.event.preventDefault();
  }
  function d3_eventSource() {
    var e = d3.event, s;
    while (s = e.sourceEvent) e = s;
    return e;
  }
  function d3_eventDispatch(target) {
    var dispatch = new d3_dispatch(), i = 0, n = arguments.length;
    while (++i < n) dispatch[arguments[i]] = d3_dispatch_event(dispatch);
    dispatch.of = function(thiz, argumentz) {
      return function(e1) {
        try {
          var e0 = e1.sourceEvent = d3.event;
          e1.target = target;
          d3.event = e1;
          dispatch[e1.type].apply(thiz, argumentz);
        } finally {
          d3.event = e0;
        }
      };
    };
    return dispatch;
  }
  d3.requote = function(s) {
    return s.replace(d3_requote_re, "\\$&");
  };
  var d3_requote_re = /[\\\^\$\*\+\?\|\[\]\(\)\.\{\}]/g;
  var d3_subclass = {}.__proto__ ? function(object, prototype) {
    object.__proto__ = prototype;
  } : function(object, prototype) {
    for (var property in prototype) object[property] = prototype[property];
  };
  function d3_selection(groups) {
    d3_subclass(groups, d3_selectionPrototype);
    return groups;
  }
  var d3_select = function(s, n) {
    return n.querySelector(s);
  }, d3_selectAll = function(s, n) {
    return n.querySelectorAll(s);
  }, d3_selectMatches = function(n, s) {
    var d3_selectMatcher = n.matches || n[d3_vendorSymbol(n, "matchesSelector")];
    d3_selectMatches = function(n, s) {
      return d3_selectMatcher.call(n, s);
    };
    return d3_selectMatches(n, s);
  };
  if (typeof Sizzle === "function") {
    d3_select = function(s, n) {
      return Sizzle(s, n)[0] || null;
    };
    d3_selectAll = Sizzle;
    d3_selectMatches = Sizzle.matchesSelector;
  }
  d3.selection = function() {
    return d3.select(d3_document.documentElement);
  };
  var d3_selectionPrototype = d3.selection.prototype = [];
  d3_selectionPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, group, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(subnode = selector.call(node, node.__data__, i, j));
          if (subnode && "__data__" in node) subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selector(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_select(selector, this);
    };
  }
  d3_selectionPrototype.selectAll = function(selector) {
    var subgroups = [], subgroup, node;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroups.push(subgroup = d3_array(selector.call(node, node.__data__, i, j)));
          subgroup.parentNode = node;
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_selectorAll(selector) {
    return typeof selector === "function" ? selector : function() {
      return d3_selectAll(selector, this);
    };
  }
  var d3_nsXhtml = "http://www.w3.org/1999/xhtml";
  var d3_nsPrefix = {
    svg: "http://www.w3.org/2000/svg",
    xhtml: d3_nsXhtml,
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace",
    xmlns: "http://www.w3.org/2000/xmlns/"
  };
  d3.ns = {
    prefix: d3_nsPrefix,
    qualify: function(name) {
      var i = name.indexOf(":"), prefix = name;
      if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
      return d3_nsPrefix.hasOwnProperty(prefix) ? {
        space: d3_nsPrefix[prefix],
        local: name
      } : name;
    }
  };
  d3_selectionPrototype.attr = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node();
        name = d3.ns.qualify(name);
        return name.local ? node.getAttributeNS(name.space, name.local) : node.getAttribute(name);
      }
      for (value in name) this.each(d3_selection_attr(value, name[value]));
      return this;
    }
    return this.each(d3_selection_attr(name, value));
  };
  function d3_selection_attr(name, value) {
    name = d3.ns.qualify(name);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrConstant() {
      this.setAttribute(name, value);
    }
    function attrConstantNS() {
      this.setAttributeNS(name.space, name.local, value);
    }
    function attrFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttribute(name); else this.setAttribute(name, x);
    }
    function attrFunctionNS() {
      var x = value.apply(this, arguments);
      if (x == null) this.removeAttributeNS(name.space, name.local); else this.setAttributeNS(name.space, name.local, x);
    }
    return value == null ? name.local ? attrNullNS : attrNull : typeof value === "function" ? name.local ? attrFunctionNS : attrFunction : name.local ? attrConstantNS : attrConstant;
  }
  function d3_collapse(s) {
    return s.trim().replace(/\s+/g, " ");
  }
  d3_selectionPrototype.classed = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") {
        var node = this.node(), n = (name = d3_selection_classes(name)).length, i = -1;
        if (value = node.classList) {
          while (++i < n) if (!value.contains(name[i])) return false;
        } else {
          value = node.getAttribute("class");
          while (++i < n) if (!d3_selection_classedRe(name[i]).test(value)) return false;
        }
        return true;
      }
      for (value in name) this.each(d3_selection_classed(value, name[value]));
      return this;
    }
    return this.each(d3_selection_classed(name, value));
  };
  function d3_selection_classedRe(name) {
    return new RegExp("(?:^|\\s+)" + d3.requote(name) + "(?:\\s+|$)", "g");
  }
  function d3_selection_classes(name) {
    return (name + "").trim().split(/^|\s+/);
  }
  function d3_selection_classed(name, value) {
    name = d3_selection_classes(name).map(d3_selection_classedName);
    var n = name.length;
    function classedConstant() {
      var i = -1;
      while (++i < n) name[i](this, value);
    }
    function classedFunction() {
      var i = -1, x = value.apply(this, arguments);
      while (++i < n) name[i](this, x);
    }
    return typeof value === "function" ? classedFunction : classedConstant;
  }
  function d3_selection_classedName(name) {
    var re = d3_selection_classedRe(name);
    return function(node, value) {
      if (c = node.classList) return value ? c.add(name) : c.remove(name);
      var c = node.getAttribute("class") || "";
      if (value) {
        re.lastIndex = 0;
        if (!re.test(c)) node.setAttribute("class", d3_collapse(c + " " + name));
      } else {
        node.setAttribute("class", d3_collapse(c.replace(re, " ")));
      }
    };
  }
  d3_selectionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.each(d3_selection_style(priority, name[priority], value));
        return this;
      }
      if (n < 2) {
        var node = this.node();
        return d3_window(node).getComputedStyle(node, null).getPropertyValue(name);
      }
      priority = "";
    }
    return this.each(d3_selection_style(name, value, priority));
  };
  function d3_selection_style(name, value, priority) {
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleConstant() {
      this.style.setProperty(name, value, priority);
    }
    function styleFunction() {
      var x = value.apply(this, arguments);
      if (x == null) this.style.removeProperty(name); else this.style.setProperty(name, x, priority);
    }
    return value == null ? styleNull : typeof value === "function" ? styleFunction : styleConstant;
  }
  d3_selectionPrototype.property = function(name, value) {
    if (arguments.length < 2) {
      if (typeof name === "string") return this.node()[name];
      for (value in name) this.each(d3_selection_property(value, name[value]));
      return this;
    }
    return this.each(d3_selection_property(name, value));
  };
  function d3_selection_property(name, value) {
    function propertyNull() {
      delete this[name];
    }
    function propertyConstant() {
      this[name] = value;
    }
    function propertyFunction() {
      var x = value.apply(this, arguments);
      if (x == null) delete this[name]; else this[name] = x;
    }
    return value == null ? propertyNull : typeof value === "function" ? propertyFunction : propertyConstant;
  }
  d3_selectionPrototype.text = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.textContent = v == null ? "" : v;
    } : value == null ? function() {
      this.textContent = "";
    } : function() {
      this.textContent = value;
    }) : this.node().textContent;
  };
  d3_selectionPrototype.html = function(value) {
    return arguments.length ? this.each(typeof value === "function" ? function() {
      var v = value.apply(this, arguments);
      this.innerHTML = v == null ? "" : v;
    } : value == null ? function() {
      this.innerHTML = "";
    } : function() {
      this.innerHTML = value;
    }) : this.node().innerHTML;
  };
  d3_selectionPrototype.append = function(name) {
    name = d3_selection_creator(name);
    return this.select(function() {
      return this.appendChild(name.apply(this, arguments));
    });
  };
  function d3_selection_creator(name) {
    function create() {
      var document = this.ownerDocument, namespace = this.namespaceURI;
      return namespace === d3_nsXhtml && document.documentElement.namespaceURI === d3_nsXhtml ? document.createElement(name) : document.createElementNS(namespace, name);
    }
    function createNS() {
      return this.ownerDocument.createElementNS(name.space, name.local);
    }
    return typeof name === "function" ? name : (name = d3.ns.qualify(name)).local ? createNS : create;
  }
  d3_selectionPrototype.insert = function(name, before) {
    name = d3_selection_creator(name);
    before = d3_selection_selector(before);
    return this.select(function() {
      return this.insertBefore(name.apply(this, arguments), before.apply(this, arguments) || null);
    });
  };
  d3_selectionPrototype.remove = function() {
    return this.each(d3_selectionRemove);
  };
  function d3_selectionRemove() {
    var parent = this.parentNode;
    if (parent) parent.removeChild(this);
  }
  d3_selectionPrototype.data = function(value, key) {
    var i = -1, n = this.length, group, node;
    if (!arguments.length) {
      value = new Array(n = (group = this[0]).length);
      while (++i < n) {
        if (node = group[i]) {
          value[i] = node.__data__;
        }
      }
      return value;
    }
    function bind(group, groupData) {
      var i, n = group.length, m = groupData.length, n0 = Math.min(n, m), updateNodes = new Array(m), enterNodes = new Array(m), exitNodes = new Array(n), node, nodeData;
      if (key) {
        var nodeByKeyValue = new d3_Map(), keyValues = new Array(n), keyValue;
        for (i = -1; ++i < n; ) {
          if (node = group[i]) {
            if (nodeByKeyValue.has(keyValue = key.call(node, node.__data__, i))) {
              exitNodes[i] = node;
            } else {
              nodeByKeyValue.set(keyValue, node);
            }
            keyValues[i] = keyValue;
          }
        }
        for (i = -1; ++i < m; ) {
          if (!(node = nodeByKeyValue.get(keyValue = key.call(groupData, nodeData = groupData[i], i)))) {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          } else if (node !== true) {
            updateNodes[i] = node;
            node.__data__ = nodeData;
          }
          nodeByKeyValue.set(keyValue, true);
        }
        for (i = -1; ++i < n; ) {
          if (i in keyValues && nodeByKeyValue.get(keyValues[i]) !== true) {
            exitNodes[i] = group[i];
          }
        }
      } else {
        for (i = -1; ++i < n0; ) {
          node = group[i];
          nodeData = groupData[i];
          if (node) {
            node.__data__ = nodeData;
            updateNodes[i] = node;
          } else {
            enterNodes[i] = d3_selection_dataNode(nodeData);
          }
        }
        for (;i < m; ++i) {
          enterNodes[i] = d3_selection_dataNode(groupData[i]);
        }
        for (;i < n; ++i) {
          exitNodes[i] = group[i];
        }
      }
      enterNodes.update = updateNodes;
      enterNodes.parentNode = updateNodes.parentNode = exitNodes.parentNode = group.parentNode;
      enter.push(enterNodes);
      update.push(updateNodes);
      exit.push(exitNodes);
    }
    var enter = d3_selection_enter([]), update = d3_selection([]), exit = d3_selection([]);
    if (typeof value === "function") {
      while (++i < n) {
        bind(group = this[i], value.call(group, group.parentNode.__data__, i));
      }
    } else {
      while (++i < n) {
        bind(group = this[i], value);
      }
    }
    update.enter = function() {
      return enter;
    };
    update.exit = function() {
      return exit;
    };
    return update;
  };
  function d3_selection_dataNode(data) {
    return {
      __data__: data
    };
  }
  d3_selectionPrototype.datum = function(value) {
    return arguments.length ? this.property("__data__", value) : this.property("__data__");
  };
  d3_selectionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      subgroup.parentNode = (group = this[j]).parentNode;
      for (var i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return d3_selection(subgroups);
  };
  function d3_selection_filter(selector) {
    return function() {
      return d3_selectMatches(this, selector);
    };
  }
  d3_selectionPrototype.order = function() {
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = group.length - 1, next = group[i], node; --i >= 0; ) {
        if (node = group[i]) {
          if (next && next !== node.nextSibling) next.parentNode.insertBefore(node, next);
          next = node;
        }
      }
    }
    return this;
  };
  d3_selectionPrototype.sort = function(comparator) {
    comparator = d3_selection_sortComparator.apply(this, arguments);
    for (var j = -1, m = this.length; ++j < m; ) this[j].sort(comparator);
    return this.order();
  };
  function d3_selection_sortComparator(comparator) {
    if (!arguments.length) comparator = d3_ascending;
    return function(a, b) {
      return a && b ? comparator(a.__data__, b.__data__) : !a - !b;
    };
  }
  d3_selectionPrototype.each = function(callback) {
    return d3_selection_each(this, function(node, i, j) {
      callback.call(node, node.__data__, i, j);
    });
  };
  function d3_selection_each(groups, callback) {
    for (var j = 0, m = groups.length; j < m; j++) {
      for (var group = groups[j], i = 0, n = group.length, node; i < n; i++) {
        if (node = group[i]) callback(node, i, j);
      }
    }
    return groups;
  }
  d3_selectionPrototype.call = function(callback) {
    var args = d3_array(arguments);
    callback.apply(args[0] = this, args);
    return this;
  };
  d3_selectionPrototype.empty = function() {
    return !this.node();
  };
  d3_selectionPrototype.node = function() {
    for (var j = 0, m = this.length; j < m; j++) {
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        var node = group[i];
        if (node) return node;
      }
    }
    return null;
  };
  d3_selectionPrototype.size = function() {
    var n = 0;
    d3_selection_each(this, function() {
      ++n;
    });
    return n;
  };
  function d3_selection_enter(selection) {
    d3_subclass(selection, d3_selection_enterPrototype);
    return selection;
  }
  var d3_selection_enterPrototype = [];
  d3.selection.enter = d3_selection_enter;
  d3.selection.enter.prototype = d3_selection_enterPrototype;
  d3_selection_enterPrototype.append = d3_selectionPrototype.append;
  d3_selection_enterPrototype.empty = d3_selectionPrototype.empty;
  d3_selection_enterPrototype.node = d3_selectionPrototype.node;
  d3_selection_enterPrototype.call = d3_selectionPrototype.call;
  d3_selection_enterPrototype.size = d3_selectionPrototype.size;
  d3_selection_enterPrototype.select = function(selector) {
    var subgroups = [], subgroup, subnode, upgroup, group, node;
    for (var j = -1, m = this.length; ++j < m; ) {
      upgroup = (group = this[j]).update;
      subgroups.push(subgroup = []);
      subgroup.parentNode = group.parentNode;
      for (var i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          subgroup.push(upgroup[i] = subnode = selector.call(group.parentNode, node.__data__, i, j));
          subnode.__data__ = node.__data__;
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_selection(subgroups);
  };
  d3_selection_enterPrototype.insert = function(name, before) {
    if (arguments.length < 2) before = d3_selection_enterInsertBefore(this);
    return d3_selectionPrototype.insert.call(this, name, before);
  };
  function d3_selection_enterInsertBefore(enter) {
    var i0, j0;
    return function(d, i, j) {
      var group = enter[j].update, n = group.length, node;
      if (j != j0) j0 = j, i0 = 0;
      if (i >= i0) i0 = i + 1;
      while (!(node = group[i0]) && ++i0 < n) ;
      return node;
    };
  }
  d3.select = function(node) {
    var group;
    if (typeof node === "string") {
      group = [ d3_select(node, d3_document) ];
      group.parentNode = d3_document.documentElement;
    } else {
      group = [ node ];
      group.parentNode = d3_documentElement(node);
    }
    return d3_selection([ group ]);
  };
  d3.selectAll = function(nodes) {
    var group;
    if (typeof nodes === "string") {
      group = d3_array(d3_selectAll(nodes, d3_document));
      group.parentNode = d3_document.documentElement;
    } else {
      group = d3_array(nodes);
      group.parentNode = null;
    }
    return d3_selection([ group ]);
  };
  d3_selectionPrototype.on = function(type, listener, capture) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof type !== "string") {
        if (n < 2) listener = false;
        for (capture in type) this.each(d3_selection_on(capture, type[capture], listener));
        return this;
      }
      if (n < 2) return (n = this.node()["__on" + type]) && n._;
      capture = false;
    }
    return this.each(d3_selection_on(type, listener, capture));
  };
  function d3_selection_on(type, listener, capture) {
    var name = "__on" + type, i = type.indexOf("."), wrap = d3_selection_onListener;
    if (i > 0) type = type.slice(0, i);
    var filter = d3_selection_onFilters.get(type);
    if (filter) type = filter, wrap = d3_selection_onFilter;
    function onRemove() {
      var l = this[name];
      if (l) {
        this.removeEventListener(type, l, l.$);
        delete this[name];
      }
    }
    function onAdd() {
      var l = wrap(listener, d3_array(arguments));
      onRemove.call(this);
      this.addEventListener(type, this[name] = l, l.$ = capture);
      l._ = listener;
    }
    function removeAll() {
      var re = new RegExp("^__on([^.]+)" + d3.requote(type) + "$"), match;
      for (var name in this) {
        if (match = name.match(re)) {
          var l = this[name];
          this.removeEventListener(match[1], l, l.$);
          delete this[name];
        }
      }
    }
    return i ? listener ? onAdd : onRemove : listener ? d3_noop : removeAll;
  }
  var d3_selection_onFilters = d3.map({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
  });
  if (d3_document) {
    d3_selection_onFilters.forEach(function(k) {
      if ("on" + k in d3_document) d3_selection_onFilters.remove(k);
    });
  }
  function d3_selection_onListener(listener, argumentz) {
    return function(e) {
      var o = d3.event;
      d3.event = e;
      argumentz[0] = this.__data__;
      try {
        listener.apply(this, argumentz);
      } finally {
        d3.event = o;
      }
    };
  }
  function d3_selection_onFilter(listener, argumentz) {
    var l = d3_selection_onListener(listener, argumentz);
    return function(e) {
      var target = this, related = e.relatedTarget;
      if (!related || related !== target && !(related.compareDocumentPosition(target) & 8)) {
        l.call(target, e);
      }
    };
  }
  var d3_event_dragSelect, d3_event_dragId = 0;
  function d3_event_dragSuppress(node) {
    var name = ".dragsuppress-" + ++d3_event_dragId, click = "click" + name, w = d3.select(d3_window(node)).on("touchmove" + name, d3_eventPreventDefault).on("dragstart" + name, d3_eventPreventDefault).on("selectstart" + name, d3_eventPreventDefault);
    if (d3_event_dragSelect == null) {
      d3_event_dragSelect = "onselectstart" in node ? false : d3_vendorSymbol(node.style, "userSelect");
    }
    if (d3_event_dragSelect) {
      var style = d3_documentElement(node).style, select = style[d3_event_dragSelect];
      style[d3_event_dragSelect] = "none";
    }
    return function(suppressClick) {
      w.on(name, null);
      if (d3_event_dragSelect) style[d3_event_dragSelect] = select;
      if (suppressClick) {
        var off = function() {
          w.on(click, null);
        };
        w.on(click, function() {
          d3_eventPreventDefault();
          off();
        }, true);
        setTimeout(off, 0);
      }
    };
  }
  d3.mouse = function(container) {
    return d3_mousePoint(container, d3_eventSource());
  };
  var d3_mouse_bug44083 = this.navigator && /WebKit/.test(this.navigator.userAgent) ? -1 : 0;
  function d3_mousePoint(container, e) {
    if (e.changedTouches) e = e.changedTouches[0];
    var svg = container.ownerSVGElement || container;
    if (svg.createSVGPoint) {
      var point = svg.createSVGPoint();
      if (d3_mouse_bug44083 < 0) {
        var window = d3_window(container);
        if (window.scrollX || window.scrollY) {
          svg = d3.select("body").append("svg").style({
            position: "absolute",
            top: 0,
            left: 0,
            margin: 0,
            padding: 0,
            border: "none"
          }, "important");
          var ctm = svg[0][0].getScreenCTM();
          d3_mouse_bug44083 = !(ctm.f || ctm.e);
          svg.remove();
        }
      }
      if (d3_mouse_bug44083) point.x = e.pageX, point.y = e.pageY; else point.x = e.clientX, 
      point.y = e.clientY;
      point = point.matrixTransform(container.getScreenCTM().inverse());
      return [ point.x, point.y ];
    }
    var rect = container.getBoundingClientRect();
    return [ e.clientX - rect.left - container.clientLeft, e.clientY - rect.top - container.clientTop ];
  }
  d3.touch = function(container, touches, identifier) {
    if (arguments.length < 3) identifier = touches, touches = d3_eventSource().changedTouches;
    if (touches) for (var i = 0, n = touches.length, touch; i < n; ++i) {
      if ((touch = touches[i]).identifier === identifier) {
        return d3_mousePoint(container, touch);
      }
    }
  };
  d3.behavior.drag = function() {
    var event = d3_eventDispatch(drag, "drag", "dragstart", "dragend"), origin = null, mousedown = dragstart(d3_noop, d3.mouse, d3_window, "mousemove", "mouseup"), touchstart = dragstart(d3_behavior_dragTouchId, d3.touch, d3_identity, "touchmove", "touchend");
    function drag() {
      this.on("mousedown.drag", mousedown).on("touchstart.drag", touchstart);
    }
    function dragstart(id, position, subject, move, end) {
      return function() {
        var that = this, target = d3.event.target.correspondingElement || d3.event.target, parent = that.parentNode, dispatch = event.of(that, arguments), dragged = 0, dragId = id(), dragName = ".drag" + (dragId == null ? "" : "-" + dragId), dragOffset, dragSubject = d3.select(subject(target)).on(move + dragName, moved).on(end + dragName, ended), dragRestore = d3_event_dragSuppress(target), position0 = position(parent, dragId);
        if (origin) {
          dragOffset = origin.apply(that, arguments);
          dragOffset = [ dragOffset.x - position0[0], dragOffset.y - position0[1] ];
        } else {
          dragOffset = [ 0, 0 ];
        }
        dispatch({
          type: "dragstart"
        });
        function moved() {
          var position1 = position(parent, dragId), dx, dy;
          if (!position1) return;
          dx = position1[0] - position0[0];
          dy = position1[1] - position0[1];
          dragged |= dx | dy;
          position0 = position1;
          dispatch({
            type: "drag",
            x: position1[0] + dragOffset[0],
            y: position1[1] + dragOffset[1],
            dx: dx,
            dy: dy
          });
        }
        function ended() {
          if (!position(parent, dragId)) return;
          dragSubject.on(move + dragName, null).on(end + dragName, null);
          dragRestore(dragged);
          dispatch({
            type: "dragend"
          });
        }
      };
    }
    drag.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return drag;
    };
    return d3.rebind(drag, event, "on");
  };
  function d3_behavior_dragTouchId() {
    return d3.event.changedTouches[0].identifier;
  }
  d3.touches = function(container, touches) {
    if (arguments.length < 2) touches = d3_eventSource().touches;
    return touches ? d3_array(touches).map(function(touch) {
      var point = d3_mousePoint(container, touch);
      point.identifier = touch.identifier;
      return point;
    }) : [];
  };
  var ε = 1e-6, ε2 = ε * ε, π = Math.PI, τ = 2 * π, τε = τ - ε, halfπ = π / 2, d3_radians = π / 180, d3_degrees = 180 / π;
  function d3_sgn(x) {
    return x > 0 ? 1 : x < 0 ? -1 : 0;
  }
  function d3_cross2d(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
  }
  function d3_acos(x) {
    return x > 1 ? 0 : x < -1 ? π : Math.acos(x);
  }
  function d3_asin(x) {
    return x > 1 ? halfπ : x < -1 ? -halfπ : Math.asin(x);
  }
  function d3_sinh(x) {
    return ((x = Math.exp(x)) - 1 / x) / 2;
  }
  function d3_cosh(x) {
    return ((x = Math.exp(x)) + 1 / x) / 2;
  }
  function d3_tanh(x) {
    return ((x = Math.exp(2 * x)) - 1) / (x + 1);
  }
  function d3_haversin(x) {
    return (x = Math.sin(x / 2)) * x;
  }
  var ρ = Math.SQRT2, ρ2 = 2, ρ4 = 4;
  d3.interpolateZoom = function(p0, p1) {
    var ux0 = p0[0], uy0 = p0[1], w0 = p0[2], ux1 = p1[0], uy1 = p1[1], w1 = p1[2], dx = ux1 - ux0, dy = uy1 - uy0, d2 = dx * dx + dy * dy, i, S;
    if (d2 < ε2) {
      S = Math.log(w1 / w0) / ρ;
      i = function(t) {
        return [ ux0 + t * dx, uy0 + t * dy, w0 * Math.exp(ρ * t * S) ];
      };
    } else {
      var d1 = Math.sqrt(d2), b0 = (w1 * w1 - w0 * w0 + ρ4 * d2) / (2 * w0 * ρ2 * d1), b1 = (w1 * w1 - w0 * w0 - ρ4 * d2) / (2 * w1 * ρ2 * d1), r0 = Math.log(Math.sqrt(b0 * b0 + 1) - b0), r1 = Math.log(Math.sqrt(b1 * b1 + 1) - b1);
      S = (r1 - r0) / ρ;
      i = function(t) {
        var s = t * S, coshr0 = d3_cosh(r0), u = w0 / (ρ2 * d1) * (coshr0 * d3_tanh(ρ * s + r0) - d3_sinh(r0));
        return [ ux0 + u * dx, uy0 + u * dy, w0 * coshr0 / d3_cosh(ρ * s + r0) ];
      };
    }
    i.duration = S * 1e3;
    return i;
  };
  d3.behavior.zoom = function() {
    var view = {
      x: 0,
      y: 0,
      k: 1
    }, translate0, center0, center, size = [ 960, 500 ], scaleExtent = d3_behavior_zoomInfinity, duration = 250, zooming = 0, mousedown = "mousedown.zoom", mousemove = "mousemove.zoom", mouseup = "mouseup.zoom", mousewheelTimer, touchstart = "touchstart.zoom", touchtime, event = d3_eventDispatch(zoom, "zoomstart", "zoom", "zoomend"), x0, x1, y0, y1;
    if (!d3_behavior_zoomWheel) {
      d3_behavior_zoomWheel = "onwheel" in d3_document ? (d3_behavior_zoomDelta = function() {
        return -d3.event.deltaY * (d3.event.deltaMode ? 120 : 1);
      }, "wheel") : "onmousewheel" in d3_document ? (d3_behavior_zoomDelta = function() {
        return d3.event.wheelDelta;
      }, "mousewheel") : (d3_behavior_zoomDelta = function() {
        return -d3.event.detail;
      }, "MozMousePixelScroll");
    }
    function zoom(g) {
      g.on(mousedown, mousedowned).on(d3_behavior_zoomWheel + ".zoom", mousewheeled).on("dblclick.zoom", dblclicked).on(touchstart, touchstarted);
    }
    zoom.event = function(g) {
      g.each(function() {
        var dispatch = event.of(this, arguments), view1 = view;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.zoom", function() {
            view = this.__chart__ || {
              x: 0,
              y: 0,
              k: 1
            };
            zoomstarted(dispatch);
          }).tween("zoom:zoom", function() {
            var dx = size[0], dy = size[1], cx = center0 ? center0[0] : dx / 2, cy = center0 ? center0[1] : dy / 2, i = d3.interpolateZoom([ (cx - view.x) / view.k, (cy - view.y) / view.k, dx / view.k ], [ (cx - view1.x) / view1.k, (cy - view1.y) / view1.k, dx / view1.k ]);
            return function(t) {
              var l = i(t), k = dx / l[2];
              this.__chart__ = view = {
                x: cx - l[0] * k,
                y: cy - l[1] * k,
                k: k
              };
              zoomed(dispatch);
            };
          }).each("interrupt.zoom", function() {
            zoomended(dispatch);
          }).each("end.zoom", function() {
            zoomended(dispatch);
          });
        } else {
          this.__chart__ = view;
          zoomstarted(dispatch);
          zoomed(dispatch);
          zoomended(dispatch);
        }
      });
    };
    zoom.translate = function(_) {
      if (!arguments.length) return [ view.x, view.y ];
      view = {
        x: +_[0],
        y: +_[1],
        k: view.k
      };
      rescale();
      return zoom;
    };
    zoom.scale = function(_) {
      if (!arguments.length) return view.k;
      view = {
        x: view.x,
        y: view.y,
        k: null
      };
      scaleTo(+_);
      rescale();
      return zoom;
    };
    zoom.scaleExtent = function(_) {
      if (!arguments.length) return scaleExtent;
      scaleExtent = _ == null ? d3_behavior_zoomInfinity : [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.center = function(_) {
      if (!arguments.length) return center;
      center = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.size = function(_) {
      if (!arguments.length) return size;
      size = _ && [ +_[0], +_[1] ];
      return zoom;
    };
    zoom.duration = function(_) {
      if (!arguments.length) return duration;
      duration = +_;
      return zoom;
    };
    zoom.x = function(z) {
      if (!arguments.length) return x1;
      x1 = z;
      x0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    zoom.y = function(z) {
      if (!arguments.length) return y1;
      y1 = z;
      y0 = z.copy();
      view = {
        x: 0,
        y: 0,
        k: 1
      };
      return zoom;
    };
    function location(p) {
      return [ (p[0] - view.x) / view.k, (p[1] - view.y) / view.k ];
    }
    function point(l) {
      return [ l[0] * view.k + view.x, l[1] * view.k + view.y ];
    }
    function scaleTo(s) {
      view.k = Math.max(scaleExtent[0], Math.min(scaleExtent[1], s));
    }
    function translateTo(p, l) {
      l = point(l);
      view.x += p[0] - l[0];
      view.y += p[1] - l[1];
    }
    function zoomTo(that, p, l, k) {
      that.__chart__ = {
        x: view.x,
        y: view.y,
        k: view.k
      };
      scaleTo(Math.pow(2, k));
      translateTo(center0 = p, l);
      that = d3.select(that);
      if (duration > 0) that = that.transition().duration(duration);
      that.call(zoom.event);
    }
    function rescale() {
      if (x1) x1.domain(x0.range().map(function(x) {
        return (x - view.x) / view.k;
      }).map(x0.invert));
      if (y1) y1.domain(y0.range().map(function(y) {
        return (y - view.y) / view.k;
      }).map(y0.invert));
    }
    function zoomstarted(dispatch) {
      if (!zooming++) dispatch({
        type: "zoomstart"
      });
    }
    function zoomed(dispatch) {
      rescale();
      dispatch({
        type: "zoom",
        scale: view.k,
        translate: [ view.x, view.y ]
      });
    }
    function zoomended(dispatch) {
      if (!--zooming) dispatch({
        type: "zoomend"
      }), center0 = null;
    }
    function mousedowned() {
      var that = this, dispatch = event.of(that, arguments), dragged = 0, subject = d3.select(d3_window(that)).on(mousemove, moved).on(mouseup, ended), location0 = location(d3.mouse(that)), dragRestore = d3_event_dragSuppress(that);
      d3_selection_interrupt.call(that);
      zoomstarted(dispatch);
      function moved() {
        dragged = 1;
        translateTo(d3.mouse(that), location0);
        zoomed(dispatch);
      }
      function ended() {
        subject.on(mousemove, null).on(mouseup, null);
        dragRestore(dragged);
        zoomended(dispatch);
      }
    }
    function touchstarted() {
      var that = this, dispatch = event.of(that, arguments), locations0 = {}, distance0 = 0, scale0, zoomName = ".zoom-" + d3.event.changedTouches[0].identifier, touchmove = "touchmove" + zoomName, touchend = "touchend" + zoomName, targets = [], subject = d3.select(that), dragRestore = d3_event_dragSuppress(that);
      started();
      zoomstarted(dispatch);
      subject.on(mousedown, null).on(touchstart, started);
      function relocate() {
        var touches = d3.touches(that);
        scale0 = view.k;
        touches.forEach(function(t) {
          if (t.identifier in locations0) locations0[t.identifier] = location(t);
        });
        return touches;
      }
      function started() {
        var target = d3.event.target;
        d3.select(target).on(touchmove, moved).on(touchend, ended);
        targets.push(target);
        var changed = d3.event.changedTouches;
        for (var i = 0, n = changed.length; i < n; ++i) {
          locations0[changed[i].identifier] = null;
        }
        var touches = relocate(), now = Date.now();
        if (touches.length === 1) {
          if (now - touchtime < 500) {
            var p = touches[0];
            zoomTo(that, p, locations0[p.identifier], Math.floor(Math.log(view.k) / Math.LN2) + 1);
            d3_eventPreventDefault();
          }
          touchtime = now;
        } else if (touches.length > 1) {
          var p = touches[0], q = touches[1], dx = p[0] - q[0], dy = p[1] - q[1];
          distance0 = dx * dx + dy * dy;
        }
      }
      function moved() {
        var touches = d3.touches(that), p0, l0, p1, l1;
        d3_selection_interrupt.call(that);
        for (var i = 0, n = touches.length; i < n; ++i, l1 = null) {
          p1 = touches[i];
          if (l1 = locations0[p1.identifier]) {
            if (l0) break;
            p0 = p1, l0 = l1;
          }
        }
        if (l1) {
          var distance1 = (distance1 = p1[0] - p0[0]) * distance1 + (distance1 = p1[1] - p0[1]) * distance1, scale1 = distance0 && Math.sqrt(distance1 / distance0);
          p0 = [ (p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2 ];
          l0 = [ (l0[0] + l1[0]) / 2, (l0[1] + l1[1]) / 2 ];
          scaleTo(scale1 * scale0);
        }
        touchtime = null;
        translateTo(p0, l0);
        zoomed(dispatch);
      }
      function ended() {
        if (d3.event.touches.length) {
          var changed = d3.event.changedTouches;
          for (var i = 0, n = changed.length; i < n; ++i) {
            delete locations0[changed[i].identifier];
          }
          for (var identifier in locations0) {
            return void relocate();
          }
        }
        d3.selectAll(targets).on(zoomName, null);
        subject.on(mousedown, mousedowned).on(touchstart, touchstarted);
        dragRestore();
        zoomended(dispatch);
      }
    }
    function mousewheeled() {
      var dispatch = event.of(this, arguments);
      if (mousewheelTimer) clearTimeout(mousewheelTimer); else d3_selection_interrupt.call(this), 
      translate0 = location(center0 = center || d3.mouse(this)), zoomstarted(dispatch);
      mousewheelTimer = setTimeout(function() {
        mousewheelTimer = null;
        zoomended(dispatch);
      }, 50);
      d3_eventPreventDefault();
      scaleTo(Math.pow(2, d3_behavior_zoomDelta() * .002) * view.k);
      translateTo(center0, translate0);
      zoomed(dispatch);
    }
    function dblclicked() {
      var p = d3.mouse(this), k = Math.log(view.k) / Math.LN2;
      zoomTo(this, p, location(p), d3.event.shiftKey ? Math.ceil(k) - 1 : Math.floor(k) + 1);
    }
    return d3.rebind(zoom, event, "on");
  };
  var d3_behavior_zoomInfinity = [ 0, Infinity ], d3_behavior_zoomDelta, d3_behavior_zoomWheel;
  d3.color = d3_color;
  function d3_color() {}
  d3_color.prototype.toString = function() {
    return this.rgb() + "";
  };
  d3.hsl = d3_hsl;
  function d3_hsl(h, s, l) {
    return this instanceof d3_hsl ? void (this.h = +h, this.s = +s, this.l = +l) : arguments.length < 2 ? h instanceof d3_hsl ? new d3_hsl(h.h, h.s, h.l) : d3_rgb_parse("" + h, d3_rgb_hsl, d3_hsl) : new d3_hsl(h, s, l);
  }
  var d3_hslPrototype = d3_hsl.prototype = new d3_color();
  d3_hslPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_hsl(this.h, this.s, this.l / k);
  };
  d3_hslPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_hsl(this.h, this.s, k * this.l);
  };
  d3_hslPrototype.rgb = function() {
    return d3_hsl_rgb(this.h, this.s, this.l);
  };
  function d3_hsl_rgb(h, s, l) {
    var m1, m2;
    h = isNaN(h) ? 0 : (h %= 360) < 0 ? h + 360 : h;
    s = isNaN(s) ? 0 : s < 0 ? 0 : s > 1 ? 1 : s;
    l = l < 0 ? 0 : l > 1 ? 1 : l;
    m2 = l <= .5 ? l * (1 + s) : l + s - l * s;
    m1 = 2 * l - m2;
    function v(h) {
      if (h > 360) h -= 360; else if (h < 0) h += 360;
      if (h < 60) return m1 + (m2 - m1) * h / 60;
      if (h < 180) return m2;
      if (h < 240) return m1 + (m2 - m1) * (240 - h) / 60;
      return m1;
    }
    function vv(h) {
      return Math.round(v(h) * 255);
    }
    return new d3_rgb(vv(h + 120), vv(h), vv(h - 120));
  }
  d3.hcl = d3_hcl;
  function d3_hcl(h, c, l) {
    return this instanceof d3_hcl ? void (this.h = +h, this.c = +c, this.l = +l) : arguments.length < 2 ? h instanceof d3_hcl ? new d3_hcl(h.h, h.c, h.l) : h instanceof d3_lab ? d3_lab_hcl(h.l, h.a, h.b) : d3_lab_hcl((h = d3_rgb_lab((h = d3.rgb(h)).r, h.g, h.b)).l, h.a, h.b) : new d3_hcl(h, c, l);
  }
  var d3_hclPrototype = d3_hcl.prototype = new d3_color();
  d3_hclPrototype.brighter = function(k) {
    return new d3_hcl(this.h, this.c, Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.darker = function(k) {
    return new d3_hcl(this.h, this.c, Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)));
  };
  d3_hclPrototype.rgb = function() {
    return d3_hcl_lab(this.h, this.c, this.l).rgb();
  };
  function d3_hcl_lab(h, c, l) {
    if (isNaN(h)) h = 0;
    if (isNaN(c)) c = 0;
    return new d3_lab(l, Math.cos(h *= d3_radians) * c, Math.sin(h) * c);
  }
  d3.lab = d3_lab;
  function d3_lab(l, a, b) {
    return this instanceof d3_lab ? void (this.l = +l, this.a = +a, this.b = +b) : arguments.length < 2 ? l instanceof d3_lab ? new d3_lab(l.l, l.a, l.b) : l instanceof d3_hcl ? d3_hcl_lab(l.h, l.c, l.l) : d3_rgb_lab((l = d3_rgb(l)).r, l.g, l.b) : new d3_lab(l, a, b);
  }
  var d3_lab_K = 18;
  var d3_lab_X = .95047, d3_lab_Y = 1, d3_lab_Z = 1.08883;
  var d3_labPrototype = d3_lab.prototype = new d3_color();
  d3_labPrototype.brighter = function(k) {
    return new d3_lab(Math.min(100, this.l + d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.darker = function(k) {
    return new d3_lab(Math.max(0, this.l - d3_lab_K * (arguments.length ? k : 1)), this.a, this.b);
  };
  d3_labPrototype.rgb = function() {
    return d3_lab_rgb(this.l, this.a, this.b);
  };
  function d3_lab_rgb(l, a, b) {
    var y = (l + 16) / 116, x = y + a / 500, z = y - b / 200;
    x = d3_lab_xyz(x) * d3_lab_X;
    y = d3_lab_xyz(y) * d3_lab_Y;
    z = d3_lab_xyz(z) * d3_lab_Z;
    return new d3_rgb(d3_xyz_rgb(3.2404542 * x - 1.5371385 * y - .4985314 * z), d3_xyz_rgb(-.969266 * x + 1.8760108 * y + .041556 * z), d3_xyz_rgb(.0556434 * x - .2040259 * y + 1.0572252 * z));
  }
  function d3_lab_hcl(l, a, b) {
    return l > 0 ? new d3_hcl(Math.atan2(b, a) * d3_degrees, Math.sqrt(a * a + b * b), l) : new d3_hcl(NaN, NaN, l);
  }
  function d3_lab_xyz(x) {
    return x > .206893034 ? x * x * x : (x - 4 / 29) / 7.787037;
  }
  function d3_xyz_lab(x) {
    return x > .008856 ? Math.pow(x, 1 / 3) : 7.787037 * x + 4 / 29;
  }
  function d3_xyz_rgb(r) {
    return Math.round(255 * (r <= .00304 ? 12.92 * r : 1.055 * Math.pow(r, 1 / 2.4) - .055));
  }
  d3.rgb = d3_rgb;
  function d3_rgb(r, g, b) {
    return this instanceof d3_rgb ? void (this.r = ~~r, this.g = ~~g, this.b = ~~b) : arguments.length < 2 ? r instanceof d3_rgb ? new d3_rgb(r.r, r.g, r.b) : d3_rgb_parse("" + r, d3_rgb, d3_hsl_rgb) : new d3_rgb(r, g, b);
  }
  function d3_rgbNumber(value) {
    return new d3_rgb(value >> 16, value >> 8 & 255, value & 255);
  }
  function d3_rgbString(value) {
    return d3_rgbNumber(value) + "";
  }
  var d3_rgbPrototype = d3_rgb.prototype = new d3_color();
  d3_rgbPrototype.brighter = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    var r = this.r, g = this.g, b = this.b, i = 30;
    if (!r && !g && !b) return new d3_rgb(i, i, i);
    if (r && r < i) r = i;
    if (g && g < i) g = i;
    if (b && b < i) b = i;
    return new d3_rgb(Math.min(255, r / k), Math.min(255, g / k), Math.min(255, b / k));
  };
  d3_rgbPrototype.darker = function(k) {
    k = Math.pow(.7, arguments.length ? k : 1);
    return new d3_rgb(k * this.r, k * this.g, k * this.b);
  };
  d3_rgbPrototype.hsl = function() {
    return d3_rgb_hsl(this.r, this.g, this.b);
  };
  d3_rgbPrototype.toString = function() {
    return "#" + d3_rgb_hex(this.r) + d3_rgb_hex(this.g) + d3_rgb_hex(this.b);
  };
  function d3_rgb_hex(v) {
    return v < 16 ? "0" + Math.max(0, v).toString(16) : Math.min(255, v).toString(16);
  }
  function d3_rgb_parse(format, rgb, hsl) {
    var r = 0, g = 0, b = 0, m1, m2, color;
    m1 = /([a-z]+)\((.*)\)/.exec(format = format.toLowerCase());
    if (m1) {
      m2 = m1[2].split(",");
      switch (m1[1]) {
       case "hsl":
        {
          return hsl(parseFloat(m2[0]), parseFloat(m2[1]) / 100, parseFloat(m2[2]) / 100);
        }

       case "rgb":
        {
          return rgb(d3_rgb_parseNumber(m2[0]), d3_rgb_parseNumber(m2[1]), d3_rgb_parseNumber(m2[2]));
        }
      }
    }
    if (color = d3_rgb_names.get(format)) {
      return rgb(color.r, color.g, color.b);
    }
    if (format != null && format.charAt(0) === "#" && !isNaN(color = parseInt(format.slice(1), 16))) {
      if (format.length === 4) {
        r = (color & 3840) >> 4;
        r = r >> 4 | r;
        g = color & 240;
        g = g >> 4 | g;
        b = color & 15;
        b = b << 4 | b;
      } else if (format.length === 7) {
        r = (color & 16711680) >> 16;
        g = (color & 65280) >> 8;
        b = color & 255;
      }
    }
    return rgb(r, g, b);
  }
  function d3_rgb_hsl(r, g, b) {
    var min = Math.min(r /= 255, g /= 255, b /= 255), max = Math.max(r, g, b), d = max - min, h, s, l = (max + min) / 2;
    if (d) {
      s = l < .5 ? d / (max + min) : d / (2 - max - min);
      if (r == max) h = (g - b) / d + (g < b ? 6 : 0); else if (g == max) h = (b - r) / d + 2; else h = (r - g) / d + 4;
      h *= 60;
    } else {
      h = NaN;
      s = l > 0 && l < 1 ? 0 : h;
    }
    return new d3_hsl(h, s, l);
  }
  function d3_rgb_lab(r, g, b) {
    r = d3_rgb_xyz(r);
    g = d3_rgb_xyz(g);
    b = d3_rgb_xyz(b);
    var x = d3_xyz_lab((.4124564 * r + .3575761 * g + .1804375 * b) / d3_lab_X), y = d3_xyz_lab((.2126729 * r + .7151522 * g + .072175 * b) / d3_lab_Y), z = d3_xyz_lab((.0193339 * r + .119192 * g + .9503041 * b) / d3_lab_Z);
    return d3_lab(116 * y - 16, 500 * (x - y), 200 * (y - z));
  }
  function d3_rgb_xyz(r) {
    return (r /= 255) <= .04045 ? r / 12.92 : Math.pow((r + .055) / 1.055, 2.4);
  }
  function d3_rgb_parseNumber(c) {
    var f = parseFloat(c);
    return c.charAt(c.length - 1) === "%" ? Math.round(f * 2.55) : f;
  }
  var d3_rgb_names = d3.map({
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  });
  d3_rgb_names.forEach(function(key, value) {
    d3_rgb_names.set(key, d3_rgbNumber(value));
  });
  function d3_functor(v) {
    return typeof v === "function" ? v : function() {
      return v;
    };
  }
  d3.functor = d3_functor;
  d3.xhr = d3_xhrType(d3_identity);
  function d3_xhrType(response) {
    return function(url, mimeType, callback) {
      if (arguments.length === 2 && typeof mimeType === "function") callback = mimeType, 
      mimeType = null;
      return d3_xhr(url, mimeType, response, callback);
    };
  }
  function d3_xhr(url, mimeType, response, callback) {
    var xhr = {}, dispatch = d3.dispatch("beforesend", "progress", "load", "error"), headers = {}, request = new XMLHttpRequest(), responseType = null;
    if (this.XDomainRequest && !("withCredentials" in request) && /^(http(s)?:)?\/\//.test(url)) request = new XDomainRequest();
    "onload" in request ? request.onload = request.onerror = respond : request.onreadystatechange = function() {
      request.readyState > 3 && respond();
    };
    function respond() {
      var status = request.status, result;
      if (!status && d3_xhrHasResponse(request) || status >= 200 && status < 300 || status === 304) {
        try {
          result = response.call(xhr, request);
        } catch (e) {
          dispatch.error.call(xhr, e);
          return;
        }
        dispatch.load.call(xhr, result);
      } else {
        dispatch.error.call(xhr, request);
      }
    }
    request.onprogress = function(event) {
      var o = d3.event;
      d3.event = event;
      try {
        dispatch.progress.call(xhr, request);
      } finally {
        d3.event = o;
      }
    };
    xhr.header = function(name, value) {
      name = (name + "").toLowerCase();
      if (arguments.length < 2) return headers[name];
      if (value == null) delete headers[name]; else headers[name] = value + "";
      return xhr;
    };
    xhr.mimeType = function(value) {
      if (!arguments.length) return mimeType;
      mimeType = value == null ? null : value + "";
      return xhr;
    };
    xhr.responseType = function(value) {
      if (!arguments.length) return responseType;
      responseType = value;
      return xhr;
    };
    xhr.response = function(value) {
      response = value;
      return xhr;
    };
    [ "get", "post" ].forEach(function(method) {
      xhr[method] = function() {
        return xhr.send.apply(xhr, [ method ].concat(d3_array(arguments)));
      };
    });
    xhr.send = function(method, data, callback) {
      if (arguments.length === 2 && typeof data === "function") callback = data, data = null;
      request.open(method, url, true);
      if (mimeType != null && !("accept" in headers)) headers["accept"] = mimeType + ",*/*";
      if (request.setRequestHeader) for (var name in headers) request.setRequestHeader(name, headers[name]);
      if (mimeType != null && request.overrideMimeType) request.overrideMimeType(mimeType);
      if (responseType != null) request.responseType = responseType;
      if (callback != null) xhr.on("error", callback).on("load", function(request) {
        callback(null, request);
      });
      dispatch.beforesend.call(xhr, request);
      request.send(data == null ? null : data);
      return xhr;
    };
    xhr.abort = function() {
      request.abort();
      return xhr;
    };
    d3.rebind(xhr, dispatch, "on");
    return callback == null ? xhr : xhr.get(d3_xhr_fixCallback(callback));
  }
  function d3_xhr_fixCallback(callback) {
    return callback.length === 1 ? function(error, request) {
      callback(error == null ? request : null);
    } : callback;
  }
  function d3_xhrHasResponse(request) {
    var type = request.responseType;
    return type && type !== "text" ? request.response : request.responseText;
  }
  d3.dsv = function(delimiter, mimeType) {
    var reFormat = new RegExp('["' + delimiter + "\n]"), delimiterCode = delimiter.charCodeAt(0);
    function dsv(url, row, callback) {
      if (arguments.length < 3) callback = row, row = null;
      var xhr = d3_xhr(url, mimeType, row == null ? response : typedResponse(row), callback);
      xhr.row = function(_) {
        return arguments.length ? xhr.response((row = _) == null ? response : typedResponse(_)) : row;
      };
      return xhr;
    }
    function response(request) {
      return dsv.parse(request.responseText);
    }
    function typedResponse(f) {
      return function(request) {
        return dsv.parse(request.responseText, f);
      };
    }
    dsv.parse = function(text, f) {
      var o;
      return dsv.parseRows(text, function(row, i) {
        if (o) return o(row, i - 1);
        var a = new Function("d", "return {" + row.map(function(name, i) {
          return JSON.stringify(name) + ": d[" + i + "]";
        }).join(",") + "}");
        o = f ? function(row, i) {
          return f(a(row), i);
        } : a;
      });
    };
    dsv.parseRows = function(text, f) {
      var EOL = {}, EOF = {}, rows = [], N = text.length, I = 0, n = 0, t, eol;
      function token() {
        if (I >= N) return EOF;
        if (eol) return eol = false, EOL;
        var j = I;
        if (text.charCodeAt(j) === 34) {
          var i = j;
          while (i++ < N) {
            if (text.charCodeAt(i) === 34) {
              if (text.charCodeAt(i + 1) !== 34) break;
              ++i;
            }
          }
          I = i + 2;
          var c = text.charCodeAt(i + 1);
          if (c === 13) {
            eol = true;
            if (text.charCodeAt(i + 2) === 10) ++I;
          } else if (c === 10) {
            eol = true;
          }
          return text.slice(j + 1, i).replace(/""/g, '"');
        }
        while (I < N) {
          var c = text.charCodeAt(I++), k = 1;
          if (c === 10) eol = true; else if (c === 13) {
            eol = true;
            if (text.charCodeAt(I) === 10) ++I, ++k;
          } else if (c !== delimiterCode) continue;
          return text.slice(j, I - k);
        }
        return text.slice(j);
      }
      while ((t = token()) !== EOF) {
        var a = [];
        while (t !== EOL && t !== EOF) {
          a.push(t);
          t = token();
        }
        if (f && (a = f(a, n++)) == null) continue;
        rows.push(a);
      }
      return rows;
    };
    dsv.format = function(rows) {
      if (Array.isArray(rows[0])) return dsv.formatRows(rows);
      var fieldSet = new d3_Set(), fields = [];
      rows.forEach(function(row) {
        for (var field in row) {
          if (!fieldSet.has(field)) {
            fields.push(fieldSet.add(field));
          }
        }
      });
      return [ fields.map(formatValue).join(delimiter) ].concat(rows.map(function(row) {
        return fields.map(function(field) {
          return formatValue(row[field]);
        }).join(delimiter);
      })).join("\n");
    };
    dsv.formatRows = function(rows) {
      return rows.map(formatRow).join("\n");
    };
    function formatRow(row) {
      return row.map(formatValue).join(delimiter);
    }
    function formatValue(text) {
      return reFormat.test(text) ? '"' + text.replace(/\"/g, '""') + '"' : text;
    }
    return dsv;
  };
  d3.csv = d3.dsv(",", "text/csv");
  d3.tsv = d3.dsv("	", "text/tab-separated-values");
  var d3_timer_queueHead, d3_timer_queueTail, d3_timer_interval, d3_timer_timeout, d3_timer_frame = this[d3_vendorSymbol(this, "requestAnimationFrame")] || function(callback) {
    setTimeout(callback, 17);
  };
  d3.timer = function() {
    d3_timer.apply(this, arguments);
  };
  function d3_timer(callback, delay, then) {
    var n = arguments.length;
    if (n < 2) delay = 0;
    if (n < 3) then = Date.now();
    var time = then + delay, timer = {
      c: callback,
      t: time,
      n: null
    };
    if (d3_timer_queueTail) d3_timer_queueTail.n = timer; else d3_timer_queueHead = timer;
    d3_timer_queueTail = timer;
    if (!d3_timer_interval) {
      d3_timer_timeout = clearTimeout(d3_timer_timeout);
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
    return timer;
  }
  function d3_timer_step() {
    var now = d3_timer_mark(), delay = d3_timer_sweep() - now;
    if (delay > 24) {
      if (isFinite(delay)) {
        clearTimeout(d3_timer_timeout);
        d3_timer_timeout = setTimeout(d3_timer_step, delay);
      }
      d3_timer_interval = 0;
    } else {
      d3_timer_interval = 1;
      d3_timer_frame(d3_timer_step);
    }
  }
  d3.timer.flush = function() {
    d3_timer_mark();
    d3_timer_sweep();
  };
  function d3_timer_mark() {
    var now = Date.now(), timer = d3_timer_queueHead;
    while (timer) {
      if (now >= timer.t && timer.c(now - timer.t)) timer.c = null;
      timer = timer.n;
    }
    return now;
  }
  function d3_timer_sweep() {
    var t0, t1 = d3_timer_queueHead, time = Infinity;
    while (t1) {
      if (t1.c) {
        if (t1.t < time) time = t1.t;
        t1 = (t0 = t1).n;
      } else {
        t1 = t0 ? t0.n = t1.n : d3_timer_queueHead = t1.n;
      }
    }
    d3_timer_queueTail = t0;
    return time;
  }
  function d3_format_precision(x, p) {
    return p - (x ? Math.ceil(Math.log(x) / Math.LN10) : 1);
  }
  d3.round = function(x, n) {
    return n ? Math.round(x * (n = Math.pow(10, n))) / n : Math.round(x);
  };
  var d3_formatPrefixes = [ "y", "z", "a", "f", "p", "n", "µ", "m", "", "k", "M", "G", "T", "P", "E", "Z", "Y" ].map(d3_formatPrefix);
  d3.formatPrefix = function(value, precision) {
    var i = 0;
    if (value = +value) {
      if (value < 0) value *= -1;
      if (precision) value = d3.round(value, d3_format_precision(value, precision));
      i = 1 + Math.floor(1e-12 + Math.log(value) / Math.LN10);
      i = Math.max(-24, Math.min(24, Math.floor((i - 1) / 3) * 3));
    }
    return d3_formatPrefixes[8 + i / 3];
  };
  function d3_formatPrefix(d, i) {
    var k = Math.pow(10, abs(8 - i) * 3);
    return {
      scale: i > 8 ? function(d) {
        return d / k;
      } : function(d) {
        return d * k;
      },
      symbol: d
    };
  }
  function d3_locale_numberFormat(locale) {
    var locale_decimal = locale.decimal, locale_thousands = locale.thousands, locale_grouping = locale.grouping, locale_currency = locale.currency, formatGroup = locale_grouping && locale_thousands ? function(value, width) {
      var i = value.length, t = [], j = 0, g = locale_grouping[0], length = 0;
      while (i > 0 && g > 0) {
        if (length + g + 1 > width) g = Math.max(1, width - length);
        t.push(value.substring(i -= g, i + g));
        if ((length += g + 1) > width) break;
        g = locale_grouping[j = (j + 1) % locale_grouping.length];
      }
      return t.reverse().join(locale_thousands);
    } : d3_identity;
    return function(specifier) {
      var match = d3_format_re.exec(specifier), fill = match[1] || " ", align = match[2] || ">", sign = match[3] || "-", symbol = match[4] || "", zfill = match[5], width = +match[6], comma = match[7], precision = match[8], type = match[9], scale = 1, prefix = "", suffix = "", integer = false, exponent = true;
      if (precision) precision = +precision.substring(1);
      if (zfill || fill === "0" && align === "=") {
        zfill = fill = "0";
        align = "=";
      }
      switch (type) {
       case "n":
        comma = true;
        type = "g";
        break;

       case "%":
        scale = 100;
        suffix = "%";
        type = "f";
        break;

       case "p":
        scale = 100;
        suffix = "%";
        type = "r";
        break;

       case "b":
       case "o":
       case "x":
       case "X":
        if (symbol === "#") prefix = "0" + type.toLowerCase();

       case "c":
        exponent = false;

       case "d":
        integer = true;
        precision = 0;
        break;

       case "s":
        scale = -1;
        type = "r";
        break;
      }
      if (symbol === "$") prefix = locale_currency[0], suffix = locale_currency[1];
      if (type == "r" && !precision) type = "g";
      if (precision != null) {
        if (type == "g") precision = Math.max(1, Math.min(21, precision)); else if (type == "e" || type == "f") precision = Math.max(0, Math.min(20, precision));
      }
      type = d3_format_types.get(type) || d3_format_typeDefault;
      var zcomma = zfill && comma;
      return function(value) {
        var fullSuffix = suffix;
        if (integer && value % 1) return "";
        var negative = value < 0 || value === 0 && 1 / value < 0 ? (value = -value, "-") : sign === "-" ? "" : sign;
        if (scale < 0) {
          var unit = d3.formatPrefix(value, precision);
          value = unit.scale(value);
          fullSuffix = unit.symbol + suffix;
        } else {
          value *= scale;
        }
        value = type(value, precision);
        var i = value.lastIndexOf("."), before, after;
        if (i < 0) {
          var j = exponent ? value.lastIndexOf("e") : -1;
          if (j < 0) before = value, after = ""; else before = value.substring(0, j), after = value.substring(j);
        } else {
          before = value.substring(0, i);
          after = locale_decimal + value.substring(i + 1);
        }
        if (!zfill && comma) before = formatGroup(before, Infinity);
        var length = prefix.length + before.length + after.length + (zcomma ? 0 : negative.length), padding = length < width ? new Array(length = width - length + 1).join(fill) : "";
        if (zcomma) before = formatGroup(padding + before, padding.length ? width - after.length : Infinity);
        negative += prefix;
        value = before + after;
        return (align === "<" ? negative + value + padding : align === ">" ? padding + negative + value : align === "^" ? padding.substring(0, length >>= 1) + negative + value + padding.substring(length) : negative + (zcomma ? value : padding + value)) + fullSuffix;
      };
    };
  }
  var d3_format_re = /(?:([^{])?([<>=^]))?([+\- ])?([$#])?(0)?(\d+)?(,)?(\.-?\d+)?([a-z%])?/i;
  var d3_format_types = d3.map({
    b: function(x) {
      return x.toString(2);
    },
    c: function(x) {
      return String.fromCharCode(x);
    },
    o: function(x) {
      return x.toString(8);
    },
    x: function(x) {
      return x.toString(16);
    },
    X: function(x) {
      return x.toString(16).toUpperCase();
    },
    g: function(x, p) {
      return x.toPrecision(p);
    },
    e: function(x, p) {
      return x.toExponential(p);
    },
    f: function(x, p) {
      return x.toFixed(p);
    },
    r: function(x, p) {
      return (x = d3.round(x, d3_format_precision(x, p))).toFixed(Math.max(0, Math.min(20, d3_format_precision(x * (1 + 1e-15), p))));
    }
  });
  function d3_format_typeDefault(x) {
    return x + "";
  }
  var d3_time = d3.time = {}, d3_date = Date;
  function d3_date_utc() {
    this._ = new Date(arguments.length > 1 ? Date.UTC.apply(this, arguments) : arguments[0]);
  }
  d3_date_utc.prototype = {
    getDate: function() {
      return this._.getUTCDate();
    },
    getDay: function() {
      return this._.getUTCDay();
    },
    getFullYear: function() {
      return this._.getUTCFullYear();
    },
    getHours: function() {
      return this._.getUTCHours();
    },
    getMilliseconds: function() {
      return this._.getUTCMilliseconds();
    },
    getMinutes: function() {
      return this._.getUTCMinutes();
    },
    getMonth: function() {
      return this._.getUTCMonth();
    },
    getSeconds: function() {
      return this._.getUTCSeconds();
    },
    getTime: function() {
      return this._.getTime();
    },
    getTimezoneOffset: function() {
      return 0;
    },
    valueOf: function() {
      return this._.valueOf();
    },
    setDate: function() {
      d3_time_prototype.setUTCDate.apply(this._, arguments);
    },
    setDay: function() {
      d3_time_prototype.setUTCDay.apply(this._, arguments);
    },
    setFullYear: function() {
      d3_time_prototype.setUTCFullYear.apply(this._, arguments);
    },
    setHours: function() {
      d3_time_prototype.setUTCHours.apply(this._, arguments);
    },
    setMilliseconds: function() {
      d3_time_prototype.setUTCMilliseconds.apply(this._, arguments);
    },
    setMinutes: function() {
      d3_time_prototype.setUTCMinutes.apply(this._, arguments);
    },
    setMonth: function() {
      d3_time_prototype.setUTCMonth.apply(this._, arguments);
    },
    setSeconds: function() {
      d3_time_prototype.setUTCSeconds.apply(this._, arguments);
    },
    setTime: function() {
      d3_time_prototype.setTime.apply(this._, arguments);
    }
  };
  var d3_time_prototype = Date.prototype;
  function d3_time_interval(local, step, number) {
    function round(date) {
      var d0 = local(date), d1 = offset(d0, 1);
      return date - d0 < d1 - date ? d0 : d1;
    }
    function ceil(date) {
      step(date = local(new d3_date(date - 1)), 1);
      return date;
    }
    function offset(date, k) {
      step(date = new d3_date(+date), k);
      return date;
    }
    function range(t0, t1, dt) {
      var time = ceil(t0), times = [];
      if (dt > 1) {
        while (time < t1) {
          if (!(number(time) % dt)) times.push(new Date(+time));
          step(time, 1);
        }
      } else {
        while (time < t1) times.push(new Date(+time)), step(time, 1);
      }
      return times;
    }
    function range_utc(t0, t1, dt) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = t0;
        return range(utc, t1, dt);
      } finally {
        d3_date = Date;
      }
    }
    local.floor = local;
    local.round = round;
    local.ceil = ceil;
    local.offset = offset;
    local.range = range;
    var utc = local.utc = d3_time_interval_utc(local);
    utc.floor = utc;
    utc.round = d3_time_interval_utc(round);
    utc.ceil = d3_time_interval_utc(ceil);
    utc.offset = d3_time_interval_utc(offset);
    utc.range = range_utc;
    return local;
  }
  function d3_time_interval_utc(method) {
    return function(date, k) {
      try {
        d3_date = d3_date_utc;
        var utc = new d3_date_utc();
        utc._ = date;
        return method(utc, k)._;
      } finally {
        d3_date = Date;
      }
    };
  }
  d3_time.year = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setMonth(0, 1);
    return date;
  }, function(date, offset) {
    date.setFullYear(date.getFullYear() + offset);
  }, function(date) {
    return date.getFullYear();
  });
  d3_time.years = d3_time.year.range;
  d3_time.years.utc = d3_time.year.utc.range;
  d3_time.day = d3_time_interval(function(date) {
    var day = new d3_date(2e3, 0);
    day.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    return day;
  }, function(date, offset) {
    date.setDate(date.getDate() + offset);
  }, function(date) {
    return date.getDate() - 1;
  });
  d3_time.days = d3_time.day.range;
  d3_time.days.utc = d3_time.day.utc.range;
  d3_time.dayOfYear = function(date) {
    var year = d3_time.year(date);
    return Math.floor((date - year - (date.getTimezoneOffset() - year.getTimezoneOffset()) * 6e4) / 864e5);
  };
  [ "sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday" ].forEach(function(day, i) {
    i = 7 - i;
    var interval = d3_time[day] = d3_time_interval(function(date) {
      (date = d3_time.day(date)).setDate(date.getDate() - (date.getDay() + i) % 7);
      return date;
    }, function(date, offset) {
      date.setDate(date.getDate() + Math.floor(offset) * 7);
    }, function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7) - (day !== i);
    });
    d3_time[day + "s"] = interval.range;
    d3_time[day + "s"].utc = interval.utc.range;
    d3_time[day + "OfYear"] = function(date) {
      var day = d3_time.year(date).getDay();
      return Math.floor((d3_time.dayOfYear(date) + (day + i) % 7) / 7);
    };
  });
  d3_time.week = d3_time.sunday;
  d3_time.weeks = d3_time.sunday.range;
  d3_time.weeks.utc = d3_time.sunday.utc.range;
  d3_time.weekOfYear = d3_time.sundayOfYear;
  function d3_locale_timeFormat(locale) {
    var locale_dateTime = locale.dateTime, locale_date = locale.date, locale_time = locale.time, locale_periods = locale.periods, locale_days = locale.days, locale_shortDays = locale.shortDays, locale_months = locale.months, locale_shortMonths = locale.shortMonths;
    function d3_time_format(template) {
      var n = template.length;
      function format(date) {
        var string = [], i = -1, j = 0, c, p, f;
        while (++i < n) {
          if (template.charCodeAt(i) === 37) {
            string.push(template.slice(j, i));
            if ((p = d3_time_formatPads[c = template.charAt(++i)]) != null) c = template.charAt(++i);
            if (f = d3_time_formats[c]) c = f(date, p == null ? c === "e" ? " " : "0" : p);
            string.push(c);
            j = i + 1;
          }
        }
        string.push(template.slice(j, i));
        return string.join("");
      }
      format.parse = function(string) {
        var d = {
          y: 1900,
          m: 0,
          d: 1,
          H: 0,
          M: 0,
          S: 0,
          L: 0,
          Z: null
        }, i = d3_time_parse(d, template, string, 0);
        if (i != string.length) return null;
        if ("p" in d) d.H = d.H % 12 + d.p * 12;
        var localZ = d.Z != null && d3_date !== d3_date_utc, date = new (localZ ? d3_date_utc : d3_date)();
        if ("j" in d) date.setFullYear(d.y, 0, d.j); else if ("W" in d || "U" in d) {
          if (!("w" in d)) d.w = "W" in d ? 1 : 0;
          date.setFullYear(d.y, 0, 1);
          date.setFullYear(d.y, 0, "W" in d ? (d.w + 6) % 7 + d.W * 7 - (date.getDay() + 5) % 7 : d.w + d.U * 7 - (date.getDay() + 6) % 7);
        } else date.setFullYear(d.y, d.m, d.d);
        date.setHours(d.H + (d.Z / 100 | 0), d.M + d.Z % 100, d.S, d.L);
        return localZ ? date._ : date;
      };
      format.toString = function() {
        return template;
      };
      return format;
    }
    function d3_time_parse(date, template, string, j) {
      var c, p, t, i = 0, n = template.length, m = string.length;
      while (i < n) {
        if (j >= m) return -1;
        c = template.charCodeAt(i++);
        if (c === 37) {
          t = template.charAt(i++);
          p = d3_time_parsers[t in d3_time_formatPads ? template.charAt(i++) : t];
          if (!p || (j = p(date, string, j)) < 0) return -1;
        } else if (c != string.charCodeAt(j++)) {
          return -1;
        }
      }
      return j;
    }
    d3_time_format.utc = function(template) {
      var local = d3_time_format(template);
      function format(date) {
        try {
          d3_date = d3_date_utc;
          var utc = new d3_date();
          utc._ = date;
          return local(utc);
        } finally {
          d3_date = Date;
        }
      }
      format.parse = function(string) {
        try {
          d3_date = d3_date_utc;
          var date = local.parse(string);
          return date && date._;
        } finally {
          d3_date = Date;
        }
      };
      format.toString = local.toString;
      return format;
    };
    d3_time_format.multi = d3_time_format.utc.multi = d3_time_formatMulti;
    var d3_time_periodLookup = d3.map(), d3_time_dayRe = d3_time_formatRe(locale_days), d3_time_dayLookup = d3_time_formatLookup(locale_days), d3_time_dayAbbrevRe = d3_time_formatRe(locale_shortDays), d3_time_dayAbbrevLookup = d3_time_formatLookup(locale_shortDays), d3_time_monthRe = d3_time_formatRe(locale_months), d3_time_monthLookup = d3_time_formatLookup(locale_months), d3_time_monthAbbrevRe = d3_time_formatRe(locale_shortMonths), d3_time_monthAbbrevLookup = d3_time_formatLookup(locale_shortMonths);
    locale_periods.forEach(function(p, i) {
      d3_time_periodLookup.set(p.toLowerCase(), i);
    });
    var d3_time_formats = {
      a: function(d) {
        return locale_shortDays[d.getDay()];
      },
      A: function(d) {
        return locale_days[d.getDay()];
      },
      b: function(d) {
        return locale_shortMonths[d.getMonth()];
      },
      B: function(d) {
        return locale_months[d.getMonth()];
      },
      c: d3_time_format(locale_dateTime),
      d: function(d, p) {
        return d3_time_formatPad(d.getDate(), p, 2);
      },
      e: function(d, p) {
        return d3_time_formatPad(d.getDate(), p, 2);
      },
      H: function(d, p) {
        return d3_time_formatPad(d.getHours(), p, 2);
      },
      I: function(d, p) {
        return d3_time_formatPad(d.getHours() % 12 || 12, p, 2);
      },
      j: function(d, p) {
        return d3_time_formatPad(1 + d3_time.dayOfYear(d), p, 3);
      },
      L: function(d, p) {
        return d3_time_formatPad(d.getMilliseconds(), p, 3);
      },
      m: function(d, p) {
        return d3_time_formatPad(d.getMonth() + 1, p, 2);
      },
      M: function(d, p) {
        return d3_time_formatPad(d.getMinutes(), p, 2);
      },
      p: function(d) {
        return locale_periods[+(d.getHours() >= 12)];
      },
      S: function(d, p) {
        return d3_time_formatPad(d.getSeconds(), p, 2);
      },
      U: function(d, p) {
        return d3_time_formatPad(d3_time.sundayOfYear(d), p, 2);
      },
      w: function(d) {
        return d.getDay();
      },
      W: function(d, p) {
        return d3_time_formatPad(d3_time.mondayOfYear(d), p, 2);
      },
      x: d3_time_format(locale_date),
      X: d3_time_format(locale_time),
      y: function(d, p) {
        return d3_time_formatPad(d.getFullYear() % 100, p, 2);
      },
      Y: function(d, p) {
        return d3_time_formatPad(d.getFullYear() % 1e4, p, 4);
      },
      Z: d3_time_zone,
      "%": function() {
        return "%";
      }
    };
    var d3_time_parsers = {
      a: d3_time_parseWeekdayAbbrev,
      A: d3_time_parseWeekday,
      b: d3_time_parseMonthAbbrev,
      B: d3_time_parseMonth,
      c: d3_time_parseLocaleFull,
      d: d3_time_parseDay,
      e: d3_time_parseDay,
      H: d3_time_parseHour24,
      I: d3_time_parseHour24,
      j: d3_time_parseDayOfYear,
      L: d3_time_parseMilliseconds,
      m: d3_time_parseMonthNumber,
      M: d3_time_parseMinutes,
      p: d3_time_parseAmPm,
      S: d3_time_parseSeconds,
      U: d3_time_parseWeekNumberSunday,
      w: d3_time_parseWeekdayNumber,
      W: d3_time_parseWeekNumberMonday,
      x: d3_time_parseLocaleDate,
      X: d3_time_parseLocaleTime,
      y: d3_time_parseYear,
      Y: d3_time_parseFullYear,
      Z: d3_time_parseZone,
      "%": d3_time_parseLiteralPercent
    };
    function d3_time_parseWeekdayAbbrev(date, string, i) {
      d3_time_dayAbbrevRe.lastIndex = 0;
      var n = d3_time_dayAbbrevRe.exec(string.slice(i));
      return n ? (date.w = d3_time_dayAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseWeekday(date, string, i) {
      d3_time_dayRe.lastIndex = 0;
      var n = d3_time_dayRe.exec(string.slice(i));
      return n ? (date.w = d3_time_dayLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseMonthAbbrev(date, string, i) {
      d3_time_monthAbbrevRe.lastIndex = 0;
      var n = d3_time_monthAbbrevRe.exec(string.slice(i));
      return n ? (date.m = d3_time_monthAbbrevLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseMonth(date, string, i) {
      d3_time_monthRe.lastIndex = 0;
      var n = d3_time_monthRe.exec(string.slice(i));
      return n ? (date.m = d3_time_monthLookup.get(n[0].toLowerCase()), i + n[0].length) : -1;
    }
    function d3_time_parseLocaleFull(date, string, i) {
      return d3_time_parse(date, d3_time_formats.c.toString(), string, i);
    }
    function d3_time_parseLocaleDate(date, string, i) {
      return d3_time_parse(date, d3_time_formats.x.toString(), string, i);
    }
    function d3_time_parseLocaleTime(date, string, i) {
      return d3_time_parse(date, d3_time_formats.X.toString(), string, i);
    }
    function d3_time_parseAmPm(date, string, i) {
      var n = d3_time_periodLookup.get(string.slice(i, i += 2).toLowerCase());
      return n == null ? -1 : (date.p = n, i);
    }
    return d3_time_format;
  }
  var d3_time_formatPads = {
    "-": "",
    _: " ",
    "0": "0"
  }, d3_time_numberRe = /^\s*\d+/, d3_time_percentRe = /^%/;
  function d3_time_formatPad(value, fill, width) {
    var sign = value < 0 ? "-" : "", string = (sign ? -value : value) + "", length = string.length;
    return sign + (length < width ? new Array(width - length + 1).join(fill) + string : string);
  }
  function d3_time_formatRe(names) {
    return new RegExp("^(?:" + names.map(d3.requote).join("|") + ")", "i");
  }
  function d3_time_formatLookup(names) {
    var map = new d3_Map(), i = -1, n = names.length;
    while (++i < n) map.set(names[i].toLowerCase(), i);
    return map;
  }
  function d3_time_parseWeekdayNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 1));
    return n ? (date.w = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberSunday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i));
    return n ? (date.U = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseWeekNumberMonday(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i));
    return n ? (date.W = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseFullYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 4));
    return n ? (date.y = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.y = d3_time_expandYear(+n[0]), i + n[0].length) : -1;
  }
  function d3_time_parseZone(date, string, i) {
    return /^[+-]\d{4}$/.test(string = string.slice(i, i + 5)) ? (date.Z = -string, 
    i + 5) : -1;
  }
  function d3_time_expandYear(d) {
    return d + (d > 68 ? 1900 : 2e3);
  }
  function d3_time_parseMonthNumber(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.m = n[0] - 1, i + n[0].length) : -1;
  }
  function d3_time_parseDay(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.d = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseDayOfYear(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.j = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseHour24(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.H = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMinutes(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.M = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseSeconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 2));
    return n ? (date.S = +n[0], i + n[0].length) : -1;
  }
  function d3_time_parseMilliseconds(date, string, i) {
    d3_time_numberRe.lastIndex = 0;
    var n = d3_time_numberRe.exec(string.slice(i, i + 3));
    return n ? (date.L = +n[0], i + n[0].length) : -1;
  }
  function d3_time_zone(d) {
    var z = d.getTimezoneOffset(), zs = z > 0 ? "-" : "+", zh = abs(z) / 60 | 0, zm = abs(z) % 60;
    return zs + d3_time_formatPad(zh, "0", 2) + d3_time_formatPad(zm, "0", 2);
  }
  function d3_time_parseLiteralPercent(date, string, i) {
    d3_time_percentRe.lastIndex = 0;
    var n = d3_time_percentRe.exec(string.slice(i, i + 1));
    return n ? i + n[0].length : -1;
  }
  function d3_time_formatMulti(formats) {
    var n = formats.length, i = -1;
    while (++i < n) formats[i][0] = this(formats[i][0]);
    return function(date) {
      var i = 0, f = formats[i];
      while (!f[1](date)) f = formats[++i];
      return f[0](date);
    };
  }
  d3.locale = function(locale) {
    return {
      numberFormat: d3_locale_numberFormat(locale),
      timeFormat: d3_locale_timeFormat(locale)
    };
  };
  var d3_locale_enUS = d3.locale({
    decimal: ".",
    thousands: ",",
    grouping: [ 3 ],
    currency: [ "$", "" ],
    dateTime: "%a %b %e %X %Y",
    date: "%m/%d/%Y",
    time: "%H:%M:%S",
    periods: [ "AM", "PM" ],
    days: [ "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" ],
    shortDays: [ "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" ],
    months: [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ],
    shortMonths: [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
  });
  d3.format = d3_locale_enUS.numberFormat;
  d3.geo = {};
  function d3_adder() {}
  d3_adder.prototype = {
    s: 0,
    t: 0,
    add: function(y) {
      d3_adderSum(y, this.t, d3_adderTemp);
      d3_adderSum(d3_adderTemp.s, this.s, this);
      if (this.s) this.t += d3_adderTemp.t; else this.s = d3_adderTemp.t;
    },
    reset: function() {
      this.s = this.t = 0;
    },
    valueOf: function() {
      return this.s;
    }
  };
  var d3_adderTemp = new d3_adder();
  function d3_adderSum(a, b, o) {
    var x = o.s = a + b, bv = x - a, av = x - bv;
    o.t = a - av + (b - bv);
  }
  d3.geo.stream = function(object, listener) {
    if (object && d3_geo_streamObjectType.hasOwnProperty(object.type)) {
      d3_geo_streamObjectType[object.type](object, listener);
    } else {
      d3_geo_streamGeometry(object, listener);
    }
  };
  function d3_geo_streamGeometry(geometry, listener) {
    if (geometry && d3_geo_streamGeometryType.hasOwnProperty(geometry.type)) {
      d3_geo_streamGeometryType[geometry.type](geometry, listener);
    }
  }
  var d3_geo_streamObjectType = {
    Feature: function(feature, listener) {
      d3_geo_streamGeometry(feature.geometry, listener);
    },
    FeatureCollection: function(object, listener) {
      var features = object.features, i = -1, n = features.length;
      while (++i < n) d3_geo_streamGeometry(features[i].geometry, listener);
    }
  };
  var d3_geo_streamGeometryType = {
    Sphere: function(object, listener) {
      listener.sphere();
    },
    Point: function(object, listener) {
      object = object.coordinates;
      listener.point(object[0], object[1], object[2]);
    },
    MultiPoint: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) object = coordinates[i], listener.point(object[0], object[1], object[2]);
    },
    LineString: function(object, listener) {
      d3_geo_streamLine(object.coordinates, listener, 0);
    },
    MultiLineString: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamLine(coordinates[i], listener, 0);
    },
    Polygon: function(object, listener) {
      d3_geo_streamPolygon(object.coordinates, listener);
    },
    MultiPolygon: function(object, listener) {
      var coordinates = object.coordinates, i = -1, n = coordinates.length;
      while (++i < n) d3_geo_streamPolygon(coordinates[i], listener);
    },
    GeometryCollection: function(object, listener) {
      var geometries = object.geometries, i = -1, n = geometries.length;
      while (++i < n) d3_geo_streamGeometry(geometries[i], listener);
    }
  };
  function d3_geo_streamLine(coordinates, listener, closed) {
    var i = -1, n = coordinates.length - closed, coordinate;
    listener.lineStart();
    while (++i < n) coordinate = coordinates[i], listener.point(coordinate[0], coordinate[1], coordinate[2]);
    listener.lineEnd();
  }
  function d3_geo_streamPolygon(coordinates, listener) {
    var i = -1, n = coordinates.length;
    listener.polygonStart();
    while (++i < n) d3_geo_streamLine(coordinates[i], listener, 1);
    listener.polygonEnd();
  }
  d3.geo.area = function(object) {
    d3_geo_areaSum = 0;
    d3.geo.stream(object, d3_geo_area);
    return d3_geo_areaSum;
  };
  var d3_geo_areaSum, d3_geo_areaRingSum = new d3_adder();
  var d3_geo_area = {
    sphere: function() {
      d3_geo_areaSum += 4 * π;
    },
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_areaRingSum.reset();
      d3_geo_area.lineStart = d3_geo_areaRingStart;
    },
    polygonEnd: function() {
      var area = 2 * d3_geo_areaRingSum;
      d3_geo_areaSum += area < 0 ? 4 * π + area : area;
      d3_geo_area.lineStart = d3_geo_area.lineEnd = d3_geo_area.point = d3_noop;
    }
  };
  function d3_geo_areaRingStart() {
    var λ00, φ00, λ0, cosφ0, sinφ0;
    d3_geo_area.point = function(λ, φ) {
      d3_geo_area.point = nextPoint;
      λ0 = (λ00 = λ) * d3_radians, cosφ0 = Math.cos(φ = (φ00 = φ) * d3_radians / 2 + π / 4), 
      sinφ0 = Math.sin(φ);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      φ = φ * d3_radians / 2 + π / 4;
      var dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, cosφ = Math.cos(φ), sinφ = Math.sin(φ), k = sinφ0 * sinφ, u = cosφ0 * cosφ + k * Math.cos(adλ), v = k * sdλ * Math.sin(adλ);
      d3_geo_areaRingSum.add(Math.atan2(v, u));
      λ0 = λ, cosφ0 = cosφ, sinφ0 = sinφ;
    }
    d3_geo_area.lineEnd = function() {
      nextPoint(λ00, φ00);
    };
  }
  function d3_geo_cartesian(spherical) {
    var λ = spherical[0], φ = spherical[1], cosφ = Math.cos(φ);
    return [ cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ) ];
  }
  function d3_geo_cartesianDot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  }
  function d3_geo_cartesianCross(a, b) {
    return [ a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0] ];
  }
  function d3_geo_cartesianAdd(a, b) {
    a[0] += b[0];
    a[1] += b[1];
    a[2] += b[2];
  }
  function d3_geo_cartesianScale(vector, k) {
    return [ vector[0] * k, vector[1] * k, vector[2] * k ];
  }
  function d3_geo_cartesianNormalize(d) {
    var l = Math.sqrt(d[0] * d[0] + d[1] * d[1] + d[2] * d[2]);
    d[0] /= l;
    d[1] /= l;
    d[2] /= l;
  }
  function d3_geo_spherical(cartesian) {
    return [ Math.atan2(cartesian[1], cartesian[0]), d3_asin(cartesian[2]) ];
  }
  function d3_geo_sphericalEqual(a, b) {
    return abs(a[0] - b[0]) < ε && abs(a[1] - b[1]) < ε;
  }
  d3.geo.bounds = function() {
    var λ0, φ0, λ1, φ1, λ_, λ__, φ__, p0, dλSum, ranges, range;
    var bound = {
      point: point,
      lineStart: lineStart,
      lineEnd: lineEnd,
      polygonStart: function() {
        bound.point = ringPoint;
        bound.lineStart = ringStart;
        bound.lineEnd = ringEnd;
        dλSum = 0;
        d3_geo_area.polygonStart();
      },
      polygonEnd: function() {
        d3_geo_area.polygonEnd();
        bound.point = point;
        bound.lineStart = lineStart;
        bound.lineEnd = lineEnd;
        if (d3_geo_areaRingSum < 0) λ0 = -(λ1 = 180), φ0 = -(φ1 = 90); else if (dλSum > ε) φ1 = 90; else if (dλSum < -ε) φ0 = -90;
        range[0] = λ0, range[1] = λ1;
      }
    };
    function point(λ, φ) {
      ranges.push(range = [ λ0 = λ, λ1 = λ ]);
      if (φ < φ0) φ0 = φ;
      if (φ > φ1) φ1 = φ;
    }
    function linePoint(λ, φ) {
      var p = d3_geo_cartesian([ λ * d3_radians, φ * d3_radians ]);
      if (p0) {
        var normal = d3_geo_cartesianCross(p0, p), equatorial = [ normal[1], -normal[0], 0 ], inflection = d3_geo_cartesianCross(equatorial, normal);
        d3_geo_cartesianNormalize(inflection);
        inflection = d3_geo_spherical(inflection);
        var dλ = λ - λ_, s = dλ > 0 ? 1 : -1, λi = inflection[0] * d3_degrees * s, antimeridian = abs(dλ) > 180;
        if (antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = inflection[1] * d3_degrees;
          if (φi > φ1) φ1 = φi;
        } else if (λi = (λi + 360) % 360 - 180, antimeridian ^ (s * λ_ < λi && λi < s * λ)) {
          var φi = -inflection[1] * d3_degrees;
          if (φi < φ0) φ0 = φi;
        } else {
          if (φ < φ0) φ0 = φ;
          if (φ > φ1) φ1 = φ;
        }
        if (antimeridian) {
          if (λ < λ_) {
            if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
          } else {
            if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
          }
        } else {
          if (λ1 >= λ0) {
            if (λ < λ0) λ0 = λ;
            if (λ > λ1) λ1 = λ;
          } else {
            if (λ > λ_) {
              if (angle(λ0, λ) > angle(λ0, λ1)) λ1 = λ;
            } else {
              if (angle(λ, λ1) > angle(λ0, λ1)) λ0 = λ;
            }
          }
        }
      } else {
        point(λ, φ);
      }
      p0 = p, λ_ = λ;
    }
    function lineStart() {
      bound.point = linePoint;
    }
    function lineEnd() {
      range[0] = λ0, range[1] = λ1;
      bound.point = point;
      p0 = null;
    }
    function ringPoint(λ, φ) {
      if (p0) {
        var dλ = λ - λ_;
        dλSum += abs(dλ) > 180 ? dλ + (dλ > 0 ? 360 : -360) : dλ;
      } else λ__ = λ, φ__ = φ;
      d3_geo_area.point(λ, φ);
      linePoint(λ, φ);
    }
    function ringStart() {
      d3_geo_area.lineStart();
    }
    function ringEnd() {
      ringPoint(λ__, φ__);
      d3_geo_area.lineEnd();
      if (abs(dλSum) > ε) λ0 = -(λ1 = 180);
      range[0] = λ0, range[1] = λ1;
      p0 = null;
    }
    function angle(λ0, λ1) {
      return (λ1 -= λ0) < 0 ? λ1 + 360 : λ1;
    }
    function compareRanges(a, b) {
      return a[0] - b[0];
    }
    function withinRange(x, range) {
      return range[0] <= range[1] ? range[0] <= x && x <= range[1] : x < range[0] || range[1] < x;
    }
    return function(feature) {
      φ1 = λ1 = -(λ0 = φ0 = Infinity);
      ranges = [];
      d3.geo.stream(feature, bound);
      var n = ranges.length;
      if (n) {
        ranges.sort(compareRanges);
        for (var i = 1, a = ranges[0], b, merged = [ a ]; i < n; ++i) {
          b = ranges[i];
          if (withinRange(b[0], a) || withinRange(b[1], a)) {
            if (angle(a[0], b[1]) > angle(a[0], a[1])) a[1] = b[1];
            if (angle(b[0], a[1]) > angle(a[0], a[1])) a[0] = b[0];
          } else {
            merged.push(a = b);
          }
        }
        var best = -Infinity, dλ;
        for (var n = merged.length - 1, i = 0, a = merged[n], b; i <= n; a = b, ++i) {
          b = merged[i];
          if ((dλ = angle(a[1], b[0])) > best) best = dλ, λ0 = b[0], λ1 = a[1];
        }
      }
      ranges = range = null;
      return λ0 === Infinity || φ0 === Infinity ? [ [ NaN, NaN ], [ NaN, NaN ] ] : [ [ λ0, φ0 ], [ λ1, φ1 ] ];
    };
  }();
  d3.geo.centroid = function(object) {
    d3_geo_centroidW0 = d3_geo_centroidW1 = d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
    d3.geo.stream(object, d3_geo_centroid);
    var x = d3_geo_centroidX2, y = d3_geo_centroidY2, z = d3_geo_centroidZ2, m = x * x + y * y + z * z;
    if (m < ε2) {
      x = d3_geo_centroidX1, y = d3_geo_centroidY1, z = d3_geo_centroidZ1;
      if (d3_geo_centroidW1 < ε) x = d3_geo_centroidX0, y = d3_geo_centroidY0, z = d3_geo_centroidZ0;
      m = x * x + y * y + z * z;
      if (m < ε2) return [ NaN, NaN ];
    }
    return [ Math.atan2(y, x) * d3_degrees, d3_asin(z / Math.sqrt(m)) * d3_degrees ];
  };
  var d3_geo_centroidW0, d3_geo_centroidW1, d3_geo_centroidX0, d3_geo_centroidY0, d3_geo_centroidZ0, d3_geo_centroidX1, d3_geo_centroidY1, d3_geo_centroidZ1, d3_geo_centroidX2, d3_geo_centroidY2, d3_geo_centroidZ2;
  var d3_geo_centroid = {
    sphere: d3_noop,
    point: d3_geo_centroidPoint,
    lineStart: d3_geo_centroidLineStart,
    lineEnd: d3_geo_centroidLineEnd,
    polygonStart: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_centroid.lineStart = d3_geo_centroidLineStart;
    }
  };
  function d3_geo_centroidPoint(λ, φ) {
    λ *= d3_radians;
    var cosφ = Math.cos(φ *= d3_radians);
    d3_geo_centroidPointXYZ(cosφ * Math.cos(λ), cosφ * Math.sin(λ), Math.sin(φ));
  }
  function d3_geo_centroidPointXYZ(x, y, z) {
    ++d3_geo_centroidW0;
    d3_geo_centroidX0 += (x - d3_geo_centroidX0) / d3_geo_centroidW0;
    d3_geo_centroidY0 += (y - d3_geo_centroidY0) / d3_geo_centroidW0;
    d3_geo_centroidZ0 += (z - d3_geo_centroidZ0) / d3_geo_centroidW0;
  }
  function d3_geo_centroidLineStart() {
    var x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroid.point = nextPoint;
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), w = Math.atan2(Math.sqrt((w = y0 * z - z0 * y) * w + (w = z0 * x - x0 * z) * w + (w = x0 * y - y0 * x) * w), x0 * x + y0 * y + z0 * z);
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_centroidLineEnd() {
    d3_geo_centroid.point = d3_geo_centroidPoint;
  }
  function d3_geo_centroidRingStart() {
    var λ00, φ00, x0, y0, z0;
    d3_geo_centroid.point = function(λ, φ) {
      λ00 = λ, φ00 = φ;
      d3_geo_centroid.point = nextPoint;
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians);
      x0 = cosφ * Math.cos(λ);
      y0 = cosφ * Math.sin(λ);
      z0 = Math.sin(φ);
      d3_geo_centroidPointXYZ(x0, y0, z0);
    };
    d3_geo_centroid.lineEnd = function() {
      nextPoint(λ00, φ00);
      d3_geo_centroid.lineEnd = d3_geo_centroidLineEnd;
      d3_geo_centroid.point = d3_geo_centroidPoint;
    };
    function nextPoint(λ, φ) {
      λ *= d3_radians;
      var cosφ = Math.cos(φ *= d3_radians), x = cosφ * Math.cos(λ), y = cosφ * Math.sin(λ), z = Math.sin(φ), cx = y0 * z - z0 * y, cy = z0 * x - x0 * z, cz = x0 * y - y0 * x, m = Math.sqrt(cx * cx + cy * cy + cz * cz), u = x0 * x + y0 * y + z0 * z, v = m && -d3_acos(u) / m, w = Math.atan2(m, u);
      d3_geo_centroidX2 += v * cx;
      d3_geo_centroidY2 += v * cy;
      d3_geo_centroidZ2 += v * cz;
      d3_geo_centroidW1 += w;
      d3_geo_centroidX1 += w * (x0 + (x0 = x));
      d3_geo_centroidY1 += w * (y0 + (y0 = y));
      d3_geo_centroidZ1 += w * (z0 + (z0 = z));
      d3_geo_centroidPointXYZ(x0, y0, z0);
    }
  }
  function d3_geo_compose(a, b) {
    function compose(x, y) {
      return x = a(x, y), b(x[0], x[1]);
    }
    if (a.invert && b.invert) compose.invert = function(x, y) {
      return x = b.invert(x, y), x && a.invert(x[0], x[1]);
    };
    return compose;
  }
  function d3_true() {
    return true;
  }
  function d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener) {
    var subject = [], clip = [];
    segments.forEach(function(segment) {
      if ((n = segment.length - 1) <= 0) return;
      var n, p0 = segment[0], p1 = segment[n];
      if (d3_geo_sphericalEqual(p0, p1)) {
        listener.lineStart();
        for (var i = 0; i < n; ++i) listener.point((p0 = segment[i])[0], p0[1]);
        listener.lineEnd();
        return;
      }
      var a = new d3_geo_clipPolygonIntersection(p0, segment, null, true), b = new d3_geo_clipPolygonIntersection(p0, null, a, false);
      a.o = b;
      subject.push(a);
      clip.push(b);
      a = new d3_geo_clipPolygonIntersection(p1, segment, null, false);
      b = new d3_geo_clipPolygonIntersection(p1, null, a, true);
      a.o = b;
      subject.push(a);
      clip.push(b);
    });
    clip.sort(compare);
    d3_geo_clipPolygonLinkCircular(subject);
    d3_geo_clipPolygonLinkCircular(clip);
    if (!subject.length) return;
    for (var i = 0, entry = clipStartInside, n = clip.length; i < n; ++i) {
      clip[i].e = entry = !entry;
    }
    var start = subject[0], points, point;
    while (1) {
      var current = start, isSubject = true;
      while (current.v) if ((current = current.n) === start) return;
      points = current.z;
      listener.lineStart();
      do {
        current.v = current.o.v = true;
        if (current.e) {
          if (isSubject) {
            for (var i = 0, n = points.length; i < n; ++i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.n.x, 1, listener);
          }
          current = current.n;
        } else {
          if (isSubject) {
            points = current.p.z;
            for (var i = points.length - 1; i >= 0; --i) listener.point((point = points[i])[0], point[1]);
          } else {
            interpolate(current.x, current.p.x, -1, listener);
          }
          current = current.p;
        }
        current = current.o;
        points = current.z;
        isSubject = !isSubject;
      } while (!current.v);
      listener.lineEnd();
    }
  }
  function d3_geo_clipPolygonLinkCircular(array) {
    if (!(n = array.length)) return;
    var n, i = 0, a = array[0], b;
    while (++i < n) {
      a.n = b = array[i];
      b.p = a;
      a = b;
    }
    a.n = b = array[0];
    b.p = a;
  }
  function d3_geo_clipPolygonIntersection(point, points, other, entry) {
    this.x = point;
    this.z = points;
    this.o = other;
    this.e = entry;
    this.v = false;
    this.n = this.p = null;
  }
  function d3_geo_clip(pointVisible, clipLine, interpolate, clipStart) {
    return function(rotate, listener) {
      var line = clipLine(listener), rotatedClipStart = rotate.invert(clipStart[0], clipStart[1]);
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          clip.point = pointRing;
          clip.lineStart = ringStart;
          clip.lineEnd = ringEnd;
          segments = [];
          polygon = [];
        },
        polygonEnd: function() {
          clip.point = point;
          clip.lineStart = lineStart;
          clip.lineEnd = lineEnd;
          segments = d3.merge(segments);
          var clipStartInside = d3_geo_pointInPolygon(rotatedClipStart, polygon);
          if (segments.length) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            d3_geo_clipPolygon(segments, d3_geo_clipSort, clipStartInside, interpolate, listener);
          } else if (clipStartInside) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            listener.lineStart();
            interpolate(null, null, 1, listener);
            listener.lineEnd();
          }
          if (polygonStarted) listener.polygonEnd(), polygonStarted = false;
          segments = polygon = null;
        },
        sphere: function() {
          listener.polygonStart();
          listener.lineStart();
          interpolate(null, null, 1, listener);
          listener.lineEnd();
          listener.polygonEnd();
        }
      };
      function point(λ, φ) {
        var point = rotate(λ, φ);
        if (pointVisible(λ = point[0], φ = point[1])) listener.point(λ, φ);
      }
      function pointLine(λ, φ) {
        var point = rotate(λ, φ);
        line.point(point[0], point[1]);
      }
      function lineStart() {
        clip.point = pointLine;
        line.lineStart();
      }
      function lineEnd() {
        clip.point = point;
        line.lineEnd();
      }
      var segments;
      var buffer = d3_geo_clipBufferListener(), ringListener = clipLine(buffer), polygonStarted = false, polygon, ring;
      function pointRing(λ, φ) {
        ring.push([ λ, φ ]);
        var point = rotate(λ, φ);
        ringListener.point(point[0], point[1]);
      }
      function ringStart() {
        ringListener.lineStart();
        ring = [];
      }
      function ringEnd() {
        pointRing(ring[0][0], ring[0][1]);
        ringListener.lineEnd();
        var clean = ringListener.clean(), ringSegments = buffer.buffer(), segment, n = ringSegments.length;
        ring.pop();
        polygon.push(ring);
        ring = null;
        if (!n) return;
        if (clean & 1) {
          segment = ringSegments[0];
          var n = segment.length - 1, i = -1, point;
          if (n > 0) {
            if (!polygonStarted) listener.polygonStart(), polygonStarted = true;
            listener.lineStart();
            while (++i < n) listener.point((point = segment[i])[0], point[1]);
            listener.lineEnd();
          }
          return;
        }
        if (n > 1 && clean & 2) ringSegments.push(ringSegments.pop().concat(ringSegments.shift()));
        segments.push(ringSegments.filter(d3_geo_clipSegmentLength1));
      }
      return clip;
    };
  }
  function d3_geo_clipSegmentLength1(segment) {
    return segment.length > 1;
  }
  function d3_geo_clipBufferListener() {
    var lines = [], line;
    return {
      lineStart: function() {
        lines.push(line = []);
      },
      point: function(λ, φ) {
        line.push([ λ, φ ]);
      },
      lineEnd: d3_noop,
      buffer: function() {
        var buffer = lines;
        lines = [];
        line = null;
        return buffer;
      },
      rejoin: function() {
        if (lines.length > 1) lines.push(lines.pop().concat(lines.shift()));
      }
    };
  }
  function d3_geo_clipSort(a, b) {
    return ((a = a.x)[0] < 0 ? a[1] - halfπ - ε : halfπ - a[1]) - ((b = b.x)[0] < 0 ? b[1] - halfπ - ε : halfπ - b[1]);
  }
  var d3_geo_clipAntimeridian = d3_geo_clip(d3_true, d3_geo_clipAntimeridianLine, d3_geo_clipAntimeridianInterpolate, [ -π, -π / 2 ]);
  function d3_geo_clipAntimeridianLine(listener) {
    var λ0 = NaN, φ0 = NaN, sλ0 = NaN, clean;
    return {
      lineStart: function() {
        listener.lineStart();
        clean = 1;
      },
      point: function(λ1, φ1) {
        var sλ1 = λ1 > 0 ? π : -π, dλ = abs(λ1 - λ0);
        if (abs(dλ - π) < ε) {
          listener.point(λ0, φ0 = (φ0 + φ1) / 2 > 0 ? halfπ : -halfπ);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          listener.point(λ1, φ0);
          clean = 0;
        } else if (sλ0 !== sλ1 && dλ >= π) {
          if (abs(λ0 - sλ0) < ε) λ0 -= sλ0 * ε;
          if (abs(λ1 - sλ1) < ε) λ1 -= sλ1 * ε;
          φ0 = d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1);
          listener.point(sλ0, φ0);
          listener.lineEnd();
          listener.lineStart();
          listener.point(sλ1, φ0);
          clean = 0;
        }
        listener.point(λ0 = λ1, φ0 = φ1);
        sλ0 = sλ1;
      },
      lineEnd: function() {
        listener.lineEnd();
        λ0 = φ0 = NaN;
      },
      clean: function() {
        return 2 - clean;
      }
    };
  }
  function d3_geo_clipAntimeridianIntersect(λ0, φ0, λ1, φ1) {
    var cosφ0, cosφ1, sinλ0_λ1 = Math.sin(λ0 - λ1);
    return abs(sinλ0_λ1) > ε ? Math.atan((Math.sin(φ0) * (cosφ1 = Math.cos(φ1)) * Math.sin(λ1) - Math.sin(φ1) * (cosφ0 = Math.cos(φ0)) * Math.sin(λ0)) / (cosφ0 * cosφ1 * sinλ0_λ1)) : (φ0 + φ1) / 2;
  }
  function d3_geo_clipAntimeridianInterpolate(from, to, direction, listener) {
    var φ;
    if (from == null) {
      φ = direction * halfπ;
      listener.point(-π, φ);
      listener.point(0, φ);
      listener.point(π, φ);
      listener.point(π, 0);
      listener.point(π, -φ);
      listener.point(0, -φ);
      listener.point(-π, -φ);
      listener.point(-π, 0);
      listener.point(-π, φ);
    } else if (abs(from[0] - to[0]) > ε) {
      var s = from[0] < to[0] ? π : -π;
      φ = direction * s / 2;
      listener.point(-s, φ);
      listener.point(0, φ);
      listener.point(s, φ);
    } else {
      listener.point(to[0], to[1]);
    }
  }
  function d3_geo_pointInPolygon(point, polygon) {
    var meridian = point[0], parallel = point[1], meridianNormal = [ Math.sin(meridian), -Math.cos(meridian), 0 ], polarAngle = 0, winding = 0;
    d3_geo_areaRingSum.reset();
    for (var i = 0, n = polygon.length; i < n; ++i) {
      var ring = polygon[i], m = ring.length;
      if (!m) continue;
      var point0 = ring[0], λ0 = point0[0], φ0 = point0[1] / 2 + π / 4, sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), j = 1;
      while (true) {
        if (j === m) j = 0;
        point = ring[j];
        var λ = point[0], φ = point[1] / 2 + π / 4, sinφ = Math.sin(φ), cosφ = Math.cos(φ), dλ = λ - λ0, sdλ = dλ >= 0 ? 1 : -1, adλ = sdλ * dλ, antimeridian = adλ > π, k = sinφ0 * sinφ;
        d3_geo_areaRingSum.add(Math.atan2(k * sdλ * Math.sin(adλ), cosφ0 * cosφ + k * Math.cos(adλ)));
        polarAngle += antimeridian ? dλ + sdλ * τ : dλ;
        if (antimeridian ^ λ0 >= meridian ^ λ >= meridian) {
          var arc = d3_geo_cartesianCross(d3_geo_cartesian(point0), d3_geo_cartesian(point));
          d3_geo_cartesianNormalize(arc);
          var intersection = d3_geo_cartesianCross(meridianNormal, arc);
          d3_geo_cartesianNormalize(intersection);
          var φarc = (antimeridian ^ dλ >= 0 ? -1 : 1) * d3_asin(intersection[2]);
          if (parallel > φarc || parallel === φarc && (arc[0] || arc[1])) {
            winding += antimeridian ^ dλ >= 0 ? 1 : -1;
          }
        }
        if (!j++) break;
        λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ, point0 = point;
      }
    }
    return (polarAngle < -ε || polarAngle < ε && d3_geo_areaRingSum < -ε) ^ winding & 1;
  }
  function d3_geo_clipCircle(radius) {
    var cr = Math.cos(radius), smallRadius = cr > 0, notHemisphere = abs(cr) > ε, interpolate = d3_geo_circleInterpolate(radius, 6 * d3_radians);
    return d3_geo_clip(visible, clipLine, interpolate, smallRadius ? [ 0, -radius ] : [ -π, radius - π ]);
    function visible(λ, φ) {
      return Math.cos(λ) * Math.cos(φ) > cr;
    }
    function clipLine(listener) {
      var point0, c0, v0, v00, clean;
      return {
        lineStart: function() {
          v00 = v0 = false;
          clean = 1;
        },
        point: function(λ, φ) {
          var point1 = [ λ, φ ], point2, v = visible(λ, φ), c = smallRadius ? v ? 0 : code(λ, φ) : v ? code(λ + (λ < 0 ? π : -π), φ) : 0;
          if (!point0 && (v00 = v0 = v)) listener.lineStart();
          if (v !== v0) {
            point2 = intersect(point0, point1);
            if (d3_geo_sphericalEqual(point0, point2) || d3_geo_sphericalEqual(point1, point2)) {
              point1[0] += ε;
              point1[1] += ε;
              v = visible(point1[0], point1[1]);
            }
          }
          if (v !== v0) {
            clean = 0;
            if (v) {
              listener.lineStart();
              point2 = intersect(point1, point0);
              listener.point(point2[0], point2[1]);
            } else {
              point2 = intersect(point0, point1);
              listener.point(point2[0], point2[1]);
              listener.lineEnd();
            }
            point0 = point2;
          } else if (notHemisphere && point0 && smallRadius ^ v) {
            var t;
            if (!(c & c0) && (t = intersect(point1, point0, true))) {
              clean = 0;
              if (smallRadius) {
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
              } else {
                listener.point(t[1][0], t[1][1]);
                listener.lineEnd();
                listener.lineStart();
                listener.point(t[0][0], t[0][1]);
              }
            }
          }
          if (v && (!point0 || !d3_geo_sphericalEqual(point0, point1))) {
            listener.point(point1[0], point1[1]);
          }
          point0 = point1, v0 = v, c0 = c;
        },
        lineEnd: function() {
          if (v0) listener.lineEnd();
          point0 = null;
        },
        clean: function() {
          return clean | (v00 && v0) << 1;
        }
      };
    }
    function intersect(a, b, two) {
      var pa = d3_geo_cartesian(a), pb = d3_geo_cartesian(b);
      var n1 = [ 1, 0, 0 ], n2 = d3_geo_cartesianCross(pa, pb), n2n2 = d3_geo_cartesianDot(n2, n2), n1n2 = n2[0], determinant = n2n2 - n1n2 * n1n2;
      if (!determinant) return !two && a;
      var c1 = cr * n2n2 / determinant, c2 = -cr * n1n2 / determinant, n1xn2 = d3_geo_cartesianCross(n1, n2), A = d3_geo_cartesianScale(n1, c1), B = d3_geo_cartesianScale(n2, c2);
      d3_geo_cartesianAdd(A, B);
      var u = n1xn2, w = d3_geo_cartesianDot(A, u), uu = d3_geo_cartesianDot(u, u), t2 = w * w - uu * (d3_geo_cartesianDot(A, A) - 1);
      if (t2 < 0) return;
      var t = Math.sqrt(t2), q = d3_geo_cartesianScale(u, (-w - t) / uu);
      d3_geo_cartesianAdd(q, A);
      q = d3_geo_spherical(q);
      if (!two) return q;
      var λ0 = a[0], λ1 = b[0], φ0 = a[1], φ1 = b[1], z;
      if (λ1 < λ0) z = λ0, λ0 = λ1, λ1 = z;
      var δλ = λ1 - λ0, polar = abs(δλ - π) < ε, meridian = polar || δλ < ε;
      if (!polar && φ1 < φ0) z = φ0, φ0 = φ1, φ1 = z;
      if (meridian ? polar ? φ0 + φ1 > 0 ^ q[1] < (abs(q[0] - λ0) < ε ? φ0 : φ1) : φ0 <= q[1] && q[1] <= φ1 : δλ > π ^ (λ0 <= q[0] && q[0] <= λ1)) {
        var q1 = d3_geo_cartesianScale(u, (-w + t) / uu);
        d3_geo_cartesianAdd(q1, A);
        return [ q, d3_geo_spherical(q1) ];
      }
    }
    function code(λ, φ) {
      var r = smallRadius ? radius : π - radius, code = 0;
      if (λ < -r) code |= 1; else if (λ > r) code |= 2;
      if (φ < -r) code |= 4; else if (φ > r) code |= 8;
      return code;
    }
  }
  function d3_geom_clipLine(x0, y0, x1, y1) {
    return function(line) {
      var a = line.a, b = line.b, ax = a.x, ay = a.y, bx = b.x, by = b.y, t0 = 0, t1 = 1, dx = bx - ax, dy = by - ay, r;
      r = x0 - ax;
      if (!dx && r > 0) return;
      r /= dx;
      if (dx < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dx > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = x1 - ax;
      if (!dx && r < 0) return;
      r /= dx;
      if (dx < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dx > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      r = y0 - ay;
      if (!dy && r > 0) return;
      r /= dy;
      if (dy < 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      } else if (dy > 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      }
      r = y1 - ay;
      if (!dy && r < 0) return;
      r /= dy;
      if (dy < 0) {
        if (r > t1) return;
        if (r > t0) t0 = r;
      } else if (dy > 0) {
        if (r < t0) return;
        if (r < t1) t1 = r;
      }
      if (t0 > 0) line.a = {
        x: ax + t0 * dx,
        y: ay + t0 * dy
      };
      if (t1 < 1) line.b = {
        x: ax + t1 * dx,
        y: ay + t1 * dy
      };
      return line;
    };
  }
  var d3_geo_clipExtentMAX = 1e9;
  d3.geo.clipExtent = function() {
    var x0, y0, x1, y1, stream, clip, clipExtent = {
      stream: function(output) {
        if (stream) stream.valid = false;
        stream = clip(output);
        stream.valid = true;
        return stream;
      },
      extent: function(_) {
        if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
        clip = d3_geo_clipExtent(x0 = +_[0][0], y0 = +_[0][1], x1 = +_[1][0], y1 = +_[1][1]);
        if (stream) stream.valid = false, stream = null;
        return clipExtent;
      }
    };
    return clipExtent.extent([ [ 0, 0 ], [ 960, 500 ] ]);
  };
  function d3_geo_clipExtent(x0, y0, x1, y1) {
    return function(listener) {
      var listener_ = listener, bufferListener = d3_geo_clipBufferListener(), clipLine = d3_geom_clipLine(x0, y0, x1, y1), segments, polygon, ring;
      var clip = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          listener = bufferListener;
          segments = [];
          polygon = [];
          clean = true;
        },
        polygonEnd: function() {
          listener = listener_;
          segments = d3.merge(segments);
          var clipStartInside = insidePolygon([ x0, y1 ]), inside = clean && clipStartInside, visible = segments.length;
          if (inside || visible) {
            listener.polygonStart();
            if (inside) {
              listener.lineStart();
              interpolate(null, null, 1, listener);
              listener.lineEnd();
            }
            if (visible) {
              d3_geo_clipPolygon(segments, compare, clipStartInside, interpolate, listener);
            }
            listener.polygonEnd();
          }
          segments = polygon = ring = null;
        }
      };
      function insidePolygon(p) {
        var wn = 0, n = polygon.length, y = p[1];
        for (var i = 0; i < n; ++i) {
          for (var j = 1, v = polygon[i], m = v.length, a = v[0], b; j < m; ++j) {
            b = v[j];
            if (a[1] <= y) {
              if (b[1] > y && d3_cross2d(a, b, p) > 0) ++wn;
            } else {
              if (b[1] <= y && d3_cross2d(a, b, p) < 0) --wn;
            }
            a = b;
          }
        }
        return wn !== 0;
      }
      function interpolate(from, to, direction, listener) {
        var a = 0, a1 = 0;
        if (from == null || (a = corner(from, direction)) !== (a1 = corner(to, direction)) || comparePoints(from, to) < 0 ^ direction > 0) {
          do {
            listener.point(a === 0 || a === 3 ? x0 : x1, a > 1 ? y1 : y0);
          } while ((a = (a + direction + 4) % 4) !== a1);
        } else {
          listener.point(to[0], to[1]);
        }
      }
      function pointVisible(x, y) {
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
      }
      function point(x, y) {
        if (pointVisible(x, y)) listener.point(x, y);
      }
      var x__, y__, v__, x_, y_, v_, first, clean;
      function lineStart() {
        clip.point = linePoint;
        if (polygon) polygon.push(ring = []);
        first = true;
        v_ = false;
        x_ = y_ = NaN;
      }
      function lineEnd() {
        if (segments) {
          linePoint(x__, y__);
          if (v__ && v_) bufferListener.rejoin();
          segments.push(bufferListener.buffer());
        }
        clip.point = point;
        if (v_) listener.lineEnd();
      }
      function linePoint(x, y) {
        x = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, x));
        y = Math.max(-d3_geo_clipExtentMAX, Math.min(d3_geo_clipExtentMAX, y));
        var v = pointVisible(x, y);
        if (polygon) ring.push([ x, y ]);
        if (first) {
          x__ = x, y__ = y, v__ = v;
          first = false;
          if (v) {
            listener.lineStart();
            listener.point(x, y);
          }
        } else {
          if (v && v_) listener.point(x, y); else {
            var l = {
              a: {
                x: x_,
                y: y_
              },
              b: {
                x: x,
                y: y
              }
            };
            if (clipLine(l)) {
              if (!v_) {
                listener.lineStart();
                listener.point(l.a.x, l.a.y);
              }
              listener.point(l.b.x, l.b.y);
              if (!v) listener.lineEnd();
              clean = false;
            } else if (v) {
              listener.lineStart();
              listener.point(x, y);
              clean = false;
            }
          }
        }
        x_ = x, y_ = y, v_ = v;
      }
      return clip;
    };
    function corner(p, direction) {
      return abs(p[0] - x0) < ε ? direction > 0 ? 0 : 3 : abs(p[0] - x1) < ε ? direction > 0 ? 2 : 1 : abs(p[1] - y0) < ε ? direction > 0 ? 1 : 0 : direction > 0 ? 3 : 2;
    }
    function compare(a, b) {
      return comparePoints(a.x, b.x);
    }
    function comparePoints(a, b) {
      var ca = corner(a, 1), cb = corner(b, 1);
      return ca !== cb ? ca - cb : ca === 0 ? b[1] - a[1] : ca === 1 ? a[0] - b[0] : ca === 2 ? a[1] - b[1] : b[0] - a[0];
    }
  }
  function d3_geo_conic(projectAt) {
    var φ0 = 0, φ1 = π / 3, m = d3_geo_projectionMutator(projectAt), p = m(φ0, φ1);
    p.parallels = function(_) {
      if (!arguments.length) return [ φ0 / π * 180, φ1 / π * 180 ];
      return m(φ0 = _[0] * π / 180, φ1 = _[1] * π / 180);
    };
    return p;
  }
  function d3_geo_conicEqualArea(φ0, φ1) {
    var sinφ0 = Math.sin(φ0), n = (sinφ0 + Math.sin(φ1)) / 2, C = 1 + sinφ0 * (2 * n - sinφ0), ρ0 = Math.sqrt(C) / n;
    function forward(λ, φ) {
      var ρ = Math.sqrt(C - 2 * n * Math.sin(φ)) / n;
      return [ ρ * Math.sin(λ *= n), ρ0 - ρ * Math.cos(λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = ρ0 - y;
      return [ Math.atan2(x, ρ0_y) / n, d3_asin((C - (x * x + ρ0_y * ρ0_y) * n * n) / (2 * n)) ];
    };
    return forward;
  }
  (d3.geo.conicEqualArea = function() {
    return d3_geo_conic(d3_geo_conicEqualArea);
  }).raw = d3_geo_conicEqualArea;
  d3.geo.albers = function() {
    return d3.geo.conicEqualArea().rotate([ 96, 0 ]).center([ -.6, 38.7 ]).parallels([ 29.5, 45.5 ]).scale(1070);
  };
  d3.geo.albersUsa = function() {
    var lower48 = d3.geo.albers();
    var alaska = d3.geo.conicEqualArea().rotate([ 154, 0 ]).center([ -2, 58.5 ]).parallels([ 55, 65 ]);
    var hawaii = d3.geo.conicEqualArea().rotate([ 157, 0 ]).center([ -3, 19.9 ]).parallels([ 8, 18 ]);
    var point, pointStream = {
      point: function(x, y) {
        point = [ x, y ];
      }
    }, lower48Point, alaskaPoint, hawaiiPoint;
    function albersUsa(coordinates) {
      var x = coordinates[0], y = coordinates[1];
      point = null;
      (lower48Point(x, y), point) || (alaskaPoint(x, y), point) || hawaiiPoint(x, y);
      return point;
    }
    albersUsa.invert = function(coordinates) {
      var k = lower48.scale(), t = lower48.translate(), x = (coordinates[0] - t[0]) / k, y = (coordinates[1] - t[1]) / k;
      return (y >= .12 && y < .234 && x >= -.425 && x < -.214 ? alaska : y >= .166 && y < .234 && x >= -.214 && x < -.115 ? hawaii : lower48).invert(coordinates);
    };
    albersUsa.stream = function(stream) {
      var lower48Stream = lower48.stream(stream), alaskaStream = alaska.stream(stream), hawaiiStream = hawaii.stream(stream);
      return {
        point: function(x, y) {
          lower48Stream.point(x, y);
          alaskaStream.point(x, y);
          hawaiiStream.point(x, y);
        },
        sphere: function() {
          lower48Stream.sphere();
          alaskaStream.sphere();
          hawaiiStream.sphere();
        },
        lineStart: function() {
          lower48Stream.lineStart();
          alaskaStream.lineStart();
          hawaiiStream.lineStart();
        },
        lineEnd: function() {
          lower48Stream.lineEnd();
          alaskaStream.lineEnd();
          hawaiiStream.lineEnd();
        },
        polygonStart: function() {
          lower48Stream.polygonStart();
          alaskaStream.polygonStart();
          hawaiiStream.polygonStart();
        },
        polygonEnd: function() {
          lower48Stream.polygonEnd();
          alaskaStream.polygonEnd();
          hawaiiStream.polygonEnd();
        }
      };
    };
    albersUsa.precision = function(_) {
      if (!arguments.length) return lower48.precision();
      lower48.precision(_);
      alaska.precision(_);
      hawaii.precision(_);
      return albersUsa;
    };
    albersUsa.scale = function(_) {
      if (!arguments.length) return lower48.scale();
      lower48.scale(_);
      alaska.scale(_ * .35);
      hawaii.scale(_);
      return albersUsa.translate(lower48.translate());
    };
    albersUsa.translate = function(_) {
      if (!arguments.length) return lower48.translate();
      var k = lower48.scale(), x = +_[0], y = +_[1];
      lower48Point = lower48.translate(_).clipExtent([ [ x - .455 * k, y - .238 * k ], [ x + .455 * k, y + .238 * k ] ]).stream(pointStream).point;
      alaskaPoint = alaska.translate([ x - .307 * k, y + .201 * k ]).clipExtent([ [ x - .425 * k + ε, y + .12 * k + ε ], [ x - .214 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      hawaiiPoint = hawaii.translate([ x - .205 * k, y + .212 * k ]).clipExtent([ [ x - .214 * k + ε, y + .166 * k + ε ], [ x - .115 * k - ε, y + .234 * k - ε ] ]).stream(pointStream).point;
      return albersUsa;
    };
    return albersUsa.scale(1070);
  };
  var d3_geo_pathAreaSum, d3_geo_pathAreaPolygon, d3_geo_pathArea = {
    point: d3_noop,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: function() {
      d3_geo_pathAreaPolygon = 0;
      d3_geo_pathArea.lineStart = d3_geo_pathAreaRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathArea.lineStart = d3_geo_pathArea.lineEnd = d3_geo_pathArea.point = d3_noop;
      d3_geo_pathAreaSum += abs(d3_geo_pathAreaPolygon / 2);
    }
  };
  function d3_geo_pathAreaRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathArea.point = function(x, y) {
      d3_geo_pathArea.point = nextPoint;
      x00 = x0 = x, y00 = y0 = y;
    };
    function nextPoint(x, y) {
      d3_geo_pathAreaPolygon += y0 * x - x0 * y;
      x0 = x, y0 = y;
    }
    d3_geo_pathArea.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  var d3_geo_pathBoundsX0, d3_geo_pathBoundsY0, d3_geo_pathBoundsX1, d3_geo_pathBoundsY1;
  var d3_geo_pathBounds = {
    point: d3_geo_pathBoundsPoint,
    lineStart: d3_noop,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_pathBoundsPoint(x, y) {
    if (x < d3_geo_pathBoundsX0) d3_geo_pathBoundsX0 = x;
    if (x > d3_geo_pathBoundsX1) d3_geo_pathBoundsX1 = x;
    if (y < d3_geo_pathBoundsY0) d3_geo_pathBoundsY0 = y;
    if (y > d3_geo_pathBoundsY1) d3_geo_pathBoundsY1 = y;
  }
  function d3_geo_pathBuffer() {
    var pointCircle = d3_geo_pathBufferCircle(4.5), buffer = [];
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointCircle = d3_geo_pathBufferCircle(_);
        return stream;
      },
      result: function() {
        if (buffer.length) {
          var result = buffer.join("");
          buffer = [];
          return result;
        }
      }
    };
    function point(x, y) {
      buffer.push("M", x, ",", y, pointCircle);
    }
    function pointLineStart(x, y) {
      buffer.push("M", x, ",", y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      buffer.push("L", x, ",", y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      buffer.push("Z");
    }
    return stream;
  }
  function d3_geo_pathBufferCircle(radius) {
    return "m0," + radius + "a" + radius + "," + radius + " 0 1,1 0," + -2 * radius + "a" + radius + "," + radius + " 0 1,1 0," + 2 * radius + "z";
  }
  var d3_geo_pathCentroid = {
    point: d3_geo_pathCentroidPoint,
    lineStart: d3_geo_pathCentroidLineStart,
    lineEnd: d3_geo_pathCentroidLineEnd,
    polygonStart: function() {
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidRingStart;
    },
    polygonEnd: function() {
      d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
      d3_geo_pathCentroid.lineStart = d3_geo_pathCentroidLineStart;
      d3_geo_pathCentroid.lineEnd = d3_geo_pathCentroidLineEnd;
    }
  };
  function d3_geo_pathCentroidPoint(x, y) {
    d3_geo_centroidX0 += x;
    d3_geo_centroidY0 += y;
    ++d3_geo_centroidZ0;
  }
  function d3_geo_pathCentroidLineStart() {
    var x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
  }
  function d3_geo_pathCentroidLineEnd() {
    d3_geo_pathCentroid.point = d3_geo_pathCentroidPoint;
  }
  function d3_geo_pathCentroidRingStart() {
    var x00, y00, x0, y0;
    d3_geo_pathCentroid.point = function(x, y) {
      d3_geo_pathCentroid.point = nextPoint;
      d3_geo_pathCentroidPoint(x00 = x0 = x, y00 = y0 = y);
    };
    function nextPoint(x, y) {
      var dx = x - x0, dy = y - y0, z = Math.sqrt(dx * dx + dy * dy);
      d3_geo_centroidX1 += z * (x0 + x) / 2;
      d3_geo_centroidY1 += z * (y0 + y) / 2;
      d3_geo_centroidZ1 += z;
      z = y0 * x - x0 * y;
      d3_geo_centroidX2 += z * (x0 + x);
      d3_geo_centroidY2 += z * (y0 + y);
      d3_geo_centroidZ2 += z * 3;
      d3_geo_pathCentroidPoint(x0 = x, y0 = y);
    }
    d3_geo_pathCentroid.lineEnd = function() {
      nextPoint(x00, y00);
    };
  }
  function d3_geo_pathContext(context) {
    var pointRadius = 4.5;
    var stream = {
      point: point,
      lineStart: function() {
        stream.point = pointLineStart;
      },
      lineEnd: lineEnd,
      polygonStart: function() {
        stream.lineEnd = lineEndPolygon;
      },
      polygonEnd: function() {
        stream.lineEnd = lineEnd;
        stream.point = point;
      },
      pointRadius: function(_) {
        pointRadius = _;
        return stream;
      },
      result: d3_noop
    };
    function point(x, y) {
      context.moveTo(x + pointRadius, y);
      context.arc(x, y, pointRadius, 0, τ);
    }
    function pointLineStart(x, y) {
      context.moveTo(x, y);
      stream.point = pointLine;
    }
    function pointLine(x, y) {
      context.lineTo(x, y);
    }
    function lineEnd() {
      stream.point = point;
    }
    function lineEndPolygon() {
      context.closePath();
    }
    return stream;
  }
  function d3_geo_resample(project) {
    var δ2 = .5, cosMinDistance = Math.cos(30 * d3_radians), maxDepth = 16;
    function resample(stream) {
      return (maxDepth ? resampleRecursive : resampleNone)(stream);
    }
    function resampleNone(stream) {
      return d3_geo_transformPoint(stream, function(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      });
    }
    function resampleRecursive(stream) {
      var λ00, φ00, x00, y00, a00, b00, c00, λ0, x0, y0, a0, b0, c0;
      var resample = {
        point: point,
        lineStart: lineStart,
        lineEnd: lineEnd,
        polygonStart: function() {
          stream.polygonStart();
          resample.lineStart = ringStart;
        },
        polygonEnd: function() {
          stream.polygonEnd();
          resample.lineStart = lineStart;
        }
      };
      function point(x, y) {
        x = project(x, y);
        stream.point(x[0], x[1]);
      }
      function lineStart() {
        x0 = NaN;
        resample.point = linePoint;
        stream.lineStart();
      }
      function linePoint(λ, φ) {
        var c = d3_geo_cartesian([ λ, φ ]), p = project(λ, φ);
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x0 = p[0], y0 = p[1], λ0 = λ, a0 = c[0], b0 = c[1], c0 = c[2], maxDepth, stream);
        stream.point(x0, y0);
      }
      function lineEnd() {
        resample.point = point;
        stream.lineEnd();
      }
      function ringStart() {
        lineStart();
        resample.point = ringPoint;
        resample.lineEnd = ringEnd;
      }
      function ringPoint(λ, φ) {
        linePoint(λ00 = λ, φ00 = φ), x00 = x0, y00 = y0, a00 = a0, b00 = b0, c00 = c0;
        resample.point = linePoint;
      }
      function ringEnd() {
        resampleLineTo(x0, y0, λ0, a0, b0, c0, x00, y00, λ00, a00, b00, c00, maxDepth, stream);
        resample.lineEnd = lineEnd;
        lineEnd();
      }
      return resample;
    }
    function resampleLineTo(x0, y0, λ0, a0, b0, c0, x1, y1, λ1, a1, b1, c1, depth, stream) {
      var dx = x1 - x0, dy = y1 - y0, d2 = dx * dx + dy * dy;
      if (d2 > 4 * δ2 && depth--) {
        var a = a0 + a1, b = b0 + b1, c = c0 + c1, m = Math.sqrt(a * a + b * b + c * c), φ2 = Math.asin(c /= m), λ2 = abs(abs(c) - 1) < ε || abs(λ0 - λ1) < ε ? (λ0 + λ1) / 2 : Math.atan2(b, a), p = project(λ2, φ2), x2 = p[0], y2 = p[1], dx2 = x2 - x0, dy2 = y2 - y0, dz = dy * dx2 - dx * dy2;
        if (dz * dz / d2 > δ2 || abs((dx * dx2 + dy * dy2) / d2 - .5) > .3 || a0 * a1 + b0 * b1 + c0 * c1 < cosMinDistance) {
          resampleLineTo(x0, y0, λ0, a0, b0, c0, x2, y2, λ2, a /= m, b /= m, c, depth, stream);
          stream.point(x2, y2);
          resampleLineTo(x2, y2, λ2, a, b, c, x1, y1, λ1, a1, b1, c1, depth, stream);
        }
      }
    }
    resample.precision = function(_) {
      if (!arguments.length) return Math.sqrt(δ2);
      maxDepth = (δ2 = _ * _) > 0 && 16;
      return resample;
    };
    return resample;
  }
  d3.geo.path = function() {
    var pointRadius = 4.5, projection, context, projectStream, contextStream, cacheStream;
    function path(object) {
      if (object) {
        if (typeof pointRadius === "function") contextStream.pointRadius(+pointRadius.apply(this, arguments));
        if (!cacheStream || !cacheStream.valid) cacheStream = projectStream(contextStream);
        d3.geo.stream(object, cacheStream);
      }
      return contextStream.result();
    }
    path.area = function(object) {
      d3_geo_pathAreaSum = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathArea));
      return d3_geo_pathAreaSum;
    };
    path.centroid = function(object) {
      d3_geo_centroidX0 = d3_geo_centroidY0 = d3_geo_centroidZ0 = d3_geo_centroidX1 = d3_geo_centroidY1 = d3_geo_centroidZ1 = d3_geo_centroidX2 = d3_geo_centroidY2 = d3_geo_centroidZ2 = 0;
      d3.geo.stream(object, projectStream(d3_geo_pathCentroid));
      return d3_geo_centroidZ2 ? [ d3_geo_centroidX2 / d3_geo_centroidZ2, d3_geo_centroidY2 / d3_geo_centroidZ2 ] : d3_geo_centroidZ1 ? [ d3_geo_centroidX1 / d3_geo_centroidZ1, d3_geo_centroidY1 / d3_geo_centroidZ1 ] : d3_geo_centroidZ0 ? [ d3_geo_centroidX0 / d3_geo_centroidZ0, d3_geo_centroidY0 / d3_geo_centroidZ0 ] : [ NaN, NaN ];
    };
    path.bounds = function(object) {
      d3_geo_pathBoundsX1 = d3_geo_pathBoundsY1 = -(d3_geo_pathBoundsX0 = d3_geo_pathBoundsY0 = Infinity);
      d3.geo.stream(object, projectStream(d3_geo_pathBounds));
      return [ [ d3_geo_pathBoundsX0, d3_geo_pathBoundsY0 ], [ d3_geo_pathBoundsX1, d3_geo_pathBoundsY1 ] ];
    };
    path.projection = function(_) {
      if (!arguments.length) return projection;
      projectStream = (projection = _) ? _.stream || d3_geo_pathProjectStream(_) : d3_identity;
      return reset();
    };
    path.context = function(_) {
      if (!arguments.length) return context;
      contextStream = (context = _) == null ? new d3_geo_pathBuffer() : new d3_geo_pathContext(_);
      if (typeof pointRadius !== "function") contextStream.pointRadius(pointRadius);
      return reset();
    };
    path.pointRadius = function(_) {
      if (!arguments.length) return pointRadius;
      pointRadius = typeof _ === "function" ? _ : (contextStream.pointRadius(+_), +_);
      return path;
    };
    function reset() {
      cacheStream = null;
      return path;
    }
    return path.projection(d3.geo.albersUsa()).context(null);
  };
  function d3_geo_pathProjectStream(project) {
    var resample = d3_geo_resample(function(x, y) {
      return project([ x * d3_degrees, y * d3_degrees ]);
    });
    return function(stream) {
      return d3_geo_projectionRadians(resample(stream));
    };
  }
  d3.geo.transform = function(methods) {
    return {
      stream: function(stream) {
        var transform = new d3_geo_transform(stream);
        for (var k in methods) transform[k] = methods[k];
        return transform;
      }
    };
  };
  function d3_geo_transform(stream) {
    this.stream = stream;
  }
  d3_geo_transform.prototype = {
    point: function(x, y) {
      this.stream.point(x, y);
    },
    sphere: function() {
      this.stream.sphere();
    },
    lineStart: function() {
      this.stream.lineStart();
    },
    lineEnd: function() {
      this.stream.lineEnd();
    },
    polygonStart: function() {
      this.stream.polygonStart();
    },
    polygonEnd: function() {
      this.stream.polygonEnd();
    }
  };
  function d3_geo_transformPoint(stream, point) {
    return {
      point: point,
      sphere: function() {
        stream.sphere();
      },
      lineStart: function() {
        stream.lineStart();
      },
      lineEnd: function() {
        stream.lineEnd();
      },
      polygonStart: function() {
        stream.polygonStart();
      },
      polygonEnd: function() {
        stream.polygonEnd();
      }
    };
  }
  d3.geo.projection = d3_geo_projection;
  d3.geo.projectionMutator = d3_geo_projectionMutator;
  function d3_geo_projection(project) {
    return d3_geo_projectionMutator(function() {
      return project;
    })();
  }
  function d3_geo_projectionMutator(projectAt) {
    var project, rotate, projectRotate, projectResample = d3_geo_resample(function(x, y) {
      x = project(x, y);
      return [ x[0] * k + δx, δy - x[1] * k ];
    }), k = 150, x = 480, y = 250, λ = 0, φ = 0, δλ = 0, δφ = 0, δγ = 0, δx, δy, preclip = d3_geo_clipAntimeridian, postclip = d3_identity, clipAngle = null, clipExtent = null, stream;
    function projection(point) {
      point = projectRotate(point[0] * d3_radians, point[1] * d3_radians);
      return [ point[0] * k + δx, δy - point[1] * k ];
    }
    function invert(point) {
      point = projectRotate.invert((point[0] - δx) / k, (δy - point[1]) / k);
      return point && [ point[0] * d3_degrees, point[1] * d3_degrees ];
    }
    projection.stream = function(output) {
      if (stream) stream.valid = false;
      stream = d3_geo_projectionRadians(preclip(rotate, projectResample(postclip(output))));
      stream.valid = true;
      return stream;
    };
    projection.clipAngle = function(_) {
      if (!arguments.length) return clipAngle;
      preclip = _ == null ? (clipAngle = _, d3_geo_clipAntimeridian) : d3_geo_clipCircle((clipAngle = +_) * d3_radians);
      return invalidate();
    };
    projection.clipExtent = function(_) {
      if (!arguments.length) return clipExtent;
      clipExtent = _;
      postclip = _ ? d3_geo_clipExtent(_[0][0], _[0][1], _[1][0], _[1][1]) : d3_identity;
      return invalidate();
    };
    projection.scale = function(_) {
      if (!arguments.length) return k;
      k = +_;
      return reset();
    };
    projection.translate = function(_) {
      if (!arguments.length) return [ x, y ];
      x = +_[0];
      y = +_[1];
      return reset();
    };
    projection.center = function(_) {
      if (!arguments.length) return [ λ * d3_degrees, φ * d3_degrees ];
      λ = _[0] % 360 * d3_radians;
      φ = _[1] % 360 * d3_radians;
      return reset();
    };
    projection.rotate = function(_) {
      if (!arguments.length) return [ δλ * d3_degrees, δφ * d3_degrees, δγ * d3_degrees ];
      δλ = _[0] % 360 * d3_radians;
      δφ = _[1] % 360 * d3_radians;
      δγ = _.length > 2 ? _[2] % 360 * d3_radians : 0;
      return reset();
    };
    d3.rebind(projection, projectResample, "precision");
    function reset() {
      projectRotate = d3_geo_compose(rotate = d3_geo_rotation(δλ, δφ, δγ), project);
      var center = project(λ, φ);
      δx = x - center[0] * k;
      δy = y + center[1] * k;
      return invalidate();
    }
    function invalidate() {
      if (stream) stream.valid = false, stream = null;
      return projection;
    }
    return function() {
      project = projectAt.apply(this, arguments);
      projection.invert = project.invert && invert;
      return reset();
    };
  }
  function d3_geo_projectionRadians(stream) {
    return d3_geo_transformPoint(stream, function(x, y) {
      stream.point(x * d3_radians, y * d3_radians);
    });
  }
  function d3_geo_equirectangular(λ, φ) {
    return [ λ, φ ];
  }
  (d3.geo.equirectangular = function() {
    return d3_geo_projection(d3_geo_equirectangular);
  }).raw = d3_geo_equirectangular.invert = d3_geo_equirectangular;
  d3.geo.rotation = function(rotate) {
    rotate = d3_geo_rotation(rotate[0] % 360 * d3_radians, rotate[1] * d3_radians, rotate.length > 2 ? rotate[2] * d3_radians : 0);
    function forward(coordinates) {
      coordinates = rotate(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    }
    forward.invert = function(coordinates) {
      coordinates = rotate.invert(coordinates[0] * d3_radians, coordinates[1] * d3_radians);
      return coordinates[0] *= d3_degrees, coordinates[1] *= d3_degrees, coordinates;
    };
    return forward;
  };
  function d3_geo_identityRotation(λ, φ) {
    return [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
  }
  d3_geo_identityRotation.invert = d3_geo_equirectangular;
  function d3_geo_rotation(δλ, δφ, δγ) {
    return δλ ? δφ || δγ ? d3_geo_compose(d3_geo_rotationλ(δλ), d3_geo_rotationφγ(δφ, δγ)) : d3_geo_rotationλ(δλ) : δφ || δγ ? d3_geo_rotationφγ(δφ, δγ) : d3_geo_identityRotation;
  }
  function d3_geo_forwardRotationλ(δλ) {
    return function(λ, φ) {
      return λ += δλ, [ λ > π ? λ - τ : λ < -π ? λ + τ : λ, φ ];
    };
  }
  function d3_geo_rotationλ(δλ) {
    var rotation = d3_geo_forwardRotationλ(δλ);
    rotation.invert = d3_geo_forwardRotationλ(-δλ);
    return rotation;
  }
  function d3_geo_rotationφγ(δφ, δγ) {
    var cosδφ = Math.cos(δφ), sinδφ = Math.sin(δφ), cosδγ = Math.cos(δγ), sinδγ = Math.sin(δγ);
    function rotation(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδφ + x * sinδφ;
      return [ Math.atan2(y * cosδγ - k * sinδγ, x * cosδφ - z * sinδφ), d3_asin(k * cosδγ + y * sinδγ) ];
    }
    rotation.invert = function(λ, φ) {
      var cosφ = Math.cos(φ), x = Math.cos(λ) * cosφ, y = Math.sin(λ) * cosφ, z = Math.sin(φ), k = z * cosδγ - y * sinδγ;
      return [ Math.atan2(y * cosδγ + z * sinδγ, x * cosδφ + k * sinδφ), d3_asin(k * cosδφ - x * sinδφ) ];
    };
    return rotation;
  }
  d3.geo.circle = function() {
    var origin = [ 0, 0 ], angle, precision = 6, interpolate;
    function circle() {
      var center = typeof origin === "function" ? origin.apply(this, arguments) : origin, rotate = d3_geo_rotation(-center[0] * d3_radians, -center[1] * d3_radians, 0).invert, ring = [];
      interpolate(null, null, 1, {
        point: function(x, y) {
          ring.push(x = rotate(x, y));
          x[0] *= d3_degrees, x[1] *= d3_degrees;
        }
      });
      return {
        type: "Polygon",
        coordinates: [ ring ]
      };
    }
    circle.origin = function(x) {
      if (!arguments.length) return origin;
      origin = x;
      return circle;
    };
    circle.angle = function(x) {
      if (!arguments.length) return angle;
      interpolate = d3_geo_circleInterpolate((angle = +x) * d3_radians, precision * d3_radians);
      return circle;
    };
    circle.precision = function(_) {
      if (!arguments.length) return precision;
      interpolate = d3_geo_circleInterpolate(angle * d3_radians, (precision = +_) * d3_radians);
      return circle;
    };
    return circle.angle(90);
  };
  function d3_geo_circleInterpolate(radius, precision) {
    var cr = Math.cos(radius), sr = Math.sin(radius);
    return function(from, to, direction, listener) {
      var step = direction * precision;
      if (from != null) {
        from = d3_geo_circleAngle(cr, from);
        to = d3_geo_circleAngle(cr, to);
        if (direction > 0 ? from < to : from > to) from += direction * τ;
      } else {
        from = radius + direction * τ;
        to = radius - .5 * step;
      }
      for (var point, t = from; direction > 0 ? t > to : t < to; t -= step) {
        listener.point((point = d3_geo_spherical([ cr, -sr * Math.cos(t), -sr * Math.sin(t) ]))[0], point[1]);
      }
    };
  }
  function d3_geo_circleAngle(cr, point) {
    var a = d3_geo_cartesian(point);
    a[0] -= cr;
    d3_geo_cartesianNormalize(a);
    var angle = d3_acos(-a[1]);
    return ((-a[2] < 0 ? -angle : angle) + 2 * Math.PI - ε) % (2 * Math.PI);
  }
  d3.geo.distance = function(a, b) {
    var Δλ = (b[0] - a[0]) * d3_radians, φ0 = a[1] * d3_radians, φ1 = b[1] * d3_radians, sinΔλ = Math.sin(Δλ), cosΔλ = Math.cos(Δλ), sinφ0 = Math.sin(φ0), cosφ0 = Math.cos(φ0), sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1), t;
    return Math.atan2(Math.sqrt((t = cosφ1 * sinΔλ) * t + (t = cosφ0 * sinφ1 - sinφ0 * cosφ1 * cosΔλ) * t), sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ);
  };
  d3.geo.graticule = function() {
    var x1, x0, X1, X0, y1, y0, Y1, Y0, dx = 10, dy = dx, DX = 90, DY = 360, x, y, X, Y, precision = 2.5;
    function graticule() {
      return {
        type: "MultiLineString",
        coordinates: lines()
      };
    }
    function lines() {
      return d3.range(Math.ceil(X0 / DX) * DX, X1, DX).map(X).concat(d3.range(Math.ceil(Y0 / DY) * DY, Y1, DY).map(Y)).concat(d3.range(Math.ceil(x0 / dx) * dx, x1, dx).filter(function(x) {
        return abs(x % DX) > ε;
      }).map(x)).concat(d3.range(Math.ceil(y0 / dy) * dy, y1, dy).filter(function(y) {
        return abs(y % DY) > ε;
      }).map(y));
    }
    graticule.lines = function() {
      return lines().map(function(coordinates) {
        return {
          type: "LineString",
          coordinates: coordinates
        };
      });
    };
    graticule.outline = function() {
      return {
        type: "Polygon",
        coordinates: [ X(X0).concat(Y(Y1).slice(1), X(X1).reverse().slice(1), Y(Y0).reverse().slice(1)) ]
      };
    };
    graticule.extent = function(_) {
      if (!arguments.length) return graticule.minorExtent();
      return graticule.majorExtent(_).minorExtent(_);
    };
    graticule.majorExtent = function(_) {
      if (!arguments.length) return [ [ X0, Y0 ], [ X1, Y1 ] ];
      X0 = +_[0][0], X1 = +_[1][0];
      Y0 = +_[0][1], Y1 = +_[1][1];
      if (X0 > X1) _ = X0, X0 = X1, X1 = _;
      if (Y0 > Y1) _ = Y0, Y0 = Y1, Y1 = _;
      return graticule.precision(precision);
    };
    graticule.minorExtent = function(_) {
      if (!arguments.length) return [ [ x0, y0 ], [ x1, y1 ] ];
      x0 = +_[0][0], x1 = +_[1][0];
      y0 = +_[0][1], y1 = +_[1][1];
      if (x0 > x1) _ = x0, x0 = x1, x1 = _;
      if (y0 > y1) _ = y0, y0 = y1, y1 = _;
      return graticule.precision(precision);
    };
    graticule.step = function(_) {
      if (!arguments.length) return graticule.minorStep();
      return graticule.majorStep(_).minorStep(_);
    };
    graticule.majorStep = function(_) {
      if (!arguments.length) return [ DX, DY ];
      DX = +_[0], DY = +_[1];
      return graticule;
    };
    graticule.minorStep = function(_) {
      if (!arguments.length) return [ dx, dy ];
      dx = +_[0], dy = +_[1];
      return graticule;
    };
    graticule.precision = function(_) {
      if (!arguments.length) return precision;
      precision = +_;
      x = d3_geo_graticuleX(y0, y1, 90);
      y = d3_geo_graticuleY(x0, x1, precision);
      X = d3_geo_graticuleX(Y0, Y1, 90);
      Y = d3_geo_graticuleY(X0, X1, precision);
      return graticule;
    };
    return graticule.majorExtent([ [ -180, -90 + ε ], [ 180, 90 - ε ] ]).minorExtent([ [ -180, -80 - ε ], [ 180, 80 + ε ] ]);
  };
  function d3_geo_graticuleX(y0, y1, dy) {
    var y = d3.range(y0, y1 - ε, dy).concat(y1);
    return function(x) {
      return y.map(function(y) {
        return [ x, y ];
      });
    };
  }
  function d3_geo_graticuleY(x0, x1, dx) {
    var x = d3.range(x0, x1 - ε, dx).concat(x1);
    return function(y) {
      return x.map(function(x) {
        return [ x, y ];
      });
    };
  }
  function d3_source(d) {
    return d.source;
  }
  function d3_target(d) {
    return d.target;
  }
  d3.geo.greatArc = function() {
    var source = d3_source, source_, target = d3_target, target_;
    function greatArc() {
      return {
        type: "LineString",
        coordinates: [ source_ || source.apply(this, arguments), target_ || target.apply(this, arguments) ]
      };
    }
    greatArc.distance = function() {
      return d3.geo.distance(source_ || source.apply(this, arguments), target_ || target.apply(this, arguments));
    };
    greatArc.source = function(_) {
      if (!arguments.length) return source;
      source = _, source_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.target = function(_) {
      if (!arguments.length) return target;
      target = _, target_ = typeof _ === "function" ? null : _;
      return greatArc;
    };
    greatArc.precision = function() {
      return arguments.length ? greatArc : 0;
    };
    return greatArc;
  };
  d3.geo.interpolate = function(source, target) {
    return d3_geo_interpolate(source[0] * d3_radians, source[1] * d3_radians, target[0] * d3_radians, target[1] * d3_radians);
  };
  function d3_geo_interpolate(x0, y0, x1, y1) {
    var cy0 = Math.cos(y0), sy0 = Math.sin(y0), cy1 = Math.cos(y1), sy1 = Math.sin(y1), kx0 = cy0 * Math.cos(x0), ky0 = cy0 * Math.sin(x0), kx1 = cy1 * Math.cos(x1), ky1 = cy1 * Math.sin(x1), d = 2 * Math.asin(Math.sqrt(d3_haversin(y1 - y0) + cy0 * cy1 * d3_haversin(x1 - x0))), k = 1 / Math.sin(d);
    var interpolate = d ? function(t) {
      var B = Math.sin(t *= d) * k, A = Math.sin(d - t) * k, x = A * kx0 + B * kx1, y = A * ky0 + B * ky1, z = A * sy0 + B * sy1;
      return [ Math.atan2(y, x) * d3_degrees, Math.atan2(z, Math.sqrt(x * x + y * y)) * d3_degrees ];
    } : function() {
      return [ x0 * d3_degrees, y0 * d3_degrees ];
    };
    interpolate.distance = d;
    return interpolate;
  }
  d3.geo.length = function(object) {
    d3_geo_lengthSum = 0;
    d3.geo.stream(object, d3_geo_length);
    return d3_geo_lengthSum;
  };
  var d3_geo_lengthSum;
  var d3_geo_length = {
    sphere: d3_noop,
    point: d3_noop,
    lineStart: d3_geo_lengthLineStart,
    lineEnd: d3_noop,
    polygonStart: d3_noop,
    polygonEnd: d3_noop
  };
  function d3_geo_lengthLineStart() {
    var λ0, sinφ0, cosφ0;
    d3_geo_length.point = function(λ, φ) {
      λ0 = λ * d3_radians, sinφ0 = Math.sin(φ *= d3_radians), cosφ0 = Math.cos(φ);
      d3_geo_length.point = nextPoint;
    };
    d3_geo_length.lineEnd = function() {
      d3_geo_length.point = d3_geo_length.lineEnd = d3_noop;
    };
    function nextPoint(λ, φ) {
      var sinφ = Math.sin(φ *= d3_radians), cosφ = Math.cos(φ), t = abs((λ *= d3_radians) - λ0), cosΔλ = Math.cos(t);
      d3_geo_lengthSum += Math.atan2(Math.sqrt((t = cosφ * Math.sin(t)) * t + (t = cosφ0 * sinφ - sinφ0 * cosφ * cosΔλ) * t), sinφ0 * sinφ + cosφ0 * cosφ * cosΔλ);
      λ0 = λ, sinφ0 = sinφ, cosφ0 = cosφ;
    }
  }
  function d3_geo_azimuthal(scale, angle) {
    function azimuthal(λ, φ) {
      var cosλ = Math.cos(λ), cosφ = Math.cos(φ), k = scale(cosλ * cosφ);
      return [ k * cosφ * Math.sin(λ), k * Math.sin(φ) ];
    }
    azimuthal.invert = function(x, y) {
      var ρ = Math.sqrt(x * x + y * y), c = angle(ρ), sinc = Math.sin(c), cosc = Math.cos(c);
      return [ Math.atan2(x * sinc, ρ * cosc), Math.asin(ρ && y * sinc / ρ) ];
    };
    return azimuthal;
  }
  var d3_geo_azimuthalEqualArea = d3_geo_azimuthal(function(cosλcosφ) {
    return Math.sqrt(2 / (1 + cosλcosφ));
  }, function(ρ) {
    return 2 * Math.asin(ρ / 2);
  });
  (d3.geo.azimuthalEqualArea = function() {
    return d3_geo_projection(d3_geo_azimuthalEqualArea);
  }).raw = d3_geo_azimuthalEqualArea;
  var d3_geo_azimuthalEquidistant = d3_geo_azimuthal(function(cosλcosφ) {
    var c = Math.acos(cosλcosφ);
    return c && c / Math.sin(c);
  }, d3_identity);
  (d3.geo.azimuthalEquidistant = function() {
    return d3_geo_projection(d3_geo_azimuthalEquidistant);
  }).raw = d3_geo_azimuthalEquidistant;
  function d3_geo_conicConformal(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), t = function(φ) {
      return Math.tan(π / 4 + φ / 2);
    }, n = φ0 === φ1 ? Math.sin(φ0) : Math.log(cosφ0 / Math.cos(φ1)) / Math.log(t(φ1) / t(φ0)), F = cosφ0 * Math.pow(t(φ0), n) / n;
    if (!n) return d3_geo_mercator;
    function forward(λ, φ) {
      if (F > 0) {
        if (φ < -halfπ + ε) φ = -halfπ + ε;
      } else {
        if (φ > halfπ - ε) φ = halfπ - ε;
      }
      var ρ = F / Math.pow(t(φ), n);
      return [ ρ * Math.sin(n * λ), F - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = F - y, ρ = d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y);
      return [ Math.atan2(x, ρ0_y) / n, 2 * Math.atan(Math.pow(F / ρ, 1 / n)) - halfπ ];
    };
    return forward;
  }
  (d3.geo.conicConformal = function() {
    return d3_geo_conic(d3_geo_conicConformal);
  }).raw = d3_geo_conicConformal;
  function d3_geo_conicEquidistant(φ0, φ1) {
    var cosφ0 = Math.cos(φ0), n = φ0 === φ1 ? Math.sin(φ0) : (cosφ0 - Math.cos(φ1)) / (φ1 - φ0), G = cosφ0 / n + φ0;
    if (abs(n) < ε) return d3_geo_equirectangular;
    function forward(λ, φ) {
      var ρ = G - φ;
      return [ ρ * Math.sin(n * λ), G - ρ * Math.cos(n * λ) ];
    }
    forward.invert = function(x, y) {
      var ρ0_y = G - y;
      return [ Math.atan2(x, ρ0_y) / n, G - d3_sgn(n) * Math.sqrt(x * x + ρ0_y * ρ0_y) ];
    };
    return forward;
  }
  (d3.geo.conicEquidistant = function() {
    return d3_geo_conic(d3_geo_conicEquidistant);
  }).raw = d3_geo_conicEquidistant;
  var d3_geo_gnomonic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / cosλcosφ;
  }, Math.atan);
  (d3.geo.gnomonic = function() {
    return d3_geo_projection(d3_geo_gnomonic);
  }).raw = d3_geo_gnomonic;
  function d3_geo_mercator(λ, φ) {
    return [ λ, Math.log(Math.tan(π / 4 + φ / 2)) ];
  }
  d3_geo_mercator.invert = function(x, y) {
    return [ x, 2 * Math.atan(Math.exp(y)) - halfπ ];
  };
  function d3_geo_mercatorProjection(project) {
    var m = d3_geo_projection(project), scale = m.scale, translate = m.translate, clipExtent = m.clipExtent, clipAuto;
    m.scale = function() {
      var v = scale.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.translate = function() {
      var v = translate.apply(m, arguments);
      return v === m ? clipAuto ? m.clipExtent(null) : m : v;
    };
    m.clipExtent = function(_) {
      var v = clipExtent.apply(m, arguments);
      if (v === m) {
        if (clipAuto = _ == null) {
          var k = π * scale(), t = translate();
          clipExtent([ [ t[0] - k, t[1] - k ], [ t[0] + k, t[1] + k ] ]);
        }
      } else if (clipAuto) {
        v = null;
      }
      return v;
    };
    return m.clipExtent(null);
  }
  (d3.geo.mercator = function() {
    return d3_geo_mercatorProjection(d3_geo_mercator);
  }).raw = d3_geo_mercator;
  var d3_geo_orthographic = d3_geo_azimuthal(function() {
    return 1;
  }, Math.asin);
  (d3.geo.orthographic = function() {
    return d3_geo_projection(d3_geo_orthographic);
  }).raw = d3_geo_orthographic;
  var d3_geo_stereographic = d3_geo_azimuthal(function(cosλcosφ) {
    return 1 / (1 + cosλcosφ);
  }, function(ρ) {
    return 2 * Math.atan(ρ);
  });
  (d3.geo.stereographic = function() {
    return d3_geo_projection(d3_geo_stereographic);
  }).raw = d3_geo_stereographic;
  function d3_geo_transverseMercator(λ, φ) {
    return [ Math.log(Math.tan(π / 4 + φ / 2)), -λ ];
  }
  d3_geo_transverseMercator.invert = function(x, y) {
    return [ -y, 2 * Math.atan(Math.exp(x)) - halfπ ];
  };
  (d3.geo.transverseMercator = function() {
    var projection = d3_geo_mercatorProjection(d3_geo_transverseMercator), center = projection.center, rotate = projection.rotate;
    projection.center = function(_) {
      return _ ? center([ -_[1], _[0] ]) : (_ = center(), [ _[1], -_[0] ]);
    };
    projection.rotate = function(_) {
      return _ ? rotate([ _[0], _[1], _.length > 2 ? _[2] + 90 : 90 ]) : (_ = rotate(), 
      [ _[0], _[1], _[2] - 90 ]);
    };
    return rotate([ 0, 0, 90 ]);
  }).raw = d3_geo_transverseMercator;
  d3.geom = {};
  function d3_geom_pointX(d) {
    return d[0];
  }
  function d3_geom_pointY(d) {
    return d[1];
  }
  d3.geom.hull = function(vertices) {
    var x = d3_geom_pointX, y = d3_geom_pointY;
    if (arguments.length) return hull(vertices);
    function hull(data) {
      if (data.length < 3) return [];
      var fx = d3_functor(x), fy = d3_functor(y), i, n = data.length, points = [], flippedPoints = [];
      for (i = 0; i < n; i++) {
        points.push([ +fx.call(this, data[i], i), +fy.call(this, data[i], i), i ]);
      }
      points.sort(d3_geom_hullOrder);
      for (i = 0; i < n; i++) flippedPoints.push([ points[i][0], -points[i][1] ]);
      var upper = d3_geom_hullUpper(points), lower = d3_geom_hullUpper(flippedPoints);
      var skipLeft = lower[0] === upper[0], skipRight = lower[lower.length - 1] === upper[upper.length - 1], polygon = [];
      for (i = upper.length - 1; i >= 0; --i) polygon.push(data[points[upper[i]][2]]);
      for (i = +skipLeft; i < lower.length - skipRight; ++i) polygon.push(data[points[lower[i]][2]]);
      return polygon;
    }
    hull.x = function(_) {
      return arguments.length ? (x = _, hull) : x;
    };
    hull.y = function(_) {
      return arguments.length ? (y = _, hull) : y;
    };
    return hull;
  };
  function d3_geom_hullUpper(points) {
    var n = points.length, hull = [ 0, 1 ], hs = 2;
    for (var i = 2; i < n; i++) {
      while (hs > 1 && d3_cross2d(points[hull[hs - 2]], points[hull[hs - 1]], points[i]) <= 0) --hs;
      hull[hs++] = i;
    }
    return hull.slice(0, hs);
  }
  function d3_geom_hullOrder(a, b) {
    return a[0] - b[0] || a[1] - b[1];
  }
  d3.geom.polygon = function(coordinates) {
    d3_subclass(coordinates, d3_geom_polygonPrototype);
    return coordinates;
  };
  var d3_geom_polygonPrototype = d3.geom.polygon.prototype = [];
  d3_geom_polygonPrototype.area = function() {
    var i = -1, n = this.length, a, b = this[n - 1], area = 0;
    while (++i < n) {
      a = b;
      b = this[i];
      area += a[1] * b[0] - a[0] * b[1];
    }
    return area * .5;
  };
  d3_geom_polygonPrototype.centroid = function(k) {
    var i = -1, n = this.length, x = 0, y = 0, a, b = this[n - 1], c;
    if (!arguments.length) k = -1 / (6 * this.area());
    while (++i < n) {
      a = b;
      b = this[i];
      c = a[0] * b[1] - b[0] * a[1];
      x += (a[0] + b[0]) * c;
      y += (a[1] + b[1]) * c;
    }
    return [ x * k, y * k ];
  };
  d3_geom_polygonPrototype.clip = function(subject) {
    var input, closed = d3_geom_polygonClosed(subject), i = -1, n = this.length - d3_geom_polygonClosed(this), j, m, a = this[n - 1], b, c, d;
    while (++i < n) {
      input = subject.slice();
      subject.length = 0;
      b = this[i];
      c = input[(m = input.length - closed) - 1];
      j = -1;
      while (++j < m) {
        d = input[j];
        if (d3_geom_polygonInside(d, a, b)) {
          if (!d3_geom_polygonInside(c, a, b)) {
            subject.push(d3_geom_polygonIntersect(c, d, a, b));
          }
          subject.push(d);
        } else if (d3_geom_polygonInside(c, a, b)) {
          subject.push(d3_geom_polygonIntersect(c, d, a, b));
        }
        c = d;
      }
      if (closed) subject.push(subject[0]);
      a = b;
    }
    return subject;
  };
  function d3_geom_polygonInside(p, a, b) {
    return (b[0] - a[0]) * (p[1] - a[1]) < (b[1] - a[1]) * (p[0] - a[0]);
  }
  function d3_geom_polygonIntersect(c, d, a, b) {
    var x1 = c[0], x3 = a[0], x21 = d[0] - x1, x43 = b[0] - x3, y1 = c[1], y3 = a[1], y21 = d[1] - y1, y43 = b[1] - y3, ua = (x43 * (y1 - y3) - y43 * (x1 - x3)) / (y43 * x21 - x43 * y21);
    return [ x1 + ua * x21, y1 + ua * y21 ];
  }
  function d3_geom_polygonClosed(coordinates) {
    var a = coordinates[0], b = coordinates[coordinates.length - 1];
    return !(a[0] - b[0] || a[1] - b[1]);
  }
  var d3_geom_voronoiEdges, d3_geom_voronoiCells, d3_geom_voronoiBeaches, d3_geom_voronoiBeachPool = [], d3_geom_voronoiFirstCircle, d3_geom_voronoiCircles, d3_geom_voronoiCirclePool = [];
  function d3_geom_voronoiBeach() {
    d3_geom_voronoiRedBlackNode(this);
    this.edge = this.site = this.circle = null;
  }
  function d3_geom_voronoiCreateBeach(site) {
    var beach = d3_geom_voronoiBeachPool.pop() || new d3_geom_voronoiBeach();
    beach.site = site;
    return beach;
  }
  function d3_geom_voronoiDetachBeach(beach) {
    d3_geom_voronoiDetachCircle(beach);
    d3_geom_voronoiBeaches.remove(beach);
    d3_geom_voronoiBeachPool.push(beach);
    d3_geom_voronoiRedBlackNode(beach);
  }
  function d3_geom_voronoiRemoveBeach(beach) {
    var circle = beach.circle, x = circle.x, y = circle.cy, vertex = {
      x: x,
      y: y
    }, previous = beach.P, next = beach.N, disappearing = [ beach ];
    d3_geom_voronoiDetachBeach(beach);
    var lArc = previous;
    while (lArc.circle && abs(x - lArc.circle.x) < ε && abs(y - lArc.circle.cy) < ε) {
      previous = lArc.P;
      disappearing.unshift(lArc);
      d3_geom_voronoiDetachBeach(lArc);
      lArc = previous;
    }
    disappearing.unshift(lArc);
    d3_geom_voronoiDetachCircle(lArc);
    var rArc = next;
    while (rArc.circle && abs(x - rArc.circle.x) < ε && abs(y - rArc.circle.cy) < ε) {
      next = rArc.N;
      disappearing.push(rArc);
      d3_geom_voronoiDetachBeach(rArc);
      rArc = next;
    }
    disappearing.push(rArc);
    d3_geom_voronoiDetachCircle(rArc);
    var nArcs = disappearing.length, iArc;
    for (iArc = 1; iArc < nArcs; ++iArc) {
      rArc = disappearing[iArc];
      lArc = disappearing[iArc - 1];
      d3_geom_voronoiSetEdgeEnd(rArc.edge, lArc.site, rArc.site, vertex);
    }
    lArc = disappearing[0];
    rArc = disappearing[nArcs - 1];
    rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, rArc.site, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiAddBeach(site) {
    var x = site.x, directrix = site.y, lArc, rArc, dxl, dxr, node = d3_geom_voronoiBeaches._;
    while (node) {
      dxl = d3_geom_voronoiLeftBreakPoint(node, directrix) - x;
      if (dxl > ε) node = node.L; else {
        dxr = x - d3_geom_voronoiRightBreakPoint(node, directrix);
        if (dxr > ε) {
          if (!node.R) {
            lArc = node;
            break;
          }
          node = node.R;
        } else {
          if (dxl > -ε) {
            lArc = node.P;
            rArc = node;
          } else if (dxr > -ε) {
            lArc = node;
            rArc = node.N;
          } else {
            lArc = rArc = node;
          }
          break;
        }
      }
    }
    var newArc = d3_geom_voronoiCreateBeach(site);
    d3_geom_voronoiBeaches.insert(lArc, newArc);
    if (!lArc && !rArc) return;
    if (lArc === rArc) {
      d3_geom_voronoiDetachCircle(lArc);
      rArc = d3_geom_voronoiCreateBeach(lArc.site);
      d3_geom_voronoiBeaches.insert(newArc, rArc);
      newArc.edge = rArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      d3_geom_voronoiAttachCircle(lArc);
      d3_geom_voronoiAttachCircle(rArc);
      return;
    }
    if (!rArc) {
      newArc.edge = d3_geom_voronoiCreateEdge(lArc.site, newArc.site);
      return;
    }
    d3_geom_voronoiDetachCircle(lArc);
    d3_geom_voronoiDetachCircle(rArc);
    var lSite = lArc.site, ax = lSite.x, ay = lSite.y, bx = site.x - ax, by = site.y - ay, rSite = rArc.site, cx = rSite.x - ax, cy = rSite.y - ay, d = 2 * (bx * cy - by * cx), hb = bx * bx + by * by, hc = cx * cx + cy * cy, vertex = {
      x: (cy * hb - by * hc) / d + ax,
      y: (bx * hc - cx * hb) / d + ay
    };
    d3_geom_voronoiSetEdgeEnd(rArc.edge, lSite, rSite, vertex);
    newArc.edge = d3_geom_voronoiCreateEdge(lSite, site, null, vertex);
    rArc.edge = d3_geom_voronoiCreateEdge(site, rSite, null, vertex);
    d3_geom_voronoiAttachCircle(lArc);
    d3_geom_voronoiAttachCircle(rArc);
  }
  function d3_geom_voronoiLeftBreakPoint(arc, directrix) {
    var site = arc.site, rfocx = site.x, rfocy = site.y, pby2 = rfocy - directrix;
    if (!pby2) return rfocx;
    var lArc = arc.P;
    if (!lArc) return -Infinity;
    site = lArc.site;
    var lfocx = site.x, lfocy = site.y, plby2 = lfocy - directrix;
    if (!plby2) return lfocx;
    var hl = lfocx - rfocx, aby2 = 1 / pby2 - 1 / plby2, b = hl / plby2;
    if (aby2) return (-b + Math.sqrt(b * b - 2 * aby2 * (hl * hl / (-2 * plby2) - lfocy + plby2 / 2 + rfocy - pby2 / 2))) / aby2 + rfocx;
    return (rfocx + lfocx) / 2;
  }
  function d3_geom_voronoiRightBreakPoint(arc, directrix) {
    var rArc = arc.N;
    if (rArc) return d3_geom_voronoiLeftBreakPoint(rArc, directrix);
    var site = arc.site;
    return site.y === directrix ? site.x : Infinity;
  }
  function d3_geom_voronoiCell(site) {
    this.site = site;
    this.edges = [];
  }
  d3_geom_voronoiCell.prototype.prepare = function() {
    var halfEdges = this.edges, iHalfEdge = halfEdges.length, edge;
    while (iHalfEdge--) {
      edge = halfEdges[iHalfEdge].edge;
      if (!edge.b || !edge.a) halfEdges.splice(iHalfEdge, 1);
    }
    halfEdges.sort(d3_geom_voronoiHalfEdgeOrder);
    return halfEdges.length;
  };
  function d3_geom_voronoiCloseCells(extent) {
    var x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], x2, y2, x3, y3, cells = d3_geom_voronoiCells, iCell = cells.length, cell, iHalfEdge, halfEdges, nHalfEdges, start, end;
    while (iCell--) {
      cell = cells[iCell];
      if (!cell || !cell.prepare()) continue;
      halfEdges = cell.edges;
      nHalfEdges = halfEdges.length;
      iHalfEdge = 0;
      while (iHalfEdge < nHalfEdges) {
        end = halfEdges[iHalfEdge].end(), x3 = end.x, y3 = end.y;
        start = halfEdges[++iHalfEdge % nHalfEdges].start(), x2 = start.x, y2 = start.y;
        if (abs(x3 - x2) > ε || abs(y3 - y2) > ε) {
          halfEdges.splice(iHalfEdge, 0, new d3_geom_voronoiHalfEdge(d3_geom_voronoiCreateBorderEdge(cell.site, end, abs(x3 - x0) < ε && y1 - y3 > ε ? {
            x: x0,
            y: abs(x2 - x0) < ε ? y2 : y1
          } : abs(y3 - y1) < ε && x1 - x3 > ε ? {
            x: abs(y2 - y1) < ε ? x2 : x1,
            y: y1
          } : abs(x3 - x1) < ε && y3 - y0 > ε ? {
            x: x1,
            y: abs(x2 - x1) < ε ? y2 : y0
          } : abs(y3 - y0) < ε && x3 - x0 > ε ? {
            x: abs(y2 - y0) < ε ? x2 : x0,
            y: y0
          } : null), cell.site, null));
          ++nHalfEdges;
        }
      }
    }
  }
  function d3_geom_voronoiHalfEdgeOrder(a, b) {
    return b.angle - a.angle;
  }
  function d3_geom_voronoiCircle() {
    d3_geom_voronoiRedBlackNode(this);
    this.x = this.y = this.arc = this.site = this.cy = null;
  }
  function d3_geom_voronoiAttachCircle(arc) {
    var lArc = arc.P, rArc = arc.N;
    if (!lArc || !rArc) return;
    var lSite = lArc.site, cSite = arc.site, rSite = rArc.site;
    if (lSite === rSite) return;
    var bx = cSite.x, by = cSite.y, ax = lSite.x - bx, ay = lSite.y - by, cx = rSite.x - bx, cy = rSite.y - by;
    var d = 2 * (ax * cy - ay * cx);
    if (d >= -ε2) return;
    var ha = ax * ax + ay * ay, hc = cx * cx + cy * cy, x = (cy * ha - ay * hc) / d, y = (ax * hc - cx * ha) / d, cy = y + by;
    var circle = d3_geom_voronoiCirclePool.pop() || new d3_geom_voronoiCircle();
    circle.arc = arc;
    circle.site = cSite;
    circle.x = x + bx;
    circle.y = cy + Math.sqrt(x * x + y * y);
    circle.cy = cy;
    arc.circle = circle;
    var before = null, node = d3_geom_voronoiCircles._;
    while (node) {
      if (circle.y < node.y || circle.y === node.y && circle.x <= node.x) {
        if (node.L) node = node.L; else {
          before = node.P;
          break;
        }
      } else {
        if (node.R) node = node.R; else {
          before = node;
          break;
        }
      }
    }
    d3_geom_voronoiCircles.insert(before, circle);
    if (!before) d3_geom_voronoiFirstCircle = circle;
  }
  function d3_geom_voronoiDetachCircle(arc) {
    var circle = arc.circle;
    if (circle) {
      if (!circle.P) d3_geom_voronoiFirstCircle = circle.N;
      d3_geom_voronoiCircles.remove(circle);
      d3_geom_voronoiCirclePool.push(circle);
      d3_geom_voronoiRedBlackNode(circle);
      arc.circle = null;
    }
  }
  function d3_geom_voronoiClipEdges(extent) {
    var edges = d3_geom_voronoiEdges, clip = d3_geom_clipLine(extent[0][0], extent[0][1], extent[1][0], extent[1][1]), i = edges.length, e;
    while (i--) {
      e = edges[i];
      if (!d3_geom_voronoiConnectEdge(e, extent) || !clip(e) || abs(e.a.x - e.b.x) < ε && abs(e.a.y - e.b.y) < ε) {
        e.a = e.b = null;
        edges.splice(i, 1);
      }
    }
  }
  function d3_geom_voronoiConnectEdge(edge, extent) {
    var vb = edge.b;
    if (vb) return true;
    var va = edge.a, x0 = extent[0][0], x1 = extent[1][0], y0 = extent[0][1], y1 = extent[1][1], lSite = edge.l, rSite = edge.r, lx = lSite.x, ly = lSite.y, rx = rSite.x, ry = rSite.y, fx = (lx + rx) / 2, fy = (ly + ry) / 2, fm, fb;
    if (ry === ly) {
      if (fx < x0 || fx >= x1) return;
      if (lx > rx) {
        if (!va) va = {
          x: fx,
          y: y0
        }; else if (va.y >= y1) return;
        vb = {
          x: fx,
          y: y1
        };
      } else {
        if (!va) va = {
          x: fx,
          y: y1
        }; else if (va.y < y0) return;
        vb = {
          x: fx,
          y: y0
        };
      }
    } else {
      fm = (lx - rx) / (ry - ly);
      fb = fy - fm * fx;
      if (fm < -1 || fm > 1) {
        if (lx > rx) {
          if (!va) va = {
            x: (y0 - fb) / fm,
            y: y0
          }; else if (va.y >= y1) return;
          vb = {
            x: (y1 - fb) / fm,
            y: y1
          };
        } else {
          if (!va) va = {
            x: (y1 - fb) / fm,
            y: y1
          }; else if (va.y < y0) return;
          vb = {
            x: (y0 - fb) / fm,
            y: y0
          };
        }
      } else {
        if (ly < ry) {
          if (!va) va = {
            x: x0,
            y: fm * x0 + fb
          }; else if (va.x >= x1) return;
          vb = {
            x: x1,
            y: fm * x1 + fb
          };
        } else {
          if (!va) va = {
            x: x1,
            y: fm * x1 + fb
          }; else if (va.x < x0) return;
          vb = {
            x: x0,
            y: fm * x0 + fb
          };
        }
      }
    }
    edge.a = va;
    edge.b = vb;
    return true;
  }
  function d3_geom_voronoiEdge(lSite, rSite) {
    this.l = lSite;
    this.r = rSite;
    this.a = this.b = null;
  }
  function d3_geom_voronoiCreateEdge(lSite, rSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, rSite);
    d3_geom_voronoiEdges.push(edge);
    if (va) d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, va);
    if (vb) d3_geom_voronoiSetEdgeEnd(edge, rSite, lSite, vb);
    d3_geom_voronoiCells[lSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, lSite, rSite));
    d3_geom_voronoiCells[rSite.i].edges.push(new d3_geom_voronoiHalfEdge(edge, rSite, lSite));
    return edge;
  }
  function d3_geom_voronoiCreateBorderEdge(lSite, va, vb) {
    var edge = new d3_geom_voronoiEdge(lSite, null);
    edge.a = va;
    edge.b = vb;
    d3_geom_voronoiEdges.push(edge);
    return edge;
  }
  function d3_geom_voronoiSetEdgeEnd(edge, lSite, rSite, vertex) {
    if (!edge.a && !edge.b) {
      edge.a = vertex;
      edge.l = lSite;
      edge.r = rSite;
    } else if (edge.l === rSite) {
      edge.b = vertex;
    } else {
      edge.a = vertex;
    }
  }
  function d3_geom_voronoiHalfEdge(edge, lSite, rSite) {
    var va = edge.a, vb = edge.b;
    this.edge = edge;
    this.site = lSite;
    this.angle = rSite ? Math.atan2(rSite.y - lSite.y, rSite.x - lSite.x) : edge.l === lSite ? Math.atan2(vb.x - va.x, va.y - vb.y) : Math.atan2(va.x - vb.x, vb.y - va.y);
  }
  d3_geom_voronoiHalfEdge.prototype = {
    start: function() {
      return this.edge.l === this.site ? this.edge.a : this.edge.b;
    },
    end: function() {
      return this.edge.l === this.site ? this.edge.b : this.edge.a;
    }
  };
  function d3_geom_voronoiRedBlackTree() {
    this._ = null;
  }
  function d3_geom_voronoiRedBlackNode(node) {
    node.U = node.C = node.L = node.R = node.P = node.N = null;
  }
  d3_geom_voronoiRedBlackTree.prototype = {
    insert: function(after, node) {
      var parent, grandpa, uncle;
      if (after) {
        node.P = after;
        node.N = after.N;
        if (after.N) after.N.P = node;
        after.N = node;
        if (after.R) {
          after = after.R;
          while (after.L) after = after.L;
          after.L = node;
        } else {
          after.R = node;
        }
        parent = after;
      } else if (this._) {
        after = d3_geom_voronoiRedBlackFirst(this._);
        node.P = null;
        node.N = after;
        after.P = after.L = node;
        parent = after;
      } else {
        node.P = node.N = null;
        this._ = node;
        parent = null;
      }
      node.L = node.R = null;
      node.U = parent;
      node.C = true;
      after = node;
      while (parent && parent.C) {
        grandpa = parent.U;
        if (parent === grandpa.L) {
          uncle = grandpa.R;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.R) {
              d3_geom_voronoiRedBlackRotateLeft(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, grandpa);
          }
        } else {
          uncle = grandpa.L;
          if (uncle && uncle.C) {
            parent.C = uncle.C = false;
            grandpa.C = true;
            after = grandpa;
          } else {
            if (after === parent.L) {
              d3_geom_voronoiRedBlackRotateRight(this, parent);
              after = parent;
              parent = after.U;
            }
            parent.C = false;
            grandpa.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, grandpa);
          }
        }
        parent = after.U;
      }
      this._.C = false;
    },
    remove: function(node) {
      if (node.N) node.N.P = node.P;
      if (node.P) node.P.N = node.N;
      node.N = node.P = null;
      var parent = node.U, sibling, left = node.L, right = node.R, next, red;
      if (!left) next = right; else if (!right) next = left; else next = d3_geom_voronoiRedBlackFirst(right);
      if (parent) {
        if (parent.L === node) parent.L = next; else parent.R = next;
      } else {
        this._ = next;
      }
      if (left && right) {
        red = next.C;
        next.C = node.C;
        next.L = left;
        left.U = next;
        if (next !== right) {
          parent = next.U;
          next.U = node.U;
          node = next.R;
          parent.L = node;
          next.R = right;
          right.U = next;
        } else {
          next.U = parent;
          parent = next;
          node = next.R;
        }
      } else {
        red = node.C;
        node = next;
      }
      if (node) node.U = parent;
      if (red) return;
      if (node && node.C) {
        node.C = false;
        return;
      }
      do {
        if (node === this._) break;
        if (node === parent.L) {
          sibling = parent.R;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            sibling = parent.R;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.R || !sibling.R.C) {
              sibling.L.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateRight(this, sibling);
              sibling = parent.R;
            }
            sibling.C = parent.C;
            parent.C = sibling.R.C = false;
            d3_geom_voronoiRedBlackRotateLeft(this, parent);
            node = this._;
            break;
          }
        } else {
          sibling = parent.L;
          if (sibling.C) {
            sibling.C = false;
            parent.C = true;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            sibling = parent.L;
          }
          if (sibling.L && sibling.L.C || sibling.R && sibling.R.C) {
            if (!sibling.L || !sibling.L.C) {
              sibling.R.C = false;
              sibling.C = true;
              d3_geom_voronoiRedBlackRotateLeft(this, sibling);
              sibling = parent.L;
            }
            sibling.C = parent.C;
            parent.C = sibling.L.C = false;
            d3_geom_voronoiRedBlackRotateRight(this, parent);
            node = this._;
            break;
          }
        }
        sibling.C = true;
        node = parent;
        parent = parent.U;
      } while (!node.C);
      if (node) node.C = false;
    }
  };
  function d3_geom_voronoiRedBlackRotateLeft(tree, node) {
    var p = node, q = node.R, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.R = q.L;
    if (p.R) p.R.U = p;
    q.L = p;
  }
  function d3_geom_voronoiRedBlackRotateRight(tree, node) {
    var p = node, q = node.L, parent = p.U;
    if (parent) {
      if (parent.L === p) parent.L = q; else parent.R = q;
    } else {
      tree._ = q;
    }
    q.U = parent;
    p.U = q;
    p.L = q.R;
    if (p.L) p.L.U = p;
    q.R = p;
  }
  function d3_geom_voronoiRedBlackFirst(node) {
    while (node.L) node = node.L;
    return node;
  }
  function d3_geom_voronoi(sites, bbox) {
    var site = sites.sort(d3_geom_voronoiVertexOrder).pop(), x0, y0, circle;
    d3_geom_voronoiEdges = [];
    d3_geom_voronoiCells = new Array(sites.length);
    d3_geom_voronoiBeaches = new d3_geom_voronoiRedBlackTree();
    d3_geom_voronoiCircles = new d3_geom_voronoiRedBlackTree();
    while (true) {
      circle = d3_geom_voronoiFirstCircle;
      if (site && (!circle || site.y < circle.y || site.y === circle.y && site.x < circle.x)) {
        if (site.x !== x0 || site.y !== y0) {
          d3_geom_voronoiCells[site.i] = new d3_geom_voronoiCell(site);
          d3_geom_voronoiAddBeach(site);
          x0 = site.x, y0 = site.y;
        }
        site = sites.pop();
      } else if (circle) {
        d3_geom_voronoiRemoveBeach(circle.arc);
      } else {
        break;
      }
    }
    if (bbox) d3_geom_voronoiClipEdges(bbox), d3_geom_voronoiCloseCells(bbox);
    var diagram = {
      cells: d3_geom_voronoiCells,
      edges: d3_geom_voronoiEdges
    };
    d3_geom_voronoiBeaches = d3_geom_voronoiCircles = d3_geom_voronoiEdges = d3_geom_voronoiCells = null;
    return diagram;
  }
  function d3_geom_voronoiVertexOrder(a, b) {
    return b.y - a.y || b.x - a.x;
  }
  d3.geom.voronoi = function(points) {
    var x = d3_geom_pointX, y = d3_geom_pointY, fx = x, fy = y, clipExtent = d3_geom_voronoiClipExtent;
    if (points) return voronoi(points);
    function voronoi(data) {
      var polygons = new Array(data.length), x0 = clipExtent[0][0], y0 = clipExtent[0][1], x1 = clipExtent[1][0], y1 = clipExtent[1][1];
      d3_geom_voronoi(sites(data), clipExtent).cells.forEach(function(cell, i) {
        var edges = cell.edges, site = cell.site, polygon = polygons[i] = edges.length ? edges.map(function(e) {
          var s = e.start();
          return [ s.x, s.y ];
        }) : site.x >= x0 && site.x <= x1 && site.y >= y0 && site.y <= y1 ? [ [ x0, y1 ], [ x1, y1 ], [ x1, y0 ], [ x0, y0 ] ] : [];
        polygon.point = data[i];
      });
      return polygons;
    }
    function sites(data) {
      return data.map(function(d, i) {
        return {
          x: Math.round(fx(d, i) / ε) * ε,
          y: Math.round(fy(d, i) / ε) * ε,
          i: i
        };
      });
    }
    voronoi.links = function(data) {
      return d3_geom_voronoi(sites(data)).edges.filter(function(edge) {
        return edge.l && edge.r;
      }).map(function(edge) {
        return {
          source: data[edge.l.i],
          target: data[edge.r.i]
        };
      });
    };
    voronoi.triangles = function(data) {
      var triangles = [];
      d3_geom_voronoi(sites(data)).cells.forEach(function(cell, i) {
        var site = cell.site, edges = cell.edges.sort(d3_geom_voronoiHalfEdgeOrder), j = -1, m = edges.length, e0, s0, e1 = edges[m - 1].edge, s1 = e1.l === site ? e1.r : e1.l;
        while (++j < m) {
          e0 = e1;
          s0 = s1;
          e1 = edges[j].edge;
          s1 = e1.l === site ? e1.r : e1.l;
          if (i < s0.i && i < s1.i && d3_geom_voronoiTriangleArea(site, s0, s1) < 0) {
            triangles.push([ data[i], data[s0.i], data[s1.i] ]);
          }
        }
      });
      return triangles;
    };
    voronoi.x = function(_) {
      return arguments.length ? (fx = d3_functor(x = _), voronoi) : x;
    };
    voronoi.y = function(_) {
      return arguments.length ? (fy = d3_functor(y = _), voronoi) : y;
    };
    voronoi.clipExtent = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent;
      clipExtent = _ == null ? d3_geom_voronoiClipExtent : _;
      return voronoi;
    };
    voronoi.size = function(_) {
      if (!arguments.length) return clipExtent === d3_geom_voronoiClipExtent ? null : clipExtent && clipExtent[1];
      return voronoi.clipExtent(_ && [ [ 0, 0 ], _ ]);
    };
    return voronoi;
  };
  var d3_geom_voronoiClipExtent = [ [ -1e6, -1e6 ], [ 1e6, 1e6 ] ];
  function d3_geom_voronoiTriangleArea(a, b, c) {
    return (a.x - c.x) * (b.y - a.y) - (a.x - b.x) * (c.y - a.y);
  }
  d3.geom.delaunay = function(vertices) {
    return d3.geom.voronoi().triangles(vertices);
  };
  d3.geom.quadtree = function(points, x1, y1, x2, y2) {
    var x = d3_geom_pointX, y = d3_geom_pointY, compat;
    if (compat = arguments.length) {
      x = d3_geom_quadtreeCompatX;
      y = d3_geom_quadtreeCompatY;
      if (compat === 3) {
        y2 = y1;
        x2 = x1;
        y1 = x1 = 0;
      }
      return quadtree(points);
    }
    function quadtree(data) {
      var d, fx = d3_functor(x), fy = d3_functor(y), xs, ys, i, n, x1_, y1_, x2_, y2_;
      if (x1 != null) {
        x1_ = x1, y1_ = y1, x2_ = x2, y2_ = y2;
      } else {
        x2_ = y2_ = -(x1_ = y1_ = Infinity);
        xs = [], ys = [];
        n = data.length;
        if (compat) for (i = 0; i < n; ++i) {
          d = data[i];
          if (d.x < x1_) x1_ = d.x;
          if (d.y < y1_) y1_ = d.y;
          if (d.x > x2_) x2_ = d.x;
          if (d.y > y2_) y2_ = d.y;
          xs.push(d.x);
          ys.push(d.y);
        } else for (i = 0; i < n; ++i) {
          var x_ = +fx(d = data[i], i), y_ = +fy(d, i);
          if (x_ < x1_) x1_ = x_;
          if (y_ < y1_) y1_ = y_;
          if (x_ > x2_) x2_ = x_;
          if (y_ > y2_) y2_ = y_;
          xs.push(x_);
          ys.push(y_);
        }
      }
      var dx = x2_ - x1_, dy = y2_ - y1_;
      if (dx > dy) y2_ = y1_ + dx; else x2_ = x1_ + dy;
      function insert(n, d, x, y, x1, y1, x2, y2) {
        if (isNaN(x) || isNaN(y)) return;
        if (n.leaf) {
          var nx = n.x, ny = n.y;
          if (nx != null) {
            if (abs(nx - x) + abs(ny - y) < .01) {
              insertChild(n, d, x, y, x1, y1, x2, y2);
            } else {
              var nPoint = n.point;
              n.x = n.y = n.point = null;
              insertChild(n, nPoint, nx, ny, x1, y1, x2, y2);
              insertChild(n, d, x, y, x1, y1, x2, y2);
            }
          } else {
            n.x = x, n.y = y, n.point = d;
          }
        } else {
          insertChild(n, d, x, y, x1, y1, x2, y2);
        }
      }
      function insertChild(n, d, x, y, x1, y1, x2, y2) {
        var xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym, i = below << 1 | right;
        n.leaf = false;
        n = n.nodes[i] || (n.nodes[i] = d3_geom_quadtreeNode());
        if (right) x1 = xm; else x2 = xm;
        if (below) y1 = ym; else y2 = ym;
        insert(n, d, x, y, x1, y1, x2, y2);
      }
      var root = d3_geom_quadtreeNode();
      root.add = function(d) {
        insert(root, d, +fx(d, ++i), +fy(d, i), x1_, y1_, x2_, y2_);
      };
      root.visit = function(f) {
        d3_geom_quadtreeVisit(f, root, x1_, y1_, x2_, y2_);
      };
      root.find = function(point) {
        return d3_geom_quadtreeFind(root, point[0], point[1], x1_, y1_, x2_, y2_);
      };
      i = -1;
      if (x1 == null) {
        while (++i < n) {
          insert(root, data[i], xs[i], ys[i], x1_, y1_, x2_, y2_);
        }
        --i;
      } else data.forEach(root.add);
      xs = ys = data = d = null;
      return root;
    }
    quadtree.x = function(_) {
      return arguments.length ? (x = _, quadtree) : x;
    };
    quadtree.y = function(_) {
      return arguments.length ? (y = _, quadtree) : y;
    };
    quadtree.extent = function(_) {
      if (!arguments.length) return x1 == null ? null : [ [ x1, y1 ], [ x2, y2 ] ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = +_[0][0], y1 = +_[0][1], x2 = +_[1][0], 
      y2 = +_[1][1];
      return quadtree;
    };
    quadtree.size = function(_) {
      if (!arguments.length) return x1 == null ? null : [ x2 - x1, y2 - y1 ];
      if (_ == null) x1 = y1 = x2 = y2 = null; else x1 = y1 = 0, x2 = +_[0], y2 = +_[1];
      return quadtree;
    };
    return quadtree;
  };
  function d3_geom_quadtreeCompatX(d) {
    return d.x;
  }
  function d3_geom_quadtreeCompatY(d) {
    return d.y;
  }
  function d3_geom_quadtreeNode() {
    return {
      leaf: true,
      nodes: [],
      point: null,
      x: null,
      y: null
    };
  }
  function d3_geom_quadtreeVisit(f, node, x1, y1, x2, y2) {
    if (!f(node, x1, y1, x2, y2)) {
      var sx = (x1 + x2) * .5, sy = (y1 + y2) * .5, children = node.nodes;
      if (children[0]) d3_geom_quadtreeVisit(f, children[0], x1, y1, sx, sy);
      if (children[1]) d3_geom_quadtreeVisit(f, children[1], sx, y1, x2, sy);
      if (children[2]) d3_geom_quadtreeVisit(f, children[2], x1, sy, sx, y2);
      if (children[3]) d3_geom_quadtreeVisit(f, children[3], sx, sy, x2, y2);
    }
  }
  function d3_geom_quadtreeFind(root, x, y, x0, y0, x3, y3) {
    var minDistance2 = Infinity, closestPoint;
    (function find(node, x1, y1, x2, y2) {
      if (x1 > x3 || y1 > y3 || x2 < x0 || y2 < y0) return;
      if (point = node.point) {
        var point, dx = x - node.x, dy = y - node.y, distance2 = dx * dx + dy * dy;
        if (distance2 < minDistance2) {
          var distance = Math.sqrt(minDistance2 = distance2);
          x0 = x - distance, y0 = y - distance;
          x3 = x + distance, y3 = y + distance;
          closestPoint = point;
        }
      }
      var children = node.nodes, xm = (x1 + x2) * .5, ym = (y1 + y2) * .5, right = x >= xm, below = y >= ym;
      for (var i = below << 1 | right, j = i + 4; i < j; ++i) {
        if (node = children[i & 3]) switch (i & 3) {
         case 0:
          find(node, x1, y1, xm, ym);
          break;

         case 1:
          find(node, xm, y1, x2, ym);
          break;

         case 2:
          find(node, x1, ym, xm, y2);
          break;

         case 3:
          find(node, xm, ym, x2, y2);
          break;
        }
      }
    })(root, x0, y0, x3, y3);
    return closestPoint;
  }
  d3.interpolateRgb = d3_interpolateRgb;
  function d3_interpolateRgb(a, b) {
    a = d3.rgb(a);
    b = d3.rgb(b);
    var ar = a.r, ag = a.g, ab = a.b, br = b.r - ar, bg = b.g - ag, bb = b.b - ab;
    return function(t) {
      return "#" + d3_rgb_hex(Math.round(ar + br * t)) + d3_rgb_hex(Math.round(ag + bg * t)) + d3_rgb_hex(Math.round(ab + bb * t));
    };
  }
  d3.interpolateObject = d3_interpolateObject;
  function d3_interpolateObject(a, b) {
    var i = {}, c = {}, k;
    for (k in a) {
      if (k in b) {
        i[k] = d3_interpolate(a[k], b[k]);
      } else {
        c[k] = a[k];
      }
    }
    for (k in b) {
      if (!(k in a)) {
        c[k] = b[k];
      }
    }
    return function(t) {
      for (k in i) c[k] = i[k](t);
      return c;
    };
  }
  d3.interpolateNumber = d3_interpolateNumber;
  function d3_interpolateNumber(a, b) {
    a = +a, b = +b;
    return function(t) {
      return a * (1 - t) + b * t;
    };
  }
  d3.interpolateString = d3_interpolateString;
  function d3_interpolateString(a, b) {
    var bi = d3_interpolate_numberA.lastIndex = d3_interpolate_numberB.lastIndex = 0, am, bm, bs, i = -1, s = [], q = [];
    a = a + "", b = b + "";
    while ((am = d3_interpolate_numberA.exec(a)) && (bm = d3_interpolate_numberB.exec(b))) {
      if ((bs = bm.index) > bi) {
        bs = b.slice(bi, bs);
        if (s[i]) s[i] += bs; else s[++i] = bs;
      }
      if ((am = am[0]) === (bm = bm[0])) {
        if (s[i]) s[i] += bm; else s[++i] = bm;
      } else {
        s[++i] = null;
        q.push({
          i: i,
          x: d3_interpolateNumber(am, bm)
        });
      }
      bi = d3_interpolate_numberB.lastIndex;
    }
    if (bi < b.length) {
      bs = b.slice(bi);
      if (s[i]) s[i] += bs; else s[++i] = bs;
    }
    return s.length < 2 ? q[0] ? (b = q[0].x, function(t) {
      return b(t) + "";
    }) : function() {
      return b;
    } : (b = q.length, function(t) {
      for (var i = 0, o; i < b; ++i) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    });
  }
  var d3_interpolate_numberA = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, d3_interpolate_numberB = new RegExp(d3_interpolate_numberA.source, "g");
  d3.interpolate = d3_interpolate;
  function d3_interpolate(a, b) {
    var i = d3.interpolators.length, f;
    while (--i >= 0 && !(f = d3.interpolators[i](a, b))) ;
    return f;
  }
  d3.interpolators = [ function(a, b) {
    var t = typeof b;
    return (t === "string" ? d3_rgb_names.has(b.toLowerCase()) || /^(#|rgb\(|hsl\()/i.test(b) ? d3_interpolateRgb : d3_interpolateString : b instanceof d3_color ? d3_interpolateRgb : Array.isArray(b) ? d3_interpolateArray : t === "object" && isNaN(b) ? d3_interpolateObject : d3_interpolateNumber)(a, b);
  } ];
  d3.interpolateArray = d3_interpolateArray;
  function d3_interpolateArray(a, b) {
    var x = [], c = [], na = a.length, nb = b.length, n0 = Math.min(a.length, b.length), i;
    for (i = 0; i < n0; ++i) x.push(d3_interpolate(a[i], b[i]));
    for (;i < na; ++i) c[i] = a[i];
    for (;i < nb; ++i) c[i] = b[i];
    return function(t) {
      for (i = 0; i < n0; ++i) c[i] = x[i](t);
      return c;
    };
  }
  var d3_ease_default = function() {
    return d3_identity;
  };
  var d3_ease = d3.map({
    linear: d3_ease_default,
    poly: d3_ease_poly,
    quad: function() {
      return d3_ease_quad;
    },
    cubic: function() {
      return d3_ease_cubic;
    },
    sin: function() {
      return d3_ease_sin;
    },
    exp: function() {
      return d3_ease_exp;
    },
    circle: function() {
      return d3_ease_circle;
    },
    elastic: d3_ease_elastic,
    back: d3_ease_back,
    bounce: function() {
      return d3_ease_bounce;
    }
  });
  var d3_ease_mode = d3.map({
    "in": d3_identity,
    out: d3_ease_reverse,
    "in-out": d3_ease_reflect,
    "out-in": function(f) {
      return d3_ease_reflect(d3_ease_reverse(f));
    }
  });
  d3.ease = function(name) {
    var i = name.indexOf("-"), t = i >= 0 ? name.slice(0, i) : name, m = i >= 0 ? name.slice(i + 1) : "in";
    t = d3_ease.get(t) || d3_ease_default;
    m = d3_ease_mode.get(m) || d3_identity;
    return d3_ease_clamp(m(t.apply(null, d3_arraySlice.call(arguments, 1))));
  };
  function d3_ease_clamp(f) {
    return function(t) {
      return t <= 0 ? 0 : t >= 1 ? 1 : f(t);
    };
  }
  function d3_ease_reverse(f) {
    return function(t) {
      return 1 - f(1 - t);
    };
  }
  function d3_ease_reflect(f) {
    return function(t) {
      return .5 * (t < .5 ? f(2 * t) : 2 - f(2 - 2 * t));
    };
  }
  function d3_ease_quad(t) {
    return t * t;
  }
  function d3_ease_cubic(t) {
    return t * t * t;
  }
  function d3_ease_cubicInOut(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;
    var t2 = t * t, t3 = t2 * t;
    return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
  }
  function d3_ease_poly(e) {
    return function(t) {
      return Math.pow(t, e);
    };
  }
  function d3_ease_sin(t) {
    return 1 - Math.cos(t * halfπ);
  }
  function d3_ease_exp(t) {
    return Math.pow(2, 10 * (t - 1));
  }
  function d3_ease_circle(t) {
    return 1 - Math.sqrt(1 - t * t);
  }
  function d3_ease_elastic(a, p) {
    var s;
    if (arguments.length < 2) p = .45;
    if (arguments.length) s = p / τ * Math.asin(1 / a); else a = 1, s = p / 4;
    return function(t) {
      return 1 + a * Math.pow(2, -10 * t) * Math.sin((t - s) * τ / p);
    };
  }
  function d3_ease_back(s) {
    if (!s) s = 1.70158;
    return function(t) {
      return t * t * ((s + 1) * t - s);
    };
  }
  function d3_ease_bounce(t) {
    return t < 1 / 2.75 ? 7.5625 * t * t : t < 2 / 2.75 ? 7.5625 * (t -= 1.5 / 2.75) * t + .75 : t < 2.5 / 2.75 ? 7.5625 * (t -= 2.25 / 2.75) * t + .9375 : 7.5625 * (t -= 2.625 / 2.75) * t + .984375;
  }
  d3.interpolateHcl = d3_interpolateHcl;
  function d3_interpolateHcl(a, b) {
    a = d3.hcl(a);
    b = d3.hcl(b);
    var ah = a.h, ac = a.c, al = a.l, bh = b.h - ah, bc = b.c - ac, bl = b.l - al;
    if (isNaN(bc)) bc = 0, ac = isNaN(ac) ? b.c : ac;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hcl_lab(ah + bh * t, ac + bc * t, al + bl * t) + "";
    };
  }
  d3.interpolateHsl = d3_interpolateHsl;
  function d3_interpolateHsl(a, b) {
    a = d3.hsl(a);
    b = d3.hsl(b);
    var ah = a.h, as = a.s, al = a.l, bh = b.h - ah, bs = b.s - as, bl = b.l - al;
    if (isNaN(bs)) bs = 0, as = isNaN(as) ? b.s : as;
    if (isNaN(bh)) bh = 0, ah = isNaN(ah) ? b.h : ah; else if (bh > 180) bh -= 360; else if (bh < -180) bh += 360;
    return function(t) {
      return d3_hsl_rgb(ah + bh * t, as + bs * t, al + bl * t) + "";
    };
  }
  d3.interpolateLab = d3_interpolateLab;
  function d3_interpolateLab(a, b) {
    a = d3.lab(a);
    b = d3.lab(b);
    var al = a.l, aa = a.a, ab = a.b, bl = b.l - al, ba = b.a - aa, bb = b.b - ab;
    return function(t) {
      return d3_lab_rgb(al + bl * t, aa + ba * t, ab + bb * t) + "";
    };
  }
  d3.interpolateRound = d3_interpolateRound;
  function d3_interpolateRound(a, b) {
    b -= a;
    return function(t) {
      return Math.round(a + b * t);
    };
  }
  d3.transform = function(string) {
    var g = d3_document.createElementNS(d3.ns.prefix.svg, "g");
    return (d3.transform = function(string) {
      if (string != null) {
        g.setAttribute("transform", string);
        var t = g.transform.baseVal.consolidate();
      }
      return new d3_transform(t ? t.matrix : d3_transformIdentity);
    })(string);
  };
  function d3_transform(m) {
    var r0 = [ m.a, m.b ], r1 = [ m.c, m.d ], kx = d3_transformNormalize(r0), kz = d3_transformDot(r0, r1), ky = d3_transformNormalize(d3_transformCombine(r1, r0, -kz)) || 0;
    if (r0[0] * r1[1] < r1[0] * r0[1]) {
      r0[0] *= -1;
      r0[1] *= -1;
      kx *= -1;
      kz *= -1;
    }
    this.rotate = (kx ? Math.atan2(r0[1], r0[0]) : Math.atan2(-r1[0], r1[1])) * d3_degrees;
    this.translate = [ m.e, m.f ];
    this.scale = [ kx, ky ];
    this.skew = ky ? Math.atan2(kz, ky) * d3_degrees : 0;
  }
  d3_transform.prototype.toString = function() {
    return "translate(" + this.translate + ")rotate(" + this.rotate + ")skewX(" + this.skew + ")scale(" + this.scale + ")";
  };
  function d3_transformDot(a, b) {
    return a[0] * b[0] + a[1] * b[1];
  }
  function d3_transformNormalize(a) {
    var k = Math.sqrt(d3_transformDot(a, a));
    if (k) {
      a[0] /= k;
      a[1] /= k;
    }
    return k;
  }
  function d3_transformCombine(a, b, k) {
    a[0] += k * b[0];
    a[1] += k * b[1];
    return a;
  }
  var d3_transformIdentity = {
    a: 1,
    b: 0,
    c: 0,
    d: 1,
    e: 0,
    f: 0
  };
  d3.interpolateTransform = d3_interpolateTransform;
  function d3_interpolateTransformPop(s) {
    return s.length ? s.pop() + "," : "";
  }
  function d3_interpolateTranslate(ta, tb, s, q) {
    if (ta[0] !== tb[0] || ta[1] !== tb[1]) {
      var i = s.push("translate(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: d3_interpolateNumber(ta[0], tb[0])
      }, {
        i: i - 2,
        x: d3_interpolateNumber(ta[1], tb[1])
      });
    } else if (tb[0] || tb[1]) {
      s.push("translate(" + tb + ")");
    }
  }
  function d3_interpolateRotate(ra, rb, s, q) {
    if (ra !== rb) {
      if (ra - rb > 180) rb += 360; else if (rb - ra > 180) ra += 360;
      q.push({
        i: s.push(d3_interpolateTransformPop(s) + "rotate(", null, ")") - 2,
        x: d3_interpolateNumber(ra, rb)
      });
    } else if (rb) {
      s.push(d3_interpolateTransformPop(s) + "rotate(" + rb + ")");
    }
  }
  function d3_interpolateSkew(wa, wb, s, q) {
    if (wa !== wb) {
      q.push({
        i: s.push(d3_interpolateTransformPop(s) + "skewX(", null, ")") - 2,
        x: d3_interpolateNumber(wa, wb)
      });
    } else if (wb) {
      s.push(d3_interpolateTransformPop(s) + "skewX(" + wb + ")");
    }
  }
  function d3_interpolateScale(ka, kb, s, q) {
    if (ka[0] !== kb[0] || ka[1] !== kb[1]) {
      var i = s.push(d3_interpolateTransformPop(s) + "scale(", null, ",", null, ")");
      q.push({
        i: i - 4,
        x: d3_interpolateNumber(ka[0], kb[0])
      }, {
        i: i - 2,
        x: d3_interpolateNumber(ka[1], kb[1])
      });
    } else if (kb[0] !== 1 || kb[1] !== 1) {
      s.push(d3_interpolateTransformPop(s) + "scale(" + kb + ")");
    }
  }
  function d3_interpolateTransform(a, b) {
    var s = [], q = [];
    a = d3.transform(a), b = d3.transform(b);
    d3_interpolateTranslate(a.translate, b.translate, s, q);
    d3_interpolateRotate(a.rotate, b.rotate, s, q);
    d3_interpolateSkew(a.skew, b.skew, s, q);
    d3_interpolateScale(a.scale, b.scale, s, q);
    a = b = null;
    return function(t) {
      var i = -1, n = q.length, o;
      while (++i < n) s[(o = q[i]).i] = o.x(t);
      return s.join("");
    };
  }
  function d3_uninterpolateNumber(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return (x - a) / b;
    };
  }
  function d3_uninterpolateClamp(a, b) {
    b = (b -= a = +a) || 1 / b;
    return function(x) {
      return Math.max(0, Math.min(1, (x - a) / b));
    };
  }
  d3.layout = {};
  d3.layout.bundle = function() {
    return function(links) {
      var paths = [], i = -1, n = links.length;
      while (++i < n) paths.push(d3_layout_bundlePath(links[i]));
      return paths;
    };
  };
  function d3_layout_bundlePath(link) {
    var start = link.source, end = link.target, lca = d3_layout_bundleLeastCommonAncestor(start, end), points = [ start ];
    while (start !== lca) {
      start = start.parent;
      points.push(start);
    }
    var k = points.length;
    while (end !== lca) {
      points.splice(k, 0, end);
      end = end.parent;
    }
    return points;
  }
  function d3_layout_bundleAncestors(node) {
    var ancestors = [], parent = node.parent;
    while (parent != null) {
      ancestors.push(node);
      node = parent;
      parent = parent.parent;
    }
    ancestors.push(node);
    return ancestors;
  }
  function d3_layout_bundleLeastCommonAncestor(a, b) {
    if (a === b) return a;
    var aNodes = d3_layout_bundleAncestors(a), bNodes = d3_layout_bundleAncestors(b), aNode = aNodes.pop(), bNode = bNodes.pop(), sharedNode = null;
    while (aNode === bNode) {
      sharedNode = aNode;
      aNode = aNodes.pop();
      bNode = bNodes.pop();
    }
    return sharedNode;
  }
  d3.layout.chord = function() {
    var chord = {}, chords, groups, matrix, n, padding = 0, sortGroups, sortSubgroups, sortChords;
    function relayout() {
      var subgroups = {}, groupSums = [], groupIndex = d3.range(n), subgroupIndex = [], k, x, x0, i, j;
      chords = [];
      groups = [];
      k = 0, i = -1;
      while (++i < n) {
        x = 0, j = -1;
        while (++j < n) {
          x += matrix[i][j];
        }
        groupSums.push(x);
        subgroupIndex.push(d3.range(n));
        k += x;
      }
      if (sortGroups) {
        groupIndex.sort(function(a, b) {
          return sortGroups(groupSums[a], groupSums[b]);
        });
      }
      if (sortSubgroups) {
        subgroupIndex.forEach(function(d, i) {
          d.sort(function(a, b) {
            return sortSubgroups(matrix[i][a], matrix[i][b]);
          });
        });
      }
      k = (τ - padding * n) / k;
      x = 0, i = -1;
      while (++i < n) {
        x0 = x, j = -1;
        while (++j < n) {
          var di = groupIndex[i], dj = subgroupIndex[di][j], v = matrix[di][dj], a0 = x, a1 = x += v * k;
          subgroups[di + "-" + dj] = {
            index: di,
            subindex: dj,
            startAngle: a0,
            endAngle: a1,
            value: v
          };
        }
        groups[di] = {
          index: di,
          startAngle: x0,
          endAngle: x,
          value: groupSums[di]
        };
        x += padding;
      }
      i = -1;
      while (++i < n) {
        j = i - 1;
        while (++j < n) {
          var source = subgroups[i + "-" + j], target = subgroups[j + "-" + i];
          if (source.value || target.value) {
            chords.push(source.value < target.value ? {
              source: target,
              target: source
            } : {
              source: source,
              target: target
            });
          }
        }
      }
      if (sortChords) resort();
    }
    function resort() {
      chords.sort(function(a, b) {
        return sortChords((a.source.value + a.target.value) / 2, (b.source.value + b.target.value) / 2);
      });
    }
    chord.matrix = function(x) {
      if (!arguments.length) return matrix;
      n = (matrix = x) && matrix.length;
      chords = groups = null;
      return chord;
    };
    chord.padding = function(x) {
      if (!arguments.length) return padding;
      padding = x;
      chords = groups = null;
      return chord;
    };
    chord.sortGroups = function(x) {
      if (!arguments.length) return sortGroups;
      sortGroups = x;
      chords = groups = null;
      return chord;
    };
    chord.sortSubgroups = function(x) {
      if (!arguments.length) return sortSubgroups;
      sortSubgroups = x;
      chords = null;
      return chord;
    };
    chord.sortChords = function(x) {
      if (!arguments.length) return sortChords;
      sortChords = x;
      if (chords) resort();
      return chord;
    };
    chord.chords = function() {
      if (!chords) relayout();
      return chords;
    };
    chord.groups = function() {
      if (!groups) relayout();
      return groups;
    };
    return chord;
  };
  d3.layout.force = function() {
    var force = {}, event = d3.dispatch("start", "tick", "end"), timer, size = [ 1, 1 ], drag, alpha, friction = .9, linkDistance = d3_layout_forceLinkDistance, linkStrength = d3_layout_forceLinkStrength, charge = -30, chargeDistance2 = d3_layout_forceChargeDistance2, gravity = .1, theta2 = .64, nodes = [], links = [], distances, strengths, charges;
    function repulse(node) {
      return function(quad, x1, _, x2) {
        if (quad.point !== node) {
          var dx = quad.cx - node.x, dy = quad.cy - node.y, dw = x2 - x1, dn = dx * dx + dy * dy;
          if (dw * dw / theta2 < dn) {
            if (dn < chargeDistance2) {
              var k = quad.charge / dn;
              node.px -= dx * k;
              node.py -= dy * k;
            }
            return true;
          }
          if (quad.point && dn && dn < chargeDistance2) {
            var k = quad.pointCharge / dn;
            node.px -= dx * k;
            node.py -= dy * k;
          }
        }
        return !quad.charge;
      };
    }
    force.tick = function() {
      if ((alpha *= .99) < .005) {
        timer = null;
        event.end({
          type: "end",
          alpha: alpha = 0
        });
        return true;
      }
      var n = nodes.length, m = links.length, q, i, o, s, t, l, k, x, y;
      for (i = 0; i < m; ++i) {
        o = links[i];
        s = o.source;
        t = o.target;
        x = t.x - s.x;
        y = t.y - s.y;
        if (l = x * x + y * y) {
          l = alpha * strengths[i] * ((l = Math.sqrt(l)) - distances[i]) / l;
          x *= l;
          y *= l;
          t.x -= x * (k = s.weight + t.weight ? s.weight / (s.weight + t.weight) : .5);
          t.y -= y * k;
          s.x += x * (k = 1 - k);
          s.y += y * k;
        }
      }
      if (k = alpha * gravity) {
        x = size[0] / 2;
        y = size[1] / 2;
        i = -1;
        if (k) while (++i < n) {
          o = nodes[i];
          o.x += (x - o.x) * k;
          o.y += (y - o.y) * k;
        }
      }
      if (charge) {
        d3_layout_forceAccumulate(q = d3.geom.quadtree(nodes), alpha, charges);
        i = -1;
        while (++i < n) {
          if (!(o = nodes[i]).fixed) {
            q.visit(repulse(o));
          }
        }
      }
      i = -1;
      while (++i < n) {
        o = nodes[i];
        if (o.fixed) {
          o.x = o.px;
          o.y = o.py;
        } else {
          o.x -= (o.px - (o.px = o.x)) * friction;
          o.y -= (o.py - (o.py = o.y)) * friction;
        }
      }
      event.tick({
        type: "tick",
        alpha: alpha
      });
    };
    force.nodes = function(x) {
      if (!arguments.length) return nodes;
      nodes = x;
      return force;
    };
    force.links = function(x) {
      if (!arguments.length) return links;
      links = x;
      return force;
    };
    force.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return force;
    };
    force.linkDistance = function(x) {
      if (!arguments.length) return linkDistance;
      linkDistance = typeof x === "function" ? x : +x;
      return force;
    };
    force.distance = force.linkDistance;
    force.linkStrength = function(x) {
      if (!arguments.length) return linkStrength;
      linkStrength = typeof x === "function" ? x : +x;
      return force;
    };
    force.friction = function(x) {
      if (!arguments.length) return friction;
      friction = +x;
      return force;
    };
    force.charge = function(x) {
      if (!arguments.length) return charge;
      charge = typeof x === "function" ? x : +x;
      return force;
    };
    force.chargeDistance = function(x) {
      if (!arguments.length) return Math.sqrt(chargeDistance2);
      chargeDistance2 = x * x;
      return force;
    };
    force.gravity = function(x) {
      if (!arguments.length) return gravity;
      gravity = +x;
      return force;
    };
    force.theta = function(x) {
      if (!arguments.length) return Math.sqrt(theta2);
      theta2 = x * x;
      return force;
    };
    force.alpha = function(x) {
      if (!arguments.length) return alpha;
      x = +x;
      if (alpha) {
        if (x > 0) {
          alpha = x;
        } else {
          timer.c = null, timer.t = NaN, timer = null;
          event.end({
            type: "end",
            alpha: alpha = 0
          });
        }
      } else if (x > 0) {
        event.start({
          type: "start",
          alpha: alpha = x
        });
        timer = d3_timer(force.tick);
      }
      return force;
    };
    force.start = function() {
      var i, n = nodes.length, m = links.length, w = size[0], h = size[1], neighbors, o;
      for (i = 0; i < n; ++i) {
        (o = nodes[i]).index = i;
        o.weight = 0;
      }
      for (i = 0; i < m; ++i) {
        o = links[i];
        if (typeof o.source == "number") o.source = nodes[o.source];
        if (typeof o.target == "number") o.target = nodes[o.target];
        ++o.source.weight;
        ++o.target.weight;
      }
      for (i = 0; i < n; ++i) {
        o = nodes[i];
        if (isNaN(o.x)) o.x = position("x", w);
        if (isNaN(o.y)) o.y = position("y", h);
        if (isNaN(o.px)) o.px = o.x;
        if (isNaN(o.py)) o.py = o.y;
      }
      distances = [];
      if (typeof linkDistance === "function") for (i = 0; i < m; ++i) distances[i] = +linkDistance.call(this, links[i], i); else for (i = 0; i < m; ++i) distances[i] = linkDistance;
      strengths = [];
      if (typeof linkStrength === "function") for (i = 0; i < m; ++i) strengths[i] = +linkStrength.call(this, links[i], i); else for (i = 0; i < m; ++i) strengths[i] = linkStrength;
      charges = [];
      if (typeof charge === "function") for (i = 0; i < n; ++i) charges[i] = +charge.call(this, nodes[i], i); else for (i = 0; i < n; ++i) charges[i] = charge;
      function position(dimension, size) {
        if (!neighbors) {
          neighbors = new Array(n);
          for (j = 0; j < n; ++j) {
            neighbors[j] = [];
          }
          for (j = 0; j < m; ++j) {
            var o = links[j];
            neighbors[o.source.index].push(o.target);
            neighbors[o.target.index].push(o.source);
          }
        }
        var candidates = neighbors[i], j = -1, l = candidates.length, x;
        while (++j < l) if (!isNaN(x = candidates[j][dimension])) return x;
        return Math.random() * size;
      }
      return force.resume();
    };
    force.resume = function() {
      return force.alpha(.1);
    };
    force.stop = function() {
      return force.alpha(0);
    };
    force.drag = function() {
      if (!drag) drag = d3.behavior.drag().origin(d3_identity).on("dragstart.force", d3_layout_forceDragstart).on("drag.force", dragmove).on("dragend.force", d3_layout_forceDragend);
      if (!arguments.length) return drag;
      this.on("mouseover.force", d3_layout_forceMouseover).on("mouseout.force", d3_layout_forceMouseout).call(drag);
    };
    function dragmove(d) {
      d.px = d3.event.x, d.py = d3.event.y;
      force.resume();
    }
    return d3.rebind(force, event, "on");
  };
  function d3_layout_forceDragstart(d) {
    d.fixed |= 2;
  }
  function d3_layout_forceDragend(d) {
    d.fixed &= ~6;
  }
  function d3_layout_forceMouseover(d) {
    d.fixed |= 4;
    d.px = d.x, d.py = d.y;
  }
  function d3_layout_forceMouseout(d) {
    d.fixed &= ~4;
  }
  function d3_layout_forceAccumulate(quad, alpha, charges) {
    var cx = 0, cy = 0;
    quad.charge = 0;
    if (!quad.leaf) {
      var nodes = quad.nodes, n = nodes.length, i = -1, c;
      while (++i < n) {
        c = nodes[i];
        if (c == null) continue;
        d3_layout_forceAccumulate(c, alpha, charges);
        quad.charge += c.charge;
        cx += c.charge * c.cx;
        cy += c.charge * c.cy;
      }
    }
    if (quad.point) {
      if (!quad.leaf) {
        quad.point.x += Math.random() - .5;
        quad.point.y += Math.random() - .5;
      }
      var k = alpha * charges[quad.point.index];
      quad.charge += quad.pointCharge = k;
      cx += k * quad.point.x;
      cy += k * quad.point.y;
    }
    quad.cx = cx / quad.charge;
    quad.cy = cy / quad.charge;
  }
  var d3_layout_forceLinkDistance = 20, d3_layout_forceLinkStrength = 1, d3_layout_forceChargeDistance2 = Infinity;
  d3.layout.hierarchy = function() {
    var sort = d3_layout_hierarchySort, children = d3_layout_hierarchyChildren, value = d3_layout_hierarchyValue;
    function hierarchy(root) {
      var stack = [ root ], nodes = [], node;
      root.depth = 0;
      while ((node = stack.pop()) != null) {
        nodes.push(node);
        if ((childs = children.call(hierarchy, node, node.depth)) && (n = childs.length)) {
          var n, childs, child;
          while (--n >= 0) {
            stack.push(child = childs[n]);
            child.parent = node;
            child.depth = node.depth + 1;
          }
          if (value) node.value = 0;
          node.children = childs;
        } else {
          if (value) node.value = +value.call(hierarchy, node, node.depth) || 0;
          delete node.children;
        }
      }
      d3_layout_hierarchyVisitAfter(root, function(node) {
        var childs, parent;
        if (sort && (childs = node.children)) childs.sort(sort);
        if (value && (parent = node.parent)) parent.value += node.value;
      });
      return nodes;
    }
    hierarchy.sort = function(x) {
      if (!arguments.length) return sort;
      sort = x;
      return hierarchy;
    };
    hierarchy.children = function(x) {
      if (!arguments.length) return children;
      children = x;
      return hierarchy;
    };
    hierarchy.value = function(x) {
      if (!arguments.length) return value;
      value = x;
      return hierarchy;
    };
    hierarchy.revalue = function(root) {
      if (value) {
        d3_layout_hierarchyVisitBefore(root, function(node) {
          if (node.children) node.value = 0;
        });
        d3_layout_hierarchyVisitAfter(root, function(node) {
          var parent;
          if (!node.children) node.value = +value.call(hierarchy, node, node.depth) || 0;
          if (parent = node.parent) parent.value += node.value;
        });
      }
      return root;
    };
    return hierarchy;
  };
  function d3_layout_hierarchyRebind(object, hierarchy) {
    d3.rebind(object, hierarchy, "sort", "children", "value");
    object.nodes = object;
    object.links = d3_layout_hierarchyLinks;
    return object;
  }
  function d3_layout_hierarchyVisitBefore(node, callback) {
    var nodes = [ node ];
    while ((node = nodes.pop()) != null) {
      callback(node);
      if ((children = node.children) && (n = children.length)) {
        var n, children;
        while (--n >= 0) nodes.push(children[n]);
      }
    }
  }
  function d3_layout_hierarchyVisitAfter(node, callback) {
    var nodes = [ node ], nodes2 = [];
    while ((node = nodes.pop()) != null) {
      nodes2.push(node);
      if ((children = node.children) && (n = children.length)) {
        var i = -1, n, children;
        while (++i < n) nodes.push(children[i]);
      }
    }
    while ((node = nodes2.pop()) != null) {
      callback(node);
    }
  }
  function d3_layout_hierarchyChildren(d) {
    return d.children;
  }
  function d3_layout_hierarchyValue(d) {
    return d.value;
  }
  function d3_layout_hierarchySort(a, b) {
    return b.value - a.value;
  }
  function d3_layout_hierarchyLinks(nodes) {
    return d3.merge(nodes.map(function(parent) {
      return (parent.children || []).map(function(child) {
        return {
          source: parent,
          target: child
        };
      });
    }));
  }
  d3.layout.partition = function() {
    var hierarchy = d3.layout.hierarchy(), size = [ 1, 1 ];
    function position(node, x, dx, dy) {
      var children = node.children;
      node.x = x;
      node.y = node.depth * dy;
      node.dx = dx;
      node.dy = dy;
      if (children && (n = children.length)) {
        var i = -1, n, c, d;
        dx = node.value ? dx / node.value : 0;
        while (++i < n) {
          position(c = children[i], x, d = c.value * dx, dy);
          x += d;
        }
      }
    }
    function depth(node) {
      var children = node.children, d = 0;
      if (children && (n = children.length)) {
        var i = -1, n;
        while (++i < n) d = Math.max(d, depth(children[i]));
      }
      return 1 + d;
    }
    function partition(d, i) {
      var nodes = hierarchy.call(this, d, i);
      position(nodes[0], 0, size[0], size[1] / depth(nodes[0]));
      return nodes;
    }
    partition.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return partition;
    };
    return d3_layout_hierarchyRebind(partition, hierarchy);
  };
  d3.layout.pie = function() {
    var value = Number, sort = d3_layout_pieSortByValue, startAngle = 0, endAngle = τ, padAngle = 0;
    function pie(data) {
      var n = data.length, values = data.map(function(d, i) {
        return +value.call(pie, d, i);
      }), a = +(typeof startAngle === "function" ? startAngle.apply(this, arguments) : startAngle), da = (typeof endAngle === "function" ? endAngle.apply(this, arguments) : endAngle) - a, p = Math.min(Math.abs(da) / n, +(typeof padAngle === "function" ? padAngle.apply(this, arguments) : padAngle)), pa = p * (da < 0 ? -1 : 1), sum = d3.sum(values), k = sum ? (da - n * pa) / sum : 0, index = d3.range(n), arcs = [], v;
      if (sort != null) index.sort(sort === d3_layout_pieSortByValue ? function(i, j) {
        return values[j] - values[i];
      } : function(i, j) {
        return sort(data[i], data[j]);
      });
      index.forEach(function(i) {
        arcs[i] = {
          data: data[i],
          value: v = values[i],
          startAngle: a,
          endAngle: a += v * k + pa,
          padAngle: p
        };
      });
      return arcs;
    }
    pie.value = function(_) {
      if (!arguments.length) return value;
      value = _;
      return pie;
    };
    pie.sort = function(_) {
      if (!arguments.length) return sort;
      sort = _;
      return pie;
    };
    pie.startAngle = function(_) {
      if (!arguments.length) return startAngle;
      startAngle = _;
      return pie;
    };
    pie.endAngle = function(_) {
      if (!arguments.length) return endAngle;
      endAngle = _;
      return pie;
    };
    pie.padAngle = function(_) {
      if (!arguments.length) return padAngle;
      padAngle = _;
      return pie;
    };
    return pie;
  };
  var d3_layout_pieSortByValue = {};
  d3.layout.stack = function() {
    var values = d3_identity, order = d3_layout_stackOrderDefault, offset = d3_layout_stackOffsetZero, out = d3_layout_stackOut, x = d3_layout_stackX, y = d3_layout_stackY;
    function stack(data, index) {
      if (!(n = data.length)) return data;
      var series = data.map(function(d, i) {
        return values.call(stack, d, i);
      });
      var points = series.map(function(d) {
        return d.map(function(v, i) {
          return [ x.call(stack, v, i), y.call(stack, v, i) ];
        });
      });
      var orders = order.call(stack, points, index);
      series = d3.permute(series, orders);
      points = d3.permute(points, orders);
      var offsets = offset.call(stack, points, index);
      var m = series[0].length, n, i, j, o;
      for (j = 0; j < m; ++j) {
        out.call(stack, series[0][j], o = offsets[j], points[0][j][1]);
        for (i = 1; i < n; ++i) {
          out.call(stack, series[i][j], o += points[i - 1][j][1], points[i][j][1]);
        }
      }
      return data;
    }
    stack.values = function(x) {
      if (!arguments.length) return values;
      values = x;
      return stack;
    };
    stack.order = function(x) {
      if (!arguments.length) return order;
      order = typeof x === "function" ? x : d3_layout_stackOrders.get(x) || d3_layout_stackOrderDefault;
      return stack;
    };
    stack.offset = function(x) {
      if (!arguments.length) return offset;
      offset = typeof x === "function" ? x : d3_layout_stackOffsets.get(x) || d3_layout_stackOffsetZero;
      return stack;
    };
    stack.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      return stack;
    };
    stack.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      return stack;
    };
    stack.out = function(z) {
      if (!arguments.length) return out;
      out = z;
      return stack;
    };
    return stack;
  };
  function d3_layout_stackX(d) {
    return d.x;
  }
  function d3_layout_stackY(d) {
    return d.y;
  }
  function d3_layout_stackOut(d, y0, y) {
    d.y0 = y0;
    d.y = y;
  }
  var d3_layout_stackOrders = d3.map({
    "inside-out": function(data) {
      var n = data.length, i, j, max = data.map(d3_layout_stackMaxIndex), sums = data.map(d3_layout_stackReduceSum), index = d3.range(n).sort(function(a, b) {
        return max[a] - max[b];
      }), top = 0, bottom = 0, tops = [], bottoms = [];
      for (i = 0; i < n; ++i) {
        j = index[i];
        if (top < bottom) {
          top += sums[j];
          tops.push(j);
        } else {
          bottom += sums[j];
          bottoms.push(j);
        }
      }
      return bottoms.reverse().concat(tops);
    },
    reverse: function(data) {
      return d3.range(data.length).reverse();
    },
    "default": d3_layout_stackOrderDefault
  });
  var d3_layout_stackOffsets = d3.map({
    silhouette: function(data) {
      var n = data.length, m = data[0].length, sums = [], max = 0, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o > max) max = o;
        sums.push(o);
      }
      for (j = 0; j < m; ++j) {
        y0[j] = (max - sums[j]) / 2;
      }
      return y0;
    },
    wiggle: function(data) {
      var n = data.length, x = data[0], m = x.length, i, j, k, s1, s2, s3, dx, o, o0, y0 = [];
      y0[0] = o = o0 = 0;
      for (j = 1; j < m; ++j) {
        for (i = 0, s1 = 0; i < n; ++i) s1 += data[i][j][1];
        for (i = 0, s2 = 0, dx = x[j][0] - x[j - 1][0]; i < n; ++i) {
          for (k = 0, s3 = (data[i][j][1] - data[i][j - 1][1]) / (2 * dx); k < i; ++k) {
            s3 += (data[k][j][1] - data[k][j - 1][1]) / dx;
          }
          s2 += s3 * data[i][j][1];
        }
        y0[j] = o -= s1 ? s2 / s1 * dx : 0;
        if (o < o0) o0 = o;
      }
      for (j = 0; j < m; ++j) y0[j] -= o0;
      return y0;
    },
    expand: function(data) {
      var n = data.length, m = data[0].length, k = 1 / n, i, j, o, y0 = [];
      for (j = 0; j < m; ++j) {
        for (i = 0, o = 0; i < n; i++) o += data[i][j][1];
        if (o) for (i = 0; i < n; i++) data[i][j][1] /= o; else for (i = 0; i < n; i++) data[i][j][1] = k;
      }
      for (j = 0; j < m; ++j) y0[j] = 0;
      return y0;
    },
    zero: d3_layout_stackOffsetZero
  });
  function d3_layout_stackOrderDefault(data) {
    return d3.range(data.length);
  }
  function d3_layout_stackOffsetZero(data) {
    var j = -1, m = data[0].length, y0 = [];
    while (++j < m) y0[j] = 0;
    return y0;
  }
  function d3_layout_stackMaxIndex(array) {
    var i = 1, j = 0, v = array[0][1], k, n = array.length;
    for (;i < n; ++i) {
      if ((k = array[i][1]) > v) {
        j = i;
        v = k;
      }
    }
    return j;
  }
  function d3_layout_stackReduceSum(d) {
    return d.reduce(d3_layout_stackSum, 0);
  }
  function d3_layout_stackSum(p, d) {
    return p + d[1];
  }
  d3.layout.histogram = function() {
    var frequency = true, valuer = Number, ranger = d3_layout_histogramRange, binner = d3_layout_histogramBinSturges;
    function histogram(data, i) {
      var bins = [], values = data.map(valuer, this), range = ranger.call(this, values, i), thresholds = binner.call(this, range, values, i), bin, i = -1, n = values.length, m = thresholds.length - 1, k = frequency ? 1 : 1 / n, x;
      while (++i < m) {
        bin = bins[i] = [];
        bin.dx = thresholds[i + 1] - (bin.x = thresholds[i]);
        bin.y = 0;
      }
      if (m > 0) {
        i = -1;
        while (++i < n) {
          x = values[i];
          if (x >= range[0] && x <= range[1]) {
            bin = bins[d3.bisect(thresholds, x, 1, m) - 1];
            bin.y += k;
            bin.push(data[i]);
          }
        }
      }
      return bins;
    }
    histogram.value = function(x) {
      if (!arguments.length) return valuer;
      valuer = x;
      return histogram;
    };
    histogram.range = function(x) {
      if (!arguments.length) return ranger;
      ranger = d3_functor(x);
      return histogram;
    };
    histogram.bins = function(x) {
      if (!arguments.length) return binner;
      binner = typeof x === "number" ? function(range) {
        return d3_layout_histogramBinFixed(range, x);
      } : d3_functor(x);
      return histogram;
    };
    histogram.frequency = function(x) {
      if (!arguments.length) return frequency;
      frequency = !!x;
      return histogram;
    };
    return histogram;
  };
  function d3_layout_histogramBinSturges(range, values) {
    return d3_layout_histogramBinFixed(range, Math.ceil(Math.log(values.length) / Math.LN2 + 1));
  }
  function d3_layout_histogramBinFixed(range, n) {
    var x = -1, b = +range[0], m = (range[1] - b) / n, f = [];
    while (++x <= n) f[x] = m * x + b;
    return f;
  }
  function d3_layout_histogramRange(values) {
    return [ d3.min(values), d3.max(values) ];
  }
  d3.layout.pack = function() {
    var hierarchy = d3.layout.hierarchy().sort(d3_layout_packSort), padding = 0, size = [ 1, 1 ], radius;
    function pack(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], w = size[0], h = size[1], r = radius == null ? Math.sqrt : typeof radius === "function" ? radius : function() {
        return radius;
      };
      root.x = root.y = 0;
      d3_layout_hierarchyVisitAfter(root, function(d) {
        d.r = +r(d.value);
      });
      d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
      if (padding) {
        var dr = padding * (radius ? 1 : Math.max(2 * root.r / w, 2 * root.r / h)) / 2;
        d3_layout_hierarchyVisitAfter(root, function(d) {
          d.r += dr;
        });
        d3_layout_hierarchyVisitAfter(root, d3_layout_packSiblings);
        d3_layout_hierarchyVisitAfter(root, function(d) {
          d.r -= dr;
        });
      }
      d3_layout_packTransform(root, w / 2, h / 2, radius ? 1 : 1 / Math.max(2 * root.r / w, 2 * root.r / h));
      return nodes;
    }
    pack.size = function(_) {
      if (!arguments.length) return size;
      size = _;
      return pack;
    };
    pack.radius = function(_) {
      if (!arguments.length) return radius;
      radius = _ == null || typeof _ === "function" ? _ : +_;
      return pack;
    };
    pack.padding = function(_) {
      if (!arguments.length) return padding;
      padding = +_;
      return pack;
    };
    return d3_layout_hierarchyRebind(pack, hierarchy);
  };
  function d3_layout_packSort(a, b) {
    return a.value - b.value;
  }
  function d3_layout_packInsert(a, b) {
    var c = a._pack_next;
    a._pack_next = b;
    b._pack_prev = a;
    b._pack_next = c;
    c._pack_prev = b;
  }
  function d3_layout_packSplice(a, b) {
    a._pack_next = b;
    b._pack_prev = a;
  }
  function d3_layout_packIntersects(a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, dr = a.r + b.r;
    return .999 * dr * dr > dx * dx + dy * dy;
  }
  function d3_layout_packSiblings(node) {
    if (!(nodes = node.children) || !(n = nodes.length)) return;
    var nodes, xMin = Infinity, xMax = -Infinity, yMin = Infinity, yMax = -Infinity, a, b, c, i, j, k, n;
    function bound(node) {
      xMin = Math.min(node.x - node.r, xMin);
      xMax = Math.max(node.x + node.r, xMax);
      yMin = Math.min(node.y - node.r, yMin);
      yMax = Math.max(node.y + node.r, yMax);
    }
    nodes.forEach(d3_layout_packLink);
    a = nodes[0];
    a.x = -a.r;
    a.y = 0;
    bound(a);
    if (n > 1) {
      b = nodes[1];
      b.x = b.r;
      b.y = 0;
      bound(b);
      if (n > 2) {
        c = nodes[2];
        d3_layout_packPlace(a, b, c);
        bound(c);
        d3_layout_packInsert(a, c);
        a._pack_prev = c;
        d3_layout_packInsert(c, b);
        b = a._pack_next;
        for (i = 3; i < n; i++) {
          d3_layout_packPlace(a, b, c = nodes[i]);
          var isect = 0, s1 = 1, s2 = 1;
          for (j = b._pack_next; j !== b; j = j._pack_next, s1++) {
            if (d3_layout_packIntersects(j, c)) {
              isect = 1;
              break;
            }
          }
          if (isect == 1) {
            for (k = a._pack_prev; k !== j._pack_prev; k = k._pack_prev, s2++) {
              if (d3_layout_packIntersects(k, c)) {
                break;
              }
            }
          }
          if (isect) {
            if (s1 < s2 || s1 == s2 && b.r < a.r) d3_layout_packSplice(a, b = j); else d3_layout_packSplice(a = k, b);
            i--;
          } else {
            d3_layout_packInsert(a, c);
            b = c;
            bound(c);
          }
        }
      }
    }
    var cx = (xMin + xMax) / 2, cy = (yMin + yMax) / 2, cr = 0;
    for (i = 0; i < n; i++) {
      c = nodes[i];
      c.x -= cx;
      c.y -= cy;
      cr = Math.max(cr, c.r + Math.sqrt(c.x * c.x + c.y * c.y));
    }
    node.r = cr;
    nodes.forEach(d3_layout_packUnlink);
  }
  function d3_layout_packLink(node) {
    node._pack_next = node._pack_prev = node;
  }
  function d3_layout_packUnlink(node) {
    delete node._pack_next;
    delete node._pack_prev;
  }
  function d3_layout_packTransform(node, x, y, k) {
    var children = node.children;
    node.x = x += k * node.x;
    node.y = y += k * node.y;
    node.r *= k;
    if (children) {
      var i = -1, n = children.length;
      while (++i < n) d3_layout_packTransform(children[i], x, y, k);
    }
  }
  function d3_layout_packPlace(a, b, c) {
    var db = a.r + c.r, dx = b.x - a.x, dy = b.y - a.y;
    if (db && (dx || dy)) {
      var da = b.r + c.r, dc = dx * dx + dy * dy;
      da *= da;
      db *= db;
      var x = .5 + (db - da) / (2 * dc), y = Math.sqrt(Math.max(0, 2 * da * (db + dc) - (db -= dc) * db - da * da)) / (2 * dc);
      c.x = a.x + x * dx + y * dy;
      c.y = a.y + x * dy - y * dx;
    } else {
      c.x = a.x + db;
      c.y = a.y;
    }
  }
  d3.layout.tree = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = null;
    function tree(d, i) {
      var nodes = hierarchy.call(this, d, i), root0 = nodes[0], root1 = wrapTree(root0);
      d3_layout_hierarchyVisitAfter(root1, firstWalk), root1.parent.m = -root1.z;
      d3_layout_hierarchyVisitBefore(root1, secondWalk);
      if (nodeSize) d3_layout_hierarchyVisitBefore(root0, sizeNode); else {
        var left = root0, right = root0, bottom = root0;
        d3_layout_hierarchyVisitBefore(root0, function(node) {
          if (node.x < left.x) left = node;
          if (node.x > right.x) right = node;
          if (node.depth > bottom.depth) bottom = node;
        });
        var tx = separation(left, right) / 2 - left.x, kx = size[0] / (right.x + separation(right, left) / 2 + tx), ky = size[1] / (bottom.depth || 1);
        d3_layout_hierarchyVisitBefore(root0, function(node) {
          node.x = (node.x + tx) * kx;
          node.y = node.depth * ky;
        });
      }
      return nodes;
    }
    function wrapTree(root0) {
      var root1 = {
        A: null,
        children: [ root0 ]
      }, queue = [ root1 ], node1;
      while ((node1 = queue.pop()) != null) {
        for (var children = node1.children, child, i = 0, n = children.length; i < n; ++i) {
          queue.push((children[i] = child = {
            _: children[i],
            parent: node1,
            children: (child = children[i].children) && child.slice() || [],
            A: null,
            a: null,
            z: 0,
            m: 0,
            c: 0,
            s: 0,
            t: null,
            i: i
          }).a = child);
        }
      }
      return root1.children[0];
    }
    function firstWalk(v) {
      var children = v.children, siblings = v.parent.children, w = v.i ? siblings[v.i - 1] : null;
      if (children.length) {
        d3_layout_treeShift(v);
        var midpoint = (children[0].z + children[children.length - 1].z) / 2;
        if (w) {
          v.z = w.z + separation(v._, w._);
          v.m = v.z - midpoint;
        } else {
          v.z = midpoint;
        }
      } else if (w) {
        v.z = w.z + separation(v._, w._);
      }
      v.parent.A = apportion(v, w, v.parent.A || siblings[0]);
    }
    function secondWalk(v) {
      v._.x = v.z + v.parent.m;
      v.m += v.parent.m;
    }
    function apportion(v, w, ancestor) {
      if (w) {
        var vip = v, vop = v, vim = w, vom = vip.parent.children[0], sip = vip.m, sop = vop.m, sim = vim.m, som = vom.m, shift;
        while (vim = d3_layout_treeRight(vim), vip = d3_layout_treeLeft(vip), vim && vip) {
          vom = d3_layout_treeLeft(vom);
          vop = d3_layout_treeRight(vop);
          vop.a = v;
          shift = vim.z + sim - vip.z - sip + separation(vim._, vip._);
          if (shift > 0) {
            d3_layout_treeMove(d3_layout_treeAncestor(vim, v, ancestor), v, shift);
            sip += shift;
            sop += shift;
          }
          sim += vim.m;
          sip += vip.m;
          som += vom.m;
          sop += vop.m;
        }
        if (vim && !d3_layout_treeRight(vop)) {
          vop.t = vim;
          vop.m += sim - sop;
        }
        if (vip && !d3_layout_treeLeft(vom)) {
          vom.t = vip;
          vom.m += sip - som;
          ancestor = v;
        }
      }
      return ancestor;
    }
    function sizeNode(node) {
      node.x *= size[0];
      node.y = node.depth * size[1];
    }
    tree.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return tree;
    };
    tree.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null ? sizeNode : null;
      return tree;
    };
    tree.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) == null ? null : sizeNode;
      return tree;
    };
    return d3_layout_hierarchyRebind(tree, hierarchy);
  };
  function d3_layout_treeSeparation(a, b) {
    return a.parent == b.parent ? 1 : 2;
  }
  function d3_layout_treeLeft(v) {
    var children = v.children;
    return children.length ? children[0] : v.t;
  }
  function d3_layout_treeRight(v) {
    var children = v.children, n;
    return (n = children.length) ? children[n - 1] : v.t;
  }
  function d3_layout_treeMove(wm, wp, shift) {
    var change = shift / (wp.i - wm.i);
    wp.c -= change;
    wp.s += shift;
    wm.c += change;
    wp.z += shift;
    wp.m += shift;
  }
  function d3_layout_treeShift(v) {
    var shift = 0, change = 0, children = v.children, i = children.length, w;
    while (--i >= 0) {
      w = children[i];
      w.z += shift;
      w.m += shift;
      shift += w.s + (change += w.c);
    }
  }
  function d3_layout_treeAncestor(vim, v, ancestor) {
    return vim.a.parent === v.parent ? vim.a : ancestor;
  }
  d3.layout.cluster = function() {
    var hierarchy = d3.layout.hierarchy().sort(null).value(null), separation = d3_layout_treeSeparation, size = [ 1, 1 ], nodeSize = false;
    function cluster(d, i) {
      var nodes = hierarchy.call(this, d, i), root = nodes[0], previousNode, x = 0;
      d3_layout_hierarchyVisitAfter(root, function(node) {
        var children = node.children;
        if (children && children.length) {
          node.x = d3_layout_clusterX(children);
          node.y = d3_layout_clusterY(children);
        } else {
          node.x = previousNode ? x += separation(node, previousNode) : 0;
          node.y = 0;
          previousNode = node;
        }
      });
      var left = d3_layout_clusterLeft(root), right = d3_layout_clusterRight(root), x0 = left.x - separation(left, right) / 2, x1 = right.x + separation(right, left) / 2;
      d3_layout_hierarchyVisitAfter(root, nodeSize ? function(node) {
        node.x = (node.x - root.x) * size[0];
        node.y = (root.y - node.y) * size[1];
      } : function(node) {
        node.x = (node.x - x0) / (x1 - x0) * size[0];
        node.y = (1 - (root.y ? node.y / root.y : 1)) * size[1];
      });
      return nodes;
    }
    cluster.separation = function(x) {
      if (!arguments.length) return separation;
      separation = x;
      return cluster;
    };
    cluster.size = function(x) {
      if (!arguments.length) return nodeSize ? null : size;
      nodeSize = (size = x) == null;
      return cluster;
    };
    cluster.nodeSize = function(x) {
      if (!arguments.length) return nodeSize ? size : null;
      nodeSize = (size = x) != null;
      return cluster;
    };
    return d3_layout_hierarchyRebind(cluster, hierarchy);
  };
  function d3_layout_clusterY(children) {
    return 1 + d3.max(children, function(child) {
      return child.y;
    });
  }
  function d3_layout_clusterX(children) {
    return children.reduce(function(x, child) {
      return x + child.x;
    }, 0) / children.length;
  }
  function d3_layout_clusterLeft(node) {
    var children = node.children;
    return children && children.length ? d3_layout_clusterLeft(children[0]) : node;
  }
  function d3_layout_clusterRight(node) {
    var children = node.children, n;
    return children && (n = children.length) ? d3_layout_clusterRight(children[n - 1]) : node;
  }
  d3.layout.treemap = function() {
    var hierarchy = d3.layout.hierarchy(), round = Math.round, size = [ 1, 1 ], padding = null, pad = d3_layout_treemapPadNull, sticky = false, stickies, mode = "squarify", ratio = .5 * (1 + Math.sqrt(5));
    function scale(children, k) {
      var i = -1, n = children.length, child, area;
      while (++i < n) {
        area = (child = children[i]).value * (k < 0 ? 0 : k);
        child.area = isNaN(area) || area <= 0 ? 0 : area;
      }
    }
    function squarify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), row = [], remaining = children.slice(), child, best = Infinity, score, u = mode === "slice" ? rect.dx : mode === "dice" ? rect.dy : mode === "slice-dice" ? node.depth & 1 ? rect.dy : rect.dx : Math.min(rect.dx, rect.dy), n;
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while ((n = remaining.length) > 0) {
          row.push(child = remaining[n - 1]);
          row.area += child.area;
          if (mode !== "squarify" || (score = worst(row, u)) <= best) {
            remaining.pop();
            best = score;
          } else {
            row.area -= row.pop().area;
            position(row, u, rect, false);
            u = Math.min(rect.dx, rect.dy);
            row.length = row.area = 0;
            best = Infinity;
          }
        }
        if (row.length) {
          position(row, u, rect, true);
          row.length = row.area = 0;
        }
        children.forEach(squarify);
      }
    }
    function stickify(node) {
      var children = node.children;
      if (children && children.length) {
        var rect = pad(node), remaining = children.slice(), child, row = [];
        scale(remaining, rect.dx * rect.dy / node.value);
        row.area = 0;
        while (child = remaining.pop()) {
          row.push(child);
          row.area += child.area;
          if (child.z != null) {
            position(row, child.z ? rect.dx : rect.dy, rect, !remaining.length);
            row.length = row.area = 0;
          }
        }
        children.forEach(stickify);
      }
    }
    function worst(row, u) {
      var s = row.area, r, rmax = 0, rmin = Infinity, i = -1, n = row.length;
      while (++i < n) {
        if (!(r = row[i].area)) continue;
        if (r < rmin) rmin = r;
        if (r > rmax) rmax = r;
      }
      s *= s;
      u *= u;
      return s ? Math.max(u * rmax * ratio / s, s / (u * rmin * ratio)) : Infinity;
    }
    function position(row, u, rect, flush) {
      var i = -1, n = row.length, x = rect.x, y = rect.y, v = u ? round(row.area / u) : 0, o;
      if (u == rect.dx) {
        if (flush || v > rect.dy) v = rect.dy;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dy = v;
          x += o.dx = Math.min(rect.x + rect.dx - x, v ? round(o.area / v) : 0);
        }
        o.z = true;
        o.dx += rect.x + rect.dx - x;
        rect.y += v;
        rect.dy -= v;
      } else {
        if (flush || v > rect.dx) v = rect.dx;
        while (++i < n) {
          o = row[i];
          o.x = x;
          o.y = y;
          o.dx = v;
          y += o.dy = Math.min(rect.y + rect.dy - y, v ? round(o.area / v) : 0);
        }
        o.z = false;
        o.dy += rect.y + rect.dy - y;
        rect.x += v;
        rect.dx -= v;
      }
    }
    function treemap(d) {
      var nodes = stickies || hierarchy(d), root = nodes[0];
      root.x = root.y = 0;
      if (root.value) root.dx = size[0], root.dy = size[1]; else root.dx = root.dy = 0;
      if (stickies) hierarchy.revalue(root);
      scale([ root ], root.dx * root.dy / root.value);
      (stickies ? stickify : squarify)(root);
      if (sticky) stickies = nodes;
      return nodes;
    }
    treemap.size = function(x) {
      if (!arguments.length) return size;
      size = x;
      return treemap;
    };
    treemap.padding = function(x) {
      if (!arguments.length) return padding;
      function padFunction(node) {
        var p = x.call(treemap, node, node.depth);
        return p == null ? d3_layout_treemapPadNull(node) : d3_layout_treemapPad(node, typeof p === "number" ? [ p, p, p, p ] : p);
      }
      function padConstant(node) {
        return d3_layout_treemapPad(node, x);
      }
      var type;
      pad = (padding = x) == null ? d3_layout_treemapPadNull : (type = typeof x) === "function" ? padFunction : type === "number" ? (x = [ x, x, x, x ], 
      padConstant) : padConstant;
      return treemap;
    };
    treemap.round = function(x) {
      if (!arguments.length) return round != Number;
      round = x ? Math.round : Number;
      return treemap;
    };
    treemap.sticky = function(x) {
      if (!arguments.length) return sticky;
      sticky = x;
      stickies = null;
      return treemap;
    };
    treemap.ratio = function(x) {
      if (!arguments.length) return ratio;
      ratio = x;
      return treemap;
    };
    treemap.mode = function(x) {
      if (!arguments.length) return mode;
      mode = x + "";
      return treemap;
    };
    return d3_layout_hierarchyRebind(treemap, hierarchy);
  };
  function d3_layout_treemapPadNull(node) {
    return {
      x: node.x,
      y: node.y,
      dx: node.dx,
      dy: node.dy
    };
  }
  function d3_layout_treemapPad(node, padding) {
    var x = node.x + padding[3], y = node.y + padding[0], dx = node.dx - padding[1] - padding[3], dy = node.dy - padding[0] - padding[2];
    if (dx < 0) {
      x += dx / 2;
      dx = 0;
    }
    if (dy < 0) {
      y += dy / 2;
      dy = 0;
    }
    return {
      x: x,
      y: y,
      dx: dx,
      dy: dy
    };
  }
  d3.random = {
    normal: function(µ, σ) {
      var n = arguments.length;
      if (n < 2) σ = 1;
      if (n < 1) µ = 0;
      return function() {
        var x, y, r;
        do {
          x = Math.random() * 2 - 1;
          y = Math.random() * 2 - 1;
          r = x * x + y * y;
        } while (!r || r > 1);
        return µ + σ * x * Math.sqrt(-2 * Math.log(r) / r);
      };
    },
    logNormal: function() {
      var random = d3.random.normal.apply(d3, arguments);
      return function() {
        return Math.exp(random());
      };
    },
    bates: function(m) {
      var random = d3.random.irwinHall(m);
      return function() {
        return random() / m;
      };
    },
    irwinHall: function(m) {
      return function() {
        for (var s = 0, j = 0; j < m; j++) s += Math.random();
        return s;
      };
    }
  };
  d3.scale = {};
  function d3_scaleExtent(domain) {
    var start = domain[0], stop = domain[domain.length - 1];
    return start < stop ? [ start, stop ] : [ stop, start ];
  }
  function d3_scaleRange(scale) {
    return scale.rangeExtent ? scale.rangeExtent() : d3_scaleExtent(scale.range());
  }
  function d3_scale_bilinear(domain, range, uninterpolate, interpolate) {
    var u = uninterpolate(domain[0], domain[1]), i = interpolate(range[0], range[1]);
    return function(x) {
      return i(u(x));
    };
  }
  function d3_scale_nice(domain, nice) {
    var i0 = 0, i1 = domain.length - 1, x0 = domain[i0], x1 = domain[i1], dx;
    if (x1 < x0) {
      dx = i0, i0 = i1, i1 = dx;
      dx = x0, x0 = x1, x1 = dx;
    }
    domain[i0] = nice.floor(x0);
    domain[i1] = nice.ceil(x1);
    return domain;
  }
  function d3_scale_niceStep(step) {
    return step ? {
      floor: function(x) {
        return Math.floor(x / step) * step;
      },
      ceil: function(x) {
        return Math.ceil(x / step) * step;
      }
    } : d3_scale_niceIdentity;
  }
  var d3_scale_niceIdentity = {
    floor: d3_identity,
    ceil: d3_identity
  };
  function d3_scale_polylinear(domain, range, uninterpolate, interpolate) {
    var u = [], i = [], j = 0, k = Math.min(domain.length, range.length) - 1;
    if (domain[k] < domain[0]) {
      domain = domain.slice().reverse();
      range = range.slice().reverse();
    }
    while (++j <= k) {
      u.push(uninterpolate(domain[j - 1], domain[j]));
      i.push(interpolate(range[j - 1], range[j]));
    }
    return function(x) {
      var j = d3.bisect(domain, x, 1, k) - 1;
      return i[j](u[j](x));
    };
  }
  d3.scale.linear = function() {
    return d3_scale_linear([ 0, 1 ], [ 0, 1 ], d3_interpolate, false);
  };
  function d3_scale_linear(domain, range, interpolate, clamp) {
    var output, input;
    function rescale() {
      var linear = Math.min(domain.length, range.length) > 2 ? d3_scale_polylinear : d3_scale_bilinear, uninterpolate = clamp ? d3_uninterpolateClamp : d3_uninterpolateNumber;
      output = linear(domain, range, uninterpolate, interpolate);
      input = linear(range, domain, uninterpolate, d3_interpolate);
      return scale;
    }
    function scale(x) {
      return output(x);
    }
    scale.invert = function(y) {
      return input(y);
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(Number);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.rangeRound = function(x) {
      return scale.range(x).interpolate(d3_interpolateRound);
    };
    scale.clamp = function(x) {
      if (!arguments.length) return clamp;
      clamp = x;
      return rescale();
    };
    scale.interpolate = function(x) {
      if (!arguments.length) return interpolate;
      interpolate = x;
      return rescale();
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      d3_scale_linearNice(domain, m);
      return rescale();
    };
    scale.copy = function() {
      return d3_scale_linear(domain, range, interpolate, clamp);
    };
    return rescale();
  }
  function d3_scale_linearRebind(scale, linear) {
    return d3.rebind(scale, linear, "range", "rangeRound", "interpolate", "clamp");
  }
  function d3_scale_linearNice(domain, m) {
    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
    d3_scale_nice(domain, d3_scale_niceStep(d3_scale_linearTickRange(domain, m)[2]));
    return domain;
  }
  function d3_scale_linearTickRange(domain, m) {
    if (m == null) m = 10;
    var extent = d3_scaleExtent(domain), span = extent[1] - extent[0], step = Math.pow(10, Math.floor(Math.log(span / m) / Math.LN10)), err = m / span * step;
    if (err <= .15) step *= 10; else if (err <= .35) step *= 5; else if (err <= .75) step *= 2;
    extent[0] = Math.ceil(extent[0] / step) * step;
    extent[1] = Math.floor(extent[1] / step) * step + step * .5;
    extent[2] = step;
    return extent;
  }
  function d3_scale_linearTicks(domain, m) {
    return d3.range.apply(d3, d3_scale_linearTickRange(domain, m));
  }
  function d3_scale_linearTickFormat(domain, m, format) {
    var range = d3_scale_linearTickRange(domain, m);
    if (format) {
      var match = d3_format_re.exec(format);
      match.shift();
      if (match[8] === "s") {
        var prefix = d3.formatPrefix(Math.max(abs(range[0]), abs(range[1])));
        if (!match[7]) match[7] = "." + d3_scale_linearPrecision(prefix.scale(range[2]));
        match[8] = "f";
        format = d3.format(match.join(""));
        return function(d) {
          return format(prefix.scale(d)) + prefix.symbol;
        };
      }
      if (!match[7]) match[7] = "." + d3_scale_linearFormatPrecision(match[8], range);
      format = match.join("");
    } else {
      format = ",." + d3_scale_linearPrecision(range[2]) + "f";
    }
    return d3.format(format);
  }
  var d3_scale_linearFormatSignificant = {
    s: 1,
    g: 1,
    p: 1,
    r: 1,
    e: 1
  };
  function d3_scale_linearPrecision(value) {
    return -Math.floor(Math.log(value) / Math.LN10 + .01);
  }
  function d3_scale_linearFormatPrecision(type, range) {
    var p = d3_scale_linearPrecision(range[2]);
    return type in d3_scale_linearFormatSignificant ? Math.abs(p - d3_scale_linearPrecision(Math.max(abs(range[0]), abs(range[1])))) + +(type !== "e") : p - (type === "%") * 2;
  }
  d3.scale.log = function() {
    return d3_scale_log(d3.scale.linear().domain([ 0, 1 ]), 10, true, [ 1, 10 ]);
  };
  function d3_scale_log(linear, base, positive, domain) {
    function log(x) {
      return (positive ? Math.log(x < 0 ? 0 : x) : -Math.log(x > 0 ? 0 : -x)) / Math.log(base);
    }
    function pow(x) {
      return positive ? Math.pow(base, x) : -Math.pow(base, -x);
    }
    function scale(x) {
      return linear(log(x));
    }
    scale.invert = function(x) {
      return pow(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      positive = x[0] >= 0;
      linear.domain((domain = x.map(Number)).map(log));
      return scale;
    };
    scale.base = function(_) {
      if (!arguments.length) return base;
      base = +_;
      linear.domain(domain.map(log));
      return scale;
    };
    scale.nice = function() {
      var niced = d3_scale_nice(domain.map(log), positive ? Math : d3_scale_logNiceNegative);
      linear.domain(niced);
      domain = niced.map(pow);
      return scale;
    };
    scale.ticks = function() {
      var extent = d3_scaleExtent(domain), ticks = [], u = extent[0], v = extent[1], i = Math.floor(log(u)), j = Math.ceil(log(v)), n = base % 1 ? 2 : base;
      if (isFinite(j - i)) {
        if (positive) {
          for (;i < j; i++) for (var k = 1; k < n; k++) ticks.push(pow(i) * k);
          ticks.push(pow(i));
        } else {
          ticks.push(pow(i));
          for (;i++ < j; ) for (var k = n - 1; k > 0; k--) ticks.push(pow(i) * k);
        }
        for (i = 0; ticks[i] < u; i++) {}
        for (j = ticks.length; ticks[j - 1] > v; j--) {}
        ticks = ticks.slice(i, j);
      }
      return ticks;
    };
    scale.tickFormat = function(n, format) {
      if (!arguments.length) return d3_scale_logFormat;
      if (arguments.length < 2) format = d3_scale_logFormat; else if (typeof format !== "function") format = d3.format(format);
      var k = Math.max(1, base * n / scale.ticks().length);
      return function(d) {
        var i = d / pow(Math.round(log(d)));
        if (i * base < base - .5) i *= base;
        return i <= k ? format(d) : "";
      };
    };
    scale.copy = function() {
      return d3_scale_log(linear.copy(), base, positive, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  var d3_scale_logFormat = d3.format(".0e"), d3_scale_logNiceNegative = {
    floor: function(x) {
      return -Math.ceil(-x);
    },
    ceil: function(x) {
      return -Math.floor(-x);
    }
  };
  d3.scale.pow = function() {
    return d3_scale_pow(d3.scale.linear(), 1, [ 0, 1 ]);
  };
  function d3_scale_pow(linear, exponent, domain) {
    var powp = d3_scale_powPow(exponent), powb = d3_scale_powPow(1 / exponent);
    function scale(x) {
      return linear(powp(x));
    }
    scale.invert = function(x) {
      return powb(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      linear.domain((domain = x.map(Number)).map(powp));
      return scale;
    };
    scale.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    scale.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    scale.nice = function(m) {
      return scale.domain(d3_scale_linearNice(domain, m));
    };
    scale.exponent = function(x) {
      if (!arguments.length) return exponent;
      powp = d3_scale_powPow(exponent = x);
      powb = d3_scale_powPow(1 / exponent);
      linear.domain(domain.map(powp));
      return scale;
    };
    scale.copy = function() {
      return d3_scale_pow(linear.copy(), exponent, domain);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_scale_powPow(e) {
    return function(x) {
      return x < 0 ? -Math.pow(-x, e) : Math.pow(x, e);
    };
  }
  d3.scale.sqrt = function() {
    return d3.scale.pow().exponent(.5);
  };
  d3.scale.ordinal = function() {
    return d3_scale_ordinal([], {
      t: "range",
      a: [ [] ]
    });
  };
  function d3_scale_ordinal(domain, ranger) {
    var index, range, rangeBand;
    function scale(x) {
      return range[((index.get(x) || (ranger.t === "range" ? index.set(x, domain.push(x)) : NaN)) - 1) % range.length];
    }
    function steps(start, step) {
      return d3.range(domain.length).map(function(i) {
        return start + step * i;
      });
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = [];
      index = new d3_Map();
      var i = -1, n = x.length, xi;
      while (++i < n) if (!index.has(xi = x[i])) index.set(xi, domain.push(xi));
      return scale[ranger.t].apply(scale, ranger.a);
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      rangeBand = 0;
      ranger = {
        t: "range",
        a: arguments
      };
      return scale;
    };
    scale.rangePoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = (start + stop) / 2, 
      0) : (stop - start) / (domain.length - 1 + padding);
      range = steps(start + step * padding / 2, step);
      rangeBand = 0;
      ranger = {
        t: "rangePoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundPoints = function(x, padding) {
      if (arguments.length < 2) padding = 0;
      var start = x[0], stop = x[1], step = domain.length < 2 ? (start = stop = Math.round((start + stop) / 2), 
      0) : (stop - start) / (domain.length - 1 + padding) | 0;
      range = steps(start + Math.round(step * padding / 2 + (stop - start - (domain.length - 1 + padding) * step) / 2), step);
      rangeBand = 0;
      ranger = {
        t: "rangeRoundPoints",
        a: arguments
      };
      return scale;
    };
    scale.rangeBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = (stop - start) / (domain.length - padding + 2 * outerPadding);
      range = steps(start + step * outerPadding, step);
      if (reverse) range.reverse();
      rangeBand = step * (1 - padding);
      ranger = {
        t: "rangeBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeRoundBands = function(x, padding, outerPadding) {
      if (arguments.length < 2) padding = 0;
      if (arguments.length < 3) outerPadding = padding;
      var reverse = x[1] < x[0], start = x[reverse - 0], stop = x[1 - reverse], step = Math.floor((stop - start) / (domain.length - padding + 2 * outerPadding));
      range = steps(start + Math.round((stop - start - (domain.length - padding) * step) / 2), step);
      if (reverse) range.reverse();
      rangeBand = Math.round(step * (1 - padding));
      ranger = {
        t: "rangeRoundBands",
        a: arguments
      };
      return scale;
    };
    scale.rangeBand = function() {
      return rangeBand;
    };
    scale.rangeExtent = function() {
      return d3_scaleExtent(ranger.a[0]);
    };
    scale.copy = function() {
      return d3_scale_ordinal(domain, ranger);
    };
    return scale.domain(domain);
  }
  d3.scale.category10 = function() {
    return d3.scale.ordinal().range(d3_category10);
  };
  d3.scale.category20 = function() {
    return d3.scale.ordinal().range(d3_category20);
  };
  d3.scale.category20b = function() {
    return d3.scale.ordinal().range(d3_category20b);
  };
  d3.scale.category20c = function() {
    return d3.scale.ordinal().range(d3_category20c);
  };
  var d3_category10 = [ 2062260, 16744206, 2924588, 14034728, 9725885, 9197131, 14907330, 8355711, 12369186, 1556175 ].map(d3_rgbString);
  var d3_category20 = [ 2062260, 11454440, 16744206, 16759672, 2924588, 10018698, 14034728, 16750742, 9725885, 12955861, 9197131, 12885140, 14907330, 16234194, 8355711, 13092807, 12369186, 14408589, 1556175, 10410725 ].map(d3_rgbString);
  var d3_category20b = [ 3750777, 5395619, 7040719, 10264286, 6519097, 9216594, 11915115, 13556636, 9202993, 12426809, 15186514, 15190932, 8666169, 11356490, 14049643, 15177372, 8077683, 10834324, 13528509, 14589654 ].map(d3_rgbString);
  var d3_category20c = [ 3244733, 7057110, 10406625, 13032431, 15095053, 16616764, 16625259, 16634018, 3253076, 7652470, 10607003, 13101504, 7695281, 10394312, 12369372, 14342891, 6513507, 9868950, 12434877, 14277081 ].map(d3_rgbString);
  d3.scale.quantile = function() {
    return d3_scale_quantile([], []);
  };
  function d3_scale_quantile(domain, range) {
    var thresholds;
    function rescale() {
      var k = 0, q = range.length;
      thresholds = [];
      while (++k < q) thresholds[k - 1] = d3.quantile(domain, k / q);
      return scale;
    }
    function scale(x) {
      if (!isNaN(x = +x)) return range[d3.bisect(thresholds, x)];
    }
    scale.domain = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(d3_number).filter(d3_numeric).sort(d3_ascending);
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.quantiles = function() {
      return thresholds;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return y < 0 ? [ NaN, NaN ] : [ y > 0 ? thresholds[y - 1] : domain[0], y < thresholds.length ? thresholds[y] : domain[domain.length - 1] ];
    };
    scale.copy = function() {
      return d3_scale_quantile(domain, range);
    };
    return rescale();
  }
  d3.scale.quantize = function() {
    return d3_scale_quantize(0, 1, [ 0, 1 ]);
  };
  function d3_scale_quantize(x0, x1, range) {
    var kx, i;
    function scale(x) {
      return range[Math.max(0, Math.min(i, Math.floor(kx * (x - x0))))];
    }
    function rescale() {
      kx = range.length / (x1 - x0);
      i = range.length - 1;
      return scale;
    }
    scale.domain = function(x) {
      if (!arguments.length) return [ x0, x1 ];
      x0 = +x[0];
      x1 = +x[x.length - 1];
      return rescale();
    };
    scale.range = function(x) {
      if (!arguments.length) return range;
      range = x;
      return rescale();
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      y = y < 0 ? NaN : y / kx + x0;
      return [ y, y + 1 / kx ];
    };
    scale.copy = function() {
      return d3_scale_quantize(x0, x1, range);
    };
    return rescale();
  }
  d3.scale.threshold = function() {
    return d3_scale_threshold([ .5 ], [ 0, 1 ]);
  };
  function d3_scale_threshold(domain, range) {
    function scale(x) {
      if (x <= x) return range[d3.bisect(domain, x)];
    }
    scale.domain = function(_) {
      if (!arguments.length) return domain;
      domain = _;
      return scale;
    };
    scale.range = function(_) {
      if (!arguments.length) return range;
      range = _;
      return scale;
    };
    scale.invertExtent = function(y) {
      y = range.indexOf(y);
      return [ domain[y - 1], domain[y] ];
    };
    scale.copy = function() {
      return d3_scale_threshold(domain, range);
    };
    return scale;
  }
  d3.scale.identity = function() {
    return d3_scale_identity([ 0, 1 ]);
  };
  function d3_scale_identity(domain) {
    function identity(x) {
      return +x;
    }
    identity.invert = identity;
    identity.domain = identity.range = function(x) {
      if (!arguments.length) return domain;
      domain = x.map(identity);
      return identity;
    };
    identity.ticks = function(m) {
      return d3_scale_linearTicks(domain, m);
    };
    identity.tickFormat = function(m, format) {
      return d3_scale_linearTickFormat(domain, m, format);
    };
    identity.copy = function() {
      return d3_scale_identity(domain);
    };
    return identity;
  }
  d3.svg = {};
  function d3_zero() {
    return 0;
  }
  d3.svg.arc = function() {
    var innerRadius = d3_svg_arcInnerRadius, outerRadius = d3_svg_arcOuterRadius, cornerRadius = d3_zero, padRadius = d3_svg_arcAuto, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle, padAngle = d3_svg_arcPadAngle;
    function arc() {
      var r0 = Math.max(0, +innerRadius.apply(this, arguments)), r1 = Math.max(0, +outerRadius.apply(this, arguments)), a0 = startAngle.apply(this, arguments) - halfπ, a1 = endAngle.apply(this, arguments) - halfπ, da = Math.abs(a1 - a0), cw = a0 > a1 ? 0 : 1;
      if (r1 < r0) rc = r1, r1 = r0, r0 = rc;
      if (da >= τε) return circleSegment(r1, cw) + (r0 ? circleSegment(r0, 1 - cw) : "") + "Z";
      var rc, cr, rp, ap, p0 = 0, p1 = 0, x0, y0, x1, y1, x2, y2, x3, y3, path = [];
      if (ap = (+padAngle.apply(this, arguments) || 0) / 2) {
        rp = padRadius === d3_svg_arcAuto ? Math.sqrt(r0 * r0 + r1 * r1) : +padRadius.apply(this, arguments);
        if (!cw) p1 *= -1;
        if (r1) p1 = d3_asin(rp / r1 * Math.sin(ap));
        if (r0) p0 = d3_asin(rp / r0 * Math.sin(ap));
      }
      if (r1) {
        x0 = r1 * Math.cos(a0 + p1);
        y0 = r1 * Math.sin(a0 + p1);
        x1 = r1 * Math.cos(a1 - p1);
        y1 = r1 * Math.sin(a1 - p1);
        var l1 = Math.abs(a1 - a0 - 2 * p1) <= π ? 0 : 1;
        if (p1 && d3_svg_arcSweep(x0, y0, x1, y1) === cw ^ l1) {
          var h1 = (a0 + a1) / 2;
          x0 = r1 * Math.cos(h1);
          y0 = r1 * Math.sin(h1);
          x1 = y1 = null;
        }
      } else {
        x0 = y0 = 0;
      }
      if (r0) {
        x2 = r0 * Math.cos(a1 - p0);
        y2 = r0 * Math.sin(a1 - p0);
        x3 = r0 * Math.cos(a0 + p0);
        y3 = r0 * Math.sin(a0 + p0);
        var l0 = Math.abs(a0 - a1 + 2 * p0) <= π ? 0 : 1;
        if (p0 && d3_svg_arcSweep(x2, y2, x3, y3) === 1 - cw ^ l0) {
          var h0 = (a0 + a1) / 2;
          x2 = r0 * Math.cos(h0);
          y2 = r0 * Math.sin(h0);
          x3 = y3 = null;
        }
      } else {
        x2 = y2 = 0;
      }
      if (da > ε && (rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments))) > .001) {
        cr = r0 < r1 ^ cw ? 0 : 1;
        var rc1 = rc, rc0 = rc;
        if (da < π) {
          var oc = x3 == null ? [ x2, y2 ] : x1 == null ? [ x0, y0 ] : d3_geom_polygonIntersect([ x0, y0 ], [ x3, y3 ], [ x1, y1 ], [ x2, y2 ]), ax = x0 - oc[0], ay = y0 - oc[1], bx = x1 - oc[0], by = y1 - oc[1], kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2), lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
          rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
          rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
        }
        if (x1 != null) {
          var t30 = d3_svg_arcCornerTangents(x3 == null ? [ x2, y2 ] : [ x3, y3 ], [ x0, y0 ], r1, rc1, cw), t12 = d3_svg_arcCornerTangents([ x1, y1 ], [ x2, y2 ], r1, rc1, cw);
          if (rc === rc1) {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 0,", cr, " ", t30[1], "A", r1, ",", r1, " 0 ", 1 - cw ^ d3_svg_arcSweep(t30[1][0], t30[1][1], t12[1][0], t12[1][1]), ",", cw, " ", t12[1], "A", rc1, ",", rc1, " 0 0,", cr, " ", t12[0]);
          } else {
            path.push("M", t30[0], "A", rc1, ",", rc1, " 0 1,", cr, " ", t12[0]);
          }
        } else {
          path.push("M", x0, ",", y0);
        }
        if (x3 != null) {
          var t03 = d3_svg_arcCornerTangents([ x0, y0 ], [ x3, y3 ], r0, -rc0, cw), t21 = d3_svg_arcCornerTangents([ x2, y2 ], x1 == null ? [ x0, y0 ] : [ x1, y1 ], r0, -rc0, cw);
          if (rc === rc0) {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t21[1], "A", r0, ",", r0, " 0 ", cw ^ d3_svg_arcSweep(t21[1][0], t21[1][1], t03[1][0], t03[1][1]), ",", 1 - cw, " ", t03[1], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          } else {
            path.push("L", t21[0], "A", rc0, ",", rc0, " 0 0,", cr, " ", t03[0]);
          }
        } else {
          path.push("L", x2, ",", y2);
        }
      } else {
        path.push("M", x0, ",", y0);
        if (x1 != null) path.push("A", r1, ",", r1, " 0 ", l1, ",", cw, " ", x1, ",", y1);
        path.push("L", x2, ",", y2);
        if (x3 != null) path.push("A", r0, ",", r0, " 0 ", l0, ",", 1 - cw, " ", x3, ",", y3);
      }
      path.push("Z");
      return path.join("");
    }
    function circleSegment(r1, cw) {
      return "M0," + r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + -r1 + "A" + r1 + "," + r1 + " 0 1," + cw + " 0," + r1;
    }
    arc.innerRadius = function(v) {
      if (!arguments.length) return innerRadius;
      innerRadius = d3_functor(v);
      return arc;
    };
    arc.outerRadius = function(v) {
      if (!arguments.length) return outerRadius;
      outerRadius = d3_functor(v);
      return arc;
    };
    arc.cornerRadius = function(v) {
      if (!arguments.length) return cornerRadius;
      cornerRadius = d3_functor(v);
      return arc;
    };
    arc.padRadius = function(v) {
      if (!arguments.length) return padRadius;
      padRadius = v == d3_svg_arcAuto ? d3_svg_arcAuto : d3_functor(v);
      return arc;
    };
    arc.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return arc;
    };
    arc.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return arc;
    };
    arc.padAngle = function(v) {
      if (!arguments.length) return padAngle;
      padAngle = d3_functor(v);
      return arc;
    };
    arc.centroid = function() {
      var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2, a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - halfπ;
      return [ Math.cos(a) * r, Math.sin(a) * r ];
    };
    return arc;
  };
  var d3_svg_arcAuto = "auto";
  function d3_svg_arcInnerRadius(d) {
    return d.innerRadius;
  }
  function d3_svg_arcOuterRadius(d) {
    return d.outerRadius;
  }
  function d3_svg_arcStartAngle(d) {
    return d.startAngle;
  }
  function d3_svg_arcEndAngle(d) {
    return d.endAngle;
  }
  function d3_svg_arcPadAngle(d) {
    return d && d.padAngle;
  }
  function d3_svg_arcSweep(x0, y0, x1, y1) {
    return (x0 - x1) * y0 - (y0 - y1) * x0 > 0 ? 0 : 1;
  }
  function d3_svg_arcCornerTangents(p0, p1, r1, rc, cw) {
    var x01 = p0[0] - p1[0], y01 = p0[1] - p1[1], lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01), ox = lo * y01, oy = -lo * x01, x1 = p0[0] + ox, y1 = p0[1] + oy, x2 = p1[0] + ox, y2 = p1[1] + oy, x3 = (x1 + x2) / 2, y3 = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, d2 = dx * dx + dy * dy, r = r1 - rc, D = x1 * y2 - x2 * y1, d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)), cx0 = (D * dy - dx * d) / d2, cy0 = (-D * dx - dy * d) / d2, cx1 = (D * dy + dx * d) / d2, cy1 = (-D * dx + dy * d) / d2, dx0 = cx0 - x3, dy0 = cy0 - y3, dx1 = cx1 - x3, dy1 = cy1 - y3;
    if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;
    return [ [ cx0 - ox, cy0 - oy ], [ cx0 * r1 / r, cy0 * r1 / r ] ];
  }
  function d3_svg_line(projection) {
    var x = d3_geom_pointX, y = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, tension = .7;
    function line(data) {
      var segments = [], points = [], i = -1, n = data.length, d, fx = d3_functor(x), fy = d3_functor(y);
      function segment() {
        segments.push("M", interpolate(projection(points), tension));
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points.push([ +fx.call(this, d, i), +fy.call(this, d, i) ]);
        } else if (points.length) {
          segment();
          points = [];
        }
      }
      if (points.length) segment();
      return segments.length ? segments.join("") : null;
    }
    line.x = function(_) {
      if (!arguments.length) return x;
      x = _;
      return line;
    };
    line.y = function(_) {
      if (!arguments.length) return y;
      y = _;
      return line;
    };
    line.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return line;
    };
    line.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      return line;
    };
    line.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return line;
    };
    return line;
  }
  d3.svg.line = function() {
    return d3_svg_line(d3_identity);
  };
  var d3_svg_lineInterpolators = d3.map({
    linear: d3_svg_lineLinear,
    "linear-closed": d3_svg_lineLinearClosed,
    step: d3_svg_lineStep,
    "step-before": d3_svg_lineStepBefore,
    "step-after": d3_svg_lineStepAfter,
    basis: d3_svg_lineBasis,
    "basis-open": d3_svg_lineBasisOpen,
    "basis-closed": d3_svg_lineBasisClosed,
    bundle: d3_svg_lineBundle,
    cardinal: d3_svg_lineCardinal,
    "cardinal-open": d3_svg_lineCardinalOpen,
    "cardinal-closed": d3_svg_lineCardinalClosed,
    monotone: d3_svg_lineMonotone
  });
  d3_svg_lineInterpolators.forEach(function(key, value) {
    value.key = key;
    value.closed = /-closed$/.test(key);
  });
  function d3_svg_lineLinear(points) {
    return points.length > 1 ? points.join("L") : points + "Z";
  }
  function d3_svg_lineLinearClosed(points) {
    return points.join("L") + "Z";
  }
  function d3_svg_lineStep(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p[0] + (p = points[i])[0]) / 2, "V", p[1]);
    if (n > 1) path.push("H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepBefore(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("V", (p = points[i])[1], "H", p[0]);
    return path.join("");
  }
  function d3_svg_lineStepAfter(points) {
    var i = 0, n = points.length, p = points[0], path = [ p[0], ",", p[1] ];
    while (++i < n) path.push("H", (p = points[i])[0], "V", p[1]);
    return path.join("");
  }
  function d3_svg_lineCardinalOpen(points, tension) {
    return points.length < 4 ? d3_svg_lineLinear(points) : points[1] + d3_svg_lineHermite(points.slice(1, -1), d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineCardinalClosed(points, tension) {
    return points.length < 3 ? d3_svg_lineLinearClosed(points) : points[0] + d3_svg_lineHermite((points.push(points[0]), 
    points), d3_svg_lineCardinalTangents([ points[points.length - 2] ].concat(points, [ points[1] ]), tension));
  }
  function d3_svg_lineCardinal(points, tension) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineCardinalTangents(points, tension));
  }
  function d3_svg_lineHermite(points, tangents) {
    if (tangents.length < 1 || points.length != tangents.length && points.length != tangents.length + 2) {
      return d3_svg_lineLinear(points);
    }
    var quad = points.length != tangents.length, path = "", p0 = points[0], p = points[1], t0 = tangents[0], t = t0, pi = 1;
    if (quad) {
      path += "Q" + (p[0] - t0[0] * 2 / 3) + "," + (p[1] - t0[1] * 2 / 3) + "," + p[0] + "," + p[1];
      p0 = points[1];
      pi = 2;
    }
    if (tangents.length > 1) {
      t = tangents[1];
      p = points[pi];
      pi++;
      path += "C" + (p0[0] + t0[0]) + "," + (p0[1] + t0[1]) + "," + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      for (var i = 2; i < tangents.length; i++, pi++) {
        p = points[pi];
        t = tangents[i];
        path += "S" + (p[0] - t[0]) + "," + (p[1] - t[1]) + "," + p[0] + "," + p[1];
      }
    }
    if (quad) {
      var lp = points[pi];
      path += "Q" + (p[0] + t[0] * 2 / 3) + "," + (p[1] + t[1] * 2 / 3) + "," + lp[0] + "," + lp[1];
    }
    return path;
  }
  function d3_svg_lineCardinalTangents(points, tension) {
    var tangents = [], a = (1 - tension) / 2, p0, p1 = points[0], p2 = points[1], i = 1, n = points.length;
    while (++i < n) {
      p0 = p1;
      p1 = p2;
      p2 = points[i];
      tangents.push([ a * (p2[0] - p0[0]), a * (p2[1] - p0[1]) ]);
    }
    return tangents;
  }
  function d3_svg_lineBasis(points) {
    if (points.length < 3) return d3_svg_lineLinear(points);
    var i = 1, n = points.length, pi = points[0], x0 = pi[0], y0 = pi[1], px = [ x0, x0, x0, (pi = points[1])[0] ], py = [ y0, y0, y0, pi[1] ], path = [ x0, ",", y0, "L", d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    points.push(points[n - 1]);
    while (++i <= n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    points.pop();
    path.push("L", pi);
    return path.join("");
  }
  function d3_svg_lineBasisOpen(points) {
    if (points.length < 4) return d3_svg_lineLinear(points);
    var path = [], i = -1, n = points.length, pi, px = [ 0 ], py = [ 0 ];
    while (++i < 3) {
      pi = points[i];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path.push(d3_svg_lineDot4(d3_svg_lineBasisBezier3, px) + "," + d3_svg_lineDot4(d3_svg_lineBasisBezier3, py));
    --i;
    while (++i < n) {
      pi = points[i];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBasisClosed(points) {
    var path, i = -1, n = points.length, m = n + 4, pi, px = [], py = [];
    while (++i < 4) {
      pi = points[i % n];
      px.push(pi[0]);
      py.push(pi[1]);
    }
    path = [ d3_svg_lineDot4(d3_svg_lineBasisBezier3, px), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, py) ];
    --i;
    while (++i < m) {
      pi = points[i % n];
      px.shift();
      px.push(pi[0]);
      py.shift();
      py.push(pi[1]);
      d3_svg_lineBasisBezier(path, px, py);
    }
    return path.join("");
  }
  function d3_svg_lineBundle(points, tension) {
    var n = points.length - 1;
    if (n) {
      var x0 = points[0][0], y0 = points[0][1], dx = points[n][0] - x0, dy = points[n][1] - y0, i = -1, p, t;
      while (++i <= n) {
        p = points[i];
        t = i / n;
        p[0] = tension * p[0] + (1 - tension) * (x0 + t * dx);
        p[1] = tension * p[1] + (1 - tension) * (y0 + t * dy);
      }
    }
    return d3_svg_lineBasis(points);
  }
  function d3_svg_lineDot4(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  var d3_svg_lineBasisBezier1 = [ 0, 2 / 3, 1 / 3, 0 ], d3_svg_lineBasisBezier2 = [ 0, 1 / 3, 2 / 3, 0 ], d3_svg_lineBasisBezier3 = [ 0, 1 / 6, 2 / 3, 1 / 6 ];
  function d3_svg_lineBasisBezier(path, x, y) {
    path.push("C", d3_svg_lineDot4(d3_svg_lineBasisBezier1, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier1, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier2, y), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, x), ",", d3_svg_lineDot4(d3_svg_lineBasisBezier3, y));
  }
  function d3_svg_lineSlope(p0, p1) {
    return (p1[1] - p0[1]) / (p1[0] - p0[0]);
  }
  function d3_svg_lineFiniteDifferences(points) {
    var i = 0, j = points.length - 1, m = [], p0 = points[0], p1 = points[1], d = m[0] = d3_svg_lineSlope(p0, p1);
    while (++i < j) {
      m[i] = (d + (d = d3_svg_lineSlope(p0 = p1, p1 = points[i + 1]))) / 2;
    }
    m[i] = d;
    return m;
  }
  function d3_svg_lineMonotoneTangents(points) {
    var tangents = [], d, a, b, s, m = d3_svg_lineFiniteDifferences(points), i = -1, j = points.length - 1;
    while (++i < j) {
      d = d3_svg_lineSlope(points[i], points[i + 1]);
      if (abs(d) < ε) {
        m[i] = m[i + 1] = 0;
      } else {
        a = m[i] / d;
        b = m[i + 1] / d;
        s = a * a + b * b;
        if (s > 9) {
          s = d * 3 / Math.sqrt(s);
          m[i] = s * a;
          m[i + 1] = s * b;
        }
      }
    }
    i = -1;
    while (++i <= j) {
      s = (points[Math.min(j, i + 1)][0] - points[Math.max(0, i - 1)][0]) / (6 * (1 + m[i] * m[i]));
      tangents.push([ s || 0, m[i] * s || 0 ]);
    }
    return tangents;
  }
  function d3_svg_lineMonotone(points) {
    return points.length < 3 ? d3_svg_lineLinear(points) : points[0] + d3_svg_lineHermite(points, d3_svg_lineMonotoneTangents(points));
  }
  d3.svg.line.radial = function() {
    var line = d3_svg_line(d3_svg_lineRadial);
    line.radius = line.x, delete line.x;
    line.angle = line.y, delete line.y;
    return line;
  };
  function d3_svg_lineRadial(points) {
    var point, i = -1, n = points.length, r, a;
    while (++i < n) {
      point = points[i];
      r = point[0];
      a = point[1] - halfπ;
      point[0] = r * Math.cos(a);
      point[1] = r * Math.sin(a);
    }
    return points;
  }
  function d3_svg_area(projection) {
    var x0 = d3_geom_pointX, x1 = d3_geom_pointX, y0 = 0, y1 = d3_geom_pointY, defined = d3_true, interpolate = d3_svg_lineLinear, interpolateKey = interpolate.key, interpolateReverse = interpolate, L = "L", tension = .7;
    function area(data) {
      var segments = [], points0 = [], points1 = [], i = -1, n = data.length, d, fx0 = d3_functor(x0), fy0 = d3_functor(y0), fx1 = x0 === x1 ? function() {
        return x;
      } : d3_functor(x1), fy1 = y0 === y1 ? function() {
        return y;
      } : d3_functor(y1), x, y;
      function segment() {
        segments.push("M", interpolate(projection(points1), tension), L, interpolateReverse(projection(points0.reverse()), tension), "Z");
      }
      while (++i < n) {
        if (defined.call(this, d = data[i], i)) {
          points0.push([ x = +fx0.call(this, d, i), y = +fy0.call(this, d, i) ]);
          points1.push([ +fx1.call(this, d, i), +fy1.call(this, d, i) ]);
        } else if (points0.length) {
          segment();
          points0 = [];
          points1 = [];
        }
      }
      if (points0.length) segment();
      return segments.length ? segments.join("") : null;
    }
    area.x = function(_) {
      if (!arguments.length) return x1;
      x0 = x1 = _;
      return area;
    };
    area.x0 = function(_) {
      if (!arguments.length) return x0;
      x0 = _;
      return area;
    };
    area.x1 = function(_) {
      if (!arguments.length) return x1;
      x1 = _;
      return area;
    };
    area.y = function(_) {
      if (!arguments.length) return y1;
      y0 = y1 = _;
      return area;
    };
    area.y0 = function(_) {
      if (!arguments.length) return y0;
      y0 = _;
      return area;
    };
    area.y1 = function(_) {
      if (!arguments.length) return y1;
      y1 = _;
      return area;
    };
    area.defined = function(_) {
      if (!arguments.length) return defined;
      defined = _;
      return area;
    };
    area.interpolate = function(_) {
      if (!arguments.length) return interpolateKey;
      if (typeof _ === "function") interpolateKey = interpolate = _; else interpolateKey = (interpolate = d3_svg_lineInterpolators.get(_) || d3_svg_lineLinear).key;
      interpolateReverse = interpolate.reverse || interpolate;
      L = interpolate.closed ? "M" : "L";
      return area;
    };
    area.tension = function(_) {
      if (!arguments.length) return tension;
      tension = _;
      return area;
    };
    return area;
  }
  d3_svg_lineStepBefore.reverse = d3_svg_lineStepAfter;
  d3_svg_lineStepAfter.reverse = d3_svg_lineStepBefore;
  d3.svg.area = function() {
    return d3_svg_area(d3_identity);
  };
  d3.svg.area.radial = function() {
    var area = d3_svg_area(d3_svg_lineRadial);
    area.radius = area.x, delete area.x;
    area.innerRadius = area.x0, delete area.x0;
    area.outerRadius = area.x1, delete area.x1;
    area.angle = area.y, delete area.y;
    area.startAngle = area.y0, delete area.y0;
    area.endAngle = area.y1, delete area.y1;
    return area;
  };
  d3.svg.chord = function() {
    var source = d3_source, target = d3_target, radius = d3_svg_chordRadius, startAngle = d3_svg_arcStartAngle, endAngle = d3_svg_arcEndAngle;
    function chord(d, i) {
      var s = subgroup(this, source, d, i), t = subgroup(this, target, d, i);
      return "M" + s.p0 + arc(s.r, s.p1, s.a1 - s.a0) + (equals(s, t) ? curve(s.r, s.p1, s.r, s.p0) : curve(s.r, s.p1, t.r, t.p0) + arc(t.r, t.p1, t.a1 - t.a0) + curve(t.r, t.p1, s.r, s.p0)) + "Z";
    }
    function subgroup(self, f, d, i) {
      var subgroup = f.call(self, d, i), r = radius.call(self, subgroup, i), a0 = startAngle.call(self, subgroup, i) - halfπ, a1 = endAngle.call(self, subgroup, i) - halfπ;
      return {
        r: r,
        a0: a0,
        a1: a1,
        p0: [ r * Math.cos(a0), r * Math.sin(a0) ],
        p1: [ r * Math.cos(a1), r * Math.sin(a1) ]
      };
    }
    function equals(a, b) {
      return a.a0 == b.a0 && a.a1 == b.a1;
    }
    function arc(r, p, a) {
      return "A" + r + "," + r + " 0 " + +(a > π) + ",1 " + p;
    }
    function curve(r0, p0, r1, p1) {
      return "Q 0,0 " + p1;
    }
    chord.radius = function(v) {
      if (!arguments.length) return radius;
      radius = d3_functor(v);
      return chord;
    };
    chord.source = function(v) {
      if (!arguments.length) return source;
      source = d3_functor(v);
      return chord;
    };
    chord.target = function(v) {
      if (!arguments.length) return target;
      target = d3_functor(v);
      return chord;
    };
    chord.startAngle = function(v) {
      if (!arguments.length) return startAngle;
      startAngle = d3_functor(v);
      return chord;
    };
    chord.endAngle = function(v) {
      if (!arguments.length) return endAngle;
      endAngle = d3_functor(v);
      return chord;
    };
    return chord;
  };
  function d3_svg_chordRadius(d) {
    return d.radius;
  }
  d3.svg.diagonal = function() {
    var source = d3_source, target = d3_target, projection = d3_svg_diagonalProjection;
    function diagonal(d, i) {
      var p0 = source.call(this, d, i), p3 = target.call(this, d, i), m = (p0.y + p3.y) / 2, p = [ p0, {
        x: p0.x,
        y: m
      }, {
        x: p3.x,
        y: m
      }, p3 ];
      p = p.map(projection);
      return "M" + p[0] + "C" + p[1] + " " + p[2] + " " + p[3];
    }
    diagonal.source = function(x) {
      if (!arguments.length) return source;
      source = d3_functor(x);
      return diagonal;
    };
    diagonal.target = function(x) {
      if (!arguments.length) return target;
      target = d3_functor(x);
      return diagonal;
    };
    diagonal.projection = function(x) {
      if (!arguments.length) return projection;
      projection = x;
      return diagonal;
    };
    return diagonal;
  };
  function d3_svg_diagonalProjection(d) {
    return [ d.x, d.y ];
  }
  d3.svg.diagonal.radial = function() {
    var diagonal = d3.svg.diagonal(), projection = d3_svg_diagonalProjection, projection_ = diagonal.projection;
    diagonal.projection = function(x) {
      return arguments.length ? projection_(d3_svg_diagonalRadialProjection(projection = x)) : projection;
    };
    return diagonal;
  };
  function d3_svg_diagonalRadialProjection(projection) {
    return function() {
      var d = projection.apply(this, arguments), r = d[0], a = d[1] - halfπ;
      return [ r * Math.cos(a), r * Math.sin(a) ];
    };
  }
  d3.svg.symbol = function() {
    var type = d3_svg_symbolType, size = d3_svg_symbolSize;
    function symbol(d, i) {
      return (d3_svg_symbols.get(type.call(this, d, i)) || d3_svg_symbolCircle)(size.call(this, d, i));
    }
    symbol.type = function(x) {
      if (!arguments.length) return type;
      type = d3_functor(x);
      return symbol;
    };
    symbol.size = function(x) {
      if (!arguments.length) return size;
      size = d3_functor(x);
      return symbol;
    };
    return symbol;
  };
  function d3_svg_symbolSize() {
    return 64;
  }
  function d3_svg_symbolType() {
    return "circle";
  }
  function d3_svg_symbolCircle(size) {
    var r = Math.sqrt(size / π);
    return "M0," + r + "A" + r + "," + r + " 0 1,1 0," + -r + "A" + r + "," + r + " 0 1,1 0," + r + "Z";
  }
  var d3_svg_symbols = d3.map({
    circle: d3_svg_symbolCircle,
    cross: function(size) {
      var r = Math.sqrt(size / 5) / 2;
      return "M" + -3 * r + "," + -r + "H" + -r + "V" + -3 * r + "H" + r + "V" + -r + "H" + 3 * r + "V" + r + "H" + r + "V" + 3 * r + "H" + -r + "V" + r + "H" + -3 * r + "Z";
    },
    diamond: function(size) {
      var ry = Math.sqrt(size / (2 * d3_svg_symbolTan30)), rx = ry * d3_svg_symbolTan30;
      return "M0," + -ry + "L" + rx + ",0" + " 0," + ry + " " + -rx + ",0" + "Z";
    },
    square: function(size) {
      var r = Math.sqrt(size) / 2;
      return "M" + -r + "," + -r + "L" + r + "," + -r + " " + r + "," + r + " " + -r + "," + r + "Z";
    },
    "triangle-down": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + ry + "L" + rx + "," + -ry + " " + -rx + "," + -ry + "Z";
    },
    "triangle-up": function(size) {
      var rx = Math.sqrt(size / d3_svg_symbolSqrt3), ry = rx * d3_svg_symbolSqrt3 / 2;
      return "M0," + -ry + "L" + rx + "," + ry + " " + -rx + "," + ry + "Z";
    }
  });
  d3.svg.symbolTypes = d3_svg_symbols.keys();
  var d3_svg_symbolSqrt3 = Math.sqrt(3), d3_svg_symbolTan30 = Math.tan(30 * d3_radians);
  d3_selectionPrototype.transition = function(name) {
    var id = d3_transitionInheritId || ++d3_transitionId, ns = d3_transitionNamespace(name), subgroups = [], subgroup, node, transition = d3_transitionInherit || {
      time: Date.now(),
      ease: d3_ease_cubicInOut,
      delay: 0,
      duration: 250
    };
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) d3_transitionNode(node, i, ns, id, transition);
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_selectionPrototype.interrupt = function(name) {
    return this.each(name == null ? d3_selection_interrupt : d3_selection_interruptNS(d3_transitionNamespace(name)));
  };
  var d3_selection_interrupt = d3_selection_interruptNS(d3_transitionNamespace());
  function d3_selection_interruptNS(ns) {
    return function() {
      var lock, activeId, active;
      if ((lock = this[ns]) && (active = lock[activeId = lock.active])) {
        active.timer.c = null;
        active.timer.t = NaN;
        if (--lock.count) delete lock[activeId]; else delete this[ns];
        lock.active += .5;
        active.event && active.event.interrupt.call(this, this.__data__, active.index);
      }
    };
  }
  function d3_transition(groups, ns, id) {
    d3_subclass(groups, d3_transitionPrototype);
    groups.namespace = ns;
    groups.id = id;
    return groups;
  }
  var d3_transitionPrototype = [], d3_transitionId = 0, d3_transitionInheritId, d3_transitionInherit;
  d3_transitionPrototype.call = d3_selectionPrototype.call;
  d3_transitionPrototype.empty = d3_selectionPrototype.empty;
  d3_transitionPrototype.node = d3_selectionPrototype.node;
  d3_transitionPrototype.size = d3_selectionPrototype.size;
  d3.transition = function(selection, name) {
    return selection && selection.transition ? d3_transitionInheritId ? selection.transition(name) : selection : d3.selection().transition(selection);
  };
  d3.transition.prototype = d3_transitionPrototype;
  d3_transitionPrototype.select = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnode, node;
    selector = d3_selection_selector(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if ((node = group[i]) && (subnode = selector.call(node, node.__data__, i, j))) {
          if ("__data__" in node) subnode.__data__ = node.__data__;
          d3_transitionNode(subnode, i, ns, id, node[ns][id]);
          subgroup.push(subnode);
        } else {
          subgroup.push(null);
        }
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_transitionPrototype.selectAll = function(selector) {
    var id = this.id, ns = this.namespace, subgroups = [], subgroup, subnodes, node, subnode, transition;
    selector = d3_selection_selectorAll(selector);
    for (var j = -1, m = this.length; ++j < m; ) {
      for (var group = this[j], i = -1, n = group.length; ++i < n; ) {
        if (node = group[i]) {
          transition = node[ns][id];
          subnodes = selector.call(node, node.__data__, i, j);
          subgroups.push(subgroup = []);
          for (var k = -1, o = subnodes.length; ++k < o; ) {
            if (subnode = subnodes[k]) d3_transitionNode(subnode, k, ns, id, transition);
            subgroup.push(subnode);
          }
        }
      }
    }
    return d3_transition(subgroups, ns, id);
  };
  d3_transitionPrototype.filter = function(filter) {
    var subgroups = [], subgroup, group, node;
    if (typeof filter !== "function") filter = d3_selection_filter(filter);
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if ((node = group[i]) && filter.call(node, node.__data__, i, j)) {
          subgroup.push(node);
        }
      }
    }
    return d3_transition(subgroups, this.namespace, this.id);
  };
  d3_transitionPrototype.tween = function(name, tween) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) return this.node()[ns][id].tween.get(name);
    return d3_selection_each(this, tween == null ? function(node) {
      node[ns][id].tween.remove(name);
    } : function(node) {
      node[ns][id].tween.set(name, tween);
    });
  };
  function d3_transition_tween(groups, name, value, tween) {
    var id = groups.id, ns = groups.namespace;
    return d3_selection_each(groups, typeof value === "function" ? function(node, i, j) {
      node[ns][id].tween.set(name, tween(value.call(node, node.__data__, i, j)));
    } : (value = tween(value), function(node) {
      node[ns][id].tween.set(name, value);
    }));
  }
  d3_transitionPrototype.attr = function(nameNS, value) {
    if (arguments.length < 2) {
      for (value in nameNS) this.attr(value, nameNS[value]);
      return this;
    }
    var interpolate = nameNS == "transform" ? d3_interpolateTransform : d3_interpolate, name = d3.ns.qualify(nameNS);
    function attrNull() {
      this.removeAttribute(name);
    }
    function attrNullNS() {
      this.removeAttributeNS(name.space, name.local);
    }
    function attrTween(b) {
      return b == null ? attrNull : (b += "", function() {
        var a = this.getAttribute(name), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttribute(name, i(t));
        });
      });
    }
    function attrTweenNS(b) {
      return b == null ? attrNullNS : (b += "", function() {
        var a = this.getAttributeNS(name.space, name.local), i;
        return a !== b && (i = interpolate(a, b), function(t) {
          this.setAttributeNS(name.space, name.local, i(t));
        });
      });
    }
    return d3_transition_tween(this, "attr." + nameNS, value, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.attrTween = function(nameNS, tween) {
    var name = d3.ns.qualify(nameNS);
    function attrTween(d, i) {
      var f = tween.call(this, d, i, this.getAttribute(name));
      return f && function(t) {
        this.setAttribute(name, f(t));
      };
    }
    function attrTweenNS(d, i) {
      var f = tween.call(this, d, i, this.getAttributeNS(name.space, name.local));
      return f && function(t) {
        this.setAttributeNS(name.space, name.local, f(t));
      };
    }
    return this.tween("attr." + nameNS, name.local ? attrTweenNS : attrTween);
  };
  d3_transitionPrototype.style = function(name, value, priority) {
    var n = arguments.length;
    if (n < 3) {
      if (typeof name !== "string") {
        if (n < 2) value = "";
        for (priority in name) this.style(priority, name[priority], value);
        return this;
      }
      priority = "";
    }
    function styleNull() {
      this.style.removeProperty(name);
    }
    function styleString(b) {
      return b == null ? styleNull : (b += "", function() {
        var a = d3_window(this).getComputedStyle(this, null).getPropertyValue(name), i;
        return a !== b && (i = d3_interpolate(a, b), function(t) {
          this.style.setProperty(name, i(t), priority);
        });
      });
    }
    return d3_transition_tween(this, "style." + name, value, styleString);
  };
  d3_transitionPrototype.styleTween = function(name, tween, priority) {
    if (arguments.length < 3) priority = "";
    function styleTween(d, i) {
      var f = tween.call(this, d, i, d3_window(this).getComputedStyle(this, null).getPropertyValue(name));
      return f && function(t) {
        this.style.setProperty(name, f(t), priority);
      };
    }
    return this.tween("style." + name, styleTween);
  };
  d3_transitionPrototype.text = function(value) {
    return d3_transition_tween(this, "text", value, d3_transition_text);
  };
  function d3_transition_text(b) {
    if (b == null) b = "";
    return function() {
      this.textContent = b;
    };
  }
  d3_transitionPrototype.remove = function() {
    var ns = this.namespace;
    return this.each("end.transition", function() {
      var p;
      if (this[ns].count < 2 && (p = this.parentNode)) p.removeChild(this);
    });
  };
  d3_transitionPrototype.ease = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].ease;
    if (typeof value !== "function") value = d3.ease.apply(d3, arguments);
    return d3_selection_each(this, function(node) {
      node[ns][id].ease = value;
    });
  };
  d3_transitionPrototype.delay = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].delay;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].delay = +value.call(node, node.__data__, i, j);
    } : (value = +value, function(node) {
      node[ns][id].delay = value;
    }));
  };
  d3_transitionPrototype.duration = function(value) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 1) return this.node()[ns][id].duration;
    return d3_selection_each(this, typeof value === "function" ? function(node, i, j) {
      node[ns][id].duration = Math.max(1, value.call(node, node.__data__, i, j));
    } : (value = Math.max(1, value), function(node) {
      node[ns][id].duration = value;
    }));
  };
  d3_transitionPrototype.each = function(type, listener) {
    var id = this.id, ns = this.namespace;
    if (arguments.length < 2) {
      var inherit = d3_transitionInherit, inheritId = d3_transitionInheritId;
      try {
        d3_transitionInheritId = id;
        d3_selection_each(this, function(node, i, j) {
          d3_transitionInherit = node[ns][id];
          type.call(node, node.__data__, i, j);
        });
      } finally {
        d3_transitionInherit = inherit;
        d3_transitionInheritId = inheritId;
      }
    } else {
      d3_selection_each(this, function(node) {
        var transition = node[ns][id];
        (transition.event || (transition.event = d3.dispatch("start", "end", "interrupt"))).on(type, listener);
      });
    }
    return this;
  };
  d3_transitionPrototype.transition = function() {
    var id0 = this.id, id1 = ++d3_transitionId, ns = this.namespace, subgroups = [], subgroup, group, node, transition;
    for (var j = 0, m = this.length; j < m; j++) {
      subgroups.push(subgroup = []);
      for (var group = this[j], i = 0, n = group.length; i < n; i++) {
        if (node = group[i]) {
          transition = node[ns][id0];
          d3_transitionNode(node, i, ns, id1, {
            time: transition.time,
            ease: transition.ease,
            delay: transition.delay + transition.duration,
            duration: transition.duration
          });
        }
        subgroup.push(node);
      }
    }
    return d3_transition(subgroups, ns, id1);
  };
  function d3_transitionNamespace(name) {
    return name == null ? "__transition__" : "__transition_" + name + "__";
  }
  function d3_transitionNode(node, i, ns, id, inherit) {
    var lock = node[ns] || (node[ns] = {
      active: 0,
      count: 0
    }), transition = lock[id], time, timer, duration, ease, tweens;
    function schedule(elapsed) {
      var delay = transition.delay;
      timer.t = delay + time;
      if (delay <= elapsed) return start(elapsed - delay);
      timer.c = start;
    }
    function start(elapsed) {
      var activeId = lock.active, active = lock[activeId];
      if (active) {
        active.timer.c = null;
        active.timer.t = NaN;
        --lock.count;
        delete lock[activeId];
        active.event && active.event.interrupt.call(node, node.__data__, active.index);
      }
      for (var cancelId in lock) {
        if (+cancelId < id) {
          var cancel = lock[cancelId];
          cancel.timer.c = null;
          cancel.timer.t = NaN;
          --lock.count;
          delete lock[cancelId];
        }
      }
      timer.c = tick;
      d3_timer(function() {
        if (timer.c && tick(elapsed || 1)) {
          timer.c = null;
          timer.t = NaN;
        }
        return 1;
      }, 0, time);
      lock.active = id;
      transition.event && transition.event.start.call(node, node.__data__, i);
      tweens = [];
      transition.tween.forEach(function(key, value) {
        if (value = value.call(node, node.__data__, i)) {
          tweens.push(value);
        }
      });
      ease = transition.ease;
      duration = transition.duration;
    }
    function tick(elapsed) {
      var t = elapsed / duration, e = ease(t), n = tweens.length;
      while (n > 0) {
        tweens[--n].call(node, e);
      }
      if (t >= 1) {
        transition.event && transition.event.end.call(node, node.__data__, i);
        if (--lock.count) delete lock[id]; else delete node[ns];
        return 1;
      }
    }
    if (!transition) {
      time = inherit.time;
      timer = d3_timer(schedule, 0, time);
      transition = lock[id] = {
        tween: new d3_Map(),
        time: time,
        timer: timer,
        delay: inherit.delay,
        duration: inherit.duration,
        ease: inherit.ease,
        index: i
      };
      inherit = null;
      ++lock.count;
    }
  }
  d3.svg.axis = function() {
    var scale = d3.scale.linear(), orient = d3_svg_axisDefaultOrient, innerTickSize = 6, outerTickSize = 6, tickPadding = 3, tickArguments_ = [ 10 ], tickValues = null, tickFormat_;
    function axis(g) {
      g.each(function() {
        var g = d3.select(this);
        var scale0 = this.__chart__ || scale, scale1 = this.__chart__ = scale.copy();
        var ticks = tickValues == null ? scale1.ticks ? scale1.ticks.apply(scale1, tickArguments_) : scale1.domain() : tickValues, tickFormat = tickFormat_ == null ? scale1.tickFormat ? scale1.tickFormat.apply(scale1, tickArguments_) : d3_identity : tickFormat_, tick = g.selectAll(".tick").data(ticks, scale1), tickEnter = tick.enter().insert("g", ".domain").attr("class", "tick").style("opacity", ε), tickExit = d3.transition(tick.exit()).style("opacity", ε).remove(), tickUpdate = d3.transition(tick.order()).style("opacity", 1), tickSpacing = Math.max(innerTickSize, 0) + tickPadding, tickTransform;
        var range = d3_scaleRange(scale1), path = g.selectAll(".domain").data([ 0 ]), pathUpdate = (path.enter().append("path").attr("class", "domain"), 
        d3.transition(path));
        tickEnter.append("line");
        tickEnter.append("text");
        var lineEnter = tickEnter.select("line"), lineUpdate = tickUpdate.select("line"), text = tick.select("text").text(tickFormat), textEnter = tickEnter.select("text"), textUpdate = tickUpdate.select("text"), sign = orient === "top" || orient === "left" ? -1 : 1, x1, x2, y1, y2;
        if (orient === "bottom" || orient === "top") {
          tickTransform = d3_svg_axisX, x1 = "x", y1 = "y", x2 = "x2", y2 = "y2";
          text.attr("dy", sign < 0 ? "0em" : ".71em").style("text-anchor", "middle");
          pathUpdate.attr("d", "M" + range[0] + "," + sign * outerTickSize + "V0H" + range[1] + "V" + sign * outerTickSize);
        } else {
          tickTransform = d3_svg_axisY, x1 = "y", y1 = "x", x2 = "y2", y2 = "x2";
          text.attr("dy", ".32em").style("text-anchor", sign < 0 ? "end" : "start");
          pathUpdate.attr("d", "M" + sign * outerTickSize + "," + range[0] + "H0V" + range[1] + "H" + sign * outerTickSize);
        }
        lineEnter.attr(y2, sign * innerTickSize);
        textEnter.attr(y1, sign * tickSpacing);
        lineUpdate.attr(x2, 0).attr(y2, sign * innerTickSize);
        textUpdate.attr(x1, 0).attr(y1, sign * tickSpacing);
        if (scale1.rangeBand) {
          var x = scale1, dx = x.rangeBand() / 2;
          scale0 = scale1 = function(d) {
            return x(d) + dx;
          };
        } else if (scale0.rangeBand) {
          scale0 = scale1;
        } else {
          tickExit.call(tickTransform, scale1, scale0);
        }
        tickEnter.call(tickTransform, scale0, scale1);
        tickUpdate.call(tickTransform, scale1, scale1);
      });
    }
    axis.scale = function(x) {
      if (!arguments.length) return scale;
      scale = x;
      return axis;
    };
    axis.orient = function(x) {
      if (!arguments.length) return orient;
      orient = x in d3_svg_axisOrients ? x + "" : d3_svg_axisDefaultOrient;
      return axis;
    };
    axis.ticks = function() {
      if (!arguments.length) return tickArguments_;
      tickArguments_ = d3_array(arguments);
      return axis;
    };
    axis.tickValues = function(x) {
      if (!arguments.length) return tickValues;
      tickValues = x;
      return axis;
    };
    axis.tickFormat = function(x) {
      if (!arguments.length) return tickFormat_;
      tickFormat_ = x;
      return axis;
    };
    axis.tickSize = function(x) {
      var n = arguments.length;
      if (!n) return innerTickSize;
      innerTickSize = +x;
      outerTickSize = +arguments[n - 1];
      return axis;
    };
    axis.innerTickSize = function(x) {
      if (!arguments.length) return innerTickSize;
      innerTickSize = +x;
      return axis;
    };
    axis.outerTickSize = function(x) {
      if (!arguments.length) return outerTickSize;
      outerTickSize = +x;
      return axis;
    };
    axis.tickPadding = function(x) {
      if (!arguments.length) return tickPadding;
      tickPadding = +x;
      return axis;
    };
    axis.tickSubdivide = function() {
      return arguments.length && axis;
    };
    return axis;
  };
  var d3_svg_axisDefaultOrient = "bottom", d3_svg_axisOrients = {
    top: 1,
    right: 1,
    bottom: 1,
    left: 1
  };
  function d3_svg_axisX(selection, x0, x1) {
    selection.attr("transform", function(d) {
      var v0 = x0(d);
      return "translate(" + (isFinite(v0) ? v0 : x1(d)) + ",0)";
    });
  }
  function d3_svg_axisY(selection, y0, y1) {
    selection.attr("transform", function(d) {
      var v0 = y0(d);
      return "translate(0," + (isFinite(v0) ? v0 : y1(d)) + ")";
    });
  }
  d3.svg.brush = function() {
    var event = d3_eventDispatch(brush, "brushstart", "brush", "brushend"), x = null, y = null, xExtent = [ 0, 0 ], yExtent = [ 0, 0 ], xExtentDomain, yExtentDomain, xClamp = true, yClamp = true, resizes = d3_svg_brushResizes[0];
    function brush(g) {
      g.each(function() {
        var g = d3.select(this).style("pointer-events", "all").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)").on("mousedown.brush", brushstart).on("touchstart.brush", brushstart);
        var background = g.selectAll(".background").data([ 0 ]);
        background.enter().append("rect").attr("class", "background").style("visibility", "hidden").style("cursor", "crosshair");
        g.selectAll(".extent").data([ 0 ]).enter().append("rect").attr("class", "extent").style("cursor", "move");
        var resize = g.selectAll(".resize").data(resizes, d3_identity);
        resize.exit().remove();
        resize.enter().append("g").attr("class", function(d) {
          return "resize " + d;
        }).style("cursor", function(d) {
          return d3_svg_brushCursor[d];
        }).append("rect").attr("x", function(d) {
          return /[ew]$/.test(d) ? -3 : null;
        }).attr("y", function(d) {
          return /^[ns]/.test(d) ? -3 : null;
        }).attr("width", 6).attr("height", 6).style("visibility", "hidden");
        resize.style("display", brush.empty() ? "none" : null);
        var gUpdate = d3.transition(g), backgroundUpdate = d3.transition(background), range;
        if (x) {
          range = d3_scaleRange(x);
          backgroundUpdate.attr("x", range[0]).attr("width", range[1] - range[0]);
          redrawX(gUpdate);
        }
        if (y) {
          range = d3_scaleRange(y);
          backgroundUpdate.attr("y", range[0]).attr("height", range[1] - range[0]);
          redrawY(gUpdate);
        }
        redraw(gUpdate);
      });
    }
    brush.event = function(g) {
      g.each(function() {
        var event_ = event.of(this, arguments), extent1 = {
          x: xExtent,
          y: yExtent,
          i: xExtentDomain,
          j: yExtentDomain
        }, extent0 = this.__chart__ || extent1;
        this.__chart__ = extent1;
        if (d3_transitionInheritId) {
          d3.select(this).transition().each("start.brush", function() {
            xExtentDomain = extent0.i;
            yExtentDomain = extent0.j;
            xExtent = extent0.x;
            yExtent = extent0.y;
            event_({
              type: "brushstart"
            });
          }).tween("brush:brush", function() {
            var xi = d3_interpolateArray(xExtent, extent1.x), yi = d3_interpolateArray(yExtent, extent1.y);
            xExtentDomain = yExtentDomain = null;
            return function(t) {
              xExtent = extent1.x = xi(t);
              yExtent = extent1.y = yi(t);
              event_({
                type: "brush",
                mode: "resize"
              });
            };
          }).each("end.brush", function() {
            xExtentDomain = extent1.i;
            yExtentDomain = extent1.j;
            event_({
              type: "brush",
              mode: "resize"
            });
            event_({
              type: "brushend"
            });
          });
        } else {
          event_({
            type: "brushstart"
          });
          event_({
            type: "brush",
            mode: "resize"
          });
          event_({
            type: "brushend"
          });
        }
      });
    };
    function redraw(g) {
      g.selectAll(".resize").attr("transform", function(d) {
        return "translate(" + xExtent[+/e$/.test(d)] + "," + yExtent[+/^s/.test(d)] + ")";
      });
    }
    function redrawX(g) {
      g.select(".extent").attr("x", xExtent[0]);
      g.selectAll(".extent,.n>rect,.s>rect").attr("width", xExtent[1] - xExtent[0]);
    }
    function redrawY(g) {
      g.select(".extent").attr("y", yExtent[0]);
      g.selectAll(".extent,.e>rect,.w>rect").attr("height", yExtent[1] - yExtent[0]);
    }
    function brushstart() {
      var target = this, eventTarget = d3.select(d3.event.target), event_ = event.of(target, arguments), g = d3.select(target), resizing = eventTarget.datum(), resizingX = !/^(n|s)$/.test(resizing) && x, resizingY = !/^(e|w)$/.test(resizing) && y, dragging = eventTarget.classed("extent"), dragRestore = d3_event_dragSuppress(target), center, origin = d3.mouse(target), offset;
      var w = d3.select(d3_window(target)).on("keydown.brush", keydown).on("keyup.brush", keyup);
      if (d3.event.changedTouches) {
        w.on("touchmove.brush", brushmove).on("touchend.brush", brushend);
      } else {
        w.on("mousemove.brush", brushmove).on("mouseup.brush", brushend);
      }
      g.interrupt().selectAll("*").interrupt();
      if (dragging) {
        origin[0] = xExtent[0] - origin[0];
        origin[1] = yExtent[0] - origin[1];
      } else if (resizing) {
        var ex = +/w$/.test(resizing), ey = +/^n/.test(resizing);
        offset = [ xExtent[1 - ex] - origin[0], yExtent[1 - ey] - origin[1] ];
        origin[0] = xExtent[ex];
        origin[1] = yExtent[ey];
      } else if (d3.event.altKey) center = origin.slice();
      g.style("pointer-events", "none").selectAll(".resize").style("display", null);
      d3.select("body").style("cursor", eventTarget.style("cursor"));
      event_({
        type: "brushstart"
      });
      brushmove();
      function keydown() {
        if (d3.event.keyCode == 32) {
          if (!dragging) {
            center = null;
            origin[0] -= xExtent[1];
            origin[1] -= yExtent[1];
            dragging = 2;
          }
          d3_eventPreventDefault();
        }
      }
      function keyup() {
        if (d3.event.keyCode == 32 && dragging == 2) {
          origin[0] += xExtent[1];
          origin[1] += yExtent[1];
          dragging = 0;
          d3_eventPreventDefault();
        }
      }
      function brushmove() {
        var point = d3.mouse(target), moved = false;
        if (offset) {
          point[0] += offset[0];
          point[1] += offset[1];
        }
        if (!dragging) {
          if (d3.event.altKey) {
            if (!center) center = [ (xExtent[0] + xExtent[1]) / 2, (yExtent[0] + yExtent[1]) / 2 ];
            origin[0] = xExtent[+(point[0] < center[0])];
            origin[1] = yExtent[+(point[1] < center[1])];
          } else center = null;
        }
        if (resizingX && move1(point, x, 0)) {
          redrawX(g);
          moved = true;
        }
        if (resizingY && move1(point, y, 1)) {
          redrawY(g);
          moved = true;
        }
        if (moved) {
          redraw(g);
          event_({
            type: "brush",
            mode: dragging ? "move" : "resize"
          });
        }
      }
      function move1(point, scale, i) {
        var range = d3_scaleRange(scale), r0 = range[0], r1 = range[1], position = origin[i], extent = i ? yExtent : xExtent, size = extent[1] - extent[0], min, max;
        if (dragging) {
          r0 -= position;
          r1 -= size + position;
        }
        min = (i ? yClamp : xClamp) ? Math.max(r0, Math.min(r1, point[i])) : point[i];
        if (dragging) {
          max = (min += position) + size;
        } else {
          if (center) position = Math.max(r0, Math.min(r1, 2 * center[i] - min));
          if (position < min) {
            max = min;
            min = position;
          } else {
            max = position;
          }
        }
        if (extent[0] != min || extent[1] != max) {
          if (i) yExtentDomain = null; else xExtentDomain = null;
          extent[0] = min;
          extent[1] = max;
          return true;
        }
      }
      function brushend() {
        brushmove();
        g.style("pointer-events", "all").selectAll(".resize").style("display", brush.empty() ? "none" : null);
        d3.select("body").style("cursor", null);
        w.on("mousemove.brush", null).on("mouseup.brush", null).on("touchmove.brush", null).on("touchend.brush", null).on("keydown.brush", null).on("keyup.brush", null);
        dragRestore();
        event_({
          type: "brushend"
        });
      }
    }
    brush.x = function(z) {
      if (!arguments.length) return x;
      x = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.y = function(z) {
      if (!arguments.length) return y;
      y = z;
      resizes = d3_svg_brushResizes[!x << 1 | !y];
      return brush;
    };
    brush.clamp = function(z) {
      if (!arguments.length) return x && y ? [ xClamp, yClamp ] : x ? xClamp : y ? yClamp : null;
      if (x && y) xClamp = !!z[0], yClamp = !!z[1]; else if (x) xClamp = !!z; else if (y) yClamp = !!z;
      return brush;
    };
    brush.extent = function(z) {
      var x0, x1, y0, y1, t;
      if (!arguments.length) {
        if (x) {
          if (xExtentDomain) {
            x0 = xExtentDomain[0], x1 = xExtentDomain[1];
          } else {
            x0 = xExtent[0], x1 = xExtent[1];
            if (x.invert) x0 = x.invert(x0), x1 = x.invert(x1);
            if (x1 < x0) t = x0, x0 = x1, x1 = t;
          }
        }
        if (y) {
          if (yExtentDomain) {
            y0 = yExtentDomain[0], y1 = yExtentDomain[1];
          } else {
            y0 = yExtent[0], y1 = yExtent[1];
            if (y.invert) y0 = y.invert(y0), y1 = y.invert(y1);
            if (y1 < y0) t = y0, y0 = y1, y1 = t;
          }
        }
        return x && y ? [ [ x0, y0 ], [ x1, y1 ] ] : x ? [ x0, x1 ] : y && [ y0, y1 ];
      }
      if (x) {
        x0 = z[0], x1 = z[1];
        if (y) x0 = x0[0], x1 = x1[0];
        xExtentDomain = [ x0, x1 ];
        if (x.invert) x0 = x(x0), x1 = x(x1);
        if (x1 < x0) t = x0, x0 = x1, x1 = t;
        if (x0 != xExtent[0] || x1 != xExtent[1]) xExtent = [ x0, x1 ];
      }
      if (y) {
        y0 = z[0], y1 = z[1];
        if (x) y0 = y0[1], y1 = y1[1];
        yExtentDomain = [ y0, y1 ];
        if (y.invert) y0 = y(y0), y1 = y(y1);
        if (y1 < y0) t = y0, y0 = y1, y1 = t;
        if (y0 != yExtent[0] || y1 != yExtent[1]) yExtent = [ y0, y1 ];
      }
      return brush;
    };
    brush.clear = function() {
      if (!brush.empty()) {
        xExtent = [ 0, 0 ], yExtent = [ 0, 0 ];
        xExtentDomain = yExtentDomain = null;
      }
      return brush;
    };
    brush.empty = function() {
      return !!x && xExtent[0] == xExtent[1] || !!y && yExtent[0] == yExtent[1];
    };
    return d3.rebind(brush, event, "on");
  };
  var d3_svg_brushCursor = {
    n: "ns-resize",
    e: "ew-resize",
    s: "ns-resize",
    w: "ew-resize",
    nw: "nwse-resize",
    ne: "nesw-resize",
    se: "nwse-resize",
    sw: "nesw-resize"
  };
  var d3_svg_brushResizes = [ [ "n", "e", "s", "w", "nw", "ne", "se", "sw" ], [ "e", "w" ], [ "n", "s" ], [] ];
  var d3_time_format = d3_time.format = d3_locale_enUS.timeFormat;
  var d3_time_formatUtc = d3_time_format.utc;
  var d3_time_formatIso = d3_time_formatUtc("%Y-%m-%dT%H:%M:%S.%LZ");
  d3_time_format.iso = Date.prototype.toISOString && +new Date("2000-01-01T00:00:00.000Z") ? d3_time_formatIsoNative : d3_time_formatIso;
  function d3_time_formatIsoNative(date) {
    return date.toISOString();
  }
  d3_time_formatIsoNative.parse = function(string) {
    var date = new Date(string);
    return isNaN(date) ? null : date;
  };
  d3_time_formatIsoNative.toString = d3_time_formatIso.toString;
  d3_time.second = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 1e3) * 1e3);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 1e3);
  }, function(date) {
    return date.getSeconds();
  });
  d3_time.seconds = d3_time.second.range;
  d3_time.seconds.utc = d3_time.second.utc.range;
  d3_time.minute = d3_time_interval(function(date) {
    return new d3_date(Math.floor(date / 6e4) * 6e4);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 6e4);
  }, function(date) {
    return date.getMinutes();
  });
  d3_time.minutes = d3_time.minute.range;
  d3_time.minutes.utc = d3_time.minute.utc.range;
  d3_time.hour = d3_time_interval(function(date) {
    var timezone = date.getTimezoneOffset() / 60;
    return new d3_date((Math.floor(date / 36e5 - timezone) + timezone) * 36e5);
  }, function(date, offset) {
    date.setTime(date.getTime() + Math.floor(offset) * 36e5);
  }, function(date) {
    return date.getHours();
  });
  d3_time.hours = d3_time.hour.range;
  d3_time.hours.utc = d3_time.hour.utc.range;
  d3_time.month = d3_time_interval(function(date) {
    date = d3_time.day(date);
    date.setDate(1);
    return date;
  }, function(date, offset) {
    date.setMonth(date.getMonth() + offset);
  }, function(date) {
    return date.getMonth();
  });
  d3_time.months = d3_time.month.range;
  d3_time.months.utc = d3_time.month.utc.range;
  function d3_time_scale(linear, methods, format) {
    function scale(x) {
      return linear(x);
    }
    scale.invert = function(x) {
      return d3_time_scaleDate(linear.invert(x));
    };
    scale.domain = function(x) {
      if (!arguments.length) return linear.domain().map(d3_time_scaleDate);
      linear.domain(x);
      return scale;
    };
    function tickMethod(extent, count) {
      var span = extent[1] - extent[0], target = span / count, i = d3.bisect(d3_time_scaleSteps, target);
      return i == d3_time_scaleSteps.length ? [ methods.year, d3_scale_linearTickRange(extent.map(function(d) {
        return d / 31536e6;
      }), count)[2] ] : !i ? [ d3_time_scaleMilliseconds, d3_scale_linearTickRange(extent, count)[2] ] : methods[target / d3_time_scaleSteps[i - 1] < d3_time_scaleSteps[i] / target ? i - 1 : i];
    }
    scale.nice = function(interval, skip) {
      var domain = scale.domain(), extent = d3_scaleExtent(domain), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" && tickMethod(extent, interval);
      if (method) interval = method[0], skip = method[1];
      function skipped(date) {
        return !isNaN(date) && !interval.range(date, d3_time_scaleDate(+date + 1), skip).length;
      }
      return scale.domain(d3_scale_nice(domain, skip > 1 ? {
        floor: function(date) {
          while (skipped(date = interval.floor(date))) date = d3_time_scaleDate(date - 1);
          return date;
        },
        ceil: function(date) {
          while (skipped(date = interval.ceil(date))) date = d3_time_scaleDate(+date + 1);
          return date;
        }
      } : interval));
    };
    scale.ticks = function(interval, skip) {
      var extent = d3_scaleExtent(scale.domain()), method = interval == null ? tickMethod(extent, 10) : typeof interval === "number" ? tickMethod(extent, interval) : !interval.range && [ {
        range: interval
      }, skip ];
      if (method) interval = method[0], skip = method[1];
      return interval.range(extent[0], d3_time_scaleDate(+extent[1] + 1), skip < 1 ? 1 : skip);
    };
    scale.tickFormat = function() {
      return format;
    };
    scale.copy = function() {
      return d3_time_scale(linear.copy(), methods, format);
    };
    return d3_scale_linearRebind(scale, linear);
  }
  function d3_time_scaleDate(t) {
    return new Date(t);
  }
  var d3_time_scaleSteps = [ 1e3, 5e3, 15e3, 3e4, 6e4, 3e5, 9e5, 18e5, 36e5, 108e5, 216e5, 432e5, 864e5, 1728e5, 6048e5, 2592e6, 7776e6, 31536e6 ];
  var d3_time_scaleLocalMethods = [ [ d3_time.second, 1 ], [ d3_time.second, 5 ], [ d3_time.second, 15 ], [ d3_time.second, 30 ], [ d3_time.minute, 1 ], [ d3_time.minute, 5 ], [ d3_time.minute, 15 ], [ d3_time.minute, 30 ], [ d3_time.hour, 1 ], [ d3_time.hour, 3 ], [ d3_time.hour, 6 ], [ d3_time.hour, 12 ], [ d3_time.day, 1 ], [ d3_time.day, 2 ], [ d3_time.week, 1 ], [ d3_time.month, 1 ], [ d3_time.month, 3 ], [ d3_time.year, 1 ] ];
  var d3_time_scaleLocalFormat = d3_time_format.multi([ [ ".%L", function(d) {
    return d.getMilliseconds();
  } ], [ ":%S", function(d) {
    return d.getSeconds();
  } ], [ "%I:%M", function(d) {
    return d.getMinutes();
  } ], [ "%I %p", function(d) {
    return d.getHours();
  } ], [ "%a %d", function(d) {
    return d.getDay() && d.getDate() != 1;
  } ], [ "%b %d", function(d) {
    return d.getDate() != 1;
  } ], [ "%B", function(d) {
    return d.getMonth();
  } ], [ "%Y", d3_true ] ]);
  var d3_time_scaleMilliseconds = {
    range: function(start, stop, step) {
      return d3.range(Math.ceil(start / step) * step, +stop, step).map(d3_time_scaleDate);
    },
    floor: d3_identity,
    ceil: d3_identity
  };
  d3_time_scaleLocalMethods.year = d3_time.year;
  d3_time.scale = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleLocalMethods, d3_time_scaleLocalFormat);
  };
  var d3_time_scaleUtcMethods = d3_time_scaleLocalMethods.map(function(m) {
    return [ m[0].utc, m[1] ];
  });
  var d3_time_scaleUtcFormat = d3_time_formatUtc.multi([ [ ".%L", function(d) {
    return d.getUTCMilliseconds();
  } ], [ ":%S", function(d) {
    return d.getUTCSeconds();
  } ], [ "%I:%M", function(d) {
    return d.getUTCMinutes();
  } ], [ "%I %p", function(d) {
    return d.getUTCHours();
  } ], [ "%a %d", function(d) {
    return d.getUTCDay() && d.getUTCDate() != 1;
  } ], [ "%b %d", function(d) {
    return d.getUTCDate() != 1;
  } ], [ "%B", function(d) {
    return d.getUTCMonth();
  } ], [ "%Y", d3_true ] ]);
  d3_time_scaleUtcMethods.year = d3_time.year.utc;
  d3_time.scale.utc = function() {
    return d3_time_scale(d3.scale.linear(), d3_time_scaleUtcMethods, d3_time_scaleUtcFormat);
  };
  d3.text = d3_xhrType(function(request) {
    return request.responseText;
  });
  d3.json = function(url, callback) {
    return d3_xhr(url, "application/json", d3_json, callback);
  };
  function d3_json(request) {
    return JSON.parse(request.responseText);
  }
  d3.html = function(url, callback) {
    return d3_xhr(url, "text/html", d3_html, callback);
  };
  function d3_html(request) {
    var range = d3_document.createRange();
    range.selectNode(d3_document.body);
    return range.createContextualFragment(request.responseText);
  }
  d3.xml = d3_xhrType(function(request) {
    return request.responseXML;
  });
  if (typeof define === "function" && define.amd) this.d3 = d3, define(d3); else if (typeof module === "object" && module.exports) module.exports = d3; else this.d3 = d3;
}();
//# sourceMappingURL=d3.js.map
/*! tether 1.3.4 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.Tether = factory();
  }
}(this, function(require, exports, module) {

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TetherBase = undefined;
if (typeof TetherBase === 'undefined') {
  TetherBase = { modules: [] };
}

var zeroElement = null;

// Same as native getBoundingClientRect, except it takes into account parent <frame> offsets
// if the element lies within a nested document (<frame> or <iframe>-like).
function getActualBoundingClientRect(node) {
  var boundingRect = node.getBoundingClientRect();

  // The original object returned by getBoundingClientRect is immutable, so we clone it
  // We can't use extend because the properties are not considered part of the object by hasOwnProperty in IE9
  var rect = {};
  for (var k in boundingRect) {
    rect[k] = boundingRect[k];
  }

  if (node.ownerDocument !== document) {
    var _frameElement = node.ownerDocument.defaultView.frameElement;
    if (_frameElement) {
      var frameRect = getActualBoundingClientRect(_frameElement);
      rect.top += frameRect.top;
      rect.bottom += frameRect.top;
      rect.left += frameRect.left;
      rect.right += frameRect.left;
    }
  }

  return rect;
}

function getScrollParents(el) {
  // In firefox if the el is inside an iframe with display: none; window.getComputedStyle() will return null;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  var computedStyle = getComputedStyle(el) || {};
  var position = computedStyle.position;
  var parents = [];

  if (position === 'fixed') {
    return [el];
  }

  var parent = el;
  while ((parent = parent.parentNode) && parent && parent.nodeType === 1) {
    var style = undefined;
    try {
      style = getComputedStyle(parent);
    } catch (err) {}

    if (typeof style === 'undefined' || style === null) {
      parents.push(parent);
      return parents;
    }

    var _style = style;
    var overflow = _style.overflow;
    var overflowX = _style.overflowX;
    var overflowY = _style.overflowY;

    if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
      if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
        parents.push(parent);
      }
    }
  }

  parents.push(el.ownerDocument.body);

  // If the node is within a frame, account for the parent window scroll
  if (el.ownerDocument !== document) {
    parents.push(el.ownerDocument.defaultView);
  }

  return parents;
}

var uniqueId = (function () {
  var id = 0;
  return function () {
    return ++id;
  };
})();

var zeroPosCache = {};
var getOrigin = function getOrigin() {
  // getBoundingClientRect is unfortunately too accurate.  It introduces a pixel or two of
  // jitter as the user scrolls that messes with our ability to detect if two positions
  // are equivilant or not.  We place an element at the top left of the page that will
  // get the same jitter, so we can cancel the two out.
  var node = zeroElement;
  if (!node) {
    node = document.createElement('div');
    node.setAttribute('data-tether-id', uniqueId());
    extend(node.style, {
      top: 0,
      left: 0,
      position: 'absolute'
    });

    document.body.appendChild(node);

    zeroElement = node;
  }

  var id = node.getAttribute('data-tether-id');
  if (typeof zeroPosCache[id] === 'undefined') {
    zeroPosCache[id] = getActualBoundingClientRect(node);

    // Clear the cache when this position call is done
    defer(function () {
      delete zeroPosCache[id];
    });
  }

  return zeroPosCache[id];
};

function removeUtilElements() {
  if (zeroElement) {
    document.body.removeChild(zeroElement);
  }
  zeroElement = null;
};

function getBounds(el) {
  var doc = undefined;
  if (el === document) {
    doc = document;
    el = document.documentElement;
  } else {
    doc = el.ownerDocument;
  }

  var docEl = doc.documentElement;

  var box = getActualBoundingClientRect(el);

  var origin = getOrigin();

  box.top -= origin.top;
  box.left -= origin.left;

  if (typeof box.width === 'undefined') {
    box.width = document.body.scrollWidth - box.left - box.right;
  }
  if (typeof box.height === 'undefined') {
    box.height = document.body.scrollHeight - box.top - box.bottom;
  }

  box.top = box.top - docEl.clientTop;
  box.left = box.left - docEl.clientLeft;
  box.right = doc.body.clientWidth - box.width - box.left;
  box.bottom = doc.body.clientHeight - box.height - box.top;

  return box;
}

function getOffsetParent(el) {
  return el.offsetParent || document.documentElement;
}

function getScrollBarSize() {
  var inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.height = '200px';

  var outer = document.createElement('div');
  extend(outer.style, {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  });

  outer.appendChild(inner);

  document.body.appendChild(outer);

  var widthContained = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var widthScroll = inner.offsetWidth;

  if (widthContained === widthScroll) {
    widthScroll = outer.clientWidth;
  }

  document.body.removeChild(outer);

  var width = widthContained - widthScroll;

  return { width: width, height: width };
}

function extend() {
  var out = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var args = [];

  Array.prototype.push.apply(args, arguments);

  args.slice(1).forEach(function (obj) {
    if (obj) {
      for (var key in obj) {
        if (({}).hasOwnProperty.call(obj, key)) {
          out[key] = obj[key];
        }
      }
    }
  });

  return out;
}

function removeClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    name.split(' ').forEach(function (cls) {
      if (cls.trim()) {
        el.classList.remove(cls);
      }
    });
  } else {
    var regex = new RegExp('(^| )' + name.split(' ').join('|') + '( |$)', 'gi');
    var className = getClassName(el).replace(regex, ' ');
    setClassName(el, className);
  }
}

function addClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    name.split(' ').forEach(function (cls) {
      if (cls.trim()) {
        el.classList.add(cls);
      }
    });
  } else {
    removeClass(el, name);
    var cls = getClassName(el) + (' ' + name);
    setClassName(el, cls);
  }
}

function hasClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    return el.classList.contains(name);
  }
  var className = getClassName(el);
  return new RegExp('(^| )' + name + '( |$)', 'gi').test(className);
}

function getClassName(el) {
  // Can't use just SVGAnimatedString here since nodes within a Frame in IE have
  // completely separately SVGAnimatedString base classes
  if (el.className instanceof el.ownerDocument.defaultView.SVGAnimatedString) {
    return el.className.baseVal;
  }
  return el.className;
}

function setClassName(el, className) {
  el.setAttribute('class', className);
}

function updateClasses(el, add, all) {
  // Of the set of 'all' classes, we need the 'add' classes, and only the
  // 'add' classes to be set.
  all.forEach(function (cls) {
    if (add.indexOf(cls) === -1 && hasClass(el, cls)) {
      removeClass(el, cls);
    }
  });

  add.forEach(function (cls) {
    if (!hasClass(el, cls)) {
      addClass(el, cls);
    }
  });
}

var deferred = [];

var defer = function defer(fn) {
  deferred.push(fn);
};

var flush = function flush() {
  var fn = undefined;
  while (fn = deferred.pop()) {
    fn();
  }
};

var Evented = (function () {
  function Evented() {
    _classCallCheck(this, Evented);
  }

  _createClass(Evented, [{
    key: 'on',
    value: function on(event, handler, ctx) {
      var once = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      if (typeof this.bindings === 'undefined') {
        this.bindings = {};
      }
      if (typeof this.bindings[event] === 'undefined') {
        this.bindings[event] = [];
      }
      this.bindings[event].push({ handler: handler, ctx: ctx, once: once });
    }
  }, {
    key: 'once',
    value: function once(event, handler, ctx) {
      this.on(event, handler, ctx, true);
    }
  }, {
    key: 'off',
    value: function off(event, handler) {
      if (typeof this.bindings === 'undefined' || typeof this.bindings[event] === 'undefined') {
        return;
      }

      if (typeof handler === 'undefined') {
        delete this.bindings[event];
      } else {
        var i = 0;
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            this.bindings[event].splice(i, 1);
          } else {
            ++i;
          }
        }
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(event) {
      if (typeof this.bindings !== 'undefined' && this.bindings[event]) {
        var i = 0;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        while (i < this.bindings[event].length) {
          var _bindings$event$i = this.bindings[event][i];
          var handler = _bindings$event$i.handler;
          var ctx = _bindings$event$i.ctx;
          var once = _bindings$event$i.once;

          var context = ctx;
          if (typeof context === 'undefined') {
            context = this;
          }

          handler.apply(context, args);

          if (once) {
            this.bindings[event].splice(i, 1);
          } else {
            ++i;
          }
        }
      }
    }
  }]);

  return Evented;
})();

TetherBase.Utils = {
  getActualBoundingClientRect: getActualBoundingClientRect,
  getScrollParents: getScrollParents,
  getBounds: getBounds,
  getOffsetParent: getOffsetParent,
  extend: extend,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  updateClasses: updateClasses,
  defer: defer,
  flush: flush,
  uniqueId: uniqueId,
  Evented: Evented,
  getScrollBarSize: getScrollBarSize,
  removeUtilElements: removeUtilElements
};
/* globals TetherBase, performance */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (typeof TetherBase === 'undefined') {
  throw new Error('You must include the utils.js file before tether.js');
}

var _TetherBase$Utils = TetherBase.Utils;
var getScrollParents = _TetherBase$Utils.getScrollParents;
var getBounds = _TetherBase$Utils.getBounds;
var getOffsetParent = _TetherBase$Utils.getOffsetParent;
var extend = _TetherBase$Utils.extend;
var addClass = _TetherBase$Utils.addClass;
var removeClass = _TetherBase$Utils.removeClass;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;
var flush = _TetherBase$Utils.flush;
var getScrollBarSize = _TetherBase$Utils.getScrollBarSize;
var removeUtilElements = _TetherBase$Utils.removeUtilElements;

function within(a, b) {
  var diff = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  return a + diff >= b && b >= a - diff;
}

var transformKey = (function () {
  if (typeof document === 'undefined') {
    return '';
  }
  var el = document.createElement('div');

  var transforms = ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform'];
  for (var i = 0; i < transforms.length; ++i) {
    var key = transforms[i];
    if (el.style[key] !== undefined) {
      return key;
    }
  }
})();

var tethers = [];

var position = function position() {
  tethers.forEach(function (tether) {
    tether.position(false);
  });
  flush();
};

function now() {
  if (typeof performance !== 'undefined' && typeof performance.now !== 'undefined') {
    return performance.now();
  }
  return +new Date();
}

(function () {
  var lastCall = null;
  var lastDuration = null;
  var pendingTimeout = null;

  var tick = function tick() {
    if (typeof lastDuration !== 'undefined' && lastDuration > 16) {
      // We voluntarily throttle ourselves if we can't manage 60fps
      lastDuration = Math.min(lastDuration - 16, 250);

      // Just in case this is the last event, remember to position just once more
      pendingTimeout = setTimeout(tick, 250);
      return;
    }

    if (typeof lastCall !== 'undefined' && now() - lastCall < 10) {
      // Some browsers call events a little too frequently, refuse to run more than is reasonable
      return;
    }

    if (pendingTimeout != null) {
      clearTimeout(pendingTimeout);
      pendingTimeout = null;
    }

    lastCall = now();
    position();
    lastDuration = now() - lastCall;
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
    ['resize', 'scroll', 'touchmove'].forEach(function (event) {
      window.addEventListener(event, tick);
    });
  }
})();

var MIRROR_LR = {
  center: 'center',
  left: 'right',
  right: 'left'
};

var MIRROR_TB = {
  middle: 'middle',
  top: 'bottom',
  bottom: 'top'
};

var OFFSET_MAP = {
  top: 0,
  left: 0,
  middle: '50%',
  center: '50%',
  bottom: '100%',
  right: '100%'
};

var autoToFixedAttachment = function autoToFixedAttachment(attachment, relativeToAttachment) {
  var left = attachment.left;
  var top = attachment.top;

  if (left === 'auto') {
    left = MIRROR_LR[relativeToAttachment.left];
  }

  if (top === 'auto') {
    top = MIRROR_TB[relativeToAttachment.top];
  }

  return { left: left, top: top };
};

var attachmentToOffset = function attachmentToOffset(attachment) {
  var left = attachment.left;
  var top = attachment.top;

  if (typeof OFFSET_MAP[attachment.left] !== 'undefined') {
    left = OFFSET_MAP[attachment.left];
  }

  if (typeof OFFSET_MAP[attachment.top] !== 'undefined') {
    top = OFFSET_MAP[attachment.top];
  }

  return { left: left, top: top };
};

function addOffset() {
  var out = { top: 0, left: 0 };

  for (var _len = arguments.length, offsets = Array(_len), _key = 0; _key < _len; _key++) {
    offsets[_key] = arguments[_key];
  }

  offsets.forEach(function (_ref) {
    var top = _ref.top;
    var left = _ref.left;

    if (typeof top === 'string') {
      top = parseFloat(top, 10);
    }
    if (typeof left === 'string') {
      left = parseFloat(left, 10);
    }

    out.top += top;
    out.left += left;
  });

  return out;
}

function offsetToPx(offset, size) {
  if (typeof offset.left === 'string' && offset.left.indexOf('%') !== -1) {
    offset.left = parseFloat(offset.left, 10) / 100 * size.width;
  }
  if (typeof offset.top === 'string' && offset.top.indexOf('%') !== -1) {
    offset.top = parseFloat(offset.top, 10) / 100 * size.height;
  }

  return offset;
}

var parseOffset = function parseOffset(value) {
  var _value$split = value.split(' ');

  var _value$split2 = _slicedToArray(_value$split, 2);

  var top = _value$split2[0];
  var left = _value$split2[1];

  return { top: top, left: left };
};
var parseAttachment = parseOffset;

var TetherClass = (function (_Evented) {
  _inherits(TetherClass, _Evented);

  function TetherClass(options) {
    var _this = this;

    _classCallCheck(this, TetherClass);

    _get(Object.getPrototypeOf(TetherClass.prototype), 'constructor', this).call(this);
    this.position = this.position.bind(this);

    tethers.push(this);

    this.history = [];

    this.setOptions(options, false);

    TetherBase.modules.forEach(function (module) {
      if (typeof module.initialize !== 'undefined') {
        module.initialize.call(_this);
      }
    });

    this.position();
  }

  _createClass(TetherClass, [{
    key: 'getClass',
    value: function getClass() {
      var key = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var classes = this.options.classes;

      if (typeof classes !== 'undefined' && classes[key]) {
        return this.options.classes[key];
      } else if (this.options.classPrefix) {
        return this.options.classPrefix + '-' + key;
      } else {
        return key;
      }
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      var _this2 = this;

      var pos = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var defaults = {
        offset: '0 0',
        targetOffset: '0 0',
        targetAttachment: 'auto auto',
        classPrefix: 'tether'
      };

      this.options = extend(defaults, options);

      var _options = this.options;
      var element = _options.element;
      var target = _options.target;
      var targetModifier = _options.targetModifier;

      this.element = element;
      this.target = target;
      this.targetModifier = targetModifier;

      if (this.target === 'viewport') {
        this.target = document.body;
        this.targetModifier = 'visible';
      } else if (this.target === 'scroll-handle') {
        this.target = document.body;
        this.targetModifier = 'scroll-handle';
      }

      ['element', 'target'].forEach(function (key) {
        if (typeof _this2[key] === 'undefined') {
          throw new Error('Tether Error: Both element and target must be defined');
        }

        if (typeof _this2[key].jquery !== 'undefined') {
          _this2[key] = _this2[key][0];
        } else if (typeof _this2[key] === 'string') {
          _this2[key] = document.querySelector(_this2[key]);
        }
      });

      addClass(this.element, this.getClass('element'));
      if (!(this.options.addTargetClasses === false)) {
        addClass(this.target, this.getClass('target'));
      }

      if (!this.options.attachment) {
        throw new Error('Tether Error: You must provide an attachment');
      }

      this.targetAttachment = parseAttachment(this.options.targetAttachment);
      this.attachment = parseAttachment(this.options.attachment);
      this.offset = parseOffset(this.options.offset);
      this.targetOffset = parseOffset(this.options.targetOffset);

      if (typeof this.scrollParents !== 'undefined') {
        this.disable();
      }

      if (this.targetModifier === 'scroll-handle') {
        this.scrollParents = [this.target];
      } else {
        this.scrollParents = getScrollParents(this.target);
      }

      if (!(this.options.enabled === false)) {
        this.enable(pos);
      }
    }
  }, {
    key: 'getTargetBounds',
    value: function getTargetBounds() {
      if (typeof this.targetModifier !== 'undefined') {
        if (this.targetModifier === 'visible') {
          if (this.target === document.body) {
            return { top: pageYOffset, left: pageXOffset, height: innerHeight, width: innerWidth };
          } else {
            var bounds = getBounds(this.target);

            var out = {
              height: bounds.height,
              width: bounds.width,
              top: bounds.top,
              left: bounds.left
            };

            out.height = Math.min(out.height, bounds.height - (pageYOffset - bounds.top));
            out.height = Math.min(out.height, bounds.height - (bounds.top + bounds.height - (pageYOffset + innerHeight)));
            out.height = Math.min(innerHeight, out.height);
            out.height -= 2;

            out.width = Math.min(out.width, bounds.width - (pageXOffset - bounds.left));
            out.width = Math.min(out.width, bounds.width - (bounds.left + bounds.width - (pageXOffset + innerWidth)));
            out.width = Math.min(innerWidth, out.width);
            out.width -= 2;

            if (out.top < pageYOffset) {
              out.top = pageYOffset;
            }
            if (out.left < pageXOffset) {
              out.left = pageXOffset;
            }

            return out;
          }
        } else if (this.targetModifier === 'scroll-handle') {
          var bounds = undefined;
          var target = this.target;
          if (target === document.body) {
            target = document.documentElement;

            bounds = {
              left: pageXOffset,
              top: pageYOffset,
              height: innerHeight,
              width: innerWidth
            };
          } else {
            bounds = getBounds(target);
          }

          var style = getComputedStyle(target);

          var hasBottomScroll = target.scrollWidth > target.clientWidth || [style.overflow, style.overflowX].indexOf('scroll') >= 0 || this.target !== document.body;

          var scrollBottom = 0;
          if (hasBottomScroll) {
            scrollBottom = 15;
          }

          var height = bounds.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth) - scrollBottom;

          var out = {
            width: 15,
            height: height * 0.975 * (height / target.scrollHeight),
            left: bounds.left + bounds.width - parseFloat(style.borderLeftWidth) - 15
          };

          var fitAdj = 0;
          if (height < 408 && this.target === document.body) {
            fitAdj = -0.00011 * Math.pow(height, 2) - 0.00727 * height + 22.58;
          }

          if (this.target !== document.body) {
            out.height = Math.max(out.height, 24);
          }

          var scrollPercentage = this.target.scrollTop / (target.scrollHeight - height);
          out.top = scrollPercentage * (height - out.height - fitAdj) + bounds.top + parseFloat(style.borderTopWidth);

          if (this.target === document.body) {
            out.height = Math.max(out.height, 24);
          }

          return out;
        }
      } else {
        return getBounds(this.target);
      }
    }
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this._cache = {};
    }
  }, {
    key: 'cache',
    value: function cache(k, getter) {
      // More than one module will often need the same DOM info, so
      // we keep a cache which is cleared on each position call
      if (typeof this._cache === 'undefined') {
        this._cache = {};
      }

      if (typeof this._cache[k] === 'undefined') {
        this._cache[k] = getter.call(this);
      }

      return this._cache[k];
    }
  }, {
    key: 'enable',
    value: function enable() {
      var _this3 = this;

      var pos = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      if (!(this.options.addTargetClasses === false)) {
        addClass(this.target, this.getClass('enabled'));
      }
      addClass(this.element, this.getClass('enabled'));
      this.enabled = true;

      this.scrollParents.forEach(function (parent) {
        if (parent !== _this3.target.ownerDocument) {
          parent.addEventListener('scroll', _this3.position);
        }
      });

      if (pos) {
        this.position();
      }
    }
  }, {
    key: 'disable',
    value: function disable() {
      var _this4 = this;

      removeClass(this.target, this.getClass('enabled'));
      removeClass(this.element, this.getClass('enabled'));
      this.enabled = false;

      if (typeof this.scrollParents !== 'undefined') {
        this.scrollParents.forEach(function (parent) {
          parent.removeEventListener('scroll', _this4.position);
        });
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this5 = this;

      this.disable();

      tethers.forEach(function (tether, i) {
        if (tether === _this5) {
          tethers.splice(i, 1);
        }
      });

      // Remove any elements we were using for convenience from the DOM
      if (tethers.length === 0) {
        removeUtilElements();
      }
    }
  }, {
    key: 'updateAttachClasses',
    value: function updateAttachClasses(elementAttach, targetAttach) {
      var _this6 = this;

      elementAttach = elementAttach || this.attachment;
      targetAttach = targetAttach || this.targetAttachment;
      var sides = ['left', 'top', 'bottom', 'right', 'middle', 'center'];

      if (typeof this._addAttachClasses !== 'undefined' && this._addAttachClasses.length) {
        // updateAttachClasses can be called more than once in a position call, so
        // we need to clean up after ourselves such that when the last defer gets
        // ran it doesn't add any extra classes from previous calls.
        this._addAttachClasses.splice(0, this._addAttachClasses.length);
      }

      if (typeof this._addAttachClasses === 'undefined') {
        this._addAttachClasses = [];
      }
      var add = this._addAttachClasses;

      if (elementAttach.top) {
        add.push(this.getClass('element-attached') + '-' + elementAttach.top);
      }
      if (elementAttach.left) {
        add.push(this.getClass('element-attached') + '-' + elementAttach.left);
      }
      if (targetAttach.top) {
        add.push(this.getClass('target-attached') + '-' + targetAttach.top);
      }
      if (targetAttach.left) {
        add.push(this.getClass('target-attached') + '-' + targetAttach.left);
      }

      var all = [];
      sides.forEach(function (side) {
        all.push(_this6.getClass('element-attached') + '-' + side);
        all.push(_this6.getClass('target-attached') + '-' + side);
      });

      defer(function () {
        if (!(typeof _this6._addAttachClasses !== 'undefined')) {
          return;
        }

        updateClasses(_this6.element, _this6._addAttachClasses, all);
        if (!(_this6.options.addTargetClasses === false)) {
          updateClasses(_this6.target, _this6._addAttachClasses, all);
        }

        delete _this6._addAttachClasses;
      });
    }
  }, {
    key: 'position',
    value: function position() {
      var _this7 = this;

      var flushChanges = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      // flushChanges commits the changes immediately, leave true unless you are positioning multiple
      // tethers (in which case call Tether.Utils.flush yourself when you're done)

      if (!this.enabled) {
        return;
      }

      this.clearCache();

      // Turn 'auto' attachments into the appropriate corner or edge
      var targetAttachment = autoToFixedAttachment(this.targetAttachment, this.attachment);

      this.updateAttachClasses(this.attachment, targetAttachment);

      var elementPos = this.cache('element-bounds', function () {
        return getBounds(_this7.element);
      });

      var width = elementPos.width;
      var height = elementPos.height;

      if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
        var _lastSize = this.lastSize;

        // We cache the height and width to make it possible to position elements that are
        // getting hidden.
        width = _lastSize.width;
        height = _lastSize.height;
      } else {
        this.lastSize = { width: width, height: height };
      }

      var targetPos = this.cache('target-bounds', function () {
        return _this7.getTargetBounds();
      });
      var targetSize = targetPos;

      // Get an actual px offset from the attachment
      var offset = offsetToPx(attachmentToOffset(this.attachment), { width: width, height: height });
      var targetOffset = offsetToPx(attachmentToOffset(targetAttachment), targetSize);

      var manualOffset = offsetToPx(this.offset, { width: width, height: height });
      var manualTargetOffset = offsetToPx(this.targetOffset, targetSize);

      // Add the manually provided offset
      offset = addOffset(offset, manualOffset);
      targetOffset = addOffset(targetOffset, manualTargetOffset);

      // It's now our goal to make (element position + offset) == (target position + target offset)
      var left = targetPos.left + targetOffset.left - offset.left;
      var top = targetPos.top + targetOffset.top - offset.top;

      for (var i = 0; i < TetherBase.modules.length; ++i) {
        var _module2 = TetherBase.modules[i];
        var ret = _module2.position.call(this, {
          left: left,
          top: top,
          targetAttachment: targetAttachment,
          targetPos: targetPos,
          elementPos: elementPos,
          offset: offset,
          targetOffset: targetOffset,
          manualOffset: manualOffset,
          manualTargetOffset: manualTargetOffset,
          scrollbarSize: scrollbarSize,
          attachment: this.attachment
        });

        if (ret === false) {
          return false;
        } else if (typeof ret === 'undefined' || typeof ret !== 'object') {
          continue;
        } else {
          top = ret.top;
          left = ret.left;
        }
      }

      // We describe the position three different ways to give the optimizer
      // a chance to decide the best possible way to position the element
      // with the fewest repaints.
      var next = {
        // It's position relative to the page (absolute positioning when
        // the element is a child of the body)
        page: {
          top: top,
          left: left
        },

        // It's position relative to the viewport (fixed positioning)
        viewport: {
          top: top - pageYOffset,
          bottom: pageYOffset - top - height + innerHeight,
          left: left - pageXOffset,
          right: pageXOffset - left - width + innerWidth
        }
      };

      var doc = this.target.ownerDocument;
      var win = doc.defaultView;

      var scrollbarSize = undefined;
      if (doc.body.scrollWidth > win.innerWidth) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.bottom -= scrollbarSize.height;
      }

      if (doc.body.scrollHeight > win.innerHeight) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.right -= scrollbarSize.width;
      }

      if (['', 'static'].indexOf(doc.body.style.position) === -1 || ['', 'static'].indexOf(doc.body.parentElement.style.position) === -1) {
        // Absolute positioning in the body will be relative to the page, not the 'initial containing block'
        next.page.bottom = doc.body.scrollHeight - top - height;
        next.page.right = doc.body.scrollWidth - left - width;
      }

      if (typeof this.options.optimizations !== 'undefined' && this.options.optimizations.moveElement !== false && !(typeof this.targetModifier !== 'undefined')) {
        (function () {
          var offsetParent = _this7.cache('target-offsetparent', function () {
            return getOffsetParent(_this7.target);
          });
          var offsetPosition = _this7.cache('target-offsetparent-bounds', function () {
            return getBounds(offsetParent);
          });
          var offsetParentStyle = getComputedStyle(offsetParent);
          var offsetParentSize = offsetPosition;

          var offsetBorder = {};
          ['Top', 'Left', 'Bottom', 'Right'].forEach(function (side) {
            offsetBorder[side.toLowerCase()] = parseFloat(offsetParentStyle['border' + side + 'Width']);
          });

          offsetPosition.right = doc.body.scrollWidth - offsetPosition.left - offsetParentSize.width + offsetBorder.right;
          offsetPosition.bottom = doc.body.scrollHeight - offsetPosition.top - offsetParentSize.height + offsetBorder.bottom;

          if (next.page.top >= offsetPosition.top + offsetBorder.top && next.page.bottom >= offsetPosition.bottom) {
            if (next.page.left >= offsetPosition.left + offsetBorder.left && next.page.right >= offsetPosition.right) {
              // We're within the visible part of the target's scroll parent
              var scrollTop = offsetParent.scrollTop;
              var scrollLeft = offsetParent.scrollLeft;

              // It's position relative to the target's offset parent (absolute positioning when
              // the element is moved to be a child of the target's offset parent).
              next.offset = {
                top: next.page.top - offsetPosition.top + scrollTop - offsetBorder.top,
                left: next.page.left - offsetPosition.left + scrollLeft - offsetBorder.left
              };
            }
          }
        })();
      }

      // We could also travel up the DOM and try each containing context, rather than only
      // looking at the body, but we're gonna get diminishing returns.

      this.move(next);

      this.history.unshift(next);

      if (this.history.length > 3) {
        this.history.pop();
      }

      if (flushChanges) {
        flush();
      }

      return true;
    }

    // THE ISSUE
  }, {
    key: 'move',
    value: function move(pos) {
      var _this8 = this;

      if (!(typeof this.element.parentNode !== 'undefined')) {
        return;
      }

      var same = {};

      for (var type in pos) {
        same[type] = {};

        for (var key in pos[type]) {
          var found = false;

          for (var i = 0; i < this.history.length; ++i) {
            var point = this.history[i];
            if (typeof point[type] !== 'undefined' && !within(point[type][key], pos[type][key])) {
              found = true;
              break;
            }
          }

          if (!found) {
            same[type][key] = true;
          }
        }
      }

      var css = { top: '', left: '', right: '', bottom: '' };

      var transcribe = function transcribe(_same, _pos) {
        var hasOptimizations = typeof _this8.options.optimizations !== 'undefined';
        var gpu = hasOptimizations ? _this8.options.optimizations.gpu : null;
        if (gpu !== false) {
          var yPos = undefined,
              xPos = undefined;
          if (_same.top) {
            css.top = 0;
            yPos = _pos.top;
          } else {
            css.bottom = 0;
            yPos = -_pos.bottom;
          }

          if (_same.left) {
            css.left = 0;
            xPos = _pos.left;
          } else {
            css.right = 0;
            xPos = -_pos.right;
          }

          css[transformKey] = 'translateX(' + Math.round(xPos) + 'px) translateY(' + Math.round(yPos) + 'px)';

          if (transformKey !== 'msTransform') {
            // The Z transform will keep this in the GPU (faster, and prevents artifacts),
            // but IE9 doesn't support 3d transforms and will choke.
            css[transformKey] += " translateZ(0)";
          }
        } else {
          if (_same.top) {
            css.top = _pos.top + 'px';
          } else {
            css.bottom = _pos.bottom + 'px';
          }

          if (_same.left) {
            css.left = _pos.left + 'px';
          } else {
            css.right = _pos.right + 'px';
          }
        }
      };

      var moved = false;
      if ((same.page.top || same.page.bottom) && (same.page.left || same.page.right)) {
        css.position = 'absolute';
        transcribe(same.page, pos.page);
      } else if ((same.viewport.top || same.viewport.bottom) && (same.viewport.left || same.viewport.right)) {
        css.position = 'fixed';
        transcribe(same.viewport, pos.viewport);
      } else if (typeof same.offset !== 'undefined' && same.offset.top && same.offset.left) {
        (function () {
          css.position = 'absolute';
          var offsetParent = _this8.cache('target-offsetparent', function () {
            return getOffsetParent(_this8.target);
          });

          if (getOffsetParent(_this8.element) !== offsetParent) {
            defer(function () {
              _this8.element.parentNode.removeChild(_this8.element);
              offsetParent.appendChild(_this8.element);
            });
          }

          transcribe(same.offset, pos.offset);
          moved = true;
        })();
      } else {
        css.position = 'absolute';
        transcribe({ top: true, left: true }, pos.page);
      }

      if (!moved) {
        var offsetParentIsBody = true;
        var currentNode = this.element.parentNode;
        while (currentNode && currentNode.nodeType === 1 && currentNode.tagName !== 'BODY') {
          if (getComputedStyle(currentNode).position !== 'static') {
            offsetParentIsBody = false;
            break;
          }

          currentNode = currentNode.parentNode;
        }

        if (!offsetParentIsBody) {
          this.element.parentNode.removeChild(this.element);
          this.element.ownerDocument.body.appendChild(this.element);
        }
      }

      // Any css change will trigger a repaint, so let's avoid one if nothing changed
      var writeCSS = {};
      var write = false;
      for (var key in css) {
        var val = css[key];
        var elVal = this.element.style[key];

        if (elVal !== val) {
          write = true;
          writeCSS[key] = val;
        }
      }

      if (write) {
        defer(function () {
          extend(_this8.element.style, writeCSS);
          _this8.trigger('repositioned');
        });
      }
    }
  }]);

  return TetherClass;
})(Evented);

TetherClass.modules = [];

TetherBase.position = position;

var Tether = extend(TetherClass, TetherBase);
/* globals TetherBase */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _TetherBase$Utils = TetherBase.Utils;
var getBounds = _TetherBase$Utils.getBounds;
var extend = _TetherBase$Utils.extend;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;

var BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];

function getBoundingRect(tether, to) {
  if (to === 'scrollParent') {
    to = tether.scrollParents[0];
  } else if (to === 'window') {
    to = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset];
  }

  if (to === document) {
    to = to.documentElement;
  }

  if (typeof to.nodeType !== 'undefined') {
    (function () {
      var node = to;
      var size = getBounds(to);
      var pos = size;
      var style = getComputedStyle(to);

      to = [pos.left, pos.top, size.width + pos.left, size.height + pos.top];

      // Account any parent Frames scroll offset
      if (node.ownerDocument !== document) {
        var win = node.ownerDocument.defaultView;
        to[0] += win.pageXOffset;
        to[1] += win.pageYOffset;
        to[2] += win.pageXOffset;
        to[3] += win.pageYOffset;
      }

      BOUNDS_FORMAT.forEach(function (side, i) {
        side = side[0].toUpperCase() + side.substr(1);
        if (side === 'Top' || side === 'Left') {
          to[i] += parseFloat(style['border' + side + 'Width']);
        } else {
          to[i] -= parseFloat(style['border' + side + 'Width']);
        }
      });
    })();
  }

  return to;
}

TetherBase.modules.push({
  position: function position(_ref) {
    var _this = this;

    var top = _ref.top;
    var left = _ref.left;
    var targetAttachment = _ref.targetAttachment;

    if (!this.options.constraints) {
      return true;
    }

    var _cache = this.cache('element-bounds', function () {
      return getBounds(_this.element);
    });

    var height = _cache.height;
    var width = _cache.width;

    if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
      var _lastSize = this.lastSize;

      // Handle the item getting hidden as a result of our positioning without glitching
      // the classes in and out
      width = _lastSize.width;
      height = _lastSize.height;
    }

    var targetSize = this.cache('target-bounds', function () {
      return _this.getTargetBounds();
    });

    var targetHeight = targetSize.height;
    var targetWidth = targetSize.width;

    var allClasses = [this.getClass('pinned'), this.getClass('out-of-bounds')];

    this.options.constraints.forEach(function (constraint) {
      var outOfBoundsClass = constraint.outOfBoundsClass;
      var pinnedClass = constraint.pinnedClass;

      if (outOfBoundsClass) {
        allClasses.push(outOfBoundsClass);
      }
      if (pinnedClass) {
        allClasses.push(pinnedClass);
      }
    });

    allClasses.forEach(function (cls) {
      ['left', 'top', 'right', 'bottom'].forEach(function (side) {
        allClasses.push(cls + '-' + side);
      });
    });

    var addClasses = [];

    var tAttachment = extend({}, targetAttachment);
    var eAttachment = extend({}, this.attachment);

    this.options.constraints.forEach(function (constraint) {
      var to = constraint.to;
      var attachment = constraint.attachment;
      var pin = constraint.pin;

      if (typeof attachment === 'undefined') {
        attachment = '';
      }

      var changeAttachX = undefined,
          changeAttachY = undefined;
      if (attachment.indexOf(' ') >= 0) {
        var _attachment$split = attachment.split(' ');

        var _attachment$split2 = _slicedToArray(_attachment$split, 2);

        changeAttachY = _attachment$split2[0];
        changeAttachX = _attachment$split2[1];
      } else {
        changeAttachX = changeAttachY = attachment;
      }

      var bounds = getBoundingRect(_this, to);

      if (changeAttachY === 'target' || changeAttachY === 'both') {
        if (top < bounds[1] && tAttachment.top === 'top') {
          top += targetHeight;
          tAttachment.top = 'bottom';
        }

        if (top + height > bounds[3] && tAttachment.top === 'bottom') {
          top -= targetHeight;
          tAttachment.top = 'top';
        }
      }

      if (changeAttachY === 'together') {
        if (tAttachment.top === 'top') {
          if (eAttachment.top === 'bottom' && top < bounds[1]) {
            top += targetHeight;
            tAttachment.top = 'bottom';

            top += height;
            eAttachment.top = 'top';
          } else if (eAttachment.top === 'top' && top + height > bounds[3] && top - (height - targetHeight) >= bounds[1]) {
            top -= height - targetHeight;
            tAttachment.top = 'bottom';

            eAttachment.top = 'bottom';
          }
        }

        if (tAttachment.top === 'bottom') {
          if (eAttachment.top === 'top' && top + height > bounds[3]) {
            top -= targetHeight;
            tAttachment.top = 'top';

            top -= height;
            eAttachment.top = 'bottom';
          } else if (eAttachment.top === 'bottom' && top < bounds[1] && top + (height * 2 - targetHeight) <= bounds[3]) {
            top += height - targetHeight;
            tAttachment.top = 'top';

            eAttachment.top = 'top';
          }
        }

        if (tAttachment.top === 'middle') {
          if (top + height > bounds[3] && eAttachment.top === 'top') {
            top -= height;
            eAttachment.top = 'bottom';
          } else if (top < bounds[1] && eAttachment.top === 'bottom') {
            top += height;
            eAttachment.top = 'top';
          }
        }
      }

      if (changeAttachX === 'target' || changeAttachX === 'both') {
        if (left < bounds[0] && tAttachment.left === 'left') {
          left += targetWidth;
          tAttachment.left = 'right';
        }

        if (left + width > bounds[2] && tAttachment.left === 'right') {
          left -= targetWidth;
          tAttachment.left = 'left';
        }
      }

      if (changeAttachX === 'together') {
        if (left < bounds[0] && tAttachment.left === 'left') {
          if (eAttachment.left === 'right') {
            left += targetWidth;
            tAttachment.left = 'right';

            left += width;
            eAttachment.left = 'left';
          } else if (eAttachment.left === 'left') {
            left += targetWidth;
            tAttachment.left = 'right';

            left -= width;
            eAttachment.left = 'right';
          }
        } else if (left + width > bounds[2] && tAttachment.left === 'right') {
          if (eAttachment.left === 'left') {
            left -= targetWidth;
            tAttachment.left = 'left';

            left -= width;
            eAttachment.left = 'right';
          } else if (eAttachment.left === 'right') {
            left -= targetWidth;
            tAttachment.left = 'left';

            left += width;
            eAttachment.left = 'left';
          }
        } else if (tAttachment.left === 'center') {
          if (left + width > bounds[2] && eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          } else if (left < bounds[0] && eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          }
        }
      }

      if (changeAttachY === 'element' || changeAttachY === 'both') {
        if (top < bounds[1] && eAttachment.top === 'bottom') {
          top += height;
          eAttachment.top = 'top';
        }

        if (top + height > bounds[3] && eAttachment.top === 'top') {
          top -= height;
          eAttachment.top = 'bottom';
        }
      }

      if (changeAttachX === 'element' || changeAttachX === 'both') {
        if (left < bounds[0]) {
          if (eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          } else if (eAttachment.left === 'center') {
            left += width / 2;
            eAttachment.left = 'left';
          }
        }

        if (left + width > bounds[2]) {
          if (eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          } else if (eAttachment.left === 'center') {
            left -= width / 2;
            eAttachment.left = 'right';
          }
        }
      }

      if (typeof pin === 'string') {
        pin = pin.split(',').map(function (p) {
          return p.trim();
        });
      } else if (pin === true) {
        pin = ['top', 'left', 'right', 'bottom'];
      }

      pin = pin || [];

      var pinned = [];
      var oob = [];

      if (top < bounds[1]) {
        if (pin.indexOf('top') >= 0) {
          top = bounds[1];
          pinned.push('top');
        } else {
          oob.push('top');
        }
      }

      if (top + height > bounds[3]) {
        if (pin.indexOf('bottom') >= 0) {
          top = bounds[3] - height;
          pinned.push('bottom');
        } else {
          oob.push('bottom');
        }
      }

      if (left < bounds[0]) {
        if (pin.indexOf('left') >= 0) {
          left = bounds[0];
          pinned.push('left');
        } else {
          oob.push('left');
        }
      }

      if (left + width > bounds[2]) {
        if (pin.indexOf('right') >= 0) {
          left = bounds[2] - width;
          pinned.push('right');
        } else {
          oob.push('right');
        }
      }

      if (pinned.length) {
        (function () {
          var pinnedClass = undefined;
          if (typeof _this.options.pinnedClass !== 'undefined') {
            pinnedClass = _this.options.pinnedClass;
          } else {
            pinnedClass = _this.getClass('pinned');
          }

          addClasses.push(pinnedClass);
          pinned.forEach(function (side) {
            addClasses.push(pinnedClass + '-' + side);
          });
        })();
      }

      if (oob.length) {
        (function () {
          var oobClass = undefined;
          if (typeof _this.options.outOfBoundsClass !== 'undefined') {
            oobClass = _this.options.outOfBoundsClass;
          } else {
            oobClass = _this.getClass('out-of-bounds');
          }

          addClasses.push(oobClass);
          oob.forEach(function (side) {
            addClasses.push(oobClass + '-' + side);
          });
        })();
      }

      if (pinned.indexOf('left') >= 0 || pinned.indexOf('right') >= 0) {
        eAttachment.left = tAttachment.left = false;
      }
      if (pinned.indexOf('top') >= 0 || pinned.indexOf('bottom') >= 0) {
        eAttachment.top = tAttachment.top = false;
      }

      if (tAttachment.top !== targetAttachment.top || tAttachment.left !== targetAttachment.left || eAttachment.top !== _this.attachment.top || eAttachment.left !== _this.attachment.left) {
        _this.updateAttachClasses(eAttachment, tAttachment);
        _this.trigger('update', {
          attachment: eAttachment,
          targetAttachment: tAttachment
        });
      }
    });

    defer(function () {
      if (!(_this.options.addTargetClasses === false)) {
        updateClasses(_this.target, addClasses, allClasses);
      }
      updateClasses(_this.element, addClasses, allClasses);
    });

    return { top: top, left: left };
  }
});
/* globals TetherBase */

'use strict';

var _TetherBase$Utils = TetherBase.Utils;
var getBounds = _TetherBase$Utils.getBounds;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;

TetherBase.modules.push({
  position: function position(_ref) {
    var _this = this;

    var top = _ref.top;
    var left = _ref.left;

    var _cache = this.cache('element-bounds', function () {
      return getBounds(_this.element);
    });

    var height = _cache.height;
    var width = _cache.width;

    var targetPos = this.getTargetBounds();

    var bottom = top + height;
    var right = left + width;

    var abutted = [];
    if (top <= targetPos.bottom && bottom >= targetPos.top) {
      ['left', 'right'].forEach(function (side) {
        var targetPosSide = targetPos[side];
        if (targetPosSide === left || targetPosSide === right) {
          abutted.push(side);
        }
      });
    }

    if (left <= targetPos.right && right >= targetPos.left) {
      ['top', 'bottom'].forEach(function (side) {
        var targetPosSide = targetPos[side];
        if (targetPosSide === top || targetPosSide === bottom) {
          abutted.push(side);
        }
      });
    }

    var allClasses = [];
    var addClasses = [];

    var sides = ['left', 'top', 'right', 'bottom'];
    allClasses.push(this.getClass('abutted'));
    sides.forEach(function (side) {
      allClasses.push(_this.getClass('abutted') + '-' + side);
    });

    if (abutted.length) {
      addClasses.push(this.getClass('abutted'));
    }

    abutted.forEach(function (side) {
      addClasses.push(_this.getClass('abutted') + '-' + side);
    });

    defer(function () {
      if (!(_this.options.addTargetClasses === false)) {
        updateClasses(_this.target, addClasses, allClasses);
      }
      updateClasses(_this.element, addClasses, allClasses);
    });

    return true;
  }
});
/* globals TetherBase */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

TetherBase.modules.push({
  position: function position(_ref) {
    var top = _ref.top;
    var left = _ref.left;

    if (!this.options.shift) {
      return;
    }

    var shift = this.options.shift;
    if (typeof this.options.shift === 'function') {
      shift = this.options.shift.call(this, { top: top, left: left });
    }

    var shiftTop = undefined,
        shiftLeft = undefined;
    if (typeof shift === 'string') {
      shift = shift.split(' ');
      shift[1] = shift[1] || shift[0];

      var _shift = shift;

      var _shift2 = _slicedToArray(_shift, 2);

      shiftTop = _shift2[0];
      shiftLeft = _shift2[1];

      shiftTop = parseFloat(shiftTop, 10);
      shiftLeft = parseFloat(shiftLeft, 10);
    } else {
      shiftTop = shift.top;
      shiftLeft = shift.left;
    }

    top += shiftTop;
    left += shiftLeft;

    return { top: top, left: left };
  }
});
return Tether;

}));

//# sourceMappingURL=tether.js.map
/*
Trix 0.9.8
Copyright © 2016 Basecamp, LLC
http://trix-editor.org/
 */
(function(){}).call(this),function(){(function(){(function(){this.Trix={VERSION:"0.9.8",ZERO_WIDTH_SPACE:"\ufeff",NON_BREAKING_SPACE:"\xa0",OBJECT_REPLACEMENT_CHARACTER:"\ufffc",config:{}}}).call(this)}).call(this);var t=this.Trix;(function(){(function(){t.BasicObject=function(){function t(){}var e,n,o;return t.proxyMethod=function(t){var o,i,r,s,a;return r=n(t),o=r.name,s=r.toMethod,a=r.toProperty,i=r.optional,this.prototype[o]=function(){var t,n;return t=null!=s?i?"function"==typeof this[s]?this[s]():void 0:this[s]():null!=a?this[a]:void 0,i?(n=null!=t?t[o]:void 0,null!=n?e.call(n,t,arguments):void 0):(n=t[o],e.call(n,t,arguments))}},n=function(t){var e,n;if(!(n=t.match(o)))throw new Error("can't parse @proxyMethod expression: "+t);return e={name:n[4]},null!=n[2]?e.toMethod=n[1]:e.toProperty=n[1],null!=n[3]&&(e.optional=!0),e},e=Function.prototype.apply,o=/^(.+?)(\(\))?(\?)?\.(.+?)$/,t}()}).call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.Object=function(n){function o(){this.id=++i}var i;return e(o,n),i=0,o.fromJSONString=function(t){return this.fromJSON(JSON.parse(t))},o.prototype.hasSameConstructorAs=function(t){return this.constructor===(null!=t?t.constructor:void 0)},o.prototype.isEqualTo=function(t){return this===t},o.prototype.inspect=function(){var t,e,n;return t=function(){var t,o,i;o=null!=(t=this.contentsForInspection())?t:{},i=[];for(e in o)n=o[e],i.push(e+"="+n);return i}.call(this),"#<"+this.constructor.name+":"+this.id+(t.length?" "+t.join(", "):"")+">"},o.prototype.contentsForInspection=function(){},o.prototype.toJSONString=function(){return JSON.stringify(this)},o.prototype.toUTF16String=function(){return t.UTF16String.box(this)},o.prototype.getCacheKey=function(){return this.id.toString()},o}(t.BasicObject)}.call(this),function(){t.extend=function(t){var e,n;for(e in t)n=t[e],this[e]=n;return this}}.call(this),function(){var e,n;t.extend({defer:function(t){return setTimeout(t,1)},memoize:function(t){var e;return e=n++,function(){var n;return null==this.memos&&(this.memos={}),null!=(n=this.memos)[e]?n[e]:n[e]=t.apply(this,arguments)}}}),n=0,e=function(t){var e,n;return null!=(e=null!=(n=null!=t&&"function"==typeof t.inspect?t.inspect():void 0)?n:function(){try{return JSON.stringify(t)}catch(e){}}())?e:t}}.call(this),function(){var e,n;t.extend({normalizeSpaces:function(e){return e.replace(RegExp(""+t.ZERO_WIDTH_SPACE,"g"),"").replace(RegExp(""+t.NON_BREAKING_SPACE,"g")," ")},summarizeStringChange:function(e,o){var i,r,s,a;return e=t.UTF16String.box(e),o=t.UTF16String.box(o),o.length<e.length?(r=n(e,o),a=r[0],i=r[1]):(s=n(o,e),i=s[0],a=s[1]),{added:i,removed:a}}}),n=function(n,o){var i,r,s,a,u;return n.isEqualTo(o)?["",""]:(r=e(n,o),a=r.utf16String.length,s=a?(u=r.offset,r,i=n.codepoints.slice(0,u).concat(n.codepoints.slice(u+a)),e(o,t.UTF16String.fromCodepoints(i))):e(o,n),[r.utf16String.toString(),s.utf16String.toString()])},e=function(t,e){var n,o,i;for(n=0,o=t.length,i=e.length;o>n&&t.charAt(n).isEqualTo(e.charAt(n));)n++;for(;o>n+1&&t.charAt(o-1).isEqualTo(e.charAt(i-1));)o--,i--;return{utf16String:t.slice(n,o),offset:n}}}.call(this),function(){t.extend({copyObject:function(t){var e,n,o;null==t&&(t={}),n={};for(e in t)o=t[e],n[e]=o;return n},objectsAreEqual:function(t,e){var n,o;if(null==t&&(t={}),null==e&&(e={}),Object.keys(t).length!==Object.keys(e).length)return!1;for(n in t)if(o=t[n],o!==e[n])return!1;return!0}})}.call(this),function(){t.extend({arraysAreEqual:function(t,e){var n,o,i,r;if(null==t&&(t=[]),null==e&&(e=[]),t.length!==e.length)return!1;for(o=n=0,i=t.length;i>n;o=++n)if(r=t[o],r!==e[o])return!1;return!0},summarizeArrayChange:function(t,e){var n,o,i,r,s,a,u,c,l,h,p;for(null==t&&(t=[]),null==e&&(e=[]),n=[],h=[],i=new Set,r=0,u=t.length;u>r;r++)p=t[r],i.add(p);for(o=new Set,s=0,c=e.length;c>s;s++)p=e[s],o.add(p),i.has(p)||n.push(p);for(a=0,l=t.length;l>a;a++)p=t[a],o.has(p)||h.push(p);return{added:n,removed:h}}})}.call(this),function(){var e,n,o,i,r,s=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};e=document.documentElement,n=null!=(o=null!=(i=null!=(r=e.matchesSelector)?r:e.webkitMatchesSelector)?i:e.msMatchesSelector)?o:e.mozMatchesSelector,t.extend({handleEvent:function(n,o){var i,r,s,a,u,c,l,h,p,d,f,g;return h=null!=o?o:{},c=h.onElement,u=h.matchingSelector,g=h.withCallback,a=h.inPhase,l=h.preventDefault,d=h.times,r=null!=c?c:e,p=u,i=g,f="capturing"===a,s=function(e){var n;return null!=d&&0===--d&&s.destroy(),n=t.findClosestElementFromNode(e.target,{matchingSelector:p}),null!=n&&(null!=g&&g.call(n,e,n),l)?e.preventDefault():void 0},s.destroy=function(){return r.removeEventListener(n,s,f)},r.addEventListener(n,s,f),s},handleEventOnce:function(e,n){return null==n&&(n={}),n.times=1,t.handleEvent(e,n)},triggerEvent:function(n,o){var i,r,s,a,u,c,l;return l=null!=o?o:{},c=l.onElement,r=l.bubbles,s=l.cancelable,i=l.attributes,a=null!=c?c:e,r=r!==!1,s=s!==!1,u=document.createEvent("Events"),u.initEvent(n,r,s),null!=i&&t.extend.call(u,i),a.dispatchEvent(u)},elementMatchesSelector:function(t,e){return 1===(null!=t?t.nodeType:void 0)?n.call(t,e):void 0},findClosestElementFromNode:function(e,n){var o;for(o=(null!=n?n:{}).matchingSelector;null!=e&&e.nodeType!==Node.ELEMENT_NODE;)e=e.parentNode;if(null!=e){if(null==o)return e;if(e.closest)return e.closest(o);for(;e;){if(t.elementMatchesSelector(e,o))return e;e=e.parentNode}}},findInnerElement:function(t){for(;null!=t?t.firstElementChild:void 0;)t=t.firstElementChild;return t},innerElementIsActive:function(e){return document.activeElement!==e&&t.elementContainsNode(e,document.activeElement)},elementContainsNode:function(t,e){if(t&&e)for(;e;){if(e===t)return!0;e=e.parentNode}},findNodeFromContainerAndOffset:function(t,e){var n;if(t)return t.nodeType===Node.TEXT_NODE?t:0===e?null!=(n=t.firstChild)?n:t:t.childNodes.item(e-1)},findElementFromContainerAndOffset:function(e,n){var o;return o=t.findNodeFromContainerAndOffset(e,n),t.findClosestElementFromNode(o)},findChildIndexOfNode:function(t){var e;if(null!=t?t.parentNode:void 0){for(e=0;t=t.previousSibling;)e++;return e}},measureElement:function(t){return{width:t.offsetWidth,height:t.offsetHeight}},walkTree:function(t,e){var n,o,i,r,s;return i=null!=e?e:{},o=i.onlyNodesOfType,r=i.usingFilter,n=i.expandEntityReferences,s=function(){switch(o){case"element":return NodeFilter.SHOW_ELEMENT;case"text":return NodeFilter.SHOW_TEXT;case"comment":return NodeFilter.SHOW_COMMENT;default:return NodeFilter.SHOW_ALL}}(),document.createTreeWalker(t,s,null!=r?r:null,n===!0)},tagName:function(t){var e;return null!=t&&null!=(e=t.tagName)?e.toLowerCase():void 0},makeElement:function(t,e){var n,o,i,r,s,a,u,c,l,h;if(null==e&&(e={}),"object"==typeof t?(e=t,t=e.tagName):e={attributes:e},o=document.createElement(t),null!=e.editable&&(null==e.attributes&&(e.attributes={}),e.attributes.contenteditable=e.editable),e.attributes){a=e.attributes;for(r in a)h=a[r],o.setAttribute(r,h)}if(e.style){u=e.style;for(r in u)h=u[r],o.style[r]=h}if(e.data){c=e.data;for(r in c)h=c[r],o.dataset[r]=h}if(e.className)for(l=e.className.split(" "),i=0,s=l.length;s>i;i++)n=l[i],o.classList.add(n);return e.textContent&&(o.textContent=e.textContent),o},cloneFragment:function(t){var e,n,o,i,r;for(e=document.createDocumentFragment(),r=t.childNodes,n=0,o=r.length;o>n;n++)i=r[n],e.appendChild(i.cloneNode(!0));return e},makeFragment:function(t){var e,n,o;for(null==t&&(t=""),e=document.createElement("div"),e.innerHTML=t,n=document.createDocumentFragment();o=e.firstChild;)n.appendChild(o);return n},getBlockTagNames:function(){var e,n;return null!=t.blockTagNames?t.blockTagNames:t.blockTagNames=function(){var o,i;o=t.config.blockAttributes,i=[];for(e in o)n=o[e],i.push(n.tagName);return i}()},nodeIsBlockContainer:function(e){return t.nodeIsBlockStartComment(null!=e?e.firstChild:void 0)},nodeProbablyIsBlockContainer:function(e){var n,o;return n=t.tagName(e),s.call(t.getBlockTagNames(),n)>=0&&(o=t.tagName(e.firstChild),s.call(t.getBlockTagNames(),o)<0)},nodeIsBlockStart:function(e,n){var o;return o=(null!=n?n:{strict:!0}).strict,o?t.nodeIsBlockStartComment(e):t.nodeIsBlockStartComment(e)||!t.nodeIsBlockStartComment(e.firstChild)&&t.nodeProbablyIsBlockContainer(e)},nodeIsBlockStartComment:function(e){return t.nodeIsCommentNode(e)&&"block"===(null!=e?e.data:void 0)},nodeIsCommentNode:function(t){return(null!=t?t.nodeType:void 0)===Node.COMMENT_NODE},nodeIsCursorTarget:function(e){return e?t.nodeIsTextNode(e)?e.data===t.ZERO_WIDTH_SPACE:t.nodeIsCursorTarget(e.firstChild):void 0},nodeIsAttachmentElement:function(e){return t.elementMatchesSelector(e,t.AttachmentView.attachmentSelector)},nodeIsEmptyTextNode:function(e){return t.nodeIsTextNode(e)&&""===(null!=e?e.data:void 0)},nodeIsTextNode:function(t){return(null!=t?t.nodeType:void 0)===Node.TEXT_NODE}})}.call(this),function(){var e,n,o,i,r;e=t.copyObject,i=t.objectsAreEqual,t.extend({normalizeRange:o=function(t){var e;if(null!=t)return Array.isArray(t)||(t=[t,t]),[n(t[0]),n(null!=(e=t[1])?e:t[0])]},rangeIsCollapsed:function(t){var e,n,i;if(null!=t)return n=o(t),i=n[0],e=n[1],r(i,e)},rangesAreEqual:function(t,e){var n,i,s,a,u,c;if(null!=t&&null!=e)return s=o(t),i=s[0],n=s[1],a=o(e),c=a[0],u=a[1],r(i,c)&&r(n,u)}}),n=function(t){return"number"==typeof t?t:e(t)},r=function(t,e){return"number"==typeof t?t===e:i(t,e)}}.call(this),function(){var e,n,o,i;e={extendsTagName:"div",css:"%t { display: block; }"},t.registerElement=function(t,n){var r,s,a,u,c,l,h;return null==n&&(n={}),t=t.toLowerCase(),c=i(n),u=null!=(h=c.extendsTagName)?h:e.extendsTagName,delete c.extendsTagName,s=c.defaultCSS,delete c.defaultCSS,null!=s&&u===e.extendsTagName?s+="\n"+e.css:s=e.css,o(s,t),a=Object.getPrototypeOf(document.createElement(u)),a.__super__=a,l=Object.create(a,c),r=document.registerElement(t,{prototype:l}),Object.defineProperty(l,"constructor",{value:r}),r},o=function(t,e){var o;return o=n(e),o.textContent=t.replace(/%t/g,e)},n=function(t){var e;return e=document.createElement("style"),e.setAttribute("type","text/css"),e.setAttribute("data-tag-name",t.toLowerCase()),document.head.insertBefore(e,document.head.firstChild),e},i=function(t){var e,n,o;n={};for(e in t)o=t[e],n[e]="function"==typeof o?{value:o}:o;return n}}.call(this),function(){var e,n;t.extend({getDOMSelection:function(){var t;return t=window.getSelection(),t.rangeCount>0?t:void 0},getDOMRange:function(){var n,o;return(n=null!=(o=t.getDOMSelection())?o.getRangeAt(0):void 0)&&!e(n)?n:void 0},setDOMRange:function(e){var n;return n=window.getSelection(),n.removeAllRanges(),n.addRange(e),t.selectionChangeObserver.update()}}),e=function(t){return n(t.startContainer)||n(t.endContainer)},n=function(t){return!Object.getPrototypeOf(t)}}.call(this),function(){}.call(this),function(){var e,n=function(t,e){function n(){this.constructor=t}for(var i in e)o.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},o={}.hasOwnProperty;e=t.arraysAreEqual,t.Hash=function(o){function i(t){null==t&&(t={}),this.values=s(t),i.__super__.constructor.apply(this,arguments)}var r,s,a,u,c;return n(i,o),i.fromCommonAttributesOfObjects=function(t){var e,n,o,i,s,a;if(null==t&&(t=[]),!t.length)return new this;for(e=r(t[0]),o=e.getKeys(),a=t.slice(1),n=0,i=a.length;i>n;n++)s=a[n],o=e.getKeysCommonToHash(r(s)),e=e.slice(o);return e},i.box=function(t){return r(t)},i.prototype.add=function(t,e){return this.merge(u(t,e))},i.prototype.remove=function(e){return new t.Hash(s(this.values,e))},i.prototype.get=function(t){return this.values[t]},i.prototype.has=function(t){return t in this.values},i.prototype.merge=function(e){return new t.Hash(a(this.values,c(e)))},i.prototype.slice=function(e){var n,o,i,r;for(r={},n=0,i=e.length;i>n;n++)o=e[n],this.has(o)&&(r[o]=this.values[o]);return new t.Hash(r)},i.prototype.getKeys=function(){return Object.keys(this.values)},i.prototype.getKeysCommonToHash=function(t){var e,n,o,i,s;for(t=r(t),i=this.getKeys(),s=[],e=0,o=i.length;o>e;e++)n=i[e],this.values[n]===t.values[n]&&s.push(n);return s},i.prototype.isEqualTo=function(t){return e(this.toArray(),r(t).toArray())},i.prototype.isEmpty=function(){return 0===this.getKeys().length},i.prototype.toArray=function(){var t,e,n;return(null!=this.array?this.array:this.array=function(){var o;e=[],o=this.values;for(t in o)n=o[t],e.push(t,n);return e}.call(this)).slice(0)},i.prototype.toObject=function(){return s(this.values)},i.prototype.toJSON=function(){return this.toObject()},i.prototype.contentsForInspection=function(){return{values:JSON.stringify(this.values)}},u=function(t,e){var n;return n={},n[t]=e,n},a=function(t,e){var n,o,i;o=s(t);for(n in e)i=e[n],o[n]=i;return o},s=function(t,e){var n,o,i,r,s;for(r={},s=Object.keys(t).sort(),n=0,i=s.length;i>n;n++)o=s[n],o!==e&&(r[o]=t[o]);return r},r=function(e){return e instanceof t.Hash?e:new t.Hash(e)},c=function(e){return e instanceof t.Hash?e.values:e},i}(t.Object)}.call(this),function(){t.ObjectGroup=function(){function t(t,e){var n,o;this.objects=null!=t?t:[],o=e.depth,n=e.asTree,n&&(this.depth=o,this.objects=this.constructor.groupObjects(this.objects,{asTree:n,depth:this.depth+1}))}return t.groupObjects=function(t,e){var n,o,i,r,s,a,u,c,l;for(null==t&&(t=[]),l=null!=e?e:{},i=l.depth,n=l.asTree,n&&null==i&&(i=0),c=[],s=0,a=t.length;a>s;s++){if(u=t[s],r){if(("function"==typeof u.canBeGrouped?u.canBeGrouped(i):void 0)&&("function"==typeof(o=r[r.length-1]).canBeGroupedWith?o.canBeGroupedWith(u,i):void 0)){r.push(u);continue}c.push(new this(r,{depth:i,asTree:n})),r=null}("function"==typeof u.canBeGrouped?u.canBeGrouped(i):void 0)?r=[u]:c.push(u)}return r&&c.push(new this(r,{depth:i,asTree:n})),c},t.prototype.getObjects=function(){return this.objects},t.prototype.getDepth=function(){return this.depth},t.prototype.getCacheKey=function(){var t,e,n,o,i;for(e=["objectGroup"],i=this.getObjects(),t=0,n=i.length;n>t;t++)o=i[t],e.push(o.getCacheKey());return e.join("/")},t}()}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.ObjectMap=function(t){function n(t){var e,n,o,i,r;for(null==t&&(t=[]),this.objects={},o=0,i=t.length;i>o;o++)r=t[o],n=JSON.stringify(r),null==(e=this.objects)[n]&&(e[n]=r)}return e(n,t),n.prototype.find=function(t){var e;return e=JSON.stringify(t),this.objects[e]},n}(t.BasicObject)}.call(this),function(){t.ElementStore=function(){function t(t){this.reset(t)}var e;return t.prototype.add=function(t){var n;return n=e(t),this.elements[n]=t},t.prototype.remove=function(t){var n,o;return n=e(t),(o=this.elements[n])?(delete this.elements[n],o):void 0},t.prototype.reset=function(t){var e,n,o;for(null==t&&(t=[]),this.elements={},n=0,o=t.length;o>n;n++)e=t[n],this.add(e);return t},e=function(t){return t.dataset.trixStoreKey},t}()}.call(this),function(){}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.Operation=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n.prototype.isPerforming=function(){return this.performing===!0},n.prototype.hasPerformed=function(){return this.performed===!0},n.prototype.hasSucceeded=function(){return this.performed&&this.succeeded},n.prototype.hasFailed=function(){return this.performed&&!this.succeeded},n.prototype.getPromise=function(){return null!=this.promise?this.promise:this.promise=new Promise(function(t){return function(e,n){return t.performing=!0,t.perform(function(o,i){return t.succeeded=o,t.performing=!1,t.performed=!0,t.succeeded?e(i):n(i)})}}(this))},n.prototype.perform=function(t){return t(!1)},n.prototype.release=function(){var t;return null!=(t=this.promise)&&"function"==typeof t.cancel&&t.cancel(),this.promise=null,this.performing=null,this.performed=null,this.succeeded=null},n.proxyMethod("getPromise().then"),n.proxyMethod("getPromise().catch"),n}(t.BasicObject)}.call(this),function(){var e,n,o,i,r,s=function(t,e){function n(){this.constructor=t}for(var o in e)a.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},a={}.hasOwnProperty;t.UTF16String=function(t){function e(t,e){this.ucs2String=t,this.codepoints=e,this.length=this.codepoints.length,this.ucs2Length=this.ucs2String.length}return s(e,t),e.box=function(t){return null==t&&(t=""),t instanceof this?t:this.fromUCS2String(null!=t?t.toString():void 0)},e.fromUCS2String=function(t){return new this(t,i(t))},e.fromCodepoints=function(t){return new this(r(t),t)},e.prototype.offsetToUCS2Offset=function(t){return r(this.codepoints.slice(0,Math.max(0,t))).length},e.prototype.offsetFromUCS2Offset=function(t){return i(this.ucs2String.slice(0,Math.max(0,t))).length},e.prototype.slice=function(){var t;return this.constructor.fromCodepoints((t=this.codepoints).slice.apply(t,arguments))},e.prototype.charAt=function(t){return this.slice(t,t+1)},e.prototype.isEqualTo=function(t){return this.constructor.box(t).ucs2String===this.ucs2String},e.prototype.toJSON=function(){return this.ucs2String},e.prototype.getCacheKey=function(){return this.ucs2String},e.prototype.toString=function(){return this.ucs2String},e}(t.BasicObject),e=1===("function"==typeof Array.from?Array.from("\ud83d\udc7c").length:void 0),n=null!=("function"==typeof" ".codePointAt?" ".codePointAt(0):void 0),o=" \ud83d\udc7c"===("function"==typeof String.fromCodePoint?String.fromCodePoint(32,128124):void 0),i=e&&n?function(t){return Array.from(t).map(function(t){return t.codePointAt(0)})}:function(t){var e,n,o,i,r;for(i=[],e=0,o=t.length;o>e;)r=t.charCodeAt(e++),r>=55296&&56319>=r&&o>e&&(n=t.charCodeAt(e++),56320===(64512&n)?r=((1023&r)<<10)+(1023&n)+65536:e--),i.push(r);return i},r=o?function(t){return String.fromCodePoint.apply(String,t)}:function(t){var e,n,o;return e=function(){var e,i,r;for(r=[],e=0,i=t.length;i>e;e++)o=t[e],n="",o>65535&&(o-=65536,n+=String.fromCharCode(o>>>10&1023|55296),o=56320|1023&o),r.push(n+String.fromCharCode(o));return r}(),e.join("")}}.call(this),function(){}.call(this),function(){}.call(this),function(){t.config.lang={bold:"Bold",bullets:"Bullets","byte":"Byte",bytes:"Bytes",captionPlaceholder:"Type a caption here\u2026",captionPrompt:"Add a caption\u2026",code:"Code",indent:"Increase Level",italic:"Italic",link:"Link",numbers:"Numbers",outdent:"Decrease Level",quote:"Quote",redo:"Redo",remove:"Remove",strike:"Strikethrough",undo:"Undo",unlink:"Unlink",urlPlaceholder:"Enter a URL\u2026",GB:"GB",KB:"KB",MB:"MB",PB:"PB",TB:"TB"}}.call(this),function(){t.config.css={classNames:{attachment:{container:"attachment",typePrefix:"attachment-",caption:"caption",captionEdited:"caption-edited",captionEditor:"caption-editor",editingCaption:"caption-editing",progressBar:"progress",removeButton:"remove",size:"size"}}}}.call(this),function(){var e;t.config.blockAttributes=e={"default":{tagName:"div",parse:!1},quote:{tagName:"blockquote",nestable:!0},code:{tagName:"pre",text:{plaintext:!0}},bulletList:{tagName:"ul",parse:!1},bullet:{tagName:"li",listAttribute:"bulletList",test:function(n){return t.tagName(n.parentNode)===e[this.listAttribute].tagName}},numberList:{tagName:"ol",parse:!1},number:{tagName:"li",listAttribute:"numberList",test:function(n){return t.tagName(n.parentNode)===e[this.listAttribute].tagName}}}}.call(this),function(){var e,n;e=t.config.lang,n=[e.bytes,e.KB,e.MB,e.GB,e.TB,e.PB],t.config.fileSize={prefix:"IEC",precision:2,formatter:function(t){var o,i,r,s,a;switch(t){case 0:return"0 "+e.bytes;case 1:return"1 "+e.byte;default:return o=function(){switch(this.prefix){case"SI":return 1e3;case"IEC":return 1024}}.call(this),i=Math.floor(Math.log(t)/Math.log(o)),r=t/Math.pow(o,i),s=r.toFixed(this.precision),a=s.replace(/0*$/,"").replace(/\.$/,""),a+" "+n[i]}}}}.call(this),function(){t.config.textAttributes={bold:{tagName:"strong",inheritable:!0,parser:function(t){var e;return e=window.getComputedStyle(t),"bold"===e.fontWeight||e.fontWeight>=600}},italic:{tagName:"em",inheritable:!0,parser:function(t){var e;return e=window.getComputedStyle(t),"italic"===e.fontStyle}},href:{groupTagName:"a",parser:function(e){var n,o,i;return n=t.AttachmentView.attachmentSelector,i="a:not("+n+")",(o=t.findClosestElementFromNode(e,{matchingSelector:i}))?o.getAttribute("href"):void 0}},strike:{tagName:"del",inheritable:!0},frozen:{style:{backgroundColor:"highlight"}}}}.call(this),function(){var e,n,o,i,r;r="[data-trix-serialize=false]",i=["contenteditable","data-trix-id","data-trix-store-key","data-trix-mutable"],n="data-trix-serialized-attributes",o="["+n+"]",e=new RegExp("<!--block-->","g"),t.extend({serializers:{"application/json":function(e){var n;if(e instanceof t.Document)n=e;else{if(!(e instanceof HTMLElement))throw new Error("unserializable object");n=t.Document.fromHTML(e.innerHTML)}return n.toSerializableDocument().toJSONString()},"text/html":function(s){var a,u,c,l,h,p,d,f,g,m,y,v,b,A,C,x,S;if(s instanceof t.Document)l=t.DocumentView.render(s);else{if(!(s instanceof HTMLElement))throw new Error("unserializable object");l=s.cloneNode(!0)}for(A=l.querySelectorAll(r),h=0,g=A.length;g>h;h++)c=A[h],c.parentNode.removeChild(c);for(p=0,m=i.length;m>p;p++)for(a=i[p],C=l.querySelectorAll("["+a+"]"),d=0,y=C.length;y>d;d++)c=C[d],c.removeAttribute(a);for(x=l.querySelectorAll(o),f=0,v=x.length;v>f;f++){c=x[f];try{u=JSON.parse(c.getAttribute(n)),c.removeAttribute(n);for(b in u)S=u[b],c.setAttribute(b,S)}catch(E){}}return l.innerHTML.replace(e,"")}},deserializers:{"application/json":function(e){return t.Document.fromJSONString(e)},"text/html":function(e){return t.Document.fromHTML(e)}},serializeToContentType:function(e,n){var o;if(o=t.serializers[n])return o(e);throw new Error("unknown content type: "+n)},deserializeFromContentType:function(e,n){var o;if(o=t.deserializers[n])return o(e);throw new Error("unknown content type: "+n)}})}.call(this),function(){var e,n;n=t.makeFragment,e=t.config.lang,t.config.toolbar={content:n('<div class="button_groups">\n  <span class="button_group text_tools">\n    <button type="button" class="bold" data-trix-attribute="bold" data-trix-key="b" title="'+e.bold+'">'+e.bold+'</button>\n    <button type="button" class="italic" data-trix-attribute="italic" data-trix-key="i" title="'+e.italic+'">'+e.italic+'</button>\n    <button type="button" class="strike" data-trix-attribute="strike" title="'+e.strike+'">'+e.strike+'</button>\n    <button type="button" class="link" data-trix-attribute="href" data-trix-action="link" data-trix-key="k" title="'+e.link+'">'+e.link+'</button>\n  </span>\n\n  <span class="button_group block_tools">\n    <button type="button" class="quote" data-trix-attribute="quote" title="'+e.quote+'">'+e.quote+'</button>\n    <button type="button" class="code" data-trix-attribute="code" title="'+e.code+'">'+e.code+'</button>\n    <button type="button" class="list bullets" data-trix-attribute="bullet" title="'+e.bullets+'">'+e.bullets+'</button>\n    <button type="button" class="list numbers" data-trix-attribute="number" title="'+e.numbers+'">'+e.numbers+'</button>\n    <button type="button" class="block-level decrease" data-trix-action="decreaseBlockLevel" title="'+e.outdent+'">'+e.outdent+'</button>\n    <button type="button" class="block-level increase" data-trix-action="increaseBlockLevel" title="'+e.indent+'">'+e.indent+'</button>\n  </span>\n\n  <span class="button_group history_tools">\n    <button type="button" class="undo" data-trix-action="undo" data-trix-key="z" title="'+e.undo+'">'+e.undo+'</button>\n    <button type="button" class="redo" data-trix-action="redo" data-trix-key="shift+z" title="'+e.redo+'">'+e.redo+'</button>\n  </span>\n</div>\n\n<div class="dialogs">\n  <div class="dialog link_dialog" data-trix-attribute="href" data-trix-dialog="href">\n    <div class="link_url_fields">\n      <input type="url" required name="href" placeholder="'+e.urlPlaceholder+'">\n      <div class="button_group">\n        <input type="button" value="'+e.link+'" data-trix-method="setAttribute">\n        <input type="button" value="'+e.unlink+'" data-trix-method="removeAttribute">\n      </div>\n    </div>\n  </div>\n</div>')}}.call(this),function(){t.config.undoInterval=5e3}.call(this),function(){var e,n,o;n=t.makeElement,e=t.defer,o={cursorTarget:n({tagName:"span",textContent:t.ZERO_WIDTH_SPACE,data:{trixSelection:!0,trixCursorTarget:!0,trixSerialize:!1}})},t.extend({selectionElements:{selector:"[data-trix-selection]",cssText:"font-size: 0 !important;\npadding: 0 !important;\nmargin: 0 !important;\nborder: none !important;",create:function(t){return o[t].cloneNode(!0)}}})}.call(this),function(){}.call(this),function(){var e;e=t.cloneFragment,t.registerElement("trix-toolbar",{defaultCSS:"%t {\n  white-space: collapse;\n}\n\n%t .dialog {\n  display: none;\n}\n\n%t .dialog.active {\n  display: block;\n}\n\n%t .dialog input.validate:invalid {\n  background-color: #ffdddd;\n}\n\n%t[native] {\n  display: none;\n}",createdCallback:function(){return""===this.innerHTML?this.appendChild(e(t.config.toolbar.content)):void 0}})}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty,o=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};t.ObjectView=function(n){function i(t,e){this.object=t,this.options=null!=e?e:{},this.childViews=[],this.rootView=this}return e(i,n),i.prototype.getNodes=function(){var t,e,n,o,i;for(null==this.nodes&&(this.nodes=this.createNodes()),o=this.nodes,i=[],t=0,e=o.length;e>t;t++)n=o[t],i.push(n.cloneNode(!0));return i},i.prototype.invalidate=function(){var t;return this.nodes=null,null!=(t=this.parentView)?t.invalidate():void 0},i.prototype.invalidateViewForObject=function(t){var e;return null!=(e=this.findViewForObject(t))?e.invalidate():void 0},i.prototype.findOrCreateCachedChildView=function(t,e){var n;return(n=this.getCachedViewForObject(e))?this.recordChildView(n):(n=this.createChildView.apply(this,arguments),this.cacheViewForObject(n,e)),n},i.prototype.createChildView=function(e,n,o){var i;return null==o&&(o={}),n instanceof t.ObjectGroup&&(o.viewClass=e,e=t.ObjectGroupView),i=new e(n,o),this.recordChildView(i)},i.prototype.recordChildView=function(t){return t.parentView=this,t.rootView=this.rootView,this.childViews.push(t),t},i.prototype.getAllChildViews=function(){var t,e,n,o,i;for(i=[],o=this.childViews,e=0,n=o.length;n>e;e++)t=o[e],i.push(t),i=i.concat(t.getAllChildViews());return i},i.prototype.findElement=function(){return this.findElementForObject(this.object)},i.prototype.findElementForObject=function(t){var e;return(e=null!=t?t.id:void 0)?this.rootView.element.querySelector("[data-trix-id='"+e+"']"):void 0},i.prototype.findViewForObject=function(t){var e,n,o,i;for(o=this.getAllChildViews(),e=0,n=o.length;n>e;e++)if(i=o[e],i.object===t)return i},i.prototype.getViewCache=function(){return this.rootView!==this?this.rootView.getViewCache():this.isViewCachingEnabled()?null!=this.viewCache?this.viewCache:this.viewCache={}:void 0},i.prototype.isViewCachingEnabled=function(){return this.shouldCacheViews!==!1},i.prototype.enableViewCaching=function(){return this.shouldCacheViews=!0},i.prototype.disableViewCaching=function(){return this.shouldCacheViews=!1},i.prototype.getCachedViewForObject=function(t){var e;return null!=(e=this.getViewCache())?e[t.getCacheKey()]:void 0},i.prototype.cacheViewForObject=function(t,e){var n;return null!=(n=this.getViewCache())?n[e.getCacheKey()]=t:void 0},i.prototype.garbageCollectCachedViews=function(){var t,e,n,i,r,s;if(t=this.getViewCache()){s=this.getAllChildViews().concat(this),n=function(){var t,e,n;for(n=[],t=0,e=s.length;e>t;t++)r=s[t],n.push(r.object.getCacheKey());return n}(),i=[];for(e in t)o.call(n,e)<0&&i.push(delete t[e]);return i}},i}(t.BasicObject)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.ObjectGroupView=function(t){function n(){n.__super__.constructor.apply(this,arguments),this.objectGroup=this.object,this.viewClass=this.options.viewClass,delete this.options.viewClass}return e(n,t),n.prototype.getChildViews=function(){var t,e,n,o;if(!this.childViews.length)for(o=this.objectGroup.getObjects(),t=0,e=o.length;e>t;t++)n=o[t],this.findOrCreateCachedChildView(this.viewClass,n,this.options);return this.childViews},n.prototype.createNodes=function(){var t,e,n,o,i,r,s,a,u;for(t=this.createContainerElement(),s=this.getChildViews(),e=0,o=s.length;o>e;e++)for(u=s[e],a=u.getNodes(),n=0,i=a.length;i>n;n++)r=a[n],t.appendChild(r);return[t]},n.prototype.createContainerElement=function(t){return null==t&&(t=this.objectGroup.getDepth()),this.getChildViews()[0].createContainerElement(t)},n}(t.ObjectView)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.Controller=function(t){function n(){return n.__super__.constructor.apply(this,arguments)}return e(n,t),n}(t.BasicObject)}.call(this),function(){var e,n,o,i,r,s,a=function(t,e){return function(){return t.apply(e,arguments)}},u=function(t,e){function n(){this.constructor=t}for(var o in e)c.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},c={}.hasOwnProperty,l=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};e=t.defer,n=t.findClosestElementFromNode,o=t.nodeIsEmptyTextNode,i=t.normalizeSpaces,r=t.summarizeStringChange,s=t.tagName,t.MutationObserver=function(t){function e(t){this.element=t,this.didMutate=a(this.didMutate,this),this.observer=new window.MutationObserver(this.didMutate),this.start()}var c,h,p,d;return u(e,t),h="data-trix-mutable",p="["+h+"]",d={attributes:!0,childList:!0,characterData:!0,characterDataOldValue:!0,subtree:!0},e.prototype.start=function(){return this.reset(),this.observer.observe(this.element,d)},e.prototype.stop=function(){return this.observer.disconnect()},e.prototype.didMutate=function(t){var e,n;return(e=this.mutations).push.apply(e,this.findSignificantMutations(t)),this.mutations.length?(null!=(n=this.delegate)&&"function"==typeof n.elementDidMutate&&n.elementDidMutate(this.getMutationSummary()),this.reset()):void 0},e.prototype.reset=function(){return this.mutations=[]},e.prototype.findSignificantMutations=function(t){var e,n,o,i;for(i=[],e=0,n=t.length;n>e;e++)o=t[e],this.mutationIsSignificant(o)&&i.push(o);return i},e.prototype.mutationIsSignificant=function(t){var e,n,o,i;for(i=this.nodesModifiedByMutation(t),e=0,n=i.length;n>e;e++)if(o=i[e],this.nodeIsSignificant(o))return!0;return!1},e.prototype.nodeIsSignificant=function(t){return t!==this.element&&!this.nodeIsMutable(t)&&!o(t)},e.prototype.nodeIsMutable=function(t){return n(t,{matchingSelector:p})},e.prototype.nodesModifiedByMutation=function(t){var e;switch(e=[],t.type){case"attributes":t.attributeName!==h&&e.push(t.target);break;case"characterData":e.push(t.target.parentNode),e.push(t.target);break;case"childList":e.push.apply(e,t.addedNodes),e.push.apply(e,t.removedNodes)}return e},e.prototype.getMutationSummary=function(){return this.getTextMutationSummary()},e.prototype.getTextMutationSummary=function(){var t,e,n,o,i,r,s,a,u,c,h;for(a=this.getTextChangesFromCharacterData(),n=a.additions,i=a.deletions,h=this.getTextChangesFromChildList(),u=h.additions,r=0,s=u.length;s>r;r++)e=u[r],l.call(n,e)<0&&n.push(e);return i.push.apply(i,h.deletions),c={},(t=n.join(""))&&(c.textAdded=t),(o=i.join(""))&&(c.textDeleted=o),c},e.prototype.getMutationsByType=function(t){var e,n,o,i,r;for(i=this.mutations,r=[],e=0,n=i.length;n>e;e++)o=i[e],o.type===t&&r.push(o);return r},e.prototype.getTextChangesFromChildList=function(){var t,e,n,o,r,s,a,u,l,h;for(l=[],h=[],r=this.getMutationsByType("childList"),e=0,o=r.length;o>e;e++)s=r[e],t=s.addedNodes,a=s.removedNodes,l.push.apply(l,c(t)),h.push.apply(h,c(a));return{additions:function(){var t,e,o;for(o=[],n=t=0,e=l.length;e>t;n=++t)u=l[n],u!==h[n]&&o.push(i(u));return o}(),deletions:function(){var t,e,o;for(o=[],n=t=0,e=h.length;e>t;n=++t)u=h[n],u!==l[n]&&o.push(i(u));return o}()}},e.prototype.getTextChangesFromCharacterData=function(){var t,e,n,o,s,a,u,c;
return e=this.getMutationsByType("characterData"),e.length&&(c=e[0],n=e[e.length-1],s=i(c.oldValue),o=i(n.target.data),a=r(s,o),t=a.added,u=a.removed),{additions:t?[t]:[],deletions:u?[u]:[]}},c=function(t){var e,n,o,i;for(null==t&&(t=[]),i=[],e=0,n=t.length;n>e;e++)switch(o=t[e],o.nodeType){case Node.TEXT_NODE:i.push(o.data);break;case Node.ELEMENT_NODE:"br"===s(o)&&i.push("\n")}return i},e}(t.BasicObject)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.FileVerificationOperation=function(t){function n(t){this.file=t}return e(n,t),n.prototype.perform=function(t){var e;return e=new FileReader,e.onerror=function(){return t(!1)},e.onload=function(n){return function(){e.onerror=null;try{e.abort()}catch(o){}return t(!0,n.file)}}(this),e.readAsArrayBuffer(this.file)},n}(t.Operation)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.CompositionInputController=function(t){function n(t){var e;this.inputController=t,e=this.inputController,this.responder=e.responder,this.delegate=e.delegate,this.inputSummary=e.inputSummary,this.data={}}return e(n,t),n.prototype.start=function(t){var e,n;return this.data.start=t,"keypress"===this.inputSummary.eventName&&this.inputSummary.textAdded&&null!=(e=this.responder)&&e.deleteInDirection("left"),this.selectionIsExpanded()||(this.insertPlaceholder(),this.requestRender()),this.range=null!=(n=this.responder)?n.getSelectedRange():void 0},n.prototype.update=function(t){var e;return this.data.update=t,(e=this.selectPlaceholder())?(this.forgetPlaceholder(),this.range=e):void 0},n.prototype.end=function(t){var e,n,o;return this.data.end=t,this.forgetPlaceholder(),this.canApplyToDocument()?(null!=(e=this.delegate)&&e.inputControllerWillPerformTyping(),null!=(n=this.responder)&&n.setSelectedRange(this.range),null!=(o=this.responder)&&o.insertString(this.data.end),this.setInputSummary({preferDocument:!0}),this.setFinalSelection()):null!=this.data.start||null!=this.data.update?(this.requestReparse(),this.inputController.reset()):void 0},n.prototype.canApplyToDocument=function(){var t,e;return 0===(null!=(t=this.data.start)?t.length:void 0)&&(null!=(e=this.data.end)?e.length:void 0)>0&&null!=this.range},n.prototype.setFinalSelection=function(){return null!=this.data.end&&this.data.end===this.data.update?this.unlessMutationOccurs(function(t){return function(){var e;return t.selectionIsExpanded()?(null!=(e=t.responder)&&e.setSelection(t.range[0]+t.data.end.length),t.requestRender()):void 0}}(this)):void 0},n.proxyMethod("inputController.setInputSummary"),n.proxyMethod("inputController.requestRender"),n.proxyMethod("inputController.requestReparse"),n.proxyMethod("inputController.unlessMutationOccurs"),n.proxyMethod("responder?.selectionIsExpanded"),n.proxyMethod("responder?.insertPlaceholder"),n.proxyMethod("responder?.selectPlaceholder"),n.proxyMethod("responder?.forgetPlaceholder"),n}(t.BasicObject)}.call(this),function(){var e,n,o,i,r,s,a,u,c,l,h,p,d,f,g,m,y,v=function(t,e){function n(){this.constructor=t}for(var o in e)b.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},b={}.hasOwnProperty,A=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};a=t.handleEvent,r=t.findClosestElementFromNode,s=t.findElementFromContainerAndOffset,o=t.defer,p=t.makeElement,u=t.innerElementIsActive,g=t.summarizeStringChange,d=t.objectsAreEqual,m=t.tagName,t.InputController=function(r){function s(e){var n;this.element=e,this.resetInputSummary(),this.mutationCount=0,this.mutationObserver=new t.MutationObserver(this.element),this.mutationObserver.delegate=this;for(n in this.events)a(n,{onElement:this.element,withCallback:this.handlerFor(n),inPhase:"capturing"})}var g;return v(s,r),g=0,s.keyNames={8:"backspace",9:"tab",13:"return",37:"left",39:"right",46:"delete",68:"d",72:"h",79:"o"},s.prototype.handlerFor=function(t){return function(e){return function(n){return e.handleInput(function(){return u(this.element)?void 0:(this.eventName=t,this.events[t].call(this,n))})}}(this)},s.prototype.setInputSummary=function(t){var e,n;null==t&&(t={}),this.inputSummary.eventName=this.eventName;for(e in t)n=t[e],this.inputSummary[e]=n;return this.inputSummary},s.prototype.resetInputSummary=function(){return this.inputSummary={}},s.prototype.reset=function(){return this.resetInputSummary(),t.selectionChangeObserver.reset()},s.prototype.editorWillSyncDocumentView=function(){return this.mutationObserver.stop()},s.prototype.editorDidSyncDocumentView=function(){return this.mutationObserver.start()},s.prototype.requestRender=function(){var t;return null!=(t=this.delegate)&&"function"==typeof t.inputControllerDidRequestRender?t.inputControllerDidRequestRender():void 0},s.prototype.requestReparse=function(){var t;return null!=(t=this.delegate)&&"function"==typeof t.inputControllerDidRequestReparse&&t.inputControllerDidRequestReparse(),this.requestRender()},s.prototype.elementDidMutate=function(t){return this.mutationCount++,this.isComposing()?void 0:this.handleInput(function(){return this.mutationIsExpected(t)?this.requestRender():this.requestReparse(),this.reset()})},s.prototype.mutationIsExpected=function(t){var e,n,o,i,r,s;return o=t.textAdded,i=t.textDeleted,this.inputSummary.preferDocument?!0:(r=o!==this.inputSummary.textAdded,s=null!=i&&!this.inputSummary.didDelete,"\n"===i&&s&&o&&!r&&(e=this.getSelectedRange())&&(null!=(n=this.responder)?n.positionIsBlockBreak(e[1]+o.length):void 0)&&(s=!1),!(r||s))},s.prototype.unlessMutationOccurs=function(t){var e;return e=this.mutationCount,o(function(n){return function(){return e===n.mutationCount?t():void 0}}(this))},s.prototype.attachFiles=function(e){var n,o;return o=function(){var o,i,r;for(r=[],o=0,i=e.length;i>o;o++)n=e[o],r.push(new t.FileVerificationOperation(n));return r}(),Promise.all(o).then(function(t){return function(e){return t.handleInput(function(){var t,o,i,r;for(null!=(i=this.delegate)&&i.inputControllerWillAttachFiles(),t=0,o=e.length;o>t;t++)n=e[t],null!=(r=this.responder)&&r.insertFile(n);return this.requestRender()})}}(this))},s.prototype.events={keydown:function(e){var n,o,i,r,s,a,u,l,h;if(this.isComposing()||this.resetInputSummary(),r=this.constructor.keyNames[e.keyCode]){for(o=this.keys,l=["ctrl","alt","shift","meta"],i=0,a=l.length;a>i;i++)u=l[i],e[u+"Key"]&&("ctrl"===u&&(u="control"),o=null!=o?o[u]:void 0);null!=(null!=o?o[r]:void 0)&&(this.setInputSummary({keyName:r}),t.selectionChangeObserver.reset(),o[r].call(this,e))}return c(e)&&(n=String.fromCharCode(e.keyCode).toLowerCase())&&(s=function(){var t,n,o,i;for(o=["alt","shift"],i=[],t=0,n=o.length;n>t;t++)u=o[t],e[u+"Key"]&&i.push(u);return i}(),s.push(n),null!=(h=this.delegate)?h.inputControllerDidReceiveKeyboardCommand(s):void 0)?e.preventDefault():void 0},keypress:function(t){var e,n,o;if(null==this.inputSummary.eventName&&(!t.metaKey&&!t.ctrlKey||t.altKey)&&!h(t)&&!l(t))return null===t.which?e=String.fromCharCode(t.keyCode):0!==t.which&&0!==t.charCode&&(e=String.fromCharCode(t.charCode)),null!=e?(null!=(n=this.delegate)&&n.inputControllerWillPerformTyping(),null!=(o=this.responder)&&o.insertString(e),this.setInputSummary({textAdded:e,didDelete:this.selectionIsExpanded()})):void 0},textInput:function(t){var e,n,o,i;return e=t.data,i=this.inputSummary.textAdded,i&&i!==e&&i.toUpperCase()===e?(n=this.getSelectedRange(),this.setSelectedRange([n[0],n[1]+i.length]),null!=(o=this.responder)&&o.insertString(e),this.setInputSummary({textAdded:e}),this.setSelectedRange(n)):void 0},dragenter:function(t){return t.preventDefault()},dragstart:function(t){var e,n;return n=t.target,this.serializeSelectionToDataTransfer(t.dataTransfer),this.draggedRange=this.getSelectedRange(),null!=(e=this.delegate)&&"function"==typeof e.inputControllerDidStartDrag?e.inputControllerDidStartDrag():void 0},dragover:function(t){var e,n;return!this.draggedRange&&!this.canAcceptDataTransfer(t.dataTransfer)||(t.preventDefault(),e={x:t.clientX,y:t.clientY},d(e,this.draggingPoint))?void 0:(this.draggingPoint=e,null!=(n=this.delegate)&&"function"==typeof n.inputControllerDidReceiveDragOverPoint?n.inputControllerDidReceiveDragOverPoint(this.draggingPoint):void 0)},dragend:function(){var t;return null!=(t=this.delegate)&&"function"==typeof t.inputControllerDidCancelDrag&&t.inputControllerDidCancelDrag(),this.draggedRange=null,this.draggingPoint=null},drop:function(e){var n,o,i,r,s,a,u,c,l;return e.preventDefault(),i=null!=(s=e.dataTransfer)?s.files:void 0,r={x:e.clientX,y:e.clientY},null!=(a=this.responder)&&a.setLocationRangeFromPointRange(r),(null!=i?i.length:void 0)?this.attachFiles(i):this.draggedRange?(null!=(u=this.delegate)&&u.inputControllerWillMoveText(),null!=(c=this.responder)&&c.moveTextFromRange(this.draggedRange),this.draggedRange=null,this.requestRender()):(o=e.dataTransfer.getData("application/x-trix-document"))&&(n=t.Document.fromJSONString(o),null!=(l=this.responder)&&l.insertDocument(n),this.requestRender()),this.draggedRange=null,this.draggingPoint=null},cut:function(t){var e;return this.serializeSelectionToDataTransfer(t.clipboardData)&&t.preventDefault(),null!=(e=this.delegate)&&e.inputControllerWillCutText(),this.deleteInDirection("backward"),t.defaultPrevented?this.requestRender():void 0},copy:function(t){return this.serializeSelectionToDataTransfer(t.clipboardData)?t.preventDefault():void 0},paste:function(n){var o,r,s,a,u,c,l,h,p,d,m,y,v,b,C,x,S,E,R,k,w,D;return u=null!=(l=n.clipboardData)?l:n.testClipboardData,c={paste:u},null==u||f(n)?void this.getPastedHTMLUsingHiddenElement(function(t){return function(e){var n,o,i;return c.html=e,null!=(n=t.delegate)&&n.inputControllerWillPasteText(c),null!=(o=t.responder)&&o.insertHTML(e),t.requestRender(),null!=(i=t.delegate)?i.inputControllerDidPaste(c):void 0}}(this)):(e(u)?(D=u.getData("text/plain"),c.string=D,this.setInputSummary({textAdded:D,didDelete:this.selectionIsExpanded()}),null!=(h=this.delegate)&&h.inputControllerWillPasteText(c),null!=(b=this.responder)&&b.insertString(D),this.requestRender(),null!=(C=this.delegate)&&C.inputControllerDidPaste(c)):(a=u.getData("text/html"))?(c.html=a,null!=(x=this.delegate)&&x.inputControllerWillPasteText(c),null!=(S=this.responder)&&S.insertHTML(a),this.requestRender(),null!=(E=this.delegate)&&E.inputControllerDidPaste(c)):(s=u.getData("URL"))?(c.string=s,this.setInputSummary({textAdded:s,didDelete:this.selectionIsExpanded()}),null!=(R=this.delegate)&&R.inputControllerWillPasteText(c),null!=(k=this.responder)&&k.insertText(t.Text.textForStringWithAttributes(s,{href:s})),this.requestRender(),null!=(w=this.delegate)&&w.inputControllerDidPaste(c)):A.call(u.types,"Files")>=0&&(r=null!=(p=u.items)&&null!=(d=p[0])&&"function"==typeof d.getAsFile?d.getAsFile():void 0)&&(!r.name&&(o=i(r))&&(r.name="pasted-file-"+ ++g+"."+o),c.file=r,null!=(m=this.delegate)&&m.inputControllerWillAttachFiles(),null!=(y=this.responder)&&y.insertFile(r),this.requestRender(),null!=(v=this.delegate)&&v.inputControllerDidPaste(c)),n.preventDefault())},compositionstart:function(e){return this.compositionInputController=new t.CompositionInputController(this),this.compositionInputController.start(e.data)},compositionupdate:function(e){return null==this.compositionInputController&&(this.compositionInputController=new t.CompositionInputController(this)),this.compositionInputController.update(e.data)},compositionend:function(e){return null==this.compositionInputController&&(this.compositionInputController=new t.CompositionInputController(this)),this.compositionInputController.end(e.data),this.compositionInputController=null},input:function(t){return t.stopPropagation()}},s.prototype.keys={backspace:function(t){var e;return null!=(e=this.delegate)&&e.inputControllerWillPerformTyping(),this.deleteInDirection("backward",t)},"delete":function(t){var e;return null!=(e=this.delegate)&&e.inputControllerWillPerformTyping(),this.deleteInDirection("forward",t)},"return":function(){var t,e;return this.setInputSummary({preferDocument:!0}),null!=(t=this.delegate)&&t.inputControllerWillPerformTyping(),null!=(e=this.responder)?e.insertLineBreak():void 0},tab:function(t){var e,n;return(null!=(e=this.responder)?e.canIncreaseBlockAttributeLevel():void 0)?(null!=(n=this.responder)&&n.increaseBlockAttributeLevel(),this.requestRender(),t.preventDefault()):void 0},left:function(t){var e;return this.selectionIsInCursorTarget()?(t.preventDefault(),null!=(e=this.responder)?e.moveCursorInDirection("backward"):void 0):void 0},right:function(t){var e;return this.selectionIsInCursorTarget()?(t.preventDefault(),null!=(e=this.responder)?e.moveCursorInDirection("forward"):void 0):void 0},control:{d:function(t){var e;return null!=(e=this.delegate)&&e.inputControllerWillPerformTyping(),this.deleteInDirection("forward",t)},h:function(t){var e;return null!=(e=this.delegate)&&e.inputControllerWillPerformTyping(),this.deleteInDirection("backward",t)},o:function(t){var e,n;return t.preventDefault(),null!=(e=this.delegate)&&e.inputControllerWillPerformTyping(),null!=(n=this.responder)&&n.insertString("\n",{updatePosition:!1}),this.requestRender()}},shift:{"return":function(){var t,e;return null!=(t=this.delegate)&&t.inputControllerWillPerformTyping(),null!=(e=this.responder)?e.insertString("\n"):void 0},tab:function(t){var e,n;return(null!=(e=this.responder)?e.canDecreaseBlockAttributeLevel():void 0)?(null!=(n=this.responder)&&n.decreaseBlockAttributeLevel(),this.requestRender(),t.preventDefault()):void 0},left:function(t){return this.selectionIsInCursorTarget()?(t.preventDefault(),this.expandSelectionInDirection("backward")):void 0},right:function(t){return this.selectionIsInCursorTarget()?(t.preventDefault(),this.expandSelectionInDirection("forward")):void 0}},alt:{backspace:function(){var t;return this.setInputSummary({preferDocument:!1}),null!=(t=this.delegate)?t.inputControllerWillPerformTyping():void 0}},meta:{backspace:function(){var t;return this.setInputSummary({preferDocument:!1}),null!=(t=this.delegate)?t.inputControllerWillPerformTyping():void 0}}},s.prototype.handleInput=function(t){var e,n;try{return null!=(e=this.delegate)&&e.inputControllerWillHandleInput(),t.call(this)}finally{null!=(n=this.delegate)&&n.inputControllerDidHandleInput()}},s.prototype.isComposing=function(){return null!=this.compositionInputController},s.prototype.deleteInDirection=function(t,e){var n;return(null!=(n=this.responder)?n.deleteInDirection(t):void 0)!==!1?this.setInputSummary({didDelete:!0}):e?(e.preventDefault(),this.requestRender()):void 0},s.prototype.serializeSelectionToDataTransfer=function(e){var o,i;if(n(e))return o=null!=(i=this.responder)?i.getSelectedDocument().toSerializableDocument():void 0,e.setData("application/x-trix-document",JSON.stringify(o)),e.setData("text/html",t.DocumentView.render(o).innerHTML),e.setData("text/plain",o.toString().replace(/\n$/,"")),!0},s.prototype.canAcceptDataTransfer=function(t){var e,n,o,i,r,s;for(s={},i=null!=(o=null!=t?t.types:void 0)?o:[],e=0,n=i.length;n>e;e++)r=i[e],s[r]=!0;return s.Files||s["application/x-trix-document"]||s["text/html"]||s["text/plain"]},s.prototype.getPastedHTMLUsingHiddenElement=function(t){var e,n,o;return n=this.getSelectedRange(),o={position:"absolute",left:window.pageXOffset+"px",top:window.pageYOffset+"px",opacity:0},e=p({style:o,tagName:"div",editable:!0}),document.body.appendChild(e),e.focus(),requestAnimationFrame(function(o){return function(){var i;return i=e.innerHTML,document.body.removeChild(e),o.setSelectedRange(n),t(i)}}(this))},s.proxyMethod("responder?.getSelectedRange"),s.proxyMethod("responder?.setSelectedRange"),s.proxyMethod("responder?.expandSelectionInDirection"),s.proxyMethod("responder?.selectionIsInCursorTarget"),s.proxyMethod("responder?.selectionIsExpanded"),s}(t.BasicObject),i=function(t){var e,n;return null!=(e=t.type)&&null!=(n=e.match(/\/(\w+)$/))?n[1]:void 0},h=function(t){return t.metaKey&&t.altKey&&!t.shiftKey&&94===t.keyCode},l=function(t){return t.metaKey&&t.altKey&&t.shiftKey&&9674===t.keyCode},c=function(t){return/Mac|^iP/.test(navigator.platform)?t.metaKey:t.ctrlKey},f=function(t){var e,n;return(n=null!=(e=t.clipboardData)?e.types:void 0)?A.call(n,"text/html")<0&&(A.call(n,"com.apple.webarchive")>=0||A.call(n,"com.apple.flat-rtfd")>=0):void 0},e=function(t){var e,n,o;return o=t.getData("text/plain"),n=t.getData("text/html"),o&&n?(e=p("div"),e.innerHTML=n,e.textContent===o?!e.querySelector(":not(meta)"):void 0):null!=o?o.length:void 0},y={"application/x-trix-feature-detection":"test"},n=function(t){var e,n;if(null!=(null!=t?t.setData:void 0)){for(e in y)if(n=y[e],t.setData(e,n),t.getData(e)!==n)return;return!0}}}.call(this),function(){var e,n,o,i,r,s,a=function(t,e){return function(){return t.apply(e,arguments)}},u=function(t,e){function n(){this.constructor=t}for(var o in e)c.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},c={}.hasOwnProperty;n=t.handleEvent,r=t.makeElement,s=t.tagName,o=t.InputController.keyNames,i=t.config.lang,e=t.config.css.classNames,t.AttachmentEditorController=function(t){function c(t,e,n){this.attachmentPiece=t,this.element=e,this.container=n,this.uninstall=a(this.uninstall,this),this.didKeyDownCaption=a(this.didKeyDownCaption,this),this.didChangeCaption=a(this.didChangeCaption,this),this.didClickCaption=a(this.didClickCaption,this),this.didClickRemoveButton=a(this.didClickRemoveButton,this),this.attachment=this.attachmentPiece.attachment,"a"===s(this.element)&&(this.element=this.element.firstChild),this.install()}var l;return u(c,t),l=function(t){return function(){var e;return e=t.apply(this,arguments),e["do"](),null==this.undos&&(this.undos=[]),this.undos.push(e.undo)}},c.prototype.install=function(){return this.makeElementMutable(),this.attachment.isPreviewable()&&this.makeCaptionEditable(),this.addRemoveButton()},c.prototype.makeElementMutable=l(function(){return{"do":function(t){return function(){return t.element.dataset.trixMutable=!0}}(this),undo:function(t){return function(){return delete t.element.dataset.trixMutable}}(this)}}),c.prototype.makeCaptionEditable=l(function(){var t,e;return t=this.element.querySelector("figcaption"),e=null,{"do":function(o){return function(){return e=n("click",{onElement:t,withCallback:o.didClickCaption,inPhase:"capturing"})}}(this),undo:function(){return function(){return e.destroy()}}(this)}}),c.prototype.addRemoveButton=l(function(){var t;return t=r({tagName:"a",textContent:i.remove,className:e.attachment.removeButton,attributes:{href:"#",title:i.remove}}),n("click",{onElement:t,withCallback:this.didClickRemoveButton}),{"do":function(e){return function(){return e.element.appendChild(t)}}(this),undo:function(e){return function(){return e.element.removeChild(t)}}(this)}}),c.prototype.editCaption=l(function(){var t,o,s,a,u;return a=r({tagName:"textarea",className:e.attachment.captionEditor,attributes:{placeholder:i.captionPlaceholder}}),a.value=this.attachmentPiece.getCaption(),u=a.cloneNode(),u.classList.add("trix-autoresize-clone"),t=function(){return u.value=a.value,a.style.height=u.scrollHeight+"px"},n("input",{onElement:a,withCallback:t}),n("keydown",{onElement:a,withCallback:this.didKeyDownCaption}),n("change",{onElement:a,withCallback:this.didChangeCaption}),n("blur",{onElement:a,withCallback:this.uninstall}),s=this.element.querySelector("figcaption"),o=s.cloneNode(),{"do":function(){return s.style.display="none",o.appendChild(a),o.appendChild(u),o.classList.add(e.attachment.editingCaption),s.parentElement.insertBefore(o,s),t(),a.focus()},undo:function(){return o.parentNode.removeChild(o),s.style.display=null}}}),c.prototype.didClickRemoveButton=function(t){var e;return t.preventDefault(),t.stopPropagation(),null!=(e=this.delegate)?e.attachmentEditorDidRequestRemovalOfAttachment(this.attachment):void 0},c.prototype.didClickCaption=function(t){return t.preventDefault(),this.editCaption()},c.prototype.didChangeCaption=function(t){var e,n,o;return e=t.target.value.replace(/\s/g," ").trim(),e?null!=(n=this.delegate)&&"function"==typeof n.attachmentEditorDidRequestUpdatingAttributesForAttachment?n.attachmentEditorDidRequestUpdatingAttributesForAttachment({caption:e},this.attachment):void 0:null!=(o=this.delegate)&&"function"==typeof o.attachmentEditorDidRequestRemovingAttributeForAttachment?o.attachmentEditorDidRequestRemovingAttributeForAttachment("caption",this.attachment):void 0},c.prototype.didKeyDownCaption=function(t){var e;return"return"===o[t.keyCode]?(t.preventDefault(),this.didChangeCaption(t),null!=(e=this.delegate)&&"function"==typeof e.attachmentEditorDidRequestDeselectingAttachment?e.attachmentEditorDidRequestDeselectingAttachment(this.attachment):void 0):void 0},c.prototype.uninstall=function(){for(var t,e;e=this.undos.pop();)e();return null!=(t=this.delegate)?t.didUninstallAttachmentEditor(this):void 0},c}(t.BasicObject)}.call(this),function(){var e,n,o,i,r=function(t,e){function n(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},s={}.hasOwnProperty;o=t.makeElement,i=t.selectionElements,e=t.config.css.classNames,t.AttachmentView=function(t){function s(){s.__super__.constructor.apply(this,arguments),this.attachment=this.object,this.attachment.uploadProgressDelegate=this,this.attachmentPiece=this.options.piece}return r(s,t),s.attachmentSelector="[data-trix-attachment]",s.prototype.createContentNodes=function(){return[]},s.prototype.createNodes=function(){var t,n,r,s,a,u,c,l,h,p,d;if(s=o({tagName:"figure",className:this.getClassName()}),this.attachment.hasContent())s.innerHTML=this.attachment.getContent();else for(p=this.createContentNodes(),u=0,l=p.length;l>u;u++)h=p[u],s.appendChild(h);s.appendChild(this.createCaptionElement()),n={trixAttachment:JSON.stringify(this.attachment),trixContentType:this.attachment.getContentType(),trixId:this.attachment.id},t=this.attachmentPiece.getAttributesForAttachment(),t.isEmpty()||(n.trixAttributes=JSON.stringify(t)),this.attachment.isPending()&&(this.progressElement=o({tagName:"progress",attributes:{"class":e.attachment.progressBar,value:this.attachment.getUploadProgress(),max:100},data:{trixMutable:!0,trixStoreKey:this.attachment.getCacheKey("progressElement")}}),s.appendChild(this.progressElement),n.trixSerialize=!1),(a=this.getHref())?(r=o("a",{href:a}),r.appendChild(s)):r=s;for(c in n)d=n[c],r.dataset[c]=d;return r.setAttribute("contenteditable",!1),[i.create("cursorTarget"),r,i.create("cursorTarget")]},s.prototype.createCaptionElement=function(){var t,n,i,r,s;return n=o({tagName:"figcaption",className:e.attachment.caption}),(t=this.attachmentPiece.getCaption())?(n.classList.add(e.attachment.captionEdited),n.textContent=t):(i=this.attachment.getFilename())&&(n.textContent=i,(r=this.attachment.getFormattedFilesize())&&(n.appendChild(document.createTextNode(" ")),s=o({tagName:"span",className:e.attachment.size,textContent:r}),n.appendChild(s))),n},s.prototype.getClassName=function(){var t,n;return n=[e.attachment.container,""+e.attachment.typePrefix+this.attachment.getType()],(t=this.attachment.getExtension())&&n.push(t),n.join(" ")},s.prototype.getHref=function(){return n(this.attachment.getContent(),"a")?void 0:this.attachment.getHref()},s.prototype.findProgressElement=function(){var t;return null!=(t=this.findElement())?t.querySelector("progress"):void 0},s.prototype.attachmentDidChangeUploadProgress=function(){var t,e;return e=this.attachment.getUploadProgress(),null!=(t=this.findProgressElement())?t.value=e:void 0},s}(t.ObjectView),n=function(t,e){var n;return n=o("div"),n.innerHTML=null!=t?t:"",n.querySelector(e)}}.call(this),function(){var e,n,o,i=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty;e=t.defer,n=t.makeElement,o=t.measureElement,t.PreviewableAttachmentView=function(t){function e(){e.__super__.constructor.apply(this,arguments),this.attachment.previewDelegate=this}return i(e,t),e.prototype.createContentNodes=function(){return this.image=n({tagName:"img",attributes:{src:""},data:{trixMutable:!0,trixStoreKey:this.attachment.getCacheKey("imageElement")}}),this.refresh(this.image),[this.image]},e.prototype.refresh=function(t){var e;return null==t&&(t=null!=(e=this.findElement())?e.querySelector("img"):void 0),t?this.updateAttributesForImage(t):void 0},e.prototype.updateAttributesForImage=function(t){var e,n,o,i,r;return i=this.attachment.getURL(),n=this.attachment.getPreloadedURL(),t.src=n||i,n===i?t.removeAttribute("data-trix-serialized-attributes"):(o=JSON.stringify({src:i}),t.setAttribute("data-trix-serialized-attributes",o)),r=this.attachment.getWidth(),e=this.attachment.getHeight(),null!=r&&(t.width=r),null!=e?t.height=e:void 0},e.prototype.attachmentDidPreload=function(){return this.refresh(this.image),this.refresh()},e}(t.AttachmentView)}.call(this),function(){var e,n,o=function(t,e){function n(){this.constructor=t}for(var o in e)i.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},i={}.hasOwnProperty;n=t.makeElement,e=t.findInnerElement,t.PieceView=function(i){function r(){var t;r.__super__.constructor.apply(this,arguments),this.piece=this.object,this.attributes=this.piece.getAttributes(),t=this.options,this.textConfig=t.textConfig,this.context=t.context,this.piece.attachment?this.attachment=this.piece.attachment:this.string=this.piece.toString()}var s;return o(r,i),r.prototype.createNodes=function(){var t,n,o,i,r,s;if(s=this.attachment?this.createAttachmentNodes():this.createStringNodes(),t=this.createElement()){for(o=e(t),n=0,i=s.length;i>n;n++)r=s[n],o.appendChild(r);s=[t]}return s},r.prototype.createAttachmentNodes=function(){var e,n;return e=this.attachment.isPreviewable()?t.PreviewableAttachmentView:t.AttachmentView,n=this.createChildView(e,this.piece.attachment,{piece:this.piece}),n.getNodes()},r.prototype.createStringNodes=function(){var t,e,o,i,r,s,a,u,c,l;if(null!=(u=this.textConfig)?u.plaintext:void 0)return[document.createTextNode(this.string)];for(a=[],c=this.string.split("\n"),o=e=0,i=c.length;i>e;o=++e)l=c[o],o>0&&(t=n("br"),a.push(t)),(r=l.length)&&(s=document.createTextNode(this.preserveSpaces(l)),a.push(s));return a},r.prototype.createElement=function(){var e,o,i,r,s,a,u,c;for(r in this.attributes)if((e=t.config.textAttributes[r])&&(e.tagName&&(s=n(e.tagName),i?(i.appendChild(s),i=s):o=i=s),e.style))if(u){a=e.style;for(r in a)c=a[r],u[r]=c}else u=e.style;if(u){null==o&&(o=n("span"));for(r in u)c=u[r],o.style[r]=c}return o},r.prototype.createContainerElement=function(){var e,o,i,r,s;r=this.attributes;for(i in r)if(s=r[i],(o=t.config.textAttributes[i])&&o.groupTagName)return e={},e[i]=s,n(o.groupTagName,e)},s=t.NON_BREAKING_SPACE,r.prototype.preserveSpaces=function(t){return this.context.isLast&&(t=t.replace(/\ $/,s)),t=t.replace(/(\S)\ {3}(\S)/g,"$1 "+s+" $2").replace(/\ {2}/g,s+" ").replace(/\ {2}/g," "+s),(this.context.isFirst||this.context.followsWhitespace)&&(t=t.replace(/^\ /,s)),t},r}(t.ObjectView)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.TextView=function(n){function o(){o.__super__.constructor.apply(this,arguments),this.text=this.object,this.textConfig=this.options.textConfig}var i;return e(o,n),o.prototype.createNodes=function(){var e,n,o,r,s,a,u,c,l,h;for(a=[],c=t.ObjectGroup.groupObjects(this.getPieces()),r=c.length-1,o=n=0,s=c.length;s>n;o=++n)u=c[o],e={},0===o&&(e.isFirst=!0),o===r&&(e.isLast=!0),i(l)&&(e.followsWhitespace=!0),h=this.findOrCreateCachedChildView(t.PieceView,u,{textConfig:this.textConfig,context:e}),a.push.apply(a,h.getNodes()),l=u;return a},o.prototype.getPieces=function(){var t,e,n,o,i;for(o=this.text.getPieces(),i=[],t=0,e=o.length;e>t;t++)n=o[t],n.hasAttribute("blockBreak")||i.push(n);return i},i=function(t){return/\s$/.test(null!=t?t.toString():void 0)},o}(t.ObjectView)}.call(this),function(){var e,n=function(t,e){function n(){this.constructor=t}for(var i in e)o.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},o={}.hasOwnProperty;e=t.makeElement,t.BlockView=function(o){function i(){i.__super__.constructor.apply(this,arguments),this.block=this.object,this.attributes=this.block.getAttributes()}return n(i,o),i.prototype.createNodes=function(){var n,o,i,r,s,a,u,c,l;if(n=document.createComment("block"),a=[n],this.block.isEmpty()?a.push(e("br")):(c=null!=(u=t.config.blockAttributes[this.block.getLastAttribute()])?u.text:void 0,l=this.findOrCreateCachedChildView(t.TextView,this.block.text,{textConfig:c}),a.push.apply(a,l.getNodes()),this.shouldAddExtraNewlineElement()&&a.push(e("br"))),this.attributes.length)return a;for(o=e(t.config.blockAttributes["default"].tagName),i=0,r=a.length;r>i;i++)s=a[i],o.appendChild(s);return[o]},i.prototype.createContainerElement=function(n){var o,i;return o=this.attributes[n],i=t.config.blockAttributes[o],e(i.tagName)},i.prototype.shouldAddExtraNewlineElement=function(){return/\n\n$/.test(this.block.toString())},i}(t.ObjectView)}.call(this),function(){var e,n,o=function(t,e){function n(){this.constructor=t}for(var o in e)i.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},i={}.hasOwnProperty;e=t.defer,n=t.makeElement,t.DocumentView=function(i){function r(){r.__super__.constructor.apply(this,arguments),this.element=this.options.element,this.elementStore=new t.ElementStore,this.setDocument(this.object)}var s,a,u;return o(r,i),r.render=function(t){var e,o;return e=n("div"),o=new this(t,{element:e}),o.render(),o.sync(),e},r.prototype.setDocument=function(t){return t.isEqualTo(this.document)?void 0:this.document=this.object=t},r.prototype.render=function(){var e,o,i,r,s,a,u;if(this.childViews=[],this.shadowElement=n("div"),!this.document.isEmpty()){for(s=t.ObjectGroup.groupObjects(this.document.getBlocks(),{asTree:!0}),a=[],e=0,o=s.length;o>e;e++)r=s[e],u=this.findOrCreateCachedChildView(t.BlockView,r),a.push(function(){var t,e,n,o;for(n=u.getNodes(),o=[],t=0,e=n.length;e>t;t++)i=n[t],o.push(this.shadowElement.appendChild(i));return o}.call(this));return a}},r.prototype.isSynced=function(){return s(this.shadowElement,this.element)},r.prototype.sync=function(){var t;for(t=this.createDocumentFragmentForSync();this.element.lastChild;)this.element.removeChild(this.element.lastChild);return this.element.appendChild(t),this.didSync()},r.prototype.didSync=function(){return this.elementStore.reset(a(this.element)),e(function(t){return function(){return t.garbageCollectCachedViews()}}(this))},r.prototype.createDocumentFragmentForSync=function(){var t,e,n,o,i,r,s,u,c,l;for(e=document.createDocumentFragment(),u=this.shadowElement.childNodes,n=0,i=u.length;i>n;n++)s=u[n],e.appendChild(s.cloneNode(!0));for(c=a(e),o=0,r=c.length;r>o;o++)t=c[o],(l=this.elementStore.remove(t))&&t.parentNode.replaceChild(l,t);return e},a=function(t){return t.querySelectorAll("[data-trix-store-key]")},s=function(t,e){return u(t.innerHTML)===u(e.innerHTML)},u=function(t){return t.replace(/&nbsp;/g," ")},r}(t.ObjectView)}.call(this),function(){var e,n,o,i,r,s,a=function(t,e){return function(){return t.apply(e,arguments)}},u=function(t,e){function n(){this.constructor=t}for(var o in e)c.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},c={}.hasOwnProperty;i=t.handleEvent,s=t.tagName,o=t.findClosestElementFromNode,r=t.innerElementIsActive,n=t.defer,e=t.AttachmentView.attachmentSelector,t.CompositionController=function(o){function s(n,o){this.element=n,this.composition=o,this.didClickAttachment=a(this.didClickAttachment,this),this.didBlur=a(this.didBlur,this),this.didFocus=a(this.didFocus,this),this.documentView=new t.DocumentView(this.composition.document,{element:this.element}),i("focus",{onElement:this.element,withCallback:this.didFocus}),i("blur",{onElement:this.element,withCallback:this.didBlur}),i("click",{onElement:this.element,matchingSelector:"a[contenteditable=false]",preventDefault:!0}),i("mousedown",{onElement:this.element,matchingSelector:e,withCallback:this.didClickAttachment}),i("click",{onElement:this.element,matchingSelector:"a"+e,preventDefault:!0})}return u(s,o),s.prototype.didFocus=function(){var t;return this.focused?void 0:(this.focused=!0,null!=(t=this.delegate)&&"function"==typeof t.compositionControllerDidFocus?t.compositionControllerDidFocus():void 0)
},s.prototype.didBlur=function(){return n(function(t){return function(){var e;return r(t.element)?void 0:(t.focused=null,null!=(e=t.delegate)&&"function"==typeof e.compositionControllerDidBlur?e.compositionControllerDidBlur():void 0)}}(this))},s.prototype.didClickAttachment=function(t,e){var n,o;return n=this.findAttachmentForElement(e),null!=(o=this.delegate)&&"function"==typeof o.compositionControllerDidSelectAttachment?o.compositionControllerDidSelectAttachment(n):void 0},s.prototype.render=function(){var t,e,n;return this.revision!==this.composition.revision&&(this.documentView.setDocument(this.composition.document),this.documentView.render(),this.revision=this.composition.revision),this.documentView.isSynced()||(null!=(t=this.delegate)&&"function"==typeof t.compositionControllerWillSyncDocumentView&&t.compositionControllerWillSyncDocumentView(),this.documentView.sync(),this.reinstallAttachmentEditor(),null!=(e=this.delegate)&&"function"==typeof e.compositionControllerDidSyncDocumentView&&e.compositionControllerDidSyncDocumentView()),null!=(n=this.delegate)&&"function"==typeof n.compositionControllerDidRender?n.compositionControllerDidRender():void 0},s.prototype.rerenderViewForObject=function(t){return this.documentView.invalidateViewForObject(t),this.render()},s.prototype.isViewCachingEnabled=function(){return this.documentView.isViewCachingEnabled()},s.prototype.enableViewCaching=function(){return this.documentView.enableViewCaching()},s.prototype.disableViewCaching=function(){return this.documentView.disableViewCaching()},s.prototype.refreshViewCache=function(){return this.documentView.garbageCollectCachedViews()},s.prototype.installAttachmentEditorForAttachment=function(e){var n,o,i;if((null!=(i=this.attachmentEditor)?i.attachment:void 0)!==e&&(o=this.documentView.findElementForObject(e)))return this.uninstallAttachmentEditor(),n=this.composition.document.getAttachmentPieceForAttachment(e),this.attachmentEditor=new t.AttachmentEditorController(n,o,this.element),this.attachmentEditor.delegate=this},s.prototype.uninstallAttachmentEditor=function(){var t;return null!=(t=this.attachmentEditor)?t.uninstall():void 0},s.prototype.reinstallAttachmentEditor=function(){var t;return this.attachmentEditor?(t=this.attachmentEditor.attachment,this.uninstallAttachmentEditor(),this.installAttachmentEditorForAttachment(t)):void 0},s.prototype.editAttachmentCaption=function(){var t;return null!=(t=this.attachmentEditor)?t.editCaption():void 0},s.prototype.didUninstallAttachmentEditor=function(){return this.attachmentEditor=null,this.render()},s.prototype.attachmentEditorDidRequestUpdatingAttributesForAttachment=function(t,e){var n;return null!=(n=this.delegate)&&"function"==typeof n.compositionControllerWillUpdateAttachment&&n.compositionControllerWillUpdateAttachment(e),this.composition.updateAttributesForAttachment(t,e)},s.prototype.attachmentEditorDidRequestRemovingAttributeForAttachment=function(t,e){var n;return null!=(n=this.delegate)&&"function"==typeof n.compositionControllerWillUpdateAttachment&&n.compositionControllerWillUpdateAttachment(e),this.composition.removeAttributeForAttachment(t,e)},s.prototype.attachmentEditorDidRequestRemovalOfAttachment=function(t){var e;return null!=(e=this.delegate)&&"function"==typeof e.compositionControllerDidRequestRemovalOfAttachment?e.compositionControllerDidRequestRemovalOfAttachment(t):void 0},s.prototype.attachmentEditorDidRequestDeselectingAttachment=function(t){var e;return null!=(e=this.delegate)&&"function"==typeof e.compositionControllerDidRequestDeselectingAttachment?e.compositionControllerDidRequestDeselectingAttachment(t):void 0},s.prototype.findAttachmentForElement=function(t){return this.composition.document.getAttachmentById(parseInt(t.dataset.trixId,10))},s}(t.BasicObject)}.call(this),function(){var e,n,o,i=function(t,e){return function(){return t.apply(e,arguments)}},r=function(t,e){function n(){this.constructor=t}for(var o in e)s.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},s={}.hasOwnProperty;n=t.handleEvent,o=t.triggerEvent,e=t.findClosestElementFromNode,t.ToolbarController=function(t){function s(t){this.element=t,this.didKeyDownDialogInput=i(this.didKeyDownDialogInput,this),this.didClickDialogButton=i(this.didClickDialogButton,this),this.didClickAttributeButton=i(this.didClickAttributeButton,this),this.didClickActionButton=i(this.didClickActionButton,this),this.attributes={},this.actions={},this.resetDialogInputs(),n("mousedown",{onElement:this.element,matchingSelector:a,withCallback:this.didClickActionButton}),n("mousedown",{onElement:this.element,matchingSelector:c,withCallback:this.didClickAttributeButton}),n("click",{onElement:this.element,matchingSelector:y,preventDefault:!0}),n("click",{onElement:this.element,matchingSelector:l,withCallback:this.didClickDialogButton}),n("keydown",{onElement:this.element,matchingSelector:h,withCallback:this.didKeyDownDialogInput})}var a,u,c,l,h,p,d,f,g,m,y;return r(s,t),a="button[data-trix-action]",c="button[data-trix-attribute]",y=[a,c].join(", "),p=".dialog[data-trix-dialog]",u=p+".active",l=p+" input[data-trix-method]",h=p+" input[type=text], "+p+" input[type=url]",s.prototype.didClickActionButton=function(t,e){var n,o,i;return null!=(o=this.delegate)&&o.toolbarDidClickButton(),t.preventDefault(),n=d(e),this.getDialog(n)?this.toggleDialog(n):null!=(i=this.delegate)?i.toolbarDidInvokeAction(n):void 0},s.prototype.didClickAttributeButton=function(t,e){var n,o,i;return null!=(o=this.delegate)&&o.toolbarDidClickButton(),t.preventDefault(),n=f(e),this.getDialog(n)?this.toggleDialog(n):null!=(i=this.delegate)&&i.toolbarDidToggleAttribute(n),this.refreshAttributeButtons()},s.prototype.didClickDialogButton=function(t,n){var o,i;return o=e(n,{matchingSelector:p}),i=n.getAttribute("data-trix-method"),this[i].call(this,o)},s.prototype.didKeyDownDialogInput=function(t,e){var n,o;return 13===t.keyCode&&(t.preventDefault(),n=e.getAttribute("name"),o=this.getDialog(n),this.setAttribute(o)),27===t.keyCode?(t.preventDefault(),this.hideDialog()):void 0},s.prototype.updateActions=function(t){return this.actions=t,this.refreshActionButtons()},s.prototype.refreshActionButtons=function(){return this.eachActionButton(function(t){return function(e,n){return e.disabled=t.actions[n]===!1}}(this))},s.prototype.eachActionButton=function(t){var e,n,o,i,r;for(i=this.element.querySelectorAll(a),r=[],n=0,o=i.length;o>n;n++)e=i[n],r.push(t(e,d(e)));return r},s.prototype.updateAttributes=function(t){return this.attributes=t,this.refreshAttributeButtons()},s.prototype.refreshAttributeButtons=function(){return this.eachAttributeButton(function(t){return function(e,n){return t.attributes[n]||t.dialogIsVisible(n)?e.classList.add("active"):e.classList.remove("active")}}(this))},s.prototype.eachAttributeButton=function(t){var e,n,o,i,r;for(i=this.element.querySelectorAll(c),r=[],n=0,o=i.length;o>n;n++)e=i[n],r.push(t(e,f(e)));return r},s.prototype.applyKeyboardCommand=function(t){var e,n,i,r,s,a,u;for(s=JSON.stringify(t.sort()),u=this.element.querySelectorAll("[data-trix-key]"),r=0,a=u.length;a>r;r++)if(e=u[r],i=e.getAttribute("data-trix-key").split("+"),n=JSON.stringify(i.sort()),n===s)return o("mousedown",{onElement:e}),!0;return!1},s.prototype.dialogIsVisible=function(t){var e;return(e=this.getDialog(t))?e.classList.contains("active"):void 0},s.prototype.toggleDialog=function(t){return this.dialogIsVisible(t)?this.hideDialog():this.showDialog(t)},s.prototype.showDialog=function(t){var e,n,o,i,r,s,a,u,c,l;for(this.hideDialog(),null!=(a=this.delegate)&&a.toolbarWillShowDialog(),o=this.getDialog(t),o.classList.add("active"),u=o.querySelectorAll("input[disabled]"),i=0,s=u.length;s>i;i++)n=u[i],n.removeAttribute("disabled");return(e=f(o))&&(r=m(o,t))&&(r.value=null!=(c=this.attributes[e])?c:"",r.select()),null!=(l=this.delegate)?l.toolbarDidShowDialog(t):void 0},s.prototype.setAttribute=function(t){var e,n,o;return e=f(t),n=m(t,e),n.willValidate&&!n.checkValidity()?(n.classList.add("validate"),n.focus()):(null!=(o=this.delegate)&&o.toolbarDidUpdateAttribute(e,n.value),this.hideDialog())},s.prototype.removeAttribute=function(t){var e,n;return e=f(t),null!=(n=this.delegate)&&n.toolbarDidRemoveAttribute(e),this.hideDialog()},s.prototype.hideDialog=function(){var t,e;return(t=this.element.querySelector(u))?(t.classList.remove("active"),this.resetDialogInputs(),null!=(e=this.delegate)?e.toolbarDidHideDialog(g(t)):void 0):void 0},s.prototype.resetDialogInputs=function(){var t,e,n,o,i;for(o=this.element.querySelectorAll(h),i=[],t=0,n=o.length;n>t;t++)e=o[t],e.setAttribute("disabled","disabled"),i.push(e.classList.remove("validate"));return i},s.prototype.getDialog=function(t){return this.element.querySelector(".dialog[data-trix-dialog="+t+"]")},m=function(t,e){return null==e&&(e=f(t)),t.querySelector("input[name='"+e+"']")},d=function(t){return t.getAttribute("data-trix-action")},f=function(t){return t.getAttribute("data-trix-attribute")},g=function(t){return t.getAttribute("data-trix-dialog")},s}(t.BasicObject)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.ImagePreloadOperation=function(t){function n(t){this.url=t}return e(n,t),n.prototype.perform=function(t){var e;return e=new Image,e.onload=function(n){return function(){return e.width=n.width=e.naturalWidth,e.height=n.height=e.naturalHeight,t(!0,e)}}(this),e.onerror=function(){return t(!1)},e.src=this.url},n}(t.Operation)}.call(this),function(){var e=function(t,e){return function(){return t.apply(e,arguments)}},n=function(t,e){function n(){this.constructor=t}for(var i in e)o.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},o={}.hasOwnProperty;t.Attachment=function(o){function i(n){null==n&&(n={}),this.releaseFile=e(this.releaseFile,this),i.__super__.constructor.apply(this,arguments),this.attributes=t.Hash.box(n),this.didChangeAttributes()}return n(i,o),i.previewablePattern=/^image(\/(gif|png|jpe?g)|$)/,i.attachmentForFile=function(t){var e,n;return n=this.attributesForFile(t),e=new this(n),e.setFile(t),e},i.attributesForFile=function(e){return new t.Hash({filename:e.name,filesize:e.size,contentType:e.type})},i.fromJSON=function(t){return new this(t)},i.prototype.getAttribute=function(t){return this.attributes.get(t)},i.prototype.hasAttribute=function(t){return this.attributes.has(t)},i.prototype.getAttributes=function(){return this.attributes.toObject()},i.prototype.setAttributes=function(t){var e,n;return null==t&&(t={}),e=this.attributes.merge(t),this.attributes.isEqualTo(e)?void 0:(this.attributes=e,this.didChangeAttributes(),null!=(n=this.delegate)&&"function"==typeof n.attachmentDidChangeAttributes?n.attachmentDidChangeAttributes(this):void 0)},i.prototype.didChangeAttributes=function(){return this.isPreviewable()?this.preloadURL():void 0},i.prototype.isPending=function(){return null!=this.file&&!(this.getURL()||this.getHref())},i.prototype.isPreviewable=function(){return this.attributes.has("previewable")?this.attributes.get("previewable"):this.constructor.previewablePattern.test(this.getContentType())},i.prototype.getType=function(){return this.hasContent()?"content":this.isPreviewable()?"preview":"file"},i.prototype.getURL=function(){return this.attributes.get("url")},i.prototype.getHref=function(){return this.attributes.get("href")},i.prototype.getFilename=function(){var t;return null!=(t=this.attributes.get("filename"))?t:""},i.prototype.getFilesize=function(){return this.attributes.get("filesize")},i.prototype.getFormattedFilesize=function(){var e;return e=this.attributes.get("filesize"),"number"==typeof e?t.config.fileSize.formatter(e):""},i.prototype.getExtension=function(){var t;return null!=(t=this.getFilename().match(/\.(\w+)$/))?t[1].toLowerCase():void 0},i.prototype.getContentType=function(){return this.attributes.get("contentType")},i.prototype.hasContent=function(){return this.attributes.has("content")},i.prototype.getContent=function(){return this.attributes.get("content")},i.prototype.getWidth=function(){return this.attributes.get("width")},i.prototype.getHeight=function(){return this.attributes.get("height")},i.prototype.getFile=function(){return this.file},i.prototype.setFile=function(t){return this.file=t,this.isPreviewable()?this.preloadFile():void 0},i.prototype.releaseFile=function(){return this.releasePreloadedFile(),this.file=null},i.prototype.getUploadProgress=function(){var t;return null!=(t=this.uploadProgress)?t:0},i.prototype.setUploadProgress=function(t){var e;return this.uploadProgress!==t?(this.uploadProgress=t,null!=(e=this.uploadProgressDelegate)&&"function"==typeof e.attachmentDidChangeUploadProgress?e.attachmentDidChangeUploadProgress(this):void 0):void 0},i.prototype.toJSON=function(){return this.getAttributes()},i.prototype.getCacheKey=function(t){var e;return e=[i.__super__.getCacheKey.apply(this,arguments),this.attributes.getCacheKey(),this.getPreloadedURL()],t&&e.unshift(t),e.join("/")},i.prototype.getPreloadedURL=function(){return this.preloadedURL},i.prototype.preloadURL=function(){return this.preload(this.getURL(),this.releaseFile)},i.prototype.preloadFile=function(){return this.file?(this.fileObjectURL=URL.createObjectURL(this.file),this.preload(this.fileObjectURL)):void 0},i.prototype.releasePreloadedFile=function(){return this.fileObjectURL?(URL.revokeObjectURL(this.fileObjectURL),this.fileObjectURL=null):void 0},i.prototype.preload=function(e,n){var o;return e&&e!==this.preloadedURL?(null==this.preloadedURL&&(this.preloadedURL=e),o=new t.ImagePreloadOperation(e),o.then(function(t){return function(o){var i,r,s;return s=o.width,i=o.height,t.preloadedURL=e,t.setAttributes({width:s,height:i}),null!=(r=t.previewDelegate)&&"function"==typeof r.attachmentDidPreload&&r.attachmentDidPreload(),"function"==typeof n?n():void 0}}(this))):void 0},i}(t.Object)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.Piece=function(n){function o(e,n){null==n&&(n={}),o.__super__.constructor.apply(this,arguments),this.attributes=t.Hash.box(n)}return e(o,n),o.types={},o.registerType=function(t,e){return e.type=t,this.types[t]=e},o.fromJSON=function(t){var e;return(e=this.types[t.type])?e.fromJSON(t):void 0},o.prototype.copyWithAttributes=function(t){return new this.constructor(this.getValue(),t)},o.prototype.copyWithAdditionalAttributes=function(t){return this.copyWithAttributes(this.attributes.merge(t))},o.prototype.copyWithoutAttribute=function(t){return this.copyWithAttributes(this.attributes.remove(t))},o.prototype.copy=function(){return this.copyWithAttributes(this.attributes)},o.prototype.getAttribute=function(t){return this.attributes.get(t)},o.prototype.getAttributesHash=function(){return this.attributes},o.prototype.getAttributes=function(){return this.attributes.toObject()},o.prototype.getCommonAttributes=function(){var t,e,n;return(n=pieceList.getPieceAtIndex(0))?(t=n.attributes,e=t.getKeys(),pieceList.eachPiece(function(n){return e=t.getKeysCommonToHash(n.attributes),t=t.slice(e)}),t.toObject()):{}},o.prototype.hasAttribute=function(t){return this.attributes.has(t)},o.prototype.hasSameStringValueAsPiece=function(t){return null!=t&&this.toString()===t.toString()},o.prototype.hasSameAttributesAsPiece=function(t){return null!=t&&(this.attributes===t.attributes||this.attributes.isEqualTo(t.attributes))},o.prototype.isBlockBreak=function(){return!1},o.prototype.isEqualTo=function(t){return o.__super__.isEqualTo.apply(this,arguments)||this.hasSameConstructorAs(t)&&this.hasSameStringValueAsPiece(t)&&this.hasSameAttributesAsPiece(t)},o.prototype.isEmpty=function(){return 0===this.length},o.prototype.isSerializable=function(){return!0},o.prototype.toJSON=function(){return{type:this.constructor.type,attributes:this.getAttributes()}},o.prototype.contentsForInspection=function(){return{type:this.constructor.type,attributes:this.attributes.inspect()}},o.prototype.canBeGrouped=function(){return this.hasAttribute("href")},o.prototype.canBeGroupedWith=function(t){return this.getAttribute("href")===t.getAttribute("href")},o.prototype.getLength=function(){return this.length},o.prototype.canBeConsolidatedWith=function(){return!1},o}(t.Object)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.Piece.registerType("attachment",t.AttachmentPiece=function(n){function o(t){this.attachment=t,o.__super__.constructor.apply(this,arguments),this.length=1,this.ensureAttachmentExclusivelyHasAttribute("href")}return e(o,n),o.fromJSON=function(e){return new this(t.Attachment.fromJSON(e.attachment),e.attributes)},o.prototype.ensureAttachmentExclusivelyHasAttribute=function(t){return this.hasAttribute(t)&&this.attachment.hasAttribute(t)?this.attributes=this.attributes.remove(t):void 0},o.prototype.getValue=function(){return this.attachment},o.prototype.isSerializable=function(){return!this.attachment.isPending()},o.prototype.getCaption=function(){var t;return null!=(t=this.attributes.get("caption"))?t:""},o.prototype.getAttributesForAttachment=function(){return this.attributes.slice(["caption"])},o.prototype.canBeGrouped=function(){return o.__super__.canBeGrouped.apply(this,arguments)&&!this.attachment.hasAttribute("href")},o.prototype.isEqualTo=function(t){var e;return o.__super__.isEqualTo.apply(this,arguments)&&this.attachment.id===(null!=t&&null!=(e=t.attachment)?e.id:void 0)},o.prototype.toString=function(){return t.OBJECT_REPLACEMENT_CHARACTER},o.prototype.toJSON=function(){var t;return t=o.__super__.toJSON.apply(this,arguments),t.attachment=this.attachment,t},o.prototype.getCacheKey=function(){return[o.__super__.getCacheKey.apply(this,arguments),this.attachment.getCacheKey()].join("/")},o.prototype.toConsole=function(){return JSON.stringify(this.toString())},o}(t.Piece))}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.Piece.registerType("string",t.StringPiece=function(t){function n(t){n.__super__.constructor.apply(this,arguments),this.string=t,this.length=this.string.length}return e(n,t),n.fromJSON=function(t){return new this(t.string,t.attributes)},n.prototype.getValue=function(){return this.string},n.prototype.toString=function(){return this.string.toString()},n.prototype.isBlockBreak=function(){return"\n"===this.toString()&&this.getAttribute("blockBreak")===!0},n.prototype.toJSON=function(){var t;return t=n.__super__.toJSON.apply(this,arguments),t.string=this.string,t},n.prototype.canBeConsolidatedWith=function(t){return null!=t&&this.hasSameConstructorAs(t)&&this.hasSameAttributesAsPiece(t)},n.prototype.consolidateWith=function(t){return new this.constructor(this.toString()+t.toString(),this.attributes)},n.prototype.splitAtOffset=function(t){var e,n;return 0===t?(e=null,n=this):t===this.length?(e=this,n=null):(e=new this.constructor(this.string.slice(0,t),this.attributes),n=new this.constructor(this.string.slice(t),this.attributes)),[e,n]},n.prototype.toConsole=function(){var t;return t=this.string,t.length>15&&(t=t.slice(0,14)+"\u2026"),JSON.stringify(t.toString())},n}(t.Piece))}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty,o=[].slice;t.SplittableList=function(t){function n(t){null==t&&(t=[]),n.__super__.constructor.apply(this,arguments),this.objects=t.slice(0),this.length=this.objects.length}var i,r,s;return e(n,t),n.box=function(t){return t instanceof this?t:new this(t)},n.prototype.eachObject=function(t){var e,n,o,i,r,s;for(r=this.objects,s=[],n=e=0,o=r.length;o>e;n=++e)i=r[n],s.push(t(i,n));return s},n.prototype.insertObjectAtIndex=function(t,e){var n;return n=this.objects.slice(0),n.splice(e,0,t),new this.constructor(n)},n.prototype.insertSplittableListAtIndex=function(t,e){var n;return n=this.objects.slice(0),n.splice.apply(n,[e,0].concat(o.call(t.objects))),new this.constructor(n)},n.prototype.insertSplittableListAtPosition=function(t,e){var n,o,i;return i=this.splitObjectAtPosition(e),o=i[0],n=i[1],new this.constructor(o).insertSplittableListAtIndex(t,n)},n.prototype.editObjectAtIndex=function(t,e){return this.replaceObjectAtIndex(e(this.objects[t]),t)},n.prototype.replaceObjectAtIndex=function(t,e){var n;return n=this.objects.slice(0),n.splice(e,1,t),new this.constructor(n)},n.prototype.removeObjectAtIndex=function(t){var e;return e=this.objects.slice(0),e.splice(t,1),new this.constructor(e)},n.prototype.getObjectAtIndex=function(t){return this.objects[t]},n.prototype.getSplittableListInRange=function(t){var e,n,o,i;return o=this.splitObjectsAtRange(t),n=o[0],e=o[1],i=o[2],new this.constructor(n.slice(e,i+1))},n.prototype.selectSplittableList=function(t){var e,n;return n=function(){var n,o,i,r;for(i=this.objects,r=[],n=0,o=i.length;o>n;n++)e=i[n],t(e)&&r.push(e);return r}.call(this),new this.constructor(n)},n.prototype.removeObjectsInRange=function(t){var e,n,o,i;return o=this.splitObjectsAtRange(t),n=o[0],e=o[1],i=o[2],n.splice(e,i-e+1),new this.constructor(n)},n.prototype.transformObjectsInRange=function(t,e){var n,o,i,r,s,a,u;return s=this.splitObjectsAtRange(t),r=s[0],o=s[1],a=s[2],u=function(){var t,s,u;for(u=[],n=t=0,s=r.length;s>t;n=++t)i=r[n],u.push(n>=o&&a>=n?e(i):i);return u}(),new this.constructor(u)},n.prototype.splitObjectsAtRange=function(t){var e,n,o,r,a,u;return r=this.splitObjectAtPosition(s(t)),n=r[0],e=r[1],o=r[2],a=new this.constructor(n).splitObjectAtPosition(i(t)+o),n=a[0],u=a[1],[n,e,u-1]},n.prototype.getObjectAtPosition=function(t){var e,n,o;return o=this.findIndexAndOffsetAtPosition(t),e=o.index,n=o.offset,this.objects[e]},n.prototype.splitObjectAtPosition=function(t){var e,n,o,i,r,s,a,u,c,l;return s=this.findIndexAndOffsetAtPosition(t),e=s.index,r=s.offset,i=this.objects.slice(0),null!=e?0===r?(c=e,l=0):(o=this.getObjectAtIndex(e),a=o.splitAtOffset(r),n=a[0],u=a[1],i.splice(e,1,n,u),c=e+1,l=n.getLength()-r):(c=i.length,l=0),[i,c,l]},n.prototype.consolidate=function(){var t,e,n,o,i,r;for(o=[],i=this.objects[0],r=this.objects.slice(1),t=0,e=r.length;e>t;t++)n=r[t],("function"==typeof i.canBeConsolidatedWith?i.canBeConsolidatedWith(n):void 0)?i=i.consolidateWith(n):(o.push(i),i=n);return null!=i&&o.push(i),new this.constructor(o)},n.prototype.consolidateFromIndexToIndex=function(t,e){var n,i,r;return i=this.objects.slice(0),r=i.slice(t,e+1),n=new this.constructor(r).consolidate().toArray(),i.splice.apply(i,[t,r.length].concat(o.call(n))),new this.constructor(i)},n.prototype.findIndexAndOffsetAtPosition=function(t){var e,n,o,i,r,s,a;for(e=0,a=this.objects,o=n=0,i=a.length;i>n;o=++n){if(s=a[o],r=e+s.getLength(),t>=e&&r>t)return{index:o,offset:t-e};e=r}return{index:null,offset:null}},n.prototype.findPositionAtIndexAndOffset=function(t,e){var n,o,i,r,s,a;for(s=0,a=this.objects,n=o=0,i=a.length;i>o;n=++o)if(r=a[n],t>n)s+=r.getLength();else if(n===t){s+=e;break}return s},n.prototype.getEndPosition=function(){var t,e;return null!=this.endPosition?this.endPosition:this.endPosition=function(){var n,o,i;for(e=0,i=this.objects,n=0,o=i.length;o>n;n++)t=i[n],e+=t.getLength();return e}.call(this)},n.prototype.toString=function(){return this.objects.join("")},n.prototype.toArray=function(){return this.objects.slice(0)},n.prototype.toJSON=function(){return this.toArray()},n.prototype.isEqualTo=function(t){return n.__super__.isEqualTo.apply(this,arguments)||r(this.objects,null!=t?t.objects:void 0)},r=function(t,e){var n,o,i,r,s;if(null==e&&(e=[]),t.length!==e.length)return!1;for(s=!0,o=n=0,i=t.length;i>n;o=++n)r=t[o],s&&!r.isEqualTo(e[o])&&(s=!1);return s},n.prototype.contentsForInspection=function(){var t;return{objects:"["+function(){var e,n,o,i;for(o=this.objects,i=[],e=0,n=o.length;n>e;e++)t=o[e],i.push(t.inspect());return i}.call(this).join(", ")+"]"}},s=function(t){return t[0]},i=function(t){return t[1]},n}(t.Object)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.Text=function(n){function o(e){var n;null==e&&(e=[]),o.__super__.constructor.apply(this,arguments),this.pieceList=new t.SplittableList(function(){var t,o,i;for(i=[],t=0,o=e.length;o>t;t++)n=e[t],n.isEmpty()||i.push(n);return i}())}return e(o,n),o.textForAttachmentWithAttributes=function(e,n){var o;return o=new t.AttachmentPiece(e,n),new this([o])},o.textForStringWithAttributes=function(e,n){var o;return o=new t.StringPiece(e,n),new this([o])},o.fromJSON=function(e){var n,o;return o=function(){var o,i,r;for(r=[],o=0,i=e.length;i>o;o++)n=e[o],r.push(t.Piece.fromJSON(n));return r}(),new this(o)},o.prototype.copy=function(){return this.copyWithPieceList(this.pieceList)},o.prototype.copyWithPieceList=function(t){return new this.constructor(t.consolidate().toArray())},o.prototype.copyUsingObjectMap=function(t){var e,n;return n=function(){var n,o,i,r,s;for(i=this.getPieces(),s=[],n=0,o=i.length;o>n;n++)e=i[n],s.push(null!=(r=t.find(e))?r:e);return s}.call(this),new this.constructor(n)},o.prototype.appendText=function(t){return this.insertTextAtPosition(t,this.getLength())},o.prototype.insertTextAtPosition=function(t,e){return this.copyWithPieceList(this.pieceList.insertSplittableListAtPosition(t.pieceList,e))},o.prototype.removeTextAtRange=function(t){return this.copyWithPieceList(this.pieceList.removeObjectsInRange(t))},o.prototype.replaceTextAtRange=function(t,e){return this.removeTextAtRange(e).insertTextAtPosition(t,e[0])},o.prototype.moveTextFromRangeToPosition=function(t,e){var n,o;if(!(t[0]<=e&&e<=t[1]))return o=this.getTextAtRange(t),n=o.getLength(),t[0]<e&&(e-=n),this.removeTextAtRange(t).insertTextAtPosition(o,e)},o.prototype.addAttributeAtRange=function(t,e,n){var o;return o={},o[t]=e,this.addAttributesAtRange(o,n)},o.prototype.addAttributesAtRange=function(t,e){return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e,function(e){return e.copyWithAdditionalAttributes(t)}))},o.prototype.removeAttributeAtRange=function(t,e){return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e,function(e){return e.copyWithoutAttribute(t)}))},o.prototype.setAttributesAtRange=function(t,e){return this.copyWithPieceList(this.pieceList.transformObjectsInRange(e,function(e){return e.copyWithAttributes(t)}))},o.prototype.getAttributesAtPosition=function(t){var e,n;return null!=(e=null!=(n=this.pieceList.getObjectAtPosition(t))?n.getAttributes():void 0)?e:{}},o.prototype.getCommonAttributes=function(){var e,n;return e=function(){var t,e,o,i;for(o=this.pieceList.toArray(),i=[],t=0,e=o.length;e>t;t++)n=o[t],i.push(n.getAttributes());return i}.call(this),t.Hash.fromCommonAttributesOfObjects(e).toObject()},o.prototype.getCommonAttributesAtRange=function(t){var e;return null!=(e=this.getTextAtRange(t).getCommonAttributes())?e:{}},o.prototype.getExpandedRangeForAttributeAtOffset=function(t,e){var n,o,i;for(n=i=e,o=this.getLength();n>0&&this.getCommonAttributesAtRange([n-1,i])[t];)n--;for(;o>i&&this.getCommonAttributesAtRange([e,i+1])[t];)i++;return[n,i]},o.prototype.getTextAtRange=function(t){return this.copyWithPieceList(this.pieceList.getSplittableListInRange(t))},o.prototype.getStringAtRange=function(t){return this.pieceList.getSplittableListInRange(t).toString()},o.prototype.startsWithString=function(t){return this.getStringAtRange([0,t.length])===t},o.prototype.endsWithString=function(t){var e;return e=this.getLength(),this.getStringAtRange([e-t.length,e])===t},o.prototype.getAttachmentPieces=function(){var t,e,n,o,i;for(o=this.pieceList.toArray(),i=[],t=0,e=o.length;e>t;t++)n=o[t],null!=n.attachment&&i.push(n);return i},o.prototype.getAttachments=function(){var t,e,n,o,i;for(o=this.getAttachmentPieces(),i=[],t=0,e=o.length;e>t;t++)n=o[t],i.push(n.attachment);return i},o.prototype.getAttachmentAndPositionById=function(t){var e,n,o,i,r,s;for(i=0,r=this.pieceList.toArray(),e=0,n=r.length;n>e;e++){if(o=r[e],(null!=(s=o.attachment)?s.id:void 0)===t)return{attachment:o.attachment,position:i};i+=o.length}return{attachment:null,position:null}},o.prototype.getAttachmentById=function(t){var e,n,o;return o=this.getAttachmentAndPositionById(t),e=o.attachment,n=o.position,e},o.prototype.getRangeOfAttachment=function(t){var e,n;return n=this.getAttachmentAndPositionById(t.id),t=n.attachment,e=n.position,null!=t?[e,e+1]:void 0},o.prototype.updateAttributesForAttachment=function(t,e){var n;return(n=this.getRangeOfAttachment(e))?this.addAttributesAtRange(t,n):this},o.prototype.getLength=function(){return this.pieceList.getEndPosition()},o.prototype.isEmpty=function(){return 0===this.getLength()},o.prototype.isEqualTo=function(t){var e;return o.__super__.isEqualTo.apply(this,arguments)||(null!=t&&null!=(e=t.pieceList)?e.isEqualTo(this.pieceList):void 0)},o.prototype.isBlockBreak=function(){return 1===this.getLength()&&this.pieceList.getObjectAtIndex(0).isBlockBreak()},o.prototype.eachPiece=function(t){return this.pieceList.eachObject(t)},o.prototype.getPieces=function(){return this.pieceList.toArray()},o.prototype.getPieceAtPosition=function(t){return this.pieceList.getObjectAtPosition(t)},o.prototype.contentsForInspection=function(){return{pieceList:this.pieceList.inspect()}},o.prototype.toSerializableText=function(){var t;return t=this.pieceList.selectSplittableList(function(t){return t.isSerializable()}),this.copyWithPieceList(t)},o.prototype.toString=function(){return this.pieceList.toString()},o.prototype.toJSON=function(){return this.pieceList.toJSON()},o.prototype.toConsole=function(){var t;return JSON.stringify(function(){var e,n,o,i;for(o=this.pieceList.toArray(),i=[],e=0,n=o.length;n>e;e++)t=o[e],i.push(JSON.parse(t.toConsole()));return i}.call(this))},o}(t.Object)}.call(this),function(){var e,n=function(t,e){function n(){this.constructor=t}for(var i in e)o.call(e,i)&&(t[i]=e[i]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},o={}.hasOwnProperty,i=[].slice;e=t.arraysAreEqual,t.Block=function(o){function r(e,n){null==e&&(e=new t.Text),null==n&&(n=[]),r.__super__.constructor.apply(this,arguments),this.text=a(e),this.attributes=n}var s,a,u,c,l,h,p,d;return n(r,o),r.fromJSON=function(e){var n;return n=t.Text.fromJSON(e.text),new this(n,e.attributes)},r.prototype.isEmpty=function(){return this.text.isBlockBreak()},r.prototype.isEqualTo=function(t){return r.__super__.isEqualTo.apply(this,arguments)||this.text.isEqualTo(null!=t?t.text:void 0)&&e(this.attributes,null!=t?t.attributes:void 0)},r.prototype.copyWithText=function(t){return new this.constructor(t,this.attributes)},r.prototype.copyWithoutText=function(){return this.copyWithText(null)},r.prototype.copyWithAttributes=function(t){return new this.constructor(this.text,t)},r.prototype.copyUsingObjectMap=function(t){var e;return this.copyWithText((e=t.find(this.text))?e:this.text.copyUsingObjectMap(t))},r.prototype.addAttribute=function(e){var n,o;return o=t.config.blockAttributes[e].listAttribute,n=this.attributes.concat(o?[o,e]:[e]),this.copyWithAttributes(n)},r.prototype.removeAttribute=function(e){var n,o;return o=t.config.blockAttributes[e].listAttribute,n=l(this.attributes,e),null!=o&&(n=l(n,o)),this.copyWithAttributes(n)},r.prototype.removeLastAttribute=function(){return this.removeAttribute(this.getLastAttribute())},r.prototype.getLastAttribute=function(){return c(this.attributes)},r.prototype.getAttributes=function(){return this.attributes.slice(0)},r.prototype.getAttributeLevel=function(){return this.attributes.length},r.prototype.getAttributeAtLevel=function(t){return this.attributes[t-1]},r.prototype.hasAttributes=function(){return this.getAttributeLevel()>0},r.prototype.getConfig=function(e){var n,o;if((n=this.getLastAttribute())&&(o=t.config.blockAttributes[n]))return e?o[e]:o},r.prototype.isListItem=function(){return null!=this.getConfig("listAttribute")},r.prototype.findLineBreakInDirectionFromPosition=function(t,e){var n,o;return o=this.toString(),n=function(){switch(t){case"forward":return o.indexOf("\n",e);case"backward":return o.slice(0,e).lastIndexOf("\n")}}(),-1!==n?n:void 0},r.prototype.contentsForInspection=function(){return{text:this.text.inspect(),attributes:this.attributes}
},r.prototype.toString=function(){return this.text.toString()},r.prototype.toJSON=function(){return{text:this.text,attributes:this.attributes}},r.prototype.getLength=function(){return this.text.getLength()},r.prototype.canBeConsolidatedWith=function(t){return!this.hasAttributes()&&!t.hasAttributes()},r.prototype.consolidateWith=function(e){var n,o;return n=t.Text.textForStringWithAttributes("\n"),o=this.getTextWithoutBlockBreak().appendText(n),this.copyWithText(o.appendText(e.text))},r.prototype.splitAtOffset=function(t){var e,n;return 0===t?(e=null,n=this):t===this.getLength()?(e=this,n=null):(e=this.copyWithText(this.text.getTextAtRange([0,t])),n=this.copyWithText(this.text.getTextAtRange([t,this.getLength()]))),[e,n]},r.prototype.getBlockBreakPosition=function(){return this.text.getLength()-1},r.prototype.getTextWithoutBlockBreak=function(){return h(this.text)?this.text.getTextAtRange([0,this.getBlockBreakPosition()]):this.text.copy()},r.prototype.canBeGrouped=function(t){return this.attributes[t]},r.prototype.canBeGroupedWith=function(t,e){var n,o,i,r;return n=this.attributes,o=t.getAttributes(),n[e]===o[e]?"bullet"!==(i=n[e])&&"number"!==i||"bulletList"===(r=o[e+1])||"numberList"===r?!0:!1:void 0},a=function(t){return t=d(t),t=s(t)},d=function(e){var n,o,r,s,a,u;return s=!1,u=e.getPieces(),o=2<=u.length?i.call(u,0,n=u.length-1):(n=0,[]),r=u[n++],null==r?e:(o=function(){var t,e,n;for(n=[],t=0,e=o.length;e>t;t++)a=o[t],a.isBlockBreak()?(s=!0,n.push(p(a))):n.push(a);return n}(),s?new t.Text(i.call(o).concat([r])):e)},u=t.Text.textForStringWithAttributes("\n",{blockBreak:!0}),s=function(t){return h(t)?t:t.appendText(u)},h=function(t){var e,n;return n=t.getLength(),0===n?!1:(e=t.getTextAtRange([n-1,n]),e.isBlockBreak())},p=function(t){return t.copyWithoutAttribute("blockBreak")},l=function(t,e){return c(t)===e?t.slice(0,-1):t},c=function(t){return t.slice(-1)[0]},r}(t.Object)}.call(this),function(){var e,n,o,i,r,s,a,u,c,l=function(t,e){function n(){this.constructor=t}for(var o in e)h.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},h={}.hasOwnProperty,p=[].slice,d=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};e=t.arraysAreEqual,a=t.normalizeSpaces,r=t.makeElement,u=t.tagName,i=t.getBlockTagNames,c=t.walkTree,o=t.findClosestElementFromNode,n=t.elementContainsNode,s=t.nodeIsAttachmentElement,t.HTMLParser=function(h){function f(t,e){this.html=t,this.referenceElement=(null!=e?e:{}).referenceElement,this.blocks=[],this.blockElements=[],this.processedElements=[]}var g,m,y,v,b,A,C,x,S,E,R,k,w,D,L,O,T,P,B;return l(f,h),g="style href src width height class".split(" "),f.parse=function(t,e){var n;return n=new this(t,e),n.parse(),n},f.prototype.getDocument=function(){return t.Document.fromJSON(this.blocks)},f.prototype.parse=function(){var t,e;try{for(this.createHiddenContainer(),t=O(this.html),this.containerElement.innerHTML=t,e=c(this.containerElement,{usingFilter:w});e.nextNode();)this.processNode(e.currentNode);return this.translateBlockElementMarginsToNewlines()}finally{this.removeHiddenContainer()}},f.prototype.createHiddenContainer=function(){return this.referenceElement?(this.containerElement=this.referenceElement.cloneNode(!1),this.containerElement.removeAttribute("id"),this.containerElement.setAttribute("data-trix-internal",""),this.containerElement.style.display="none",this.referenceElement.parentNode.insertBefore(this.containerElement,this.referenceElement.nextSibling)):(this.containerElement=r({tagName:"div",style:{display:"none"}}),document.body.appendChild(this.containerElement))},f.prototype.removeHiddenContainer=function(){return this.containerElement.parentNode.removeChild(this.containerElement)},O=function(t){var e,n,o,i,r,s,a,u,l,h,f,m,y,v,A,C;for(n=document.implementation.createHTMLDocument(""),n.documentElement.innerHTML=t,e=n.body,o=n.head,y=o.querySelectorAll("style"),i=0,a=y.length;a>i;i++)A=y[i],e.appendChild(A);for(m=[],C=c(e);C.nextNode();)switch(f=C.currentNode,f.nodeType){case Node.ELEMENT_NODE:if(b(f))m.push(f);else for(v=p.call(f.attributes),r=0,u=v.length;u>r;r++)h=v[r].name,d.call(g,h)>=0||0===h.indexOf("data-trix")||f.removeAttribute(h);break;case Node.COMMENT_NODE:m.push(f)}for(s=0,l=m.length;l>s;s++)f=m[s],f.parentNode.removeChild(f);return e.innerHTML},b=function(t){return(null!=t?t.nodeType:void 0)===Node.ELEMENT_NODE?"script"===u(t)||"false"===t.getAttribute("data-trix-serialize"):void 0},w=function(t){return"style"===u(t)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},f.prototype.processNode=function(t){switch(t.nodeType){case Node.TEXT_NODE:return this.processTextNode(t);case Node.ELEMENT_NODE:return this.appendBlockForElement(t),this.processElement(t)}},f.prototype.appendBlockForElement=function(t){var o,i,r,s;if(r=S(t),i=n(this.currentBlockElement,t),r&&!S(t.firstChild)){if(!(R(t.firstChild)&&S(t.firstElementChild)||(o=this.getBlockAttributes(t),i&&e(o,this.currentBlock.attributes))))return this.currentBlock=this.appendBlockForAttributesWithElement(o,t),this.currentBlockElement=t}else if(this.currentBlockElement&&!i&&!r)return(s=this.findParentBlockElement(t))?this.appendBlockForElement(s):(this.currentBlock=this.appendEmptyBlock(),this.currentBlockElement=null)},f.prototype.findParentBlockElement=function(t){var e;for(e=t.parentElement;e&&e!==this.containerElement;){if(S(e)&&d.call(this.blockElements,e)>=0)return e;e=e.parentElement}return null},f.prototype.processTextNode=function(t){var e,n;return R(t)?void 0:(n=t.data,v(t.parentNode)||(n=T(n),P(null!=(e=t.previousSibling)?e.textContent:void 0)&&(n=k(n))),this.appendStringWithAttributes(n,this.getTextAttributes(t.parentNode)))},f.prototype.processElement=function(t){var e,n,o,i,r;if(s(t))return e=A(t),Object.keys(e).length&&(i=this.getTextAttributes(t),this.appendAttachmentWithAttributes(e,i),t.innerHTML=""),this.processedElements.push(t);switch(u(t)){case"br":return E(t)||S(t.nextSibling)||this.appendStringWithAttributes("\n",this.getTextAttributes(t)),this.processedElements.push(t);case"img":e={url:t.getAttribute("src"),contentType:"image"},o=x(t);for(n in o)r=o[n],e[n]=r;return this.appendAttachmentWithAttributes(e,this.getTextAttributes(t)),this.processedElements.push(t);case"tr":if(t.parentNode.firstChild!==t)return this.appendStringWithAttributes("\n");break;case"td":if(t.parentNode.firstChild!==t)return this.appendStringWithAttributes(" | ")}},f.prototype.appendBlockForAttributesWithElement=function(t,e){var n;return this.blockElements.push(e),n=m(t),this.blocks.push(n),n},f.prototype.appendEmptyBlock=function(){return this.appendBlockForAttributesWithElement([],null)},f.prototype.appendStringWithAttributes=function(t,e){return this.appendPiece(L(t,e))},f.prototype.appendAttachmentWithAttributes=function(t,e){return this.appendPiece(D(t,e))},f.prototype.appendPiece=function(t){return 0===this.blocks.length&&this.appendEmptyBlock(),this.blocks[this.blocks.length-1].text.push(t)},f.prototype.appendStringToTextAtIndex=function(t,e){var n,o;return o=this.blocks[e].text,n=o[o.length-1],"string"===(null!=n?n.type:void 0)?n.string+=t:o.push(L(t))},f.prototype.prependStringToTextAtIndex=function(t,e){var n,o;return o=this.blocks[e].text,n=o[0],"string"===(null!=n?n.type:void 0)?n.string=t+n.string:o.unshift(L(t))},L=function(t,e){var n;return null==e&&(e={}),n="string",t=a(t),{string:t,attributes:e,type:n}},D=function(t,e){var n;return null==e&&(e={}),n="attachment",{attachment:t,attributes:e,type:n}},m=function(t){var e;return null==t&&(t={}),e=[],{text:e,attributes:t}},f.prototype.getTextAttributes=function(e){var n,i,r,a,u,c,l,h,p,d,f,g,m;r={},d=t.config.textAttributes;for(n in d)if(u=d[n],u.tagName&&o(e,{matchingSelector:u.tagName}))r[n]=!0;else if(u.parser&&(m=u.parser(e))){for(i=!1,f=this.findBlockElementAncestors(e.firstChild),c=0,p=f.length;p>c;c++)if(a=f[c],u.parser(a)===m){i=!0;break}i||(r[n]=m)}if(s(e)&&(l=e.dataset.trixAttributes)){g=JSON.parse(l);for(h in g)m=g[h],r[h]=m}return r},f.prototype.getBlockAttributes=function(e){var n,o,i,r;for(o=[];e&&e!==this.containerElement;){r=t.config.blockAttributes;for(n in r)i=r[n],i.parse!==!1&&u(e)===i.tagName&&(("function"==typeof i.test?i.test(e):void 0)||!i.test)&&(o.push(n),i.listAttribute&&o.push(i.listAttribute));e=e.parentNode}return o.reverse()},f.prototype.findBlockElementAncestors=function(t){var e,n;for(e=[];t&&t!==this.containerElement;)n=u(t),d.call(i(),n)>=0&&e.push(t),t=t.parentNode;return e},A=function(t){return JSON.parse(t.dataset.trixAttachment)},x=function(t){var e,n,o;return o=t.getAttribute("width"),n=t.getAttribute("height"),e={},o&&(e.width=parseInt(o,10)),n&&(e.height=parseInt(n,10)),e},S=function(t){var e;if((null!=t?t.nodeType:void 0)===Node.ELEMENT_NODE&&!o(t,{matchingSelector:"td"}))return e=u(t),d.call(i(),e)>=0||"block"===window.getComputedStyle(t).display},R=function(t){return(null!=t?t.nodeType:void 0)===Node.TEXT_NODE&&B(t.data)&&!v(t.parentNode)?!t.previousSibling||S(t.previousSibling)||!t.nextSibling||S(t.nextSibling):void 0},E=function(t){return"br"===u(t)&&S(t.parentNode)&&t.parentNode.lastChild===t},v=function(t){var e;return e=window.getComputedStyle(t).whiteSpace,"pre"===e||"pre-wrap"===e||"pre-line"===e},f.prototype.translateBlockElementMarginsToNewlines=function(){var t,e,n,o,i,r,s,a;for(e=this.getMarginOfDefaultBlockElement(),s=this.blocks,a=[],o=n=0,i=s.length;i>n;o=++n)t=s[o],(r=this.getMarginOfBlockElementAtIndex(o))&&(r.top>2*e.top&&this.prependStringToTextAtIndex("\n",o),a.push(r.bottom>2*e.bottom?this.appendStringToTextAtIndex("\n",o):void 0));return a},f.prototype.getMarginOfBlockElementAtIndex=function(t){var e,n;return!(e=this.blockElements[t])||(n=u(e),d.call(i(),n)>=0||d.call(this.processedElements,e)>=0)?void 0:C(e)},f.prototype.getMarginOfDefaultBlockElement=function(){var e;return e=r(t.config.blockAttributes["default"].tagName),this.containerElement.appendChild(e),C(e)},C=function(t){var e;return e=window.getComputedStyle(t),"block"===e.display?{top:parseInt(e.marginTop),bottom:parseInt(e.marginBottom)}:void 0},y=RegExp("[^\\S"+t.NON_BREAKING_SPACE+"]"),T=function(t){return t.replace(RegExp(""+y.source,"g")," ").replace(/\ {2,}/g," ")},k=function(t){return t.replace(RegExp("^"+y.source+"+"),"")},B=function(t){return RegExp("^"+y.source+"*$").test(t)},P=function(t){return/\s$/.test(t)},f}(t.BasicObject)}.call(this),function(){var e,n,o,i=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty,s=[].slice,a=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};e=t.arraysAreEqual,n=t.normalizeRange,o=t.rangeIsCollapsed,t.Document=function(r){function u(e){null==e&&(e=[]),u.__super__.constructor.apply(this,arguments),0===e.length&&(e=[new t.Block]),this.blockList=t.SplittableList.box(e)}var c;return i(u,r),u.fromJSON=function(e){var n,o;return o=function(){var o,i,r;for(r=[],o=0,i=e.length;i>o;o++)n=e[o],r.push(t.Block.fromJSON(n));return r}(),new this(o)},u.fromHTML=function(e,n){return t.HTMLParser.parse(e,n).getDocument()},u.fromString=function(e,n){var o;return o=t.Text.textForStringWithAttributes(e,n),new this([new t.Block(o)])},u.prototype.isEmpty=function(){var t;return 1===this.blockList.length&&(t=this.getBlockAtIndex(0),t.isEmpty()&&!t.hasAttributes())},u.prototype.copy=function(t){var e;return null==t&&(t={}),e=t.consolidateBlocks?this.blockList.consolidate().toArray():this.blockList.toArray(),new this.constructor(e)},u.prototype.copyUsingObjectsFromDocument=function(e){var n;return n=new t.ObjectMap(e.getObjects()),this.copyUsingObjectMap(n)},u.prototype.copyUsingObjectMap=function(t){var e,n,o;return n=function(){var n,i,r,s;for(r=this.getBlocks(),s=[],n=0,i=r.length;i>n;n++)e=r[n],s.push((o=t.find(e))?o:e.copyUsingObjectMap(t));return s}.call(this),new this.constructor(n)},u.prototype.copyWithBaseBlockAttributes=function(t){var e,n,o;return null==t&&(t=[]),o=function(){var o,i,r,s;for(r=this.getBlocks(),s=[],o=0,i=r.length;i>o;o++)n=r[o],e=t.concat(n.getAttributes()),s.push(n.copyWithAttributes(e));return s}.call(this),new this.constructor(o)},u.prototype.insertDocumentAtRange=function(t,e){var i,r,s,a,u,c,l;return r=t.blockList,u=(e=n(e))[0],c=this.locationFromPosition(u),s=c.index,a=c.offset,l=this,i=this.getBlockAtPosition(u),o(e)&&i.isEmpty()&&!i.hasAttributes()?l=new this.constructor(l.blockList.removeObjectAtIndex(s)):i.getBlockBreakPosition()===a&&u++,l=l.removeTextAtRange(e),new this.constructor(l.blockList.insertSplittableListAtPosition(r,u))},u.prototype.mergeDocumentAtRange=function(t,o){var i,r,s,a,u,c,l,h,p,d,f,g;return f=(o=n(o))[0],d=this.locationFromPosition(f),r=this.getBlockAtIndex(d.index).getAttributes(),i=t.getBaseBlockAttributes(),g=r.slice(-i.length),e(i,g)?(l=r.slice(0,-i.length),c=t.copyWithBaseBlockAttributes(l)):c=t.copy({consolidateBlocks:!0}).copyWithBaseBlockAttributes(r),s=c.getBlockCount(),a=c.getBlockAtIndex(0),e(r,a.getAttributes())?(u=a.getTextWithoutBlockBreak(),p=this.insertTextAtRange(u,o),s>1&&(c=new this.constructor(c.getBlocks().slice(1)),h=f+u.getLength(),p=p.insertDocumentAtRange(c,h))):p=this.insertDocumentAtRange(c,o),p},u.prototype.insertTextAtRange=function(t,e){var o,i,r,s,a;return a=(e=n(e))[0],s=this.locationFromPosition(a),i=s.index,r=s.offset,o=this.removeTextAtRange(e),new this.constructor(o.blockList.editObjectAtIndex(i,function(e){return e.copyWithText(e.text.insertTextAtPosition(t,r))}))},u.prototype.removeTextAtRange=function(t){var e,i,r,s,a,u,c,l,h,p,d,f,g,m,y,v,b;return h=t=n(t),y=h[0],s=h[1],o(t)?this:(c=this.locationFromPosition(y),u=c.index,a=this.getBlockAtIndex(u),l=a.text.getTextAtRange([0,c.offset]),g=this.locationFromPosition(s),f=g.index,d=this.getBlockAtIndex(f),m=d.text.getTextAtRange([g.offset,d.getLength()]),v=l.appendText(m),p=u!==f&&0===c.offset,b=p&&a.getAttributeLevel()>=d.getAttributeLevel(),i=b?d.copyWithText(v):a.copyWithText(v),r=this.blockList.toArray(),e=f+1-u,r.splice(u,e,i),new this.constructor(r))},u.prototype.moveTextFromRangeToPosition=function(t,e){var o,i,r,a,u,c,l,h,p,d;if(c=t=n(t),p=c[0],r=c[1],e>=p&&r>=e)return this;if(i=this.getDocumentAtRange(t),h=this.removeTextAtRange(t),u=e>p,u&&(e-=i.getLength()),!h.firstBlockInRangeIsEntirelySelected(t)){if(l=i.getBlocks(),a=l[0],o=2<=l.length?s.call(l,1):[],0===o.length?(d=a.getTextWithoutBlockBreak(),u&&(e+=1)):d=a.text,h=h.insertTextAtRange(d,e),0===o.length)return h;i=new this.constructor(o),e+=d.getLength()}return h.insertDocumentAtRange(i,e)},u.prototype.addAttributeAtRange=function(e,n,o){var i;return i=this.blockList,this.eachBlockAtRange(o,function(o,r,s){return i=i.editObjectAtIndex(s,function(){return t.config.blockAttributes[e]?o.addAttribute(e,n):r[0]===r[1]?o:o.copyWithText(o.text.addAttributeAtRange(e,n,r))})}),new this.constructor(i)},u.prototype.addAttribute=function(t,e){var n;return n=this.blockList,this.eachBlock(function(o,i){return n=n.editObjectAtIndex(i,function(){return o.addAttribute(t,e)})}),new this.constructor(n)},u.prototype.removeAttributeAtRange=function(e,n){var o;return o=this.blockList,this.eachBlockAtRange(n,function(n,i,r){return t.config.blockAttributes[e]?o=o.editObjectAtIndex(r,function(){return n.removeAttribute(e)}):i[0]!==i[1]?o=o.editObjectAtIndex(r,function(){return n.copyWithText(n.text.removeAttributeAtRange(e,i))}):void 0}),new this.constructor(o)},u.prototype.updateAttributesForAttachment=function(t,e){var n,o,i,r;return i=(o=this.getRangeOfAttachment(e))[0],n=this.locationFromPosition(i).index,r=this.getTextAtIndex(n),new this.constructor(this.blockList.editObjectAtIndex(n,function(n){return n.copyWithText(r.updateAttributesForAttachment(t,e))}))},u.prototype.removeAttributeForAttachment=function(t,e){var n;return n=this.getRangeOfAttachment(e),this.removeAttributeAtRange(t,n)},u.prototype.insertBlockBreakAtRange=function(e){var o,i,r,s;return s=(e=n(e))[0],r=this.locationFromPosition(s).offset,i=this.removeTextAtRange(e),0===r&&(o=[new t.Block]),new this.constructor(i.blockList.insertSplittableListAtPosition(new t.SplittableList(o),s))},u.prototype.applyBlockAttributeAtRange=function(e,n,o){var i,r,s;return r=this.expandRangeToLineBreaksAndSplitBlocks(o),i=r.document,o=r.range,t.config.blockAttributes[e].listAttribute?(i=i.removeLastListAttributeAtRange(o,{exceptAttributeName:e}),s=i.convertLineBreaksToBlockBreaksInRange(o),i=s.document,o=s.range):i=i.consolidateBlocksAtRange(o),i.addAttributeAtRange(e,n,o)},u.prototype.removeLastListAttributeAtRange=function(e,n){var o;return null==n&&(n={}),o=this.blockList,this.eachBlockAtRange(e,function(e,i,r){var s;if((s=e.getLastAttribute())&&t.config.blockAttributes[s].listAttribute&&s!==n.exceptAttributeName)return o=o.editObjectAtIndex(r,function(){return e.removeAttribute(s)})}),new this.constructor(o)},u.prototype.firstBlockInRangeIsEntirelySelected=function(t){var e,o,i,r,s,a;return r=t=n(t),a=r[0],e=r[1],o=this.locationFromPosition(a),s=this.locationFromPosition(e),0===o.offset&&o.index<s.index?!0:o.index===s.index?(i=this.getBlockAtIndex(o.index).getLength(),0===o.offset&&s.offset===i):!1},u.prototype.expandRangeToLineBreaksAndSplitBlocks=function(t){var e,o,i,r,s,a,u,c,l;return a=t=n(t),l=a[0],r=a[1],c=this.locationFromPosition(l),i=this.locationFromPosition(r),e=this,u=e.getBlockAtIndex(c.index),null!=(c.offset=u.findLineBreakInDirectionFromPosition("backward",c.offset))&&(s=e.positionFromLocation(c),e=e.insertBlockBreakAtRange([s,s+1]),i.index+=1,i.offset-=e.getBlockAtIndex(c.index).getLength(),c.index+=1),c.offset=0,0===i.offset&&i.index>c.index?(i.index-=1,i.offset=e.getBlockAtIndex(i.index).getBlockBreakPosition()):(o=e.getBlockAtIndex(i.index),"\n"===o.text.getStringAtRange([i.offset-1,i.offset])?i.offset-=1:i.offset=o.findLineBreakInDirectionFromPosition("forward",i.offset),i.offset!==o.getBlockBreakPosition()&&(s=e.positionFromLocation(i),e=e.insertBlockBreakAtRange([s,s+1]))),l=e.positionFromLocation(c),r=e.positionFromLocation(i),t=n([l,r]),{document:e,range:t}},u.prototype.convertLineBreaksToBlockBreaksInRange=function(t){var e,o,i;return o=(t=n(t))[0],i=this.getStringAtRange(t).slice(0,-1),e=this,i.replace(/.*?\n/g,function(t){return o+=t.length,e=e.insertBlockBreakAtRange([o-1,o])}),{document:e,range:t}},u.prototype.consolidateBlocksAtRange=function(t){var e,o,i,r,s;return i=t=n(t),s=i[0],o=i[1],r=this.locationFromPosition(s).index,e=this.locationFromPosition(o).index,new this.constructor(this.blockList.consolidateFromIndexToIndex(r,e))},u.prototype.getDocumentAtRange=function(t){var e;return t=n(t),e=this.blockList.getSplittableListInRange(t).toArray(),new this.constructor(e)},u.prototype.getStringAtRange=function(t){return this.getDocumentAtRange(t).toString()},u.prototype.getBlockAtIndex=function(t){return this.blockList.getObjectAtIndex(t)},u.prototype.getBlockAtPosition=function(t){var e;return e=this.locationFromPosition(t).index,this.getBlockAtIndex(e)},u.prototype.getTextAtIndex=function(t){var e;return null!=(e=this.getBlockAtIndex(t))?e.text:void 0},u.prototype.getTextAtPosition=function(t){var e;return e=this.locationFromPosition(t).index,this.getTextAtIndex(e)},u.prototype.getPieceAtPosition=function(t){var e,n,o;return o=this.locationFromPosition(t),e=o.index,n=o.offset,this.getTextAtIndex(e).getPieceAtPosition(n)},u.prototype.getCharacterAtPosition=function(t){var e,n,o;return o=this.locationFromPosition(t),e=o.index,n=o.offset,this.getTextAtIndex(e).getStringAtRange([n,n+1])},u.prototype.getLength=function(){return this.blockList.getEndPosition()},u.prototype.getBlocks=function(){return this.blockList.toArray()},u.prototype.getBlockCount=function(){return this.blockList.length},u.prototype.getEditCount=function(){return this.editCount},u.prototype.eachBlock=function(t){return this.blockList.eachObject(t)},u.prototype.eachBlockAtRange=function(t,e){var o,i,r,s,a,u,c,l,h,p,d,f;if(u=t=n(t),d=u[0],r=u[1],p=this.locationFromPosition(d),i=this.locationFromPosition(r),p.index===i.index)return o=this.getBlockAtIndex(p.index),f=[p.offset,i.offset],e(o,f,p.index);for(h=[],a=s=c=p.index,l=i.index;l>=c?l>=s:s>=l;a=l>=c?++s:--s)(o=this.getBlockAtIndex(a))?(f=function(){switch(a){case p.index:return[p.offset,o.text.getLength()];case i.index:return[0,i.offset];default:return[0,o.text.getLength()]}}(),h.push(e(o,f,a))):h.push(void 0);return h},u.prototype.getCommonAttributesAtRange=function(e){var i,r,s;return r=(e=n(e))[0],o(e)?this.getCommonAttributesAtPosition(r):(s=[],i=[],this.eachBlockAtRange(e,function(t,e){return e[0]!==e[1]?(s.push(t.text.getCommonAttributesAtRange(e)),i.push(c(t))):void 0}),t.Hash.fromCommonAttributesOfObjects(s).merge(t.Hash.fromCommonAttributesOfObjects(i)).toObject())},u.prototype.getCommonAttributesAtPosition=function(e){var n,o,i,r,s,u,l,h,p,d;if(p=this.locationFromPosition(e),s=p.index,h=p.offset,i=this.getBlockAtIndex(s),!i)return{};r=c(i),n=i.text.getAttributesAtPosition(h),o=i.text.getAttributesAtPosition(h-1),u=function(){var e,n;e=t.config.textAttributes,n=[];for(l in e)d=e[l],d.inheritable&&n.push(l);return n}();for(l in o)d=o[l],(d===n[l]||a.call(u,l)>=0)&&(r[l]=d);return r},u.prototype.getRangeOfCommonAttributeAtPosition=function(t,e){var o,i,r,s,a,u,c,l,h;return a=this.locationFromPosition(e),r=a.index,s=a.offset,h=this.getTextAtIndex(r),u=h.getExpandedRangeForAttributeAtOffset(t,s),l=u[0],i=u[1],c=this.positionFromLocation({index:r,offset:l}),o=this.positionFromLocation({index:r,offset:i}),n([c,o])},u.prototype.getBaseBlockAttributes=function(){var t,e,n,o,i,r,s;for(t=this.getBlockAtIndex(0).getAttributes(),n=o=1,s=this.getBlockCount();s>=1?s>o:o>s;n=s>=1?++o:--o)e=this.getBlockAtIndex(n).getAttributes(),r=Math.min(t.length,e.length),t=function(){var n,o,s;for(s=[],i=n=0,o=r;(o>=0?o>n:n>o)&&e[i]===t[i];i=o>=0?++n:--n)s.push(e[i]);return s}();return t},c=function(t){var e,n;return n={},(e=t.getLastAttribute())&&(n[e]=!0),n},u.prototype.getAttachmentById=function(t){var e,n,o,i;for(i=this.getAttachments(),n=0,o=i.length;o>n;n++)if(e=i[n],e.id===t)return e},u.prototype.getAttachmentPieces=function(){var t;return t=[],this.blockList.eachObject(function(e){var n;return n=e.text,t=t.concat(n.getAttachmentPieces())}),t},u.prototype.getAttachments=function(){var t,e,n,o,i;for(o=this.getAttachmentPieces(),i=[],t=0,e=o.length;e>t;t++)n=o[t],i.push(n.attachment);return i},u.prototype.getRangeOfAttachment=function(t){var e,o,i,r,s,a,u;for(r=0,s=this.blockList.toArray(),o=e=0,i=s.length;i>e;o=++e){if(a=s[o].text,u=a.getRangeOfAttachment(t))return n([r+u[0],r+u[1]]);r+=a.getLength()}},u.prototype.getAttachmentPieceForAttachment=function(t){var e,n,o,i;for(i=this.getAttachmentPieces(),e=0,n=i.length;n>e;e++)if(o=i[e],o.attachment===t)return o},u.prototype.locationFromPosition=function(t){var e,n;return n=this.blockList.findIndexAndOffsetAtPosition(Math.max(0,t)),null!=n.index?n:(e=this.getBlocks(),{index:e.length-1,offset:e[e.length-1].getLength()})},u.prototype.positionFromLocation=function(t){return this.blockList.findPositionAtIndexAndOffset(t.index,t.offset)},u.prototype.locationRangeFromPosition=function(t){return n(this.locationFromPosition(t))},u.prototype.locationRangeFromRange=function(t){var e,o,i,r;if(t=n(t))return r=t[0],o=t[1],i=this.locationFromPosition(r),e=this.locationFromPosition(o),n([i,e])},u.prototype.rangeFromLocationRange=function(t){var e,i;return t=n(t),e=this.positionFromLocation(t[0]),o(t)||(i=this.positionFromLocation(t[1])),n([e,i])},u.prototype.isEqualTo=function(t){return this.blockList.isEqualTo(null!=t?t.blockList:void 0)},u.prototype.getTexts=function(){var t,e,n,o,i;for(o=this.getBlocks(),i=[],e=0,n=o.length;n>e;e++)t=o[e],i.push(t.text);return i},u.prototype.getPieces=function(){var t,e,n,o,i;for(n=[],o=this.getTexts(),t=0,e=o.length;e>t;t++)i=o[t],n.push.apply(n,i.getPieces());return n},u.prototype.getObjects=function(){return this.getBlocks().concat(this.getTexts()).concat(this.getPieces())},u.prototype.toSerializableDocument=function(){var t;return t=[],this.blockList.eachObject(function(e){return t.push(e.copyWithText(e.text.toSerializableText()))}),new this.constructor(t)},u.prototype.toString=function(){return this.blockList.toString()},u.prototype.toJSON=function(){return this.blockList.toJSON()},u.prototype.toConsole=function(){var t;return JSON.stringify(function(){var e,n,o,i;for(o=this.blockList.toArray(),i=[],e=0,n=o.length;n>e;e++)t=o[e],i.push(JSON.parse(t.text.toConsole()));return i}.call(this))},u}(t.Object)}.call(this),function(){var e,n,o,i,r,s=function(t,e){function n(){this.constructor=t}for(var o in e)a.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},a={}.hasOwnProperty;n=t.normalizeRange,i=t.rangesAreEqual,o=t.objectsAreEqual,r=t.summarizeArrayChange,e=t.extend,t.Composition=function(a){function u(){this.document=new t.Document,this.attachments=[],this.currentAttributes={},this.revision=0}var c;return s(u,a),u.prototype.setDocument=function(t){var e;return t.isEqualTo(this.document)?void 0:(this.document=t,this.refreshAttachments(),this.revision++,null!=(e=this.delegate)&&"function"==typeof e.compositionDidChangeDocument?e.compositionDidChangeDocument(t):void 0)},u.prototype.getSnapshot=function(){return{document:this.document,selectedRange:this.getSelectedRange()}},u.prototype.loadSnapshot=function(e){var n,o,i,r;return n=e.document,r=e.selectedRange,null!=(o=this.delegate)&&"function"==typeof o.compositionWillLoadSnapshot&&o.compositionWillLoadSnapshot(),this.setDocument(null!=n?n:new t.Document),this.setSelection(null!=r?r:[0,0]),null!=(i=this.delegate)&&"function"==typeof i.compositionDidLoadSnapshot?i.compositionDidLoadSnapshot():void 0},u.prototype.insertText=function(t,e){var n,o,i,r;return r=(null!=e?e:{updatePosition:!0}).updatePosition,o=this.getSelectedRange(),this.setDocument(this.document.insertTextAtRange(t,o)),i=o[0],n=i+t.getLength(),r&&this.setSelection(n),this.notifyDelegateOfInsertionAtRange([i,n])},u.prototype.insertBlock=function(e){var n;return null==e&&(e=new t.Block),n=new t.Document([e]),this.insertDocument(n)},u.prototype.insertDocument=function(e){var n,o,i;return null==e&&(e=new t.Document),o=this.getSelectedRange(),this.setDocument(this.document.insertDocumentAtRange(e,o)),i=o[0],n=i+e.getLength(),this.setSelection(n),this.notifyDelegateOfInsertionAtRange([i,n])},u.prototype.insertString=function(e,n){var o,i;return o=this.getCurrentTextAttributes(),i=t.Text.textForStringWithAttributes(e,o),this.insertText(i,n)},u.prototype.insertBlockBreak=function(){var t,e,n;return e=this.getSelectedRange(),this.setDocument(this.document.insertBlockBreakAtRange(e)),n=e[0],t=n+1,this.setSelection(t),this.notifyDelegateOfInsertionAtRange([n,t])},u.prototype.breakFormattedBlock=function(){var e,n,o,i,r,s,a,u;return s=this.getPosition(),a=[s-1,s],n=this.document,u=n.locationFromPosition(s),o=u.index,r=u.offset,e=n.getBlockAtIndex(o),e.getBlockBreakPosition()===r?(n=n.removeTextAtRange(a),a=[s,s]):"\n"===e.text.getStringAtRange([r,r+1])?a=[s-1,s+1]:r-1!==0&&(s+=1),i=new t.Document([e.removeLastAttribute().copyWithoutText()]),this.setDocument(n.insertDocumentAtRange(i,a)),this.setSelection(s)},u.prototype.insertLineBreak=function(){var e,n,o,i,r,s,a;return r=this.getSelectedRange(),a=r[0],i=r[1],s=this.document.locationFromPosition(a),o=this.document.locationFromPosition(i),e=this.document.getBlockAtIndex(o.index),e.hasAttributes()?e.isListItem()?e.isEmpty()?(this.decreaseListLevel(),this.setSelection(a)):0===s.offset?(n=new t.Document([e.copyWithoutText()]),this.insertDocument(n)):this.insertBlockBreak():e.isEmpty()?this.removeLastBlockAttribute():"\n"===e.text.getStringAtRange([o.offset-1,o.offset])?this.breakFormattedBlock():this.insertString("\n"):this.insertString("\n")},u.prototype.insertHTML=function(e){var n,o,i,r,s;return s=this.getPosition(),r=this.document.getLength(),n=t.Document.fromHTML(e),this.setDocument(this.document.mergeDocumentAtRange(n,this.getSelectedRange())),o=this.document.getLength(),i=s+(o-r),this.setSelection(i),this.notifyDelegateOfInsertionAtRange([i,i])},u.prototype.replaceHTML=function(e){var n,o,i;return n=t.Document.fromHTML(e).copyUsingObjectsFromDocument(this.document),o=this.getLocationRange({strict:!1}),i=this.document.rangeFromLocationRange(o),this.setDocument(n),this.setSelection(i)},u.prototype.insertFile=function(e){var n,o;return(null!=(o=this.delegate)?o.compositionShouldAcceptFile(e):void 0)?(n=t.Attachment.attachmentForFile(e),this.insertAttachment(n)):void 0},u.prototype.insertAttachment=function(e){var n;return n=t.Text.textForAttachmentWithAttributes(e,this.currentAttributes),this.insertText(n)},u.prototype.deleteInDirection=function(t){var e,n,o,i,r,s,a;if(r=this.getSelectedRange(),a=r[0],o=r[1],i=r,n=this.getBlock(),a===o){if(s=this.document.locationFromPosition(a),"backward"===t&&0===s.offset&&this.canDecreaseBlockAttributeLevel()&&(n.isListItem()?this.decreaseListLevel():this.decreaseBlockAttributeLevel(),this.setSelection(a),n.isEmpty()))return;i=this.getExpandedRangeInDirection(t),"backward"===t&&(e=this.getAttachmentAtRange(i))}return e?(this.editAttachment(e),!1):(this.setDocument(this.document.removeTextAtRange(i)),this.setSelection(i[0]),n.isListItem()?!1:void 0)},u.prototype.moveTextFromRange=function(t){var e;return e=this.getSelectedRange()[0],this.setDocument(this.document.moveTextFromRangeToPosition(t,e)),this.setSelection(e)},u.prototype.removeAttachment=function(t){var e;return(e=this.document.getRangeOfAttachment(t))?(this.stopEditingAttachment(),this.setDocument(this.document.removeTextAtRange(e)),this.setSelection(e[0])):void 0},u.prototype.removeLastBlockAttribute=function(){var t,e,n,o;return n=this.getSelectedRange(),o=n[0],e=n[1],t=this.document.getBlockAtPosition(e),this.removeCurrentAttribute(t.getLastAttribute()),this.setSelection(o)},c=" ",u.prototype.insertPlaceholder=function(){return this.placeholderPosition=this.getPosition(),this.insertString(c)},u.prototype.selectPlaceholder=function(){return null!=this.placeholderPosition?(this.setSelectedRange([this.placeholderPosition,this.placeholderPosition+c.length]),this.getSelectedRange()):void 0},u.prototype.forgetPlaceholder=function(){return this.placeholderPosition=null},u.prototype.hasCurrentAttribute=function(t){return null!=this.currentAttributes[t]},u.prototype.toggleCurrentAttribute=function(t){var e;return(e=!this.currentAttributes[t])?this.setCurrentAttribute(t,e):this.removeCurrentAttribute(t)},u.prototype.canSetCurrentAttribute=function(t){switch(t){case"href":return!this.selectionContainsAttachmentWithAttribute(t);default:return!0}},u.prototype.setCurrentAttribute=function(e,n){return t.config.blockAttributes[e]?this.setBlockAttribute(e,n):(this.setTextAttribute(e,n),this.currentAttributes[e]=n,this.notifyDelegateOfCurrentAttributesChange())},u.prototype.setTextAttribute=function(e,n){var o,i,r,s;if(i=this.getSelectedRange())return r=i[0],o=i[1],r!==o?this.setDocument(this.document.addAttributeAtRange(e,n,i)):"href"===e?(s=t.Text.textForStringWithAttributes(n,{href:n}),this.insertText(s)):void 0},u.prototype.setBlockAttribute=function(t,e){var n;if(n=this.getSelectedRange())return this.setDocument(this.document.applyBlockAttributeAtRange(t,e,n)),this.setSelection(n)},u.prototype.removeCurrentAttribute=function(e){return t.config.blockAttributes[e]?(this.removeBlockAttribute(e),this.updateCurrentAttributes()):(this.removeTextAttribute(e),delete this.currentAttributes[e],this.notifyDelegateOfCurrentAttributesChange())},u.prototype.removeTextAttribute=function(t){var e;if(e=this.getSelectedRange())return this.setDocument(this.document.removeAttributeAtRange(t,e))},u.prototype.removeBlockAttribute=function(t){var e;if(e=this.getSelectedRange())return this.setDocument(this.document.removeAttributeAtRange(t,e))},u.prototype.increaseBlockAttributeLevel=function(){var t,e;return(t=null!=(e=this.getBlock())?e.getLastAttribute():void 0)?this.setCurrentAttribute(t):void 0},u.prototype.decreaseBlockAttributeLevel=function(){var t,e;return(t=null!=(e=this.getBlock())?e.getLastAttribute():void 0)?this.removeCurrentAttribute(t):void 0},u.prototype.decreaseListLevel=function(){var t,e,n,o,i,r;for(r=this.getSelectedRange()[0],i=this.document.locationFromPosition(r).index,n=i,t=this.getBlock().getAttributeLevel();(e=this.document.getBlockAtIndex(n+1))&&e.isListItem()&&e.getAttributeLevel()>t;)n++;return r=this.document.positionFromLocation({index:i,offset:0}),o=this.document.positionFromLocation({index:n,offset:0}),this.setDocument(this.document.removeLastListAttributeAtRange([r,o]))},u.prototype.canIncreaseBlockAttributeLevel=function(){var t,e,n,o;
if(t=this.getBlock())return n=t.getConfig("nestable"),null!=n?n:t.isListItem()&&(o=this.getPreviousBlock())?(e=t.getAttributeLevel(),o.getAttributeAtLevel(e)===t.getAttributeAtLevel(e)):void 0},u.prototype.canDecreaseBlockAttributeLevel=function(){var t;return(null!=(t=this.getBlock())?t.getAttributeLevel():void 0)>0},u.prototype.updateCurrentAttributes=function(){var t,e;return(e=this.getSelectedRange({ignoreLock:!0}))&&(t=this.document.getCommonAttributesAtRange(e),!o(t,this.currentAttributes))?(this.currentAttributes=t,this.notifyDelegateOfCurrentAttributesChange()):void 0},u.prototype.getCurrentAttributes=function(){return e.call({},this.currentAttributes)},u.prototype.getCurrentTextAttributes=function(){var e,n,o,i;e={},o=this.currentAttributes;for(n in o)i=o[n],t.config.textAttributes[n]&&(e[n]=i);return e},u.prototype.freezeSelection=function(){return this.setCurrentAttribute("frozen",!0)},u.prototype.thawSelection=function(){return this.removeCurrentAttribute("frozen")},u.prototype.hasFrozenSelection=function(){return this.hasCurrentAttribute("frozen")},u.proxyMethod("getSelectionManager().getPointRange"),u.proxyMethod("getSelectionManager().setLocationRangeFromPointRange"),u.proxyMethod("getSelectionManager().locationIsCursorTarget"),u.proxyMethod("getSelectionManager().selectionIsExpanded"),u.proxyMethod("delegate?.getSelectionManager"),u.prototype.setSelection=function(t){var e,n;return e=this.document.locationRangeFromRange(t),null!=(n=this.delegate)?n.compositionDidRequestChangingSelectionToLocationRange(e):void 0},u.prototype.getSelectedRange=function(){var t;return(t=this.getLocationRange())?this.document.rangeFromLocationRange(t):void 0},u.prototype.setSelectedRange=function(t){var e;return e=this.document.locationRangeFromRange(t),this.getSelectionManager().setLocationRange(e)},u.prototype.getPosition=function(){var t;return(t=this.getLocationRange())?this.document.positionFromLocation(t[0]):void 0},u.prototype.getLocationRange=function(t){var e;return null!=(e=this.getSelectionManager().getLocationRange(t))?e:n({index:0,offset:0})},u.prototype.getExpandedRangeInDirection=function(t){var e,o,i;return o=this.getSelectedRange(),i=o[0],e=o[1],"backward"===t?i=this.translateUTF16PositionFromOffset(i,-1):e=this.translateUTF16PositionFromOffset(e,1),n([i,e])},u.prototype.moveCursorInDirection=function(t){var e,n,o,r;return this.editingAttachment?o=this.document.getRangeOfAttachment(this.editingAttachment):(r=this.getSelectedRange(),o=this.getExpandedRangeInDirection(t),n=!i(r,o)),this.setSelectedRange("backward"===t?o[0]:o[1]),n&&(e=this.getAttachmentAtRange(o))?this.editAttachment(e):void 0},u.prototype.expandSelectionInDirection=function(t){var e;return e=this.getExpandedRangeInDirection(t),this.setSelectedRange(e)},u.prototype.expandSelectionForEditing=function(){return this.hasCurrentAttribute("href")?this.expandSelectionAroundCommonAttribute("href"):void 0},u.prototype.expandSelectionAroundCommonAttribute=function(t){var e,n;return e=this.getPosition(),n=this.document.getRangeOfCommonAttributeAtPosition(t,e),this.setSelectedRange(n)},u.prototype.selectionContainsAttachmentWithAttribute=function(t){var e,n,o,i,r;if(r=this.getSelectedRange()){for(i=this.document.getDocumentAtRange(r).getAttachments(),n=0,o=i.length;o>n;n++)if(e=i[n],e.hasAttribute(t))return!0;return!1}},u.prototype.selectionIsInCursorTarget=function(){return this.editingAttachment||this.positionIsCursorTarget(this.getPosition())},u.prototype.positionIsCursorTarget=function(t){var e;return(e=this.document.locationFromPosition(t))?this.locationIsCursorTarget(e):void 0},u.prototype.positionIsBlockBreak=function(t){var e;return null!=(e=this.document.getPieceAtPosition(t))?e.isBlockBreak():void 0},u.prototype.getSelectedDocument=function(){var t;return(t=this.getSelectedRange())?this.document.getDocumentAtRange(t):void 0},u.prototype.getAttachments=function(){return this.attachments.slice(0)},u.prototype.refreshAttachments=function(){var t,e,n,o,i,s,a,u,c,l,h;for(n=this.document.getAttachments(),u=r(this.attachments,n),t=u.added,h=u.removed,o=0,s=h.length;s>o;o++)e=h[o],e.delegate=null,null!=(c=this.delegate)&&"function"==typeof c.compositionDidRemoveAttachment&&c.compositionDidRemoveAttachment(e);for(i=0,a=t.length;a>i;i++)e=t[i],e.delegate=this,null!=(l=this.delegate)&&"function"==typeof l.compositionDidAddAttachment&&l.compositionDidAddAttachment(e);return this.attachments=n},u.prototype.attachmentDidChangeAttributes=function(t){var e;return this.revision++,null!=(e=this.delegate)&&"function"==typeof e.compositionDidEditAttachment?e.compositionDidEditAttachment(t):void 0},u.prototype.editAttachment=function(t){var e;if(t!==this.editingAttachment)return this.stopEditingAttachment(),this.editingAttachment=t,null!=(e=this.delegate)&&"function"==typeof e.compositionDidStartEditingAttachment?e.compositionDidStartEditingAttachment(this.editingAttachment):void 0},u.prototype.stopEditingAttachment=function(){var t;if(this.editingAttachment)return null!=(t=this.delegate)&&"function"==typeof t.compositionDidStopEditingAttachment&&t.compositionDidStopEditingAttachment(this.editingAttachment),this.editingAttachment=null},u.prototype.canEditAttachmentCaption=function(){var t;return null!=(t=this.editingAttachment)?t.isPreviewable():void 0},u.prototype.updateAttributesForAttachment=function(t,e){return this.setDocument(this.document.updateAttributesForAttachment(t,e))},u.prototype.removeAttributeForAttachment=function(t,e){return this.setDocument(this.document.removeAttributeForAttachment(t,e))},u.prototype.getPreviousBlock=function(){var t,e;return(e=this.getLocationRange())&&(t=e[0].index,t>0)?this.document.getBlockAtIndex(t-1):void 0},u.prototype.getBlock=function(){var t;return(t=this.getLocationRange())?this.document.getBlockAtIndex(t[0].index):void 0},u.prototype.getAttachmentAtRange=function(e){var n;return n=this.document.getDocumentAtRange(e),n.toString()===t.OBJECT_REPLACEMENT_CHARACTER+"\n"?n.getAttachments()[0]:void 0},u.prototype.notifyDelegateOfCurrentAttributesChange=function(){var t;return null!=(t=this.delegate)&&"function"==typeof t.compositionDidChangeCurrentAttributes?t.compositionDidChangeCurrentAttributes(this.currentAttributes):void 0},u.prototype.notifyDelegateOfInsertionAtRange=function(t){var e;return null!=(e=this.delegate)&&"function"==typeof e.compositionDidPerformInsertionAtRange?e.compositionDidPerformInsertionAtRange(t):void 0},u.prototype.translateUTF16PositionFromOffset=function(t,e){var n,o;return o=this.document.toUTF16String(),n=o.offsetFromUCS2Offset(t),o.offsetToUCS2Offset(n+e)},u}(t.BasicObject)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.UndoManager=function(t){function n(t){this.composition=t,this.undoEntries=[],this.redoEntries=[]}var o;return e(n,t),n.prototype.recordUndoEntry=function(t,e){var n,i,r,s,a;return s=null!=e?e:{},i=s.context,n=s.consolidatable,r=this.undoEntries.slice(-1)[0],n&&o(r,t,i)?void 0:(a=this.createEntry({description:t,context:i}),this.undoEntries.push(a),this.redoEntries=[])},n.prototype.undo=function(){var t,e;return(e=this.undoEntries.pop())?(t=this.createEntry(e),this.redoEntries.push(t),this.composition.loadSnapshot(e.snapshot)):void 0},n.prototype.redo=function(){var t,e;return(t=this.redoEntries.pop())?(e=this.createEntry(t),this.undoEntries.push(e),this.composition.loadSnapshot(t.snapshot)):void 0},n.prototype.canUndo=function(){return this.undoEntries.length>0},n.prototype.canRedo=function(){return this.redoEntries.length>0},n.prototype.createEntry=function(t){var e,n,o;return o=null!=t?t:{},n=o.description,e=o.context,{description:null!=n?n.toString():void 0,context:JSON.stringify(e),snapshot:this.composition.getSnapshot()}},o=function(t,e,n){return(null!=t?t.description:void 0)===(null!=e?e.toString():void 0)&&(null!=t?t.context:void 0)===JSON.stringify(n)},n}(t.BasicObject)}.call(this),function(){t.Editor=function(){function e(e,n,o){this.composition=e,this.selectionManager=n,this.element=o,this.undoManager=new t.UndoManager(this.composition)}return e.prototype.loadDocument=function(t){return this.loadSnapshot({document:t,selectedRange:[0,0]})},e.prototype.loadHTML=function(e){return null==e&&(e=""),this.loadDocument(t.Document.fromHTML(e,{referenceElement:this.element}))},e.prototype.loadJSON=function(e){var n,o;return n=e.document,o=e.selectedRange,n=t.Document.fromJSON(n),this.loadSnapshot({document:n,selectedRange:o})},e.prototype.loadSnapshot=function(e){return this.undoManager=new t.UndoManager(this.composition),this.composition.loadSnapshot(e)},e.prototype.getDocument=function(){return this.composition.document},e.prototype.getSelectedDocument=function(){return this.composition.getSelectedDocument()},e.prototype.getSnapshot=function(){return this.composition.getSnapshot()},e.prototype.toJSON=function(){return this.getSnapshot()},e.prototype.deleteInDirection=function(t){return this.composition.deleteInDirection(t)},e.prototype.insertAttachment=function(t){return this.composition.insertAttachment(t)},e.prototype.insertDocument=function(t){return this.composition.insertDocument(t)},e.prototype.insertFile=function(t){return this.composition.insertFile(t)},e.prototype.insertHTML=function(t){return this.composition.insertHTML(t)},e.prototype.insertString=function(t){return this.composition.insertString(t)},e.prototype.insertText=function(t){return this.composition.insertText(t)},e.prototype.insertLineBreak=function(){return this.composition.insertLineBreak()},e.prototype.getSelectedRange=function(){return this.composition.getSelectedRange()},e.prototype.getPosition=function(){return this.composition.getPosition()},e.prototype.getClientRectAtPosition=function(t){var e;return e=this.getDocument().locationRangeFromRange([t,t+1]),this.selectionManager.getClientRectAtLocationRange(e)},e.prototype.expandSelectionInDirection=function(t){return this.composition.expandSelectionInDirection(t)},e.prototype.moveCursorInDirection=function(t){return this.composition.moveCursorInDirection(t)},e.prototype.setSelectedRange=function(t){return this.composition.setSelectedRange(t)},e.prototype.activateAttribute=function(t,e){return null==e&&(e=!0),this.composition.setCurrentAttribute(t,e)},e.prototype.attributeIsActive=function(t){return this.composition.hasCurrentAttribute(t)},e.prototype.canActivateAttribute=function(t){return this.composition.canSetCurrentAttribute(t)},e.prototype.deactivateAttribute=function(t){return this.composition.removeCurrentAttribute(t)},e.prototype.canDecreaseIndentationLevel=function(){return this.composition.canDecreaseBlockAttributeLevel()},e.prototype.canIncreaseIndentationLevel=function(){return this.composition.canIncreaseBlockAttributeLevel()},e.prototype.decreaseIndentationLevel=function(){return this.canDecreaseIndentationLevel()?this.composition.decreaseBlockAttributeLevel():void 0},e.prototype.increaseIndentationLevel=function(){return this.canIncreaseIndentationLevel()?this.composition.increaseBlockAttributeLevel():void 0},e.prototype.canRedo=function(){return this.undoManager.canRedo()},e.prototype.canUndo=function(){return this.undoManager.canUndo()},e.prototype.recordUndoEntry=function(t,e){var n,o,i;return i=null!=e?e:{},o=i.context,n=i.consolidatable,this.undoManager.recordUndoEntry(t,{context:o,consolidatable:n})},e.prototype.redo=function(){return this.canRedo()?this.undoManager.redo():void 0},e.prototype.undo=function(){return this.canUndo()?this.undoManager.undo():void 0},e}()}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.ManagedAttachment=function(t){function n(t,e){var n;this.attachmentManager=t,this.attachment=e,n=this.attachment,this.id=n.id,this.file=n.file}return e(n,t),n.prototype.remove=function(){return this.attachmentManager.requestRemovalOfAttachment(this.attachment)},n.proxyMethod("attachment.getAttribute"),n.proxyMethod("attachment.hasAttribute"),n.proxyMethod("attachment.setAttribute"),n.proxyMethod("attachment.getAttributes"),n.proxyMethod("attachment.setAttributes"),n.proxyMethod("attachment.isPending"),n.proxyMethod("attachment.isPreviewable"),n.proxyMethod("attachment.getURL"),n.proxyMethod("attachment.getHref"),n.proxyMethod("attachment.getFilename"),n.proxyMethod("attachment.getFilesize"),n.proxyMethod("attachment.getFormattedFilesize"),n.proxyMethod("attachment.getExtension"),n.proxyMethod("attachment.getContentType"),n.proxyMethod("attachment.getFile"),n.proxyMethod("attachment.setFile"),n.proxyMethod("attachment.releaseFile"),n.proxyMethod("attachment.getUploadProgress"),n.proxyMethod("attachment.setUploadProgress"),n}(t.BasicObject)}.call(this),function(){var e=function(t,e){function o(){this.constructor=t}for(var i in e)n.call(e,i)&&(t[i]=e[i]);return o.prototype=e.prototype,t.prototype=new o,t.__super__=e.prototype,t},n={}.hasOwnProperty;t.AttachmentManager=function(n){function o(t){var e,n,o;for(null==t&&(t=[]),this.managedAttachments={},n=0,o=t.length;o>n;n++)e=t[n],this.manageAttachment(e)}return e(o,n),o.prototype.getAttachments=function(){var t,e,n,o;n=this.managedAttachments,o=[];for(e in n)t=n[e],o.push(t);return o},o.prototype.manageAttachment=function(e){var n,o;return null!=(n=this.managedAttachments)[o=e.id]?n[o]:n[o]=new t.ManagedAttachment(this,e)},o.prototype.attachmentIsManaged=function(t){return t.id in this.managedAttachments},o.prototype.requestRemovalOfAttachment=function(t){var e;return this.attachmentIsManaged(t)&&null!=(e=this.delegate)&&"function"==typeof e.attachmentManagerDidRequestRemovalOfAttachment?e.attachmentManagerDidRequestRemovalOfAttachment(t):void 0},o.prototype.unmanageAttachment=function(t){var e;return e=this.managedAttachments[t.id],delete this.managedAttachments[t.id],e},o}(t.BasicObject)}.call(this),function(){var e,n,o,i,r,s,a,u,c,l,h,p,d;e=t.elementContainsNode,n=t.findChildIndexOfNode,o=t.findClosestElementFromNode,i=t.findNodeFromContainerAndOffset,a=t.nodeIsBlockStart,u=t.nodeIsBlockStartComment,s=t.nodeIsBlockContainer,c=t.nodeIsCursorTarget,l=t.nodeIsEmptyTextNode,h=t.nodeIsTextNode,r=t.nodeIsAttachmentElement,p=t.tagName,d=t.walkTree,t.LocationMapper=function(){function t(t){this.element=t}var o,i,f,g;return t.prototype.findLocationFromContainerAndOffset=function(t,o,r){var s,u,l,p,g,m,y;for(m=(null!=r?r:{strict:!0}).strict,u=0,l=!1,p={index:0,offset:0},(s=this.findAttachmentElementParentForNode(t))&&(t=s.parentNode,o=n(s)),y=d(this.element,{usingFilter:f});y.nextNode();){if(g=y.currentNode,g===t&&h(t)){c(g)||(p.offset+=o);break}if(g.parentNode===t){if(u++===o)break}else if(!e(t,g)&&u>0)break;a(g,{strict:m})?(l&&p.index++,p.offset=0,l=!0):p.offset+=i(g)}return p},t.prototype.findContainerAndOffsetFromLocation=function(t){var e,o,i,r,a,u;if(0===t.index&&0===t.offset){for(e=this.element,r=0;e.firstChild;)if(e=e.firstChild,s(e)){r=1;break}return[e,r]}if(a=this.findNodeAndOffsetFromLocation(t),o=a[0],i=a[1],o){if(h(o))e=o,u=o.textContent,r=t.offset-i;else{if(e=o.parentNode,!s(e))for(;o===e.lastChild&&(o=e,e=e.parentNode,!s(e)););r=n(o),0!==t.offset&&r++}return[e,r]}},t.prototype.findNodeAndOffsetFromLocation=function(t){var e,n,o,r,s,a,u,l;for(u=0,l=this.getSignificantNodesForIndex(t.index),n=0,o=l.length;o>n;n++){if(e=l[n],r=i(e),t.offset<=u+r)if(h(e)){if(s=e,a=u,t.offset===a&&c(s))break}else s||(s=e,a=u);if(u+=r,u>t.offset)break}return[s,a]},t.prototype.findAttachmentElementParentForNode=function(t){for(;t&&t!==this.element;){if(r(t))return t;t=t.parentNode}},t.prototype.getSignificantNodesForIndex=function(t){var e,n,i,r,s;for(i=[],s=d(this.element,{usingFilter:o}),r=!1;s.nextNode();)if(n=s.currentNode,u(n)){if("undefined"!=typeof e&&null!==e?e++:e=0,e===t)r=!0;else if(r)break}else r&&i.push(n);return i},i=function(t){var e;return t.nodeType===Node.TEXT_NODE?c(t)?0:(e=t.textContent,e.length):"br"===p(t)||r(t)?1:0},o=function(t){return g(t)===NodeFilter.FILTER_ACCEPT?f(t):NodeFilter.FILTER_REJECT},g=function(t){return l(t)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},f=function(t){return r(t.parentNode)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT},t}()}.call(this),function(){var e,n,o=[].slice;e=t.getDOMRange,n=t.setDOMRange,t.PointMapper=function(){function t(){}return t.prototype.createDOMRangeFromPoint=function(t){var o,i,r,s,a,u,c,l;if(c=t.x,l=t.y,document.caretPositionFromPoint)return a=document.caretPositionFromPoint(c,l),r=a.offsetNode,i=a.offset,o=document.createRange(),o.setStart(r,i),o;if(document.caretRangeFromPoint)return document.caretRangeFromPoint(c,l);if(document.body.createTextRange){s=e();try{u=document.body.createTextRange(),u.moveToPoint(c,l),u.select()}catch(h){}return o=e(),n(s),o}},t.prototype.getClientRectsForDOMRange=function(t){var e,n,i;return n=o.call(t.getClientRects()),i=n[0],e=n[n.length-1],[i,e]},t}()}.call(this),function(){var e,n=function(t,e){return function(){return t.apply(e,arguments)}},o=function(t,e){function n(){this.constructor=t}for(var o in e)i.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},i={}.hasOwnProperty,r=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};e=t.getDOMRange,t.SelectionChangeObserver=function(t){function i(){this.run=n(this.run,this),this.update=n(this.update,this),this.selectionManagers=[]}var s;return o(i,t),i.prototype.start=function(){return this.started?void 0:(this.started=!0,"onselectionchange"in document?document.addEventListener("selectionchange",this.update,!0):this.run())},i.prototype.stop=function(){return this.started?(this.started=!1,document.removeEventListener("selectionchange",this.update,!0)):void 0},i.prototype.registerSelectionManager=function(t){return r.call(this.selectionManagers,t)<0?(this.selectionManagers.push(t),this.start()):void 0},i.prototype.unregisterSelectionManager=function(t){var e;return this.selectionManagers=function(){var n,o,i,r;for(i=this.selectionManagers,r=[],n=0,o=i.length;o>n;n++)e=i[n],e!==t&&r.push(e);return r}.call(this),0===this.selectionManagers.length?this.stop():void 0},i.prototype.notifySelectionManagersOfSelectionChange=function(){var t,e,n,o,i;for(n=this.selectionManagers,o=[],t=0,e=n.length;e>t;t++)i=n[t],o.push(i.selectionDidChange());return o},i.prototype.update=function(){var t;return t=e(),s(t,this.domRange)?void 0:(this.domRange=t,this.notifySelectionManagersOfSelectionChange())},i.prototype.reset=function(){return this.domRange=null,this.update()},i.prototype.run=function(){return this.started?(this.update(),requestAnimationFrame(this.run)):void 0},s=function(t,e){return(null!=t?t.startContainer:void 0)===(null!=e?e.startContainer:void 0)&&(null!=t?t.startOffset:void 0)===(null!=e?e.startOffset:void 0)&&(null!=t?t.endContainer:void 0)===(null!=e?e.endContainer:void 0)&&(null!=t?t.endOffset:void 0)===(null!=e?e.endOffset:void 0)},i}(t.BasicObject),null==t.selectionChangeObserver&&(t.selectionChangeObserver=new t.SelectionChangeObserver)}.call(this),function(){var e,n,o,i,r,s,a,u,c,l,h,p,d=function(t,e){return function(){return t.apply(e,arguments)}},f=function(t,e){function n(){this.constructor=t}for(var o in e)g.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},g={}.hasOwnProperty;i=t.getDOMSelection,o=t.getDOMRange,p=t.setDOMRange,e=t.defer,n=t.elementContainsNode,u=t.nodeIsCursorTarget,a=t.innerElementIsActive,r=t.handleEvent,s=t.handleEventOnce,c=t.normalizeRange,l=t.rangeIsCollapsed,h=t.rangesAreEqual,t.SelectionManager=function(e){function s(e){this.element=e,this.selectionDidChange=d(this.selectionDidChange,this),this.didMouseDown=d(this.didMouseDown,this),this.locationMapper=new t.LocationMapper(this.element),this.pointMapper=new t.PointMapper,this.lockCount=0,r("mousedown",{onElement:this.element,withCallback:this.didMouseDown})}return f(s,e),s.prototype.getLocationRange=function(t){var e,n;return null==t&&(t={}),e=t.strict===!1?this.createLocationRangeFromDOMRange(o(),{strict:!1}):t.ignoreLock?this.currentLocationRange:null!=(n=this.lockedLocationRange)?n:this.currentLocationRange},s.prototype.setLocationRange=function(t){var e;if(!this.lockedLocationRange)return t=c(t),(e=this.createDOMRangeFromLocationRange(t))?(p(e),this.updateCurrentLocationRange(t)):void 0},s.prototype.setLocationRangeFromPointRange=function(t){var e,n;return t=c(t),n=this.getLocationAtPoint(t[0]),e=this.getLocationAtPoint(t[1]),this.setLocationRange([n,e])},s.prototype.getClientRectAtLocationRange=function(t){var e;return(e=this.createDOMRangeFromLocationRange(t))?this.getClientRectsForDOMRange(e)[1]:void 0},s.prototype.locationIsCursorTarget=function(t){var e,n,o;return o=this.findNodeAndOffsetFromLocation(t),e=o[0],n=o[1],u(e)},s.prototype.lock=function(){return 0===this.lockCount++?(this.updateCurrentLocationRange(),this.lockedLocationRange=this.getLocationRange()):void 0},s.prototype.unlock=function(){var t;return 0===--this.lockCount&&(t=this.lockedLocationRange,this.lockedLocationRange=null,null!=t)?this.setLocationRange(t):void 0},s.prototype.clearSelection=function(){var t;return null!=(t=i())?t.removeAllRanges():void 0},s.prototype.selectionIsCollapsed=function(){var t;return(null!=(t=o())?t.collapsed:void 0)===!0},s.prototype.selectionIsExpanded=function(){return!this.selectionIsCollapsed()},s.proxyMethod("locationMapper.findLocationFromContainerAndOffset"),s.proxyMethod("locationMapper.findContainerAndOffsetFromLocation"),s.proxyMethod("locationMapper.findNodeAndOffsetFromLocation"),s.proxyMethod("pointMapper.createDOMRangeFromPoint"),s.proxyMethod("pointMapper.getClientRectsForDOMRange"),s.prototype.didMouseDown=function(){return this.pauseTemporarily()},s.prototype.pauseTemporarily=function(){var t,e,o,i;return this.paused=!0,e=function(t){return function(){var e,r,s;for(t.paused=!1,clearTimeout(i),r=0,s=o.length;s>r;r++)e=o[r],e.destroy();return n(document,t.element)?t.selectionDidChange():void 0}}(this),i=setTimeout(e,200),o=function(){var n,o,i,s;for(i=["mousemove","keydown"],s=[],n=0,o=i.length;o>n;n++)t=i[n],s.push(r(t,{onElement:document,withCallback:e}));return s}()},s.prototype.selectionDidChange=function(){return this.paused||a(this.element)?void 0:this.updateCurrentLocationRange()},s.prototype.updateCurrentLocationRange=function(t){var e;return(null!=t?t:t=this.createLocationRangeFromDOMRange(o()))&&!h(t,this.currentLocationRange)?(this.currentLocationRange=t,null!=(e=this.delegate)&&"function"==typeof e.locationRangeDidChange?e.locationRangeDidChange(this.currentLocationRange.slice(0)):void 0):void 0},s.prototype.createDOMRangeFromLocationRange=function(t){var e,n,o,i;return o=this.findContainerAndOffsetFromLocation(t[0]),n=l(t)?o:null!=(i=this.findContainerAndOffsetFromLocation(t[1]))?i:o,null!=o&&null!=n?(e=document.createRange(),e.setStart.apply(e,o),e.setEnd.apply(e,n),e):void 0},s.prototype.createLocationRangeFromDOMRange=function(t,e){var n,o;if(null!=t&&this.domRangeWithinElement(t)&&(o=this.findLocationFromContainerAndOffset(t.startContainer,t.startOffset,e)))return t.collapsed||(n=this.findLocationFromContainerAndOffset(t.endContainer,t.endOffset,e)),c([o,n])},s.prototype.getLocationAtPoint=function(t){var e,n;return(e=this.createDOMRangeFromPoint(t))&&null!=(n=this.createLocationRangeFromDOMRange(e))?n[0]:void 0},s.prototype.domRangeWithinElement=function(t){return t.collapsed?n(this.element,t.startContainer):n(this.element,t.startContainer)&&n(this.element,t.endContainer)},s}(t.BasicObject)}.call(this),function(){var e,n,o,i=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty,s=[].slice;n=t.rangeIsCollapsed,o=t.rangesAreEqual,e=t.objectsAreEqual,t.EditorController=function(r){function a(e){var n,o;this.editorElement=e.editorElement,n=e.document,o=e.html,this.selectionManager=new t.SelectionManager(this.editorElement),this.selectionManager.delegate=this,this.composition=new t.Composition,this.composition.delegate=this,this.attachmentManager=new t.AttachmentManager(this.composition.getAttachments()),this.attachmentManager.delegate=this,this.inputController=new t.InputController(this.editorElement),this.inputController.delegate=this,this.inputController.responder=this.composition,this.compositionController=new t.CompositionController(this.editorElement,this.composition),this.compositionController.delegate=this,this.toolbarController=new t.ToolbarController(this.editorElement.toolbarElement),this.toolbarController.delegate=this,this.editor=new t.Editor(this.composition,this.selectionManager,this.editorElement),null!=n?this.editor.loadDocument(n):this.editor.loadHTML(o)}return i(a,r),a.prototype.registerSelectionManager=function(){return t.selectionChangeObserver.registerSelectionManager(this.selectionManager)},a.prototype.unregisterSelectionManager=function(){return t.selectionChangeObserver.unregisterSelectionManager(this.selectionManager)},a.prototype.compositionDidChangeDocument=function(){return this.editorElement.notify("document-change"),this.handlingInput?void 0:this.render()},a.prototype.compositionDidChangeCurrentAttributes=function(t){return this.currentAttributes=t,this.toolbarController.updateAttributes(this.currentAttributes),this.updateCurrentActions(),this.editorElement.notify("attributes-change",{attributes:this.currentAttributes})},a.prototype.compositionDidPerformInsertionAtRange=function(t){return this.pasting?this.pastedRange=t:void 0},a.prototype.compositionShouldAcceptFile=function(t){return this.editorElement.notify("file-accept",{file:t})},a.prototype.compositionDidAddAttachment=function(t){var e;return e=this.attachmentManager.manageAttachment(t),this.editorElement.notify("attachment-add",{attachment:e})},a.prototype.compositionDidEditAttachment=function(t){var e;return this.compositionController.rerenderViewForObject(t),e=this.attachmentManager.manageAttachment(t),this.editorElement.notify("attachment-edit",{attachment:e}),this.editorElement.notify("change")},a.prototype.compositionDidRemoveAttachment=function(t){var e;return e=this.attachmentManager.unmanageAttachment(t),this.editorElement.notify("attachment-remove",{attachment:e})},a.prototype.compositionDidStartEditingAttachment=function(t){var e,n;return n=this.composition.document,e=n.getRangeOfAttachment(t),this.attachmentLocationRange=n.locationRangeFromRange(e),this.compositionController.installAttachmentEditorForAttachment(t),this.selectionManager.setLocationRange(this.attachmentLocationRange)},a.prototype.compositionDidStopEditingAttachment=function(){return this.compositionController.uninstallAttachmentEditor(),this.attachmentLocationRange=null},a.prototype.compositionDidRequestChangingSelectionToLocationRange=function(t){return!this.loadingSnapshot||this.isFocused()?(this.requestedLocationRange=t,this.documentWhenLocationRangeRequested=this.composition.document,this.handlingInput?void 0:this.render()):void 0},a.prototype.compositionWillLoadSnapshot=function(){return this.loadingSnapshot=!0},a.prototype.compositionDidLoadSnapshot=function(){return this.compositionController.refreshViewCache(),this.render(),this.loadingSnapshot=!1},a.prototype.getSelectionManager=function(){return this.selectionManager},a.proxyMethod("getSelectionManager().setLocationRange"),a.proxyMethod("getSelectionManager().getLocationRange"),a.prototype.attachmentManagerDidRequestRemovalOfAttachment=function(t){return this.removeAttachment(t)},a.prototype.compositionControllerWillSyncDocumentView=function(){return this.inputController.editorWillSyncDocumentView(),this.selectionManager.lock(),this.selectionManager.clearSelection()},a.prototype.compositionControllerDidSyncDocumentView=function(){return this.inputController.editorDidSyncDocumentView(),this.selectionManager.unlock(),this.updateCurrentActions(),this.editorElement.notify("sync")},a.prototype.compositionControllerDidRender=function(){return null!=this.requestedLocationRange&&(this.documentWhenLocationRangeRequested.isEqualTo(this.composition.document)&&this.selectionManager.setLocationRange(this.requestedLocationRange),this.composition.updateCurrentAttributes(),this.requestedLocationRange=null,this.documentWhenLocationRangeRequested=null),this.editorElement.notify("render")},a.prototype.compositionControllerDidFocus=function(){return this.toolbarController.hideDialog(),this.editorElement.notify("focus")},a.prototype.compositionControllerDidBlur=function(){return this.editorElement.notify("blur")},a.prototype.compositionControllerDidSelectAttachment=function(t){return this.composition.editAttachment(t)},a.prototype.compositionControllerDidRequestDeselectingAttachment=function(){return this.attachmentLocationRange?this.selectionManager.setLocationRange(this.attachmentLocationRange[1]):void 0},a.prototype.compositionControllerWillUpdateAttachment=function(t){return this.editor.recordUndoEntry("Edit Attachment",{context:t.id,consolidatable:!0})},a.prototype.compositionControllerDidRequestRemovalOfAttachment=function(t){return this.removeAttachment(t)},a.prototype.inputControllerWillHandleInput=function(){return this.handlingInput=!0,this.requestedRender=!1},a.prototype.inputControllerDidRequestRender=function(){return this.requestedRender=!0},a.prototype.inputControllerDidHandleInput=function(){return this.handlingInput=!1,this.requestedRender?(this.requestedRender=!1,this.render()):void 0},a.prototype.inputControllerDidRequestReparse=function(){return this.reparse()},a.prototype.inputControllerWillPerformTyping=function(){return this.recordTypingUndoEntry()},a.prototype.inputControllerWillCutText=function(){return this.editor.recordUndoEntry("Cut")},a.prototype.inputControllerWillPasteText=function(){return this.editor.recordUndoEntry("Paste"),this.pasting=!0},a.prototype.inputControllerDidPaste=function(t){var e;return e=this.pastedRange,this.pastedRange=null,this.pasting=null,this.editorElement.notify("paste",{pasteData:t,range:e}),this.render()},a.prototype.inputControllerWillMoveText=function(){return this.editor.recordUndoEntry("Move")},a.prototype.inputControllerWillAttachFiles=function(){return this.editor.recordUndoEntry("Drop Files")},a.prototype.inputControllerDidReceiveKeyboardCommand=function(t){return this.toolbarController.applyKeyboardCommand(t)},a.prototype.inputControllerDidStartDrag=function(){return this.locationRangeBeforeDrag=this.selectionManager.getLocationRange()},a.prototype.inputControllerDidReceiveDragOverPoint=function(t){return this.selectionManager.setLocationRangeFromPointRange(t)},a.prototype.inputControllerDidCancelDrag=function(){return this.selectionManager.setLocationRange(this.locationRangeBeforeDrag),this.locationRangeBeforeDrag=null},a.prototype.locationRangeDidChange=function(t){return this.composition.updateCurrentAttributes(),this.updateCurrentActions(),this.attachmentLocationRange&&!o(this.attachmentLocationRange,t)&&this.composition.stopEditingAttachment(),this.editorElement.notify("selection-change")},a.prototype.toolbarDidClickButton=function(){return this.getLocationRange()?void 0:this.setLocationRange({index:0,offset:0})},a.prototype.toolbarDidInvokeAction=function(t){return this.invokeAction(t)},a.prototype.toolbarDidToggleAttribute=function(t){return this.recordFormattingUndoEntry(),this.composition.toggleCurrentAttribute(t),this.render(),this.selectionFrozen?void 0:this.editorElement.focus()},a.prototype.toolbarDidUpdateAttribute=function(t,e){return this.recordFormattingUndoEntry(),this.composition.setCurrentAttribute(t,e),this.render(),this.selectionFrozen?void 0:this.editorElement.focus()},a.prototype.toolbarDidRemoveAttribute=function(t){return this.recordFormattingUndoEntry(),this.composition.removeCurrentAttribute(t),this.render(),this.selectionFrozen?void 0:this.editorElement.focus()},a.prototype.toolbarWillShowDialog=function(){return this.composition.expandSelectionForEditing(),this.freezeSelection()},a.prototype.toolbarDidShowDialog=function(t){return this.editorElement.notify("toolbar-dialog-show",{dialogName:t})},a.prototype.toolbarDidHideDialog=function(t){return this.thawSelection(),this.editorElement.focus(),this.editorElement.notify("toolbar-dialog-hide",{dialogName:t})},a.prototype.freezeSelection=function(){return this.selectionFrozen?void 0:(this.selectionManager.lock(),this.composition.freezeSelection(),this.selectionFrozen=!0,this.render())},a.prototype.thawSelection=function(){return this.selectionFrozen?(this.composition.thawSelection(),this.selectionManager.unlock(),this.selectionFrozen=!1,this.render()):void 0
},a.prototype.actions={undo:{test:function(){return this.editor.canUndo()},perform:function(){return this.editor.undo()}},redo:{test:function(){return this.editor.canRedo()},perform:function(){return this.editor.redo()}},link:{test:function(){return this.editor.canActivateAttribute("href")}},increaseBlockLevel:{test:function(){return this.editor.canIncreaseIndentationLevel()},perform:function(){return this.editor.increaseIndentationLevel()&&this.render()}},decreaseBlockLevel:{test:function(){return this.editor.canDecreaseIndentationLevel()},perform:function(){return this.editor.decreaseIndentationLevel()&&this.render()}}},a.prototype.canInvokeAction=function(t){var e,n;return this.actionIsExternal(t)?!0:!!(null!=(e=this.actions[t])&&null!=(n=e.test)?n.call(this):void 0)},a.prototype.invokeAction=function(t){var e,n;return this.actionIsExternal(t)?this.editorElement.notify("action-invoke",{actionName:t}):null!=(e=this.actions[t])&&null!=(n=e.perform)?n.call(this):void 0},a.prototype.actionIsExternal=function(t){return/^x-./.test(t)},a.prototype.getCurrentActions=function(){var t,e;e={};for(t in this.actions)e[t]=this.canInvokeAction(t);return e},a.prototype.updateCurrentActions=function(){var t;return t=this.getCurrentActions(),e(t,this.currentActions)?void 0:(this.currentActions=t,this.toolbarController.updateActions(this.currentActions),this.editorElement.notify("actions-change",{actions:this.currentActions}))},a.prototype.reparse=function(){return this.composition.replaceHTML(this.editorElement.innerHTML)},a.prototype.render=function(){return this.compositionController.render()},a.prototype.removeAttachment=function(t){return this.editor.recordUndoEntry("Delete Attachment"),this.composition.removeAttachment(t),this.render()},a.prototype.recordFormattingUndoEntry=function(){var t;return t=this.selectionManager.getLocationRange(),n(t)?void 0:this.editor.recordUndoEntry("Formatting",{context:this.getUndoContext(),consolidatable:!0})},a.prototype.recordTypingUndoEntry=function(){return this.editor.recordUndoEntry("Typing",{context:this.getUndoContext(this.currentAttributes),consolidatable:!0})},a.prototype.getUndoContext=function(){var t;return t=1<=arguments.length?s.call(arguments,0):[],[this.getLocationContext(),this.getTimeContext()].concat(s.call(t))},a.prototype.getLocationContext=function(){var t;return t=this.selectionManager.getLocationRange(),n(t)?t[0].index:t},a.prototype.getTimeContext=function(){return t.config.undoInterval>0?Math.floor((new Date).getTime()/t.config.undoInterval):0},a.prototype.isFocused=function(){var t;return this.editorElement===(null!=(t=this.editorElement.ownerDocument)?t.activeElement:void 0)},a}(t.Controller)}.call(this),function(){var e,n,o,i,r,s,a;r=t.makeElement,s=t.selectionElements,a=t.triggerEvent,o=t.handleEvent,i=t.handleEventOnce,n=t.defer,e=t.AttachmentView.attachmentSelector,t.registerElement("trix-editor",function(){var n,u,c,l,h,p;return l=0,n=function(t){return!document.querySelector(":focus")&&t.hasAttribute("autofocus")&&document.querySelector("[autofocus]")===t?t.focus():void 0},h=function(t){return t.hasAttribute("contenteditable")?void 0:(t.setAttribute("contenteditable",""),i("focus",{onElement:t,withCallback:function(){return u(t)}}))},u=function(t){return c(t),p(t)},c=function(t){return("function"==typeof document.queryCommandSupported?document.queryCommandSupported("enableObjectResizing"):void 0)?(document.execCommand("enableObjectResizing",!1,!1),o("mscontrolselect",{onElement:t,preventDefault:!0})):void 0},p=function(){var e;return("function"==typeof document.queryCommandSupported?document.queryCommandSupported("DefaultParagraphSeparator"):void 0)&&(e=t.config.blockAttributes["default"].tagName,"div"===e||"p"===e)?document.execCommand("DefaultParagraphSeparator",!1,e):void 0},{defaultCSS:"%t:empty:not(:focus)::before {\n  content: attr(placeholder);\n  color: graytext;\n}\n\n%t a[contenteditable=false] {\n  cursor: text;\n}\n\n%t img {\n  max-width: 100%;\n  height: auto;\n}\n\n%t "+e+" figcaption textarea {\n  resize: none;\n}\n\n%t "+e+" figcaption textarea.trix-autoresize-clone {\n  position: absolute;\n  left: -9999px;\n  max-height: 0px;\n}\n\n%t "+e+'[data-trix-mutable] figcaption:empty::before {\n  content: "'+t.config.lang.captionPrompt+'";\n  color: graytext;\n}\n\n%t '+s.selector+" { "+s.cssText+" }",trixId:{get:function(){return this.hasAttribute("trix-id")?this.getAttribute("trix-id"):(this.setAttribute("trix-id",++l),this.trixId)}},toolbarElement:{get:function(){var t,e,n;return this.hasAttribute("toolbar")?null!=(e=this.ownerDocument)?e.getElementById(this.getAttribute("toolbar")):void 0:this.parentElement?(n="trix-toolbar-"+this.trixId,this.setAttribute("toolbar",n),t=r("trix-toolbar",{id:n}),this.parentElement.insertBefore(t,this),t):void 0}},inputElement:{get:function(){var t,e,n;return this.hasAttribute("input")?null!=(n=this.ownerDocument)?n.getElementById(this.getAttribute("input")):void 0:this.parentElement?(e="trix-input-"+this.trixId,this.setAttribute("input",e),t=r("input",{type:"hidden",id:e}),this.parentElement.insertBefore(t,this.nextElementSibling),t):void 0}},editor:{get:function(){var t;return null!=(t=this.editorController)?t.editor:void 0}},name:{get:function(){var t;return null!=(t=this.inputElement)?t.name:void 0}},value:{get:function(){var t;return null!=(t=this.inputElement)?t.value:void 0},set:function(t){var e;return this.defaultValue=t,null!=(e=this.editor)?e.loadHTML(this.defaultValue):void 0}},notify:function(e,n){var o;switch(e){case"document-change":this.documentChangedSinceLastRender=!0;break;case"render":this.documentChangedSinceLastRender&&(this.documentChangedSinceLastRender=!1,this.notify("change"));break;case"change":case"attachment-add":case"attachment-edit":case"attachment-remove":null!=(o=this.inputElement)&&(o.value=t.serializeToContentType(this,"text/html"))}return this.editorController?a("trix-"+e,{onElement:this,attributes:n}):void 0},createdCallback:function(){return h(this)},attachedCallback:function(){return this.hasAttribute("data-trix-internal")?void 0:(null==this.editorController&&(this.editorController=new t.EditorController({editorElement:this,html:this.defaultValue=this.value})),this.editorController.registerSelectionManager(),this.registerResetListener(),n(this),requestAnimationFrame(function(t){return function(){return t.notify("initialize")}}(this)))},detachedCallback:function(){var t;return null!=(t=this.editorController)&&t.unregisterSelectionManager(),this.unregisterResetListener()},registerResetListener:function(){return this.resetListener=this.resetBubbled.bind(this),window.addEventListener("reset",this.resetListener,!1)},unregisterResetListener:function(){return window.removeEventListener("reset",this.resetListener,!1)},resetBubbled:function(t){var e;return t.target!==(null!=(e=this.inputElement)?e.form:void 0)||t.defaultPrevented?void 0:this.reset()},reset:function(){return this.value=this.defaultValue}}}())}.call(this),function(){}.call(this)}).call(this),"object"==typeof module&&module.exports?module.exports=t:"function"==typeof define&&define.amd&&define(t)}.call(this);
//# sourceMappingURL=trix.js.map
//# sourceMappingURL=vendors.js.map