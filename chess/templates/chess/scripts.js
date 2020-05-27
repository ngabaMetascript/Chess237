var Player = 0;
var names = ["",""];
var room_id = 0;
var last_played = "";
var on_play = false;
var turns = ['w','b'];
var turn_token = null;
var message_token = null;
var game_token = null;

function index_turn(turn)
{
	result = 0;
	if (turn == 'b')
	{
		result = 1;
	}
	return result;
}

function initialize_room(room)
{
	room_id = room;
}

function updateViewPlayer(play="")
{
	if (play != "")
	{
		Player = play;
	}
	if (Player == 1)
	{
		updateView(0,180);
	}
	else		
	{
		updateView(0,0);
	}
}
function Vector() {}

function Line() {}

function Matrix() {}

function checkTouch() {
    var a = document.createElement("div");
    return a.setAttribute("ontouchmove", "return;"), typeof a.ontouchmove == "function" ? !0 : !1
}

function initControls() {
    for (var a = 0; a < piece.length; a++) piece[a].addEventListener(press, grabPiece, !1);
    app.addEventListener(drag, dragPiece, !1), app.addEventListener(drop, dropPiece, !1), app.addEventListener(drag, moveScene, !1), document.onselectstart = function(a) {
        a.preventDefault()
    }, document.ontouchmove = function(a) {
        a.preventDefault()
    }
}

function grabPiece(a) {
	if (turns[Player] == chess.turn()){
		!mouseDown && controls && (a.preventDefault(), mouseDown = !0, grabbed = this, grabbedID = grabbed.id.substr(-2), startX = a.pageX - document.body.offsetWidth / 2, startY = a.pageY - document.body.offsetHeight / 2, style = window.getComputedStyle(grabbed), matrix = style.getPropertyValue("-webkit-transform"), matrixParts = matrix.split(","), grabbedW = parseInt(style.getPropertyValue("width")) / 2, grabbedX = parseInt(matrixParts[4]), grabbedY = parseInt(matrixParts[5]), grabbed.classList.add("grabbed"), showMoves(grabbedID), highLight(grabbed, square))
	}
	else{
		var message = "C'est au tour de "+names[index_turn(chess.turn())]+" de jouer";
		alertify.warning(message);
	}
}

function dragPiece(a) {
    mouseDown && controls && (a.preventDefault(), moveX = a.pageX - document.body.offsetWidth / 2, moveY = a.pageY - document.body.offsetHeight / 2, distX = moveX - startX, distY = moveY - startY, currentColor === "w" ? (newX = grabbedX + distX, newY = grabbedY + distY) : (newX = -(grabbedX + distX), newY = -(grabbedY + distY)), grabbed.style.webkitTransform = "translateX(" + newX + "px) translateY(" + newY + "px) translateZ(2px)", highLight(grabbed, square))
}

function dropPiece(a) {
    if (mouseDown && controls) {
        a.preventDefault();
        var b = closestElement.id;

        function c(a) {
            return document.getElementById(b).className.match(new RegExp("(\\s|^)" + a + "(\\s|$)"))
        }
        if (c("valid")) {
            if (c("captured")) {
                var d = chess.get(b).type,
                    e = chess.get(b).color;
                currentColor === "w" ? createPiece(e, d, "w-jail") : createPiece(e, d, "b-jail")
            }
            hideMoves(grabbedID), chess.move({
                from: grabbedID,
                to: b,
                promotion: "q"
            })
        } else hideMoves(grabbedID), grabbed.style.webkitTransform = "translateX(0px) translateY(0px) translateZ(2px)";
        updateBoard(), grabbed.classList.remove("grabbed"), mouseDown = !1
    }
}

function moveScene(a) {
    animated && (eventStartX = a.pageX - document.body.offsetWidth / 2, eventStartY = a.pageY - document.body.offsetHeight / 2), eventStartX = 0, eventStartY = 0;
    if (!controls && !animated) {
        document.body.classList.remove("animated"), a.preventDefault(), eventMoveX = a.pageX - document.body.offsetWidth / 2, eventDistX = eventMoveX - eventStartX, eventMoveY = a.pageY - document.body.offsetHeight / 2, eventDistY = eventMoveY - eventStartY, eventX = sceneY - eventDistX * -0.03, eventY = sceneX - eventDistY * -0.03, scene.style.webkitTransform = "RotateX(" + eventY + "deg) RotateZ(" + eventX + "deg)";
        for (var b = 0; b < sphere.length; b++) updateSphere(sphere[b], eventY, eventX)
    }
}

function showMoves(a) {
	console.log(a);
    var b = chess.moves({
        target: a,
        verbose: !0
    });
    for (var c = 0; c < b.length; c++) {
        var d = b[c],
            e = d.from,
            f = d.to,
            g = d.captured;
		ee = document.getElementById(e);
		ff = document.getElementById(f);
		if (ff != null){
			ee.classList.add("current"), ff.classList.add("valid"), g && ff.classList.add("captured")
		}
		else{
				ee.classList.add("current");
				alertify.error("Mouvement invalide");
			}
    }
}

function hideMoves(a) {
    var b = chess.moves({
        target: a,
        verbose: !0
    });
    for (var c = 0; c < b.length; c++) {
        var d = b[c],
            e = d.from,
            f = d.to
		ee = document.getElementById(e);
		ff = document.getElementById(f);
		if (ff != null){
			ee.classList.remove("current"), ff.classList.remove("valid"), ff.classList.remove("captured")
		}
		else{
			ee.classList.add("current");
		}
	}
}

function createPiece(a, b, c) {
    var d = document.getElementById(b).cloneNode(!0);
    d.addEventListener(press, grabPiece, !1), d.setAttribute("id", a + b + c), a === "w" ? d.classList.add("white") : d.classList.add("black"), document.getElementById(c).appendChild(d)
}

function updateBoard(e1="",e2="",play="") {
    if (e1 != "")
    {
       names[0] = e1;
    }
    function m(a) {
        document.getElementById("log").innerHTML = a
    }
    var a = {},
        b = chess.in_check(),
        c = chess.in_checkmate(),
        d = chess.in_draw(),
        e = chess.in_stalemate(),
        f = chess.in_threefold_repetition();
    chess.SQUARES.forEach(function(b) {
        var c = board[b],
            d = chess.get(b);
        if (c && d) {
            if (c.type !== d.type || c.color !== d.color) a[b] = d
        } else if (c || d) a[b] = d;
        board[b] = d
    });
    for (var g in a) {
        var h = document.getElementById([g]);
        if (a[g] === null) h.innerHTML = "";
        else {
            var i = a[g].color,
                j = a[g].type,
                k = i + j;
            currentColor === i && !h.hasChildNodes() ? createPiece(i, j, [g]) : (h.innerHTML = "", createPiece(i, j, [g]))
        }
    }
    var l = chess.fen();
    currentColor = chess.turn(), l !== "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" ? document.getElementById("undo").dataset.state = "active" : document.getElementById("undo").dataset.state = "inactive", currentColor === "w" ? (updateViewPlayer(play), m("Tours des Blancs ("+names[0]+")"), b && m("Blancs, votre roi est en echec!"), c && m("Blancs, vous etes echec et mat. les Noirs gagnent")) : (updateViewPlayer(play), m("Tours des Noirs ("+names[1]+")"), b && m("Noirs, votre roi est en echec"), c && m("Noirs, vous etes echec et mat. les Blancs gagnent"))
}

function updateCaptured() {
    var a = document.getElementById("board").getElementsByClassName("white"),
        b = document.getElementById("board").getElementsByClassName("black"),
        c = document.getElementById("w-jail").getElementsByClassName("black"),
        d = document.getElementById("b-jail").getElementsByClassName("white");
    if (a.length + d.length !== 16) {
        var e = document.getElementById("b-jail").lastChild;
        document.getElementById("b-jail").removeChild(e)
    }
    if (b.length + c.length !== 16) {
        var e = document.getElementById("w-jail").lastChild;
        document.getElementById("w-jail").removeChild(e)
    }
}

function undoMove() {
    chess.undo(), updateBoard(), updateCaptured()
}

function highLight(a, b) {
    function c(a) {
        var b = a.getBoundingClientRect();
        return {
            x: b.left,
            y: b.top
        }
    }
    var d = c(a).x + grabbedW;
    elementRight = d + a.offsetWidth - grabbedW, elementTop = c(a).y + grabbedW, elementBottom = elementTop + a.offsetHeight - grabbedW, smallestDistance = null;
    for (var e = 0; e < b.length; e++) {
        if (currentColor === "w") var f = c(b[e]).x,
            g = f + b[e].offsetWidth,
            h = c(b[e]).y,
            i = h + b[e].offsetHeight;
        else var f = c(b[e]).x + grabbedW,
            g = f + b[e].offsetWidth,
            h = c(b[e]).y + grabbedW,
            i = h + b[e].offsetHeight;
        var j = 0,
            k = 0;
        g < d ? j = d - g : f > elementRight && (j = f - elementRight), i < elementTop ? k = elementTop - i : h > elementBottom && (k = h - elementBottom);
        var l = 0;
        j > k ? l = j : l = k, smallestDistance === null ? (smallestDistance = l, closestElement = b[e]) : l < smallestDistance && (smallestDistance = l, closestElement = b[e])
    }
    for (var e = 0; e < b.length; e++) b[e].classList.remove("highlight");
    closestElement.classList.add("highlight"), targetX = closestElement.offsetLeft, targetY = closestElement.offsetTop
}

function updateView(a, b) {
    scene.style.webkitTransform = "rotateX( " + a + "deg) rotateZ( " + b + "deg)";
    for (var c = 0; c < sphere.length; c++) updateSphere(sphere[c], a, b)
}

function updateSphere(a, b, c) {
    a.style.WebkitTransform = "rotateZ( " + -c + "deg ) rotateX( " + -b + "deg )"
}

function renderPoly() {
    var a = new Photon.Light(x = 50, y = 150, z = 250),
        b = 1,
        c = 1,
        d = new Photon.FaceGroup($("#container")[0], $("#container .face"), 1.6, .48, !0);
    d.render(a, !0)
}

function resetPoly() {
    for (var a = 0; a < photon.length; a++) photon[a].setAttribute("style", "");
    timeOut != null && clearTimeout(timeOut), timeOut = setTimeout(renderPoly, 250)
}

function Continue() {
    updateBoard(), controls = !0, animated = !0, document.getElementById("app").dataset.state = "game", document.body.classList.add("animated")
}

function optionScreen() {
    function a() {
        animated = !1
    }
    updateView(sceneX, sceneY), controls = !1, document.getElementById("app").dataset.state = "menu", setTimeout(a, 2500)
}

function toggleFrame(a) {
    a.checked ? document.getElementById("app").dataset.frame = "on" : document.getElementById("app").dataset.frame = "off", resetPoly()
}

function setState(a) {
    a.preventDefault();
    var b = this.dataset.menu;
    document.getElementById("app").dataset.menu = b
}

function setTheme(a) {
    a.preventDefault();
    var b = this.dataset.theme;
    document.getElementById("app").dataset.theme = b;
    if (b === "classic" || b === "marble") white = "White", black = "Black";
    else if (b === "flat" || b === "wireframe") white = "Blue", black = "Red"
}

function UI() {
    var a = document.getElementsByClassName("menu-nav"),
        b = document.getElementsByClassName("set-theme");
    for (var c = 0; c < a.length; c++) a[c].addEventListener(press, setState, !1);
    for (var c = 0; c < b.length; c++) b[c].addEventListener(press, setTheme, !1);
    document.getElementById("continue").addEventListener(press, Continue, !1), document.getElementById("open-menu").addEventListener(press, optionScreen, !1), document.getElementById("undo").addEventListener(press, undoMove, !1)
}

function init() {
    function a() {
        document.getElementById("logo").innerHTML = ""
    }
    app.classList.remove("loading"), document.body.classList.add("animated"), animated = !0, updateBoard(), optionScreen(), initControls(), UI(), setTimeout(a, 2e3)
}(function(a, b) {
    function c(a) {
        return J.isWindow(a) ? a : a.nodeType === 9 ? a.defaultView || a.parentWindow : !1
    }

    function d(a) {
        if (!co[a]) {
            var b = G.body,
                c = J("<" + a + ">").appendTo(b),
                d = c.css("display");
            c.remove();
            if (d === "none" || d === "") {
                cp || (cp = G.createElement("iframe"), cp.frameBorder = cp.width = cp.height = 0), b.appendChild(cp);
                if (!cq || !cp.createElement) cq = (cp.contentWindow || cp.contentDocument).document, cq.write((J.support.boxModel ? "<!doctype html>" : "") + "<html><body>"), cq.close();
                c = cq.createElement(a), cq.body.appendChild(c), d = J.css(c, "display"), b.removeChild(cp)
            }
            co[a] = d
        }
        return co[a]
    }

    function e(a, b) {
        var c = {};
        return J.each(cu.concat.apply([], cu.slice(0, b)), function() {
            c[this] = a
        }), c
    }

    function f() {
        cv = b
    }

    function g() {
        return setTimeout(f, 0), cv = J.now()
    }

    function h() {
        try {
            return new a.ActiveXObject("Microsoft.XMLHTTP")
        } catch (b) {}
    }

    function i() {
        try {
            return new a.XMLHttpRequest
        } catch (b) {}
    }

    function j(a, c) {
        a.dataFilter && (c = a.dataFilter(c, a.dataType));
        var d = a.dataTypes,
            e = {},
            f, g, h = d.length,
            i, j = d[0],
            k, l, m, n, o;
        for (f = 1; f < h; f++) {
            if (f === 1)
                for (g in a.converters) typeof g == "string" && (e[g.toLowerCase()] = a.converters[g]);
            k = j, j = d[f];
            if (j === "*") j = k;
            else if (k !== "*" && k !== j) {
                l = k + " " + j, m = e[l] || e["* " + j];
                if (!m) {
                    o = b;
                    for (n in e) {
                        i = n.split(" ");
                        if (i[0] === k || i[0] === "*") {
                            o = e[i[1] + " " + j];
                            if (o) {
                                n = e[n], n === !0 ? m = o : o === !0 && (m = n);
                                break
                            }
                        }
                    }
                }!m && !o && J.error("No conversion from " + l.replace(" ", " to ")), m !== !0 && (c = m ? m(c) : o(n(c)))
            }
        }
        return c
    }

    function k(a, c, d) {
        var e = a.contents,
            f = a.dataTypes,
            g = a.responseFields,
            h, i, j, k;
        for (i in g) i in d && (c[g[i]] = d[i]);
        while (f[0] === "*") f.shift(), h === b && (h = a.mimeType || c.getResponseHeader("content-type"));
        if (h)
            for (i in e)
                if (e[i] && e[i].test(h)) {
                    f.unshift(i);
                    break
                }
        if (f[0] in d) j = f[0];
        else {
            for (i in d) {
                if (!f[0] || a.converters[i + " " + f[0]]) {
                    j = i;
                    break
                }
                k || (k = i)
            }
            j = j || k
        }
        if (j) return j !== f[0] && f.unshift(j), d[j]
    }

    function l(a, b, c, d) {
        if (J.isArray(b)) J.each(b, function(b, e) {
            c || bQ.test(a) ? d(a, e) : l(a + "[" + (typeof e == "object" ? b : "") + "]", e, c, d)
        });
        else if (!c && J.type(b) === "object")
            for (var e in b) l(a + "[" + e + "]", b[e], c, d);
        else d(a, b)
    }

    function m(a, c) {
        var d, e, f = J.ajaxSettings.flatOptions || {};
        for (d in c) c[d] !== b && ((f[d] ? a : e || (e = {}))[d] = c[d]);
        e && J.extend(!0, a, e)
    }

    function n(a, c, d, e, f, g) {
        f = f || c.dataTypes[0], g = g || {}, g[f] = !0;
        var h = a[f],
            i = 0,
            j = h ? h.length : 0,
            k = a === cd,
            l;
        for (; i < j && (k || !l); i++) l = h[i](c, d, e), typeof l == "string" && (!k || g[l] ? l = b : (c.dataTypes.unshift(l), l = n(a, c, d, e, l, g)));
        return (k || !l) && !g["*"] && (l = n(a, c, d, e, "*", g)), l
    }

    function o(a) {
        return function(b, c) {
            typeof b != "string" && (c = b, b = "*");
            if (J.isFunction(c)) {
                var d = b.toLowerCase().split(b_),
                    e = 0,
                    f = d.length,
                    g, h, i;
                for (; e < f; e++) g = d[e], i = /^\+/.test(g), i && (g = g.substr(1) || "*"), h = a[g] = a[g] || [], h[i ? "unshift" : "push"](c)
            }
        }
    }

    function p(a, b, c) {
        var d = b === "width" ? a.offsetWidth : a.offsetHeight,
            e = b === "width" ? 1 : 0,
            f = 4;
        if (d > 0) {
            if (c !== "border")
                for (; e < f; e += 2) c || (d -= parseFloat(J.css(a, "padding" + bL[e])) || 0), c === "margin" ? d += parseFloat(J.css(a, c + bL[e])) || 0 : d -= parseFloat(J.css(a, "border" + bL[e] + "Width")) || 0;
            return d + "px"
        }
        d = bM(a, b);
        if (d < 0 || d == null) d = a.style[b];
        if (bH.test(d)) return d;
        d = parseFloat(d) || 0;
        if (c)
            for (; e < f; e += 2) d += parseFloat(J.css(a, "padding" + bL[e])) || 0, c !== "padding" && (d += parseFloat(J.css(a, "border" + bL[e] + "Width")) || 0), c === "margin" && (d += parseFloat(J.css(a, c + bL[e])) || 0);
        return d + "px"
    }

    function q(a) {
        var b = G.createElement("div");
        return bC.appendChild(b), b.innerHTML = a.outerHTML, b.firstChild
    }

    function r(a) {
        var b = (a.nodeName || "").toLowerCase();
        b === "input" ? s(a) : b !== "script" && typeof a.getElementsByTagName != "undefined" && J.grep(a.getElementsByTagName("input"), s)
    }

    function s(a) {
        if (a.type === "checkbox" || a.type === "radio") a.defaultChecked = a.checked
    }

    function t(a) {
        return typeof a.getElementsByTagName != "undefined" ? a.getElementsByTagName("*") : typeof a.querySelectorAll != "undefined" ? a.querySelectorAll("*") : []
    }

    function u(a, b) {
        var c;
        b.nodeType === 1 && (b.clearAttributes && b.clearAttributes(), b.mergeAttributes && b.mergeAttributes(a), c = b.nodeName.toLowerCase(), c === "object" ? b.outerHTML = a.outerHTML : c !== "input" || a.type !== "checkbox" && a.type !== "radio" ? c === "option" ? b.selected = a.defaultSelected : c === "input" || c === "textarea" ? b.defaultValue = a.defaultValue : c === "script" && b.text !== a.text && (b.text = a.text) : (a.checked && (b.defaultChecked = b.checked = a.checked), b.value !== a.value && (b.value = a.value)), b.removeAttribute(J.expando), b.removeAttribute("_submit_attached"), b.removeAttribute("_change_attached"))
    }

    function v(a, b) {
        if (b.nodeType === 1 && !!J.hasData(a)) {
            var c, d, e, f = J._data(a),
                g = J._data(b, f),
                h = f.events;
            if (h) {
                delete g.handle, g.events = {};
                for (c in h)
                    for (d = 0, e = h[c].length; d < e; d++) J.event.add(b, c, h[c][d])
            }
            g.data && (g.data = J.extend({}, g.data))
        }
    }

    function w(a, b) {
        return J.nodeName(a, "table") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
    }

    function x(a) {
        var b = bo.split("|"),
            c = a.createDocumentFragment();
        if (c.createElement)
            while (b.length) c.createElement(b.pop());
        return c
    }

    function y(a, b, c) {
        b = b || 0;
        if (J.isFunction(b)) return J.grep(a, function(a, d) {
            var e = !!b.call(a, d, a);
            return e === c
        });
        if (b.nodeType) return J.grep(a, function(a, d) {
            return a === b === c
        });
        if (typeof b == "string") {
            var d = J.grep(a, function(a) {
                return a.nodeType === 1
            });
            if (bk.test(b)) return J.filter(b, d, !c);
            b = J.filter(b, d)
        }
        return J.grep(a, function(a, d) {
            return J.inArray(a, b) >= 0 === c
        })
    }

    function z(a) {
        return !a || !a.parentNode || a.parentNode.nodeType === 11
    }

    function A() {
        return !0
    }

    function B() {
        return !1
    }

    function C(a, b, c) {
        var d = b + "defer",
            e = b + "queue",
            f = b + "mark",
            g = J._data(a, d);
        g && (c === "queue" || !J._data(a, e)) && (c === "mark" || !J._data(a, f)) && setTimeout(function() {
            !J._data(a, e) && !J._data(a, f) && (J.removeData(a, d, !0), g.fire())
        }, 0)
    }

    function D(a) {
        for (var b in a) {
            if (b === "data" && J.isEmptyObject(a[b])) continue;
            if (b !== "toJSON") return !1
        }
        return !0
    }

    function E(a, c, d) {
        if (d === b && a.nodeType === 1) {
            var e = "data-" + c.replace(N, "-$1").toLowerCase();
            d = a.getAttribute(e);
            if (typeof d == "string") {
                try {
                    d = d === "true" ? !0 : d === "false" ? !1 : d === "null" ? null : J.isNumeric(d) ? +d : M.test(d) ? J.parseJSON(d) : d
                } catch (f) {}
                J.data(a, c, d)
            } else d = b
        }
        return d
    }

    function F(a) {
        var b = K[a] = {},
            c, d;
        a = a.split(/\s+/);
        for (c = 0, d = a.length; c < d; c++) b[a[c]] = !0;
        return b
    }
    var G = a.document,
        H = a.navigator,
        I = a.location,
        J = function() {
            function c() {
                if (!d.isReady) {
                    try {
                        G.documentElement.doScroll("left")
                    } catch (a) {
                        setTimeout(c, 1);
                        return
                    }
                    d.ready()
                }
            }
            var d = function(a, b) {
                    return new d.fn.init(a, b, g)
                },
                e = a.jQuery,
                f = a.$,
                g, h = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,
                i = /\S/,
                j = /^\s+/,
                k = /\s+$/,
                l = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,
                m = /^[\],:{}\s]*$/,
                n = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                o = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                p = /(?:^|:|,)(?:\s*\[)+/g,
                q = /(webkit)[ \/]([\w.]+)/,
                r = /(opera)(?:.*version)?[ \/]([\w.]+)/,
                s = /(msie) ([\w.]+)/,
                t = /(mozilla)(?:.*? rv:([\w.]+))?/,
                u = /-([a-z]|[0-9])/ig,
                v = /^-ms-/,
                w = function(a, b) {
                    return (b + "").toUpperCase()
                },
                x = H.userAgent,
                y, z, A, B = Object.prototype.toString,
                C = Object.prototype.hasOwnProperty,
                D = Array.prototype.push,
                E = Array.prototype.slice,
                F = String.prototype.trim,
                I = Array.prototype.indexOf,
                J = {};
            return d.fn = d.prototype = {
                constructor: d,
                init: function(a, c, e) {
                    var f, g, i, j;
                    if (!a) return this;
                    if (a.nodeType) return this.context = this[0] = a, this.length = 1, this;
                    if (a === "body" && !c && G.body) return this.context = G, this[0] = G.body, this.selector = a, this.length = 1, this;
                    if (typeof a == "string") {
                        a.charAt(0) !== "<" || a.charAt(a.length - 1) !== ">" || a.length < 3 ? f = h.exec(a) : f = [null, a, null];
                        if (f && (f[1] || !c)) {
                            if (f[1]) return c = c instanceof d ? c[0] : c, j = c ? c.ownerDocument || c : G, i = l.exec(a), i ? d.isPlainObject(c) ? (a = [G.createElement(i[1])], d.fn.attr.call(a, c, !0)) : a = [j.createElement(i[1])] : (i = d.buildFragment([f[1]], [j]), a = (i.cacheable ? d.clone(i.fragment) : i.fragment).childNodes), d.merge(this, a);
                            g = G.getElementById(f[2]);
                            if (g && g.parentNode) {
                                if (g.id !== f[2]) return e.find(a);
                                this.length = 1, this[0] = g
                            }
                            return this.context = G, this.selector = a, this
                        }
                        return !c || c.jquery ? (c || e).find(a) : this.constructor(c).find(a)
                    }
                    return d.isFunction(a) ? e.ready(a) : (a.selector !== b && (this.selector = a.selector, this.context = a.context), d.makeArray(a, this))
                },
                selector: "",
                jquery: "1.7.2",
                length: 0,
                size: function() {
                    return this.length
                },
                toArray: function() {
                    return E.call(this, 0)
                },
                get: function(a) {
                    return a == null ? this.toArray() : a < 0 ? this[this.length + a] : this[a]
                },
                pushStack: function(a, b, c) {
                    var e = this.constructor();
                    return d.isArray(a) ? D.apply(e, a) : d.merge(e, a), e.prevObject = this, e.context = this.context, b === "find" ? e.selector = this.selector + (this.selector ? " " : "") + c : b && (e.selector = this.selector + "." + b + "(" + c + ")"), e
                },
                each: function(a, b) {
                    return d.each(this, a, b)
                },
                ready: function(a) {
                    return d.bindReady(), z.add(a), this
                },
                eq: function(a) {
                    return a = +a, a === -1 ? this.slice(a) : this.slice(a, a + 1)
                },
                first: function() {
                    return this.eq(0)
                },
                last: function() {
                    return this.eq(-1)
                },
                slice: function() {
                    return this.pushStack(E.apply(this, arguments), "slice", E.call(arguments).join(","))
                },
                map: function(a) {
                    return this.pushStack(d.map(this, function(b, c) {
                        return a.call(b, c, b)
                    }))
                },
                end: function() {
                    return this.prevObject || this.constructor(null)
                },
                push: D,
                sort: [].sort,
                splice: [].splice
            }, d.fn.init.prototype = d.fn, d.extend = d.fn.extend = function() {
                var a, c, e, f, g, h, i = arguments[0] || {},
                    j = 1,
                    k = arguments.length,
                    l = !1;
                typeof i == "boolean" && (l = i, i = arguments[1] || {}, j = 2), typeof i != "object" && !d.isFunction(i) && (i = {}), k === j && (i = this, --j);
                for (; j < k; j++)
                    if ((a = arguments[j]) != null)
                        for (c in a) {
                            e = i[c], f = a[c];
                            if (i === f) continue;
                            l && f && (d.isPlainObject(f) || (g = d.isArray(f))) ? (g ? (g = !1, h = e && d.isArray(e) ? e : []) : h = e && d.isPlainObject(e) ? e : {}, i[c] = d.extend(l, h, f)) : f !== b && (i[c] = f)
                        }
                    return i
            }, d.extend({
                noConflict: function(b) {
                    return a.$ === d && (a.$ = f), b && a.jQuery === d && (a.jQuery = e), d
                },
                isReady: !1,
                readyWait: 1,
                holdReady: function(a) {
                    a ? d.readyWait++ : d.ready(!0)
                },
                ready: function(a) {
                    if (a === !0 && !--d.readyWait || a !== !0 && !d.isReady) {
                        if (!G.body) return setTimeout(d.ready, 1);
                        d.isReady = !0;
                        if (a !== !0 && --d.readyWait > 0) return;
                        z.fireWith(G, [d]), d.fn.trigger && d(G).trigger("ready").off("ready")
                    }
                },
                bindReady: function() {
                    if (!z) {
                        z = d.Callbacks("once memory");
                        if (G.readyState === "complete") return setTimeout(d.ready, 1);
                        if (G.addEventListener) G.addEventListener("DOMContentLoaded", A, !1), a.addEventListener("load", d.ready, !1);
                        else if (G.attachEvent) {
                            G.attachEvent("onreadystatechange", A), a.attachEvent("onload", d.ready);
                            var b = !1;
                            try {
                                b = a.frameElement == null
                            } catch (e) {}
                            G.documentElement.doScroll && b && c()
                        }
                    }
                },
                isFunction: function(a) {
                    return d.type(a) === "function"
                },
                isArray: Array.isArray || function(a) {
                    return d.type(a) === "array"
                },
                isWindow: function(a) {
                    return a != null && a == a.window
                },
                isNumeric: function(a) {
                    return !isNaN(parseFloat(a)) && isFinite(a)
                },
                type: function(a) {
                    return a == null ? String(a) : J[B.call(a)] || "object"
                },
                isPlainObject: function(a) {
                    if (!a || d.type(a) !== "object" || a.nodeType || d.isWindow(a)) return !1;
                    try {
                        if (a.constructor && !C.call(a, "constructor") && !C.call(a.constructor.prototype, "isPrototypeOf")) return !1
                    } catch (c) {
                        return !1
                    }
                    var e;
                    for (e in a);
                    return e === b || C.call(a, e)
                },
                isEmptyObject: function(a) {
                    for (var b in a) return !1;
                    return !0
                },
                error: function(a) {
                    throw new Error(a)
                },
                parseJSON: function(b) {
                    if (typeof b != "string" || !b) return null;
                    b = d.trim(b);
                    if (a.JSON && a.JSON.parse) return a.JSON.parse(b);
                    if (m.test(b.replace(n, "@").replace(o, "]").replace(p, ""))) return (new Function("return " + b))();
                    d.error("Invalid JSON: " + b)
                },
                parseXML: function(c) {
                    if (typeof c != "string" || !c) return null;
                    var e, f;
                    try {
                        a.DOMParser ? (f = new DOMParser, e = f.parseFromString(c, "text/xml")) : (e = new ActiveXObject("Microsoft.XMLDOM"), e.async = "false", e.loadXML(c))
                    } catch (g) {
                        e = b
                    }
                    return (!e || !e.documentElement || e.getElementsByTagName("parsererror").length) && d.error("Invalid XML: " + c), e
                },
                noop: function() {},
                globalEval: function(b) {
                    b && i.test(b) && (a.execScript || function(b) {
                        a.eval.call(a, b)
                    })(b)
                },
                camelCase: function(a) {
                    return a.replace(v, "ms-").replace(u, w)
                },
                nodeName: function(a, b) {
                    return a.nodeName && a.nodeName.toUpperCase() === b.toUpperCase()
                },
                each: function(a, c, e) {
                    var f, g = 0,
                        h = a.length,
                        i = h === b || d.isFunction(a);
                    if (e) {
                        if (i) {
                            for (f in a)
                                if (c.apply(a[f], e) === !1) break
                        } else
                            for (; g < h;)
                                if (c.apply(a[g++], e) === !1) break
                    } else if (i) {
                        for (f in a)
                            if (c.call(a[f], f, a[f]) === !1) break
                    } else
                        for (; g < h;)
                            if (c.call(a[g], g, a[g++]) === !1) break; return a
                },
                trim: F ? function(a) {
                    return a == null ? "" : F.call(a)
                } : function(a) {
                    return a == null ? "" : (a + "").replace(j, "").replace(k, "")
                },
                makeArray: function(a, b) {
                    var c = b || [];
                    if (a != null) {
                        var e = d.type(a);
                        a.length == null || e === "string" || e === "function" || e === "regexp" || d.isWindow(a) ? D.call(c, a) : d.merge(c, a)
                    }
                    return c
                },
                inArray: function(a, b, c) {
                    var d;
                    if (b) {
                        if (I) return I.call(b, a, c);
                        d = b.length, c = c ? c < 0 ? Math.max(0, d + c) : c : 0;
                        for (; c < d; c++)
                            if (c in b && b[c] === a) return c
                    }
                    return -1
                },
                merge: function(a, c) {
                    var d = a.length,
                        e = 0;
                    if (typeof c.length == "number")
                        for (var f = c.length; e < f; e++) a[d++] = c[e];
                    else
                        while (c[e] !== b) a[d++] = c[e++];
                    return a.length = d, a
                },
                grep: function(a, b, c) {
                    var d = [],
                        e;
                    c = !!c;
                    for (var f = 0, g = a.length; f < g; f++) e = !!b(a[f], f), c !== e && d.push(a[f]);
                    return d
                },
                map: function(a, c, e) {
                    var f, g, h = [],
                        i = 0,
                        j = a.length,
                        k = a instanceof d || j !== b && typeof j == "number" && (j > 0 && a[0] && a[j - 1] || j === 0 || d.isArray(a));
                    if (k)
                        for (; i < j; i++) f = c(a[i], i, e), f != null && (h[h.length] = f);
                    else
                        for (g in a) f = c(a[g], g, e), f != null && (h[h.length] = f);
                    return h.concat.apply([], h)
                },
                guid: 1,
                proxy: function(a, c) {
                    if (typeof c == "string") {
                        var e = a[c];
                        c = a, a = e
                    }
                    if (!d.isFunction(a)) return b;
                    var f = E.call(arguments, 2),
                        g = function() {
                            return a.apply(c, f.concat(E.call(arguments)))
                        };
                    return g.guid = a.guid = a.guid || g.guid || d.guid++, g
                },
                access: function(a, c, e, f, g, h, i) {
                    var j, k = e == null,
                        l = 0,
                        m = a.length;
                    if (e && typeof e == "object") {
                        for (l in e) d.access(a, c, l, e[l], 1, h, f);
                        g = 1
                    } else if (f !== b) {
                        j = i === b && d.isFunction(f), k && (j ? (j = c, c = function(a, b, c) {
                            return j.call(d(a), c)
                        }) : (c.call(a, f), c = null));
                        if (c)
                            for (; l < m; l++) c(a[l], e, j ? f.call(a[l], l, c(a[l], e)) : f, i);
                        g = 1
                    }
                    return g ? a : k ? c.call(a) : m ? c(a[0], e) : h
                },
                now: function() {
                    return (new Date).getTime()
                },
                uaMatch: function(a) {
                    a = a.toLowerCase();
                    var b = q.exec(a) || r.exec(a) || s.exec(a) || a.indexOf("compatible") < 0 && t.exec(a) || [];
                    return {
                        browser: b[1] || "",
                        version: b[2] || "0"
                    }
                },
                sub: function() {
                    function a(b, c) {
                        return new a.fn.init(b, c)
                    }
                    d.extend(!0, a, this), a.superclass = this, a.fn = a.prototype = this(), a.fn.constructor = a, a.sub = this.sub, a.fn.init = function(c, e) {
                        return e && e instanceof d && !(e instanceof a) && (e = a(e)), d.fn.init.call(this, c, e, b)
                    }, a.fn.init.prototype = a.fn;
                    var b = a(G);
                    return a
                },
                browser: {}
            }), d.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(a, b) {
                J["[object " + b + "]"] = b.toLowerCase()
            }), y = d.uaMatch(x), y.browser && (d.browser[y.browser] = !0, d.browser.version = y.version), d.browser.webkit && (d.browser.safari = !0), i.test(" ") && (j = /^[\s\xA0]+/, k = /[\s\xA0]+$/), g = d(G), G.addEventListener ? A = function() {
                G.removeEventListener("DOMContentLoaded", A, !1), d.ready()
            } : G.attachEvent && (A = function() {
                G.readyState === "complete" && (G.detachEvent("onreadystatechange", A), d.ready())
            }), d
        }(),
        K = {};
    J.Callbacks = function(a) {
        a = a ? K[a] || F(a) : {};
        var c = [],
            d = [],
            e, f, g, h, i, j, k = function(b) {
                var d, e, f, g, h;
                for (d = 0, e = b.length; d < e; d++) f = b[d], g = J.type(f), g === "array" ? k(f) : g === "function" && (!a.unique || !m.has(f)) && c.push(f)
            },
            l = function(b, k) {
                k = k || [], e = !a.memory || [b, k], f = !0, g = !0, j = h || 0, h = 0, i = c.length;
                for (; c && j < i; j++)
                    if (c[j].apply(b, k) === !1 && a.stopOnFalse) {
                        e = !0;
                        break
                    }
                g = !1, c && (a.once ? e === !0 ? m.disable() : c = [] : d && d.length && (e = d.shift(), m.fireWith(e[0], e[1])))
            },
            m = {
                add: function() {
                    if (c) {
                        var a = c.length;
                        k(arguments), g ? i = c.length : e && e !== !0 && (h = a, l(e[0], e[1]))
                    }
                    return this
                },
                remove: function() {
                    if (c) {
                        var b = arguments,
                            d = 0,
                            e = b.length;
                        for (; d < e; d++)
                            for (var f = 0; f < c.length; f++)
                                if (b[d] === c[f]) {
                                    g && f <= i && (i--, f <= j && j--), c.splice(f--, 1);
                                    if (a.unique) break
                                }
                    }
                    return this
                },
                has: function(a) {
                    if (c) {
                        var b = 0,
                            d = c.length;
                        for (; b < d; b++)
                            if (a === c[b]) return !0
                    }
                    return !1
                },
                empty: function() {
                    return c = [], this
                },
                disable: function() {
                    return c = d = e = b, this
                },
                disabled: function() {
                    return !c
                },
                lock: function() {
                    return d = b, (!e || e === !0) && m.disable(), this
                },
                locked: function() {
                    return !d
                },
                fireWith: function(b, c) {
                    return d && (g ? a.once || d.push([b, c]) : (!a.once || !e) && l(b, c)), this
                },
                fire: function() {
                    return m.fireWith(this, arguments), this
                },
                fired: function() {
                    return !!f
                }
            };
        return m
    };
    var L = [].slice;
    J.extend({
        Deferred: function(a) {
            var b = J.Callbacks("once memory"),
                c = J.Callbacks("once memory"),
                d = J.Callbacks("memory"),
                e = "pending",
                f = {
                    resolve: b,
                    reject: c,
                    notify: d
                },
                g = {
                    done: b.add,
                    fail: c.add,
                    progress: d.add,
                    state: function() {
                        return e
                    },
                    isResolved: b.fired,
                    isRejected: c.fired,
                    then: function(a, b, c) {
                        return h.done(a).fail(b).progress(c), this
                    },
                    always: function() {
                        return h.done.apply(h, arguments).fail.apply(h, arguments), this
                    },
                    pipe: function(a, b, c) {
                        return J.Deferred(function(d) {
                            J.each({
                                done: [a, "resolve"],
                                fail: [b, "reject"],
                                progress: [c, "notify"]
                            }, function(a, b) {
                                var c = b[0],
                                    e = b[1],
                                    f;
                                J.isFunction(c) ? h[a](function() {
                                    f = c.apply(this, arguments), f && J.isFunction(f.promise) ? f.promise().then(d.resolve, d.reject, d.notify) : d[e + "With"](this === h ? d : this, [f])
                                }) : h[a](d[e])
                            })
                        }).promise()
                    },
                    promise: function(a) {
                        if (a == null) a = g;
                        else
                            for (var b in g) a[b] = g[b];
                        return a
                    }
                },
                h = g.promise({}),
                i;
            for (i in f) h[i] = f[i].fire, h[i + "With"] = f[i].fireWith;
            return h.done(function() {
                e = "resolved"
            }, c.disable, d.lock).fail(function() {
                e = "rejected"
            }, b.disable, d.lock), a && a.call(h, h), h
        },
        when: function(a) {
            function b(a) {
                return function(b) {
                    g[a] = arguments.length > 1 ? L.call(arguments, 0) : b, j.notifyWith(k, g)
                }
            }

            function c(a) {
                return function(b) {
                    d[a] = arguments.length > 1 ? L.call(arguments, 0) : b, --h || j.resolveWith(j, d)
                }
            }
            var d = L.call(arguments, 0),
                e = 0,
                f = d.length,
                g = Array(f),
                h = f,
                i = f,
                j = f <= 1 && a && J.isFunction(a.promise) ? a : J.Deferred(),
                k = j.promise();
            if (f > 1) {
                for (; e < f; e++) d[e] && d[e].promise && J.isFunction(d[e].promise) ? d[e].promise().then(c(e), j.reject, b(e)) : --h;
                h || j.resolveWith(j, d)
            } else j !== a && j.resolveWith(j, f ? [a] : []);
            return k
        }
    }), J.support = function() {
        var b, c, d, e, f, g, h, i, j, k, l, m, n = G.createElement("div"),
            o = G.documentElement;
        n.setAttribute("className", "t"), n.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>", c = n.getElementsByTagName("*"), d = n.getElementsByTagName("a")[0];
        if (!c || !c.length || !d) return {};
        e = G.createElement("select"), f = e.appendChild(G.createElement("option")), g = n.getElementsByTagName("input")[0], b = {
            leadingWhitespace: n.firstChild.nodeType === 3,
            tbody: !n.getElementsByTagName("tbody").length,
            htmlSerialize: !!n.getElementsByTagName("link").length,
            style: /top/.test(d.getAttribute("style")),
            hrefNormalized: d.getAttribute("href") === "/a",
            opacity: /^0.55/.test(d.style.opacity),
            cssFloat: !!d.style.cssFloat,
            checkOn: g.value === "on",
            optSelected: f.selected,
            getSetAttribute: n.className !== "t",
            enctype: !!G.createElement("form").enctype,
            html5Clone: G.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>",
            submitBubbles: !0,
            changeBubbles: !0,
            focusinBubbles: !1,
            deleteExpando: !0,
            noCloneEvent: !0,
            inlineBlockNeedsLayout: !1,
            shrinkWrapBlocks: !1,
            reliableMarginRight: !0,
            pixelMargin: !0
        }, J.boxModel = b.boxModel = G.compatMode === "CSS1Compat", g.checked = !0, b.noCloneChecked = g.cloneNode(!0).checked, e.disabled = !0, b.optDisabled = !f.disabled;
        try {
            delete n.test
        } catch (p) {
            b.deleteExpando = !1
        }!n.addEventListener && n.attachEvent && n.fireEvent && (n.attachEvent("onclick", function() {
            b.noCloneEvent = !1
        }), n.cloneNode(!0).fireEvent("onclick")), g = G.createElement("input"), g.value = "t", g.setAttribute("type", "radio"), b.radioValue = g.value === "t", g.setAttribute("checked", "checked"), g.setAttribute("name", "t"), n.appendChild(g), h = G.createDocumentFragment(), h.appendChild(n.lastChild), b.checkClone = h.cloneNode(!0).cloneNode(!0).lastChild.checked, b.appendChecked = g.checked, h.removeChild(g), h.appendChild(n);
        if (n.attachEvent)
            for (l in {
                    submit: 1,
                    change: 1,
                    focusin: 1
                }) k = "on" + l, m = k in n, m || (n.setAttribute(k, "return;"), m = typeof n[k] == "function"), b[l + "Bubbles"] = m;
        return h.removeChild(n), h = e = f = n = g = null, J(function() {
            var c, d, e, f, g, h, j, k, l, o, p, q, r, s = G.getElementsByTagName("body")[0];
            !s || (k = 1, r = "padding:0;margin:0;border:", p = "position:absolute;top:0;left:0;width:1px;height:1px;", q = r + "0;visibility:hidden;", l = "style='" + p + r + "5px solid #000;", o = "<div " + l + "display:block;'><div style='" + r + "0;display:block;overflow:hidden;'></div></div>" + "<table " + l + "' cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>", c = G.createElement("div"), c.style.cssText = q + "width:0;height:0;position:static;top:0;margin-top:" + k + "px", s.insertBefore(c, s.firstChild), n = G.createElement("div"), c.appendChild(n), n.innerHTML = "<table><tr><td style='" + r + "0;display:none'></td><td>t</td></tr></table>", i = n.getElementsByTagName("td"), m = i[0].offsetHeight === 0, i[0].style.display = "", i[1].style.display = "none", b.reliableHiddenOffsets = m && i[0].offsetHeight === 0, a.getComputedStyle && (n.innerHTML = "", j = G.createElement("div"), j.style.width = "0", j.style.marginRight = "0", n.style.width = "2px", n.appendChild(j), b.reliableMarginRight = (parseInt((a.getComputedStyle(j, null) || {
                marginRight: 0
            }).marginRight, 10) || 0) === 0), typeof n.style.zoom != "undefined" && (n.innerHTML = "", n.style.width = n.style.padding = "1px", n.style.border = 0, n.style.overflow = "hidden", n.style.display = "inline", n.style.zoom = 1, b.inlineBlockNeedsLayout = n.offsetWidth === 3, n.style.display = "block", n.style.overflow = "visible", n.innerHTML = "<div style='width:5px;'></div>", b.shrinkWrapBlocks = n.offsetWidth !== 3), n.style.cssText = p + q, n.innerHTML = o, d = n.firstChild, e = d.firstChild, g = d.nextSibling.firstChild.firstChild, h = {
                doesNotAddBorder: e.offsetTop !== 5,
                doesAddBorderForTableAndCells: g.offsetTop === 5
            }, e.style.position = "fixed", e.style.top = "20px", h.fixedPosition = e.offsetTop === 20 || e.offsetTop === 15, e.style.position = e.style.top = "", d.style.overflow = "hidden", d.style.position = "relative", h.subtractsBorderForOverflowNotVisible = e.offsetTop === -5, h.doesNotIncludeMarginInBodyOffset = s.offsetTop !== k, a.getComputedStyle && (n.style.marginTop = "1%", b.pixelMargin = (a.getComputedStyle(n, null) || {
                marginTop: 0
            }).marginTop !== "1%"), typeof c.style.zoom != "undefined" && (c.style.zoom = 1), s.removeChild(c), j = n = c = null, J.extend(b, h))
        }), b
    }();
    var M = /^(?:\{.*\}|\[.*\])$/,
        N = /([A-Z])/g;
    J.extend({
        cache: {},
        uuid: 0,
        expando: "jQuery" + (J.fn.jquery + Math.random()).replace(/\D/g, ""),
        noData: {
            embed: !0,
            object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
            applet: !0
        },
        hasData: function(a) {
            return a = a.nodeType ? J.cache[a[J.expando]] : a[J.expando], !!a && !D(a)
        },
        data: function(a, c, d, e) {
            if (!!J.acceptData(a)) {
                var f, g, h, i = J.expando,
                    j = typeof c == "string",
                    k = a.nodeType,
                    l = k ? J.cache : a,
                    m = k ? a[i] : a[i] && i,
                    n = c === "events";
                if ((!m || !l[m] || !n && !e && !l[m].data) && j && d === b) return;
                m || (k ? a[i] = m = ++J.uuid : m = i), l[m] || (l[m] = {}, k || (l[m].toJSON = J.noop));
                if (typeof c == "object" || typeof c == "function") e ? l[m] = J.extend(l[m], c) : l[m].data = J.extend(l[m].data, c);
                return f = g = l[m], e || (g.data || (g.data = {}), g = g.data), d !== b && (g[J.camelCase(c)] = d), n && !g[c] ? f.events : (j ? (h = g[c], h == null && (h = g[J.camelCase(c)])) : h = g, h)
            }
        },
        removeData: function(a, b, c) {
            if (!!J.acceptData(a)) {
                var d, e, f, g = J.expando,
                    h = a.nodeType,
                    i = h ? J.cache : a,
                    j = h ? a[g] : g;
                if (!i[j]) return;
                if (b) {
                    d = c ? i[j] : i[j].data;
                    if (d) {
                        J.isArray(b) || (b in d ? b = [b] : (b = J.camelCase(b), b in d ? b = [b] : b = b.split(" ")));
                        for (e = 0, f = b.length; e < f; e++) delete d[b[e]];
                        if (!(c ? D : J.isEmptyObject)(d)) return
                    }
                }
                if (!c) {
                    delete i[j].data;
                    if (!D(i[j])) return
                }
                J.support.deleteExpando || !i.setInterval ? delete i[j] : i[j] = null, h && (J.support.deleteExpando ? delete a[g] : a.removeAttribute ? a.removeAttribute(g) : a[g] = null)
            }
        },
        _data: function(a, b, c) {
            return J.data(a, b, c, !0)
        },
        acceptData: function(a) {
            if (a.nodeName) {
                var b = J.noData[a.nodeName.toLowerCase()];
                if (b) return b !== !0 && a.getAttribute("classid") === b
            }
            return !0
        }
    }), J.fn.extend({
        data: function(a, c) {
            var d, e, f, g, h, i = this[0],
                j = 0,
                k = null;
            if (a === b) {
                if (this.length) {
                    k = J.data(i);
                    if (i.nodeType === 1 && !J._data(i, "parsedAttrs")) {
                        f = i.attributes;
                        for (h = f.length; j < h; j++) g = f[j].name, g.indexOf("data-") === 0 && (g = J.camelCase(g.substring(5)), E(i, g, k[g]));
                        J._data(i, "parsedAttrs", !0)
                    }
                }
                return k
            }
            return typeof a == "object" ? this.each(function() {
                J.data(this, a)
            }) : (d = a.split(".", 2), d[1] = d[1] ? "." + d[1] : "", e = d[1] + "!", J.access(this, function(c) {
                if (c === b) return k = this.triggerHandler("getData" + e, [d[0]]), k === b && i && (k = J.data(i, a), k = E(i, a, k)), k === b && d[1] ? this.data(d[0]) : k;
                d[1] = c, this.each(function() {
                    var b = J(this);
                    b.triggerHandler("setData" + e, d), J.data(this, a, c), b.triggerHandler("changeData" + e, d)
                })
            }, null, c, arguments.length > 1, null, !1))
        },
        removeData: function(a) {
            return this.each(function() {
                J.removeData(this, a)
            })
        }
    }), J.extend({
        _mark: function(a, b) {
            a && (b = (b || "fx") + "mark", J._data(a, b, (J._data(a, b) || 0) + 1))
        },
        _unmark: function(a, b, c) {
            a !== !0 && (c = b, b = a, a = !1);
            if (b) {
                c = c || "fx";
                var d = c + "mark",
                    e = a ? 0 : (J._data(b, d) || 1) - 1;
                e ? J._data(b, d, e) : (J.removeData(b, d, !0), C(b, c, "mark"))
            }
        },
        queue: function(a, b, c) {
            var d;
            if (a) return b = (b || "fx") + "queue", d = J._data(a, b), c && (!d || J.isArray(c) ? d = J._data(a, b, J.makeArray(c)) : d.push(c)), d || []
        },
        dequeue: function(a, b) {
            b = b || "fx";
            var c = J.queue(a, b),
                d = c.shift(),
                e = {};
            d === "inprogress" && (d = c.shift()), d && (b === "fx" && c.unshift("inprogress"), J._data(a, b + ".run", e), d.call(a, function() {
                J.dequeue(a, b)
            }, e)), c.length || (J.removeData(a, b + "queue " + b + ".run", !0), C(a, b, "queue"))
        }
    }), J.fn.extend({
        queue: function(a, c) {
            var d = 2;
            return typeof a != "string" && (c = a, a = "fx", d--), arguments.length < d ? J.queue(this[0], a) : c === b ? this : this.each(function() {
                var b = J.queue(this, a, c);
                a === "fx" && b[0] !== "inprogress" && J.dequeue(this, a)
            })
        },
        dequeue: function(a) {
            return this.each(function() {
                J.dequeue(this, a)
            })
        },
        delay: function(a, b) {
            return a = J.fx ? J.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
                var d = setTimeout(b, a);
                c.stop = function() {
                    clearTimeout(d)
                }
            })
        },
        clearQueue: function(a) {
            return this.queue(a || "fx", [])
        },
        promise: function(a, c) {
            function d() {
                --h || e.resolveWith(f, [f])
            }
            typeof a != "string" && (c = a, a = b), a = a || "fx";
            var e = J.Deferred(),
                f = this,
                g = f.length,
                h = 1,
                i = a + "defer",
                j = a + "queue",
                k = a + "mark",
                l;
            while (g--)
                if (l = J.data(f[g], i, b, !0) || (J.data(f[g], j, b, !0) || J.data(f[g], k, b, !0)) && J.data(f[g], i, J.Callbacks("once memory"), !0)) h++, l.add(d);
            return d(), e.promise(c)
        }
    });
    var O = /[\n\t\r]/g,
        P = /\s+/,
        Q = /\r/g,
        R = /^(?:button|input)$/i,
        S = /^(?:button|input|object|select|textarea)$/i,
        T = /^a(?:rea)?$/i,
        U = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        V = J.support.getSetAttribute,
        W, X, Y;
    J.fn.extend({
        attr: function(a, b) {
            return J.access(this, J.attr, a, b, arguments.length > 1)
        },
        removeAttr: function(a) {
            return this.each(function() {
                J.removeAttr(this, a)
            })
        },
        prop: function(a, b) {
            return J.access(this, J.prop, a, b, arguments.length > 1)
        },
        removeProp: function(a) {
            return a = J.propFix[a] || a, this.each(function() {
                try {
                    this[a] = b, delete this[a]
                } catch (c) {}
            })
        },
        addClass: function(a) {
            var b, c, d, e, f, g, h;
            if (J.isFunction(a)) return this.each(function(b) {
                J(this).addClass(a.call(this, b, this.className))
            });
            if (a && typeof a == "string") {
                b = a.split(P);
                for (c = 0, d = this.length; c < d; c++) {
                    e = this[c];
                    if (e.nodeType === 1)
                        if (!e.className && b.length === 1) e.className = a;
                        else {
                            f = " " + e.className + " ";
                            for (g = 0, h = b.length; g < h; g++) ~f.indexOf(" " + b[g] + " ") || (f += b[g] + " ");
                            e.className = J.trim(f)
                        }
                }
            }
            return this
        },
        removeClass: function(a) {
            var c, d, e, f, g, h, i;
            if (J.isFunction(a)) return this.each(function(b) {
                J(this).removeClass(a.call(this, b, this.className))
            });
            if (a && typeof a == "string" || a === b) {
                c = (a || "").split(P);
                for (d = 0, e = this.length; d < e; d++) {
                    f = this[d];
                    if (f.nodeType === 1 && f.className)
                        if (a) {
                            g = (" " + f.className + " ").replace(O, " ");
                            for (h = 0, i = c.length; h < i; h++) g = g.replace(" " + c[h] + " ", " ");
                            f.className = J.trim(g)
                        } else f.className = ""
                }
            }
            return this
        },
        toggleClass: function(a, b) {
            var c = typeof a,
                d = typeof b == "boolean";
            return J.isFunction(a) ? this.each(function(c) {
                J(this).toggleClass(a.call(this, c, this.className, b), b)
            }) : this.each(function() {
                if (c === "string") {
                    var e, f = 0,
                        g = J(this),
                        h = b,
                        i = a.split(P);
                    while (e = i[f++]) h = d ? h : !g.hasClass(e), g[h ? "addClass" : "removeClass"](e)
                } else if (c === "undefined" || c === "boolean") this.className && J._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : J._data(this, "__className__") || ""
            })
        },
        hasClass: function(a) {
            var b = " " + a + " ",
                c = 0,
                d = this.length;
            for (; c < d; c++)
                if (this[c].nodeType === 1 && (" " + this[c].className + " ").replace(O, " ").indexOf(b) > -1) return !0;
            return !1
        },
        val: function(a) {
            var c, d, e, f = this[0];
            if (!!arguments.length) return e = J.isFunction(a), this.each(function(d) {
                var f = J(this),
                    g;
                if (this.nodeType === 1) {
                    e ? g = a.call(this, d, f.val()) : g = a, g == null ? g = "" : typeof g == "number" ? g += "" : J.isArray(g) && (g = J.map(g, function(a) {
                        return a == null ? "" : a + ""
                    })), c = J.valHooks[this.type] || J.valHooks[this.nodeName.toLowerCase()];
                    if (!c || !("set" in c) || c.set(this, g, "value") === b) this.value = g
                }
            });
            if (f) return c = J.valHooks[f.type] || J.valHooks[f.nodeName.toLowerCase()], c && "get" in c && (d = c.get(f, "value")) !== b ? d : (d = f.value, typeof d == "string" ? d.replace(Q, "") : d == null ? "" : d)
        }
    }), J.extend({
        valHooks: {
            option: {
                get: function(a) {
                    var b = a.attributes.value;
                    return !b || b.specified ? a.value : a.text
                }
            },
            select: {
                get: function(a) {
                    var b, c, d, e, f = a.selectedIndex,
                        g = [],
                        h = a.options,
                        i = a.type === "select-one";
                    if (f < 0) return null;
                    c = i ? f : 0, d = i ? f + 1 : h.length;
                    for (; c < d; c++) {
                        e = h[c];
                        if (e.selected && (J.support.optDisabled ? !e.disabled : e.getAttribute("disabled") === null) && (!e.parentNode.disabled || !J.nodeName(e.parentNode, "optgroup"))) {
                            b = J(e).val();
                            if (i) return b;
                            g.push(b)
                        }
                    }
                    return i && !g.length && h.length ? J(h[f]).val() : g
                },
                set: function(a, b) {
                    var c = J.makeArray(b);
                    return J(a).find("option").each(function() {
                        this.selected = J.inArray(J(this).val(), c) >= 0
                    }), c.length || (a.selectedIndex = -1), c
                }
            }
        },
        attrFn: {
            val: !0,
            css: !0,
            html: !0,
            text: !0,
            data: !0,
            width: !0,
            height: !0,
            offset: !0
        },
        attr: function(a, c, d, e) {
            var f, g, h, i = a.nodeType;
            if (!!a && i !== 3 && i !== 8 && i !== 2) {
                if (e && c in J.attrFn) return J(a)[c](d);
                if (typeof a.getAttribute == "undefined") return J.prop(a, c, d);
                h = i !== 1 || !J.isXMLDoc(a), h && (c = c.toLowerCase(), g = J.attrHooks[c] || (U.test(c) ? X : W));
                if (d !== b) {
                    if (d === null) {
                        J.removeAttr(a, c);
                        return
                    }
                    return g && "set" in g && h && (f = g.set(a, d, c)) !== b ? f : (a.setAttribute(c, "" + d), d)
                }
                return g && "get" in g && h && (f = g.get(a, c)) !== null ? f : (f = a.getAttribute(c), f === null ? b : f)
            }
        },
        removeAttr: function(a, b) {
            var c, d, e, f, g, h = 0;
            if (b && a.nodeType === 1) {
                d = b.toLowerCase().split(P), f = d.length;
                for (; h < f; h++) e = d[h], e && (c = J.propFix[e] || e, g = U.test(e), g || J.attr(a, e, ""), a.removeAttribute(V ? e : c), g && c in a && (a[c] = !1))
            }
        },
        attrHooks: {
            type: {
                set: function(a, b) {
                    if (R.test(a.nodeName) && a.parentNode) J.error("type property can't be changed");
                    else if (!J.support.radioValue && b === "radio" && J.nodeName(a, "input")) {
                        var c = a.value;
                        return a.setAttribute("type", b), c && (a.value = c), b
                    }
                }
            },
            value: {
                get: function(a, b) {
                    return W && J.nodeName(a, "button") ? W.get(a, b) : b in a ? a.value : null
                },
                set: function(a, b, c) {
                    if (W && J.nodeName(a, "button")) return W.set(a, b, c);
                    a.value = b
                }
            }
        },
        propFix: {
            tabindex: "tabIndex",
            readonly: "readOnly",
            "for": "htmlFor",
            "class": "className",
            maxlength: "maxLength",
            cellspacing: "cellSpacing",
            cellpadding: "cellPadding",
            rowspan: "rowSpan",
            colspan: "colSpan",
            usemap: "useMap",
            frameborder: "frameBorder",
            contenteditable: "contentEditable"
        },
        prop: function(a, c, d) {
            var e, f, g, h = a.nodeType;
            if (!!a && h !== 3 && h !== 8 && h !== 2) return g = h !== 1 || !J.isXMLDoc(a), g && (c = J.propFix[c] || c, f = J.propHooks[c]), d !== b ? f && "set" in f && (e = f.set(a, d, c)) !== b ? e : a[c] = d : f && "get" in f && (e = f.get(a, c)) !== null ? e : a[c]
        },
        propHooks: {
            tabIndex: {
                get: function(a) {
                    var c = a.getAttributeNode("tabindex");
                    return c && c.specified ? parseInt(c.value, 10) : S.test(a.nodeName) || T.test(a.nodeName) && a.href ? 0 : b
                }
            }
        }
    }), J.attrHooks.tabindex = J.propHooks.tabIndex, X = {
        get: function(a, c) {
            var d, e = J.prop(a, c);
            return e === !0 || typeof e != "boolean" && (d = a.getAttributeNode(c)) && d.nodeValue !== !1 ? c.toLowerCase() : b
        },
        set: function(a, b, c) {
            var d;
            return b === !1 ? J.removeAttr(a, c) : (d = J.propFix[c] || c, d in a && (a[d] = !0), a.setAttribute(c, c.toLowerCase())), c
        }
    }, V || (Y = {
        name: !0,
        id: !0,
        coords: !0
    }, W = J.valHooks.button = {
        get: function(a, c) {
            var d;
            return d = a.getAttributeNode(c), d && (Y[c] ? d.nodeValue !== "" : d.specified) ? d.nodeValue : b
        },
        set: function(a, b, c) {
            var d = a.getAttributeNode(c);
            return d || (d = G.createAttribute(c), a.setAttributeNode(d)), d.nodeValue = b + ""
        }
    }, J.attrHooks.tabindex.set = W.set, J.each(["width", "height"], function(a, b) {
        J.attrHooks[b] = J.extend(J.attrHooks[b], {
            set: function(a, c) {
                if (c === "") return a.setAttribute(b, "auto"), c
            }
        })
    }), J.attrHooks.contenteditable = {
        get: W.get,
        set: function(a, b, c) {
            b === "" && (b = "false"), W.set(a, b, c)
        }
    }), J.support.hrefNormalized || J.each(["href", "src", "width", "height"], function(a, c) {
        J.attrHooks[c] = J.extend(J.attrHooks[c], {
            get: function(a) {
                var d = a.getAttribute(c, 2);
                return d === null ? b : d
            }
        })
    }), J.support.style || (J.attrHooks.style = {
        get: function(a) {
            return a.style.cssText.toLowerCase() || b
        },
        set: function(a, b) {
            return a.style.cssText = "" + b
        }
    }), J.support.optSelected || (J.propHooks.selected = J.extend(J.propHooks.selected, {
        get: function(a) {
            var b = a.parentNode;
            return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
        }
    })), J.support.enctype || (J.propFix.enctype = "encoding"), J.support.checkOn || J.each(["radio", "checkbox"], function() {
        J.valHooks[this] = {
            get: function(a) {
                return a.getAttribute("value") === null ? "on" : a.value
            }
        }
    }), J.each(["radio", "checkbox"], function() {
        J.valHooks[this] = J.extend(J.valHooks[this], {
            set: function(a, b) {
                if (J.isArray(b)) return a.checked = J.inArray(J(a).val(), b) >= 0
            }
        })
    });
    var Z = /^(?:textarea|input|select)$/i,
        $ = /^([^\.]*)?(?:\.(.+))?$/,
        _ = /(?:^|\s)hover(\.\S+)?\b/,
        ba = /^key/,
        bb = /^(?:mouse|contextmenu)|click/,
        bc = /^(?:focusinfocus|focusoutblur)$/,
        bd = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/,
        be = function(a) {
            var b = bd.exec(a);
            return b && (b[1] = (b[1] || "").toLowerCase(), b[3] = b[3] && new RegExp("(?:^|\\s)" + b[3] + "(?:\\s|$)")), b
        },
        bf = function(a, b) {
            var c = a.attributes || {};
            return (!b[1] || a.nodeName.toLowerCase() === b[1]) && (!b[2] || (c.id || {}).value === b[2]) && (!b[3] || b[3].test((c["class"] || {}).value))
        },
        bg = function(a) {
            return J.event.special.hover ? a : a.replace(_, "mouseenter$1 mouseleave$1")
        };
    J.event = {
            add: function(a, c, d, e, f) {
                var g, h, i, j, k, l, m, n, o, p, q, r;
                if (!(a.nodeType === 3 || a.nodeType === 8 || !c || !d || !(g = J._data(a)))) {
                    d.handler && (o = d, d = o.handler, f = o.selector), d.guid || (d.guid = J.guid++), i = g.events, i || (g.events = i = {}), h = g.handle, h || (g.handle = h = function(a) {
                        return typeof J == "undefined" || !!a && J.event.triggered === a.type ? b : J.event.dispatch.apply(h.elem, arguments)
                    }, h.elem = a), c = J.trim(bg(c)).split(" ");
                    for (j = 0; j < c.length; j++) {
                        k = $.exec(c[j]) || [], l = k[1], m = (k[2] || "").split(".").sort(), r = J.event.special[l] || {}, l = (f ? r.delegateType : r.bindType) || l, r = J.event.special[l] || {}, n = J.extend({
                            type: l,
                            origType: k[1],
                            data: e,
                            handler: d,
                            guid: d.guid,
                            selector: f,
                            quick: f && be(f),
                            namespace: m.join(".")
                        }, o), q = i[l];
                        if (!q) {
                            q = i[l] = [], q.delegateCount = 0;
                            if (!r.setup || r.setup.call(a, e, m, h) === !1) a.addEventListener ? a.addEventListener(l, h, !1) : a.attachEvent && a.attachEvent("on" + l, h)
                        }
                        r.add && (r.add.call(a, n), n.handler.guid || (n.handler.guid = d.guid)), f ? q.splice(q.delegateCount++, 0, n) : q.push(n), J.event.global[l] = !0
                    }
                    a = null
                }
            },
            global: {},
            remove: function(a, b, c, d, e) {
                var f = J.hasData(a) && J._data(a),
                    g, h, i, j, k, l, m, n, o, p, q, r;
                if (!!f && !!(n = f.events)) {
                    b = J.trim(bg(b || "")).split(" ");
                    for (g = 0; g < b.length; g++) {
                        h = $.exec(b[g]) || [], i = j = h[1], k = h[2];
                        if (!i) {
                            for (i in n) J.event.remove(a, i + b[g], c, d, !0);
                            continue
                        }
                        o = J.event.special[i] || {}, i = (d ? o.delegateType : o.bindType) || i, q = n[i] || [], l = q.length, k = k ? new RegExp("(^|\\.)" + k.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
                        for (m = 0; m < q.length; m++) r = q[m], (e || j === r.origType) && (!c || c.guid === r.guid) && (!k || k.test(r.namespace)) && (!d || d === r.selector || d === "**" && r.selector) && (q.splice(m--, 1), r.selector && q.delegateCount--, o.remove && o.remove.call(a, r));
                        q.length === 0 && l !== q.length && ((!o.teardown || o.teardown.call(a, k) === !1) && J.removeEvent(a, i, f.handle), delete n[i])
                    }
                    J.isEmptyObject(n) && (p = f.handle, p && (p.elem = null), J.removeData(a, ["events", "handle"], !0))
                }
            },
            customEvent: {
                getData: !0,
                setData: !0,
                changeData: !0
            },
            trigger: function(c, d, e, f) {
                if (!e || e.nodeType !== 3 && e.nodeType !== 8) {
                    var g = c.type || c,
                        h = [],
                        i, j, k, l, m, n, o, p, q, r;
                    if (bc.test(g + J.event.triggered)) return;
                    g.indexOf("!") >= 0 && (g = g.slice(0, -1), j = !0), g.indexOf(".") >= 0 && (h = g.split("."), g = h.shift(), h.sort());
                    if ((!e || J.event.customEvent[g]) && !J.event.global[g]) return;
                    c = typeof c == "object" ? c[J.expando] ? c : new J.Event(g, c) : new J.Event(g), c.type = g, c.isTrigger = !0, c.exclusive = j, c.namespace = h.join("."), c.namespace_re = c.namespace ? new RegExp("(^|\\.)" + h.join("\\.(?:.*\\.)?") + "(\\.|$)") : null, n = g.indexOf(":") < 0 ? "on" + g : "";
                    if (!e) {
                        i = J.cache;
                        for (k in i) i[k].events && i[k].events[g] && J.event.trigger(c, d, i[k].handle.elem, !0);
                        return
                    }
                    c.result = b, c.target || (c.target = e), d = d != null ? J.makeArray(d) : [], d.unshift(c), o = J.event.special[g] || {};
                    if (o.trigger && o.trigger.apply(e, d) === !1) return;
                    q = [
                        [e, o.bindType || g]
                    ];
                    if (!f && !o.noBubble && !J.isWindow(e)) {
                        r = o.delegateType || g, l = bc.test(r + g) ? e : e.parentNode, m = null;
                        for (; l; l = l.parentNode) q.push([l, r]), m = l;
                        m && m === e.ownerDocument && q.push([m.defaultView || m.parentWindow || a, r])
                    }
                    for (k = 0; k < q.length && !c.isPropagationStopped(); k++) l = q[k][0], c.type = q[k][1], p = (J._data(l, "events") || {})[c.type] && J._data(l, "handle"), p && p.apply(l, d), p = n && l[n], p && J.acceptData(l) && p.apply(l, d) === !1 && c.preventDefault();
                    return c.type = g, !f && !c.isDefaultPrevented() && (!o._default || o._default.apply(e.ownerDocument, d) === !1) && (g !== "click" || !J.nodeName(e, "a")) && J.acceptData(e) && n && e[g] && (g !== "focus" && g !== "blur" || c.target.offsetWidth !== 0) && !J.isWindow(e) && (m = e[n], m && (e[n] = null), J.event.triggered = g, e[g](), J.event.triggered = b, m && (e[n] = m)), c.result
                }
            },
            dispatch: function(c) {
                c = J.event.fix(c || a.event);
                var d = (J._data(this, "events") || {})[c.type] || [],
                    e = d.delegateCount,
                    f = [].slice.call(arguments, 0),
                    g = !c.exclusive && !c.namespace,
                    h = J.event.special[c.type] || {},
                    i = [],
                    j, k, l, m, n, o, p, q, r, s, t;
                f[0] = c, c.delegateTarget = this;
                if (!h.preDispatch || h.preDispatch.call(this, c) !== !1) {
                    if (e && (!c.button || c.type !== "click")) {
                        m = J(this), m.context = this.ownerDocument || this;
                        for (l = c.target; l != this; l = l.parentNode || this)
                            if (l.disabled !== !0) {
                                o = {}, q = [], m[0] = l;
                                for (j = 0; j < e; j++) r = d[j], s = r.selector, o[s] === b && (o[s] = r.quick ? bf(l, r.quick) : m.is(s)), o[s] && q.push(r);
                                q.length && i.push({
                                    elem: l,
                                    matches: q
                                })
                            }
                    }
                    d.length > e && i.push({
                        elem: this,
                        matches: d.slice(e)
                    });
                    for (j = 0; j < i.length && !c.isPropagationStopped(); j++) {
                        p = i[j], c.currentTarget = p.elem;
                        for (k = 0; k < p.matches.length && !c.isImmediatePropagationStopped(); k++) {
                            r = p.matches[k];
                            if (g || !c.namespace && !r.namespace || c.namespace_re && c.namespace_re.test(r.namespace)) c.data = r.data, c.handleObj = r, n = ((J.event.special[r.origType] || {}).handle || r.handler).apply(p.elem, f), n !== b && (c.result = n, n === !1 && (c.preventDefault(), c.stopPropagation()))
                        }
                    }
                    return h.postDispatch && h.postDispatch.call(this, c), c.result
                }
            },
            props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
            fixHooks: {},
            keyHooks: {
                props: "char charCode key keyCode".split(" "),
                filter: function(a, b) {
                    return a.which == null && (a.which = b.charCode != null ? b.charCode : b.keyCode), a
                }
            },
            mouseHooks: {
                props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
                filter: function(a, c) {
                    var d, e, f, g = c.button,
                        h = c.fromElement;
                    return a.pageX == null && c.clientX != null && (d = a.target.ownerDocument || G, e = d.documentElement, f = d.body, a.pageX = c.clientX + (e && e.scrollLeft || f && f.scrollLeft || 0) - (e && e.clientLeft || f && f.clientLeft || 0), a.pageY = c.clientY + (e && e.scrollTop || f && f.scrollTop || 0) - (e && e.clientTop || f && f.clientTop || 0)), !a.relatedTarget && h && (a.relatedTarget = h === a.target ? c.toElement : h), !a.which && g !== b && (a.which = g & 1 ? 1 : g & 2 ? 3 : g & 4 ? 2 : 0), a
                }
            },
            fix: function(a) {
                if (a[J.expando]) return a;
                var c, d, e = a,
                    f = J.event.fixHooks[a.type] || {},
                    g = f.props ? this.props.concat(f.props) : this.props;
                a = J.Event(e);
                for (c = g.length; c;) d = g[--c], a[d] = e[d];
                return a.target || (a.target = e.srcElement || G), a.target.nodeType === 3 && (a.target = a.target.parentNode), a.metaKey === b && (a.metaKey = a.ctrlKey), f.filter ? f.filter(a, e) : a
            },
            special: {
                ready: {
                    setup: J.bindReady
                },
                load: {
                    noBubble: !0
                },
                focus: {
                    delegateType: "focusin"
                },
                blur: {
                    delegateType: "focusout"
                },
                beforeunload: {
                    setup: function(a, b, c) {
                        J.isWindow(this) && (this.onbeforeunload = c)
                    },
                    teardown: function(a, b) {
                        this.onbeforeunload === b && (this.onbeforeunload = null)
                    }
                }
            },
            simulate: function(a, b, c, d) {
                var e = J.extend(new J.Event, c, {
                    type: a,
                    isSimulated: !0,
                    originalEvent: {}
                });
                d ? J.event.trigger(e, null, b) : J.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
            }
        }, J.event.handle = J.event.dispatch, J.removeEvent = G.removeEventListener ? function(a, b, c) {
            a.removeEventListener && a.removeEventListener(b, c, !1)
        } : function(a, b, c) {
            a.detachEvent && a.detachEvent("on" + b, c)
        }, J.Event = function(a, b) {
            if (this instanceof J.Event) a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault() ? A : B) : this.type = a, b && J.extend(this, b), this.timeStamp = a && a.timeStamp || J.now(), this[J.expando] = !0;
            else return new J.Event(a, b)
        }, J.Event.prototype = {
            preventDefault: function() {
                this.isDefaultPrevented = A;
                var a = this.originalEvent;
                !a || (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
            },
            stopPropagation: function() {
                this.isPropagationStopped = A;
                var a = this.originalEvent;
                !a || (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
            },
            stopImmediatePropagation: function() {
                this.isImmediatePropagationStopped = A, this.stopPropagation()
            },
            isDefaultPrevented: B,
            isPropagationStopped: B,
            isImmediatePropagationStopped: B
        }, J.each({
            mouseenter: "mouseover",
            mouseleave: "mouseout"
        }, function(a, b) {
            J.event.special[a] = {
                delegateType: b,
                bindType: b,
                handle: function(a) {
                    var c = this,
                        d = a.relatedTarget,
                        e = a.handleObj,
                        f = e.selector,
                        g;
                    if (!d || d !== c && !J.contains(c, d)) a.type = e.origType, g = e.handler.apply(this, arguments), a.type = b;
                    return g
                }
            }
        }), J.support.submitBubbles || (J.event.special.submit = {
            setup: function() {
                if (J.nodeName(this, "form")) return !1;
                J.event.add(this, "click._submit keypress._submit", function(a) {
                    var c = a.target,
                        d = J.nodeName(c, "input") || J.nodeName(c, "button") ? c.form : b;
                    d && !d._submit_attached && (J.event.add(d, "submit._submit", function(a) {
                        a._submit_bubble = !0
                    }), d._submit_attached = !0)
                })
            },
            postDispatch: function(a) {
                a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && J.event.simulate("submit", this.parentNode, a, !0))
            },
            teardown: function() {
                if (J.nodeName(this, "form")) return !1;
                J.event.remove(this, "._submit")
            }
        }), J.support.changeBubbles || (J.event.special.change = {
            setup: function() {
                if (Z.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") J.event.add(this, "propertychange._change", function(a) {
                        a.originalEvent.propertyName === "checked" && (this._just_changed = !0)
                    }), J.event.add(this, "click._change", function(a) {
                        this._just_changed && !a.isTrigger && (this._just_changed = !1, J.event.simulate("change", this, a, !0))
                    });
                    return !1
                }
                J.event.add(this, "beforeactivate._change", function(a) {
                    var b = a.target;
                    Z.test(b.nodeName) && !b._change_attached && (J.event.add(b, "change._change", function(a) {
                        this.parentNode && !a.isSimulated && !a.isTrigger && J.event.simulate("change", this.parentNode, a, !0)
                    }), b._change_attached = !0)
                })
            },
            handle: function(a) {
                var b = a.target;
                if (this !== b || a.isSimulated || a.isTrigger || b.type !== "radio" && b.type !== "checkbox") return a.handleObj.handler.apply(this, arguments)
            },
            teardown: function() {
                return J.event.remove(this, "._change"), Z.test(this.nodeName)
            }
        }), J.support.focusinBubbles || J.each({
            focus: "focusin",
            blur: "focusout"
        }, function(a, b) {
            var c = 0,
                d = function(a) {
                    J.event.simulate(b, a.target, J.event.fix(a), !0)
                };
            J.event.special[b] = {
                setup: function() {
                    c++ === 0 && G.addEventListener(a, d, !0)
                },
                teardown: function() {
                    --c === 0 && G.removeEventListener(a, d, !0)
                }
            }
        }), J.fn.extend({
            on: function(a, c, d, e, f) {
                var g, h;
                if (typeof a == "object") {
                    typeof c != "string" && (d = d || c, c = b);
                    for (h in a) this.on(h, c, d, a[h], f);
                    return this
                }
                d == null && e == null ? (e = c, d = c = b) : e == null && (typeof c == "string" ? (e = d, d = b) : (e = d, d = c, c = b));
                if (e === !1) e = B;
                else if (!e) return this;
                return f === 1 && (g = e, e = function(a) {
                    return J().off(a), g.apply(this, arguments)
                }, e.guid = g.guid || (g.guid = J.guid++)), this.each(function() {
                    J.event.add(this, a, e, d, c)
                })
            },
            one: function(a, b, c, d) {
                return this.on(a, b, c, d, 1)
            },
            off: function(a, c, d) {
                if (a && a.preventDefault && a.handleObj) {
                    var e = a.handleObj;
                    return J(a.delegateTarget).off(e.namespace ? e.origType + "." + e.namespace : e.origType, e.selector, e.handler), this
                }
                if (typeof a == "object") {
                    for (var f in a) this.off(f, c, a[f]);
                    return this
                }
                if (c === !1 || typeof c == "function") d = c, c = b;
                return d === !1 && (d = B), this.each(function() {
                    J.event.remove(this, a, d, c)
                })
            },
            bind: function(a, b, c) {
                return this.on(a, null, b, c)
            },
            unbind: function(a, b) {
                return this.off(a, null, b)
            },
            live: function(a, b, c) {
                return J(this.context).on(a, this.selector, b, c), this
            },
            die: function(a, b) {
                return J(this.context).off(a, this.selector || "**", b), this
            },
            delegate: function(a, b, c, d) {
                return this.on(b, a, c, d)
            },
            undelegate: function(a, b, c) {
                return arguments.length == 1 ? this.off(a, "**") : this.off(b, a, c)
            },
            trigger: function(a, b) {
                return this.each(function() {
                    J.event.trigger(a, b, this)
                })
            },
            triggerHandler: function(a, b) {
                if (this[0]) return J.event.trigger(a, b, this[0], !0)
            },
            toggle: function(a) {
                var b = arguments,
                    c = a.guid || J.guid++,
                    d = 0,
                    e = function(c) {
                        var e = (J._data(this, "lastToggle" + a.guid) || 0) % d;
                        return J._data(this, "lastToggle" + a.guid, e + 1), c.preventDefault(), b[e].apply(this, arguments) || !1
                    };
                e.guid = c;
                while (d < b.length) b[d++].guid = c;
                return this.click(e)
            },
            hover: function(a, b) {
                return this.mouseenter(a).mouseleave(b || a)
            }
        }), J.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
            J.fn[b] = function(a, c) {
                return c == null && (c = a, a = null), arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
            }, J.attrFn && (J.attrFn[b] = !0), ba.test(b) && (J.event.fixHooks[b] = J.event.keyHooks), bb.test(b) && (J.event.fixHooks[b] = J.event.mouseHooks)
        }),
        function() {
            function a(a, b, c, d, f, g) {
                for (var h = 0, i = d.length; h < i; h++) {
                    var j = d[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[e] === c) {
                                k = d[j.sizset];
                                break
                            }
                            if (j.nodeType === 1) {
                                g || (j[e] = c, j.sizset = h);
                                if (typeof b != "string") {
                                    if (j === b) {
                                        k = !0;
                                        break
                                    }
                                } else if (m.filter(b, [j]).length > 0) {
                                    k = j;
                                    break
                                }
                            }
                            j = j[a]
                        }
                        d[h] = k
                    }
                }
            }

            function c(a, b, c, d, f, g) {
                for (var h = 0, i = d.length; h < i; h++) {
                    var j = d[h];
                    if (j) {
                        var k = !1;
                        j = j[a];
                        while (j) {
                            if (j[e] === c) {
                                k = d[j.sizset];
                                break
                            }
                            j.nodeType === 1 && !g && (j[e] = c, j.sizset = h);
                            if (j.nodeName.toLowerCase() === b) {
                                k = j;
                                break
                            }
                            j = j[a]
                        }
                        d[h] = k
                    }
                }
            }
            var d = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
                e = "sizcache" + (Math.random() + "").replace(".", ""),
                f = 0,
                g = Object.prototype.toString,
                h = !1,
                i = !0,
                j = /\\/g,
                k = /\r\n/g,
                l = /\W/;
            [0, 0].sort(function() {
                return i = !1, 0
            });
            var m = function(a, b, c, e) {
                c = c || [], b = b || G;
                var f = b;
                if (b.nodeType !== 1 && b.nodeType !== 9) return [];
                if (!a || typeof a != "string") return c;
                var h, i, j, k, l, n, q, r, t = !0,
                    u = m.isXML(b),
                    v = [],
                    x = a;
                do {
                    d.exec(""), h = d.exec(x);
                    if (h) {
                        x = h[3], v.push(h[1]);
                        if (h[2]) {
                            k = h[3];
                            break
                        }
                    }
                } while (h);
                if (v.length > 1 && p.exec(a))
                    if (v.length === 2 && o.relative[v[0]]) i = w(v[0] + v[1], b, e);
                    else {
                        i = o.relative[v[0]] ? [b] : m(v.shift(), b);
                        while (v.length) a = v.shift(), o.relative[a] && (a += v.shift()), i = w(a, i, e)
                    } else {
                    !e && v.length > 1 && b.nodeType === 9 && !u && o.match.ID.test(v[0]) && !o.match.ID.test(v[v.length - 1]) && (l = m.find(v.shift(), b, u), b = l.expr ? m.filter(l.expr, l.set)[0] : l.set[0]);
                    if (b) {
                        l = e ? {
                            expr: v.pop(),
                            set: s(e)
                        } : m.find(v.pop(), v.length !== 1 || v[0] !== "~" && v[0] !== "+" || !b.parentNode ? b : b.parentNode, u), i = l.expr ? m.filter(l.expr, l.set) : l.set, v.length > 0 ? j = s(i) : t = !1;
                        while (v.length) n = v.pop(), q = n, o.relative[n] ? q = v.pop() : n = "", q == null && (q = b), o.relative[n](j, q, u)
                    } else j = v = []
                }
                j || (j = i), j || m.error(n || a);
                if (g.call(j) === "[object Array]")
                    if (!t) c.push.apply(c, j);
                    else if (b && b.nodeType === 1)
                    for (r = 0; j[r] != null; r++) j[r] && (j[r] === !0 || j[r].nodeType === 1 && m.contains(b, j[r])) && c.push(i[r]);
                else
                    for (r = 0; j[r] != null; r++) j[r] && j[r].nodeType === 1 && c.push(i[r]);
                else s(j, c);
                return k && (m(k, f, c, e), m.uniqueSort(c)), c
            };
            m.uniqueSort = function(a) {
                if (u) {
                    h = i, a.sort(u);
                    if (h)
                        for (var b = 1; b < a.length; b++) a[b] === a[b - 1] && a.splice(b--, 1)
                }
                return a
            }, m.matches = function(a, b) {
                return m(a, null, null, b)
            }, m.matchesSelector = function(a, b) {
                return m(b, null, null, [a]).length > 0
            }, m.find = function(a, b, c) {
                var d, e, f, g, h, i;
                if (!a) return [];
                for (e = 0, f = o.order.length; e < f; e++) {
                    h = o.order[e];
                    if (g = o.leftMatch[h].exec(a)) {
                        i = g[1], g.splice(1, 1);
                        if (i.substr(i.length - 1) !== "\\") {
                            g[1] = (g[1] || "").replace(j, ""), d = o.find[h](g, b, c);
                            if (d != null) {
                                a = a.replace(o.match[h], "");
                                break
                            }
                        }
                    }
                }
                return d || (d = typeof b.getElementsByTagName != "undefined" ? b.getElementsByTagName("*") : []), {
                    set: d,
                    expr: a
                }
            }, m.filter = function(a, c, d, e) {
                var f, g, h, i, j, k, l, n, p, q = a,
                    r = [],
                    s = c,
                    t = c && c[0] && m.isXML(c[0]);
                while (a && c.length) {
                    for (h in o.filter)
                        if ((f = o.leftMatch[h].exec(a)) != null && f[2]) {
                            k = o.filter[h], l = f[1], g = !1, f.splice(1, 1);
                            if (l.substr(l.length - 1) === "\\") continue;
                            s === r && (r = []);
                            if (o.preFilter[h]) {
                                f = o.preFilter[h](f, s, d, r, e, t);
                                if (!f) g = i = !0;
                                else if (f === !0) continue
                            }
                            if (f)
                                for (n = 0;
                                    (j = s[n]) != null; n++) j && (i = k(j, f, n, s), p = e ^ i, d && i != null ? p ? g = !0 : s[n] = !1 : p && (r.push(j), g = !0));
                            if (i !== b) {
                                d || (s = r), a = a.replace(o.match[h], "");
                                if (!g) return [];
                                break
                            }
                        }
                    if (a === q)
                        if (g == null) m.error(a);
                        else break;
                    q = a
                }
                return s
            }, m.error = function(a) {
                throw new Error("Syntax error, unrecognized expression: " + a)
            };
            var n = m.getText = function(a) {
                    var b, c, d = a.nodeType,
                        e = "";
                    if (d) {
                        if (d === 1 || d === 9 || d === 11) {
                            if (typeof a.textContent == "string") return a.textContent;
                            if (typeof a.innerText == "string") return a.innerText.replace(k, "");
                            for (a = a.firstChild; a; a = a.nextSibling) e += n(a)
                        } else if (d === 3 || d === 4) return a.nodeValue
                    } else
                        for (b = 0; c = a[b]; b++) c.nodeType !== 8 && (e += n(c));
                    return e
                },
                o = m.selectors = {
                    order: ["ID", "NAME", "TAG"],
                    match: {
                        ID: /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        CLASS: /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
                        NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
                        ATTR: /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
                        TAG: /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
                        CHILD: /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
                        POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
                        PSEUDO: /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
                    },
                    leftMatch: {},
                    attrMap: {
                        "class": "className",
                        "for": "htmlFor"
                    },
                    attrHandle: {
                        href: function(a) {
                            return a.getAttribute("href")
                        },
                        type: function(a) {
                            return a.getAttribute("type")
                        }
                    },
                    relative: {
                        "+": function(a, b) {
                            var c = typeof b == "string",
                                d = c && !l.test(b),
                                e = c && !d;
                            d && (b = b.toLowerCase());
                            for (var f = 0, g = a.length, h; f < g; f++)
                                if (h = a[f]) {
                                    while ((h = h.previousSibling) && h.nodeType !== 1);
                                    a[f] = e || h && h.nodeName.toLowerCase() === b ? h || !1 : h === b
                                }
                            e && m.filter(b, a, !0)
                        },
                        ">": function(a, b) {
                            var c, d = typeof b == "string",
                                e = 0,
                                f = a.length;
                            if (d && !l.test(b)) {
                                b = b.toLowerCase();
                                for (; e < f; e++) {
                                    c = a[e];
                                    if (c) {
                                        var g = c.parentNode;
                                        a[e] = g.nodeName.toLowerCase() === b ? g : !1
                                    }
                                }
                            } else {
                                for (; e < f; e++) c = a[e], c && (a[e] = d ? c.parentNode : c.parentNode === b);
                                d && m.filter(b, a, !0)
                            }
                        },
                        "": function(b, d, e) {
                            var g, h = f++,
                                i = a;
                            typeof d == "string" && !l.test(d) && (d = d.toLowerCase(), g = d, i = c), i("parentNode", d, h, b, g, e)
                        },
                        "~": function(b, d, e) {
                            var g, h = f++,
                                i = a;
                            typeof d == "string" && !l.test(d) && (d = d.toLowerCase(), g = d, i = c), i("previousSibling", d, h, b, g, e)
                        }
                    },
                    find: {
                        ID: function(a, b, c) {
                            if (typeof b.getElementById != "undefined" && !c) {
                                var d = b.getElementById(a[1]);
                                return d && d.parentNode ? [d] : []
                            }
                        },
                        NAME: function(a, b) {
                            if (typeof b.getElementsByName != "undefined") {
                                var c = [],
                                    d = b.getElementsByName(a[1]);
                                for (var e = 0, f = d.length; e < f; e++) d[e].getAttribute("name") === a[1] && c.push(d[e]);
                                return c.length === 0 ? null : c
                            }
                        },
                        TAG: function(a, b) {
                            if (typeof b.getElementsByTagName != "undefined") return b.getElementsByTagName(a[1])
                        }
                    },
                    preFilter: {
                        CLASS: function(a, b, c, d, e, f) {
                            a = " " + a[1].replace(j, "") + " ";
                            if (f) return a;
                            for (var g = 0, h;
                                (h = b[g]) != null; g++) h && (e ^ (h.className && (" " + h.className + " ").replace(/[\t\n\r]/g, " ").indexOf(a) >= 0) ? c || d.push(h) : c && (b[g] = !1));
                            return !1
                        },
                        ID: function(a) {
                            return a[1].replace(j, "")
                        },
                        TAG: function(a, b) {
                            return a[1].replace(j, "").toLowerCase()
                        },
                        CHILD: function(a) {
                            if (a[1] === "nth") {
                                a[2] || m.error(a[0]), a[2] = a[2].replace(/^\+|\s*/g, "");
                                var b = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(a[2] === "even" && "2n" || a[2] === "odd" && "2n+1" || !/\D/.test(a[2]) && "0n+" + a[2] || a[2]);
                                a[2] = b[1] + (b[2] || 1) - 0, a[3] = b[3] - 0
                            } else a[2] && m.error(a[0]);
                            return a[0] = f++, a
                        },
                        ATTR: function(a, b, c, d, e, f) {
                            var g = a[1] = a[1].replace(j, "");
                            return !f && o.attrMap[g] && (a[1] = o.attrMap[g]), a[4] = (a[4] || a[5] || "").replace(j, ""), a[2] === "~=" && (a[4] = " " + a[4] + " "), a
                        },
                        PSEUDO: function(a, b, c, e, f) {
                            if (a[1] === "not")
                                if ((d.exec(a[3]) || "").length > 1 || /^\w/.test(a[3])) a[3] = m(a[3], null, null, b);
                                else {
                                    var g = m.filter(a[3], b, c, !0 ^ f);
                                    return c || e.push.apply(e, g), !1
                                } else if (o.match.POS.test(a[0]) || o.match.CHILD.test(a[0])) return !0;
                            return a
                        },
                        POS: function(a) {
                            return a.unshift(!0), a
                        }
                    },
                    filters: {
                        enabled: function(a) {
                            return a.disabled === !1 && a.type !== "hidden"
                        },
                        disabled: function(a) {
                            return a.disabled === !0
                        },
                        checked: function(a) {
                            return a.checked === !0
                        },
                        selected: function(a) {
                            return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
                        },
                        parent: function(a) {
                            return !!a.firstChild
                        },
                        empty: function(a) {
                            return !a.firstChild
                        },
                        has: function(a, b, c) {
                            return !!m(c[3], a).length
                        },
                        header: function(a) {
                            return /h\d/i.test(a.nodeName)
                        },
                        text: function(a) {
                            var b = a.getAttribute("type"),
                                c = a.type;
                            return a.nodeName.toLowerCase() === "input" && "text" === c && (b === c || b === null)
                        },
                        radio: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "radio" === a.type
                        },
                        checkbox: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "checkbox" === a.type
                        },
                        file: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "file" === a.type
                        },
                        password: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "password" === a.type
                        },
                        submit: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "submit" === a.type
                        },
                        image: function(a) {
                            return a.nodeName.toLowerCase() === "input" && "image" === a.type
                        },
                        reset: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return (b === "input" || b === "button") && "reset" === a.type
                        },
                        button: function(a) {
                            var b = a.nodeName.toLowerCase();
                            return b === "input" && "button" === a.type || b === "button"
                        },
                        input: function(a) {
                            return /input|select|textarea|button/i.test(a.nodeName)
                        },
                        focus: function(a) {
                            return a === a.ownerDocument.activeElement
                        }
                    },
                    setFilters: {
                        first: function(a, b) {
                            return b === 0
                        },
                        last: function(a, b, c, d) {
                            return b === d.length - 1
                        },
                        even: function(a, b) {
                            return b % 2 === 0
                        },
                        odd: function(a, b) {
                            return b % 2 === 1
                        },
                        lt: function(a, b, c) {
                            return b < c[3] - 0
                        },
                        gt: function(a, b, c) {
                            return b > c[3] - 0
                        },
                        nth: function(a, b, c) {
                            return c[3] - 0 === b
                        },
                        eq: function(a, b, c) {
                            return c[3] - 0 === b
                        }
                    },
                    filter: {
                        PSEUDO: function(a, b, c, d) {
                            var e = b[1],
                                f = o.filters[e];
                            if (f) return f(a, c, b, d);
                            if (e === "contains") return (a.textContent || a.innerText || n([a]) || "").indexOf(b[3]) >= 0;
                            if (e === "not") {
                                var g = b[3];
                                for (var h = 0, i = g.length; h < i; h++)
                                    if (g[h] === a) return !1;
                                return !0
                            }
                            m.error(e)
                        },
                        CHILD: function(a, b) {
                            var c, d, f, g, h, i, j, k = b[1],
                                l = a;
                            switch (k) {
                                case "only":
                                case "first":
                                    while (l = l.previousSibling)
                                        if (l.nodeType === 1) return !1;
                                    if (k === "first") return !0;
                                    l = a;
                                case "last":
                                    while (l = l.nextSibling)
                                        if (l.nodeType === 1) return !1;
                                    return !0;
                                case "nth":
                                    c = b[2], d = b[3];
                                    if (c === 1 && d === 0) return !0;
                                    f = b[0], g = a.parentNode;
                                    if (g && (g[e] !== f || !a.nodeIndex)) {
                                        i = 0;
                                        for (l = g.firstChild; l; l = l.nextSibling) l.nodeType === 1 && (l.nodeIndex = ++i);
                                        g[e] = f
                                    }
                                    return j = a.nodeIndex - d, c === 0 ? j === 0 : j % c === 0 && j / c >= 0
                            }
                        },
                        ID: function(a, b) {
                            return a.nodeType === 1 && a.getAttribute("id") === b
                        },
                        TAG: function(a, b) {
                            return b === "*" && a.nodeType === 1 || !!a.nodeName && a.nodeName.toLowerCase() === b
                        },
                        CLASS: function(a, b) {
                            return (" " + (a.className || a.getAttribute("class")) + " ").indexOf(b) > -1
                        },
                        ATTR: function(a, b) {
                            var c = b[1],
                                d = m.attr ? m.attr(a, c) : o.attrHandle[c] ? o.attrHandle[c](a) : a[c] != null ? a[c] : a.getAttribute(c),
                                e = d + "",
                                f = b[2],
                                g = b[4];
                            return d == null ? f === "!=" : !f && m.attr ? d != null : f === "=" ? e === g : f === "*=" ? e.indexOf(g) >= 0 : f === "~=" ? (" " + e + " ").indexOf(g) >= 0 : g ? f === "!=" ? e !== g : f === "^=" ? e.indexOf(g) === 0 : f === "$=" ? e.substr(e.length - g.length) === g : f === "|=" ? e === g || e.substr(0, g.length + 1) === g + "-" : !1 : e && d !== !1
                        },
                        POS: function(a, b, c, d) {
                            var e = b[2],
                                f = o.setFilters[e];
                            if (f) return f(a, c, b, d)
                        }
                    }
                },
                p = o.match.POS,
                q = function(a, b) {
                    return "\\" + (b - 0 + 1)
                };
            for (var r in o.match) o.match[r] = new RegExp(o.match[r].source + /(?![^\[]*\])(?![^\(]*\))/.source), o.leftMatch[r] = new RegExp(/(^(?:.|\r|\n)*?)/.source + o.match[r].source.replace(/\\(\d+)/g, q));
            o.match.globalPOS = p;
            var s = function(a, b) {
                return a = Array.prototype.slice.call(a, 0), b ? (b.push.apply(b, a), b) : a
            };
            try {
                Array.prototype.slice.call(G.documentElement.childNodes, 0)[0].nodeType
            } catch (t) {
                s = function(a, b) {
                    var c = 0,
                        d = b || [];
                    if (g.call(a) === "[object Array]") Array.prototype.push.apply(d, a);
                    else if (typeof a.length == "number")
                        for (var e = a.length; c < e; c++) d.push(a[c]);
                    else
                        for (; a[c]; c++) d.push(a[c]);
                    return d
                }
            }
            var u, v;
            G.documentElement.compareDocumentPosition ? u = function(a, b) {
                    return a === b ? (h = !0, 0) : !a.compareDocumentPosition || !b.compareDocumentPosition ? a.compareDocumentPosition ? -1 : 1 : a.compareDocumentPosition(b) & 4 ? -1 : 1
                } : (u = function(a, b) {
                    if (a === b) return h = !0, 0;
                    if (a.sourceIndex && b.sourceIndex) return a.sourceIndex - b.sourceIndex;
                    var c, d, e = [],
                        f = [],
                        g = a.parentNode,
                        i = b.parentNode,
                        j = g;
                    if (g === i) return v(a, b);
                    if (!g) return -1;
                    if (!i) return 1;
                    while (j) e.unshift(j), j = j.parentNode;
                    j = i;
                    while (j) f.unshift(j), j = j.parentNode;
                    c = e.length, d = f.length;
                    for (var k = 0; k < c && k < d; k++)
                        if (e[k] !== f[k]) return v(e[k], f[k]);
                    return k === c ? v(a, f[k], -1) : v(e[k], b, 1)
                }, v = function(a, b, c) {
                    if (a === b) return c;
                    var d = a.nextSibling;
                    while (d) {
                        if (d === b) return -1;
                        d = d.nextSibling
                    }
                    return 1
                }),
                function() {
                    var a = G.createElement("div"),
                        c = "script" + (new Date).getTime(),
                        d = G.documentElement;
                    a.innerHTML = "<a name='" + c + "'/>", d.insertBefore(a, d.firstChild), G.getElementById(c) && (o.find.ID = function(a, c, d) {
                        if (typeof c.getElementById != "undefined" && !d) {
                            var e = c.getElementById(a[1]);
                            return e ? e.id === a[1] || typeof e.getAttributeNode != "undefined" && e.getAttributeNode("id").nodeValue === a[1] ? [e] : b : []
                        }
                    }, o.filter.ID = function(a, b) {
                        var c = typeof a.getAttributeNode != "undefined" && a.getAttributeNode("id");
                        return a.nodeType === 1 && c && c.nodeValue === b
                    }), d.removeChild(a), d = a = null
                }(),
                function() {
                    var a = G.createElement("div");
                    a.appendChild(G.createComment("")), a.getElementsByTagName("*").length > 0 && (o.find.TAG = function(a, b) {
                        var c = b.getElementsByTagName(a[1]);
                        if (a[1] === "*") {
                            var d = [];
                            for (var e = 0; c[e]; e++) c[e].nodeType === 1 && d.push(c[e]);
                            c = d
                        }
                        return c
                    }), a.innerHTML = "<a href='#'></a>", a.firstChild && typeof a.firstChild.getAttribute != "undefined" && a.firstChild.getAttribute("href") !== "#" && (o.attrHandle.href = function(a) {
                        return a.getAttribute("href", 2)
                    }), a = null
                }(), G.querySelectorAll && function() {
                    var a = m,
                        b = G.createElement("div"),
                        c = "__sizzle__";
                    b.innerHTML = "<p class='TEST'></p>";
                    if (!b.querySelectorAll || b.querySelectorAll(".TEST").length !== 0) {
                        m = function(b, d, e, f) {
                            d = d || G;
                            if (!f && !m.isXML(d)) {
                                var g = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(b);
                                if (g && (d.nodeType === 1 || d.nodeType === 9)) {
                                    if (g[1]) return s(d.getElementsByTagName(b), e);
                                    if (g[2] && o.find.CLASS && d.getElementsByClassName) return s(d.getElementsByClassName(g[2]), e)
                                }
                                if (d.nodeType === 9) {
                                    if (b === "body" && d.body) return s([d.body], e);
                                    if (g && g[3]) {
                                        var h = d.getElementById(g[3]);
                                        if (!h || !h.parentNode) return s([], e);
                                        if (h.id === g[3]) return s([h], e)
                                    }
                                    try {
                                        return s(d.querySelectorAll(b), e)
                                    } catch (i) {}
                                } else if (d.nodeType === 1 && d.nodeName.toLowerCase() !== "object") {
                                    var j = d,
                                        k = d.getAttribute("id"),
                                        l = k || c,
                                        n = d.parentNode,
                                        p = /^\s*[+~]/.test(b);
                                    k ? l = l.replace(/'/g, "\\$&") : d.setAttribute("id", l), p && n && (d = d.parentNode);
                                    try {
                                        if (!p || n) return s(d.querySelectorAll("[id='" + l + "'] " + b), e)
                                    } catch (q) {} finally {
                                        k || j.removeAttribute("id")
                                    }
                                }
                            }
                            return a(b, d, e, f)
                        };
                        for (var d in a) m[d] = a[d];
                        b = null
                    }
                }(),
                function() {
                    var a = G.documentElement,
                        b = a.matchesSelector || a.mozMatchesSelector || a.webkitMatchesSelector || a.msMatchesSelector;
                    if (b) {
                        var c = !b.call(G.createElement("div"), "div"),
                            d = !1;
                        try {
                            b.call(G.documentElement, "[test!='']:sizzle")
                        } catch (e) {
                            d = !0
                        }
                        m.matchesSelector = function(a, e) {
                            e = e.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");
                            if (!m.isXML(a)) try {
                                if (d || !o.match.PSEUDO.test(e) && !/!=/.test(e)) {
                                    var f = b.call(a, e);
                                    if (f || !c || a.document && a.document.nodeType !== 11) return f
                                }
                            } catch (g) {}
                            return m(e, null, null, [a]).length > 0
                        }
                    }
                }(),
                function() {
                    var a = G.createElement("div");
                    a.innerHTML = "<div class='test e'></div><div class='test'></div>";
                    if (!!a.getElementsByClassName && a.getElementsByClassName("e").length !== 0) {
                        a.lastChild.className = "e";
                        if (a.getElementsByClassName("e").length === 1) return;
                        o.order.splice(1, 0, "CLASS"), o.find.CLASS = function(a, b, c) {
                            if (typeof b.getElementsByClassName != "undefined" && !c) return b.getElementsByClassName(a[1])
                        }, a = null
                    }
                }(), G.documentElement.contains ? m.contains = function(a, b) {
                    return a !== b && (a.contains ? a.contains(b) : !0)
                } : G.documentElement.compareDocumentPosition ? m.contains = function(a, b) {
                    return !!(a.compareDocumentPosition(b) & 16)
                } : m.contains = function() {
                    return !1
                }, m.isXML = function(a) {
                    var b = (a ? a.ownerDocument || a : 0).documentElement;
                    return b ? b.nodeName !== "HTML" : !1
                };
            var w = function(a, b, c) {
                var d, e = [],
                    f = "",
                    g = b.nodeType ? [b] : b;
                while (d = o.match.PSEUDO.exec(a)) f += d[0], a = a.replace(o.match.PSEUDO, "");
                a = o.relative[a] ? a + "*" : a;
                for (var h = 0, i = g.length; h < i; h++) m(a, g[h], e, c);
                return m.filter(f, e)
            };
            m.attr = J.attr, m.selectors.attrMap = {}, J.find = m, J.expr = m.selectors, J.expr[":"] = J.expr.filters, J.unique = m.uniqueSort, J.text = m.getText, J.isXMLDoc = m.isXML, J.contains = m.contains
        }();
    var bh = /Until$/,
        bi = /^(?:parents|prevUntil|prevAll)/,
        bj = /,/,
        bk = /^.[^:#\[\.,]*$/,
        bl = Array.prototype.slice,
        bm = J.expr.match.globalPOS,
        bn = {
            children: !0,
            contents: !0,
            next: !0,
            prev: !0
        };
    J.fn.extend({
        find: function(a) {
            var b = this,
                c, d;
            if (typeof a != "string") return J(a).filter(function() {
                for (c = 0, d = b.length; c < d; c++)
                    if (J.contains(b[c], this)) return !0
            });
            var e = this.pushStack("", "find", a),
                f, g, h;
            for (c = 0, d = this.length; c < d; c++) {
                f = e.length, J.find(a, this[c], e);
                if (c > 0)
                    for (g = f; g < e.length; g++)
                        for (h = 0; h < f; h++)
                            if (e[h] === e[g]) {
                                e.splice(g--, 1);
                                break
                            }
            }
            return e
        },
        has: function(a) {
            var b = J(a);
            return this.filter(function() {
                for (var a = 0, c = b.length; a < c; a++)
                    if (J.contains(this, b[a])) return !0
            })
        },
        not: function(a) {
            return this.pushStack(y(this, a, !1), "not", a)
        },
        filter: function(a) {
            return this.pushStack(y(this, a, !0), "filter", a)
        },
        is: function(a) {
            return !!a && (typeof a == "string" ? bm.test(a) ? J(a, this.context).index(this[0]) >= 0 : J.filter(a, this).length > 0 : this.filter(a).length > 0)
        },
        closest: function(a, b) {
            var c = [],
                d, e, f = this[0];
            if (J.isArray(a)) {
                var g = 1;
                while (f && f.ownerDocument && f !== b) {
                    for (d = 0; d < a.length; d++) J(f).is(a[d]) && c.push({
                        selector: a[d],
                        elem: f,
                        level: g
                    });
                    f = f.parentNode, g++
                }
                return c
            }
            var h = bm.test(a) || typeof a != "string" ? J(a, b || this.context) : 0;
            for (d = 0, e = this.length; d < e; d++) {
                f = this[d];
                while (f) {
                    if (h ? h.index(f) > -1 : J.find.matchesSelector(f, a)) {
                        c.push(f);
                        break
                    }
                    f = f.parentNode;
                    if (!f || !f.ownerDocument || f === b || f.nodeType === 11) break
                }
            }
            return c = c.length > 1 ? J.unique(c) : c, this.pushStack(c, "closest", a)
        },
        index: function(a) {
            return a ? typeof a == "string" ? J.inArray(this[0], J(a)) : J.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
        },
        add: function(a, b) {
            var c = typeof a == "string" ? J(a, b) : J.makeArray(a && a.nodeType ? [a] : a),
                d = J.merge(this.get(), c);
            return this.pushStack(z(c[0]) || z(d[0]) ? d : J.unique(d))
        },
        andSelf: function() {
            return this.add(this.prevObject)
        }
    }), J.each({
        parent: function(a) {
            var b = a.parentNode;
            return b && b.nodeType !== 11 ? b : null
        },
        parents: function(a) {
            return J.dir(a, "parentNode")
        },
        parentsUntil: function(a, b, c) {
            return J.dir(a, "parentNode", c)
        },
        next: function(a) {
            return J.nth(a, 2, "nextSibling")
        },
        prev: function(a) {
            return J.nth(a, 2, "previousSibling")
        },
        nextAll: function(a) {
            return J.dir(a, "nextSibling")
        },
        prevAll: function(a) {
            return J.dir(a, "previousSibling")
        },
        nextUntil: function(a, b, c) {
            return J.dir(a, "nextSibling", c)
        },
        prevUntil: function(a, b, c) {
            return J.dir(a, "previousSibling", c)
        },
        siblings: function(a) {
            return J.sibling((a.parentNode || {}).firstChild, a)
        },
        children: function(a) {
            return J.sibling(a.firstChild)
        },
        contents: function(a) {
            return J.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : J.makeArray(a.childNodes)
        }
    }, function(a, b) {
        J.fn[a] = function(c, d) {
            var e = J.map(this, b, c);
            return bh.test(a) || (d = c), d && typeof d == "string" && (e = J.filter(d, e)), e = this.length > 1 && !bn[a] ? J.unique(e) : e, (this.length > 1 || bj.test(d)) && bi.test(a) && (e = e.reverse()), this.pushStack(e, a, bl.call(arguments).join(","))
        }
    }), J.extend({
        filter: function(a, b, c) {
            return c && (a = ":not(" + a + ")"), b.length === 1 ? J.find.matchesSelector(b[0], a) ? [b[0]] : [] : J.find.matches(a, b)
        },
        dir: function(a, c, d) {
            var e = [],
                f = a[c];
            while (f && f.nodeType !== 9 && (d === b || f.nodeType !== 1 || !J(f).is(d))) f.nodeType === 1 && e.push(f), f = f[c];
            return e
        },
        nth: function(a, b, c, d) {
            b = b || 1;
            var e = 0;
            for (; a; a = a[c])
                if (a.nodeType === 1 && ++e === b) break;
            return a
        },
        sibling: function(a, b) {
            var c = [];
            for (; a; a = a.nextSibling) a.nodeType === 1 && a !== b && c.push(a);
            return c
        }
    });
    var bo = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
        bp = / jQuery\d+="(?:\d+|null)"/g,
        bq = /^\s+/,
        br = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,
        bs = /<([\w:]+)/,
        bt = /<tbody/i,
        bu = /<|&#?\w+;/,
        bv = /<(?:script|style)/i,
        bw = /<(?:script|object|embed|option|style)/i,
        bx = new RegExp("<(?:" + bo + ")[\\s/>]", "i"),
        by = /checked\s*(?:[^=]|=\s*.checked.)/i,
        bz = /\/(java|ecma)script/i,
        bA = /^\s*<!(?:\[CDATA\[|\-\-)/,
        bB = {
            option: [1, "<select multiple='multiple'>", "</select>"],
            legend: [1, "<fieldset>", "</fieldset>"],
            thead: [1, "<table>", "</table>"],
            tr: [2, "<table><tbody>", "</tbody></table>"],
            td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
            col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
            area: [1, "<map>", "</map>"],
            _default: [0, "", ""]
        },
        bC = x(G);
    bB.optgroup = bB.option, bB.tbody = bB.tfoot = bB.colgroup = bB.caption = bB.thead, bB.th = bB.td, J.support.htmlSerialize || (bB._default = [1, "div<div>", "</div>"]), J.fn.extend({
        text: function(a) {
            return J.access(this, function(a) {
                return a === b ? J.text(this) : this.empty().append((this[0] && this[0].ownerDocument || G).createTextNode(a))
            }, null, a, arguments.length)
        },
        wrapAll: function(a) {
            if (J.isFunction(a)) return this.each(function(b) {
                J(this).wrapAll(a.call(this, b))
            });
            if (this[0]) {
                var b = J(a, this[0].ownerDocument).eq(0).clone(!0);
                this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                    var a = this;
                    while (a.firstChild && a.firstChild.nodeType === 1) a = a.firstChild;
                    return a
                }).append(this)
            }
            return this
        },
        wrapInner: function(a) {
            return J.isFunction(a) ? this.each(function(b) {
                J(this).wrapInner(a.call(this, b))
            }) : this.each(function() {
                var b = J(this),
                    c = b.contents();
                c.length ? c.wrapAll(a) : b.append(a)
            })
        },
        wrap: function(a) {
            var b = J.isFunction(a);
            return this.each(function(c) {
                J(this).wrapAll(b ? a.call(this, c) : a)
            })
        },
        unwrap: function() {
            return this.parent().each(function() {
                J.nodeName(this, "body") || J(this).replaceWith(this.childNodes)
            }).end()
        },
        append: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.appendChild(a)
            })
        },
        prepend: function() {
            return this.domManip(arguments, !0, function(a) {
                this.nodeType === 1 && this.insertBefore(a, this.firstChild)
            })
        },
        before: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this)
            });
            if (arguments.length) {
                var a = J.clean(arguments);
                return a.push.apply(a, this.toArray()), this.pushStack(a, "before", arguments)
            }
        },
        after: function() {
            if (this[0] && this[0].parentNode) return this.domManip(arguments, !1, function(a) {
                this.parentNode.insertBefore(a, this.nextSibling)
            });
            if (arguments.length) {
                var a = this.pushStack(this, "after", arguments);
                return a.push.apply(a, J.clean(arguments)), a
            }
        },
        remove: function(a, b) {
            for (var c = 0, d;
                (d = this[c]) != null; c++)
                if (!a || J.filter(a, [d]).length) !b && d.nodeType === 1 && (J.cleanData(d.getElementsByTagName("*")), J.cleanData([d])), d.parentNode && d.parentNode.removeChild(d);
            return this
        },
        empty: function() {
            for (var a = 0, b;
                (b = this[a]) != null; a++) {
                b.nodeType === 1 && J.cleanData(b.getElementsByTagName("*"));
                while (b.firstChild) b.removeChild(b.firstChild)
            }
            return this
        },
        clone: function(a, b) {
            return a = a == null ? !1 : a, b = b == null ? a : b, this.map(function() {
                return J.clone(this, a, b)
            })
        },
        html: function(a) {
            return J.access(this, function(a) {
                var c = this[0] || {},
                    d = 0,
                    e = this.length;
                if (a === b) return c.nodeType === 1 ? c.innerHTML.replace(bp, "") : null;
                if (typeof a == "string" && !bv.test(a) && (J.support.leadingWhitespace || !bq.test(a)) && !bB[(bs.exec(a) || ["", ""])[1].toLowerCase()]) {
                    a = a.replace(br, "<$1></$2>");
                    try {
                        for (; d < e; d++) c = this[d] || {}, c.nodeType === 1 && (J.cleanData(c.getElementsByTagName("*")), c.innerHTML = a);
                        c = 0
                    } catch (f) {}
                }
                c && this.empty().append(a)
            }, null, a, arguments.length)
        },
        replaceWith: function(a) {
            return this[0] && this[0].parentNode ? J.isFunction(a) ? this.each(function(b) {
                var c = J(this),
                    d = c.html();
                c.replaceWith(a.call(this, b, d))
            }) : (typeof a != "string" && (a = J(a).detach()), this.each(function() {
                var b = this.nextSibling,
                    c = this.parentNode;
                J(this).remove(), b ? J(b).before(a) : J(c).append(a)
            })) : this.length ? this.pushStack(J(J.isFunction(a) ? a() : a), "replaceWith", a) : this
        },
        detach: function(a) {
            return this.remove(a, !0)
        },
        domManip: function(a, c, d) {
            var e, f, g, h, i = a[0],
                j = [];
            if (!J.support.checkClone && arguments.length === 3 && typeof i == "string" && by.test(i)) return this.each(function() {
                J(this).domManip(a, c, d, !0)
            });
            if (J.isFunction(i)) return this.each(function(e) {
                var f = J(this);
                a[0] = i.call(this, e, c ? f.html() : b), f.domManip(a, c, d)
            });
            if (this[0]) {
                h = i && i.parentNode, J.support.parentNode && h && h.nodeType === 11 && h.childNodes.length === this.length ? e = {
                    fragment: h
                } : e = J.buildFragment(a, this, j), g = e.fragment, g.childNodes.length === 1 ? f = g = g.firstChild : f = g.firstChild;
                if (f) {
                    c = c && J.nodeName(f, "tr");
                    for (var k = 0, l = this.length, m = l - 1; k < l; k++) d.call(c ? w(this[k], f) : this[k], e.cacheable || l > 1 && k < m ? J.clone(g, !0, !0) : g)
                }
                j.length && J.each(j, function(a, b) {
                    b.src ? J.ajax({
                        type: "GET",
                        global: !1,
                        url: b.src,
                        async: !1,
                        dataType: "script"
                    }) : J.globalEval((b.text || b.textContent || b.innerHTML || "").replace(bA, "/*$0*/")), b.parentNode && b.parentNode.removeChild(b)
                })
            }
            return this
        }
    }), J.buildFragment = function(a, b, c) {
        var d, e, f, g, h = a[0];
        return b && b[0] && (g = b[0].ownerDocument || b[0]), g.createDocumentFragment || (g = G), a.length === 1 && typeof h == "string" && h.length < 512 && g === G && h.charAt(0) === "<" && !bw.test(h) && (J.support.checkClone || !by.test(h)) && (J.support.html5Clone || !bx.test(h)) && (e = !0, f = J.fragments[h], f && f !== 1 && (d = f)), d || (d = g.createDocumentFragment(), J.clean(a, g, d, c)), e && (J.fragments[h] = f ? d : 1), {
            fragment: d,
            cacheable: e
        }
    }, J.fragments = {}, J.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(a, b) {
        J.fn[a] = function(c) {
            var d = [],
                e = J(c),
                f = this.length === 1 && this[0].parentNode;
            if (f && f.nodeType === 11 && f.childNodes.length === 1 && e.length === 1) return e[b](this[0]), this;
            for (var g = 0, h = e.length; g < h; g++) {
                var i = (g > 0 ? this.clone(!0) : this).get();
                J(e[g])[b](i), d = d.concat(i)
            }
            return this.pushStack(d, a, e.selector)
        }
    }), J.extend({
        clone: function(a, b, c) {
            var d, e, f, g = J.support.html5Clone || J.isXMLDoc(a) || !bx.test("<" + a.nodeName + ">") ? a.cloneNode(!0) : q(a);
            if ((!J.support.noCloneEvent || !J.support.noCloneChecked) && (a.nodeType === 1 || a.nodeType === 11) && !J.isXMLDoc(a)) {
                u(a, g), d = t(a), e = t(g);
                for (f = 0; d[f]; ++f) e[f] && u(d[f], e[f])
            }
            if (b) {
                v(a, g);
                if (c) {
                    d = t(a), e = t(g);
                    for (f = 0; d[f]; ++f) v(d[f], e[f])
                }
            }
            return d = e = null, g
        },
        clean: function(a, b, c, d) {
            var e, f, g, h = [];
            b = b || G, typeof b.createElement == "undefined" && (b = b.ownerDocument || b[0] && b[0].ownerDocument || G);
            for (var i = 0, j;
                (j = a[i]) != null; i++) {
                typeof j == "number" && (j += "");
                if (!j) continue;
                if (typeof j == "string")
                    if (!bu.test(j)) j = b.createTextNode(j);
                    else {
                        j = j.replace(br, "<$1></$2>");
                        var k = (bs.exec(j) || ["", ""])[1].toLowerCase(),
                            l = bB[k] || bB._default,
                            m = l[0],
                            n = b.createElement("div"),
                            o = bC.childNodes,
                            p;
                        b === G ? bC.appendChild(n) : x(b).appendChild(n), n.innerHTML = l[1] + j + l[2];
                        while (m--) n = n.lastChild;
                        if (!J.support.tbody) {
                            var q = bt.test(j),
                                s = k === "table" && !q ? n.firstChild && n.firstChild.childNodes : l[1] === "<table>" && !q ? n.childNodes : [];
                            for (g = s.length - 1; g >= 0; --g) J.nodeName(s[g], "tbody") && !s[g].childNodes.length && s[g].parentNode.removeChild(s[g])
                        }!J.support.leadingWhitespace && bq.test(j) && n.insertBefore(b.createTextNode(bq.exec(j)[0]), n.firstChild), j = n.childNodes, n && (n.parentNode.removeChild(n), o.length > 0 && (p = o[o.length - 1], p && p.parentNode && p.parentNode.removeChild(p)))
                    }
                var t;
                if (!J.support.appendChecked)
                    if (j[0] && typeof(t = j.length) == "number")
                        for (g = 0; g < t; g++) r(j[g]);
                    else r(j);
                j.nodeType ? h.push(j) : h = J.merge(h, j)
            }
            if (c) {
                e = function(a) {
                    return !a.type || bz.test(a.type)
                };
                for (i = 0; h[i]; i++) {
                    f = h[i];
                    if (d && J.nodeName(f, "script") && (!f.type || bz.test(f.type))) d.push(f.parentNode ? f.parentNode.removeChild(f) : f);
                    else {
                        if (f.nodeType === 1) {
                            var u = J.grep(f.getElementsByTagName("script"), e);
                            h.splice.apply(h, [i + 1, 0].concat(u))
                        }
                        c.appendChild(f)
                    }
                }
            }
            return h
        },
        cleanData: function(a) {
            var b, c, d = J.cache,
                e = J.event.special,
                f = J.support.deleteExpando;
            for (var g = 0, h;
                (h = a[g]) != null; g++) {
                if (h.nodeName && J.noData[h.nodeName.toLowerCase()]) continue;
                c = h[J.expando];
                if (c) {
                    b = d[c];
                    if (b && b.events) {
                        for (var i in b.events) e[i] ? J.event.remove(h, i) : J.removeEvent(h, i, b.handle);
                        b.handle && (b.handle.elem = null)
                    }
                    f ? delete h[J.expando] : h.removeAttribute && h.removeAttribute(J.expando), delete d[c]
                }
            }
        }
    });
    var bD = /alpha\([^)]*\)/i,
        bE = /opacity=([^)]*)/,
        bF = /([A-Z]|^ms)/g,
        bG = /^[\-+]?(?:\d*\.)?\d+$/i,
        bH = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i,
        bI = /^([\-+])=([\-+.\de]+)/,
        bJ = /^margin/,
        bK = {
            position: "absolute",
            visibility: "hidden",
            display: "block"
        },
        bL = ["Top", "Right", "Bottom", "Left"],
        bM, bN, bO;
    J.fn.css = function(a, c) {
        return J.access(this, function(a, c, d) {
            return d !== b ? J.style(a, c, d) : J.css(a, c)
        }, a, c, arguments.length > 1)
    }, J.extend({
        cssHooks: {
            opacity: {
                get: function(a, b) {
                    if (b) {
                        var c = bM(a, "opacity");
                        return c === "" ? "1" : c
                    }
                    return a.style.opacity
                }
            }
        },
        cssNumber: {
            fillOpacity: !0,
            fontWeight: !0,
            lineHeight: !0,
            opacity: !0,
            orphans: !0,
            widows: !0,
            zIndex: !0,
            zoom: !0
        },
        cssProps: {
            "float": J.support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(a, c, d, e) {
            if (!!a && a.nodeType !== 3 && a.nodeType !== 8 && !!a.style) {
                var f, g, h = J.camelCase(c),
                    i = a.style,
                    j = J.cssHooks[h];
                c = J.cssProps[h] || h;
                if (d === b) return j && "get" in j && (f = j.get(a, !1, e)) !== b ? f : i[c];
                g = typeof d, g === "string" && (f = bI.exec(d)) && (d = +(f[1] + 1) * +f[2] + parseFloat(J.css(a, c)), g = "number");
                if (d == null || g === "number" && isNaN(d)) return;
                g === "number" && !J.cssNumber[h] && (d += "px");
                if (!j || !("set" in j) || (d = j.set(a, d)) !== b) try {
                    i[c] = d
                } catch (k) {}
            }
        },
        css: function(a, c, d) {
            var e, f;
            c = J.camelCase(c), f = J.cssHooks[c], c = J.cssProps[c] || c, c === "cssFloat" && (c = "float");
            if (f && "get" in f && (e = f.get(a, !0, d)) !== b) return e;
            if (bM) return bM(a, c)
        },
        swap: function(a, b, c) {
            var d = {},
                e, f;
            for (f in b) d[f] = a.style[f], a.style[f] = b[f];
            e = c.call(a);
            for (f in b) a.style[f] = d[f];
            return e
        }
    }), J.curCSS = J.css, G.defaultView && G.defaultView.getComputedStyle && (bN = function(a, b) {
        var c, d, e, f, g = a.style;
        return b = b.replace(bF, "-$1").toLowerCase(), (d = a.ownerDocument.defaultView) && (e = d.getComputedStyle(a, null)) && (c = e.getPropertyValue(b), c === "" && !J.contains(a.ownerDocument.documentElement, a) && (c = J.style(a, b))), !J.support.pixelMargin && e && bJ.test(b) && bH.test(c) && (f = g.width, g.width = c, c = e.width, g.width = f), c
    }), G.documentElement.currentStyle && (bO = function(a, b) {
        var c, d, e, f = a.currentStyle && a.currentStyle[b],
            g = a.style;
        return f == null && g && (e = g[b]) && (f = e), bH.test(f) && (c = g.left, d = a.runtimeStyle && a.runtimeStyle.left, d && (a.runtimeStyle.left = a.currentStyle.left), g.left = b === "fontSize" ? "1em" : f, f = g.pixelLeft + "px", g.left = c, d && (a.runtimeStyle.left = d)), f === "" ? "auto" : f
    }), bM = bN || bO, J.each(["height", "width"], function(a, b) {
        J.cssHooks[b] = {
            get: function(a, c, d) {
                if (c) return a.offsetWidth !== 0 ? p(a, b, d) : J.swap(a, bK, function() {
                    return p(a, b, d)
                })
            },
            set: function(a, b) {
                return bG.test(b) ? b + "px" : b
            }
        }
    }), J.support.opacity || (J.cssHooks.opacity = {
        get: function(a, b) {
            return bE.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? parseFloat(RegExp.$1) / 100 + "" : b ? "1" : ""
        },
        set: function(a, b) {
            var c = a.style,
                d = a.currentStyle,
                e = J.isNumeric(b) ? "alpha(opacity=" + b * 100 + ")" : "",
                f = d && d.filter || c.filter || "";
            c.zoom = 1;
            if (b >= 1 && J.trim(f.replace(bD, "")) === "") {
                c.removeAttribute("filter");
                if (d && !d.filter) return
            }
            c.filter = bD.test(f) ? f.replace(bD, e) : f + " " + e
        }
    }), J(function() {
        J.support.reliableMarginRight || (J.cssHooks.marginRight = {
            get: function(a, b) {
                return J.swap(a, {
                    display: "inline-block"
                }, function() {
                    return b ? bM(a, "margin-right") : a.style.marginRight
                })
            }
        })
    }), J.expr && J.expr.filters && (J.expr.filters.hidden = function(a) {
        var b = a.offsetWidth,
            c = a.offsetHeight;
        return b === 0 && c === 0 || !J.support.reliableHiddenOffsets && (a.style && a.style.display || J.css(a, "display")) === "none"
    }, J.expr.filters.visible = function(a) {
        return !J.expr.filters.hidden(a)
    }), J.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(a, b) {
        J.cssHooks[a + b] = {
            expand: function(c) {
                var d, e = typeof c == "string" ? c.split(" ") : [c],
                    f = {};
                for (d = 0; d < 4; d++) f[a + bL[d] + b] = e[d] || e[d - 2] || e[0];
                return f
            }
        }
    });
    var bP = /%20/g,
        bQ = /\[\]$/,
        bR = /\r?\n/g,
        bS = /#.*$/,
        bT = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg,
        bU = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
        bV = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/,
        bW = /^(?:GET|HEAD)$/,
        bX = /^\/\//,
        bY = /\?/,
        bZ = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        b$ = /^(?:select|textarea)/i,
        b_ = /\s+/,
        ca = /([?&])_=[^&]*/,
        cb = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,
        cc = J.fn.load,
        cd = {},
        ce = {},
        cf, cg, ch = ["*/"] + ["*"];
    try {
        cf = I.href
    } catch (ci) {
        cf = G.createElement("a"), cf.href = "", cf = cf.href
    }
    cg = cb.exec(cf.toLowerCase()) || [], J.fn.extend({
        load: function(a, c, d) {
            if (typeof a != "string" && cc) return cc.apply(this, arguments);
            if (!this.length) return this;
            var e = a.indexOf(" ");
            if (e >= 0) {
                var f = a.slice(e, a.length);
                a = a.slice(0, e)
            }
            var g = "GET";
            c && (J.isFunction(c) ? (d = c, c = b) : typeof c == "object" && (c = J.param(c, J.ajaxSettings.traditional), g = "POST"));
            var h = this;
            return J.ajax({
                url: a,
                type: g,
                dataType: "html",
                data: c,
                complete: function(a, b, c) {
                    c = a.responseText, a.isResolved() && (a.done(function(a) {
                        c = a
                    }), h.html(f ? J("<div>").append(c.replace(bZ, "")).find(f) : c)), d && h.each(d, [c, b, a])
                }
            }), this
        },
        serialize: function() {
            return J.param(this.serializeArray())
        },
        serializeArray: function() {
            return this.map(function() {
                return this.elements ? J.makeArray(this.elements) : this
            }).filter(function() {
                return this.name && !this.disabled && (this.checked || b$.test(this.nodeName) || bU.test(this.type))
            }).map(function(a, b) {
                var c = J(this).val();
                return c == null ? null : J.isArray(c) ? J.map(c, function(a, c) {
                    return {
                        name: b.name,
                        value: a.replace(bR, "\r\n")
                    }
                }) : {
                    name: b.name,
                    value: c.replace(bR, "\r\n")
                }
            }).get()
        }
    }), J.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(a, b) {
        J.fn[b] = function(a) {
            return this.on(b, a)
        }
    }), J.each(["get", "post"], function(a, c) {
        J[c] = function(a, d, e, f) {
            return J.isFunction(d) && (f = f || e, e = d, d = b), J.ajax({
                type: c,
                url: a,
                data: d,
                success: e,
                dataType: f
            })
        }
    }), J.extend({
        getScript: function(a, c) {
            return J.get(a, b, c, "script")
        },
        getJSON: function(a, b, c) {
            return J.get(a, b, c, "json")
        },
        ajaxSetup: function(a, b) {
            return b ? m(a, J.ajaxSettings) : (b = a, a = J.ajaxSettings), m(a, b), a
        },
        ajaxSettings: {
            url: cf,
            isLocal: bV.test(cg[1]),
            global: !0,
            type: "GET",
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            processData: !0,
            async: !0,
            accepts: {
                xml: "application/xml, text/xml",
                html: "text/html",
                text: "text/plain",
                json: "application/json, text/javascript",
                "*": ch
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText"
            },
            converters: {
                "* text": a.String,
                "text html": !0,
                "text json": J.parseJSON,
                "text xml": J.parseXML
            },
            flatOptions: {
                context: !0,
                url: !0
            }
        },
        ajaxPrefilter: o(cd),
        ajaxTransport: o(ce),
        ajax: function(a, c) {
            function d(a, c, d, n) {
                if (v !== 2) {
                    v = 2, t && clearTimeout(t), s = b, q = n || "", y.readyState = a > 0 ? 4 : 0;
                    var o, p, r, u = c,
                        x = d ? k(e, y, d) : b,
                        z, A;
                    if (a >= 200 && a < 300 || a === 304) {
                        if (e.ifModified) {
                            if (z = y.getResponseHeader("Last-Modified")) J.lastModified[m] = z;
                            if (A = y.getResponseHeader("Etag")) J.etag[m] = A
                        }
                        if (a === 304) u = "notmodified", o = !0;
                        else try {
                            p = j(e, x), u = "success", o = !0
                        } catch (B) {
                            u = "parsererror", r = B
                        }
                    } else {
                        r = u;
                        if (!u || a) u = "error", a < 0 && (a = 0)
                    }
                    y.status = a, y.statusText = "" + (c || u), o ? h.resolveWith(f, [p, u, y]) : h.rejectWith(f, [y, u, r]), y.statusCode(l), l = b, w && g.trigger("ajax" + (o ? "Success" : "Error"), [y, e, o ? p : r]), i.fireWith(f, [y, u]), w && (g.trigger("ajaxComplete", [y, e]), --J.active || J.event.trigger("ajaxStop"))
                }
            }
            typeof a == "object" && (c = a, a = b), c = c || {};
            var e = J.ajaxSetup({}, c),
                f = e.context || e,
                g = f !== e && (f.nodeType || f instanceof J) ? J(f) : J.event,
                h = J.Deferred(),
                i = J.Callbacks("once memory"),
                l = e.statusCode || {},
                m, o = {},
                p = {},
                q, r, s, t, u, v = 0,
                w, x, y = {
                    readyState: 0,
                    setRequestHeader: function(a, b) {
                        if (!v) {
                            var c = a.toLowerCase();
                            a = p[c] = p[c] || a, o[a] = b
                        }
                        return this
                    },
                    getAllResponseHeaders: function() {
                        return v === 2 ? q : null
                    },
                    getResponseHeader: function(a) {
                        var c;
                        if (v === 2) {
                            if (!r) {
                                r = {};
                                while (c = bT.exec(q)) r[c[1].toLowerCase()] = c[2]
                            }
                            c = r[a.toLowerCase()]
                        }
                        return c === b ? null : c
                    },
                    overrideMimeType: function(a) {
                        return v || (e.mimeType = a), this
                    },
                    abort: function(a) {
                        return a = a || "abort", s && s.abort(a), d(0, a), this
                    }
                };
            h.promise(y), y.success = y.done, y.error = y.fail, y.complete = i.add, y.statusCode = function(a) {
                if (a) {
                    var b;
                    if (v < 2)
                        for (b in a) l[b] = [l[b], a[b]];
                    else b = a[y.status], y.then(b, b)
                }
                return this
            }, e.url = ((a || e.url) + "").replace(bS, "").replace(bX, cg[1] + "//"), e.dataTypes = J.trim(e.dataType || "*").toLowerCase().split(b_), e.crossDomain == null && (u = cb.exec(e.url.toLowerCase()), e.crossDomain = !(!u || u[1] == cg[1] && u[2] == cg[2] && (u[3] || (u[1] === "http:" ? 80 : 443)) == (cg[3] || (cg[1] === "http:" ? 80 : 443)))), e.data && e.processData && typeof e.data != "string" && (e.data = J.param(e.data, e.traditional)), n(cd, e, c, y);
            if (v === 2) return !1;
            w = e.global, e.type = e.type.toUpperCase(), e.hasContent = !bW.test(e.type), w && J.active++ === 0 && J.event.trigger("ajaxStart");
            if (!e.hasContent) {
                e.data && (e.url += (bY.test(e.url) ? "&" : "?") + e.data, delete e.data), m = e.url;
                if (e.cache === !1) {
                    var z = J.now(),
                        A = e.url.replace(ca, "$1_=" + z);
                    e.url = A + (A === e.url ? (bY.test(e.url) ? "&" : "?") + "_=" + z : "")
                }
            }(e.data && e.hasContent && e.contentType !== !1 || c.contentType) && y.setRequestHeader("Content-Type", e.contentType), e.ifModified && (m = m || e.url, J.lastModified[m] && y.setRequestHeader("If-Modified-Since", J.lastModified[m]), J.etag[m] && y.setRequestHeader("If-None-Match", J.etag[m])), y.setRequestHeader("Accept", e.dataTypes[0] && e.accepts[e.dataTypes[0]] ? e.accepts[e.dataTypes[0]] + (e.dataTypes[0] !== "*" ? ", " + ch + "; q=0.01" : "") : e.accepts["*"]);
            for (x in e.headers) y.setRequestHeader(x, e.headers[x]);
            if (!e.beforeSend || e.beforeSend.call(f, y, e) !== !1 && v !== 2) {
                for (x in {
                        success: 1,
                        error: 1,
                        complete: 1
                    }) y[x](e[x]);
                s = n(ce, e, c, y);
                if (!s) d(-1, "No Transport");
                else {
                    y.readyState = 1, w && g.trigger("ajaxSend", [y, e]), e.async && e.timeout > 0 && (t = setTimeout(function() {
                        y.abort("timeout")
                    }, e.timeout));
                    try {
                        v = 1, s.send(o, d)
                    } catch (B) {
                        if (v < 2) d(-1, B);
                        else throw B
                    }
                }
                return y
            }
            return y.abort(), !1
        },
        param: function(a, c) {
            var d = [],
                e = function(a, b) {
                    b = J.isFunction(b) ? b() : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
                };
            c === b && (c = J.ajaxSettings.traditional);
            if (J.isArray(a) || a.jquery && !J.isPlainObject(a)) J.each(a, function() {
                e(this.name, this.value)
            });
            else
                for (var f in a) l(f, a[f], c, e);
            return d.join("&").replace(bP, "+")
        }
    }), J.extend({
        active: 0,
        lastModified: {},
        etag: {}
    });
    var cj = J.now(),
        ck = /(\=)\?(&|$)|\?\?/i;
    J.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            return J.expando + "_" + cj++
        }
    }), J.ajaxPrefilter("json jsonp", function(b, c, d) {
        var e = typeof b.data == "string" && /^application\/x\-www\-form\-urlencoded/.test(b.contentType);
        if (b.dataTypes[0] === "jsonp" || b.jsonp !== !1 && (ck.test(b.url) || e && ck.test(b.data))) {
            var f, g = b.jsonpCallback = J.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback,
                h = a[g],
                i = b.url,
                j = b.data,
                k = "$1" + g + "$2";
            return b.jsonp !== !1 && (i = i.replace(ck, k), b.url === i && (e && (j = j.replace(ck, k)), b.data === j && (i += (/\?/.test(i) ? "&" : "?") + b.jsonp + "=" + g))), b.url = i, b.data = j, a[g] = function(a) {
                f = [a]
            }, d.always(function() {
                a[g] = h, f && J.isFunction(h) && a[g](f[0])
            }), b.converters["script json"] = function() {
                return f || J.error(g + " was not called"), f[0]
            }, b.dataTypes[0] = "json", "script"
        }
    }), J.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /javascript|ecmascript/
        },
        converters: {
            "text script": function(a) {
                return J.globalEval(a), a
            }
        }
    }), J.ajaxPrefilter("script", function(a) {
        a.cache === b && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
    }), J.ajaxTransport("script", function(a) {
        if (a.crossDomain) {
            var c, d = G.head || G.getElementsByTagName("head")[0] || G.documentElement;
            return {
                send: function(e, f) {
                    c = G.createElement("script"), c.async = "async", a.scriptCharset && (c.charset = a.scriptCharset), c.src = a.url, c.onload = c.onreadystatechange = function(a, e) {
                        if (e || !c.readyState || /loaded|complete/.test(c.readyState)) c.onload = c.onreadystatechange = null, d && c.parentNode && d.removeChild(c), c = b, e || f(200, "success")
                    }, d.insertBefore(c, d.firstChild)
                },
                abort: function() {
                    c && c.onload(0, 1)
                }
            }
        }
    });
    var cl = a.ActiveXObject ? function() {
            for (var a in cn) cn[a](0, 1)
        } : !1,
        cm = 0,
        cn;
    J.ajaxSettings.xhr = a.ActiveXObject ? function() {
            return !this.isLocal && i() || h()
        } : i,
        function(a) {
            J.extend(J.support, {
                ajax: !!a,
                cors: !!a && "withCredentials" in a
            })
        }(J.ajaxSettings.xhr()), J.support.ajax && J.ajaxTransport(function(c) {
            if (!c.crossDomain || J.support.cors) {
                var d;
                return {
                    send: function(e, f) {
                        var g = c.xhr(),
                            h, i;
                        c.username ? g.open(c.type, c.url, c.async, c.username, c.password) : g.open(c.type, c.url, c.async);
                        if (c.xhrFields)
                            for (i in c.xhrFields) g[i] = c.xhrFields[i];
                        c.mimeType && g.overrideMimeType && g.overrideMimeType(c.mimeType), !c.crossDomain && !e["X-Requested-With"] && (e["X-Requested-With"] = "XMLHttpRequest");
                        try {
                            for (i in e) g.setRequestHeader(i, e[i])
                        } catch (j) {}
                        g.send(c.hasContent && c.data || null), d = function(a, e) {
                            var i, j, k, l, m;
                            try {
                                if (d && (e || g.readyState === 4)) {
                                    d = b, h && (g.onreadystatechange = J.noop, cl && delete cn[h]);
                                    if (e) g.readyState !== 4 && g.abort();
                                    else {
                                        i = g.status, k = g.getAllResponseHeaders(), l = {}, m = g.responseXML, m && m.documentElement && (l.xml = m);
                                        try {
                                            l.text = g.responseText
                                        } catch (a) {}
                                        try {
                                            j = g.statusText
                                        } catch (n) {
                                            j = ""
                                        }!i && c.isLocal && !c.crossDomain ? i = l.text ? 200 : 404 : i === 1223 && (i = 204)
                                    }
                                }
                            } catch (o) {
                                e || f(-1, o)
                            }
                            l && f(i, j, l, k)
                        }, !c.async || g.readyState === 4 ? d() : (h = ++cm, cl && (cn || (cn = {}, J(a).unload(cl)), cn[h] = d), g.onreadystatechange = d)
                    },
                    abort: function() {
                        d && d(0, 1)
                    }
                }
            }
        });
    var co = {},
        cp, cq, cr = /^(?:toggle|show|hide)$/,
        cs = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i,
        ct, cu = [
            ["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
            ["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
            ["opacity"]
        ],
        cv;
    J.fn.extend({
        show: function(a, b, c) {
            var f, g;
            if (a || a === 0) return this.animate(e("show", 3), a, b, c);
            for (var h = 0, i = this.length; h < i; h++) f = this[h], f.style && (g = f.style.display, !J._data(f, "olddisplay") && g === "none" && (g = f.style.display = ""), (g === "" && J.css(f, "display") === "none" || !J.contains(f.ownerDocument.documentElement, f)) && J._data(f, "olddisplay", d(f.nodeName)));
            for (h = 0; h < i; h++) {
                f = this[h];
                if (f.style) {
                    g = f.style.display;
                    if (g === "" || g === "none") f.style.display = J._data(f, "olddisplay") || ""
                }
            }
            return this
        },
        hide: function(a, b, c) {
            if (a || a === 0) return this.animate(e("hide", 3), a, b, c);
            var d, f, g = 0,
                h = this.length;
            for (; g < h; g++) d = this[g], d.style && (f = J.css(d, "display"), f !== "none" && !J._data(d, "olddisplay") && J._data(d, "olddisplay", f));
            for (g = 0; g < h; g++) this[g].style && (this[g].style.display = "none");
            return this
        },
        _toggle: J.fn.toggle,
        toggle: function(a, b, c) {
            var d = typeof a == "boolean";
            return J.isFunction(a) && J.isFunction(b) ? this._toggle.apply(this, arguments) : a == null || d ? this.each(function() {
                var b = d ? a : J(this).is(":hidden");
                J(this)[b ? "show" : "hide"]()
            }) : this.animate(e("toggle", 3), a, b, c), this
        },
        fadeTo: function(a, b, c, d) {
            return this.filter(":hidden").css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, e) {
            function f() {
                g.queue === !1 && J._mark(this);
                var b = J.extend({}, g),
                    c = this.nodeType === 1,
                    e = c && J(this).is(":hidden"),
                    f, h, i, j, k, l, m, n, o, p, q;
                b.animatedProperties = {};
                for (i in a) {
                    f = J.camelCase(i), i !== f && (a[f] = a[i], delete a[i]);
                    if ((k = J.cssHooks[f]) && "expand" in k) {
                        l = k.expand(a[f]), delete a[f];
                        for (i in l) i in a || (a[i] = l[i])
                    }
                }
                for (f in a) {
                    h = a[f], J.isArray(h) ? (b.animatedProperties[f] = h[1], h = a[f] = h[0]) : b.animatedProperties[f] = b.specialEasing && b.specialEasing[f] || b.easing || "swing";
                    if (h === "hide" && e || h === "show" && !e) return b.complete.call(this);
                    c && (f === "height" || f === "width") && (b.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY], J.css(this, "display") === "inline" && J.css(this, "float") === "none" && (!J.support.inlineBlockNeedsLayout || d(this.nodeName) === "inline" ? this.style.display = "inline-block" : this.style.zoom = 1))
                }
                b.overflow != null && (this.style.overflow = "hidden");
                for (i in a) j = new J.fx(this, b, i), h = a[i], cr.test(h) ? (q = J._data(this, "toggle" + i) || (h === "toggle" ? e ? "show" : "hide" : 0), q ? (J._data(this, "toggle" + i, q === "show" ? "hide" : "show"), j[q]()) : j[h]()) : (m = cs.exec(h), n = j.cur(), m ? (o = parseFloat(m[2]), p = m[3] || (J.cssNumber[i] ? "" : "px"), p !== "px" && (J.style(this, i, (o || 1) + p), n = (o || 1) / j.cur() * n, J.style(this, i, n + p)), m[1] && (o = (m[1] === "-=" ? -1 : 1) * o + n), j.custom(n, o, p)) : j.custom(n, h, ""));
                return !0
            }
            var g = J.speed(b, c, e);
            return J.isEmptyObject(a) ? this.each(g.complete, [!1]) : (a = J.extend({}, a), g.queue === !1 ? this.each(f) : this.queue(g.queue, f))
        },
        stop: function(a, c, d) {
            return typeof a != "string" && (d = c, c = a, a = b), c && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                function b(a, b, c) {
                    var e = b[c];
                    J.removeData(a, c, !0), e.stop(d)
                }
                var c, e = !1,
                    f = J.timers,
                    g = J._data(this);
                d || J._unmark(!0, this);
                if (a == null)
                    for (c in g) g[c] && g[c].stop && c.indexOf(".run") === c.length - 4 && b(this, g, c);
                else g[c = a + ".run"] && g[c].stop && b(this, g, c);
                for (c = f.length; c--;) f[c].elem === this && (a == null || f[c].queue === a) && (d ? f[c](!0) : f[c].saveState(), e = !0, f.splice(c, 1));
                (!d || !e) && J.dequeue(this, a)
            })
        }
    }), J.each({
        slideDown: e("show", 1),
        slideUp: e("hide", 1),
        slideToggle: e("toggle", 1),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        J.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), J.extend({
        speed: function(a, b, c) {
            var d = a && typeof a == "object" ? J.extend({}, a) : {
                complete: c || !c && b || J.isFunction(a) && a,
                duration: a,
                easing: c && b || b && !J.isFunction(b) && b
            };
            d.duration = J.fx.off ? 0 : typeof d.duration == "number" ? d.duration : d.duration in J.fx.speeds ? J.fx.speeds[d.duration] : J.fx.speeds._default;
            if (d.queue == null || d.queue === !0) d.queue = "fx";
            return d.old = d.complete, d.complete = function(a) {
                J.isFunction(d.old) && d.old.call(this), d.queue ? J.dequeue(this, d.queue) : a !== !1 && J._unmark(this)
            }, d
        },
        easing: {
            linear: function(a) {
                return a
            },
            swing: function(a) {
                return -Math.cos(a * Math.PI) / 2 + .5
            }
        },
        timers: [],
        fx: function(a, b, c) {
            this.options = b, this.elem = a, this.prop = c, b.orig = b.orig || {}
        }
    }), J.fx.prototype = {
        update: function() {
            this.options.step && this.options.step.call(this.elem, this.now, this), (J.fx.step[this.prop] || J.fx.step._default)(this)
        },
        cur: function() {
            if (this.elem[this.prop] == null || !!this.elem.style && this.elem.style[this.prop] != null) {
                var a, b = J.css(this.elem, this.prop);
                return isNaN(a = parseFloat(b)) ? !b || b === "auto" ? 0 : b : a
            }
            return this.elem[this.prop]
        },
        custom: function(a, c, d) {
            function e(a) {
                return f.step(a)
            }
            var f = this,
                h = J.fx;
            this.startTime = cv || g(), this.end = c, this.now = this.start = a, this.pos = this.state = 0, this.unit = d || this.unit || (J.cssNumber[this.prop] ? "" : "px"), e.queue = this.options.queue, e.elem = this.elem, e.saveState = function() {
                J._data(f.elem, "fxshow" + f.prop) === b && (f.options.hide ? J._data(f.elem, "fxshow" + f.prop, f.start) : f.options.show && J._data(f.elem, "fxshow" + f.prop, f.end))
            }, e() && J.timers.push(e) && !ct && (ct = setInterval(h.tick, h.interval))
        },
        show: function() {
            var a = J._data(this.elem, "fxshow" + this.prop);
            this.options.orig[this.prop] = a || J.style(this.elem, this.prop), this.options.show = !0, a !== b ? this.custom(this.cur(), a) : this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur()), J(this.elem).show()
        },
        hide: function() {
            this.options.orig[this.prop] = J._data(this.elem, "fxshow" + this.prop) || J.style(this.elem, this.prop), this.options.hide = !0, this.custom(this.cur(), 0)
        },
        step: function(a) {
            var b, c, d, e = cv || g(),
                f = !0,
                h = this.elem,
                i = this.options;
            if (a || e >= i.duration + this.startTime) {
                this.now = this.end, this.pos = this.state = 1, this.update(), i.animatedProperties[this.prop] = !0;
                for (b in i.animatedProperties) i.animatedProperties[b] !== !0 && (f = !1);
                if (f) {
                    i.overflow != null && !J.support.shrinkWrapBlocks && J.each(["", "X", "Y"], function(a, b) {
                        h.style["overflow" + b] = i.overflow[a]
                    }), i.hide && J(h).hide();
                    if (i.hide || i.show)
                        for (b in i.animatedProperties) J.style(h, b, i.orig[b]), J.removeData(h, "fxshow" + b, !0), J.removeData(h, "toggle" + b, !0);
                    d = i.complete, d && (i.complete = !1, d.call(h))
                }
                return !1
            }
            return i.duration == Infinity ? this.now = e : (c = e - this.startTime, this.state = c / i.duration, this.pos = J.easing[i.animatedProperties[this.prop]](this.state, c, 0, 1, i.duration), this.now = this.start + (this.end - this.start) * this.pos), this.update(), !0
        }
    }, J.extend(J.fx, {
        tick: function() {
            var a, b = J.timers,
                c = 0;
            for (; c < b.length; c++) a = b[c], !a() && b[c] === a && b.splice(c--, 1);
            b.length || J.fx.stop()
        },
        interval: 13,
        stop: function() {
            clearInterval(ct), ct = null
        },
        speeds: {
            slow: 600,
            fast: 200,
            _default: 400
        },
        step: {
            opacity: function(a) {
                J.style(a.elem, "opacity", a.now)
            },
            _default: function(a) {
                a.elem.style && a.elem.style[a.prop] != null ? a.elem.style[a.prop] = a.now + a.unit : a.elem[a.prop] = a.now
            }
        }
    }), J.each(cu.concat.apply([], cu), function(a, b) {
        b.indexOf("margin") && (J.fx.step[b] = function(a) {
            J.style(a.elem, b, Math.max(0, a.now) + a.unit)
        })
    }), J.expr && J.expr.filters && (J.expr.filters.animated = function(a) {
        return J.grep(J.timers, function(b) {
            return a === b.elem
        }).length
    });
    var cw, cx = /^t(?:able|d|h)$/i,
        cy = /^(?:body|html)$/i;
    "getBoundingClientRect" in G.documentElement ? cw = function(a, b, d, e) {
        try {
            e = a.getBoundingClientRect()
        } catch (f) {}
        if (!e || !J.contains(d, a)) return e ? {
            top: e.top,
            left: e.left
        } : {
            top: 0,
            left: 0
        };
        var g = b.body,
            h = c(b),
            i = d.clientTop || g.clientTop || 0,
            j = d.clientLeft || g.clientLeft || 0,
            k = h.pageYOffset || J.support.boxModel && d.scrollTop || g.scrollTop,
            l = h.pageXOffset || J.support.boxModel && d.scrollLeft || g.scrollLeft,
            m = e.top + k - i,
            n = e.left + l - j;
        return {
            top: m,
            left: n
        }
    } : cw = function(a, b, c) {
        var d, e = a.offsetParent,
            f = a,
            g = b.body,
            h = b.defaultView,
            i = h ? h.getComputedStyle(a, null) : a.currentStyle,
            j = a.offsetTop,
            k = a.offsetLeft;
        while ((a = a.parentNode) && a !== g && a !== c) {
            if (J.support.fixedPosition && i.position === "fixed") break;
            d = h ? h.getComputedStyle(a, null) : a.currentStyle, j -= a.scrollTop, k -= a.scrollLeft, a === e && (j += a.offsetTop, k += a.offsetLeft, J.support.doesNotAddBorder && (!J.support.doesAddBorderForTableAndCells || !cx.test(a.nodeName)) && (j += parseFloat(d.borderTopWidth) || 0, k += parseFloat(d.borderLeftWidth) || 0), f = e, e = a.offsetParent), J.support.subtractsBorderForOverflowNotVisible && d.overflow !== "visible" && (j += parseFloat(d.borderTopWidth) || 0, k += parseFloat(d.borderLeftWidth) || 0), i = d
        }
        if (i.position === "relative" || i.position === "static") j += g.offsetTop, k += g.offsetLeft;
        return J.support.fixedPosition && i.position === "fixed" && (j += Math.max(c.scrollTop, g.scrollTop), k += Math.max(c.scrollLeft, g.scrollLeft)), {
            top: j,
            left: k
        }
    }, J.fn.offset = function(a) {
        if (arguments.length) return a === b ? this : this.each(function(b) {
            J.offset.setOffset(this, a, b)
        });
        var c = this[0],
            d = c && c.ownerDocument;
        return d ? c === d.body ? J.offset.bodyOffset(c) : cw(c, d, d.documentElement) : null
    }, J.offset = {
        bodyOffset: function(a) {
            var b = a.offsetTop,
                c = a.offsetLeft;
            return J.support.doesNotIncludeMarginInBodyOffset && (b += parseFloat(J.css(a, "marginTop")) || 0, c += parseFloat(J.css(a, "marginLeft")) || 0), {
                top: b,
                left: c
            }
        },
        setOffset: function(a, b, c) {
            var d = J.css(a, "position");
            d === "static" && (a.style.position = "relative");
            var e = J(a),
                f = e.offset(),
                g = J.css(a, "top"),
                h = J.css(a, "left"),
                i = (d === "absolute" || d === "fixed") && J.inArray("auto", [g, h]) > -1,
                j = {},
                k = {},
                l, m;
            i ? (k = e.position(), l = k.top, m = k.left) : (l = parseFloat(g) || 0, m = parseFloat(h) || 0), J.isFunction(b) && (b = b.call(a, c, f)), b.top != null && (j.top = b.top - f.top + l), b.left != null && (j.left = b.left - f.left + m), "using" in b ? b.using.call(a, j) : e.css(j)
        }
    }, J.fn.extend({
        position: function() {
            if (!this[0]) return null;
            var a = this[0],
                b = this.offsetParent(),
                c = this.offset(),
                d = cy.test(b[0].nodeName) ? {
                    top: 0,
                    left: 0
                } : b.offset();
            return c.top -= parseFloat(J.css(a, "marginTop")) || 0, c.left -= parseFloat(J.css(a, "marginLeft")) || 0, d.top += parseFloat(J.css(b[0], "borderTopWidth")) || 0, d.left += parseFloat(J.css(b[0], "borderLeftWidth")) || 0, {
                top: c.top - d.top,
                left: c.left - d.left
            }
        },
        offsetParent: function() {
            return this.map(function() {
                var a = this.offsetParent || G.body;
                while (a && !cy.test(a.nodeName) && J.css(a, "position") === "static") a = a.offsetParent;
                return a
            })
        }
    }), J.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(a, d) {
        var e = /Y/.test(d);
        J.fn[a] = function(f) {
            return J.access(this, function(a, f, g) {
                var h = c(a);
                if (g === b) return h ? d in h ? h[d] : J.support.boxModel && h.document.documentElement[f] || h.document.body[f] : a[f];
                h ? h.scrollTo(e ? J(h).scrollLeft() : g, e ? g : J(h).scrollTop()) : a[f] = g
            }, a, f, arguments.length, null)
        }
    }), J.each({
        Height: "height",
        Width: "width"
    }, function(a, c) {
        var d = "client" + a,
            e = "scroll" + a,
            f = "offset" + a;
        J.fn["inner" + a] = function() {
            var a = this[0];
            return a ? a.style ? parseFloat(J.css(a, c, "padding")) : this[c]() : null
        }, J.fn["outer" + a] = function(a) {
            var b = this[0];
            return b ? b.style ? parseFloat(J.css(b, c, a ? "margin" : "border")) : this[c]() : null
        }, J.fn[c] = function(a) {
            return J.access(this, function(a, c, g) {
                var h, i, j, k;
                if (J.isWindow(a)) return h = a.document, i = h.documentElement[d], J.support.boxModel && i || h.body && h.body[d] || i;
                if (a.nodeType === 9) return h = a.documentElement, h[d] >= h[e] ? h[d] : Math.max(a.body[e], h[e], a.body[f], h[f]);
                if (g === b) return j = J.css(a, c), k = parseFloat(j), J.isNumeric(k) ? k : j;
                J(a).css(c, g)
            }, c, a, arguments.length, null)
        }
    }), a.jQuery = a.$ = J, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function() {
        return J
    })
})(window);
var Photon = {
    version: "0.0.3",
    degToRad: function(a) {
        return a * Math.PI / 180
    },
    radToDeg: function(a) {
        return a * 180 / Math.PI
    },
    getRotationVector: function(a, b) {
        var c = a.rotate(b.x, Line.create([0, 0, 0], [1, 0, 0])),
            d = c.rotate(b.y, Line.create([0, 0, 0], [0, 1, 0])),
            e = d.rotate(b.z, Line.create([0, 0, 0], [0, 0, 1]));
        return e
    },
    getTransformString: function() {
        if (Photon.transformString) return Photon.transformString;
        var a, b = ["transform", "webkitTransform", "MozTransform", "msTransform", "OTransform"],
            c = document.createElement("div");
        for (var d = 0; d < b.length; d++) c.style[b[d]] == "" && (a = b[d]);
        return Photon.transformString = a, a
    },
    buildMatrix: function(a) {
        var b = new FirminCSSMatrix(a);
        return b.m11 = b.m11 * 1e16, b.m12 = b.m12 * 1e16, b.m13 = b.m13 * 1e16, b.m14 = b.m14 * 1e16, b.m21 = b.m21 * 1e16, b.m22 = b.m22 * 1e16, b.m23 = b.m23 * 1e16, b.m24 = b.m24 * 1e16, b.m31 = b.m31 * 1e16, b.m32 = b.m32 * 1e16, b.m33 = b.m33 * 1e16, b.m34 = b.m34 * 1e16, b.m41 = b.m41 * 1e16, b.m42 = b.m42 * 1e16, b.m43 = b.m43 * 1e16, b.m44 = b.m44 * 1e16, b
    }
};
Photon.Light = function(a, b, c) {
    this.moveTo(a || 0, b || 0, c || 100), this.calculateVector()
}, Photon.Light.prototype = {
    moveTo: function(a, b, c) {
        this.x = a, this.y = b, this.z = c, this.calculateVector()
    },
    calculateVector: function() {
        this.magnitude = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z), this.vector = $V([this.x / this.magnitude, this.y / this.magnitude, this.z / this.magnitude])
    }
}, Photon.Face = function(a, b, c, d) {
    this.element = a, this.maxShade = b || .5, this.maxTint = c || 0, this.isBackfaced = d || !1, this.shaderElement = new Photon.ShaderElement(this.element), this.element.insertBefore(this.shaderElement, this.element.firstChild), this.transformString = Photon.getTransformString(), this.getRotations()
}, Photon.Face.prototype = {
    getRotations: function() {
        var a = window.getComputedStyle(this.element)[this.transformString] || "matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)";
        this.matrix = Photon.buildMatrix(a);
        var b = this.matrix.decompose();
        this.rotations = {
            x: b.rotate.x,
            y: b.rotate.y,
            z: b.rotate.z
        }, this.vector = Photon.getRotationVector($V([0, 0, 1]), this.rotations)
    },
    render: function(a, b, c) {
        b && this.getRotations();
        var d;
        c ? d = Photon.getRotationVector(this.vector, c) : d = this.vector, this.angleFrom = Photon.radToDeg(a.vector.angleFrom(d));
        var e, f = this.isBackfaced ? this.angleFrom / 180 : this.angleFrom / 90;
        this.isBackfaced && f > .5 && (f = 1 - f);
        var g = Math.abs(this.maxShade + this.maxTint),
            h = g * f;
        this.rangedPercentage = h, h <= this.maxTint ? e = "rgba(255, 255, 255, " + Math.abs(this.maxTint - h) + ")" : e = "rgba(0, 0, 0, " + Math.abs(h - this.maxTint) + ")", this.shaderElement.style.background = e
    },
    setMaxShade: function(a) {
        this.maxShade = a
    },
    setMaxTint: function(a) {
        this.maxTint = a
    }
}, Photon.ShaderElement = function(a) {
    var b = document.createElement("div");
    return b.className = "photon-shader", b.style.position = "absolute", b.style.top = "0", b.style.left = "0", b.style.width = window.getComputedStyle(a).width, b.style.height = window.getComputedStyle(a).height, b
}, Photon.FaceGroup = function(a, b, c, d, e) {
    this.element = a, this.faces = [], this.transformString = Photon.getTransformString();
    var f = b;
    for (var g = 0; g < f.length; g++) this.faces[g] = new Photon.Face(f[g], c, d, e)
}, Photon.FaceGroup.prototype = {
    getRotations: function() {
        var a = window.getComputedStyle(this.element)[this.transformString] || "matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)";
        this.matrix = Photon.buildMatrix(a);
        var b = this.matrix.decompose();
        this.rotations = {
            x: b.rotate.x,
            y: b.rotate.y,
            z: b.rotate.z
        }, this.vector = Photon.getRotationVector($V([0, 0, 1]), this.rotations)
    },
    render: function(a, b, c) {
        b && this.getRotations(), this.angleFrom = Photon.radToDeg(a.vector.angleFrom(this.vector));
        for (var d = 0, e = this.faces.length; d < e; d++) this.faces[d].render(a, c, this.rotations)
    },
    setMaxShade: function(a) {
        for (var b = 0; b < this.faces.length; b++) this.faces[b].setMaxShade(a)
    },
    setMaxTint: function(a) {
        for (var b = 0; b < this.faces.length; b++) this.faces[b].setMaxTint(a)
    }
};
var Sylvester = {
    version: "0.1.3",
    precision: 1e-6
};
Vector.prototype = {
    modulus: function() {
        return Math.sqrt(this.dot(this))
    },
    dup: function() {
        return Vector.create(this.elements)
    },
    each: function(a) {
        var b = this.elements.length,
            c = b,
            d;
        do d = c - b, a(this.elements[d], d + 1); while (--b)
    },
    angleFrom: function(a) {
        var b = a.elements || a,
            c = this.elements.length,
            d = c,
            e;
        if (c != b.length) return null;
        var f = 0,
            g = 0,
            h = 0;
        this.each(function(a, c) {
            f += a * b[c - 1], g += a * a, h += b[c - 1] * b[c - 1]
        }), g = Math.sqrt(g), h = Math.sqrt(h);
        if (g * h === 0) return null;
        var i = f / (g * h);
        return i < -1 && (i = -1), i > 1 && (i = 1), Math.acos(i)
    },
    dot: function(a) {
        var b = a.elements || a,
            c, d = 0,
            e = this.elements.length;
        if (e != b.length) return null;
        do d += this.elements[e - 1] * b[e - 1]; while (--e);
        return d
    },
    rotate: function(a, b) {
        var c, d, e, f, g;
        switch (this.elements.length) {
            case 2:
                c = b.elements || b;
                if (c.length != 2) return null;
                return d = Matrix.Rotation(a).elements, e = this.elements[0] - c[0], f = this.elements[1] - c[1], Vector.create([c[0] + d[0][0] * e + d[0][1] * f, c[1] + d[1][0] * e + d[1][1] * f]);
            case 3:
                if (!b.direction) return null;
                var h = b.pointClosestTo(this).elements;
                return d = Matrix.Rotation(a, b.direction).elements, e = this.elements[0] - h[0], f = this.elements[1] - h[1], g = this.elements[2] - h[2], Vector.create([h[0] + d[0][0] * e + d[0][1] * f + d[0][2] * g, h[1] + d[1][0] * e + d[1][1] * f + d[1][2] * g, h[2] + d[2][0] * e + d[2][1] * f + d[2][2] * g]);
            default:
                return null
        }
    },
    setElements: function(a) {
        return this.elements = (a.elements || a).slice(), this
    }
}, Vector.create = function(a) {
    var b = new Vector;
    return b.setElements(a)
};
var $V = Vector.create;
Line.prototype = {
    distanceFrom: function(a) {
        if (a.normal) return a.distanceFrom(this);
        if (a.direction) {
            if (this.isParallelTo(a)) return this.distanceFrom(a.anchor);
            var b = this.direction.cross(a.direction).toUnitVector().elements,
                c = this.anchor.elements,
                d = a.anchor.elements;
            return Math.abs((c[0] - d[0]) * b[0] + (c[1] - d[1]) * b[1] + (c[2] - d[2]) * b[2])
        }
        var e = a.elements || a,
            c = this.anchor.elements,
            f = this.direction.elements,
            g = e[0] - c[0],
            h = e[1] - c[1],
            i = (e[2] || 0) - c[2],
            j = Math.sqrt(g * g + h * h + i * i);
        if (j === 0) return 0;
        var k = (g * f[0] + h * f[1] + i * f[2]) / j,
            l = 1 - k * k;
        return Math.abs(j * Math.sqrt(l < 0 ? 0 : l))
    },
    contains: function(a) {
        var b = this.distanceFrom(a);
        return b !== null && b <= Sylvester.precision
    },
    pointClosestTo: function(a) {
        if (a.direction) {
            if (this.intersects(a)) return this.intersectionWith(a);
            if (this.isParallelTo(a)) return null;
            var b = this.direction.elements,
                c = a.direction.elements,
                d = b[0],
                e = b[1],
                f = b[2],
                g = c[0],
                h = c[1],
                i = c[2],
                j = f * g - d * i,
                k = d * h - e * g,
                l = e * i - f * h,
                m = Vector.create([j * i - k * h, k * g - l * i, l * h - j * g]),
                n = Plane.create(a.anchor, m);
            return n.intersectionWith(this)
        }
        var n = a.elements || a;
        if (this.contains(n)) return Vector.create(n);
        var o = this.anchor.elements,
            b = this.direction.elements,
            d = b[0],
            e = b[1],
            f = b[2],
            p = o[0],
            q = o[1],
            r = o[2],
            j = d * (n[1] - q) - e * (n[0] - p),
            k = e * ((n[2] || 0) - r) - f * (n[1] - q),
            l = f * (n[0] - p) - d * ((n[2] || 0) - r),
            s = Vector.create([e * j - f * l, f * k - d * j, d * l - e * k]),
            t = this.distanceFrom(n) / s.modulus();
        return Vector.create([n[0] + s.elements[0] * t, n[1] + s.elements[1] * t, (n[2] || 0) + s.elements[2] * t])
    },
    rotate: function(a, b) {
        typeof b.direction == "undefined" && (b = Line.create(b.to3D(), Vector.k));
        var c = Matrix.Rotation(a, b.direction).elements,
            d = b.pointClosestTo(this.anchor).elements,
            e = this.anchor.elements,
            f = this.direction.elements,
            g = d[0],
            h = d[1],
            i = d[2],
            j = e[0],
            k = e[1],
            l = e[2],
            m = j - g,
            n = k - h,
            o = l - i;
        return Line.create([g + c[0][0] * m + c[0][1] * n + c[0][2] * o, h + c[1][0] * m + c[1][1] * n + c[1][2] * o, i + c[2][0] * m + c[2][1] * n + c[2][2] * o], [c[0][0] * f[0] + c[0][1] * f[1] + c[0][2] * f[2], c[1][0] * f[0] + c[1][1] * f[1] + c[1][2] * f[2], c[2][0] * f[0] + c[2][1] * f[1] + c[2][2] * f[2]])
    },
    setVectors: function(a, b) {
        a = Vector.create(a), b = Vector.create(b), a.elements.length == 2 && a.elements.push(0), b.elements.length == 2 && b.elements.push(0);
        if (a.elements.length > 3 || b.elements.length > 3) return null;
        var c = b.modulus();
        return c === 0 ? null : (this.anchor = a, this.direction = Vector.create([b.elements[0] / c, b.elements[1] / c, b.elements[2] / c]), this)
    }
}, Line.create = function(a, b) {
    var c = new Line;
    return c.setVectors(a, b)
}, Matrix.prototype = {
    setElements: function(a) {
        var b, c = a.elements || a;
        if (typeof c[0][0] != "undefined") {
            var d = c.length,
                e = d,
                f, g, h;
            this.elements = [];
            do {
                b = e - d, f = c[b].length, g = f, this.elements[b] = [];
                do h = g - f, this.elements[b][h] = c[b][h]; while (--f)
            } while (--d);
            return this
        }
        var i = c.length,
            j = i;
        this.elements = [];
        do b = j - i, this.elements.push([c[b]]); while (--i);
        return this
    }
}, Matrix.create = function(a) {
    var b = new Matrix;
    return b.setElements(a)
}, Matrix.Rotation = function(a, b) {
    if (!b) return Matrix.create([
        [Math.cos(a), -Math.sin(a)],
        [Math.sin(a), Math.cos(a)]
    ]);
    var c = b.dup();
    if (c.elements.length != 3) return null;
    var d = c.modulus(),
        e = c.elements[0] / d,
        f = c.elements[1] / d,
        g = c.elements[2] / d,
        h = Math.sin(a),
        i = Math.cos(a),
        j = 1 - i;
    return Matrix.create([
        [j * e * e + i, j * e * f - h * g, j * e * g + h * f],
        [j * e * f + h * g, j * f * f + i, j * f * g - h * e],
        [j * e * g - h * f, j * f * g + h * e, j * g * g + i]
    ])
}, FirminCSSMatrix = function(a) {
    this.m11 = this.m22 = this.m33 = this.m44 = 1, this.m12 = this.m13 = this.m14 = this.m21 = this.m23 = this.m24 = this.m31 = this.m32 = this.m34 = this.m41 = this.m42 = this.m43 = 0, typeof a == "string" && this.setMatrixValue(a)
}, FirminCSSMatrix.displayName = "FirminCSSMatrix", FirminCSSMatrix.degreesToRadians = function(a) {
    return a * Math.PI / 180
}, FirminCSSMatrix.prototype.isAffine = function() {
    return this.m13 === 0 && this.m14 === 0 && this.m23 === 0 && this.m24 === 0 && this.m31 === 0 && this.m32 === 0 && this.m33 === 1 && this.m34 === 0 && this.m43 === 0 && this.m44 === 1
}, FirminCSSMatrix.prototype.setMatrixValue = function(a) {
    a = a.trim();
    var b = a.match(/^matrix(3d)?\(\s*(.+)\s*\)$/),
        c, d, e, f, g, h;
    if (!b) return;
    c = !!b[1], d = b[2].split(/\s*,\s*/), e = d.length, f = new Array(e);
    if (c && e !== 16 || !c && e !== 6) return;
    for (g = 0; g < e; g++) {
        h = d[g];
        if (h.match(/^-?\d+(\.\d+)?$/)) f[g] = parseFloat(h);
        else return
    }
    for (g = 0; g < e; g++) point = c ? "m" + (Math.floor(g / 4) + 1) + (g % 4 + 1) : String.fromCharCode(g + 97), this[point] = f[g]
}, FirminCSSMatrix.prototype.toString = function() {
    var a = this,
        b, c;
    return this.isAffine() ? (c = "matrix(", b = ["a", "b", "c", "d", "e", "f"]) : (c = "matrix3d(", b = ["m11", "m12", "m13", "m14", "m21", "m22", "m23", "m24", "m31", "m32", "m33", "m34", "m41", "m42", "m43", "m44"]), c + b.map(function(b) {
        return 0
    }).join(", ") + ")"
};
var CSSMatrixDecomposed = function(a) {
        a === undefined ? a = {} : null;
        var b = {
            perspective: null,
            translate: null,
            skew: null,
            scale: null,
            rotate: null
        };
        for (var c in b) this[c] = a[c] ? a[c] : new Vector4;
        this.tween = function(a, c, d) {
            d === undefined && (d = function(a) {
                return a
            }), a || (a = new CSSMatrixDecomposed((new FirminCSSMatrix).decompose()));
            var e = new CSSMatrixDecomposed,
                f = index = null,
                g = "";
            c = d(c);
            for (index in b)
                for (f in {
                        x: "x",
                        y: "y",
                        z: "z",
                        w: "w"
                    }) e[index][f] = (this[index][f] + (a[index][f] - this[index][f]) * c).toFixed(5);
            g = "matrix3d(1,0,0,0, 0,1,0,0, 0,0,1,0, " + e.perspective.x + ", " + e.perspective.y + ", " + e.perspective.z + ", " + e.perspective.w + ") translate3d(" + e.translate.x + "px, " + e.translate.y + "px, " + e.translate.y + "px) rotateX(" + e.rotate.x + "rad) rotateY(" + e.rotate.y + "rad) rotateZ(" + e.rotate.z + "rad) matrix3d(1,0,0,0, 0,1,0,0, 0," + e.skew.z + ",1,0, 0,0,0,1) matrix3d(1,0,0,0, 0,1,0,0, " + e.skew.y + ",0,1,0, 0,0,0,1) matrix3d(1,0,0,0, " + e.skew.x + ",1,0,0, 0,0,1,0, 0,0,0,1) scale3d(" + e.scale.x + ", " + e.scale.y + ", " + e.scale.z + ")";
            try {
                return e = new FirminCSSMatrix(g), e
            } catch (h) {
                return console.error("Invalid matrix string: " + g), ""
            }
        }
    },
    Vector4 = function(a, b, c, d) {
        this.x = a ? a : 0, this.y = b ? b : 0, this.z = c ? c : 0, this.w = d ? d : 0, this.checkValues = function() {
            this.x = this.x ? this.x : 0, this.y = this.y ? this.y : 0, this.z = this.z ? this.z : 0, this.w = this.w ? this.w : 0
        }, this.length = function() {
            return this.checkValues(), Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
        }, this.normalise = function() {
            var a = this.length(),
                b = new Vector4(this.x / a, this.y / a, this.z / a);
            return b
        }, this.dot = function(a) {
            return this.x * a.x + this.y * a.y + this.z * a.z + this.w * a.w
        }, this.cross = function(a) {
            return new Vector4(this.y * a.z - this.z * a.y, this.z * a.x - this.x * a.z, this.x * a.y - this.y * a.x)
        }, this.combine = function(a, b, c) {
            return new Vector4(b * this.x + c * a.x, b * this.y + c * a.y, b * this.z + c * a.z)
        }
    };
FirminCSSMatrix.prototype.determinant = function() {
    return this.m14 * this.m23 * this.m32 * this.m41 - this.m13 * this.m24 * this.m32 * this.m41 - this.m14 * this.m22 * this.m33 * this.m41 + this.m12 * this.m24 * this.m33 * this.m41 + this.m13 * this.m22 * this.m34 * this.m41 - this.m12 * this.m23 * this.m34 * this.m41 - this.m14 * this.m23 * this.m31 * this.m42 + this.m13 * this.m24 * this.m31 * this.m42 + this.m14 * this.m21 * this.m33 * this.m42 - this.m11 * this.m24 * this.m33 * this.m42 - this.m13 * this.m21 * this.m34 * this.m42 + this.m11 * this.m23 * this.m34 * this.m42 + this.m14 * this.m22 * this.m31 * this.m43 - this.m12 * this.m24 * this.m31 * this.m43 - this.m14 * this.m21 * this.m32 * this.m43 + this.m11 * this.m24 * this.m32 * this.m43 + this.m12 * this.m21 * this.m34 * this.m43 - this.m11 * this.m22 * this.m34 * this.m43 - this.m13 * this.m22 * this.m31 * this.m44 + this.m12 * this.m23 * this.m31 * this.m44 + this.m13 * this.m21 * this.m32 * this.m44 - this.m11 * this.m23 * this.m32 * this.m44 - this.m12 * this.m21 * this.m33 * this.m44 + this.m11 * this.m22 * this.m33 * this.m44
}, FirminCSSMatrix.prototype.decompose = function() {
    var a = new FirminCSSMatrix(this.toString()),
        b = rightHandSide = inversePerspectiveMatrix = transposedInversePerspectiveMatrix = perspective = translate = row = i = scale = skew = pdum3 = rotate = null;
    if (a.m33 == 0) return new CSSMatrixDecomposed((new FirminCSSMatrix).decompose());
    for (i = 1; i <= 4; i++)
        for (j = 1; j <= 4; j++) a["m" + i + j] /= a.m44;
    b = a;
    for (i = 1; i <= 3; i++) b["m" + i + "4"] = 0;
    b.m44 = 1;
    if (b.determinant() == 0) return new CSSMatrixDecomposed((new FirminCSSMatrix).decompose());
    a.m14 != 0 || a.m24 != 0 || a.m34 != 0 ? (rightHandSide = new Vector4(a.m14, a.m24, a.m34, a.m44), inversePerspectiveMatrix = b.inverse(), transposedInversePerspectiveMatrix = inversePerspectiveMatrix.transpose(), perspective = transposedInversePerspectiveMatrix.transformVector(rightHandSide), a.m14 = a.m24 = a.m34 = 0, a.m44 = 1) : perspective = new Vector4(0, 0, 0, 1), translate = new Vector4(a.m41, a.m42, a.m43), a.m41 = 0, a.m42 = 0, a.m43 = 0, row = [new Vector4, new Vector4, new Vector4];
    for (i = 1; i <= 3; i++) row[i - 1].x = a["m" + i + "1"], row[i - 1].y = a["m" + i + "2"], row[i - 1].z = a["m" + i + "3"];
    scale = new Vector4, skew = new Vector4, scale.x = row[0].length(), row[0] = row[0].normalise(), skew.x = row[0].dot(row[1]), row[1] = row[1].combine(row[0], 1, -skew.x), scale.y = row[1].length(), row[1] = row[1].normalise(), skew.x /= scale.y, skew.y = row[0].dot(row[2]), row[2] = row[2].combine(row[0], 1, -skew.y), skew.z = row[1].dot(row[2]), row[2] = row[2].combine(row[1], 1, -skew.z), scale.z = row[2].length(), row[2] = row[2].normalise(), skew.y /= scale.z, skew.y /= scale.z, pdum3 = row[1].cross(row[2]);
    if (row[0].dot(pdum3) < 0)
        for (i = 0; i < 3; i++) scale.x *= -1, row[i].x *= -1, row[i].y *= -1, row[i].z *= -1;
    return rotate = new Vector4, rotate.y = Math.asin(-row[0].z), Math.cos(rotate.y) != 0 ? (rotate.x = Math.atan2(row[1].z, row[2].z), rotate.z = Math.atan2(row[0].y, row[0].x)) : (rotate.x = Math.atan2(-row[2].x, row[1].y), rotate.z = 0), new CSSMatrixDecomposed({
        perspective: perspective,
        translate: translate,
        skew: skew,
        scale: scale,
        rotate: rotate
    })
};
var Chess = function(a) {
    function N() {
        E = new Array(128), F = {
            w: d,
            b: d
        }, G = c, H = {
            w: "",
            b: ""
        }, I = d, J = 0, K = 1, L = [], M = {}, T(R())
    }

    function O() {
        P(l)
    }

    function P(a) {
        var e = a.split(/\s+/),
            f = e[0],
            g = 0,
            h = k + "12345678/";
        if (!Q(a).valid) return !1;
        N();
        for (var i = 0; i < f.length; i++) {
            var j = f.charAt(i);
            if (j == "/") g += 8;
            else if (bn(j)) g += parseInt(j, 10);
            else {
                var l = j < "a" ? c : b;
                V({
                    type: j.toLowerCase(),
                    color: l
                }, bl(g)), g++
            }
        }
        return G = e[1], e[2].indexOf("K") > -1 && (H.w |= t.KSIDE_CASTLE), e[2].indexOf("Q") > -1 && (H.w |= t.QSIDE_CASTLE), e[2].indexOf("k") > -1 && (H.b |= t.KSIDE_CASTLE), e[2].indexOf("q") > -1 && (H.b |= t.QSIDE_CASTLE), I = e[3] == "-" ? d : C[e[3]], J = parseInt(e[4], 10), K = parseInt(e[5], 10), T(R()), !0
    }

    function Q(a) {
        var b = {
                0: "No errors.",
                1: "FEN string must contain six space-delimited fields.",
                2: "6th field (move number) must be a positive integer.",
                3: "5th field (half move counter) must be a non-negative integer.",
                4: "4th field (en-passant square) is invalid.",
                5: "3rd field (castling availability) is invalid.",
                6: "2nd field (side to move) is invalid.",
                7: "1st field (piece positions) does not contain 8 '/'-delimited rows.",
                8: "1st field (piece positions) is invalid [consecutive numbers].",
                9: "1st field (piece positions) is invalid [invalid piece].",
                10: "1st field (piece positions) is invalid [row too large]."
            },
            c = a.split(/\s+/);
        if (c.length != 6) return {
            valid: !1,
            error_number: 1,
            error: b[1]
        };
        if (isNaN(c[5]) || parseInt(c[5], 10) <= 0) return {
            valid: !1,
            error_number: 2,
            error: b[2]
        };
        if (isNaN(c[4]) || parseInt(c[4], 10) < 0) return {
            valid: !1,
            error_number: 3,
            error: b[3]
        };
        if (!/^(-|[abcdefgh][36])$/.test(c[3])) return {
            valid: !1,
            error_number: 4,
            error: b[4]
        };
        if (!/^(KQ?k?q?|Qk?q?|kq?|q|-)$/.test(c[2])) return {
            valid: !1,
            error_number: 5,
            error: b[5]
        };
        if (!/^(w|b)$/.test(c[1])) return {
            valid: !1,
            error_number: 6,
            error: b[6]
        };
        var d = c[0].split("/");
        if (d.length != 8) return {
            valid: !1,
            error_number: 7,
            error: b[7]
        };
        for (var e = 0; e < d.length; e++) {
            var f = 0,
                g = !1;
            for (var h = 0; h < d[e].length; h++)
                if (!isNaN(d[e][h])) {
                    if (g) return {
                        valid: !1,
                        error_number: 8,
                        error: b[8]
                    };
                    f += parseInt(d[e][h]), g = !0
                } else {
                    if (!/^[prnbqkPRNBQK]$/.test(d[e][h])) return {
                        valid: !1,
                        error_number: 9,
                        error: b[9]
                    };
                    f += 1, g = !1
                }
            if (f != 8) return {
                valid: !1,
                error_number: 10,
                error: b[10]
            }
        }
        return {
            valid: !0,
            error_number: 0,
            error: b[0]
        }
    }

    function R() {
        var a = 0,
            e = "";
        for (var f = C.a8; f <= C.h1; f++) {
            if (E[f] == null) a++;
            else {
                a > 0 && (e += a, a = 0);
                var g = E[f].color,
                    h = E[f].type;
                e += g == c ? h.toUpperCase() : h.toLowerCase()
            }
            f + 1 & 136 && (a > 0 && (e += a), f != C.h1 && (e += "/"), a = 0, f += 8)
        }
        var i = "";
        H[c] & t.KSIDE_CASTLE && (i += "K"), H[c] & t.QSIDE_CASTLE && (i += "Q"), H[b] & t.KSIDE_CASTLE && (i += "k"), H[b] & t.QSIDE_CASTLE && (i += "q"), i = i || "-";
        var j = I == d ? "-" : bl(I);
        return [e, G, i, j, J, K].join(" ")
    }

    function S(a) {
        for (var b = 0; b < a.length; b += 2) typeof a[b] == "string" && typeof a[b + 1] == "string" && (M[a[b]] = a[b + 1]);
        return M
    }

    function T(a) {
        if (L.length > 0) return;
        a != l ? (M.SetUp = a, M.FEN = "1") : (delete M.SetUp, delete M.FEN)
    }

    function U(a) {
        var b = E[C[a]];
        return b ? {
            type: b.type,
            color: b.color
        } : null
    }

    function V(a, b) {
        if ("type" in a && "color" in a) {
            if (k.indexOf(a.type.toLowerCase()) == -1) return !1;
            if (b in C) {
                var c = C[b];
                return E[c] = {
                    type: a.type,
                    color: a.color
                }, a.type == j && (F[a.color] = c), T(R()), !0
            }
            return !1
        }
        return !1
    }

    function W(a) {
        var b = U(a);
        return E[C[a]] = null, b && b.type == j && (F[b.color] = d), T(R()), b
    }

    function X(a) {
        function b(a, b, c, d, j) {
            if (a[c].type != e || bj(d) != B && bj(d) != u) {
                var o = {
                    color: G,
                    from: c,
                    to: d,
                    flags: j,
                    piece: a[c].type
                };
                a[d] && (o.captured = a[d].type), b.push(o)
            } else {
                var k = [i, h, g, f];
                for (var l = 0, m = k.length; l < m; l++) {
                    var n = {
                        color: G,
                        from: c,
                        to: d,
                        flags: j | t.PROMOTION,
                        promotion: k[l],
                        piece: a[c].type
                    };
                    a[d] && (n.captured = a[d].type), b.push(n)
                }
            }
        }
        var c = [],
            d = G,
            j = bm(d),
            k = {
                b: A,
                w: v
            },
            l = {};
        typeof a != "undefined" && typeof a.target != "undefined" ? l[a.target] = C[a.target] : (l = C, a = {}, a.target = "");
        for (var m in l) {
            var p = l[m];
            if (p & 136) {
                p += 7;
                continue
            }
            var q = E[p];
            if (q == null || q.color != d) continue;
            if (q.type == e) {
                var r = p + n[d][0];
                if (E[r] == null) {
                    b(E, c, p, r, t.NORMAL);
                    var r = p + n[d][1];
                    k[d] == bj(p) && E[r] == null && b(E, c, p, r, t.BIG_PAWN)
                }
                for (m = 2; m < 4; m++) {
                    var r = p + n[d][m];
                    if (r & 136) continue;
                    E[r] != null && E[r].color == j ? b(E, c, p, r, t.CAPTURE) : r == I && b(E, c, p, I, t.EP_CAPTURE)
                }
            } else
                for (var m = 0, s = o[q.type].length; m < s; m++) {
                    var w = o[q.type][m],
                        r = p;
                    for (;;) {
                        r += w;
                        if (r & 136) break;
                        if (E[r] == null) b(E, c, p, r, t.NORMAL);
                        else {
                            if (E[r].color == d) break;
                            b(E, c, p, r, t.CAPTURE);
                            break
                        }
                        if (q.type == "n" || q.type == "k") break
                    }
                }
        }
        if (H[d] & t.KSIDE_CASTLE && a.target === "" || F[d] === l[a.target]) {
            var x = F[d],
                y = x + 2;
            E[x + 1] == null && E[y] == null && !Z(j, F[d]) && !Z(j, x + 1) && !Z(j, y) && b(E, c, F[d], y, t.KSIDE_CASTLE)
        }
        if (H[d] & t.QSIDE_CASTLE && a.target === "" || F[d] === l[a.target]) {
            var x = F[d],
                y = x - 2;
            E[x - 1] == null && E[x - 2] == null && E[x - 3] == null && !Z(j, F[d]) && !Z(j, x - 1) && !Z(j, y) && b(E, c, F[d], y, t.QSIDE_CASTLE)
        }
        typeof a == "undefined" && (a = {
            legal: !0
        });
        if (a.legal != null && a.legal == 0) return c;
        var z = [];
        for (var p = 0, s = c.length; p < s; p++) bf(c[p]), $(d) || z.push(c[p]), bg();
        return z
    }

    function Y(a) {
        var b = "";
        if (a.flags & t.KSIDE_CASTLE) b = "O-O";
        else if (a.flags & t.QSIDE_CASTLE) b = "O-O-O";
        else {
            var c = bh(a);
            a.piece != e && (b += a.piece.toUpperCase() + c), a.flags & (t.CAPTURE | t.EP_CAPTURE) && (a.piece == e && (b += bl(a.from)[0]), b += "x"), b += bl(a.to), a.flags & t.PROMOTION && (b += "=" + a.promotion.toUpperCase())
        }
        return bf(a), _() && (ba() ? b += "#" : b += "+"), bg(), b
    }

    function Z(a, d) {
        for (var f = C.a8; f <= C.h1; f++) {
            if (f & 136) {
                f += 7;
                continue
            }
            if (E[f] == null || E[f].color != a) continue;
            var g = E[f],
                h = f - d,
                i = h + 119;
            if (p[i] & 1 << r[g.type]) {
                if (g.type == e) {
                    if (h > 0) {
                        if (g.color == c) return !0
                    } else if (g.color == b) return !0;
                    continue
                }
                if (g.type == "n" || g.type == "k") return !0;
                var j = q[i],
                    k = f + j,
                    l = !1;
                while (k != d) {
                    if (E[k] != null) {
                        l = !0;
                        break
                    }
                    k += j
                }
                if (!l) return !0
            }
        }
        return !1
    }

    function $(a) {
        return Z(bm(a), F[a])
    }

    function _() {
        return $(G)
    }

    function ba() {
				var test = _() && X().length == 0;
        return test;
    }

    function bb() {
        return !_() && X().length == 0
    }

    function bc() {
        var a = {},
            b = 0;
        for (var c = C.a8; c <= C.h1; c++) {
            if (c & 136) {
                c += 7;
                continue
            }
            var d = E[c];
            d && (a[d.type] = d.type in a ? a[d.type] + 1 : 1, b++)
        }
        return b == 2 ? !0 : b != 3 || a[g] != 1 && a[f] != 1 ? !1 : !0
    }

    function bd() {
        var a = [],
            b = {},
            c = !1;
        for (;;) {
            var d = bg();
            if (!d) break;
            a.push(d)
        }
        for (;;) {
            var e = R().split(" ").slice(0, 4).join(" ");
            b[e] = e in b ? b[e] + 1 : 1, b[e] >= 3 && (c = !0);
            if (!a.length) break;
            bf(a.pop())
        }
        return c
    }

    function be(a) {
        L.push({
            move: a,
            kings: {
                b: F.b,
                w: F.w
            },
            turn: G,
            castling: {
                b: H.b,
                w: H.w
            },
            ep_square: I,
            half_moves: J,
            move_number: K
        })
    }

    function bf(a) {
        var c = G,
            f = bm(c);
        be(a), E[a.to] = E[a.from], E[a.from] = null, a.flags & t.EP_CAPTURE && (G == b ? E[a.to - 16] = null : E[a.to + 16] = null), a.flags & t.PROMOTION && (E[a.to] = {
            type: a.promotion,
            color: c
        });
        if (E[a.to].type == j) {
            F[E[a.to].color] = a.to;
            if (a.flags & t.KSIDE_CASTLE) {
                var g = a.to - 1,
                    h = a.to + 1;
                E[g] = E[h], E[h] = null
            } else if (a.flags & t.QSIDE_CASTLE) {
                var g = a.to + 1,
                    h = a.to - 2;
                E[g] = E[h], E[h] = null
            }
            H[G] = ""
        }
        if (H[G] != "")
            for (var i = 0, k = D[G].length; i < k; i++)
                if (a.from == D[G][i].square) {
                    H[G] = H[G] ^= D[G][i].flag;
                    break
                }
        if (H[f] != "")
            for (var i = 0, k = D[f].length; i < k; i++)
                if (a.to == D[f][i].square) {
                    H[f] = H[f] ^= D[f][i].flag;
                    break
                }
        a.flags & t.BIG_PAWN ? G == "b" ? I = a.to - 16 : I = a.to + 16 : I = d, a.piece == e ? J = 0 : a.flags & (t.CAPTURE | t.EP_CAPTURE) ? J = 0 : J++, G == b && K++, G = bm(G)
    }

    function bg() {
        var a = L.pop();
        if (a == null) return null;
        var c = a.move;
        F = a.kings, G = a.turn, H = a.castling, I = a.ep_square, J = a.half_moves, K = a.move_number;
        var d = G,
            f = bm(G);
        E[c.from] = E[c.to], E[c.from].type = c.piece, E[c.to] = null;
        if (c.flags & t.CAPTURE) E[c.to] = {
            type: c.captured,
            color: f
        };
        else if (c.flags & t.EP_CAPTURE) {
            var g;
            d == b ? g = c.to - 16 : g = c.to + 16, E[g] = {
                type: e,
                color: f
            }
        }
        if (c.flags & (t.KSIDE_CASTLE | t.QSIDE_CASTLE)) {
            var h, i;
            c.flags & t.KSIDE_CASTLE ? (h = c.to + 1, i = c.to - 1) : c.flags & t.QSIDE_CASTLE && (h = c.to - 2, i = c.to + 1), E[h] = E[i], E[i] = null
        }
        return c
    }

    function bh(a) {
        var b = X(),
            c = a.from,
            d = a.to,
            e = a.piece,
            f = 0,
            g = 0,
            h = 0;
        for (var i = 0, j = b.length; i < j; i++) {
            var k = b[i].from,
                l = b[i].to,
                m = b[i].piece;
            e == m && c != k && d == l && (f++, bj(c) == bj(k) && g++, bk(c) == bk(k) && h++)
        }
        return f > 0 ? g > 0 && h > 0 ? bl(c) : h > 0 ? bl(c).charAt(1) : bl(c).charAt(0) : ""
    }

    function bi() {
        var a = "   +------------------------+\n";
        for (var b = C.a8; b <= C.h1; b++) {
            bk(b) == 0 && (a += " " + "87654321" [bj(b)] + " |");
            if (E[b] == null) a += " . ";
            else {
                var d = E[b].type,
                    e = E[b].color,
                    f = e == c ? d.toUpperCase() : d.toLowerCase();
                a += " " + f + " "
            }
            b + 1 & 136 && (a += "|\n", b += 8)
        }
        return a += "   +------------------------+\n", a += "     a  b  c  d  e  f  g  h\n", a
    }

    function bj(a) {
        return a >> 4
    }

    function bk(a) {
        return a & 15
    }

    function bl(a) {
        var b = bk(a),
            c = bj(a);
        return "abcdefgh".substring(b, b + 1) + "87654321".substring(c, c + 1)
    }

    function bm(a) {
        return a == c ? b : c
    }

    function bn(a) {
        return "0123456789".indexOf(a) != -1
    }

    function bo(a) {
        var b = bp(a);
        b.san = Y(b), b.to = bl(b.to), b.from = bl(b.from);
        var c = "";
        for (var d in t) t[d] & b.flags && (c += s[d]);
        return b.flags = c, b
    }

    function bp(a) {
        var b = a instanceof Array ? [] : {};
        for (var c in a) typeof c == "object" ? b[c] = bp(a[c]) : b[c] = a[c];
        return b
    }

    function bq(a) {
        return a.replace(/^\s+|\s+$/g, "")
    }

    function br(a) {
        var b = X({
                legal: !1
            }),
            c = 0,
            d = G;
        for (var e = 0, f = b.length; e < f; e++) {
            bf(b[e]);
            if (!$(d))
                if (a - 1 > 0) {
                    var g = br(a - 1);
                    c += g
                } else c++;
            bg()
        }
        return c
    }
    var b = "b",
        c = "w",
        d = -1,
        e = "p",
        f = "n",
        g = "b",
        h = "r",
        i = "q",
        j = "k",
        k = "pnbrqkPNBRQK",
        l = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        m = ["1-0", "0-1", "1/2-1/2", "*"],
        n = {
            b: [16, 32, 17, 15],
            w: [-16, -32, -17, -15]
        },
        o = {
            n: [-18, -33, -31, -14, 18, 33, 31, 14],
            b: [-17, -15, 17, 15],
            r: [-16, 1, 16, -1],
            q: [-17, -16, -15, 1, 17, 16, 15, -1],
            k: [-17, -16, -15, 1, 17, 16, 15, -1]
        },
        p = [20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20, 0, 0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0, 24, 24, 24, 24, 24, 24, 56, 0, 56, 24, 24, 24, 24, 24, 24, 0, 0, 0, 0, 0, 0, 2, 53, 56, 53, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 2, 24, 2, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 24, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 24, 0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 20, 0, 0, 0, 0, 24, 0, 0, 0, 0, 20, 0, 0, 0, 0, 20, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 20, 0, 0, 20, 0, 0, 0, 0, 0, 0, 24, 0, 0, 0, 0, 0, 0, 20],
        q = [17, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 15, 0, 0, 17, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 15, 0, 0, 0, 0, 17, 0, 0, 0, 0, 16, 0, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 17, 0, 0, 0, 16, 0, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 0, 16, 0, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 0, 16, 0, 15, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 17, 16, 15, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, -1, -1, -1, -1, -1, -1, -1, 0, 0, 0, 0, 0, 0, 0, -15, -16, -17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, -16, 0, -17, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, 0, -16, 0, 0, -17, 0, 0, 0, 0, 0, 0, 0, 0, -15, 0, 0, 0, -16, 0, 0, 0, -17, 0, 0, 0, 0, 0, 0, -15, 0, 0, 0, 0, -16, 0, 0, 0, 0, -17, 0, 0, 0, 0, -15, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, -17, 0, 0, -15, 0, 0, 0, 0, 0, 0, -16, 0, 0, 0, 0, 0, 0, -17],
        r = {
            p: 0,
            n: 1,
            b: 2,
            r: 3,
            q: 4,
            k: 5
        },
        s = {
            NORMAL: "n",
            CAPTURE: "c",
            BIG_PAWN: "b",
            EP_CAPTURE: "e",
            PROMOTION: "p",
            KSIDE_CASTLE: "k",
            QSIDE_CASTLE: "q"
        },
        t = {
            NORMAL: 1,
            CAPTURE: 2,
            BIG_PAWN: 4,
            EP_CAPTURE: 8,
            PROMOTION: 16,
            KSIDE_CASTLE: 32,
            QSIDE_CASTLE: 64
        },
        u = 7,
        v = 6,
        w = 5,
        x = 4,
        y = 3,
        z = 2,
        A = 1,
        B = 0,
        C = {
            a8: 0,
            b8: 1,
            c8: 2,
            d8: 3,
            e8: 4,
            f8: 5,
            g8: 6,
            h8: 7,
            a7: 16,
            b7: 17,
            c7: 18,
            d7: 19,
            e7: 20,
            f7: 21,
            g7: 22,
            h7: 23,
            a6: 32,
            b6: 33,
            c6: 34,
            d6: 35,
            e6: 36,
            f6: 37,
            g6: 38,
            h6: 39,
            a5: 48,
            b5: 49,
            c5: 50,
            d5: 51,
            e5: 52,
            f5: 53,
            g5: 54,
            h5: 55,
            a4: 64,
            b4: 65,
            c4: 66,
            d4: 67,
            e4: 68,
            f4: 69,
            g4: 70,
            h4: 71,
            a3: 80,
            b3: 81,
            c3: 82,
            d3: 83,
            e3: 84,
            f3: 85,
            g3: 86,
            h3: 87,
            a2: 96,
            b2: 97,
            c2: 98,
            d2: 99,
            e2: 100,
            f2: 101,
            g2: 102,
            h2: 103,
            a1: 112,
            b1: 113,
            c1: 114,
            d1: 115,
            e1: 116,
            f1: 117,
            g1: 118,
            h1: 119
        },
        D = {
            w: [{
                square: C.a1,
                flag: t.QSIDE_CASTLE
            }, {
                square: C.h1,
                flag: t.KSIDE_CASTLE
            }],
            b: [{
                square: C.a8,
                flag: t.QSIDE_CASTLE
            }, {
                square: C.h8,
                flag: t.KSIDE_CASTLE
            }]
        },
        E = new Array(128),
        F = {
            w: d,
            b: d
        },
        G = c,
        H = {
            w: 0,
            b: 0
        },
        I = d,
        J = 0,
        K = 1,
        L = [],
        M = {};
    return typeof a == "undefined" ? P(l) : P(a), {
        WHITE: c,
        BLACK: b,
        PAWN: e,
        KNIGHT: f,
        BISHOP: g,
        ROOK: h,
        QUEEN: i,
        KING: j,
        SQUARES: function() {
            var a = [];
            for (var b = C.a8; b <= C.h1; b++) {
                if (b & 136) {
                    b += 7;
                    continue
                }
                a.push(bl(b))
            }
            return a
        }(),
        FLAGS: s,
        load: function(a) {
            return P(a)
        },
        reset: function() {
            return O()
        },
        moves: function(a) {
            var b;
            typeof a == "undefined" || typeof a.target == "undefined" ? b = X() : b = X({
                target: a.target
            });
            var c = [];
            for (var d = 0, e = b.length; d < e; d++) typeof a != "undefined" && "verbose" in a && a.verbose ? c.push(bo(b[d])) : c.push(Y(b[d]));
            return c
        },
        in_check: function() {
            return _()
        },
        in_checkmate: function() {
						var result = ba();
            return result;
        },
        in_stalemate: function() {
            return bb()
        },
        in_draw: function() {
            return J >= 100 || bb() || bc() || bd()
        },
        insufficient_material: function() {
            return bc()
        },
        in_threefold_repetition: function() {
            return bd()
        },
        game_over: function() {
            return J >= 100 || ba() || bb() || bc() || bd()
        },
        validate_fen: function(a) {
            return Q(a)
        },
        fen: function() {
            return R()
        },
        pgn: function(a) {
            var b = typeof a == "object" && typeof a.newline_char == "string" ? a.newline_char : "\n",
                c = typeof a == "object" && typeof a.max_width == "number" ? a.max_width : 0,
                d = [],
                e = !1;
            for (var f in M) d.push("[" + f + ' "' + M[f] + '"]' + b), e = !0;
            e && L.length && d.push(b);
            var g = [];
            while (L.length > 0) g.push(bg());
            var h = [],
                i = "",
                j = 1;
            while (g.length > 0) {
                var k = g.pop();
                j == 1 && k.color == "b" ? (i = "1. ...", j++) : k.color == "w" && (i.length && h.push(i), i = j + ".", j++), i = i + " " + Y(k), bf(k)
            }
            i.length && h.push(i), typeof M.Result != "undefined" && h.push(M.Result);
            if (c == 0) return d.join("") + h.join(" ");
            var l = 0;
            for (var f = 0; f < h.length; f++) l + h[f].length > c && f != 0 ? (d[d.length - 1] == " " && d.pop(), d.push(b), l = 0) : f != 0 && (d.push(" "), l++), d.push(h[f]), l += h[f].length;
            return d.join("")
        },
        load_pgn: function(a, b) {
            function c(a) {
                return a.replace(/\n/g, "\\n")
            }

            function d(a) {
                var b = X();
                for (var c = 0, d = b.length; c < d; c++)
                    if (a == Y(b[c])) return b[c];
                return null
            }

            function e(a) {
                return d(bq(a))
            }

            function f(a) {
                var b = !1;
                for (var c in a) b = !0;
                return b
            }

            function g(a, b) {
                var c = typeof b == "object" && typeof b.newline_char == "string" ? b.newline_char : "\n",
                    d = {},
                    e = a.split(c),
                    f = "",
                    g = "";
                for (var h = 0; h < e.length; h++) f = e[h].replace(/^\[([A-Z][A-Za-z]*)\s.*\]$/, "$1"), g = e[h].replace(/^\[[A-Za-z]+\s"(.*)"\]$/, "$1"), bq(f).length > 0 && (d[f] = g);
                return d
            }
            var h = typeof b == "object" && typeof b.newline_char == "string" ? b.newline_char : "\n",
                i = new RegExp("^(\\[(.|" + c(h) + ")*\\])" + "(" + c(h) + ")*" + "1.(" + c(h) + "|.)*$", "g"),
                j = a.replace(i, "$1");
            j[0] != "[" && (j = ""), O();
            var k = g(j, b);
            for (var l in k) S([l, k[l]]);
            var n = a.replace(j, "").replace(new RegExp(c(h), "g"), " ");
            n = n.replace(/(\{[^}]+\})+?/g, ""), n = n.replace(/\d+\./g, "");
            var o = bq(n).split(new RegExp(/\s+/));
            o = o.join(",").replace(/,,+/g, ",").split(",");
            var p = "";
            for (var q = 0; q < o.length - 1; q++) {
                p = e(o[q]);
                if (p == null) return !1;
                bf(p)
            }
            p = o[o.length - 1];
            if (m.indexOf(p) > -1) f(M) && typeof M.Result == "undefined" && S(["Result", p]);
            else {
                p = e(p);
                if (p == null) return !1;
                bf(p)
            }
            return !0
        },
        header: function() {
            return S(arguments)
        },
        ascii: function() {
            return bi()
        },
        turn: function() {
            return G
        },
        move: function(a) {
            var b = null,
                c = X();
            if (typeof a == "string") {
                for (var d = 0, e = c.length; d < e; d++)
                    if (a == Y(c[d])) {
                        b = c[d];
                        break
                    }
            } else if (typeof a == "object")
                for (var d = 0, e = c.length; d < e; d++)
                    if (a.from == bl(c[d].from) && a.to == bl(c[d].to) && (!("promotion" in c[d]) || a.promotion == c[d].promotion)) {
                        b = c[d];
                        break
                    }
            if (!b) return null;
            var f = bo(b);
						var last_played=f.from+"-"+f.to;
						if (turns[Player] == chess.turn())
						{
							var tmp_name = names[Player];
							var xhr = new XMLHttpRequest();
							xhr.open('GET', "/save_move/"+room_id+"/"+last_played+"/"+(1-Player)+"/");
							xhr.onreadystatechange = function() {
							if (xhr.readyState == 4 && xhr.status == 200) 
							{}
							};
							xhr.send();
						}
						else
						{
							var tmp_name = names[1-Player];
						}
						document.getElementById('recents').innerHTML = "<div style='font-size:16px;margin-bottom:5px;'>"+tmp_name+" : "+f.san+"</div>"+document.getElementById('recents').innerHTML;
            return bf(b), f
        },
        undo: function() {
						alertify.warning("Nous démandons à "+names[1-Player]+", s'il accepte que vous annuliez.");
						var cancel = false;
						if (cancel == false){
							alertify.error("Désolé: Il a refusé.");
							return null;
						}
						else {
            var a = bg();
            return a ? bo(a) : null;
						}
        },
        clear: function() {
            return N()
        },
        put: function(a, b) {
            return V(a, b)
        },
        get: function(a) {
            return U(a)
        },
        remove: function(a) {
            return W(a)
        },
        perft: function(a) {
            return br(a)
        },
        square_color: function(a) {
            if (a in C) {
                var b = C[a];
                return (bj(b) + bk(b)) % 2 == 0 ? "light" : "dark"
            }
            return null
        },
        history: function(a) {
            var b = [],
                c = [],
                d = typeof a != "undefined" && "verbose" in a && a.verbose;
            while (L.length > 0) b.push(bg());
            while (b.length > 0) {
                var e = b.pop();
                d ? c.push(bo(e)) : c.push(Y(e)), bf(e)
            }
            return c
        }
    }
};
typeof exports != "undefined" && (exports.Chess = Chess);

function update_win(winner)
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET',"/update_stats/1/"+room_id+"/"+winner+"/");
	xhr.send();
}

function update_draws()
{
	var xhr = new XMLHttpRequest();
	xhr.open('GET',"/update_stats/2/"+room_id+"/");
	xhr.send();
}

function start_game()
{
	game_token = setInterval(function(){	
		if (chess.game_over()){
			var show_game_over = true;
			if (show_game_over)
			{
				if (chess.in_checkmate())
				{
					turn = chess.turn();
					if (turns[Player] == turn)
					{
						alertify.error("Dommage! vous avez perdu");
						var lose_stat = document.getElementById("lose_stat");		
						lose_stat.textContent = (parseInt(lose_stat.getAttribute('data-nb'))+1) + " Defaites";
						update_win(turns[1-Player]);
					}			
					else
					{
						alertify.success("Bravo! vous avez gagné");
						var win_stat = document.getElementById("win_stat");		
						win_stat.textContent = (parseInt(win_stat.getAttribute('data-nb'))+1) + " Victoires";	
						update_win(turns[Player]);
					}
				}
				else
				{
						alertify.warning("Match nul !");
						var draw_stat = document.getElementById("draw_stat");		
						draw_stat.textContent = (parseInt(draw_stat.getAttribute('data-nb'))+1) + " Matchs nul ";	
						update_draws();
				}
				show_game_over = false; 
			}
		}
	},1000);

	turn_token = setInterval(function(){
		if (turns[Player] != chess.turn())
		{
			var xhr = new XMLHttpRequest();
			xhr.open('GET',"/check_turn/"+room_id+"/");		
			xhr.onreadystatechange = function()
			{
				if (xhr.readyState == 4 && xhr.status == 200) 
				{ 
					var json = JSON.parse(xhr.responseText);
					if (json.turn == Player){
						j_start = json.move.split('-')[0];
						j_end = json.move.split('-')[1];
						chess.move({from:j_start,to:j_end});
						updateBoard();
					}	
				}
			};
			xhr.send();			
		}
	},1500);

	message_token = setInterval(function(){
			var xhr = new XMLHttpRequest();
			xhr.open('GET',"/check_response/"+room_id+"/"+Player+"/");	
			xhr.onreadystatechange = function()
			{
				if (xhr.readyState == 4 && xhr.status == 200) 
				{ 
					var json = JSON.parse(xhr.responseText);
					if (json.send == (1-Player)){
						for (var m=0; m<parseInt(json.nb_msg); m++)
						{
							updateChat(json[("msg"+m)]);
							alertify.warning('Nouveau message.');
						}
					}	
				}
			};
			xhr.send();	
		},3000);
}

function giveUp()
{

}

function endGame()
{

}
var chess = new Chess,
    currentColor = chess.turn(),
    turn = 0,
    timeOut = null,
    photon = document.getElementsByClassName("photon-shader"),
    sphere = document.getElementsByClassName("sphere"),
    piece = document.getElementsByClassName("piece"),
    square = document.getElementsByClassName("square"),
    app = document.getElementById("app"),
    scene = document.getElementById("scene"),
    sceneX = 70,
    sceneY = 90,
    controls = !1,
    animated = !1,
    mouseDown = !1,
    closestElement = null,
    white = "White",
    black = "Black";
if (checkTouch()) var press = "touchstart",
    drag = "touchmove",
    drop = "touchend";
else var press = "mousedown",
    drag = "mousemove",
    drop = "mouseup";
window.addEventListener("resize", resetPoly, !1);
var readyStateCheckInterval = setInterval(function() {
    document.readyState === "complete" && (renderPoly(), init(), clearInterval(readyStateCheckInterval))
}, 3250)
