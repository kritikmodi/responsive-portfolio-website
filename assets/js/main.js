/* ============================================================
   Kritik Modi — kritikmodi.com
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

  /* ---------- local time in Delhi ---------- */
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
  }

  /* Hovering a layer lights its path and explains what it does. */
  var incident = function (name) {
    return edges.filter(function (line) {
      return line.dataset.from === name || line.dataset.to === name;
    });
  };

  var clear = function () {
    nodes.forEach(function (n) { n.classList.remove("is-lit"); });
    edges.forEach(function (e) { e.classList.remove("is-lit"); });
    if (caption) caption.textContent = restingCaption;
  };

  nodes.forEach(function (node) {
    var light = function () {
      clear();
      node.classList.add("is-lit");
      incident(node.dataset.node).forEach(function (e) { e.classList.add("is-lit"); });
      if (caption) caption.textContent = node.dataset.caption;
    };
    node.addEventListener("pointerenter", light);
    node.addEventListener("focus", light);
    node.addEventListener("click", light);
    node.addEventListener("pointerleave", clear);
    node.addEventListener("blur", clear);
  });

  svg.addEventListener("pointerleave", clear);

  /* A single packet crosses one hop every few seconds — a status light,
     not a light show. */
  var built = edges.filter(function (e) { return !e.classList.contains("edge--new"); });

  if (!reduce && packet && built.length) {
    var DUR = 900;
    var start = null;
    var hop = null;
    var waiting = 1800;

    var pick = function () {
      hop = built[Math.floor(Math.random() * built.length)];
      start = null;
    };

    var step = function (now) {
      if (!hop) {
        waiting -= 16;
        if (waiting <= 0) { pick(); waiting = 1400 + Math.random() * 1800; }
        packet.setAttribute("opacity", "0");
        requestAnimationFrame(step);
        return;
      }
      if (start === null) start = now;
      var t = Math.min(1, (now - start) / DUR);
      var e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      var x1 = +hop.getAttribute("x1"), y1 = +hop.getAttribute("y1");
      var x2 = +hop.getAttribute("x2"), y2 = +hop.getAttribute("y2");
      packet.setAttribute("cx", x1 + (x2 - x1) * e);
      packet.setAttribute("cy", y1 + (y2 - y1) * e);
      packet.setAttribute("opacity", String(Math.sin(t * Math.PI) * 0.9));
      if (t >= 1) hop = null;
      requestAnimationFrame(step);
    };

    setTimeout(function () { requestAnimationFrame(step); }, 2400);
  }
})();
