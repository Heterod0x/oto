"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [9348],
  {
    1377: (e, t, i) => {
      i(11071);
    },
    11071: (e, t, i) => {
      var r = i(2776),
        a = i(8847);
      i(80352);
      var s = i(24957),
        o = i(93626);
      let n = (0, r.AH)`
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
      var c = function (e, t, i, r) {
        var a,
          s = arguments.length,
          o = s < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, i)) : r;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          o = Reflect.decorate(e, t, i, r);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (a = e[n]) && (o = (s < 3 ? a(o) : s > 3 ? a(t, i, o) : a(t, i)) || o);
        return s > 3 && o && Object.defineProperty(t, i, o), o;
      };
      let w = class extends r.WF {
        constructor() {
          super(...arguments), (this.variant = "main"), (this.size = "lg");
        }
        render() {
          (this.dataset.variant = this.variant), (this.dataset.size = this.size);
          let e = "md" === this.size ? "mini-700" : "micro-700";
          return (0, r.qy)`
      <wui-text data-variant=${this.variant} variant=${e} color="inherit">
        <slot></slot>
      </wui-text>
    `;
        }
      };
      (w.styles = [s.W5, n]),
        c([(0, a.MZ)()], w.prototype, "variant", void 0),
        c([(0, a.MZ)()], w.prototype, "size", void 0),
        (w = c([(0, o.E)("wui-tag")], w));
    },
    25841: (e, t, i) => {
      var r = i(2776),
        a = i(8847);
      i(28563);
      var s = i(24957),
        o = i(93626);
      let n = (0, r.AH)`
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
      var c = function (e, t, i, r) {
        var a,
          s = arguments.length,
          o = s < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, i)) : r;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          o = Reflect.decorate(e, t, i, r);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (a = e[n]) && (o = (s < 3 ? a(o) : s > 3 ? a(t, i, o) : a(t, i)) || o);
        return s > 3 && o && Object.defineProperty(t, i, o), o;
      };
      let w = class extends r.WF {
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
            (0, r.qy)`
      <button ?disabled=${this.disabled}>
        <wui-icon color=${this.iconColor} size=${this.size} name=${this.icon}></wui-icon>
      </button>
    `
          );
        }
      };
      (w.styles = [s.W5, s.fD, s.ck, n]),
        c([(0, a.MZ)()], w.prototype, "size", void 0),
        c([(0, a.MZ)({ type: Boolean })], w.prototype, "disabled", void 0),
        c([(0, a.MZ)()], w.prototype, "icon", void 0),
        c([(0, a.MZ)()], w.prototype, "iconColor", void 0),
        (w = c([(0, o.E)("wui-icon-link")], w));
    },
    47594: (e, t, i) => {
      i.d(t, { J: () => v });
      var r = i(2776),
        a = i(8847),
        s = i(84962),
        o = i(52934),
        n = i(10021),
        c = i(52698);
      let w = (0, r.AH)`
  :host {
    --prev-height: 0px;
    --new-height: 0px;
    display: block;
  }

  div.w3m-router-container {
    transform: translateY(0);
    opacity: 1;
  }

  div.w3m-router-container[view-direction='prev'] {
    animation:
      slide-left-out 150ms forwards ease,
      slide-left-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  div.w3m-router-container[view-direction='next'] {
    animation:
      slide-right-out 150ms forwards ease,
      slide-right-in 150ms forwards ease;
    animation-delay: 0ms, 200ms;
  }

  @keyframes slide-left-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(10px);
      opacity: 0;
    }
  }

  @keyframes slide-left-in {
    from {
      transform: translateX(-10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }

  @keyframes slide-right-out {
    from {
      transform: translateX(0px);
      opacity: 1;
    }
    to {
      transform: translateX(-10px);
      opacity: 0;
    }
  }

  @keyframes slide-right-in {
    from {
      transform: translateX(10px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
      var l = function (e, t, i, r) {
        var a,
          s = arguments.length,
          o = s < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, i)) : r;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          o = Reflect.decorate(e, t, i, r);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (a = e[n]) && (o = (s < 3 ? a(o) : s > 3 ? a(t, i, o) : a(t, i)) || o);
        return s > 3 && o && Object.defineProperty(t, i, o), o;
      };
      let v = class extends r.WF {
        constructor() {
          super(),
            (this.resizeObserver = void 0),
            (this.prevHeight = "0px"),
            (this.prevHistoryLength = 1),
            (this.unsubscribe = []),
            (this.view = s.I.state.view),
            (this.viewDirection = ""),
            this.unsubscribe.push(s.I.subscribeKey("view", (e) => this.onViewChange(e)));
        }
        firstUpdated() {
          (this.resizeObserver = new ResizeObserver(([e]) => {
            let t = `${e?.contentRect.height}px`;
            "0px" !== this.prevHeight &&
              (this.style.setProperty("--prev-height", this.prevHeight),
              this.style.setProperty("--new-height", t),
              (this.style.animation = "w3m-view-height 150ms forwards ease"),
              (this.style.height = "auto")),
              setTimeout(() => {
                (this.prevHeight = t), (this.style.animation = "unset");
              }, c.o.ANIMATION_DURATIONS.ModalHeight);
          })),
            this.resizeObserver?.observe(this.getWrapper());
        }
        disconnectedCallback() {
          this.resizeObserver?.unobserve(this.getWrapper()), this.unsubscribe.forEach((e) => e());
        }
        render() {
          return (0, r.qy)`<div class="w3m-router-container" view-direction="${this.viewDirection}">
      ${this.viewTemplate()}
    </div>`;
        }
        viewTemplate() {
          switch (this.view) {
            case "AccountSettings":
              return (0, r.qy)`<w3m-account-settings-view></w3m-account-settings-view>`;
            case "Account":
              return (0, r.qy)`<w3m-account-view></w3m-account-view>`;
            case "AllWallets":
              return (0, r.qy)`<w3m-all-wallets-view></w3m-all-wallets-view>`;
            case "ApproveTransaction":
              return (0, r.qy)`<w3m-approve-transaction-view></w3m-approve-transaction-view>`;
            case "BuyInProgress":
              return (0, r.qy)`<w3m-buy-in-progress-view></w3m-buy-in-progress-view>`;
            case "ChooseAccountName":
              return (0, r.qy)`<w3m-choose-account-name-view></w3m-choose-account-name-view>`;
            case "Connect":
            default:
              return (0, r.qy)`<w3m-connect-view></w3m-connect-view>`;
            case "Create":
              return (0, r.qy)`<w3m-connect-view walletGuide="explore"></w3m-connect-view>`;
            case "ConnectingWalletConnect":
              return (0, r.qy)`<w3m-connecting-wc-view></w3m-connecting-wc-view>`;
            case "ConnectingWalletConnectBasic":
              return (0, r.qy)`<w3m-connecting-wc-basic-view></w3m-connecting-wc-basic-view>`;
            case "ConnectingExternal":
              return (0, r.qy)`<w3m-connecting-external-view></w3m-connecting-external-view>`;
            case "ConnectingSiwe":
              return (0, r.qy)`<w3m-connecting-siwe-view></w3m-connecting-siwe-view>`;
            case "ConnectWallets":
              return (0, r.qy)`<w3m-connect-wallets-view></w3m-connect-wallets-view>`;
            case "ConnectSocials":
              return (0, r.qy)`<w3m-connect-socials-view></w3m-connect-socials-view>`;
            case "ConnectingSocial":
              return (0, r.qy)`<w3m-connecting-social-view></w3m-connecting-social-view>`;
            case "Downloads":
              return (0, r.qy)`<w3m-downloads-view></w3m-downloads-view>`;
            case "EmailLogin":
              return (0, r.qy)`<w3m-email-login-view></w3m-email-login-view>`;
            case "EmailVerifyOtp":
              return (0, r.qy)`<w3m-email-verify-otp-view></w3m-email-verify-otp-view>`;
            case "EmailVerifyDevice":
              return (0, r.qy)`<w3m-email-verify-device-view></w3m-email-verify-device-view>`;
            case "GetWallet":
              return (0, r.qy)`<w3m-get-wallet-view></w3m-get-wallet-view>`;
            case "Networks":
              return (0, r.qy)`<w3m-networks-view></w3m-networks-view>`;
            case "SwitchNetwork":
              return (0, r.qy)`<w3m-network-switch-view></w3m-network-switch-view>`;
            case "Profile":
              return (0, r.qy)`<w3m-profile-view></w3m-profile-view>`;
            case "SwitchAddress":
              return (0, r.qy)`<w3m-switch-address-view></w3m-switch-address-view>`;
            case "Transactions":
              return (0, r.qy)`<w3m-transactions-view></w3m-transactions-view>`;
            case "OnRampProviders":
              return (0, r.qy)`<w3m-onramp-providers-view></w3m-onramp-providers-view>`;
            case "OnRampActivity":
              return (0, r.qy)`<w3m-onramp-activity-view></w3m-onramp-activity-view>`;
            case "OnRampTokenSelect":
              return (0, r.qy)`<w3m-onramp-token-select-view></w3m-onramp-token-select-view>`;
            case "OnRampFiatSelect":
              return (0, r.qy)`<w3m-onramp-fiat-select-view></w3m-onramp-fiat-select-view>`;
            case "UpgradeEmailWallet":
              return (0, r.qy)`<w3m-upgrade-wallet-view></w3m-upgrade-wallet-view>`;
            case "UpdateEmailWallet":
              return (0, r.qy)`<w3m-update-email-wallet-view></w3m-update-email-wallet-view>`;
            case "UpdateEmailPrimaryOtp":
              return (0,
              r.qy)`<w3m-update-email-primary-otp-view></w3m-update-email-primary-otp-view>`;
            case "UpdateEmailSecondaryOtp":
              return (0,
              r.qy)`<w3m-update-email-secondary-otp-view></w3m-update-email-secondary-otp-view>`;
            case "UnsupportedChain":
              return (0, r.qy)`<w3m-unsupported-chain-view></w3m-unsupported-chain-view>`;
            case "Swap":
              return (0, r.qy)`<w3m-swap-view></w3m-swap-view>`;
            case "SwapSelectToken":
              return (0, r.qy)`<w3m-swap-select-token-view></w3m-swap-select-token-view>`;
            case "SwapPreview":
              return (0, r.qy)`<w3m-swap-preview-view></w3m-swap-preview-view>`;
            case "WalletSend":
              return (0, r.qy)`<w3m-wallet-send-view></w3m-wallet-send-view>`;
            case "WalletSendSelectToken":
              return (0,
              r.qy)`<w3m-wallet-send-select-token-view></w3m-wallet-send-select-token-view>`;
            case "WalletSendPreview":
              return (0, r.qy)`<w3m-wallet-send-preview-view></w3m-wallet-send-preview-view>`;
            case "WhatIsABuy":
              return (0, r.qy)`<w3m-what-is-a-buy-view></w3m-what-is-a-buy-view>`;
            case "WalletReceive":
              return (0, r.qy)`<w3m-wallet-receive-view></w3m-wallet-receive-view>`;
            case "WalletCompatibleNetworks":
              return (0,
              r.qy)`<w3m-wallet-compatible-networks-view></w3m-wallet-compatible-networks-view>`;
            case "WhatIsAWallet":
              return (0, r.qy)`<w3m-what-is-a-wallet-view></w3m-what-is-a-wallet-view>`;
            case "ConnectingMultiChain":
              return (0, r.qy)`<w3m-connecting-multi-chain-view></w3m-connecting-multi-chain-view>`;
            case "WhatIsANetwork":
              return (0, r.qy)`<w3m-what-is-a-network-view></w3m-what-is-a-network-view>`;
            case "ConnectingFarcaster":
              return (0, r.qy)`<w3m-connecting-farcaster-view></w3m-connecting-farcaster-view>`;
            case "SwitchActiveChain":
              return (0, r.qy)`<w3m-switch-active-chain-view></w3m-switch-active-chain-view>`;
            case "RegisterAccountName":
              return (0, r.qy)`<w3m-register-account-name-view></w3m-register-account-name-view>`;
            case "RegisterAccountNameSuccess":
              return (0,
              r.qy)`<w3m-register-account-name-success-view></w3m-register-account-name-success-view>`;
            case "SmartSessionCreated":
              return (0, r.qy)`<w3m-smart-session-created-view></w3m-smart-session-created-view>`;
            case "SmartSessionList":
              return (0, r.qy)`<w3m-smart-session-list-view></w3m-smart-session-list-view>`;
            case "SIWXSignMessage":
              return (0, r.qy)`<w3m-siwx-sign-message-view></w3m-siwx-sign-message-view>`;
            case "Pay":
              return (0, r.qy)`<w3m-pay-view></w3m-pay-view>`;
            case "PayLoading":
              return (0, r.qy)`<w3m-pay-loading-view></w3m-pay-loading-view>`;
          }
        }
        onViewChange(e) {
          o.I.hide();
          let t = c.o.VIEW_DIRECTION.Next,
            { history: i } = s.I.state;
          i.length < this.prevHistoryLength && (t = c.o.VIEW_DIRECTION.Prev),
            (this.prevHistoryLength = i.length),
            (this.viewDirection = t),
            setTimeout(() => {
              this.view = e;
            }, c.o.ANIMATION_DURATIONS.ViewTransition);
        }
        getWrapper() {
          return this.shadowRoot?.querySelector("div");
        }
      };
      (v.styles = w),
        l([(0, a.wk)()], v.prototype, "view", void 0),
        l([(0, a.wk)()], v.prototype, "viewDirection", void 0),
        (v = l([(0, n.EM)("w3m-router")], v));
    },
    52934: (e, t, i) => {
      i.d(t, { I: () => n });
      var r = i(28908),
        a = i(86836),
        s = i(20799);
      let o = (0, r.BX)({
          message: "",
          open: !1,
          triggerRect: { width: 0, height: 0, top: 0, left: 0 },
          variant: "shade",
        }),
        n = (0, s.X)({
          state: o,
          subscribe: (e) => (0, r.B1)(o, () => e(o)),
          subscribeKey: (e, t) => (0, a.u$)(o, e, t),
          showTooltip({ message: e, triggerRect: t, variant: i }) {
            (o.open = !0), (o.message = e), (o.triggerRect = t), (o.variant = i);
          },
          hide() {
            (o.open = !1),
              (o.message = ""),
              (o.triggerRect = { width: 0, height: 0, top: 0, left: 0 });
          },
        });
    },
    88637: (e, t, i) => {
      var r = i(2776),
        a = i(8847),
        s = i(52934),
        o = i(10021);
      i(79824), i(69846), i(77740);
      let n = (0, r.AH)`
  :host {
    pointer-events: none;
  }

  :host > wui-flex {
    display: var(--w3m-tooltip-display);
    opacity: var(--w3m-tooltip-opacity);
    padding: 9px var(--wui-spacing-s) 10px var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xxs);
    color: var(--wui-color-bg-100);
    position: fixed;
    top: var(--w3m-tooltip-top);
    left: var(--w3m-tooltip-left);
    transform: translate(calc(-50% + var(--w3m-tooltip-parent-width)), calc(-100% - 8px));
    max-width: calc(var(--w3m-modal-width) - var(--wui-spacing-xl));
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host([data-variant='shade']) > wui-flex {
    background-color: var(--wui-color-bg-150);
    border: 1px solid var(--wui-color-gray-glass-005);
  }

  :host([data-variant='shade']) > wui-flex > wui-text {
    color: var(--wui-color-fg-150);
  }

  :host([data-variant='fill']) > wui-flex {
    background-color: var(--wui-color-fg-100);
    border: none;
  }

  wui-icon {
    position: absolute;
    width: 12px !important;
    height: 4px !important;
    color: var(--wui-color-bg-150);
  }

  wui-icon[data-placement='top'] {
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, 95%);
  }

  wui-icon[data-placement='bottom'] {
    top: 0;
    left: 50%;
    transform: translate(-50%, -95%) rotate(180deg);
  }

  wui-icon[data-placement='right'] {
    top: 50%;
    left: 0;
    transform: translate(-65%, -50%) rotate(90deg);
  }

  wui-icon[data-placement='left'] {
    top: 50%;
    right: 0%;
    transform: translate(65%, -50%) rotate(270deg);
  }
`;
      var c = function (e, t, i, r) {
        var a,
          s = arguments.length,
          o = s < 3 ? t : null === r ? (r = Object.getOwnPropertyDescriptor(t, i)) : r;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          o = Reflect.decorate(e, t, i, r);
        else
          for (var n = e.length - 1; n >= 0; n--)
            (a = e[n]) && (o = (s < 3 ? a(o) : s > 3 ? a(t, i, o) : a(t, i)) || o);
        return s > 3 && o && Object.defineProperty(t, i, o), o;
      };
      let w = class extends r.WF {
        constructor() {
          super(),
            (this.unsubscribe = []),
            (this.open = s.I.state.open),
            (this.message = s.I.state.message),
            (this.triggerRect = s.I.state.triggerRect),
            (this.variant = s.I.state.variant),
            this.unsubscribe.push(
              s.I.subscribe((e) => {
                (this.open = e.open),
                  (this.message = e.message),
                  (this.triggerRect = e.triggerRect),
                  (this.variant = e.variant);
              }),
            );
        }
        disconnectedCallback() {
          this.unsubscribe.forEach((e) => e());
        }
        render() {
          this.dataset.variant = this.variant;
          let e = this.triggerRect.top,
            t = this.triggerRect.left;
          return (
            (this.style.cssText = `
    --w3m-tooltip-top: ${e}px;
    --w3m-tooltip-left: ${t}px;
    --w3m-tooltip-parent-width: ${this.triggerRect.width / 2}px;
    --w3m-tooltip-display: ${this.open ? "flex" : "none"};
    --w3m-tooltip-opacity: ${+!!this.open};
    `),
            (0, r.qy)`<wui-flex>
      <wui-icon data-placement="top" color="fg-100" size="inherit" name="cursor"></wui-icon>
      <wui-text color="inherit" variant="small-500">${this.message}</wui-text>
    </wui-flex>`
          );
        }
      };
      (w.styles = [n]),
        c([(0, a.wk)()], w.prototype, "open", void 0),
        c([(0, a.wk)()], w.prototype, "message", void 0),
        c([(0, a.wk)()], w.prototype, "triggerRect", void 0),
        c([(0, a.wk)()], w.prototype, "variant", void 0),
        (w = c([(0, o.EM)("w3m-tooltip"), (0, o.EM)("w3m-tooltip")], w));
    },
  },
]);
