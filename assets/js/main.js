/* ============================================================
   Kritik Modi · kritikmodi.com
   No dependencies, no build step.
   ============================================================ */
(function () {
  "use strict";

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- menu ---------- */
  var toggle = document.getElementById("menuToggle");
  var list = document.getElementById("menuList");

  if (toggle && list) {
    var close = function () {
      list.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };
    toggle.addEventListener("click", function () {
      var open = list.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    list.addEventListener("click", function (e) {
      if (e.target.closest("a")) close();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- reading progress ---------- */
  var bar = document.getElementById("progress");
  if (bar) {
    var paint = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = Math.min(100, Math.max(0, pct)) + "%";
    };
    paint();
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
  }

  /* ---------- local time in India ---------- */
  var clock = document.getElementById("clock");
  if (clock) {
    var fmt = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Kolkata"
    });
    var tick = function () { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 20000);
  }

  /* ---------- current year ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------- entrance reveals ---------- */
  var risers = Array.prototype.slice.call(document.querySelectorAll(".rise"));
  var revealAll = function () {
    risers.forEach(function (el) { el.classList.add("is-in"); });
  };

  if (reduce || !("IntersectionObserver" in window)) {
    revealAll();
  } else {
    document.documentElement.classList.add("reveal-on");

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -6% 0px", threshold: 0.06 });

    /* Anything already in view is shown outright; the rest animates in.
       Re-run on load, since web fonts land after first paint and move things. */
    var prime = function () {
      risers.forEach(function (el) {
        if (el.classList.contains("is-in")) return;
        if (el.getBoundingClientRect().top < window.innerHeight * 0.95) {
          el.classList.add("is-in");
          io.unobserve(el);
        } else {
          io.observe(el);
        }
      });
    };
    prime();
    window.addEventListener("load", prime);
  }

  /* ---------- rating charts ---------- */
  /* Each line builds on a loop, but only while it is actually on screen: the
     observer starts it on the way in and stops it once the chart has fully
     left, so charts you are not looking at are not animating. Re-entering
     restarts the cycle from empty rather than dropping you mid-build.

     The class is what the animation hangs off, so a browser without
     IntersectionObserver simply shows three finished charts. */
  var climbs = Array.prototype.slice.call(document.querySelectorAll(".climb"));
  if (climbs.length && !reduce && "IntersectionObserver" in window) {
    var climbIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var el = entry.target;
        if (entry.intersectionRatio >= 0.35) {
          if (el.classList.contains("is-drawing")) return;
          el.classList.add("is-drawing");
        } else if (!entry.isIntersecting) {
          /* Only once it is fully gone. Stopping it while a sliver is still
             visible would snap the line to finished in front of you. */
          el.classList.remove("is-drawing");
        }
      });
    }, { threshold: [0, 0.35] });
    climbs.forEach(function (el) { climbIO.observe(el); });
  }

  /* ---------- the schematic ---------- */
  var schema = document.getElementById("schematic");
  if (!schema) return;

  var svg = schema.querySelector("svg");
  var caption = document.getElementById("schematicCaption");
  var edges = Array.prototype.slice.call(svg.querySelectorAll(".edge"));
  var nodes = Array.prototype.slice.call(svg.querySelectorAll(".node"));
  var packet = svg.querySelector(".packet");
  var restingCaption = caption ? caption.textContent.trim() : "";

  /* Pull the lines back off the node dots so nothing collides. */
  var GAP = 13;
  edges.forEach(function (line) {
    var x1 = +line.getAttribute("x1"), y1 = +line.getAttribute("y1");
    var x2 = +line.getAttribute("x2"), y2 = +line.getAttribute("y2");
    var dx = x2 - x1, dy = y2 - y1;
    var len = Math.hypot(dx, dy) || 1;
    var ux = dx / len, uy = dy / len;
    line.setAttribute("x1", x1 + ux * GAP);
    line.setAttribute("y1", y1 + uy * GAP);
    line.setAttribute("x2", x2 - ux * GAP);
    line.setAttribute("y2", y2 - uy * GAP);
  });

  /* Draw the graph in once, upstream to downstream. The animation lives in
     CSS and is opt-in, so the resting state is always the finished drawing. */
  if (!reduce) {
    nodes.forEach(function (node, i) { node.style.setProperty("--i", i); });
    edges.forEach(function (line, i) {
      line.style.setProperty("--i", i);
      /* Dashed edges keep their own dash pattern, so they fade in instead. */
      if (line.classList.contains("edge--new")) return;
      var len = line.getTotalLength();
      line.style.setProperty("--len", len);
      line.style.strokeDasharray = len;
    });
    schema.classList.add("is-armed");

    /* Ring on each of the three big pieces, added here rather than in the
       markup so the diagram's source stays a plain description of the graph.
       Its phase is spaced across the cycle so they breathe in turn. */
    var hubs = nodes.filter(function (n) { return n.classList.contains("node--hub"); });
    hubs.forEach(function (node, i) {
      var dot = node.querySelector(".node__dot");
      var ring = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      ring.setAttribute("class", "node__pulse");
      ring.setAttribute("cx", dot.getAttribute("cx"));
      ring.setAttribute("cy", dot.getAttribute("cy"));
      ring.setAttribute("r", "14");
      node.insertBefore(ring, dot);
      node.style.setProperty("--i", i);
    });

    /* Idle motion only starts once the graph has finished drawing itself,
       so the entrance is not competing with it. */
    setTimeout(function () { schema.classList.add("is-live"); }, 1500);
  }

  /* ---- traffic ---------------------------------------------------------
     Packets run whole routes rather than single hops, so what you read is
     two pipelines end to end -- infrastructure to strategies, sources to
     answers -- instead of blips on unrelated segments. The routes are walked
     out of the edges themselves, so moving a line in the markup moves the
     traffic with it. */
  var built = edges.filter(function (e) { return !e.classList.contains("edge--new"); });

  var geom = function (e) {
    var x1 = +e.getAttribute("x1"), y1 = +e.getAttribute("y1");
    var x2 = +e.getAttribute("x2"), y2 = +e.getAttribute("y2");
    return { x1: x1, y1: y1, x2: x2, y2: y2, len: Math.hypot(x2 - x1, y2 - y1) };
  };

  var routes = (function () {
    var heads = built.filter(function (e) {
      return !built.some(function (o) { return o.dataset.to === e.dataset.from; });
    });
    return heads.map(function (head) {
      var chain = [head], at = head.dataset.to, guard = 0;
      while (guard++ < 12) {
        var next = null;
        for (var i = 0; i < built.length; i++) {
          if (built[i].dataset.from === at && chain.indexOf(built[i]) === -1) { next = built[i]; break; }
        }
        if (!next) break;
        chain.push(next);
        at = next.dataset.to;
      }
      return chain;
    });
  })();

  var live = [];
  /* The circle in the markup is the first one out of the pool, not just a
     template, so nothing sits in the DOM doing nothing. */
  var pool = packet ? [packet] : [];
  var running = false;

  var send = function (chain) {
    if (!packet || !chain.length || live.length > 5) return;
    var el = pool.pop();
    if (!el) {
      el = packet.cloneNode(false);
      packet.parentNode.insertBefore(el, packet.nextSibling);
    }
    var segs = chain.map(geom);
    live.push({
      el: el,
      segs: segs,
      dist: 0,
      total: segs.reduce(function (a, s) { return a + s.len; }, 0)
    });
    if (!running) { running = true; requestAnimationFrame(step); }
  };

  var SPEED = 0.16;   /* px per ms: a readable pace, not a tracer round */
  var FADE  = 26;     /* px of travel spent fading in and back out */
  var last = null;

  var step = function (now) {
    var dt = last === null ? 16 : Math.min(48, now - last);
    last = now;

    for (var i = live.length - 1; i >= 0; i--) {
      var p = live[i];
      p.dist += dt * SPEED;
      if (p.dist >= p.total) {
        p.el.setAttribute("opacity", "0");
        pool.push(p.el);
        live.splice(i, 1);
        continue;
      }
      var d = p.dist, s = null;
      for (var j = 0; j < p.segs.length; j++) {
        if (d <= p.segs[j].len || j === p.segs.length - 1) { s = p.segs[j]; break; }
        d -= p.segs[j].len;
      }
      var t = s.len ? d / s.len : 1;
      p.el.setAttribute("cx", s.x1 + (s.x2 - s.x1) * t);
      p.el.setAttribute("cy", s.y1 + (s.y2 - s.y1) * t);
      p.el.setAttribute("opacity", String(
        0.9 * Math.min(1, p.dist / FADE) * Math.min(1, (p.total - p.dist) / FADE)
      ));
    }

    if (live.length) { requestAnimationFrame(step); }
    else { running = false; last = null; }
  };

  /* ---- lighting and pinning -------------------------------------------- */
  var incident = function (name) {
    return edges.filter(function (line) {
      return line.dataset.from === name || line.dataset.to === name;
    });
  };

  var pinned = null;

  var paint = function (node) {
    nodes.forEach(function (n) { n.classList.remove("is-lit"); });
    edges.forEach(function (e) { e.classList.remove("is-lit"); });
    if (!node) {
      if (caption) caption.textContent = restingCaption;
      return;
    }
    node.classList.add("is-lit");
    incident(node.dataset.node).forEach(function (e) { e.classList.add("is-lit"); });
    if (caption) caption.textContent = node.dataset.caption;
  };

  /* Falls back to whatever is pinned, so leaving a node does not wipe a
     caption the reader deliberately parked. */
  var clear = function () { paint(pinned); };

  /* Touching a node pushes traffic down what it feeds, so the diagram answers
     the pointer rather than only changing colour. */
  var burst = function (name) {
    if (reduce) return;
    var out = built.filter(function (e) { return e.dataset.from === name; });
    if (!out.length) out = built.filter(function (e) { return e.dataset.to === name; });
    out.forEach(function (e) { send([e]); });
  };

  nodes.forEach(function (node) {
    var light = function () {
      paint(node);
      burst(node.dataset.node);
    };
    node.addEventListener("pointerenter", light);
    node.addEventListener("focus", light);
    node.addEventListener("pointerleave", clear);
    node.addEventListener("blur", clear);

    /* A click parks the caption. On a touchscreen that is the only way to
       read one, since the pointer leaves the moment the finger lifts. */
    node.addEventListener("click", function (ev) {
      ev.stopPropagation();
      nodes.forEach(function (n) { n.classList.remove("is-pinned"); });
      pinned = pinned === node ? null : node;
      if (pinned) pinned.classList.add("is-pinned");
      paint(pinned || node);
    });
  });

  svg.addEventListener("pointerleave", clear);
  document.addEventListener("click", function () {
    if (!pinned) return;
    pinned.classList.remove("is-pinned");
    pinned = null;
    paint(null);
  });

  /* Idle traffic: one route at a time, in rotation, and only while the panel
     is actually on screen. The diagram sits in the hero, so without this it
     would keep firing packets for the whole time you are reading further
     down the page. */
  if (!reduce && packet && routes.length) {
    var turn = 0;
    var onScreen = !("IntersectionObserver" in window);

    if (!onScreen) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[entries.length - 1].isIntersecting;
      }, { threshold: 0.15 }).observe(schema);
    }

    setTimeout(function () {
      send(routes[0]);
      setInterval(function () {
        if (document.hidden || !onScreen) return;
        turn = (turn + 1) % routes.length;
        send(routes[turn]);
      }, 2600);
    }, 2000);
  }
})();
