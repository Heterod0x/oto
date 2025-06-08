"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [745],
  {
    90745: (t, e, i) => {
      var r,
        a = i(2776),
        o = i(8847),
        s = i(95921),
        n = i(90588),
        c = i(33254),
        l = i(71644),
        p = i(84962),
        u = i(19495),
        d = i(53346),
        h = i(38426),
        g = i(10021);
      i(79824), i(7390), i(16877), i(77740);
      var w = i(51685);
      i(28563), i(80352), i(7614);
      var y = i(24957);
      !(function (t) {
        (t.approve = "approved"),
          (t.bought = "bought"),
          (t.borrow = "borrowed"),
          (t.burn = "burnt"),
          (t.cancel = "canceled"),
          (t.claim = "claimed"),
          (t.deploy = "deployed"),
          (t.deposit = "deposited"),
          (t.execute = "executed"),
          (t.mint = "minted"),
          (t.receive = "received"),
          (t.repay = "repaid"),
          (t.send = "sent"),
          (t.sell = "sold"),
          (t.stake = "staked"),
          (t.trade = "swapped"),
          (t.unstake = "unstaked"),
          (t.withdraw = "withdrawn");
      })(r || (r = {}));
      var x = i(93626);
      i(33380), i(21846);
      let m = (0, a.AH)`
  :host > wui-flex {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: 40px;
    height: 40px;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-gray-glass-005);
  }

  :host > wui-flex wui-image {
    display: block;
  }

  :host > wui-flex,
  :host > wui-flex wui-image,
  .swap-images-container,
  .swap-images-container.nft,
  wui-image.nft {
    border-top-left-radius: var(--local-left-border-radius);
    border-top-right-radius: var(--local-right-border-radius);
    border-bottom-left-radius: var(--local-left-border-radius);
    border-bottom-right-radius: var(--local-right-border-radius);
  }

  wui-icon {
    width: 20px;
    height: 20px;
  }

  wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }

  .swap-images-container {
    position: relative;
    width: 40px;
    height: 40px;
    overflow: hidden;
  }

  .swap-images-container wui-image:first-child {
    position: absolute;
    width: 40px;
    height: 40px;
    top: 0;
    left: 0%;
    clip-path: inset(0px calc(50% + 2px) 0px 0%);
  }

  .swap-images-container wui-image:last-child {
    clip-path: inset(0px 0px 0px calc(50% + 2px));
  }
`;
      var f = function (t, e, i, r) {
        var a,
          o = arguments.length,
          s = o < 3 ? e : null === r ? (r = Object.getOwnPropertyDescriptor(e, i)) : r;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(t, e, i, r);
        else
          for (var n = t.length - 1; n >= 0; n--)
            (a = t[n]) && (s = (o < 3 ? a(s) : o > 3 ? a(e, i, s) : a(e, i)) || s);
        return o > 3 && s && Object.defineProperty(e, i, s), s;
      };
      let v = class extends a.WF {
        constructor() {
          super(...arguments), (this.images = []), (this.secondImage = { type: void 0, url: "" });
        }
        render() {
          let [t, e] = this.images,
            i = t?.type === "NFT",
            r = e?.url ? "NFT" === e.type : i;
          return (
            (this.style.cssText = `
    --local-left-border-radius: ${i ? "var(--wui-border-radius-xxs)" : "var(--wui-border-radius-s)"};
    --local-right-border-radius: ${r ? "var(--wui-border-radius-xxs)" : "var(--wui-border-radius-s)"};
    `),
            (0, a.qy)`<wui-flex> ${this.templateVisual()} ${this.templateIcon()} </wui-flex>`
          );
        }
        templateVisual() {
          let [t, e] = this.images,
            i = t?.type;
          return 2 === this.images.length && (t?.url || e?.url)
            ? (0, a.qy)`<div class="swap-images-container">
        ${t?.url ? ((0, a.qy))`<wui-image src=${t.url} alt="Transaction image"></wui-image>` : null}
        ${e?.url ? ((0, a.qy))`<wui-image src=${e.url} alt="Transaction image"></wui-image>` : null}
      </div>`
            : t?.url
              ? (0, a.qy)`<wui-image src=${t.url} alt="Transaction image"></wui-image>`
              : "NFT" === i
                ? (0,
                  a.qy)`<wui-icon size="inherit" color="fg-200" name="nftPlaceholder"></wui-icon>`
                : (0,
                  a.qy)`<wui-icon size="inherit" color="fg-200" name="coinPlaceholder"></wui-icon>`;
        }
        templateIcon() {
          let t,
            e = "accent-100";
          return ((t = this.getIcon()), this.status && (e = this.getStatusColor()), t)
            ? (0, a.qy)`
      <wui-icon-box
        size="xxs"
        iconColor=${e}
        backgroundColor=${e}
        background="opaque"
        icon=${t}
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
    `
            : null;
        }
        getDirectionIcon() {
          switch (this.direction) {
            case "in":
              return "arrowBottom";
            case "out":
              return "arrowTop";
            default:
              return;
          }
        }
        getIcon() {
          return this.onlyDirectionIcon
            ? this.getDirectionIcon()
            : "trade" === this.type
              ? "swapHorizontalBold"
              : "approve" === this.type
                ? "checkmark"
                : "cancel" === this.type
                  ? "close"
                  : this.getDirectionIcon();
        }
        getStatusColor() {
          switch (this.status) {
            case "confirmed":
              return "success-100";
            case "failed":
              return "error-100";
            case "pending":
              return "inverse-100";
            default:
              return "accent-100";
          }
        }
      };
      (v.styles = [m]),
        f([(0, o.MZ)()], v.prototype, "type", void 0),
        f([(0, o.MZ)()], v.prototype, "status", void 0),
        f([(0, o.MZ)()], v.prototype, "direction", void 0),
        f([(0, o.MZ)({ type: Boolean })], v.prototype, "onlyDirectionIcon", void 0),
        f([(0, o.MZ)({ type: Array })], v.prototype, "images", void 0),
        f([(0, o.MZ)({ type: Object })], v.prototype, "secondImage", void 0),
        (v = f([(0, x.E)("wui-transaction-visual")], v));
      let b = (0, a.AH)`
  :host > wui-flex:first-child {
    align-items: center;
    column-gap: var(--wui-spacing-s);
    padding: 6.5px var(--wui-spacing-xs) 6.5px var(--wui-spacing-xs);
    width: 100%;
  }

  :host > wui-flex:first-child wui-text:nth-child(1) {
    text-transform: capitalize;
  }

  wui-transaction-visual {
    width: 40px;
    height: 40px;
  }

  wui-flex {
    flex: 1;
  }

  :host wui-flex wui-flex {
    overflow: hidden;
  }

  :host .description-container wui-text span {
    word-break: break-all;
  }

  :host .description-container wui-text {
    overflow: hidden;
  }

  :host .description-separator-icon {
    margin: 0px 6px;
  }

  :host wui-text > span {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
`;
      var $ = function (t, e, i, r) {
        var a,
          o = arguments.length,
          s = o < 3 ? e : null === r ? (r = Object.getOwnPropertyDescriptor(e, i)) : r;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(t, e, i, r);
        else
          for (var n = t.length - 1; n >= 0; n--)
            (a = t[n]) && (s = (o < 3 ? a(s) : o > 3 ? a(e, i, s) : a(e, i)) || s);
        return o > 3 && s && Object.defineProperty(e, i, s), s;
      };
      let k = class extends a.WF {
        constructor() {
          super(...arguments),
            (this.type = "approve"),
            (this.onlyDirectionIcon = !1),
            (this.images = []),
            (this.price = []),
            (this.amount = []),
            (this.symbol = []);
        }
        render() {
          return (0, a.qy)`
      <wui-flex>
        <wui-transaction-visual
          .status=${this.status}
          direction=${(0, w.J)(this.direction)}
          type=${this.type}
          onlyDirectionIcon=${(0, w.J)(this.onlyDirectionIcon)}
          .images=${this.images}
        ></wui-transaction-visual>
        <wui-flex flexDirection="column" gap="3xs">
          <wui-text variant="paragraph-600" color="fg-100">
            ${r[this.type] || this.type}
          </wui-text>
          <wui-flex class="description-container">
            ${this.templateDescription()} ${this.templateSecondDescription()}
          </wui-flex>
        </wui-flex>
        <wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>
      </wui-flex>
    `;
        }
        templateDescription() {
          let t = this.descriptions?.[0];
          return t
            ? (0, a.qy)`
          <wui-text variant="small-500" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `
            : null;
        }
        templateSecondDescription() {
          let t = this.descriptions?.[1];
          return t
            ? (0, a.qy)`
          <wui-icon class="description-separator-icon" size="xxs" name="arrowRight"></wui-icon>
          <wui-text variant="small-400" color="fg-200">
            <span>${t}</span>
          </wui-text>
        `
            : null;
        }
      };
      (k.styles = [y.W5, b]),
        $([(0, o.MZ)()], k.prototype, "type", void 0),
        $([(0, o.MZ)({ type: Array })], k.prototype, "descriptions", void 0),
        $([(0, o.MZ)()], k.prototype, "date", void 0),
        $([(0, o.MZ)({ type: Boolean })], k.prototype, "onlyDirectionIcon", void 0),
        $([(0, o.MZ)()], k.prototype, "status", void 0),
        $([(0, o.MZ)()], k.prototype, "direction", void 0),
        $([(0, o.MZ)({ type: Array })], k.prototype, "images", void 0),
        $([(0, o.MZ)({ type: Array })], k.prototype, "price", void 0),
        $([(0, o.MZ)({ type: Array })], k.prototype, "amount", void 0),
        $([(0, o.MZ)({ type: Array })], k.prototype, "symbol", void 0),
        (k = $([(0, x.E)("wui-transaction-list-item")], k)),
        i(6679);
      var T = i(15256);
      let A = (0, a.AH)`
  :host {
    min-height: 100%;
  }

  .group-container[last-group='true'] {
    padding-bottom: var(--wui-spacing-m);
  }

  .contentContainer {
    height: 280px;
  }

  .contentContainer > wui-icon-box {
    width: 40px;
    height: 40px;
    border-radius: var(--wui-border-radius-xxs);
  }

  .contentContainer > .textContent {
    width: 65%;
  }

  .emptyContainer {
    height: 100%;
  }
`;
      var C = function (t, e, i, r) {
        var a,
          o = arguments.length,
          s = o < 3 ? e : null === r ? (r = Object.getOwnPropertyDescriptor(e, i)) : r;
        if ("object" == typeof Reflect && "function" == typeof Reflect.decorate)
          s = Reflect.decorate(t, e, i, r);
        else
          for (var n = t.length - 1; n >= 0; n--)
            (a = t[n]) && (s = (o < 3 ? a(s) : o > 3 ? a(e, i, s) : a(e, i)) || s);
        return o > 3 && s && Object.defineProperty(e, i, s), s;
      };
      let I = "last-transaction",
        D = class extends a.WF {
          constructor() {
            super(),
              (this.unsubscribe = []),
              (this.paginationObserver = void 0),
              (this.page = "activity"),
              (this.caipAddress = n.W.state.activeCaipAddress),
              (this.transactionsByYear = c.W.state.transactionsByYear),
              (this.loading = c.W.state.loading),
              (this.empty = c.W.state.empty),
              (this.next = c.W.state.next),
              c.W.clearCursor(),
              this.unsubscribe.push(
                n.W.subscribeKey("activeCaipAddress", (t) => {
                  t &&
                    this.caipAddress !== t &&
                    (c.W.resetTransactions(), c.W.fetchTransactions(t)),
                    (this.caipAddress = t);
                }),
                n.W.subscribeKey("activeCaipNetwork", () => {
                  this.updateTransactionView();
                }),
                c.W.subscribe((t) => {
                  (this.transactionsByYear = t.transactionsByYear),
                    (this.loading = t.loading),
                    (this.empty = t.empty),
                    (this.next = t.next);
                }),
              );
          }
          firstUpdated() {
            this.updateTransactionView(), this.createPaginationObserver();
          }
          updated() {
            this.setPaginationObserver();
          }
          disconnectedCallback() {
            this.unsubscribe.forEach((t) => t());
          }
          render() {
            return (0, a.qy)` ${this.empty ? null : this.templateTransactionsByYear()}
    ${this.loading ? this.templateLoading() : null}
    ${!this.loading && this.empty ? this.templateEmpty() : null}`;
          }
          updateTransactionView() {
            let t = n.W.state.activeCaipNetwork?.caipNetworkId;
            c.W.state.lastNetworkInView !== t &&
              (c.W.resetTransactions(),
              this.caipAddress && c.W.fetchTransactions(l.w.getPlainAddress(this.caipAddress))),
              c.W.setLastNetworkInView(t);
          }
          templateTransactionsByYear() {
            return Object.keys(this.transactionsByYear)
              .sort()
              .reverse()
              .map((t) => {
                let e = parseInt(t, 10),
                  i = Array(12)
                    .fill(null)
                    .map((t, i) => ({
                      groupTitle: g.tt.getTransactionGroupTitle(e, i),
                      transactions: this.transactionsByYear[e]?.[i],
                    }))
                    .filter(({ transactions: t }) => t)
                    .reverse();
                return i.map(({ groupTitle: t, transactions: e }, r) => {
                  let o = r === i.length - 1;
                  return e
                    ? (0, a.qy)`
          <wui-flex
            flexDirection="column"
            class="group-container"
            last-group="${o ? "true" : "false"}"
            data-testid="month-indexes"
          >
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs", "s", "s", "s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200" data-testid="group-title"
                >${t}</wui-text
              >
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(e, o)}
            </wui-flex>
          </wui-flex>
        `
                    : null;
                });
              });
          }
          templateRenderTransaction(t, e) {
            let {
                date: i,
                descriptions: r,
                direction: o,
                isAllNFT: s,
                images: n,
                status: c,
                transfers: l,
                type: p,
              } = this.getTransactionListItemProps(t),
              u = l?.length > 1;
            return l?.length !== 2 || s
              ? u
                ? l.map((t, r) => {
                    let o = g.tt.getTransferDescription(t),
                      s = e && r === l.length - 1;
                    return (0, a.qy)` <wui-transaction-list-item
          date=${i}
          direction=${t.direction}
          id=${s && this.next ? I : ""}
          status=${c}
          type=${p}
          .onlyDirectionIcon=${!0}
          .images=${[n[r]]}
          .descriptions=${[o]}
        ></wui-transaction-list-item>`;
                  })
                : (0, a.qy)`
      <wui-transaction-list-item
        date=${i}
        .direction=${o}
        id=${e && this.next ? I : ""}
        status=${c}
        type=${p}
        .images=${n}
        .descriptions=${r}
      ></wui-transaction-list-item>
    `
              : (0, a.qy)`
        <wui-transaction-list-item
          date=${i}
          .direction=${o}
          id=${e && this.next ? I : ""}
          status=${c}
          type=${p}
          .images=${n}
          .descriptions=${r}
        ></wui-transaction-list-item>
      `;
          }
          templateTransactions(t, e) {
            return t.map((i, r) => {
              let o = e && r === t.length - 1;
              return (0, a.qy)`${this.templateRenderTransaction(i, o)}`;
            });
          }
          emptyStateActivity() {
            return (0, a.qy)`<wui-flex
      class="emptyContainer"
      flexGrow="1"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      .padding=${["3xl", "xl", "3xl", "xl"]}
      gap="xl"
      data-testid="empty-activity-state"
    >
      <wui-icon-box
        backgroundColor="gray-glass-005"
        background="gray"
        iconColor="fg-200"
        icon="wallet"
        size="lg"
        ?border=${!0}
        borderColor="wui-color-bg-125"
      ></wui-icon-box>
      <wui-flex flexDirection="column" alignItems="center" gap="xs">
        <wui-text align="center" variant="paragraph-500" color="fg-100"
          >No Transactions yet</wui-text
        >
        <wui-text align="center" variant="small-500" color="fg-200"
          >Start trading on dApps <br />
          to grow your wallet!</wui-text
        >
      </wui-flex>
    </wui-flex>`;
          }
          emptyStateAccount() {
            return (0, a.qy)`<wui-flex
      class="contentContainer"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      gap="l"
      data-testid="empty-account-state"
    >
      <wui-icon-box
        icon="swapHorizontal"
        size="inherit"
        iconColor="fg-200"
        backgroundColor="fg-200"
        iconSize="lg"
      ></wui-icon-box>
      <wui-flex
        class="textContent"
        gap="xs"
        flexDirection="column"
        justifyContent="center"
        flexDirection="column"
      >
        <wui-text variant="paragraph-500" align="center" color="fg-100">No activity yet</wui-text>
        <wui-text variant="small-400" align="center" color="fg-200"
          >Your next transactions will appear here</wui-text
        >
      </wui-flex>
      <wui-link @click=${this.onReceiveClick.bind(this)}>Trade</wui-link>
    </wui-flex>`;
          }
          templateEmpty() {
            return "account" === this.page
              ? (0, a.qy)`${this.emptyStateAccount()}`
              : (0, a.qy)`${this.emptyStateActivity()}`;
          }
          templateLoading() {
            return "activity" === this.page
              ? Array(7)
                  .fill(
                    (0,
                    a.qy)` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `,
                  )
                  .map((t) => t)
              : null;
          }
          onReceiveClick() {
            p.I.push("WalletReceive");
          }
          createPaginationObserver() {
            let t = n.W.state.activeChain,
              { projectId: e } = u.H.state;
            (this.paginationObserver = new IntersectionObserver(([i]) => {
              i?.isIntersecting &&
                !this.loading &&
                (c.W.fetchTransactions(l.w.getPlainAddress(this.caipAddress)),
                d.E.sendEvent({
                  type: "track",
                  event: "LOAD_MORE_TRANSACTIONS",
                  properties: {
                    address: l.w.getPlainAddress(this.caipAddress),
                    projectId: e,
                    cursor: this.next,
                    isSmartAccount:
                      h.U.state.preferredAccountTypes?.[t] === T.Vl.ACCOUNT_TYPES.SMART_ACCOUNT,
                  },
                }));
            }, {})),
              this.setPaginationObserver();
          }
          setPaginationObserver() {
            this.paginationObserver?.disconnect();
            let t = this.shadowRoot?.querySelector(`#${I}`);
            t && this.paginationObserver?.observe(t);
          }
          getTransactionListItemProps(t) {
            let e = s.r.formatDate(t?.metadata?.minedAt),
              i = g.tt.getTransactionDescriptions(t),
              r = t?.transfers,
              a = t?.transfers?.[0],
              o = !!a && t?.transfers?.every((t) => !!t.nft_info),
              n = g.tt.getTransactionImages(r);
            return {
              date: e,
              direction: a?.direction,
              descriptions: i,
              isAllNFT: o,
              images: n,
              status: t.metadata?.status,
              transfers: r,
              type: t.metadata?.operationType,
            };
          }
        };
      (D.styles = A),
        C([(0, o.MZ)()], D.prototype, "page", void 0),
        C([(0, o.wk)()], D.prototype, "caipAddress", void 0),
        C([(0, o.wk)()], D.prototype, "transactionsByYear", void 0),
        C([(0, o.wk)()], D.prototype, "loading", void 0),
        C([(0, o.wk)()], D.prototype, "empty", void 0),
        C([(0, o.wk)()], D.prototype, "next", void 0),
        (D = C([(0, g.EM)("w3m-activity-list")], D));
    },
  },
]);
