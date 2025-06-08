"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [6042],
  {
    16517: (e, t, o) => {
      o.r(t), o.d(t, { AppKitModal: () => eo, W3mModal: () => et, W3mModalBase: () => ee });
      var i = o(2776),
        r = o(8847),
        a = o(51685),
        s = o(93462),
        n = o(19495),
        l = o(20420),
        c = o(90588),
        d = o(97798),
        h = o(40369),
        p = o(84962),
        u = o(5768);
      let w = {
        isUnsupportedChainView: () =>
          "UnsupportedChain" === p.I.state.view ||
          ("SwitchNetwork" === p.I.state.view && p.I.state.history.includes("UnsupportedChain")),
        async safeClose() {
          if (this.isUnsupportedChainView() || (await u.U.isSIWXCloseDisabled()))
            return void l.W.shake();
          l.W.close();
        },
      };
      var g = o(32736),
        m = o(7679),
        b = o(71644),
        f = o(10021),
        v = o(24957),
        y = o(93626);
      let k = (0, i.AH)`
  :host {
    display: block;
    border-radius: clamp(0px, var(--wui-border-radius-l), 44px);
    box-shadow: 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-modal-bg);
    overflow: hidden;
  }

  :host([data-embedded='true']) {
    box-shadow:
      0 0 0 1px var(--wui-color-gray-glass-005),
      0px 4px 12px 4px var(--w3m-card-embedded-shadow-color);
  }
`,
        x = class extends i.WF {
          render() {
            return (0, i.qy)`<slot></slot>`;
          }
        };
      (x.styles = [v.W5, k]),
        (x = (function (e, t, o, i) {
          var r,
            a = arguments.length,
            s = a < 3 ? t : null === i ? (i = Object.getOwnPropertyDescriptor(t, o)) : i;
          if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
            s = Reflect.decorate(e, t, o, i);
          else
            for (var n = e.length - 1; n >= 0; n--)
              (r = e[n]) && (s = (a < 3 ? r(s) : a > 3 ? r(t, o, s) : r(t, o)) || s);
          return a > 3 && s && Object.defineProperty(t, o, s), s;
        })([(0, y.E)("wui-card")], x)),
        o(79824);
      var C = o(66275);
      o(28563), o(80352), o(7614);
      let W = (0, i.AH)`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-dark-glass-100);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-325);
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.25);
  }

  wui-flex {
    width: 100%;
  }

  wui-text {
    word-break: break-word;
    flex: 1;
  }

  .close {
    cursor: pointer;
  }

  .icon-box {
    height: 40px;
    width: 40px;
    border-radius: var(--wui-border-radius-3xs);
    background-color: var(--local-icon-bg-value);
  }
`;
      var S = function (e, t, o, i) {
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
      let $ = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.message = ""),
            (this.backgroundColor = "accent-100"),
            (this.iconColor = "accent-100"),
            (this.icon = "info");
        }
        render() {
          return (
            (this.style.cssText = `
      --local-icon-bg-value: var(--wui-color-${this.backgroundColor});
   `),
            (0, i.qy)`
      <wui-flex flexDirection="row" justifyContent="space-between" alignItems="center">
        <wui-flex columnGap="xs" flexDirection="row" alignItems="center">
          <wui-flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            class="icon-box"
          >
            <wui-icon color=${this.iconColor} size="md" name=${this.icon}></wui-icon>
          </wui-flex>
          <wui-text variant="small-500" color="bg-350" data-testid="wui-alertbar-text"
            >${this.message}</wui-text
          >
        </wui-flex>
        <wui-icon
          class="close"
          color="bg-350"
          size="sm"
          name="close"
          @click=${this.onClose}
        ></wui-icon>
      </wui-flex>
    `
          );
        }
        onClose() {
          C.h.close();
        }
      };
      ($.styles = [v.W5, W]),
        S([(0, r.MZ)()], $.prototype, "message", void 0),
        S([(0, r.MZ)()], $.prototype, "backgroundColor", void 0),
        S([(0, r.MZ)()], $.prototype, "iconColor", void 0),
        S([(0, r.MZ)()], $.prototype, "icon", void 0),
        ($ = S([(0, y.E)("wui-alertbar")], $));
      let E = (0, i.AH)`
  :host {
    display: block;
    position: absolute;
    top: var(--wui-spacing-s);
    left: var(--wui-spacing-l);
    right: var(--wui-spacing-l);
    opacity: 0;
    pointer-events: none;
  }
`;
      var I = function (e, t, o, i) {
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
      let N = {
          info: { backgroundColor: "fg-350", iconColor: "fg-325", icon: "info" },
          success: {
            backgroundColor: "success-glass-reown-020",
            iconColor: "success-125",
            icon: "checkmark",
          },
          warning: {
            backgroundColor: "warning-glass-reown-020",
            iconColor: "warning-100",
            icon: "warningCircle",
          },
          error: {
            backgroundColor: "error-glass-reown-020",
            iconColor: "error-125",
            icon: "exclamationTriangle",
          },
        },
        A = class extends i.WF {
          constructor() {
            super(),
              (this.unsubscribe = []),
              (this.open = C.h.state.open),
              this.onOpen(!0),
              this.unsubscribe.push(
                C.h.subscribeKey("open", (e) => {
                  (this.open = e), this.onOpen(!1);
                }),
              );
          }
          disconnectedCallback() {
            this.unsubscribe.forEach((e) => e());
          }
          render() {
            let { message: e, variant: t } = C.h.state,
              o = N[t];
            return (0, i.qy)`
      <wui-alertbar
        message=${e}
        backgroundColor=${o?.backgroundColor}
        iconColor=${o?.iconColor}
        icon=${o?.icon}
      ></wui-alertbar>
    `;
          }
          onOpen(e) {
            this.open
              ? (this.animate(
                  [
                    { opacity: 0, transform: "scale(0.85)" },
                    { opacity: 1, transform: "scale(1)" },
                  ],
                  { duration: 150, fill: "forwards", easing: "ease" },
                ),
                (this.style.cssText = "pointer-events: auto"))
              : e ||
                (this.animate(
                  [
                    { opacity: 1, transform: "scale(1)" },
                    { opacity: 0, transform: "scale(0.85)" },
                  ],
                  { duration: 150, fill: "forwards", easing: "ease" },
                ),
                (this.style.cssText = "pointer-events: none"));
          }
        };
      (A.styles = E),
        I([(0, r.wk)()], A.prototype, "open", void 0),
        (A = I([(0, f.EM)("w3m-alertbar")], A));
      var T = o(38426),
        O = o(78685),
        R = o(37101),
        P = o(53346);
      o(25841), o(33380), o(21846);
      let z = (0, i.AH)`
  button {
    display: block;
    display: flex;
    align-items: center;
    padding: var(--wui-spacing-xxs);
    gap: var(--wui-spacing-xxs);
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-md);
    border-radius: var(--wui-border-radius-xxs);
  }

  wui-image {
    border-radius: 100%;
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  wui-icon-box {
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  button:active {
    background-color: var(--wui-color-gray-glass-005);
  }
`;
      var j = function (e, t, o, i) {
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
      let M = class extends i.WF {
        constructor() {
          super(...arguments), (this.imageSrc = "");
        }
        render() {
          return (0, i.qy)`<button>
      ${this.imageTemplate()}
      <wui-icon size="xs" color="fg-200" name="chevronBottom"></wui-icon>
    </button>`;
        }
        imageTemplate() {
          return this.imageSrc
            ? (0, i.qy)`<wui-image src=${this.imageSrc} alt="select visual"></wui-image>`
            : (0, i.qy)`<wui-icon-box
      size="xxs"
      iconColor="fg-200"
      backgroundColor="fg-100"
      background="opaque"
      icon="networkPlaceholder"
    ></wui-icon-box>`;
        }
      };
      (M.styles = [v.W5, v.fD, v.ck, z]),
        j([(0, r.MZ)()], M.prototype, "imageSrc", void 0),
        (M = j([(0, y.E)("wui-select")], M)),
        o(1377),
        o(77740);
      var B = o(52698);
      let q = (0, i.AH)`
  :host {
    height: 64px;
  }

  wui-text {
    text-transform: capitalize;
  }

  wui-flex.w3m-header-title {
    transform: translateY(0);
    opacity: 1;
  }

  wui-flex.w3m-header-title[view-direction='prev'] {
    animation:
      slide-down-out 120ms forwards var(--wui-ease-out-power-2),
      slide-down-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-flex.w3m-header-title[view-direction='next'] {
    animation:
      slide-up-out 120ms forwards var(--wui-ease-out-power-2),
      slide-up-in 120ms forwards var(--wui-ease-out-power-2);
    animation-delay: 0ms, 200ms;
  }

  wui-icon-link[data-hidden='true'] {
    opacity: 0 !important;
    pointer-events: none;
  }

  @keyframes slide-up-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(3px);
      opacity: 0;
    }
  }

  @keyframes slide-up-in {
    from {
      transform: translateY(-3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes slide-down-out {
    from {
      transform: translateY(0px);
      opacity: 1;
    }
    to {
      transform: translateY(-3px);
      opacity: 0;
    }
  }

  @keyframes slide-down-in {
    from {
      transform: translateY(3px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
      var D = function (e, t, o, i) {
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
      let H = ["SmartSessionList"];
      function L() {
        let e = p.I.state.data?.connector?.name,
          t = p.I.state.data?.wallet?.name,
          o = p.I.state.data?.network?.name,
          i = t ?? e,
          r = d.a.getConnectors(),
          a = 1 === r.length && r[0]?.id === "w3m-email";
        return {
          Connect: `Connect ${a ? "Email" : ""} Wallet`,
          Create: "Create Wallet",
          ChooseAccountName: void 0,
          Account: void 0,
          AccountSettings: void 0,
          AllWallets: "All Wallets",
          ApproveTransaction: "Approve Transaction",
          BuyInProgress: "Buy",
          ConnectingExternal: i ?? "Connect Wallet",
          ConnectingWalletConnect: i ?? "WalletConnect",
          ConnectingWalletConnectBasic: "WalletConnect",
          ConnectingSiwe: "Sign In",
          Convert: "Convert",
          ConvertSelectToken: "Select token",
          ConvertPreview: "Preview convert",
          Downloads: i ? `Get ${i}` : "Downloads",
          EmailLogin: "Email Login",
          EmailVerifyOtp: "Confirm Email",
          EmailVerifyDevice: "Register Device",
          GetWallet: "Get a wallet",
          Networks: "Choose Network",
          OnRampProviders: "Choose Provider",
          OnRampActivity: "Activity",
          OnRampTokenSelect: "Select Token",
          OnRampFiatSelect: "Select Currency",
          Pay: "How you pay",
          Profile: void 0,
          SwitchNetwork: o ?? "Switch Network",
          SwitchAddress: "Switch Address",
          Transactions: "Activity",
          UnsupportedChain: "Switch Network",
          UpgradeEmailWallet: "Upgrade your Wallet",
          UpdateEmailWallet: "Edit Email",
          UpdateEmailPrimaryOtp: "Confirm Current Email",
          UpdateEmailSecondaryOtp: "Confirm New Email",
          WhatIsABuy: "What is Buy?",
          RegisterAccountName: "Choose name",
          RegisterAccountNameSuccess: "",
          WalletReceive: "Receive",
          WalletCompatibleNetworks: "Compatible Networks",
          Swap: "Swap",
          SwapSelectToken: "Select token",
          SwapPreview: "Preview swap",
          WalletSend: "Send",
          WalletSendPreview: "Review send",
          WalletSendSelectToken: "Select Token",
          WhatIsANetwork: "What is a network?",
          WhatIsAWallet: "What is a wallet?",
          ConnectWallets: "Connect wallet",
          ConnectSocials: "All socials",
          ConnectingSocial: T.U.state.socialProvider ? T.U.state.socialProvider : "Connect Social",
          ConnectingMultiChain: "Select chain",
          ConnectingFarcaster: "Farcaster",
          SwitchActiveChain: "Switch chain",
          SmartSessionCreated: void 0,
          SmartSessionList: "Smart Sessions",
          SIWXSignMessage: "Sign In",
          PayLoading: "Payment in progress",
        };
      }
      let Z = class extends i.WF {
        constructor() {
          super(),
            (this.unsubscribe = []),
            (this.heading = L()[p.I.state.view]),
            (this.network = c.W.state.activeCaipNetwork),
            (this.networkImage = O.$.getNetworkImage(this.network)),
            (this.showBack = !1),
            (this.prevHistoryLength = 1),
            (this.view = p.I.state.view),
            (this.viewDirection = ""),
            (this.headerText = L()[p.I.state.view]),
            this.unsubscribe.push(
              R.j.subscribeNetworkImages(() => {
                this.networkImage = O.$.getNetworkImage(this.network);
              }),
              p.I.subscribeKey("view", (e) => {
                setTimeout(() => {
                  (this.view = e), (this.headerText = L()[e]);
                }, B.o.ANIMATION_DURATIONS.HeaderText),
                  this.onViewChange(),
                  this.onHistoryChange();
              }),
              c.W.subscribeKey("activeCaipNetwork", (e) => {
                (this.network = e), (this.networkImage = O.$.getNetworkImage(this.network));
              }),
            );
        }
        disconnectCallback() {
          this.unsubscribe.forEach((e) => e());
        }
        render() {
          return (0, i.qy)`
      <wui-flex .padding=${this.getPadding()} justifyContent="space-between" alignItems="center">
        ${this.leftHeaderTemplate()} ${this.titleTemplate()} ${this.rightHeaderTemplate()}
      </wui-flex>
    `;
        }
        onWalletHelp() {
          P.E.sendEvent({ type: "track", event: "CLICK_WALLET_HELP" }), p.I.push("WhatIsAWallet");
        }
        async onClose() {
          await w.safeClose();
        }
        rightHeaderTemplate() {
          let e = n.H?.state?.features?.smartSessions;
          return "Account" === p.I.state.view && e
            ? (0, i.qy)`<wui-flex>
      <wui-icon-link
        icon="clock"
        @click=${() => p.I.push("SmartSessionList")}
        data-testid="w3m-header-smart-sessions"
      ></wui-icon-link>
      ${this.closeButtonTemplate()}
    </wui-flex> `
            : this.closeButtonTemplate();
        }
        closeButtonTemplate() {
          return (0, i.qy)`
      <wui-icon-link
        icon="close"
        @click=${this.onClose.bind(this)}
        data-testid="w3m-header-close"
      ></wui-icon-link>
    `;
        }
        titleTemplate() {
          let e = H.includes(this.view);
          return (0, i.qy)`
      <wui-flex
        view-direction="${this.viewDirection}"
        class="w3m-header-title"
        alignItems="center"
        gap="xs"
      >
        <wui-text variant="paragraph-700" color="fg-100" data-testid="w3m-header-text"
          >${this.headerText}</wui-text
        >
        ${e ? ((0, i.qy))`<wui-tag variant="main">Beta</wui-tag>` : null}
      </wui-flex>
    `;
        }
        leftHeaderTemplate() {
          let { view: e } = p.I.state,
            t = "Connect" === e,
            o = n.H.state.enableEmbedded,
            r = n.H.state.enableNetworkSwitch;
          return "Account" === e && r
            ? (0, i.qy)`<wui-select
        id="dynamic"
        data-testid="w3m-account-select-network"
        active-network=${(0, a.J)(this.network?.name)}
        @click=${this.onNetworks.bind(this)}
        imageSrc=${(0, a.J)(this.networkImage)}
      ></wui-select>`
            : this.showBack && !("ApproveTransaction" === e || "ConnectingSiwe" === e || (t && o))
              ? (0, i.qy)`<wui-icon-link
        data-testid="header-back"
        id="dynamic"
        icon="chevronLeft"
        @click=${this.onGoBack.bind(this)}
      ></wui-icon-link>`
              : (0, i.qy)`<wui-icon-link
      data-hidden=${!t}
      id="dynamic"
      icon="helpCircle"
      @click=${this.onWalletHelp.bind(this)}
    ></wui-icon-link>`;
        }
        onNetworks() {
          this.isAllowedNetworkSwitch() &&
            (P.E.sendEvent({ type: "track", event: "CLICK_NETWORKS" }), p.I.push("Networks"));
        }
        isAllowedNetworkSwitch() {
          let e = c.W.getAllRequestedCaipNetworks(),
            t = !!e && e.length > 1,
            o = e?.find(({ id: e }) => e === this.network?.id);
          return t || !o;
        }
        getPadding() {
          return this.heading ? ["l", "2l", "l", "2l"] : ["0", "2l", "0", "2l"];
        }
        onViewChange() {
          let { history: e } = p.I.state,
            t = B.o.VIEW_DIRECTION.Next;
          e.length < this.prevHistoryLength && (t = B.o.VIEW_DIRECTION.Prev),
            (this.prevHistoryLength = e.length),
            (this.viewDirection = t);
        }
        async onHistoryChange() {
          let { history: e } = p.I.state,
            t = this.shadowRoot?.querySelector("#dynamic");
          e.length > 1 && !this.showBack && t
            ? (await t.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 200,
                fill: "forwards",
                easing: "ease",
              }).finished,
              (this.showBack = !0),
              t.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 200,
                fill: "forwards",
                easing: "ease",
              }))
            : e.length <= 1 &&
              this.showBack &&
              t &&
              (await t.animate([{ opacity: 1 }, { opacity: 0 }], {
                duration: 200,
                fill: "forwards",
                easing: "ease",
              }).finished,
              (this.showBack = !1),
              t.animate([{ opacity: 0 }, { opacity: 1 }], {
                duration: 200,
                fill: "forwards",
                easing: "ease",
              }));
        }
        onGoBack() {
          p.I.goBack();
        }
      };
      (Z.styles = q),
        D([(0, r.wk)()], Z.prototype, "heading", void 0),
        D([(0, r.wk)()], Z.prototype, "network", void 0),
        D([(0, r.wk)()], Z.prototype, "networkImage", void 0),
        D([(0, r.wk)()], Z.prototype, "showBack", void 0),
        D([(0, r.wk)()], Z.prototype, "prevHistoryLength", void 0),
        D([(0, r.wk)()], Z.prototype, "view", void 0),
        D([(0, r.wk)()], Z.prototype, "viewDirection", void 0),
        D([(0, r.wk)()], Z.prototype, "headerText", void 0),
        (Z = D([(0, f.EM)("w3m-header")], Z)),
        o(53015);
      let U = (0, i.AH)`
  :host {
    display: flex;
    column-gap: var(--wui-spacing-s);
    align-items: center;
    padding: var(--wui-spacing-xs) var(--wui-spacing-m) var(--wui-spacing-xs) var(--wui-spacing-xs);
    border-radius: var(--wui-border-radius-s);
    border: 1px solid var(--wui-color-gray-glass-005);
    box-sizing: border-box;
    background-color: var(--wui-color-bg-175);
    box-shadow:
      0px 14px 64px -4px rgba(0, 0, 0, 0.15),
      0px 8px 22px -6px rgba(0, 0, 0, 0.15);

    max-width: 300px;
  }

  :host wui-loading-spinner {
    margin-left: var(--wui-spacing-3xs);
  }
`;
      var K = function (e, t, o, i) {
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
      let F = class extends i.WF {
        constructor() {
          super(...arguments),
            (this.backgroundColor = "accent-100"),
            (this.iconColor = "accent-100"),
            (this.icon = "checkmark"),
            (this.message = ""),
            (this.loading = !1),
            (this.iconType = "default");
        }
        render() {
          return (0, i.qy)`
      ${this.templateIcon()}
      <wui-text variant="paragraph-500" color="fg-100" data-testid="wui-snackbar-message"
        >${this.message}</wui-text
      >
    `;
        }
        templateIcon() {
          return this.loading
            ? (0, i.qy)`<wui-loading-spinner size="md" color="accent-100"></wui-loading-spinner>`
            : "default" === this.iconType
              ? (0, i.qy)`<wui-icon size="xl" color=${this.iconColor} name=${this.icon}></wui-icon>`
              : (0, i.qy)`<wui-icon-box
      size="sm"
      iconSize="xs"
      iconColor=${this.iconColor}
      backgroundColor=${this.backgroundColor}
      icon=${this.icon}
      background="opaque"
    ></wui-icon-box>`;
        }
      };
      (F.styles = [v.W5, U]),
        K([(0, r.MZ)()], F.prototype, "backgroundColor", void 0),
        K([(0, r.MZ)()], F.prototype, "iconColor", void 0),
        K([(0, r.MZ)()], F.prototype, "icon", void 0),
        K([(0, r.MZ)()], F.prototype, "message", void 0),
        K([(0, r.MZ)()], F.prototype, "loading", void 0),
        K([(0, r.MZ)()], F.prototype, "iconType", void 0),
        (F = K([(0, y.E)("wui-snackbar")], F));
      let Y = (0, i.AH)`
  :host {
    display: block;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    top: 11px;
    left: 50%;
    width: max-content;
  }
`;
      var _ = function (e, t, o, i) {
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
      let V = {
          loading: void 0,
          success: { backgroundColor: "success-100", iconColor: "success-100", icon: "checkmark" },
          error: { backgroundColor: "error-100", iconColor: "error-100", icon: "close" },
        },
        X = class extends i.WF {
          constructor() {
            super(),
              (this.unsubscribe = []),
              (this.timeout = void 0),
              (this.open = m.P.state.open),
              this.unsubscribe.push(
                m.P.subscribeKey("open", (e) => {
                  (this.open = e), this.onOpen();
                }),
              );
          }
          disconnectedCallback() {
            clearTimeout(this.timeout), this.unsubscribe.forEach((e) => e());
          }
          render() {
            let { message: e, variant: t, svg: o } = m.P.state,
              r = V[t],
              { icon: a, iconColor: s } = o ?? r ?? {};
            return (0, i.qy)`
      <wui-snackbar
        message=${e}
        backgroundColor=${r?.backgroundColor}
        iconColor=${s}
        icon=${a}
        .loading=${"loading" === t}
      ></wui-snackbar>
    `;
          }
          onOpen() {
            clearTimeout(this.timeout),
              this.open
                ? (this.animate(
                    [
                      { opacity: 0, transform: "translateX(-50%) scale(0.85)" },
                      { opacity: 1, transform: "translateX(-50%) scale(1)" },
                    ],
                    { duration: 150, fill: "forwards", easing: "ease" },
                  ),
                  this.timeout && clearTimeout(this.timeout),
                  m.P.state.autoClose && (this.timeout = setTimeout(() => m.P.hide(), 2500)))
                : this.animate(
                    [
                      { opacity: 1, transform: "translateX(-50%) scale(1)" },
                      { opacity: 0, transform: "translateX(-50%) scale(0.85)" },
                    ],
                    { duration: 150, fill: "forwards", easing: "ease" },
                  );
          }
        };
      (X.styles = Y),
        _([(0, r.wk)()], X.prototype, "open", void 0),
        (X = _([(0, f.EM)("w3m-snackbar")], X)),
        o(88637),
        o(47594);
      let G = (0, i.AH)`
  :host {
    z-index: var(--w3m-z-index);
    display: block;
    backface-visibility: hidden;
    will-change: opacity;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    opacity: 0;
    background-color: var(--wui-cover);
    transition: opacity 0.2s var(--wui-ease-out-power-2);
    will-change: opacity;
  }

  :host(.open) {
    opacity: 1;
  }

  :host(.appkit-modal) {
    position: relative;
    pointer-events: unset;
    background: none;
    width: 100%;
    opacity: 1;
  }

  wui-card {
    max-width: var(--w3m-modal-width);
    width: 100%;
    position: relative;
    animation: zoom-in 0.2s var(--wui-ease-out-power-2);
    animation-fill-mode: backwards;
    outline: none;
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host(.appkit-modal) wui-card {
    max-width: 400px;
  }

  wui-card[shake='true'] {
    animation:
      zoom-in 0.2s var(--wui-ease-out-power-2),
      w3m-shake 0.5s var(--wui-ease-out-power-2);
  }

  wui-flex {
    overflow-x: hidden;
    overflow-y: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  @media (max-height: 700px) and (min-width: 431px) {
    wui-flex {
      align-items: flex-start;
    }

    wui-card {
      margin: var(--wui-spacing-xxl) 0px;
    }
  }

  @media (max-width: 430px) {
    wui-flex {
      align-items: flex-end;
    }

    wui-card {
      max-width: 100%;
      border-bottom-left-radius: var(--local-border-bottom-mobile-radius);
      border-bottom-right-radius: var(--local-border-bottom-mobile-radius);
      border-bottom: none;
      animation: slide-in 0.2s var(--wui-ease-out-power-2);
    }

    wui-card[shake='true'] {
      animation:
        slide-in 0.2s var(--wui-ease-out-power-2),
        w3m-shake 0.5s var(--wui-ease-out-power-2);
    }
  }

  @keyframes zoom-in {
    0% {
      transform: scale(0.95) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes slide-in {
    0% {
      transform: scale(1) translateY(50px);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }

  @keyframes w3m-shake {
    0% {
      transform: scale(1) rotate(0deg);
    }
    20% {
      transform: scale(1) rotate(-1deg);
    }
    40% {
      transform: scale(1) rotate(1.5deg);
    }
    60% {
      transform: scale(1) rotate(-1.5deg);
    }
    80% {
      transform: scale(1) rotate(1deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }

  @keyframes w3m-view-height {
    from {
      height: var(--prev-height);
    }
    to {
      height: var(--new-height);
    }
  }
`;
      var J = function (e, t, o, i) {
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
      let Q = "scroll-lock";
      class ee extends i.WF {
        constructor() {
          super(),
            (this.unsubscribe = []),
            (this.abortController = void 0),
            (this.hasPrefetched = !1),
            (this.enableEmbedded = n.H.state.enableEmbedded),
            (this.open = l.W.state.open),
            (this.caipAddress = c.W.state.activeCaipAddress),
            (this.caipNetwork = c.W.state.activeCaipNetwork),
            (this.shake = l.W.state.shake),
            (this.filterByNamespace = d.a.state.filterByNamespace),
            this.initializeTheming(),
            h.N.prefetchAnalyticsConfig(),
            this.unsubscribe.push(
              l.W.subscribeKey("open", (e) => (e ? this.onOpen() : this.onClose())),
              l.W.subscribeKey("shake", (e) => (this.shake = e)),
              c.W.subscribeKey("activeCaipNetwork", (e) => this.onNewNetwork(e)),
              c.W.subscribeKey("activeCaipAddress", (e) => this.onNewAddress(e)),
              n.H.subscribeKey("enableEmbedded", (e) => (this.enableEmbedded = e)),
              d.a.subscribeKey("filterByNamespace", (e) => {
                this.filterByNamespace === e ||
                  c.W.getAccountData(e)?.caipAddress ||
                  (h.N.fetchRecommendedWallets(), (this.filterByNamespace = e));
              }),
            );
        }
        firstUpdated() {
          if (this.caipAddress) {
            if (this.enableEmbedded) {
              l.W.close(), this.prefetch();
              return;
            }
            this.onNewAddress(this.caipAddress);
          }
          this.open && this.onOpen(), this.enableEmbedded && this.prefetch();
        }
        disconnectedCallback() {
          this.unsubscribe.forEach((e) => e()), this.onRemoveKeyboardListener();
        }
        render() {
          return ((this.style.cssText = `
      --local-border-bottom-mobile-radius: ${this.enableEmbedded ? "clamp(0px, var(--wui-border-radius-l), 44px)" : "0px"};
    `),
          this.enableEmbedded)
            ? (0, i.qy)`${this.contentTemplate()}
        <w3m-tooltip></w3m-tooltip> `
            : this.open
              ? (0, i.qy)`
          <wui-flex @click=${this.onOverlayClick.bind(this)} data-testid="w3m-modal-overlay">
            ${this.contentTemplate()}
          </wui-flex>
          <w3m-tooltip></w3m-tooltip>
        `
              : null;
        }
        contentTemplate() {
          return (0, i.qy)` <wui-card
      shake="${this.shake}"
      data-embedded="${(0, a.J)(this.enableEmbedded)}"
      role="alertdialog"
      aria-modal="true"
      tabindex="0"
      data-testid="w3m-modal-card"
    >
      <w3m-header></w3m-header>
      <w3m-router></w3m-router>
      <w3m-snackbar></w3m-snackbar>
      <w3m-alertbar></w3m-alertbar>
    </wui-card>`;
        }
        async onOverlayClick(e) {
          e.target === e.currentTarget && (await this.handleClose());
        }
        async handleClose() {
          await w.safeClose();
        }
        initializeTheming() {
          let { themeVariables: e, themeMode: t } = g.W.state,
            o = f.Zv.getColorTheme(t);
          (0, f.RF)(e, o);
        }
        onClose() {
          (this.open = !1),
            this.classList.remove("open"),
            this.onScrollUnlock(),
            m.P.hide(),
            this.onRemoveKeyboardListener();
        }
        onOpen() {
          (this.open = !0),
            this.classList.add("open"),
            this.onScrollLock(),
            this.onAddKeyboardListener();
        }
        onScrollLock() {
          let e = document.createElement("style");
          (e.dataset.w3m = Q),
            (e.textContent = `
      body {
        touch-action: none;
        overflow: hidden;
        overscroll-behavior: contain;
      }
      w3m-modal {
        pointer-events: auto;
      }
    `),
            document.head.appendChild(e);
        }
        onScrollUnlock() {
          let e = document.head.querySelector(`style[data-w3m="${Q}"]`);
          e && e.remove();
        }
        onAddKeyboardListener() {
          this.abortController = new AbortController();
          let e = this.shadowRoot?.querySelector("wui-card");
          e?.focus(),
            window.addEventListener(
              "keydown",
              (t) => {
                if ("Escape" === t.key) this.handleClose();
                else if ("Tab" === t.key) {
                  let { tagName: o } = t.target;
                  !o || o.includes("W3M-") || o.includes("WUI-") || e?.focus();
                }
              },
              this.abortController,
            );
        }
        onRemoveKeyboardListener() {
          this.abortController?.abort(), (this.abortController = void 0);
        }
        async onNewAddress(e) {
          let t = c.W.state.isSwitchingNamespace,
            o = b.w.getPlainAddress(e);
          o || t ? t && o && p.I.goBack() : l.W.close(),
            await u.U.initializeIfEnabled(),
            (this.caipAddress = e),
            c.W.setIsSwitchingNamespace(!1);
        }
        onNewNetwork(e) {
          let t = this.caipNetwork,
            o = t?.caipNetworkId?.toString(),
            i = t?.chainNamespace,
            r = e?.caipNetworkId?.toString(),
            a = e?.chainNamespace,
            n = o !== r,
            d = t?.name === s.o.UNSUPPORTED_NETWORK_NAME,
            h = "ConnectingExternal" === p.I.state.view,
            u = !c.W.getAccountData(e?.chainNamespace)?.caipAddress,
            w = "UnsupportedChain" === p.I.state.view,
            g = l.W.state.open,
            m = !1;
          g && !h && (u ? n && (m = !0) : w ? (m = !0) : n && i === a && !d && (m = !0)),
            m && "SIWXSignMessage" !== p.I.state.view && p.I.goBack(),
            (this.caipNetwork = e);
        }
        prefetch() {
          this.hasPrefetched ||
            (h.N.prefetch(), h.N.fetchWalletsByPage({ page: 1 }), (this.hasPrefetched = !0));
        }
      }
      (ee.styles = G),
        J([(0, r.MZ)({ type: Boolean })], ee.prototype, "enableEmbedded", void 0),
        J([(0, r.wk)()], ee.prototype, "open", void 0),
        J([(0, r.wk)()], ee.prototype, "caipAddress", void 0),
        J([(0, r.wk)()], ee.prototype, "caipNetwork", void 0),
        J([(0, r.wk)()], ee.prototype, "shake", void 0),
        J([(0, r.wk)()], ee.prototype, "filterByNamespace", void 0);
      let et = class extends ee {};
      et = J([(0, f.EM)("w3m-modal")], et);
      let eo = class extends ee {};
      eo = J([(0, f.EM)("appkit-modal")], eo);
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
    33380: (e, t, o) => {
      var i = o(2776),
        r = o(8847),
        a = o(24957),
        s = o(93626);
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
      (c.styles = [a.W5, a.ck, n]),
        l([(0, r.MZ)()], c.prototype, "src", void 0),
        l([(0, r.MZ)()], c.prototype, "alt", void 0),
        l([(0, r.MZ)()], c.prototype, "size", void 0),
        (c = l([(0, s.E)("wui-image")], c));
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
    69846: (e, t, o) => {
      o(28563);
    },
  },
]);
