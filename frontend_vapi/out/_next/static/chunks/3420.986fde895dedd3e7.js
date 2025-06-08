"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [3420],
  {
    3688: (t, i, o) => {
      o.d(i, { _: () => s, K: () => c });
      var a = o(90258),
        r = o(50017),
        e = o(23840);
      let s = () => new n();
      class n {}
      let l = new WeakMap(),
        c = (0, e.u$)(
          class extends r.Kq {
            render(t) {
              return a.s6;
            }
            update(t, [i]) {
              let o = i !== this.G;
              return (
                o && void 0 !== this.G && this.rt(void 0),
                (o || this.lt !== this.ct) &&
                  ((this.G = i), (this.ht = t.options?.host), this.rt((this.ct = t.element))),
                a.s6
              );
            }
            rt(t) {
              if ((this.isConnected || (t = void 0), "function" == typeof this.G)) {
                let i = this.ht ?? globalThis,
                  o = l.get(i);
                void 0 === o && ((o = new WeakMap()), l.set(i, o)),
                  void 0 !== o.get(this.G) && this.G.call(this.ht, void 0),
                  o.set(this.G, t),
                  void 0 !== t && this.G.call(this.ht, t);
              } else this.G.value = t;
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
    21846: (t, i, o) => {
      var a = o(2776),
        r = o(8847);
      o(28563);
      var e = o(24957),
        s = o(93626);
      let n = (0, a.AH)`
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
      var l = function (t, i, o, a) {
        var r,
          e = arguments.length,
          s = e < 3 ? i : null === a ? (a = Object.getOwnPropertyDescriptor(i, o)) : a;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(t, i, o, a);
        else
          for (var n = t.length - 1; n >= 0; n--)
            (r = t[n]) && (s = (e < 3 ? r(s) : e > 3 ? r(i, o, s) : r(i, o)) || s);
        return e > 3 && s && Object.defineProperty(i, o, s), s;
      };
      let c = class extends a.WF {
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
          let t = this.iconSize || this.size,
            i = "lg" === this.size,
            o = "xl" === this.size,
            r = "gray" === this.background,
            e = "opaque" === this.background,
            s =
              ("accent-100" === this.backgroundColor && e) ||
              ("success-100" === this.backgroundColor && e) ||
              ("error-100" === this.backgroundColor && e) ||
              ("inverse-100" === this.backgroundColor && e),
            n = `var(--wui-color-${this.backgroundColor})`;
          return (
            s
              ? (n = `var(--wui-icon-box-bg-${this.backgroundColor})`)
              : r && (n = `var(--wui-color-gray-${this.backgroundColor})`),
            (this.style.cssText = `
       --local-bg-value: ${n};
       --local-bg-mix: ${s || r ? "100%" : i ? "12%" : "16%"};
       --local-border-radius: var(--wui-border-radius-${i ? "xxs" : o ? "s" : "3xl"});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${"wui-color-bg-125" === this.borderColor ? "2px" : "1px"} solid ${this.border ? `var(--${this.borderColor})` : "transparent"}
   `),
            (0, a.qy)` <wui-icon color=${this.iconColor} size=${t} name=${this.icon}></wui-icon> `
          );
        }
      };
      (c.styles = [e.W5, e.fD, n]),
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
    26469: (t, i, o) => {
      var a = o(2776),
        r = o(8847);
      o(53015), o(80352);
      var e = o(24957),
        s = o(93626);
      let n = (0, a.AH)`
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
      var l = function (t, i, o, a) {
        var r,
          e = arguments.length,
          s = e < 3 ? i : null === a ? (a = Object.getOwnPropertyDescriptor(i, o)) : a;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(t, i, o, a);
        else
          for (var n = t.length - 1; n >= 0; n--)
            (r = t[n]) && (s = (e < 3 ? r(s) : e > 3 ? r(i, o, s) : r(i, o)) || s);
        return e > 3 && s && Object.defineProperty(i, o, s), s;
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
        p = class extends a.WF {
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
            let t = this.textVariant ?? d[this.size];
            return (0, a.qy)`
      <button
        data-variant=${this.variant}
        data-icon-left=${this.hasIconLeft}
        data-icon-right=${this.hasIconRight}
        data-size=${this.size}
        ?disabled=${this.disabled}
      >
        ${this.loadingTemplate()}
        <slot name="iconLeft" @slotchange=${() => this.handleSlotLeftChange()}></slot>
        <wui-text variant=${t} color="inherit">
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
              let t = u[this.size],
                i = this.disabled ? c.disabled : c[this.variant];
              return (0, a.qy)`<wui-loading-spinner color=${i} size=${t}></wui-loading-spinner>`;
            }
            return (0, a.qy)``;
          }
        };
      (p.styles = [e.W5, e.fD, n]),
        l([(0, r.MZ)()], p.prototype, "size", void 0),
        l([(0, r.MZ)({ type: Boolean })], p.prototype, "disabled", void 0),
        l([(0, r.MZ)({ type: Boolean })], p.prototype, "fullWidth", void 0),
        l([(0, r.MZ)({ type: Boolean })], p.prototype, "loading", void 0),
        l([(0, r.MZ)()], p.prototype, "variant", void 0),
        l([(0, r.MZ)({ type: Boolean })], p.prototype, "hasIconLeft", void 0),
        l([(0, r.MZ)({ type: Boolean })], p.prototype, "hasIconRight", void 0),
        l([(0, r.MZ)()], p.prototype, "borderRadius", void 0),
        l([(0, r.MZ)()], p.prototype, "textVariant", void 0),
        (p = l([(0, s.E)("wui-button")], p));
    },
    40829: (t, i, o) => {
      var a = o(2776),
        r = o(8847),
        e = o(17938),
        s = o(51685),
        n = o(3688);
      o(28563);
      var l = o(24957),
        c = o(93626);
      let d = (0, a.AH)`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  input {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
    color: var(--wui-color-fg-100);
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      box-shadow var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color, box-shadow;
    caret-color: var(--wui-color-accent-100);
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  input:disabled::placeholder,
  input:disabled + wui-icon {
    color: var(--wui-color-fg-300);
  }

  input::placeholder {
    color: var(--wui-color-fg-275);
  }

  input:focus:enabled {
    background-color: var(--wui-color-gray-glass-005);
    -webkit-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  input:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px var(--wui-spacing-s);
  }

  wui-icon + .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px 36px;
  }

  wui-icon[data-input='sm'] {
    left: var(--wui-spacing-s);
  }

  .wui-size-md {
    padding: 15px var(--wui-spacing-m) var(--wui-spacing-l) var(--wui-spacing-m);
  }

  wui-icon + .wui-size-md,
  wui-loading-spinner + .wui-size-md {
    padding: 10.5px var(--wui-spacing-3xl) 10.5px var(--wui-spacing-3xl);
  }

  wui-icon[data-input='md'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-lg {
    padding: var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-l);
    letter-spacing: var(--wui-letter-spacing-medium-title);
    font-size: var(--wui-font-size-medium-title);
    font-weight: var(--wui-font-weight-light);
    line-height: 130%;
    color: var(--wui-color-fg-100);
    height: 64px;
  }

  .wui-padding-right-xs {
    padding-right: var(--wui-spacing-xs);
  }

  .wui-padding-right-s {
    padding-right: var(--wui-spacing-s);
  }

  .wui-padding-right-m {
    padding-right: var(--wui-spacing-m);
  }

  .wui-padding-right-l {
    padding-right: var(--wui-spacing-l);
  }

  .wui-padding-right-xl {
    padding-right: var(--wui-spacing-xl);
  }

  .wui-padding-right-2xl {
    padding-right: var(--wui-spacing-2xl);
  }

  .wui-padding-right-3xl {
    padding-right: var(--wui-spacing-3xl);
  }

  .wui-padding-right-4xl {
    padding-right: var(--wui-spacing-4xl);
  }

  .wui-padding-right-5xl {
    padding-right: var(--wui-spacing-5xl);
  }

  wui-icon + .wui-size-lg,
  wui-loading-spinner + .wui-size-lg {
    padding-left: 50px;
  }

  wui-icon[data-input='lg'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-m) 17.25px var(--wui-spacing-m);
  }
  wui-icon + .wui-size-mdl,
  wui-loading-spinner + .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-3xl) 17.25px 40px;
  }
  wui-icon[data-input='mdl'] {
    left: var(--wui-spacing-m);
  }

  input:placeholder-shown ~ ::slotted(wui-input-element),
  input:placeholder-shown ~ ::slotted(wui-icon) {
    opacity: 0;
    pointer-events: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  ::slotted(wui-input-element),
  ::slotted(wui-icon) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  ::slotted(wui-input-element) {
    right: var(--wui-spacing-m);
  }

  ::slotted(wui-icon) {
    right: 0px;
  }
`;
      var u = function (t, i, o, a) {
        var r,
          e = arguments.length,
          s = e < 3 ? i : null === a ? (a = Object.getOwnPropertyDescriptor(i, o)) : a;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(t, i, o, a);
        else
          for (var n = t.length - 1; n >= 0; n--)
            (r = t[n]) && (s = (e < 3 ? r(s) : e > 3 ? r(i, o, s) : r(i, o)) || s);
        return e > 3 && s && Object.defineProperty(i, o, s), s;
      };
      let p = class extends a.WF {
        constructor() {
          super(...arguments),
            (this.inputElementRef = (0, n._)()),
            (this.size = "md"),
            (this.disabled = !1),
            (this.placeholder = ""),
            (this.type = "text"),
            (this.value = "");
        }
        render() {
          let t = `wui-padding-right-${this.inputRightPadding}`,
            i = { [`wui-size-${this.size}`]: !0, [t]: !!this.inputRightPadding };
          return (0, a.qy)`${this.templateIcon()}
      <input
        data-testid="wui-input-text"
        ${(0, n.K)(this.inputElementRef)}
        class=${(0, e.H)(i)}
        type=${this.type}
        enterkeyhint=${(0, s.J)(this.enterKeyHint)}
        ?disabled=${this.disabled}
        placeholder=${this.placeholder}
        @input=${this.dispatchInputChangeEvent.bind(this)}
        .value=${this.value || ""}
        tabindex=${(0, s.J)(this.tabIdx)}
      />
      <slot></slot>`;
        }
        templateIcon() {
          return this.icon
            ? (0, a.qy)`<wui-icon
        data-input=${this.size}
        size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`
            : null;
        }
        dispatchInputChangeEvent() {
          this.dispatchEvent(
            new CustomEvent("inputChange", {
              detail: this.inputElementRef.value?.value,
              bubbles: !0,
              composed: !0,
            }),
          );
        }
      };
      (p.styles = [l.W5, l.fD, d]),
        u([(0, r.MZ)()], p.prototype, "size", void 0),
        u([(0, r.MZ)()], p.prototype, "icon", void 0),
        u([(0, r.MZ)({ type: Boolean })], p.prototype, "disabled", void 0),
        u([(0, r.MZ)()], p.prototype, "placeholder", void 0),
        u([(0, r.MZ)()], p.prototype, "type", void 0),
        u([(0, r.MZ)()], p.prototype, "keyHint", void 0),
        u([(0, r.MZ)()], p.prototype, "value", void 0),
        u([(0, r.MZ)()], p.prototype, "inputRightPadding", void 0),
        u([(0, r.MZ)()], p.prototype, "tabIdx", void 0),
        (p = u([(0, c.E)("wui-input-text")], p));
    },
    53015: (t, i, o) => {
      var a = o(2776),
        r = o(8847),
        e = o(24957),
        s = o(93626);
      let n = (0, a.AH)`
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
      var l = function (t, i, o, a) {
        var r,
          e = arguments.length,
          s = e < 3 ? i : null === a ? (a = Object.getOwnPropertyDescriptor(i, o)) : a;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(t, i, o, a);
        else
          for (var n = t.length - 1; n >= 0; n--)
            (r = t[n]) && (s = (e < 3 ? r(s) : e > 3 ? r(i, o, s) : r(i, o)) || s);
        return e > 3 && s && Object.defineProperty(i, o, s), s;
      };
      let c = class extends a.WF {
        constructor() {
          super(...arguments), (this.color = "accent-100"), (this.size = "lg");
        }
        render() {
          return (
            (this.style.cssText = `--local-color: ${"inherit" === this.color ? "inherit" : `var(--wui-color-${this.color})`}`),
            (this.dataset.size = this.size),
            (0, a.qy)`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`
          );
        }
      };
      (c.styles = [e.W5, n]),
        l([(0, r.MZ)()], c.prototype, "color", void 0),
        l([(0, r.MZ)()], c.prototype, "size", void 0),
        (c = l([(0, s.E)("wui-loading-spinner")], c));
    },
    61823: (t, i, o) => {
      o(26469);
    },
  },
]);
