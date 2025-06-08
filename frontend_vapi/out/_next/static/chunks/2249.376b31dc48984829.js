"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [2249],
  {
    3688: (e, t, o) => {
      o.d(t, { _: () => s, K: () => c });
      var i = o(90258),
        r = o(50017),
        a = o(23840);
      let s = () => new n();
      class n {}
      let l = new WeakMap(),
        c = (0, a.u$)(
          class extends r.Kq {
            render(e) {
              return i.s6;
            }
            update(e, [t]) {
              let o = t !== this.G;
              return (
                o && void 0 !== this.G && this.rt(void 0),
                (o || this.lt !== this.ct) &&
                  ((this.G = t), (this.ht = e.options?.host), this.rt((this.ct = e.element))),
                i.s6
              );
            }
            rt(e) {
              if ((this.isConnected || (e = void 0), "function" == typeof this.G)) {
                let t = this.ht ?? globalThis,
                  o = l.get(t);
                void 0 === o && ((o = new WeakMap()), l.set(t, o)),
                  void 0 !== o.get(this.G) && this.G.call(this.ht, void 0),
                  o.set(this.G, e),
                  void 0 !== e && this.G.call(this.ht, e);
              } else this.G.value = e;
            }
            get lt() {
              return "function" == typeof this.G
                ? l.get(this.ht ?? globalThis)?.get(this.G)
                : this.G?.value;
            }
            disconnected() {
              this.lt === this.ct && this.rt(void 0);
            }
            reconnected() {
              this.rt(this.ct);
            }
          },
        );
    },
    21846: (e, t, o) => {
      var i = o(2776),
        r = o(8847);
      o(28563);
      var a = o(24957),
        s = o(93626);
      let n = (0, i.AH)`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;
      var l = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let c = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.size = "md"),
            (this.backgroundColor = "accent-100"),
            (this.iconColor = "accent-100"),
            (this.background = "transparent"),
            (this.border = !1),
            (this.borderColor = "wui-color-bg-125"),
            (this.icon = "copy");
        }
        render() {
          let e = this.iconSize || this.size,
            t = "lg" === this.size,
            o = "xl" === this.size,
            r = "gray" === this.background,
            a = "opaque" === this.background,
            s =
              ("accent-100" === this.backgroundColor && a) ||
              ("success-100" === this.backgroundColor && a) ||
              ("error-100" === this.backgroundColor && a) ||
              ("inverse-100" === this.backgroundColor && a),
            n = `var(--wui-color-${this.backgroundColor})`;
          return (
            s
              ? (n = `var(--wui-icon-box-bg-${this.backgroundColor})`)
              : r && (n = `var(--wui-color-gray-${this.backgroundColor})`),
            (this.style.cssText = `
       --local-bg-value: ${n};
       --local-bg-mix: ${s || r ? "100%" : t ? "12%" : "16%"};
       --local-border-radius: var(--wui-border-radius-${t ? "xxs" : o ? "s" : "3xl"});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${"wui-color-bg-125" === this.borderColor ? "2px" : "1px"} solid ${this.border ? `var(--${this.borderColor})` : "transparent"}
   `),
            (0, i.qy)` <wui-icon color=${this.iconColor} size=${e} name=${this.icon}></wui-icon> `
          );
        }
      };
      (c.styles = [a.W5, a.fD, n]),
        l([(0, r.MZ)()], c.prototype, "size", void 0),
        l([(0, r.MZ)()], c.prototype, "backgroundColor", void 0),
        l([(0, r.MZ)()], c.prototype, "iconColor", void 0),
        l([(0, r.MZ)()], c.prototype, "iconSize", void 0),
        l([(0, r.MZ)()], c.prototype, "background", void 0),
        l([(0, r.MZ)({ type: Boolean })], c.prototype, "border", void 0),
        l([(0, r.MZ)()], c.prototype, "borderColor", void 0),
        l([(0, r.MZ)()], c.prototype, "icon", void 0),
        (c = l([(0, s.E)("wui-icon-box")], c));
    },
    26469: (e, t, o) => {
      var i = o(2776),
        r = o(8847);
      o(53015), o(80352);
      var a = o(24957),
        s = o(93626);
      let n = (0, i.AH)`
  :host {
    width: var(--local-width);
    position: relative;
  }

  button {
    border: none;
    border-radius: var(--local-border-radius);
    width: var(--local-width);
    white-space: nowrap;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='md'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-l);
    height: 36px;
  }

  button[data-size='md'][data-icon-left='true'][data-icon-right='false'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-s);
  }

  button[data-size='md'][data-icon-right='true'][data-icon-left='false'] {
    padding: 8.2px var(--wui-spacing-s) 9px var(--wui-spacing-l);
  }

  button[data-size='lg'] {
    padding: var(--wui-spacing-m) var(--wui-spacing-2l);
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='inverse'] {
    background-color: var(--wui-color-inverse-100);
    color: var(--wui-color-inverse-000);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='accent-error'] {
    background: var(--wui-color-error-glass-015);
    color: var(--wui-color-error-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-error-glass-010);
  }

  button[data-variant='accent-success'] {
    background: var(--wui-color-success-glass-015);
    color: var(--wui-color-success-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-success-glass-010);
  }

  button[data-variant='neutral'] {
    background: transparent;
    color: var(--wui-color-fg-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-variant='main']:focus-visible:enabled {
    background-color: var(--wui-color-accent-090);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='inverse']:focus-visible:enabled {
    background-color: var(--wui-color-inverse-100);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent']:focus-visible:enabled {
    background-color: var(--wui-color-accent-glass-010);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent-error']:focus-visible:enabled {
    background: var(--wui-color-error-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-error-100),
      0 0 0 4px var(--wui-color-error-glass-020);
  }
  button[data-variant='accent-success']:focus-visible:enabled {
    background: var(--wui-color-success-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-success-100),
      0 0 0 4px var(--wui-color-success-glass-020);
  }
  button[data-variant='neutral']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='accent-error']:hover:enabled {
      background: var(--wui-color-error-glass-020);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-error']:active:enabled {
      background: var(--wui-color-error-glass-030);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-success']:hover:enabled {
      background: var(--wui-color-success-glass-020);
      color: var(--wui-color-success-100);
    }

    button[data-variant='accent-success']:active:enabled {
      background: var(--wui-color-success-glass-030);
      color: var(--wui-color-success-100);
    }

    button[data-variant='neutral']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='neutral']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }

    button[data-size='lg'][data-icon-left='true'][data-icon-right='false'] {
      padding-left: var(--wui-spacing-m);
    }

    button[data-size='lg'][data-icon-right='true'][data-icon-left='false'] {
      padding-right: var(--wui-spacing-m);
    }
  }

  /* -- Disabled state --------------------------------------------------- */
  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    color: var(--wui-color-gray-glass-020);
    cursor: not-allowed;
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  wui-loading-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: var(--local-opacity-000);
  }
`;
      var l = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let c = {
          main: "inverse-100",
          inverse: "inverse-000",
          accent: "accent-100",
          "accent-error": "error-100",
          "accent-success": "success-100",
          neutral: "fg-100",
          disabled: "gray-glass-020",
        },
        d = { lg: "paragraph-600", md: "small-600" },
        u = { lg: "md", md: "md" },
        h = class extends i.WF {
          constructor() {
            super(...arguments),
              (this.size = "lg"),
              (this.disabled = !1),
              (this.fullWidth = !1),
              (this.loading = !1),
              (this.variant = "main"),
              (this.hasIconLeft = !1),
              (this.hasIconRight = !1),
              (this.borderRadius = "m");
          }
          render() {
            this.style.cssText = `
    --local-width: ${this.fullWidth ? "100%" : "auto"};
    --local-opacity-100: ${+!this.loading};
    --local-opacity-000: ${+!!this.loading};
    --local-border-radius: var(--wui-border-radius-${this.borderRadius});
    `;
            let e = this.textVariant ?? d[this.size];
            return (0, i.qy)`
      <button
        data-variant=${this.variant}
        data-icon-left=${this.hasIconLeft}
        data-icon-right=${this.hasIconRight}
        data-size=${this.size}
        ?disabled=${this.disabled}
      >
        ${this.loadingTemplate()}
        <slot name="iconLeft" @slotchange=${() => this.handleSlotLeftChange()}></slot>
        <wui-text variant=${e} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight" @slotchange=${() => this.handleSlotRightChange()}></slot>
      </button>
    `;
          }
          handleSlotLeftChange() {
            this.hasIconLeft = !0;
          }
          handleSlotRightChange() {
            this.hasIconRight = !0;
          }
          loadingTemplate() {
            if (this.loading) {
              let e = u[this.size],
                t = this.disabled ? c.disabled : c[this.variant];
              return (0, i.qy)`<wui-loading-spinner color=${t} size=${e}></wui-loading-spinner>`;
            }
            return (0, i.qy)``;
          }
        };
      (h.styles = [a.W5, a.fD, n]),
        l([(0, r.MZ)()], h.prototype, "size", void 0),
        l([(0, r.MZ)({ type: Boolean })], h.prototype, "disabled", void 0),
        l([(0, r.MZ)({ type: Boolean })], h.prototype, "fullWidth", void 0),
        l([(0, r.MZ)({ type: Boolean })], h.prototype, "loading", void 0),
        l([(0, r.MZ)()], h.prototype, "variant", void 0),
        l([(0, r.MZ)({ type: Boolean })], h.prototype, "hasIconLeft", void 0),
        l([(0, r.MZ)({ type: Boolean })], h.prototype, "hasIconRight", void 0),
        l([(0, r.MZ)()], h.prototype, "borderRadius", void 0),
        l([(0, r.MZ)()], h.prototype, "textVariant", void 0),
        (h = l([(0, s.E)("wui-button")], h));
    },
    27239: (e, t, o) => {
      var i = o(2776),
        r = o(8847);
      o(28563), o(33380);
      var a = o(22382);
      function s(e, t, o) {
        return e !== t && (e - t < 0 ? t - e : e - t) <= o + 0.1;
      }
      let n = {
        generate({ uri: e, size: t, logoSize: o, dotColor: r = "#141414" }) {
          let n = [],
            l = (function (e, t) {
              let o = Array.prototype.slice.call(
                  a.create(e, { errorCorrectionLevel: "Q" }).modules.data,
                  0,
                ),
                i = Math.sqrt(o.length);
              return o.reduce(
                (e, t, o) => (o % i == 0 ? e.push([t]) : e[e.length - 1].push(t)) && e,
                [],
              );
            })(e, 0),
            c = t / l.length,
            d = [
              { x: 0, y: 0 },
              { x: 1, y: 0 },
              { x: 0, y: 1 },
            ];
          d.forEach(({ x: e, y: t }) => {
            let o = (l.length - 7) * c * e,
              a = (l.length - 7) * c * t;
            for (let e = 0; e < d.length; e += 1) {
              let t = c * (7 - 2 * e);
              n.push((0, i.JW)`
            <rect
              fill=${2 === e ? r : "transparent"}
              width=${0 === e ? t - 5 : t}
              rx= ${0 === e ? (t - 5) * 0.45 : 0.45 * t}
              ry= ${0 === e ? (t - 5) * 0.45 : 0.45 * t}
              stroke=${r}
              stroke-width=${5 * (0 === e)}
              height=${0 === e ? t - 5 : t}
              x= ${0 === e ? a + c * e + 2.5 : a + c * e}
              y= ${0 === e ? o + c * e + 2.5 : o + c * e}
            />
          `);
            }
          });
          let u = Math.floor((o + 25) / c),
            h = l.length / 2 - u / 2,
            p = l.length / 2 + u / 2 - 1,
            g = [];
          l.forEach((e, t) => {
            e.forEach((e, o) => {
              !l[t][o] ||
                (t < 7 && o < 7) ||
                (t > l.length - 8 && o < 7) ||
                (t < 7 && o > l.length - 8) ||
                (t > h && t < p && o > h && o < p) ||
                g.push([t * c + c / 2, o * c + c / 2]);
            });
          });
          let v = {};
          return (
            g.forEach(([e, t]) => {
              v[e] ? v[e]?.push(t) : (v[e] = [t]);
            }),
            Object.entries(v)
              .map(([e, t]) => {
                let o = t.filter((e) => t.every((t) => !s(e, t, c)));
                return [Number(e), o];
              })
              .forEach(([e, t]) => {
                t.forEach((t) => {
                  n.push((0, i.JW)`<circle cx=${e} cy=${t} fill=${r} r=${c / 2.5} />`);
                });
              }),
            Object.entries(v)
              .filter(([e, t]) => t.length > 1)
              .map(([e, t]) => {
                let o = t.filter((e) => t.some((t) => s(e, t, c)));
                return [Number(e), o];
              })
              .map(([e, t]) => {
                t.sort((e, t) => (e < t ? -1 : 1));
                let o = [];
                for (let e of t) {
                  let t = o.find((t) => t.some((t) => s(e, t, c)));
                  t ? t.push(e) : o.push([e]);
                }
                return [e, o.map((e) => [e[0], e[e.length - 1]])];
              })
              .forEach(([e, t]) => {
                t.forEach(([t, o]) => {
                  n.push((0, i.JW)`
              <line
                x1=${e}
                x2=${e}
                y1=${t}
                y2=${o}
                stroke=${r}
                stroke-width=${c / 1.25}
                stroke-linecap="round"
              />
            `);
                });
              }),
            n
          );
        },
      };
      var l = o(24957),
        c = o(93626);
      let d = (0, i.AH)`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`;
      var u = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let h = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.uri = ""),
            (this.size = 0),
            (this.theme = "dark"),
            (this.imageSrc = void 0),
            (this.alt = void 0),
            (this.arenaClear = void 0),
            (this.farcaster = void 0);
        }
        render() {
          return (
            (this.dataset.theme = this.theme),
            (this.dataset.clear = String(this.arenaClear)),
            (this.style.cssText = `
     --local-size: ${this.size}px;
     --local-icon-color: ${this.color ?? "#3396ff"}
    `),
            (0, i.qy)`${this.templateVisual()} ${this.templateSvg()}`
          );
        }
        templateSvg() {
          let e = "light" === this.theme ? this.size : this.size - 32;
          return (0, i.JW)`
      <svg height=${e} width=${e}>
        ${n.generate({ uri: this.uri, size: e, logoSize: this.arenaClear ? 0 : e / 4, dotColor: this.color })}
      </svg>
    `;
        }
        templateVisual() {
          return this.imageSrc
            ? (0, i.qy)`<wui-image src=${this.imageSrc} alt=${this.alt ?? "logo"}></wui-image>`
            : this.farcaster
              ? (0, i.qy)`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`
              : (0,
                i.qy)`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`;
        }
      };
      (h.styles = [l.W5, d]),
        u([(0, r.MZ)()], h.prototype, "uri", void 0),
        u([(0, r.MZ)({ type: Number })], h.prototype, "size", void 0),
        u([(0, r.MZ)()], h.prototype, "theme", void 0),
        u([(0, r.MZ)()], h.prototype, "imageSrc", void 0),
        u([(0, r.MZ)()], h.prototype, "alt", void 0),
        u([(0, r.MZ)()], h.prototype, "color", void 0),
        u([(0, r.MZ)({ type: Boolean })], h.prototype, "arenaClear", void 0),
        u([(0, r.MZ)({ type: Boolean })], h.prototype, "farcaster", void 0),
        (h = u([(0, c.E)("wui-qr-code")], h));
    },
    32893: (e, t, o) => {
      var i = o(2776),
        r = o(8847),
        a = o(51685);
      o(80352);
      var s = o(24957),
        n = o(93626);
      o(68164);
      let l = (0, i.AH)`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    justify-content: flex-start;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-text[data-align='left'] {
    display: flex;
    flex: 1;
  }

  wui-text[data-align='center'] {
    display: flex;
    flex: 1;
    justify-content: center;
  }

  .invisible {
    opacity: 0;
    pointer-events: none;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }
`;
      var c = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let d = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.logo = "google"),
            (this.name = "Continue with google"),
            (this.align = "left"),
            (this.disabled = !1);
        }
        render() {
          return (0, i.qy)`
      <button ?disabled=${this.disabled} tabindex=${(0, a.J)(this.tabIdx)}>
        <wui-logo logo=${this.logo}></wui-logo>
        <wui-text
          data-align=${this.align}
          variant="paragraph-500"
          color="inherit"
          align=${this.align}
          >${this.name}</wui-text
        >
        ${this.templatePlacement()}
      </button>
    `;
        }
        templatePlacement() {
          return "center" === this.align
            ? (0, i.qy)` <wui-logo class="invisible" logo=${this.logo}></wui-logo>`
            : null;
        }
      };
      (d.styles = [s.W5, s.fD, l]),
        c([(0, r.MZ)()], d.prototype, "logo", void 0),
        c([(0, r.MZ)()], d.prototype, "name", void 0),
        c([(0, r.MZ)()], d.prototype, "align", void 0),
        c([(0, r.MZ)()], d.prototype, "tabIdx", void 0),
        c([(0, r.MZ)({ type: Boolean })], d.prototype, "disabled", void 0),
        (d = c([(0, n.E)("wui-list-social")], d));
    },
    42229: (e, t, o) => {
      o.d(t, { Up: () => g });
      var i = o(93462),
        r = o(38426),
        a = o(90588),
        s = o(97798),
        n = o(53346),
        l = o(84962),
        c = o(7679),
        d = o(71644),
        u = o(2432);
      async function h() {
        l.I.push("ConnectingFarcaster");
        let e = s.a.getAuthConnector();
        if (e && !r.U.state.farcasterUrl)
          try {
            let { url: t } = await e.provider.getFarcasterUri();
            r.U.setFarcasterUrl(t, a.W.state.activeChain);
          } catch (e) {
            l.I.goBack(), c.P.showError(e);
          }
      }
      async function p(e) {
        l.I.push("ConnectingSocial");
        let t = s.a.getAuthConnector(),
          o = null;
        try {
          let s = setTimeout(() => {
            throw Error("Social login timed out. Please try again.");
          }, 45e3);
          if (t && e) {
            if (
              (d.w.isTelegram() ||
                (o = (function () {
                  try {
                    return d.w.returnOpenHref(
                      `${i.o.SECURE_SITE_SDK_ORIGIN}/loading`,
                      "popupWindow",
                      "width=600,height=800,scrollbars=yes",
                    );
                  } catch (e) {
                    throw Error("Could not open social popup");
                  }
                })()),
              o)
            )
              r.U.setSocialWindow(o, a.W.state.activeChain);
            else if (!d.w.isTelegram()) throw Error("Could not create social popup");
            let { uri: n } = await t.provider.getSocialRedirectUri({ provider: e });
            if (!n) throw (o?.close(), Error("Could not fetch the social redirect uri"));
            if ((o && (o.location.href = n), d.w.isTelegram())) {
              u.i.setTelegramSocialProvider(e);
              let t = d.w.formatTelegramSocialLoginUrl(n);
              d.w.openHref(t, "_top");
            }
            clearTimeout(s);
          }
        } catch (e) {
          o?.close(), c.P.showError(e?.message);
        }
      }
      async function g(e) {
        r.U.setSocialProvider(e, a.W.state.activeChain),
          n.E.sendEvent({
            type: "track",
            event: "SOCIAL_LOGIN_STARTED",
            properties: { provider: e },
          }),
          "farcaster" === e ? await h() : await p(e);
      }
    },
    53015: (e, t, o) => {
      var i = o(2776),
        r = o(8847),
        a = o(24957),
        s = o(93626);
      let n = (0, i.AH)`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;
      var l = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let c = class extends i.WF {
        constructor() {
          super(...arguments), (this.color = "accent-100"), (this.size = "lg");
        }
        render() {
          return (
            (this.style.cssText = `--local-color: ${"inherit" === this.color ? "inherit" : `var(--wui-color-${this.color})`}`),
            (this.dataset.size = this.size),
            (0, i.qy)`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`
          );
        }
      };
      (c.styles = [a.W5, n]),
        l([(0, r.MZ)()], c.prototype, "color", void 0),
        l([(0, r.MZ)()], c.prototype, "size", void 0),
        (c = l([(0, s.E)("wui-loading-spinner")], c));
    },
    61823: (e, t, o) => {
      o(26469);
    },
    68164: (e, t, o) => {
      var i = o(2776),
        r = o(8847);
      o(28563);
      var a = o(24957),
        s = o(93626);
      let n = (0, i.AH)`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-3xl);
    border: 1px solid var(--wui-color-gray-glass-005);
    overflow: hidden;
  }

  wui-icon {
    width: 100%;
    height: 100%;
  }
`;
      var l = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let c = class extends i.WF {
        constructor() {
          super(...arguments), (this.logo = "google");
        }
        render() {
          return (0, i.qy)`<wui-icon color="inherit" size="inherit" name=${this.logo}></wui-icon> `;
        }
      };
      (c.styles = [a.W5, n]),
        l([(0, r.MZ)()], c.prototype, "logo", void 0),
        (c = l([(0, s.E)("wui-logo")], c));
    },
    71815: (e, t, o) => {
      o.r(t),
        o.d(t, {
          W3mConnectSocialsView: () => x,
          W3mConnectingFarcasterView: () => U,
          W3mConnectingSocialView: () => T,
        });
      var i = o(2776),
        r = o(8847),
        a = o(51685),
        s = o(28572),
        n = o(19495),
        l = o(10021);
      o(79824), o(81412), o(44025);
      var c = o(97798),
        d = o(84962),
        u = o(13316),
        h = o(66275),
        p = o(42229),
        g = o(71644);
      o(32893);
      var v = o(95301);
      let w = (0, i.AH)`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;
      var b = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let f = class extends i.WF {
        constructor() {
          super(),
            (this.unsubscribe = []),
            (this.tabIdx = void 0),
            (this.connectors = c.a.state.connectors),
            (this.authConnector = this.connectors.find((e) => "AUTH" === e.type)),
            (this.remoteFeatures = n.H.state.remoteFeatures),
            (this.isPwaLoading = !1),
            this.unsubscribe.push(
              c.a.subscribeKey("connectors", (e) => {
                (this.connectors = e),
                  (this.authConnector = this.connectors.find((e) => "AUTH" === e.type));
              }),
              n.H.subscribeKey("remoteFeatures", (e) => (this.remoteFeatures = e)),
            );
        }
        connectedCallback() {
          super.connectedCallback(), this.handlePwaFrameLoad();
        }
        disconnectedCallback() {
          this.unsubscribe.forEach((e) => e());
        }
        render() {
          let e = this.remoteFeatures?.socials || [],
            t = !!this.authConnector,
            o = e?.length,
            r = "ConnectSocials" === d.I.state.view;
          return (t && o) || r
            ? (r && !o && (e = u.oU.DEFAULT_SOCIALS),
              (0, i.qy)` <wui-flex flexDirection="column" gap="xs">
      ${e.map(
        (e) => (0, i.qy)`<wui-list-social
            @click=${() => {
              this.onSocialClick(e);
            }}
            data-testid=${`social-selector-${e}`}
            name=${e}
            logo=${e}
            ?disabled=${this.isPwaLoading}
          ></wui-list-social>`,
      )}
    </wui-flex>`)
            : null;
        }
        async onSocialClick(e) {
          e && (await (0, p.Up)(e));
        }
        async handlePwaFrameLoad() {
          if (g.w.isPWA()) {
            this.isPwaLoading = !0;
            try {
              this.authConnector?.provider instanceof v.Y &&
                (await this.authConnector.provider.init());
            } catch (e) {
              h.h.open(
                { shortMessage: "Error loading embedded wallet in PWA", longMessage: e.message },
                "error",
              );
            } finally {
              this.isPwaLoading = !1;
            }
          }
        }
      };
      (f.styles = w),
        b([(0, r.MZ)()], f.prototype, "tabIdx", void 0),
        b([(0, r.wk)()], f.prototype, "connectors", void 0),
        b([(0, r.wk)()], f.prototype, "authConnector", void 0),
        b([(0, r.wk)()], f.prototype, "remoteFeatures", void 0),
        b([(0, r.wk)()], f.prototype, "isPwaLoading", void 0),
        (f = b([(0, l.EM)("w3m-social-login-list")], f));
      let y = (0, i.AH)`
  wui-flex {
    max-height: clamp(360px, 540px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }
  wui-flex::-webkit-scrollbar {
    display: none;
  }
  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;
      var m = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let x = class extends i.WF {
        constructor() {
          super(),
            (this.unsubscribe = []),
            (this.checked = s.o.state.isLegalCheckboxChecked),
            this.unsubscribe.push(
              s.o.subscribeKey("isLegalCheckboxChecked", (e) => {
                this.checked = e;
              }),
            );
        }
        disconnectedCallback() {
          this.unsubscribe.forEach((e) => e());
        }
        render() {
          let { termsConditionsUrl: e, privacyPolicyUrl: t } = n.H.state,
            o = n.H.state.features?.legalCheckbox,
            r = !!(e || t) && !!o,
            s = r && !this.checked;
          return (0, i.qy)`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${r ? ["0", "s", "s", "s"] : "s"}
        gap="xs"
        class=${(0, a.J)(s ? "disabled" : void 0)}
      >
        <w3m-social-login-list tabIdx=${(0, a.J)(s ? -1 : void 0)}></w3m-social-login-list>
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `;
        }
      };
      (x.styles = y),
        m([(0, r.wk)()], x.prototype, "checked", void 0),
        (x = m([(0, l.EM)("w3m-connect-socials-view")], x));
      var k = o(38426),
        C = o(90588),
        $ = o(53346),
        E = o(26115),
        P = o(2432),
        S = o(7679),
        R = o(20420),
        z = o(32736);
      o(7390), o(84219), o(68164), o(77740);
      var W = o(76285),
        I = o(52698);
      let O = (0, i.AH)`
  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: var(--wui-border-radius-m);
  }
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }
  wui-flex:first-child:not(:only-child) {
    position: relative;
  }
  wui-loading-thumbnail {
    position: absolute;
  }
  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-lg);
  }
  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }
  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }
  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }
  .capitalize {
    text-transform: capitalize;
  }
`;
      var L = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let T = class extends i.WF {
        constructor() {
          super(),
            (this.unsubscribe = []),
            (this.socialProvider = k.U.state.socialProvider),
            (this.socialWindow = k.U.state.socialWindow),
            (this.error = !1),
            (this.connecting = !1),
            (this.message = "Connect in the provider window"),
            (this.authConnector = c.a.getAuthConnector()),
            (this.handleSocialConnection = async (e) => {
              if (e.data?.resultUri)
                if (e.origin === I.o.SECURE_SITE_ORIGIN) {
                  window.removeEventListener("message", this.handleSocialConnection, !1);
                  try {
                    if (this.authConnector && !this.connecting) {
                      this.socialWindow &&
                        (this.socialWindow.close(),
                        k.U.setSocialWindow(void 0, C.W.state.activeChain)),
                        (this.connecting = !0),
                        this.updateMessage();
                      let t = e.data.resultUri;
                      this.socialProvider &&
                        $.E.sendEvent({
                          type: "track",
                          event: "SOCIAL_LOGIN_REQUEST_USER_DATA",
                          properties: { provider: this.socialProvider },
                        }),
                        await E.x.connectExternal(
                          {
                            id: this.authConnector.id,
                            type: this.authConnector.type,
                            socialUri: t,
                          },
                          this.authConnector.chain,
                        ),
                        this.socialProvider &&
                          (P.i.setConnectedSocialProvider(this.socialProvider),
                          $.E.sendEvent({
                            type: "track",
                            event: "SOCIAL_LOGIN_SUCCESS",
                            properties: { provider: this.socialProvider },
                          }));
                    }
                  } catch (e) {
                    (this.error = !0),
                      this.updateMessage(),
                      this.socialProvider &&
                        $.E.sendEvent({
                          type: "track",
                          event: "SOCIAL_LOGIN_ERROR",
                          properties: { provider: this.socialProvider },
                        });
                  }
                } else
                  d.I.goBack(),
                    S.P.showError("Untrusted Origin"),
                    this.socialProvider &&
                      $.E.sendEvent({
                        type: "track",
                        event: "SOCIAL_LOGIN_ERROR",
                        properties: { provider: this.socialProvider },
                      });
            }),
            W.R.EmbeddedWalletAbortController.signal.addEventListener("abort", () => {
              this.socialWindow &&
                (this.socialWindow.close(), k.U.setSocialWindow(void 0, C.W.state.activeChain));
            }),
            this.unsubscribe.push(
              k.U.subscribe((e) => {
                e.socialProvider && (this.socialProvider = e.socialProvider),
                  e.socialWindow && (this.socialWindow = e.socialWindow),
                  e.address && (R.W.state.open || n.H.state.enableEmbedded) && R.W.close();
              }),
            ),
            this.authConnector && this.connectSocial();
        }
        disconnectedCallback() {
          this.unsubscribe.forEach((e) => e()),
            window.removeEventListener("message", this.handleSocialConnection, !1),
            this.socialWindow?.close(),
            k.U.setSocialWindow(void 0, C.W.state.activeChain);
        }
        render() {
          return (0, i.qy)`
      <wui-flex
        data-error=${(0, a.J)(this.error)}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl", "xl", "xl", "xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo=${(0, a.J)(this.socialProvider)}></wui-logo>
          ${this.error ? null : this.loaderTemplate()}
          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100"
            >Log in with
            <span class="capitalize">${this.socialProvider ?? "Social"}</span></wui-text
          >
          <wui-text align="center" variant="small-400" color=${this.error ? "error-100" : "fg-200"}
            >${this.message}</wui-text
          ></wui-flex
        >
      </wui-flex>
    `;
        }
        loaderTemplate() {
          let e = z.W.state.themeVariables["--w3m-border-radius-master"],
            t = e ? parseInt(e.replace("px", ""), 10) : 4;
          return (0, i.qy)`<wui-loading-thumbnail radius=${9 * t}></wui-loading-thumbnail>`;
        }
        connectSocial() {
          let e = setInterval(() => {
            this.socialWindow?.closed &&
              (this.connecting ||
                "ConnectingSocial" !== d.I.state.view ||
                (this.socialProvider &&
                  $.E.sendEvent({
                    type: "track",
                    event: "SOCIAL_LOGIN_CANCELED",
                    properties: { provider: this.socialProvider },
                  }),
                d.I.goBack()),
              clearInterval(e));
          }, 1e3);
          window.addEventListener("message", this.handleSocialConnection, !1);
        }
        updateMessage() {
          this.error
            ? (this.message = "Something went wrong")
            : this.connecting
              ? (this.message = "Retrieving user data")
              : (this.message = "Connect in the provider window");
        }
      };
      (T.styles = O),
        L([(0, r.wk)()], T.prototype, "socialProvider", void 0),
        L([(0, r.wk)()], T.prototype, "socialWindow", void 0),
        L([(0, r.wk)()], T.prototype, "error", void 0),
        L([(0, r.wk)()], T.prototype, "connecting", void 0),
        L([(0, r.wk)()], T.prototype, "message", void 0),
        (T = L([(0, l.EM)("w3m-connecting-social-view")], T)),
        o(61823),
        o(69846),
        o(16877),
        o(27239),
        o(84538);
      let M = (0, i.AH)`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }

  wui-logo {
    width: 80px;
    height: 80px;
    border-radius: var(--wui-border-radius-m);
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }
  wui-loading-thumbnail {
    position: absolute;
  }
  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition: all var(--wui-ease-out-power-2) var(--wui-duration-lg);
  }
`;
      var q = function (e, t, o, i) {
        var r,
          a = arguments.length,
          s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, o, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
        return a > 3 && s && Object.defineProperty(t, o, s), s;
      };
      let U = class extends i.WF {
        constructor() {
          super(),
            (this.unsubscribe = []),
            (this.timeout = void 0),
            (this.socialProvider = k.U.state.socialProvider),
            (this.uri = k.U.state.farcasterUrl),
            (this.ready = !1),
            (this.loading = !1),
            (this.authConnector = c.a.getAuthConnector()),
            (this.forceUpdate = () => {
              this.requestUpdate();
            }),
            this.unsubscribe.push(
              k.U.subscribeKey("farcasterUrl", (e) => {
                e && ((this.uri = e), this.connectFarcaster());
              }),
              k.U.subscribeKey("socialProvider", (e) => {
                e && (this.socialProvider = e);
              }),
            ),
            window.addEventListener("resize", this.forceUpdate);
        }
        disconnectedCallback() {
          super.disconnectedCallback(),
            clearTimeout(this.timeout),
            window.removeEventListener("resize", this.forceUpdate);
        }
        render() {
          return this.onRenderProxy(), (0, i.qy)`${this.platformTemplate()}`;
        }
        platformTemplate() {
          return g.w.isMobile()
            ? (0, i.qy)`${this.mobileTemplate()}`
            : (0, i.qy)`${this.desktopTemplate()}`;
        }
        desktopTemplate() {
          return this.loading
            ? (0, i.qy)`${this.loadingTemplate()}`
            : (0, i.qy)`${this.qrTemplate()}`;
        }
        qrTemplate() {
          return (0, i.qy)` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["0", "xl", "xl", "xl"]}
      gap="xl"
    >
      <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

      <wui-text variant="paragraph-500" color="fg-100">
        Scan this QR Code with your phone
      </wui-text>
      ${this.copyTemplate()}
    </wui-flex>`;
        }
        loadingTemplate() {
          return (0, i.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xl", "xl", "xl", "xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-logo logo="farcaster"></wui-logo>
          ${this.loaderTemplate()}
          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            Loading user data
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            Please wait a moment while we load your data.
          </wui-text>
        </wui-flex>
      </wui-flex>
    `;
        }
        mobileTemplate() {
          return (0, i.qy)` <wui-flex
      flexDirection="column"
      alignItems="center"
      .padding=${["3xl", "xl", "xl", "xl"]}
      gap="xl"
    >
      <wui-flex justifyContent="center" alignItems="center">
        <wui-logo logo="farcaster"></wui-logo>
        ${this.loaderTemplate()}
        <wui-icon-box
          backgroundColor="error-100"
          background="opaque"
          iconColor="error-100"
          icon="close"
          size="sm"
          border
          borderColor="wui-color-bg-125"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="xs">
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >Continue in Farcaster</span></wui-text
        >
        <wui-text align="center" variant="small-400" color="fg-200"
          >Accept connection request in the app</wui-text
        ></wui-flex
      >
      ${this.mobileLinkTemplate()}
    </wui-flex>`;
        }
        loaderTemplate() {
          let e = z.W.state.themeVariables["--w3m-border-radius-master"],
            t = e ? parseInt(e.replace("px", ""), 10) : 4;
          return (0, i.qy)`<wui-loading-thumbnail radius=${9 * t}></wui-loading-thumbnail>`;
        }
        async connectFarcaster() {
          if (this.authConnector)
            try {
              await this.authConnector?.provider.connectFarcaster(),
                this.socialProvider &&
                  (P.i.setConnectedSocialProvider(this.socialProvider),
                  $.E.sendEvent({
                    type: "track",
                    event: "SOCIAL_LOGIN_REQUEST_USER_DATA",
                    properties: { provider: this.socialProvider },
                  })),
                (this.loading = !0),
                await E.x.connectExternal(this.authConnector, this.authConnector.chain),
                this.socialProvider &&
                  $.E.sendEvent({
                    type: "track",
                    event: "SOCIAL_LOGIN_SUCCESS",
                    properties: { provider: this.socialProvider },
                  }),
                (this.loading = !1),
                R.W.close();
            } catch (e) {
              this.socialProvider &&
                $.E.sendEvent({
                  type: "track",
                  event: "SOCIAL_LOGIN_ERROR",
                  properties: { provider: this.socialProvider },
                }),
                d.I.goBack(),
                S.P.showError(e);
            }
        }
        mobileLinkTemplate() {
          return (0, i.qy)`<wui-button
      size="md"
      ?loading=${this.loading}
      ?disabled=${!this.uri || this.loading}
      @click=${() => {
        this.uri && g.w.openHref(this.uri, "_blank");
      }}
    >
      Open farcaster</wui-button
    >`;
        }
        onRenderProxy() {
          !this.ready &&
            this.uri &&
            (this.timeout = setTimeout(() => {
              this.ready = !0;
            }, 200));
        }
        qrCodeTemplate() {
          if (!this.uri || !this.ready) return null;
          let e = this.getBoundingClientRect().width - 40;
          return (0, i.qy)` <wui-qr-code
      size=${e}
      theme=${z.W.state.themeMode}
      uri=${this.uri}
      ?farcaster=${!0}
      data-testid="wui-qr-code"
      color=${(0, a.J)(z.W.state.themeVariables["--w3m-qr-color"])}
    ></wui-qr-code>`;
        }
        copyTemplate() {
          let e = !this.uri || !this.ready;
          return (0, i.qy)`<wui-link
      .disabled=${e}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`;
        }
        onCopyUri() {
          try {
            this.uri && (g.w.copyToClopboard(this.uri), S.P.showSuccess("Link copied"));
          } catch {
            S.P.showError("Failed to copy");
          }
        }
      };
      (U.styles = M),
        q([(0, r.wk)()], U.prototype, "socialProvider", void 0),
        q([(0, r.wk)()], U.prototype, "uri", void 0),
        q([(0, r.wk)()], U.prototype, "ready", void 0),
        q([(0, r.wk)()], U.prototype, "loading", void 0),
        (U = q([(0, l.EM)("w3m-connecting-farcaster-view")], U));
    },
    84538: (e, t, o) => {
      o(69550);
    },
  },
]);
