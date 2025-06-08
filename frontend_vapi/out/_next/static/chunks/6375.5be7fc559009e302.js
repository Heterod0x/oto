"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [6375],
  {
    5758: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      a(80352);
      var o = a(24957),
        n = a(93626);
      let s = (0, i.AH)`
  :host {
    position: relative;
    display: flex;
    width: 100%;
    height: 1px;
    background-color: var(--wui-color-gray-glass-005);
    justify-content: center;
    align-items: center;
  }

  :host > wui-text {
    position: absolute;
    padding: 0px 10px;
    background-color: var(--wui-color-modal-bg);
    transition: background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color;
  }
`;
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let l = class extends i.WF {
        constructor() {
          super(...arguments), (this.text = "");
        }
        render() {
          return (0, i.qy)`${this.template()}`;
        }
        template() {
          return this.text
            ? (0, i.qy)`<wui-text variant="small-500" color="fg-200">${this.text}</wui-text>`
            : null;
        }
      };
      (l.styles = [o.W5, s]),
        c([(0, r.MZ)()], l.prototype, "text", void 0),
        (l = c([(0, n.E)("wui-separator")], l));
    },
    15448: (e, t, a) => {
      a(33380);
    },
    21846: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      a(28563);
      var o = a(24957),
        n = a(93626);
      let s = (0, i.AH)`
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
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let l = class extends i.WF {
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
            a = "xl" === this.size,
            r = "gray" === this.background,
            o = "opaque" === this.background,
            n =
              ("accent-100" === this.backgroundColor && o) ||
              ("success-100" === this.backgroundColor && o) ||
              ("error-100" === this.backgroundColor && o) ||
              ("inverse-100" === this.backgroundColor && o),
            s = `var(--wui-color-${this.backgroundColor})`;
          return (
            n
              ? (s = `var(--wui-icon-box-bg-${this.backgroundColor})`)
              : r && (s = `var(--wui-color-gray-${this.backgroundColor})`),
            (this.style.cssText = `
       --local-bg-value: ${s};
       --local-bg-mix: ${n || r ? "100%" : t ? "12%" : "16%"};
       --local-border-radius: var(--wui-border-radius-${t ? "xxs" : a ? "s" : "3xl"});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${"wui-color-bg-125" === this.borderColor ? "2px" : "1px"} solid ${this.border ? `var(--${this.borderColor})` : "transparent"}
   `),
            (0, i.qy)` <wui-icon color=${this.iconColor} size=${e} name=${this.icon}></wui-icon> `
          );
        }
      };
      (l.styles = [o.W5, o.fD, s]),
        c([(0, r.MZ)()], l.prototype, "size", void 0),
        c([(0, r.MZ)()], l.prototype, "backgroundColor", void 0),
        c([(0, r.MZ)()], l.prototype, "iconColor", void 0),
        c([(0, r.MZ)()], l.prototype, "iconSize", void 0),
        c([(0, r.MZ)()], l.prototype, "background", void 0),
        c([(0, r.MZ)({ type: Boolean })], l.prototype, "border", void 0),
        c([(0, r.MZ)()], l.prototype, "borderColor", void 0),
        c([(0, r.MZ)()], l.prototype, "icon", void 0),
        (l = c([(0, n.E)("wui-icon-box")], l));
    },
    23125: (e, t, a) => {
      a(53015);
    },
    25841: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      a(28563);
      var o = a(24957),
        n = a(93626);
      let s = (0, i.AH)`
  button {
    border-radius: var(--local-border-radius);
    color: var(--wui-color-fg-100);
    padding: var(--local-padding);
  }

  @media (max-width: 700px) {
    button {
      padding: var(--wui-spacing-s);
    }
  }

  button > wui-icon {
    pointer-events: none;
  }

  button:disabled > wui-icon {
    color: var(--wui-color-bg-300) !important;
  }

  button:disabled {
    background-color: transparent;
  }
`;
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let l = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.size = "md"),
            (this.disabled = !1),
            (this.icon = "copy"),
            (this.iconColor = "inherit");
        }
        render() {
          let e = "lg" === this.size ? "--wui-border-radius-xs" : "--wui-border-radius-xxs",
            t = "lg" === this.size ? "--wui-spacing-1xs" : "--wui-spacing-2xs";
          return (
            (this.style.cssText = `
    --local-border-radius: var(${e});
    --local-padding: var(${t});
`),
            (0, i.qy)`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `
          );
        }
      };
      (l.styles = [o.W5, o.fD, o.ck, s]),
        c([(0, r.MZ)()], l.prototype, "size", void 0),
        c([(0, r.MZ)({ type: Boolean })], l.prototype, "disabled", void 0),
        c([(0, r.MZ)()], l.prototype, "icon", void 0),
        c([(0, r.MZ)()], l.prototype, "iconColor", void 0),
        (l = c([(0, n.E)("wui-icon-link")], l));
    },
    26469: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      a(53015), a(80352);
      var o = a(24957),
        n = a(93626);
      let s = (0, i.AH)`
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
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let l = {
          main: "inverse-100",
          inverse: "inverse-000",
          accent: "accent-100",
          "accent-error": "error-100",
          "accent-success": "success-100",
          neutral: "fg-100",
          disabled: "gray-glass-020",
        },
        u = { lg: "paragraph-600", md: "small-600" },
        d = { lg: "md", md: "md" },
        p = class extends i.WF {
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
            let e = this.textVariant ?? u[this.size];
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
              let e = d[this.size],
                t = this.disabled ? l.disabled : l[this.variant];
              return (0, i.qy)`<wui-loading-spinner color=${t} size=${e}></wui-loading-spinner>`;
            }
            return (0, i.qy)``;
          }
        };
      (p.styles = [o.W5, o.fD, s]),
        c([(0, r.MZ)()], p.prototype, "size", void 0),
        c([(0, r.MZ)({ type: Boolean })], p.prototype, "disabled", void 0),
        c([(0, r.MZ)({ type: Boolean })], p.prototype, "fullWidth", void 0),
        c([(0, r.MZ)({ type: Boolean })], p.prototype, "loading", void 0),
        c([(0, r.MZ)()], p.prototype, "variant", void 0),
        c([(0, r.MZ)({ type: Boolean })], p.prototype, "hasIconLeft", void 0),
        c([(0, r.MZ)({ type: Boolean })], p.prototype, "hasIconRight", void 0),
        c([(0, r.MZ)()], p.prototype, "borderRadius", void 0),
        c([(0, r.MZ)()], p.prototype, "textVariant", void 0),
        (p = c([(0, n.E)("wui-button")], p));
    },
    32390: (e, t, a) => {
      a.d(t, { a: () => r });
      var i = a(2776);
      let r = (0, i.JW)`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`;
    },
    33380: (e, t, a) => {
      var i = a(2776),
        r = a(8847),
        o = a(24957),
        n = a(93626);
      let s = (0, i.AH)`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let l = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.src = "./path/to/image.jpg"),
            (this.alt = "Image"),
            (this.size = void 0);
        }
        render() {
          return (
            (this.style.cssText = `
      --local-width: ${this.size ? `var(--wui-icon-size-${this.size});` : "100%"};
      --local-height: ${this.size ? `var(--wui-icon-size-${this.size});` : "100%"};
      `),
            (0, i.qy)`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`
          );
        }
        handleImageError() {
          this.dispatchEvent(new CustomEvent("onLoadError", { bubbles: !0, composed: !0 }));
        }
      };
      (l.styles = [o.W5, o.ck, s]),
        c([(0, r.MZ)()], l.prototype, "src", void 0),
        c([(0, r.MZ)()], l.prototype, "alt", void 0),
        c([(0, r.MZ)()], l.prototype, "size", void 0),
        (l = c([(0, n.E)("wui-image")], l));
    },
    43587: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      let o = (0, i.JW)`<svg width="86" height="96" fill="none">
  <path
    d="M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z"
  />
</svg>`;
      var n = a(32390);
      let s = (0, i.JW)`
  <svg fill="none" viewBox="0 0 36 40">
    <path
      d="M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z"
    />
  </svg>
`;
      a(28563), a(33380);
      var c = a(24957),
        l = a(93626);
      let u = (0, i.AH)`
  :host {
    position: relative;
    border-radius: inherit;
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-width);
    height: var(--local-height);
  }

  :host([data-round='true']) {
    background: var(--wui-color-gray-glass-002);
    border-radius: 100%;
    outline: 1px solid var(--wui-color-gray-glass-005);
  }

  svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    fill: var(--wui-color-gray-glass-002);
  }

  svg > path {
    stroke: var(--local-stroke);
  }

  wui-image {
    width: 100%;
    height: 100%;
    -webkit-clip-path: var(--local-path);
    clip-path: var(--local-path);
    background: var(--wui-color-gray-glass-002);
  }

  wui-icon {
    transform: translateY(-5%);
    width: var(--local-icon-size);
    height: var(--local-icon-size);
  }
`;
      var d = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let p = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.size = "md"),
            (this.name = "uknown"),
            (this.networkImagesBySize = { sm: s, md: n.a, lg: o }),
            (this.selected = !1),
            (this.round = !1);
        }
        render() {
          return (
            this.round
              ? ((this.dataset.round = "true"),
                (this.style.cssText = `
      --local-width: var(--wui-spacing-3xl);
      --local-height: var(--wui-spacing-3xl);
      --local-icon-size: var(--wui-spacing-l);
    `))
              : (this.style.cssText = `

      --local-path: var(--wui-path-network-${this.size});
      --local-width:  var(--wui-width-network-${this.size});
      --local-height:  var(--wui-height-network-${this.size});
      --local-icon-size:  var(--wui-icon-size-network-${this.size});
    `),
            (0, i.qy)`${this.templateVisual()} ${this.svgTemplate()} `
          );
        }
        svgTemplate() {
          return this.round ? null : this.networkImagesBySize[this.size];
        }
        templateVisual() {
          return this.imageSrc
            ? (0, i.qy)`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`
            : (0,
              i.qy)`<wui-icon size="inherit" color="fg-200" name="networkPlaceholder"></wui-icon>`;
        }
      };
      (p.styles = [c.W5, u]),
        d([(0, r.MZ)()], p.prototype, "size", void 0),
        d([(0, r.MZ)()], p.prototype, "name", void 0),
        d([(0, r.MZ)({ type: Object })], p.prototype, "networkImagesBySize", void 0),
        d([(0, r.MZ)()], p.prototype, "imageSrc", void 0),
        d([(0, r.MZ)({ type: Boolean })], p.prototype, "selected", void 0),
        d([(0, r.MZ)({ type: Boolean })], p.prototype, "round", void 0),
        (p = d([(0, l.E)("wui-network-image")], p));
    },
    53015: (e, t, a) => {
      var i = a(2776),
        r = a(8847),
        o = a(24957),
        n = a(93626);
      let s = (0, i.AH)`
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
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let l = class extends i.WF {
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
      (l.styles = [o.W5, s]),
        c([(0, r.MZ)()], l.prototype, "color", void 0),
        c([(0, r.MZ)()], l.prototype, "size", void 0),
        (l = c([(0, n.E)("wui-loading-spinner")], l));
    },
    54254: (e, t, a) => {
      var i = a(2776),
        r = a(8847),
        o = a(51685);
      a(28563), a(33380), a(53015), a(80352), a(7614);
      var n = a(24957),
        s = a(93626);
      a(21846);
      let c = (0, i.AH)`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;
      var l = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let u = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.tabIdx = void 0),
            (this.variant = "icon"),
            (this.disabled = !1),
            (this.imageSrc = void 0),
            (this.alt = void 0),
            (this.chevron = !1),
            (this.loading = !1);
        }
        render() {
          return (0, i.qy)`
      <button
        ?disabled=${!!this.loading || !!this.disabled}
        data-loading=${this.loading}
        data-iconvariant=${(0, o.J)(this.iconVariant)}
        tabindex=${(0, o.J)(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `;
        }
        visualTemplate() {
          if ("image" === this.variant && this.imageSrc)
            return (0,
            i.qy)`<wui-image src=${this.imageSrc} alt=${this.alt ?? "list item"}></wui-image>`;
          if ("square" === this.iconVariant && this.icon && "icon" === this.variant)
            return (0, i.qy)`<wui-icon name=${this.icon}></wui-icon>`;
          if ("icon" === this.variant && this.icon && this.iconVariant) {
            let e = ["blue", "square-blue"].includes(this.iconVariant) ? "accent-100" : "fg-200",
              t = "square-blue" === this.iconVariant ? "mdl" : "md",
              a = this.iconSize ? this.iconSize : t;
            return (0, i.qy)`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${a}
          background="transparent"
          iconColor=${e}
          backgroundColor=${e}
          size=${t}
        ></wui-icon-box>
      `;
          }
          return null;
        }
        loadingTemplate() {
          return this.loading
            ? (0, i.qy)`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`
            : (0, i.qy)``;
        }
        chevronTemplate() {
          return this.chevron
            ? (0, i.qy)`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`
            : null;
        }
      };
      (u.styles = [n.W5, n.fD, c]),
        l([(0, r.MZ)()], u.prototype, "icon", void 0),
        l([(0, r.MZ)()], u.prototype, "iconSize", void 0),
        l([(0, r.MZ)()], u.prototype, "tabIdx", void 0),
        l([(0, r.MZ)()], u.prototype, "variant", void 0),
        l([(0, r.MZ)()], u.prototype, "iconVariant", void 0),
        l([(0, r.MZ)({ type: Boolean })], u.prototype, "disabled", void 0),
        l([(0, r.MZ)()], u.prototype, "imageSrc", void 0),
        l([(0, r.MZ)()], u.prototype, "alt", void 0),
        l([(0, r.MZ)({ type: Boolean })], u.prototype, "chevron", void 0),
        l([(0, r.MZ)({ type: Boolean })], u.prototype, "loading", void 0),
        (u = l([(0, s.E)("wui-list-item")], u));
    },
    56787: (e, t, a) => {
      a(43587);
    },
    57658: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      a(28563), a(33380), a(7614);
      var o = a(24957),
        n = a(93626);
      a(21846);
      let s = (0, i.AH)`
  :host {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-size);
    height: var(--local-size);
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host([name='Extension'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  :host([data-wallet-icon='allWallets']) {
    background-color: var(--wui-all-wallets-bg-100);
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 18px;
    height: 18px;
  }

  wui-icon[data-parent-size='md'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='lg'] {
    width: 42px;
    height: 42px;
  }

  wui-icon[data-parent-size='full'] {
    width: 100%;
    height: 100%;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid var(--wui-color-bg-150, #1e1f1f);
    padding: 1px;
  }
`;
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let l = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.size = "md"),
            (this.name = ""),
            (this.installed = !1),
            (this.badgeSize = "xs");
        }
        render() {
          let e = "xxs";
          return (
            (e = "lg" === this.size ? "m" : "md" === this.size ? "xs" : "xxs"),
            (this.style.cssText = `
       --local-border-radius: var(--wui-border-radius-${e});
       --local-size: var(--wui-wallet-image-size-${this.size});
   `),
            this.walletIcon && (this.dataset.walletIcon = this.walletIcon),
            (0, i.qy)`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `
          );
        }
        templateVisual() {
          return this.imageSrc
            ? (0, i.qy)`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`
            : this.walletIcon
              ? (0, i.qy)`<wui-icon
        data-parent-size="md"
        size="md"
        color="inherit"
        name=${this.walletIcon}
      ></wui-icon>`
              : (0, i.qy)`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`;
        }
      };
      (l.styles = [o.fD, o.W5, s]),
        c([(0, r.MZ)()], l.prototype, "size", void 0),
        c([(0, r.MZ)()], l.prototype, "name", void 0),
        c([(0, r.MZ)()], l.prototype, "imageSrc", void 0),
        c([(0, r.MZ)()], l.prototype, "walletIcon", void 0),
        c([(0, r.MZ)({ type: Boolean })], l.prototype, "installed", void 0),
        c([(0, r.MZ)()], l.prototype, "badgeSize", void 0),
        (l = c([(0, n.E)("wui-wallet-image")], l));
    },
    57694: (e, t, a) => {
      a(57658);
    },
    61823: (e, t, a) => {
      a(26469);
    },
    66375: (e, t, a) => {
      a.r(t),
        a.d(t, {
          W3mPayLoadingView: () => B,
          W3mPayView: () => V,
          baseETH: () => J,
          baseSepoliaETH: () => Q,
          baseUSDC: () => X,
          getExchanges: () => Y,
          getIsPaymentInProgress: () => K,
          getPayError: () => F,
          getPayResult: () => H,
          openPay: () => G,
        });
      var i = a(2776),
        r = a(8847),
        o = a(51685),
        n = a(38426),
        s = a(90588),
        c = a(20420),
        l = a(71644),
        u = a(7679),
        d = a(26115),
        p = a(10021);
      a(61823),
        a(79824),
        a(69846),
        a(75830),
        a(25841),
        a(15448),
        a(54254),
        a(23125),
        a(56787),
        a(5758),
        a(77740),
        a(57694);
      var h = a(28908),
        g = a(86836),
        w = a(75888),
        v = a(93462),
        y = a(53346),
        m = a(84962),
        b = a(4852);
      let f = {
          INVALID_PAYMENT_CONFIG: "INVALID_PAYMENT_CONFIG",
          INVALID_RECIPIENT: "INVALID_RECIPIENT",
          INVALID_ASSET: "INVALID_ASSET",
          INVALID_AMOUNT: "INVALID_AMOUNT",
          UNKNOWN_ERROR: "UNKNOWN_ERROR",
          UNABLE_TO_INITIATE_PAYMENT: "UNABLE_TO_INITIATE_PAYMENT",
          INVALID_CHAIN_NAMESPACE: "INVALID_CHAIN_NAMESPACE",
          GENERIC_PAYMENT_ERROR: "GENERIC_PAYMENT_ERROR",
          UNABLE_TO_GET_EXCHANGES: "UNABLE_TO_GET_EXCHANGES",
          ASSET_NOT_SUPPORTED: "ASSET_NOT_SUPPORTED",
          UNABLE_TO_GET_PAY_URL: "UNABLE_TO_GET_PAY_URL",
          UNABLE_TO_GET_BUY_STATUS: "UNABLE_TO_GET_BUY_STATUS",
        },
        x = {
          [f.INVALID_PAYMENT_CONFIG]: "Invalid payment configuration",
          [f.INVALID_RECIPIENT]: "Invalid recipient address",
          [f.INVALID_ASSET]: "Invalid asset specified",
          [f.INVALID_AMOUNT]: "Invalid payment amount",
          [f.UNKNOWN_ERROR]: "Unknown payment error occurred",
          [f.UNABLE_TO_INITIATE_PAYMENT]: "Unable to initiate payment",
          [f.INVALID_CHAIN_NAMESPACE]: "Invalid chain namespace",
          [f.GENERIC_PAYMENT_ERROR]: "Unable to process payment",
          [f.UNABLE_TO_GET_EXCHANGES]: "Unable to get exchanges",
          [f.ASSET_NOT_SUPPORTED]: "Asset not supported by the selected exchange",
          [f.UNABLE_TO_GET_PAY_URL]: "Unable to get payment URL",
          [f.UNABLE_TO_GET_BUY_STATUS]: "Unable to get buy status",
        };
      class E extends Error {
        get message() {
          return x[this.code];
        }
        constructor(e, t) {
          super(x[e]),
            (this.name = "AppKitPayError"),
            (this.code = e),
            (this.details = t),
            Error.captureStackTrace && Error.captureStackTrace(this, E);
        }
      }
      var I = a(19495);
      class P extends Error {}
      async function A(e, t) {
        let a = (function () {
            let e = I.H.getSnapshot().projectId;
            return `https://rpc.walletconnect.org/v1/json-rpc?projectId=${e}`;
          })(),
          i = await fetch(a, {
            method: "POST",
            body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: e, params: t }),
            headers: { "Content-Type": "application/json" },
          }),
          r = await i.json();
        if (r.error) throw new P(r.error.message);
        return r;
      }
      async function k(e) {
        return (await A("reown_getExchanges", e)).result;
      }
      async function N(e) {
        return (await A("reown_getExchangePayUrl", e)).result;
      }
      async function _(e) {
        return (await A("reown_getExchangeBuyStatus", e)).result;
      }
      let T = ["eip155"],
        S = {
          eip155: {
            native: { assetNamespace: "slip44", assetReference: "60" },
            defaultTokenNamespace: "erc20",
          },
          solana: {
            native: { assetNamespace: "slip44", assetReference: "501" },
            defaultTokenNamespace: "token",
          },
        };
      function C(e, t) {
        let { chainNamespace: a, chainId: i } = w.C.parseCaipNetworkId(e),
          r = S[a];
        if (!r) throw Error(`Unsupported chain namespace for CAIP-19 formatting: ${a}`);
        let o = r.native.assetNamespace,
          n = r.native.assetReference;
        "native" !== t && ((o = r.defaultTokenNamespace), (n = t));
        let s = `${a}:${i}`;
        return `${s}/${o}:${n}`;
      }
      var R = a(89280);
      async function $(e) {
        let {
            paymentAssetNetwork: t,
            activeCaipNetwork: a,
            approvedCaipNetworkIds: i,
            requestedCaipNetworks: r,
          } = e,
          o = l.w.sortRequestedNetworks(i, r).find((e) => e.caipNetworkId === t);
        if (!o) throw new E(f.INVALID_PAYMENT_CONFIG);
        if (o.caipNetworkId === a.caipNetworkId) return;
        let n = s.W.getNetworkProp("supportsAllNetworks", o.chainNamespace);
        if (!(i?.includes(o.caipNetworkId) || n)) throw new E(f.INVALID_PAYMENT_CONFIG);
        try {
          await s.W.switchActiveNetwork(o);
        } catch (e) {
          throw new E(f.GENERIC_PAYMENT_ERROR, e);
        }
      }
      async function z(e, t, a) {
        if (t !== v.o.CHAIN.EVM) throw new E(f.INVALID_CHAIN_NAMESPACE);
        if (!a.fromAddress)
          throw new E(f.INVALID_PAYMENT_CONFIG, "fromAddress is required for native EVM payments.");
        let i = "string" == typeof a.amount ? parseFloat(a.amount) : a.amount;
        if (isNaN(i)) throw new E(f.INVALID_PAYMENT_CONFIG);
        let r = e.metadata?.decimals ?? 18,
          o = d.x.parseUnits(i.toString(), r);
        if ("bigint" != typeof o) throw new E(f.GENERIC_PAYMENT_ERROR);
        return (
          (await d.x.sendTransaction({
            chainNamespace: t,
            to: a.recipient,
            address: a.fromAddress,
            value: o,
            data: "0x",
          })) ?? void 0
        );
      }
      async function M(e, t) {
        if (!t.fromAddress)
          throw new E(f.INVALID_PAYMENT_CONFIG, "fromAddress is required for ERC20 EVM payments.");
        let a = e.asset,
          i = t.recipient,
          r = Number(e.metadata.decimals),
          o = d.x.parseUnits(t.amount.toString(), r);
        if (void 0 === o) throw new E(f.GENERIC_PAYMENT_ERROR);
        return (
          (await d.x.writeContract({
            fromAddress: t.fromAddress,
            tokenAddress: a,
            args: [i, o],
            method: "transfer",
            abi: R.v.getERC20Abi(a),
            chainNamespace: v.o.CHAIN.EVM,
          })) ?? void 0
        );
      }
      let O = "unknown",
        L = (0, h.BX)({
          paymentAsset: {
            network: "eip155:1",
            asset: "0x0",
            metadata: { name: "0x0", symbol: "0x0", decimals: 0 },
          },
          recipient: "0x0",
          amount: 0,
          isConfigured: !1,
          error: null,
          isPaymentInProgress: !1,
          exchanges: [],
          isLoading: !1,
          openInNewTab: !0,
          redirectUrl: void 0,
          payWithExchange: void 0,
          currentPayment: void 0,
          analyticsSet: !1,
          paymentId: void 0,
        }),
        U = {
          state: L,
          subscribe: (e) => (0, h.B1)(L, () => e(L)),
          subscribeKey: (e, t) => (0, g.u$)(L, e, t),
          async handleOpenPay(e) {
            this.resetState(),
              this.setPaymentConfig(e),
              this.subscribeEvents(),
              this.initializeAnalytics(),
              (L.isConfigured = !0),
              y.E.sendEvent({
                type: "track",
                event: "PAY_MODAL_OPEN",
                properties: {
                  exchanges: L.exchanges,
                  configuration: {
                    network: L.paymentAsset.network,
                    asset: L.paymentAsset.asset,
                    recipient: L.recipient,
                    amount: L.amount,
                  },
                },
              }),
              await c.W.open({ view: "Pay" });
          },
          resetState() {
            (L.paymentAsset = {
              network: "eip155:1",
              asset: "0x0",
              metadata: { name: "0x0", symbol: "0x0", decimals: 0 },
            }),
              (L.recipient = "0x0"),
              (L.amount = 0),
              (L.isConfigured = !1),
              (L.error = null),
              (L.isPaymentInProgress = !1),
              (L.isLoading = !1),
              (L.currentPayment = void 0);
          },
          setPaymentConfig(e) {
            if (!e.paymentAsset) throw new E(f.INVALID_PAYMENT_CONFIG);
            try {
              (L.paymentAsset = e.paymentAsset),
                (L.recipient = e.recipient),
                (L.amount = e.amount),
                (L.openInNewTab = e.openInNewTab ?? !0),
                (L.redirectUrl = e.redirectUrl),
                (L.payWithExchange = e.payWithExchange),
                (L.error = null);
            } catch (e) {
              throw new E(f.INVALID_PAYMENT_CONFIG, e.message);
            }
          },
          getPaymentAsset: () => L.paymentAsset,
          getExchanges: () => L.exchanges,
          async fetchExchanges() {
            try {
              L.isLoading = !0;
              let e = await k({
                page: 0,
                asset: C(L.paymentAsset.network, L.paymentAsset.asset),
                amount: L.amount.toString(),
              });
              L.exchanges = e.exchanges.slice(0, 2);
            } catch (e) {
              throw (u.P.showError(x.UNABLE_TO_GET_EXCHANGES), new E(f.UNABLE_TO_GET_EXCHANGES));
            } finally {
              L.isLoading = !1;
            }
          },
          async getAvailableExchanges(e) {
            try {
              let t = e?.asset && e?.network ? C(e.network, e.asset) : void 0;
              return await k({ page: e?.page ?? 0, asset: t, amount: e?.amount?.toString() });
            } catch (e) {
              throw new E(f.UNABLE_TO_GET_EXCHANGES);
            }
          },
          async getPayUrl(e, t, a = !1) {
            try {
              let i = Number(t.amount),
                r = await N({
                  exchangeId: e,
                  asset: C(t.network, t.asset),
                  amount: i.toString(),
                  recipient: `${t.network}:${t.recipient}`,
                });
              return (
                y.E.sendEvent({
                  type: "track",
                  event: "PAY_EXCHANGE_SELECTED",
                  properties: {
                    exchange: { id: e },
                    configuration: {
                      network: t.network,
                      asset: t.asset,
                      recipient: t.recipient,
                      amount: i,
                    },
                    currentPayment: { type: "exchange", exchangeId: e },
                    headless: a,
                  },
                }),
                a &&
                  (this.initiatePayment(),
                  y.E.sendEvent({
                    type: "track",
                    event: "PAY_INITIATED",
                    properties: {
                      paymentId: L.paymentId || O,
                      configuration: {
                        network: t.network,
                        asset: t.asset,
                        recipient: t.recipient,
                        amount: i,
                      },
                      currentPayment: { type: "exchange", exchangeId: e },
                    },
                  })),
                r
              );
            } catch (e) {
              if (e instanceof Error && e.message.includes("is not supported"))
                throw new E(f.ASSET_NOT_SUPPORTED);
              throw Error(e.message);
            }
          },
          async openPayUrl(e, t, a = !1) {
            try {
              let i = await this.getPayUrl(e.exchangeId, t, a);
              if (!i) throw new E(f.UNABLE_TO_GET_PAY_URL);
              let r = e.openInNewTab ?? !0;
              return l.w.openHref(i.url, r ? "_blank" : "_self"), i;
            } catch (e) {
              throw (
                (e instanceof E ? (L.error = e.message) : (L.error = x.GENERIC_PAYMENT_ERROR),
                new E(f.UNABLE_TO_GET_PAY_URL))
              );
            }
          },
          subscribeEvents() {
            L.isConfigured ||
              (b.A.subscribeProviders(async (e) => {
                let t = s.W.state.activeChain;
                b.A.getProvider(t) && (await this.handlePayment());
              }),
              n.U.subscribeKey("caipAddress", async (e) => {
                e && (await this.handlePayment());
              }));
          },
          async handlePayment() {
            L.currentPayment = { type: "wallet", status: "IN_PROGRESS" };
            let e = n.U.state.caipAddress;
            if (!e) return;
            let { chainId: t, address: a } = w.C.parseCaipAddress(e),
              i = s.W.state.activeChain;
            if (!a || !t || !i || !b.A.getProvider(i)) return;
            let r = s.W.state.activeCaipNetwork;
            if (r && !L.isPaymentInProgress)
              try {
                this.initiatePayment();
                let e = s.W.getAllRequestedCaipNetworks(),
                  t = s.W.getAllApprovedCaipNetworkIds();
                if (
                  (await $({
                    paymentAssetNetwork: L.paymentAsset.network,
                    activeCaipNetwork: r,
                    approvedCaipNetworkIds: t,
                    requestedCaipNetworks: e,
                  }),
                  await c.W.open({ view: "PayLoading" }),
                  i === v.o.CHAIN.EVM)
                )
                  "native" === L.paymentAsset.asset &&
                    (L.currentPayment.result = await z(L.paymentAsset, i, {
                      recipient: L.recipient,
                      amount: L.amount,
                      fromAddress: a,
                    })),
                    L.paymentAsset.asset.startsWith("0x") &&
                      (L.currentPayment.result = await M(L.paymentAsset, {
                        recipient: L.recipient,
                        amount: L.amount,
                        fromAddress: a,
                      })),
                    (L.currentPayment.status = "SUCCESS");
                else throw new E(f.INVALID_CHAIN_NAMESPACE);
              } catch (e) {
                e instanceof E ? (L.error = e.message) : (L.error = x.GENERIC_PAYMENT_ERROR),
                  (L.currentPayment.status = "FAILED"),
                  u.P.showError(L.error);
              } finally {
                L.isPaymentInProgress = !1;
              }
          },
          getExchangeById: (e) => L.exchanges.find((t) => t.id === e),
          validatePayConfig(e) {
            let { paymentAsset: t, recipient: a, amount: i } = e;
            if (!t) throw new E(f.INVALID_PAYMENT_CONFIG);
            if (!a) throw new E(f.INVALID_RECIPIENT);
            if (!t.asset) throw new E(f.INVALID_ASSET);
            if (null == i || i <= 0) throw new E(f.INVALID_AMOUNT);
          },
          handlePayWithWallet() {
            let e = n.U.state.caipAddress;
            if (!e) return void m.I.push("Connect");
            let { chainId: t, address: a } = w.C.parseCaipAddress(e),
              i = s.W.state.activeChain;
            if (!a || !t || !i) return void m.I.push("Connect");
            this.handlePayment();
          },
          async handlePayWithExchange(e) {
            try {
              L.currentPayment = { type: "exchange", exchangeId: e };
              let { network: t, asset: a } = L.paymentAsset,
                i = { network: t, asset: a, amount: L.amount, recipient: L.recipient },
                r = await this.getPayUrl(e, i);
              if (!r) throw new E(f.UNABLE_TO_INITIATE_PAYMENT);
              return (
                (L.currentPayment.sessionId = r.sessionId),
                (L.currentPayment.status = "IN_PROGRESS"),
                (L.currentPayment.exchangeId = e),
                this.initiatePayment(),
                { url: r.url, openInNewTab: L.openInNewTab }
              );
            } catch (e) {
              return (
                e instanceof E ? (L.error = e.message) : (L.error = x.GENERIC_PAYMENT_ERROR),
                (L.isPaymentInProgress = !1),
                u.P.showError(L.error),
                null
              );
            }
          },
          async getBuyStatus(e, t) {
            try {
              let a = await _({ sessionId: t, exchangeId: e });
              return (
                ("SUCCESS" === a.status || "FAILED" === a.status) &&
                  y.E.sendEvent({
                    type: "track",
                    event: "SUCCESS" === a.status ? "PAY_SUCCESS" : "PAY_ERROR",
                    properties: {
                      paymentId: L.paymentId || O,
                      configuration: {
                        network: L.paymentAsset.network,
                        asset: L.paymentAsset.asset,
                        recipient: L.recipient,
                        amount: L.amount,
                      },
                      currentPayment: {
                        type: "exchange",
                        exchangeId: L.currentPayment?.exchangeId,
                        sessionId: L.currentPayment?.sessionId,
                        result: a.txHash,
                      },
                    },
                  }),
                a
              );
            } catch (e) {
              throw new E(f.UNABLE_TO_GET_BUY_STATUS);
            }
          },
          async updateBuyStatus(e, t) {
            try {
              let a = await this.getBuyStatus(e, t);
              L.currentPayment &&
                ((L.currentPayment.status = a.status), (L.currentPayment.result = a.txHash)),
                ("SUCCESS" === a.status || "FAILED" === a.status) && (L.isPaymentInProgress = !1);
            } catch (e) {
              throw new E(f.UNABLE_TO_GET_BUY_STATUS);
            }
          },
          initiatePayment() {
            (L.isPaymentInProgress = !0), (L.paymentId = crypto.randomUUID());
          },
          initializeAnalytics() {
            L.analyticsSet ||
              ((L.analyticsSet = !0),
              this.subscribeKey("isPaymentInProgress", (e) => {
                if (L.currentPayment?.status && "UNKNOWN" !== L.currentPayment.status) {
                  let e = {
                    IN_PROGRESS: "PAY_INITIATED",
                    SUCCESS: "PAY_SUCCESS",
                    FAILED: "PAY_ERROR",
                  }[L.currentPayment.status];
                  y.E.sendEvent({
                    type: "track",
                    event: e,
                    properties: {
                      paymentId: L.paymentId || O,
                      configuration: {
                        network: L.paymentAsset.network,
                        asset: L.paymentAsset.asset,
                        recipient: L.recipient,
                        amount: L.amount,
                      },
                      currentPayment: {
                        type: L.currentPayment.type,
                        exchangeId: L.currentPayment.exchangeId,
                        sessionId: L.currentPayment.sessionId,
                        result: L.currentPayment.result,
                      },
                    },
                  });
                }
              }));
          },
        },
        W = (0, i.AH)`
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }

  .token-display {
    padding: var(--wui-spacing-s) var(--wui-spacing-m);
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-bg-125);
    margin-top: var(--wui-spacing-s);
    margin-bottom: var(--wui-spacing-s);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--wui-spacing-xs);
  }
`;
      var D = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let V = class extends i.WF {
        constructor() {
          super(),
            (this.unsubscribe = []),
            (this.amount = ""),
            (this.tokenSymbol = ""),
            (this.networkName = ""),
            (this.exchanges = U.state.exchanges),
            (this.isLoading = U.state.isLoading),
            (this.loadingExchangeId = null),
            (this.connectedWalletInfo = n.U.state.connectedWalletInfo),
            this.initializePaymentDetails(),
            this.unsubscribe.push(U.subscribeKey("exchanges", (e) => (this.exchanges = e))),
            this.unsubscribe.push(U.subscribeKey("isLoading", (e) => (this.isLoading = e))),
            this.unsubscribe.push(
              n.U.subscribe((e) => (this.connectedWalletInfo = e.connectedWalletInfo)),
            ),
            U.fetchExchanges();
        }
        get isWalletConnected() {
          return "connected" === n.U.state.status;
        }
        render() {
          return (0, i.qy)`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0", "l", "l", "l"]} gap="s">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="s">
            ${this.renderPayWithWallet()} ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `;
        }
        initializePaymentDetails() {
          let e = U.getPaymentAsset();
          (this.networkName = e.network),
            (this.tokenSymbol = e.metadata.symbol),
            (this.amount = U.state.amount.toString());
        }
        renderPayWithWallet() {
          return !(function (e) {
            let { chainNamespace: t } = w.C.parseCaipNetworkId(e);
            return T.includes(t);
          })(this.networkName)
            ? (0, i.qy)``
            : (0, i.qy)`<wui-flex flexDirection="column" gap="s">
        ${this.isWalletConnected ? this.renderConnectedView() : this.renderDisconnectedView()}
      </wui-flex>
      <wui-separator text="or"></wui-separator>`;
        }
        renderPaymentHeader() {
          let e = this.networkName;
          if (this.networkName) {
            let t = s.W.getAllRequestedCaipNetworks().find(
              (e) => e.caipNetworkId === this.networkName,
            );
            t && (e = t.name);
          }
          return (0, i.qy)`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="xs">
          <wui-text variant="large-700" color="fg-100">${this.amount || "0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="xxs">
            <wui-text variant="paragraph-600" color="fg-100">
              ${this.tokenSymbol || "Unknown Asset"}
            </wui-text>
            ${
              e
                ? ((0, i.qy))`
                  <wui-text variant="small-500" color="fg-200"> on ${e} </wui-text>
                `
                : ""
            }
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `;
        }
        renderConnectedView() {
          let e = this.connectedWalletInfo?.name || "connected wallet";
          return (0, i.qy)`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        data-testid="wallet-payment-option"
      >
        <wui-flex alignItems="center" gap="s">
          <wui-wallet-image
            size="sm"
            imageSrc=${(0, o.J)(this.connectedWalletInfo?.icon)}
            name=${(0, o.J)(this.connectedWalletInfo?.name)}
          ></wui-wallet-image>
          <wui-text variant="paragraph-500" color="inherit">Pay with ${e}</wui-text>
        </wui-flex>
      </wui-list-item>

      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="disconnect"
        @click=${this.onDisconnect}
        data-testid="disconnect-button"
        ?chevron=${!1}
      >
        <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
      </wui-list-item>
    `;
        }
        renderDisconnectedView() {
          return (0, i.qy)`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="walletPlaceholder"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="paragraph-500" color="inherit">Pay from wallet</wui-text>
    </wui-list-item>`;
        }
        renderExchangeOptions() {
          return this.isLoading
            ? (0, i.qy)`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`
            : 0 === this.exchanges.length
              ? (0, i.qy)`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="paragraph-500" color="fg-100">No exchanges available</wui-text>
      </wui-flex>`
              : this.exchanges.map(
                  (e) => (0, i.qy)`
        <wui-list-item
          @click=${() => this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${null !== this.loadingExchangeId}
        >
          <wui-flex alignItems="center" gap="s">
            ${
              this.loadingExchangeId === e.id
                ? (
                    (0, i.qy)
                  )`<wui-loading-spinner color="accent-100" size="md"></wui-loading-spinner>`
                : ((0, i.qy))`<wui-wallet-image
                  size="sm"
                  imageSrc=${(0, o.J)(e.imageUrl)}
                  name=${e.name}
                ></wui-wallet-image>`
            }
            <wui-text flexGrow="1" variant="paragraph-500" color="inherit"
              >Pay with ${e.name} <wui-spinner size="sm" color="fg-200"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `,
                );
        }
        onWalletPayment() {
          U.handlePayWithWallet();
        }
        async onExchangePayment(e) {
          try {
            this.loadingExchangeId = e;
            let t = await U.handlePayWithExchange(e);
            t &&
              (await c.W.open({ view: "PayLoading" }),
              l.w.openHref(t.url, t.openInNewTab ? "_blank" : "_self"));
          } catch (e) {
            console.error("Failed to pay with exchange", e),
              u.P.showError("Failed to pay with exchange");
          } finally {
            this.loadingExchangeId = null;
          }
        }
        async onDisconnect(e) {
          e.stopPropagation();
          try {
            await d.x.disconnect(), c.W.close();
          } catch {
            console.error("Failed to disconnect"), u.P.showError("Failed to disconnect");
          }
        }
        disconnectedCallback() {
          this.unsubscribe.forEach((e) => e());
        }
      };
      (V.styles = W),
        D([(0, r.wk)()], V.prototype, "amount", void 0),
        D([(0, r.wk)()], V.prototype, "tokenSymbol", void 0),
        D([(0, r.wk)()], V.prototype, "networkName", void 0),
        D([(0, r.wk)()], V.prototype, "exchanges", void 0),
        D([(0, r.wk)()], V.prototype, "isLoading", void 0),
        D([(0, r.wk)()], V.prototype, "loadingExchangeId", void 0),
        D([(0, r.wk)()], V.prototype, "connectedWalletInfo", void 0),
        (V = D([(0, p.EM)("w3m-pay-view")], V));
      var j = a(32736);
      a(84219);
      let Z = (0, i.AH)`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }
`;
      var q = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let B = class extends i.WF {
        constructor() {
          super(),
            (this.loadingMessage = ""),
            (this.subMessage = ""),
            (this.paymentState = "in-progress"),
            (this.paymentState = U.state.isPaymentInProgress ? "in-progress" : "completed"),
            this.updateMessages(),
            this.setupSubscription(),
            this.setupExchangeSubscription();
        }
        disconnectedCallback() {
          clearInterval(this.exchangeSubscription);
        }
        render() {
          return (0, i.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xl", "xl", "xl", "xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center"> ${this.getStateIcon()} </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            ${this.loadingMessage}
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            ${this.subMessage}
          </wui-text>
        </wui-flex>
      </wui-flex>
    `;
        }
        updateMessages() {
          switch (this.paymentState) {
            case "completed":
              (this.loadingMessage = "Payment completed"),
                (this.subMessage = "Your transaction has been successfully processed");
              break;
            case "error":
              (this.loadingMessage = "Payment failed"),
                (this.subMessage = "There was an error processing your transaction");
              break;
            default:
              U.state.currentPayment?.type === "exchange"
                ? ((this.loadingMessage = "Payment initiated"),
                  (this.subMessage = "Please complete the payment on the exchange"))
                : ((this.loadingMessage = "Awaiting payment confirmation"),
                  (this.subMessage = "Please confirm the payment transaction in your wallet"));
          }
        }
        getStateIcon() {
          switch (this.paymentState) {
            case "completed":
              return this.successTemplate();
            case "error":
              return this.errorTemplate();
            default:
              return this.loaderTemplate();
          }
        }
        setupExchangeSubscription() {
          U.state.currentPayment?.type === "exchange" &&
            (this.exchangeSubscription = setInterval(async () => {
              let e = U.state.currentPayment?.exchangeId,
                t = U.state.currentPayment?.sessionId;
              e &&
                t &&
                (await U.updateBuyStatus(e, t),
                U.state.currentPayment?.status === "SUCCESS" &&
                  clearInterval(this.exchangeSubscription));
            }, 4e3));
        }
        setupSubscription() {
          U.subscribeKey("isPaymentInProgress", (e) => {
            e ||
              "in-progress" !== this.paymentState ||
              (U.state.error || !U.state.currentPayment?.result
                ? (this.paymentState = "error")
                : (this.paymentState = "completed"),
              this.updateMessages(),
              setTimeout(() => {
                "disconnected" !== d.x.state.status && c.W.close();
              }, 3e3));
          }),
            U.subscribeKey("error", (e) => {
              e &&
                "in-progress" === this.paymentState &&
                ((this.paymentState = "error"), this.updateMessages());
            });
        }
        loaderTemplate() {
          let e = j.W.state.themeVariables["--w3m-border-radius-master"],
            t = e ? parseInt(e.replace("px", ""), 10) : 4;
          return (0, i.qy)`<wui-loading-thumbnail radius=${9 * t}></wui-loading-thumbnail>`;
        }
        successTemplate() {
          return (0, i.qy)`<wui-icon size="xl" color="success-100" name="checkmark"></wui-icon>`;
        }
        errorTemplate() {
          return (0, i.qy)`<wui-icon size="xl" color="error-100" name="close"></wui-icon>`;
        }
      };
      async function G(e) {
        return U.handleOpenPay(e);
      }
      function Y() {
        return U.getExchanges();
      }
      function H() {
        return U.state.currentPayment?.result;
      }
      function F() {
        return U.state.error;
      }
      function K() {
        return U.state.isPaymentInProgress;
      }
      (B.styles = Z),
        q([(0, r.wk)()], B.prototype, "loadingMessage", void 0),
        q([(0, r.wk)()], B.prototype, "subMessage", void 0),
        q([(0, r.wk)()], B.prototype, "paymentState", void 0),
        (B = q([(0, p.EM)("w3m-pay-loading-view")], B));
      let J = {
          network: "eip155:8453",
          asset: "native",
          metadata: { name: "Ethereum", symbol: "ETH", decimals: 18 },
        },
        X = {
          network: "eip155:8453",
          asset: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
          metadata: { name: "USD Coin", symbol: "USDC", decimals: 6 },
        },
        Q = {
          network: "eip155:84532",
          asset: "native",
          metadata: { name: "Ethereum", symbol: "ETH", decimals: 18 },
        };
    },
    69846: (e, t, a) => {
      a(28563);
    },
    75830: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      a(28563);
      var o = a(24957),
        n = a(93626);
      let s = (0, i.AH)`
  :host {
    position: relative;
  }

  button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    width: 100%;
    background-color: var(--wui-color-accent-glass-010);
    border-radius: var(--wui-border-radius-xs);
    border: 1px solid var(--wui-color-accent-glass-010);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  wui-tooltip {
    padding: 7px var(--wui-spacing-s) 8px var(--wui-spacing-s);
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translate(-50%, -100%);
    opacity: 0;
    display: none;
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }
  }
`;
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let l = class extends i.WF {
        constructor() {
          super(...arguments), (this.text = ""), (this.icon = "card");
        }
        render() {
          return (0, i.qy)`<button>
      <wui-icon color="accent-100" name=${this.icon} size="lg"></wui-icon>
    </button>`;
        }
      };
      (l.styles = [o.W5, o.fD, s]),
        c([(0, r.MZ)()], l.prototype, "text", void 0),
        c([(0, r.MZ)()], l.prototype, "icon", void 0),
        (l = c([(0, n.E)("wui-icon-button")], l));
    },
    84219: (e, t, a) => {
      var i = a(2776),
        r = a(8847),
        o = a(24957),
        n = a(93626);
      let s = (0, i.AH)`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          n = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          n = Reflect.decorate(e, t, a, i);
        else
          for (var s = e.length - 1; s >= 0; s--)
            (r = e[s]) && (n = (o < 3 ? r(n) : o > 3 ? r(t, a, n) : r(t, a)) || n);
        return o > 3 && n && Object.defineProperty(t, a, n), n;
      };
      let l = class extends i.WF {
        constructor() {
          super(...arguments), (this.radius = 36);
        }
        render() {
          return this.svgLoaderTemplate();
        }
        svgLoaderTemplate() {
          let e = this.radius > 50 ? 50 : this.radius,
            t = 36 - e;
          return (0, i.qy)`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${e}
          stroke-dasharray="${116 + t} ${245 + t}"
          stroke-dashoffset=${360 + 1.75 * t}
        />
      </svg>
    `;
        }
      };
      (l.styles = [o.W5, s]),
        c([(0, r.MZ)({ type: Number })], l.prototype, "radius", void 0),
        (l = c([(0, n.E)("wui-loading-thumbnail")], l));
    },
  },
]);
