"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [5146],
  {
    1377: (e, t, a) => {
      a(11071);
    },
    7390: (e, t, a) => {
      a(21846);
    },
    11071: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      a(80352);
      var o = a(24957),
        s = a(93626);
      let n = (0, i.AH)`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`;
      var l = function (e, t, a, i) {
        var r,
          o = arguments.length,
          s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, a, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
        return o > 3 && s && Object.defineProperty(t, a, s), s;
      };
      let c = class extends i.WF {
        constructor() {
          super(...arguments), (this.variant = "main"), (this.size = "lg");
        }
        render() {
          (this.dataset.variant = this.variant), (this.dataset.size = this.size);
          let e = "md" === this.size ? "mini-700" : "micro-700";
          return (0, i.qy)`
      <wui-text data-variant=${this.variant} variant=${e} color="inherit">
        <slot></slot>
      </wui-text>
    `;
        }
      };
      (c.styles = [o.W5, n]),
        l([(0, r.MZ)()], c.prototype, "variant", void 0),
        l([(0, r.MZ)()], c.prototype, "size", void 0),
        (c = l([(0, s.E)("wui-tag")], c));
    },
    15146: (e, t, a) => {
      a.r(t),
        a.d(t, {
          W3mApproveTransactionView: () => g,
          W3mRegisterAccountNameSuccess: () => W,
          W3mRegisterAccountNameView: () => I,
          W3mUpgradeWalletView: () => p,
        });
      var i = a(2776),
        r = a(8847),
        o = a(68550),
        s = a(20420),
        n = a(97798),
        l = a(32736),
        c = a(10021);
      let u = (0, i.AH)`
  div {
    width: 100%;
  }

  [data-ready='false'] {
    transform: scale(1.05);
  }

  @media (max-width: 430px) {
    [data-ready='false'] {
      transform: translateY(-50px);
    }
  }
`;
      var d = function (e, t, a, i) {
        var r,
          o = arguments.length,
          s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, a, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
        return o > 3 && s && Object.defineProperty(t, a, s), s;
      };
      let g = class extends i.WF {
        constructor() {
          super(),
            (this.bodyObserver = void 0),
            (this.unsubscribe = []),
            (this.iframe = document.getElementById("w3m-iframe")),
            (this.ready = !1),
            this.unsubscribe.push(
              s.W.subscribeKey("open", (e) => {
                e || this.onHideIframe();
              }),
              s.W.subscribeKey("shake", (e) => {
                e
                  ? (this.iframe.style.animation = "w3m-shake 500ms var(--wui-ease-out-power-2)")
                  : (this.iframe.style.animation = "none");
              }),
            );
        }
        disconnectedCallback() {
          this.onHideIframe(),
            this.unsubscribe.forEach((e) => e()),
            this.bodyObserver?.unobserve(window.document.body);
        }
        async firstUpdated() {
          await this.syncTheme(), (this.iframe.style.display = "block");
          let e = this?.renderRoot?.querySelector("div");
          (this.bodyObserver = new ResizeObserver((t) => {
            let a = t?.[0]?.contentBoxSize,
              i = a?.[0]?.inlineSize;
            (this.iframe.style.height = "600px"),
              (e.style.height = "600px"),
              i && i <= 430
                ? ((this.iframe.style.width = "100%"),
                  (this.iframe.style.left = "0px"),
                  (this.iframe.style.bottom = "0px"),
                  (this.iframe.style.top = "unset"))
                : ((this.iframe.style.width = "360px"),
                  (this.iframe.style.left = "calc(50% - 180px)"),
                  (this.iframe.style.top = "calc(50% - 300px + 32px)"),
                  (this.iframe.style.bottom = "unset")),
              (this.ready = !0),
              this.onShowIframe();
          })),
            this.bodyObserver.observe(window.document.body);
        }
        render() {
          return (0, i.qy)`<div data-ready=${this.ready} id="w3m-frame-container"></div>`;
        }
        onShowIframe() {
          let e = window.innerWidth <= 430;
          this.iframe.style.animation = e
            ? "w3m-iframe-zoom-in-mobile 200ms var(--wui-ease-out-power-2)"
            : "w3m-iframe-zoom-in 200ms var(--wui-ease-out-power-2)";
        }
        onHideIframe() {
          (this.iframe.style.display = "none"),
            (this.iframe.style.animation = "w3m-iframe-fade-out 200ms var(--wui-ease-out-power-2)");
        }
        async syncTheme() {
          let e = n.a.getAuthConnector();
          if (e) {
            let t = l.W.getSnapshot().themeMode,
              a = l.W.getSnapshot().themeVariables;
            await e.provider.syncTheme({ themeVariables: a, w3mThemeVariables: (0, o.o)(a, t) });
          }
        }
      };
      (g.styles = u),
        d([(0, r.wk)()], g.prototype, "ready", void 0),
        (g = d([(0, c.EM)("w3m-approve-transaction-view")], g));
      var h = a(13316);
      a(90760), a(79824), a(77740);
      let p = class extends i.WF {
        render() {
          return (0, i.qy)`
      <wui-flex flexDirection="column" alignItems="center" gap="xl" padding="xl">
        <wui-text variant="paragraph-400" color="fg-100">Follow the instructions on</wui-text>
        <wui-chip
          icon="externalLink"
          variant="fill"
          href=${h.oU.SECURE_SITE_DASHBOARD}
          imageSrc=${h.oU.SECURE_SITE_FAVICON}
          data-testid="w3m-secure-website-button"
        >
        </wui-chip>
        <wui-text variant="small-400" color="fg-200">
          You will have to reconnect for security reasons
        </wui-text>
      </wui-flex>
    `;
        }
      };
      p = (function (e, t, a, i) {
        var r,
          o = arguments.length,
          s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, a, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
        return o > 3 && s && Object.defineProperty(t, a, s), s;
      })([(0, c.EM)("w3m-upgrade-wallet-view")], p);
      var v = a(3688),
        w = a(93462),
        m = a(77182),
        f = a(38426),
        b = a(71644),
        y = a(90588),
        x = a(53346),
        k = a(7679),
        S = a(51685);
      a(53015), a(80352);
      var $ = a(24957),
        R = a(93626);
      a(40829);
      let E = (0, i.AH)`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  .error {
    margin: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-0) var(--wui-spacing-m);
  }

  .base-name {
    position: absolute;
    right: 45px;
    top: 15px;
    text-align: right;
  }
`;
      var T = function (e, t, a, i) {
        var r,
          o = arguments.length,
          s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, a, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
        return o > 3 && s && Object.defineProperty(t, a, s), s;
      };
      let A = class extends i.WF {
        constructor() {
          super(...arguments), (this.disabled = !1), (this.loading = !1);
        }
        render() {
          return (0, i.qy)`
      <wui-input-text
        value=${(0, S.J)(this.value)}
        ?disabled=${this.disabled}
        .value=${this.value || ""}
        data-testid="wui-ens-input"
        inputRightPadding="5xl"
      >
        ${this.baseNameTemplate()} ${this.errorTemplate()}${this.loadingTemplate()}
      </wui-input-text>
    `;
        }
        baseNameTemplate() {
          return (0, i.qy)`<wui-text variant="paragraph-400" color="fg-200" class="base-name">
      ${w.o.WC_NAME_SUFFIX}
    </wui-text>`;
        }
        loadingTemplate() {
          return this.loading
            ? (0, i.qy)`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`
            : null;
        }
        errorTemplate() {
          return this.errorMessage
            ? (0, i.qy)`<wui-text variant="tiny-500" color="error-100" class="error"
        >${this.errorMessage}</wui-text
      >`
            : null;
        }
      };
      (A.styles = [$.W5, E]),
        T([(0, r.MZ)()], A.prototype, "errorMessage", void 0),
        T([(0, r.MZ)({ type: Boolean })], A.prototype, "disabled", void 0),
        T([(0, r.MZ)()], A.prototype, "value", void 0),
        T([(0, r.MZ)({ type: Boolean })], A.prototype, "loading", void 0),
        (A = T([(0, R.E)("wui-ens-input")], A)),
        a(69846),
        a(25841),
        a(23125),
        a(1377);
      var M = a(15256);
      let N = (0, i.AH)`
  wui-flex {
    width: 100%;
  }

  .suggestion {
    background: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }

  .suggestion:hover {
    background-color: var(--wui-color-gray-glass-005);
    cursor: pointer;
  }

  .suggested-name {
    max-width: 75%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  form {
    width: 100%;
  }

  wui-icon-link {
    position: absolute;
    right: 20px;
    transform: translateY(11px);
  }
`;
      var O = function (e, t, a, i) {
        var r,
          o = arguments.length,
          s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, a, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
        return o > 3 && s && Object.defineProperty(t, a, s), s;
      };
      let I = class extends i.WF {
        constructor() {
          super(),
            (this.formRef = (0, v._)()),
            (this.usubscribe = []),
            (this.name = ""),
            (this.error = ""),
            (this.loading = m.f.state.loading),
            (this.suggestions = m.f.state.suggestions),
            (this.registered = !1),
            (this.profileName = f.U.state.profileName),
            (this.onDebouncedNameInputChange = b.w.debounce((e) => {
              m.f.validateName(e)
                ? ((this.error = ""),
                  (this.name = e),
                  m.f.getSuggestions(e),
                  m.f.isNameRegistered(e).then((e) => {
                    this.registered = e;
                  }))
                : e.length < 4
                  ? (this.error = "Name must be at least 4 characters long")
                  : (this.error = "Can only contain letters, numbers and - characters");
            })),
            this.usubscribe.push(
              m.f.subscribe((e) => {
                (this.suggestions = e.suggestions), (this.loading = e.loading);
              }),
              f.U.subscribeKey("profileName", (e) => {
                (this.profileName = e), e && (this.error = "You already own a name");
              }),
            );
        }
        firstUpdated() {
          this.formRef.value?.addEventListener("keydown", this.onEnterKey.bind(this));
        }
        disconnectedCallback() {
          super.disconnectedCallback(),
            this.usubscribe.forEach((e) => e()),
            this.formRef.value?.removeEventListener("keydown", this.onEnterKey.bind(this));
        }
        render() {
          return (0, i.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="m"
        .padding=${["0", "s", "m", "s"]}
      >
        <form ${(0, v.K)(this.formRef)} @submit=${this.onSubmitName.bind(this)}>
          <wui-ens-input
            @inputChange=${this.onNameInputChange.bind(this)}
            .errorMessage=${this.error}
            .value=${this.name}
          >
          </wui-ens-input>
          ${this.submitButtonTemplate()}
          <input type="submit" hidden />
        </form>
        ${this.templateSuggestions()}
      </wui-flex>
    `;
        }
        submitButtonTemplate() {
          return this.isAllowedToSubmit()
            ? (0, i.qy)`
          <wui-icon-link
            size="sm"
            icon="chevronRight"
            iconcolor="accent-100"
            @click=${this.onSubmitName.bind(this)}
          >
          </wui-icon-link>
        `
            : null;
        }
        onSelectSuggestion(e) {
          return () => {
            (this.name = e), (this.registered = !1), this.requestUpdate();
          };
        }
        onNameInputChange(e) {
          this.onDebouncedNameInputChange(e.detail);
        }
        nameSuggestionTagTemplate() {
          return this.loading
            ? (0, i.qy)`<wui-loading-spinner size="lg" color="fg-100"></wui-loading-spinner>`
            : this.registered
              ? (0, i.qy)`<wui-tag variant="shade" size="lg">Registered</wui-tag>`
              : (0, i.qy)`<wui-tag variant="success" size="lg">Available</wui-tag>`;
        }
        templateSuggestions() {
          if (!this.name || this.name.length < 4 || this.error) return null;
          let e = this.registered ? this.suggestions.filter((e) => e.name !== this.name) : [];
          return (0, i.qy)`<wui-flex flexDirection="column" gap="xxs" alignItems="center">
      <wui-flex
        data-testid="account-name-suggestion"
        .padding=${["m", "m", "m", "m"]}
        justifyContent="space-between"
        class="suggestion"
        @click=${this.onSubmitName.bind(this)}
      >
        <wui-text color="fg-100" variant="paragraph-400" class="suggested-name">
          ${this.name}</wui-text
        >${this.nameSuggestionTagTemplate()}
      </wui-flex>
      ${e.map((e) => this.availableNameTemplate(e.name))}
    </wui-flex>`;
        }
        availableNameTemplate(e) {
          return (0, i.qy)` <wui-flex
      data-testid="account-name-suggestion"
      .padding=${["m", "m", "m", "m"]}
      justifyContent="space-between"
      class="suggestion"
      @click=${this.onSelectSuggestion(e)}
    >
      <wui-text color="fg-100" variant="paragraph-400" class="suggested-name">
        ${e}
      </wui-text>
      <wui-tag variant="success" size="lg">Available</wui-tag>
    </wui-flex>`;
        }
        isAllowedToSubmit() {
          return (
            !this.loading &&
            !this.registered &&
            !this.error &&
            !this.profileName &&
            m.f.validateName(this.name)
          );
        }
        async onSubmitName() {
          let e = y.W.state.activeChain;
          try {
            if (!this.isAllowedToSubmit()) return;
            let t = `${this.name}${w.o.WC_NAME_SUFFIX}`;
            x.E.sendEvent({
              type: "track",
              event: "REGISTER_NAME_INITIATED",
              properties: {
                isSmartAccount:
                  f.U.state.preferredAccountTypes?.[e] === M.Vl.ACCOUNT_TYPES.SMART_ACCOUNT,
                ensName: t,
              },
            }),
              await m.f.registerName(t),
              x.E.sendEvent({
                type: "track",
                event: "REGISTER_NAME_SUCCESS",
                properties: {
                  isSmartAccount:
                    f.U.state.preferredAccountTypes?.[e] === M.Vl.ACCOUNT_TYPES.SMART_ACCOUNT,
                  ensName: t,
                },
              });
          } catch (t) {
            k.P.showError(t.message),
              x.E.sendEvent({
                type: "track",
                event: "REGISTER_NAME_ERROR",
                properties: {
                  isSmartAccount:
                    f.U.state.preferredAccountTypes?.[e] === M.Vl.ACCOUNT_TYPES.SMART_ACCOUNT,
                  ensName: `${this.name}${w.o.WC_NAME_SUFFIX}`,
                  error: t?.message || "Unknown error",
                },
              });
          }
        }
        onEnterKey(e) {
          "Enter" === e.key && this.isAllowedToSubmit() && this.onSubmitName();
        }
      };
      (I.styles = N),
        O([(0, r.MZ)()], I.prototype, "errorMessage", void 0),
        O([(0, r.wk)()], I.prototype, "name", void 0),
        O([(0, r.wk)()], I.prototype, "error", void 0),
        O([(0, r.wk)()], I.prototype, "loading", void 0),
        O([(0, r.wk)()], I.prototype, "suggestions", void 0),
        O([(0, r.wk)()], I.prototype, "registered", void 0),
        O([(0, r.wk)()], I.prototype, "profileName", void 0),
        (I = O([(0, c.EM)("w3m-register-account-name-view")], I));
      var C = a(37687),
        z = a(84962);
      a(61823), a(7390), a(16877);
      let j = (0, i.AH)`
  .continue-button-container {
    width: 100%;
  }
`,
        W = class extends i.WF {
          render() {
            return (0, i.qy)`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        gap="xxl"
        .padding=${["0", "0", "l", "0"]}
      >
        ${this.onboardingTemplate()} ${this.buttonsTemplate()}
        <wui-link
          @click=${() => {
            b.w.openHref(C.T.URLS.FAQ, "_blank");
          }}
        >
          Learn more
          <wui-icon color="inherit" slot="iconRight" name="externalLink"></wui-icon>
        </wui-link>
      </wui-flex>
    `;
          }
          onboardingTemplate() {
            return (0, i.qy)` <wui-flex
      flexDirection="column"
      gap="xxl"
      alignItems="center"
      .padding=${["0", "xxl", "0", "xxl"]}
    >
      <wui-flex gap="s" alignItems="center" justifyContent="center">
        <wui-icon-box
          size="xl"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>
      <wui-flex flexDirection="column" alignItems="center" gap="s">
        <wui-text align="center" variant="medium-600" color="fg-100">
          Account name chosen successfully
        </wui-text>
        <wui-text align="center" variant="paragraph-400" color="fg-100">
          You can now fund your account and trade crypto
        </wui-text>
      </wui-flex>
    </wui-flex>`;
          }
          buttonsTemplate() {
            return (0, i.qy)`<wui-flex
      .padding=${["0", "2l", "0", "2l"]}
      gap="s"
      class="continue-button-container"
    >
      <wui-button fullWidth size="lg" borderRadius="xs" @click=${this.redirectToAccount.bind(this)}
        >Let's Go!
      </wui-button>
    </wui-flex>`;
          }
          redirectToAccount() {
            z.I.replace("Account");
          }
        };
      (W.styles = j),
        (W = (function (e, t, a, i) {
          var r,
            o = arguments.length,
            s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
          if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(e, t, a, i);
          else
            for (var n = e.length - 1; n >= 0; n--)
              (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
          return o > 3 && s && Object.defineProperty(t, a, s), s;
        })([(0, c.EM)("w3m-register-account-name-success-view")], W));
    },
    16877: (e, t, a) => {
      var i = a(2776),
        r = a(8847),
        o = a(51685);
      a(80352);
      var s = a(24957),
        n = a(93626);
      let l = (0, i.AH)`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`;
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, a, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
        return o > 3 && s && Object.defineProperty(t, a, s), s;
      };
      let u = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.tabIdx = void 0),
            (this.disabled = !1),
            (this.color = "inherit");
        }
        render() {
          return (0, i.qy)`
      <button ?disabled=${this.disabled} tabindex=${(0, o.J)(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `;
        }
      };
      (u.styles = [s.W5, s.fD, l]),
        c([(0, r.MZ)()], u.prototype, "tabIdx", void 0),
        c([(0, r.MZ)({ type: Boolean })], u.prototype, "disabled", void 0),
        c([(0, r.MZ)()], u.prototype, "color", void 0),
        (u = c([(0, n.E)("wui-link")], u));
    },
    23125: (e, t, a) => {
      a(53015);
    },
    25841: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      a(28563);
      var o = a(24957),
        s = a(93626);
      let n = (0, i.AH)`
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
      var l = function (e, t, a, i) {
        var r,
          o = arguments.length,
          s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, a, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
        return o > 3 && s && Object.defineProperty(t, a, s), s;
      };
      let c = class extends i.WF {
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
      (c.styles = [o.W5, o.fD, o.ck, n]),
        l([(0, r.MZ)()], c.prototype, "size", void 0),
        l([(0, r.MZ)({ type: Boolean })], c.prototype, "disabled", void 0),
        l([(0, r.MZ)()], c.prototype, "icon", void 0),
        l([(0, r.MZ)()], c.prototype, "iconColor", void 0),
        (c = l([(0, s.E)("wui-icon-link")], c));
    },
    33380: (e, t, a) => {
      var i = a(2776),
        r = a(8847),
        o = a(24957),
        s = a(93626);
      let n = (0, i.AH)`
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
      var l = function (e, t, a, i) {
        var r,
          o = arguments.length,
          s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, a, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
        return o > 3 && s && Object.defineProperty(t, a, s), s;
      };
      let c = class extends i.WF {
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
      (c.styles = [o.W5, o.ck, n]),
        l([(0, r.MZ)()], c.prototype, "src", void 0),
        l([(0, r.MZ)()], c.prototype, "alt", void 0),
        l([(0, r.MZ)()], c.prototype, "size", void 0),
        (c = l([(0, s.E)("wui-image")], c));
    },
    37687: (e, t, a) => {
      a.d(t, { T: () => i });
      let i = { URLS: { FAQ: "https://walletconnect.com/faq" } };
    },
    69846: (e, t, a) => {
      a(28563);
    },
    90760: (e, t, a) => {
      var i = a(2776),
        r = a(8847);
      a(28563), a(33380), a(80352);
      var o = a(24957),
        s = a(12350),
        n = a(93626);
      let l = (0, i.AH)`
  a {
    border: 1px solid var(--wui-color-gray-glass-010);
    border-radius: var(--wui-border-radius-3xl);
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  a.disabled > wui-icon:not(.image-icon),
  a.disabled > wui-image {
    filter: grayscale(1);
  }

  a[data-variant='fill'] {
    color: var(--wui-color-inverse-100);
    background-color: var(--wui-color-accent-100);
  }

  a[data-variant='shade'],
  a[data-variant='shadeSmall'] {
    background-color: transparent;
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  a[data-variant='success'] {
    column-gap: var(--wui-spacing-xxs);
    border: 1px solid var(--wui-color-success-glass-010);
    background-color: var(--wui-color-success-glass-010);
    color: var(--wui-color-success-100);
  }

  a[data-variant='error'] {
    column-gap: var(--wui-spacing-xxs);
    border: 1px solid var(--wui-color-error-glass-010);
    background-color: var(--wui-color-error-glass-010);
    color: var(--wui-color-error-100);
  }

  a[data-variant='transparent'] {
    column-gap: var(--wui-spacing-xxs);
    background-color: transparent;
    color: var(--wui-color-fg-150);
  }

  a[data-variant='transparent'],
  a[data-variant='success'],
  a[data-variant='shadeSmall'],
  a[data-variant='error'] {
    padding: 7px var(--wui-spacing-s) 7px 10px;
  }

  a[data-variant='transparent']:has(wui-text:first-child),
  a[data-variant='success']:has(wui-text:first-child),
  a[data-variant='shadeSmall']:has(wui-text:first-child),
  a[data-variant='error']:has(wui-text:first-child) {
    padding: 7px var(--wui-spacing-s);
  }

  a[data-variant='fill'],
  a[data-variant='shade'] {
    column-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xxs) var(--wui-spacing-m) var(--wui-spacing-xxs)
      var(--wui-spacing-xs);
  }

  a[data-variant='fill']:has(wui-text:first-child),
  a[data-variant='shade']:has(wui-text:first-child) {
    padding: 9px var(--wui-spacing-m) 9px var(--wui-spacing-m);
  }

  a[data-variant='fill'] > wui-image,
  a[data-variant='shade'] > wui-image {
    width: 24px;
    height: 24px;
  }

  a[data-variant='fill'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-accent-090);
  }

  a[data-variant='shade'] > wui-image,
  a[data-variant='shadeSmall'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  a[data-variant='fill'] > wui-icon:not(.image-icon),
  a[data-variant='shade'] > wui-icon:not(.image-icon) {
    width: 14px;
    height: 14px;
  }

  a[data-variant='transparent'] > wui-image,
  a[data-variant='success'] > wui-image,
  a[data-variant='shadeSmall'] > wui-image,
  a[data-variant='error'] > wui-image {
    width: 14px;
    height: 14px;
  }

  a[data-variant='transparent'] > wui-icon:not(.image-icon),
  a[data-variant='success'] > wui-icon:not(.image-icon),
  a[data-variant='shadeSmall'] > wui-icon:not(.image-icon),
  a[data-variant='error'] > wui-icon:not(.image-icon) {
    width: 12px;
    height: 12px;
  }

  a[data-variant='fill']:focus-visible {
    background-color: var(--wui-color-accent-090);
  }

  a[data-variant='shade']:focus-visible,
  a[data-variant='shadeSmall']:focus-visible {
    background-color: var(--wui-color-gray-glass-015);
  }

  a[data-variant='transparent']:focus-visible {
    background-color: var(--wui-color-gray-glass-005);
  }

  a[data-variant='success']:focus-visible {
    background-color: var(--wui-color-success-glass-015);
  }

  a[data-variant='error']:focus-visible {
    background-color: var(--wui-color-error-glass-015);
  }

  a.disabled {
    color: var(--wui-color-gray-glass-015);
    background-color: var(--wui-color-gray-glass-015);
    pointer-events: none;
  }

  @media (hover: hover) and (pointer: fine) {
    a[data-variant='fill']:hover {
      background-color: var(--wui-color-accent-090);
    }

    a[data-variant='shade']:hover,
    a[data-variant='shadeSmall']:hover {
      background-color: var(--wui-color-gray-glass-015);
    }

    a[data-variant='transparent']:hover {
      background-color: var(--wui-color-gray-glass-005);
    }

    a[data-variant='success']:hover {
      background-color: var(--wui-color-success-glass-015);
    }

    a[data-variant='error']:hover {
      background-color: var(--wui-color-error-glass-015);
    }
  }

  a[data-variant='fill']:active {
    background-color: var(--wui-color-accent-080);
  }

  a[data-variant='shade']:active,
  a[data-variant='shadeSmall']:active {
    background-color: var(--wui-color-gray-glass-020);
  }

  a[data-variant='transparent']:active {
    background-color: var(--wui-color-gray-glass-010);
  }

  a[data-variant='success']:active {
    background-color: var(--wui-color-success-glass-020);
  }

  a[data-variant='error']:active {
    background-color: var(--wui-color-error-glass-020);
  }
`;
      var c = function (e, t, a, i) {
        var r,
          o = arguments.length,
          s = o < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, a)) : i;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(e, t, a, i);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (r = e[n]) && (s = (o < 3 ? r(s) : o > 3 ? r(t, a, s) : r(t, a)) || s);
        return o > 3 && s && Object.defineProperty(t, a, s), s;
      };
      let u = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.variant = "fill"),
            (this.imageSrc = void 0),
            (this.imageIcon = void 0),
            (this.imageIconSize = "md"),
            (this.disabled = !1),
            (this.icon = "externalLink"),
            (this.href = ""),
            (this.text = void 0);
        }
        render() {
          let e =
            "success" === this.variant ||
            "transparent" === this.variant ||
            "shadeSmall" === this.variant;
          return (0, i.qy)`
      <a
        rel="noreferrer"
        target="_blank"
        href=${this.href}
        class=${this.disabled ? "disabled" : ""}
        data-variant=${this.variant}
      >
        ${this.imageTemplate()}
        <wui-text variant=${e ? "small-600" : "paragraph-600"} color="inherit">
          ${this.title ? this.title : s.Z.getHostName(this.href)}
        </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </a>
    `;
        }
        imageTemplate() {
          return this.imageSrc
            ? (0, i.qy)`<wui-image src=${this.imageSrc}></wui-image>`
            : this.imageIcon
              ? (0, i.qy)`<wui-icon
        name=${this.imageIcon}
        color="inherit"
        size=${this.imageIconSize}
        class="image-icon"
      ></wui-icon>`
              : null;
        }
      };
      (u.styles = [o.W5, o.fD, l]),
        c([(0, r.MZ)()], u.prototype, "variant", void 0),
        c([(0, r.MZ)()], u.prototype, "imageSrc", void 0),
        c([(0, r.MZ)()], u.prototype, "imageIcon", void 0),
        c([(0, r.MZ)()], u.prototype, "imageIconSize", void 0),
        c([(0, r.MZ)({ type: Boolean })], u.prototype, "disabled", void 0),
        c([(0, r.MZ)()], u.prototype, "icon", void 0),
        c([(0, r.MZ)()], u.prototype, "href", void 0),
        c([(0, r.MZ)()], u.prototype, "text", void 0),
        (u = c([(0, n.E)("wui-chip")], u));
    },
  },
]);
