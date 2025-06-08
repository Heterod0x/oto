"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[8742],{8742:(e,t,i)=>{i.r(t),i.d(t,{W3mBuyInProgressView:()=>K,W3mOnRampActivityView:()=>b,W3mOnRampProvidersView:()=>D,W3mOnrampFiatSelectView:()=>T,W3mOnrampTokensView:()=>U,W3mOnrampWidget:()=>er,W3mWhatIsABuyView:()=>V});var r=i(2776),o=i(8847),a=i(51685),s=i(95921),n=i(96110),c=i(33254),l=i(37101),u=i(38426),p=i(19495),d=i(10021);i(79824),i(77740),i(6679);var h=i(40369);i(7390),i(15448),i(23125);let w=(0,r.AH)`
  :host {
    width: 100%;
  }

  :host > wui-flex {
    width: 100%;
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xs);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--wui-spacing-s);
  }

  :host > wui-flex:hover {
    background-color: var(--wui-color-gray-glass-002);
  }

  .purchase-image-container {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    width: var(--wui-icon-box-size-lg);
    height: var(--wui-icon-box-size-lg);
  }

  .purchase-image-container wui-image {
    width: 100%;
    height: 100%;
    position: relative;
    border-radius: calc(var(--wui-icon-box-size-lg) / 2);
  }

  .purchase-image-container wui-image::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-icon-box-size-lg) / 2);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  .purchase-image-container wui-icon-box {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: translate(20%, 20%);
  }
`;var m=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let y=class extends r.WF{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="Bought",this.purchaseValue="",this.purchaseCurrency="",this.date="",this.completed=!1,this.inProgress=!1,this.failed=!1,this.onClick=null,this.symbol=""}firstUpdated(){this.icon||this.fetchTokenImage()}render(){return(0,r.qy)`
      <wui-flex>
        ${this.imageTemplate()}
        <wui-flex flexDirection="column" gap="4xs" flexGrow="1">
          <wui-flex gap="xxs" alignItems="center" justifyContent="flex-start">
            ${this.statusIconTemplate()}
            <wui-text variant="paragraph-500" color="fg-100"> ${this.label}</wui-text>
          </wui-flex>
          <wui-text variant="small-400" color="fg-200">
            + ${this.purchaseValue} ${this.purchaseCurrency}
          </wui-text>
        </wui-flex>
        ${this.inProgress?(0,r.qy)`<wui-loading-spinner color="fg-200" size="md"></wui-loading-spinner>`:(0,r.qy)`<wui-text variant="micro-700" color="fg-300"><span>${this.date}</span></wui-text>`}
      </wui-flex>
    `}async fetchTokenImage(){await h.N._fetchTokenImage(this.purchaseCurrency)}statusIconTemplate(){return this.inProgress?null:this.completed?this.boughtIconTemplate():this.errorIconTemplate()}errorIconTemplate(){return(0,r.qy)`<wui-icon-box
      size="xxs"
      iconColor="error-100"
      backgroundColor="error-100"
      background="opaque"
      icon="close"
      borderColor="wui-color-bg-125"
    ></wui-icon-box>`}imageTemplate(){let e=this.icon||`https://avatar.vercel.sh/andrew.svg?size=50&text=${this.symbol}`;return(0,r.qy)`<wui-flex class="purchase-image-container">
      <wui-image src=${e}></wui-image>
    </wui-flex>`}boughtIconTemplate(){return(0,r.qy)`<wui-icon-box
      size="xxs"
      iconColor="success-100"
      backgroundColor="success-100"
      background="opaque"
      icon="arrowBottom"
      borderColor="wui-color-bg-125"
    ></wui-icon-box>`}};y.styles=[w],m([(0,o.MZ)({type:Boolean})],y.prototype,"disabled",void 0),m([(0,o.MZ)()],y.prototype,"color",void 0),m([(0,o.MZ)()],y.prototype,"label",void 0),m([(0,o.MZ)()],y.prototype,"purchaseValue",void 0),m([(0,o.MZ)()],y.prototype,"purchaseCurrency",void 0),m([(0,o.MZ)()],y.prototype,"date",void 0),m([(0,o.MZ)({type:Boolean})],y.prototype,"completed",void 0),m([(0,o.MZ)({type:Boolean})],y.prototype,"inProgress",void 0),m([(0,o.MZ)({type:Boolean})],y.prototype,"failed",void 0),m([(0,o.MZ)()],y.prototype,"onClick",void 0),m([(0,o.MZ)()],y.prototype,"symbol",void 0),m([(0,o.MZ)()],y.prototype,"icon",void 0),y=m([(0,d.EM)("w3m-onramp-activity-item")],y);let g=(0,r.AH)`
  :host > wui-flex {
    height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: none;
    padding: var(--wui-spacing-m);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }

  :host > wui-flex::-webkit-scrollbar {
    display: none;
  }

  :host > wui-flex > wui-flex {
    width: 100%;
  }

  wui-transaction-list-item-loader {
    width: 100%;
  }
`;var f=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let b=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=n.aG.state.selectedProvider,this.loading=!1,this.coinbaseTransactions=c.W.state.coinbaseTransactions,this.tokenImages=l.j.state.tokenImages,this.unsubscribe.push(n.aG.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e}),l.j.subscribeKey("tokenImages",e=>this.tokenImages=e),()=>{clearTimeout(this.refetchTimeout)},c.W.subscribe(e=>{this.coinbaseTransactions={...e.coinbaseTransactions}})),c.W.clearCursor(),this.fetchTransactions()}render(){return(0,r.qy)`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.loading?this.templateLoading():this.templateTransactionsByYear()}
      </wui-flex>
    `}templateTransactions(e){return e?.map(e=>{let t=s.r.formatDate(e?.metadata?.minedAt),i=e.transfers[0],o=i?.fungible_info;if(!o)return null;let n=o?.icon?.url||this.tokenImages?.[o.symbol||""];return(0,r.qy)`
        <w3m-onramp-activity-item
          label="Bought"
          .completed=${"ONRAMP_TRANSACTION_STATUS_SUCCESS"===e.metadata.status}
          .inProgress=${"ONRAMP_TRANSACTION_STATUS_IN_PROGRESS"===e.metadata.status}
          .failed=${"ONRAMP_TRANSACTION_STATUS_FAILED"===e.metadata.status}
          purchaseCurrency=${(0,a.J)(o.symbol)}
          purchaseValue=${i.quantity.numeric}
          date=${t}
          icon=${(0,a.J)(n)}
          symbol=${(0,a.J)(o.symbol)}
        ></w3m-onramp-activity-item>
      `})}templateTransactionsByYear(){return Object.keys(this.coinbaseTransactions).sort().reverse().map(e=>{let t=parseInt(e,10);return Array(12).fill(null).map((e,t)=>t).reverse().map(e=>{let i=d.tt.getTransactionGroupTitle(t,e),o=this.coinbaseTransactions[t]?.[e];return o?(0,r.qy)`
          <wui-flex flexDirection="column">
            <wui-flex
              alignItems="center"
              flexDirection="row"
              .padding=${["xs","s","s","s"]}
            >
              <wui-text variant="paragraph-500" color="fg-200">${i}</wui-text>
            </wui-flex>
            <wui-flex flexDirection="column" gap="xs">
              ${this.templateTransactions(o)}
            </wui-flex>
          </wui-flex>
        `:null})})}async fetchTransactions(){await this.fetchCoinbaseTransactions()}async fetchCoinbaseTransactions(){let e=u.U.state.address,t=p.H.state.projectId;if(!e)throw Error("No address found");if(!t)throw Error("No projectId found");this.loading=!0,await c.W.fetchTransactions(e,"coinbase"),this.loading=!1,this.refetchLoadingTransactions()}refetchLoadingTransactions(){let e=new Date;if(0===(this.coinbaseTransactions[e.getFullYear()]?.[e.getMonth()]||[]).filter(e=>"ONRAMP_TRANSACTION_STATUS_IN_PROGRESS"===e.metadata.status).length)return void clearTimeout(this.refetchTimeout);this.refetchTimeout=setTimeout(async()=>{let e=u.U.state.address;await c.W.fetchTransactions(e,"coinbase"),this.refetchLoadingTransactions()},3e3)}templateLoading(){return Array(7).fill((0,r.qy)` <wui-transaction-list-item-loader></wui-transaction-list-item-loader> `).map(e=>e)}};b.styles=g,f([(0,o.wk)()],b.prototype,"selectedOnRampProvider",void 0),f([(0,o.wk)()],b.prototype,"loading",void 0),f([(0,o.wk)()],b.prototype,"coinbaseTransactions",void 0),f([(0,o.wk)()],b.prototype,"tokenImages",void 0),b=f([(0,d.EM)("w3m-onramp-activity-view")],b);var v=i(28572),x=i(20420);i(54254),i(81412),i(44025);let k=(0,r.AH)`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var C=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let T=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=n.aG.state.paymentCurrency,this.currencies=n.aG.state.paymentCurrencies,this.currencyImages=l.j.state.currencyImages,this.checked=v.o.state.isLegalCheckboxChecked,this.unsubscribe.push(n.aG.subscribe(e=>{this.selectedCurrency=e.paymentCurrency,this.currencies=e.paymentCurrencies}),l.j.subscribeKey("currencyImages",e=>this.currencyImages=e),v.o.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=p.H.state,i=p.H.state.features?.legalCheckbox,o=!!(e||t)&&!!i&&!this.checked;return(0,r.qy)`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","s","s","s"]}
        gap="xs"
        class=${(0,a.J)(o?"disabled":void 0)}
      >
        ${this.currenciesTemplate(o)}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}currenciesTemplate(e=!1){return this.currencies.map(t=>(0,r.qy)`
        <wui-list-item
          imageSrc=${(0,a.J)(this.currencyImages?.[t.id])}
          @click=${()=>this.selectCurrency(t)}
          variant="image"
          tabIdx=${(0,a.J)(e?-1:void 0)}
        >
          <wui-text variant="paragraph-500" color="fg-100">${t.id}</wui-text>
        </wui-list-item>
      `)}selectCurrency(e){e&&(n.aG.setPaymentCurrency(e),x.W.close())}};T.styles=k,C([(0,o.wk)()],T.prototype,"selectedCurrency",void 0),C([(0,o.wk)()],T.prototype,"currencies",void 0),C([(0,o.wk)()],T.prototype,"currencyImages",void 0),C([(0,o.wk)()],T.prototype,"checked",void 0),T=C([(0,d.EM)("w3m-onramp-fiat-select-view")],T);var I=i(90588),R=i(84962),A=i(71644),$=i(53346),P=i(13316),O=i(84743),j=i(15256),W=i(78685);i(69846),i(57148);let M=(0,r.AH)`
  button {
    padding: var(--wui-spacing-s);
    border-radius: var(--wui-border-radius-xs);
    border: none;
    outline: none;
    background-color: var(--wui-color-gray-glass-002);
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: var(--wui-spacing-s);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }

  .provider-image {
    width: var(--wui-spacing-3xl);
    min-width: var(--wui-spacing-3xl);
    height: var(--wui-spacing-3xl);
    border-radius: calc(var(--wui-border-radius-xs) - calc(var(--wui-spacing-s) / 2));
    position: relative;
    overflow: hidden;
  }

  .provider-image::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-border-radius-xs) - calc(var(--wui-spacing-s) / 2));
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  .network-icon {
    width: var(--wui-spacing-m);
    height: var(--wui-spacing-m);
    border-radius: calc(var(--wui-spacing-m) / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-002),
      0 0 0 3px var(--wui-color-modal-bg);
    transition: box-shadow var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: box-shadow;
  }

  button:hover .network-icon {
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-005),
      0 0 0 3px var(--wui-color-modal-bg);
  }
`;var S=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let _=class extends r.WF{constructor(){super(...arguments),this.disabled=!1,this.color="inherit",this.label="",this.feeRange="",this.loading=!1,this.onClick=null}render(){return(0,r.qy)`
      <button ?disabled=${this.disabled} @click=${this.onClick} ontouchstart>
        <wui-visual name=${(0,a.J)(this.name)} class="provider-image"></wui-visual>
        <wui-flex flexDirection="column" gap="4xs">
          <wui-text variant="paragraph-500" color="fg-100">${this.label}</wui-text>
          <wui-flex alignItems="center" justifyContent="flex-start" gap="l">
            <wui-text variant="tiny-500" color="fg-100">
              <wui-text variant="tiny-400" color="fg-200">Fees</wui-text>
              ${this.feeRange}
            </wui-text>
            <wui-flex gap="xxs">
              <wui-icon name="bank" size="xs" color="fg-150"></wui-icon>
              <wui-icon name="card" size="xs" color="fg-150"></wui-icon>
            </wui-flex>
            ${this.networksTemplate()}
          </wui-flex>
        </wui-flex>
        ${this.loading?(0,r.qy)`<wui-loading-spinner color="fg-200" size="md"></wui-loading-spinner>`:(0,r.qy)`<wui-icon name="chevronRight" color="fg-200" size="sm"></wui-icon>`}
      </button>
    `}networksTemplate(){let e=I.W.getAllRequestedCaipNetworks(),t=e?.filter(e=>e?.assets?.imageId)?.slice(0,5);return(0,r.qy)`
      <wui-flex class="networks">
        ${t?.map(e=>(0,r.qy)`
            <wui-flex class="network-icon">
              <wui-image src=${(0,a.J)(W.$.getNetworkImage(e))}></wui-image>
            </wui-flex>
          `)}
      </wui-flex>
    `}};_.styles=[M],S([(0,o.MZ)({type:Boolean})],_.prototype,"disabled",void 0),S([(0,o.MZ)()],_.prototype,"color",void 0),S([(0,o.MZ)()],_.prototype,"name",void 0),S([(0,o.MZ)()],_.prototype,"label",void 0),S([(0,o.MZ)()],_.prototype,"feeRange",void 0),S([(0,o.MZ)({type:Boolean})],_.prototype,"loading",void 0),S([(0,o.MZ)()],_.prototype,"onClick",void 0),_=S([(0,d.EM)("w3m-onramp-provider-item")],_),i(16877);let q=(0,r.AH)`
  wui-flex {
    border-top: 1px solid var(--wui-color-gray-glass-005);
  }

  a {
    text-decoration: none;
    color: var(--wui-color-fg-175);
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--wui-spacing-3xs);
  }
`,E=class extends r.WF{render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=p.H.state;return e||t?(0,r.qy)`
      <wui-flex
        .padding=${["m","s","s","s"]}
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        gap="s"
      >
        <wui-text color="fg-250" variant="small-400" align="center">
          We work with the best providers to give you the lowest fees and best support. More options
          coming soon!
        </wui-text>

        ${this.howDoesItWorkTemplate()}
      </wui-flex>
    `:null}howDoesItWorkTemplate(){return(0,r.qy)` <wui-link @click=${this.onWhatIsBuy.bind(this)}>
      <wui-icon size="xs" color="accent-100" slot="iconLeft" name="helpCircle"></wui-icon>
      How does it work?
    </wui-link>`}onWhatIsBuy(){let e=I.W.state.activeChain;$.E.sendEvent({type:"track",event:"SELECT_WHAT_IS_A_BUY",properties:{isSmartAccount:u.U.state.preferredAccountTypes?.[e]===j.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}}),R.I.push("WhatIsABuy")}};E.styles=[q],E=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s}([(0,d.EM)("w3m-onramp-providers-footer")],E);var N=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let D=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.providers=n.aG.state.providers,this.unsubscribe.push(n.aG.subscribeKey("providers",e=>{this.providers=e}))}firstUpdated(){Promise.all(this.providers.map(async e=>"coinbase"===e.name?await this.getCoinbaseOnRampURL():Promise.resolve(e?.url))).then(e=>{this.providers=this.providers.map((t,i)=>({...t,url:e[i]||""}))})}render(){return(0,r.qy)`
      <wui-flex flexDirection="column" .padding=${["0","s","s","s"]} gap="xs">
        ${this.onRampProvidersTemplate()}
      </wui-flex>
      <w3m-onramp-providers-footer></w3m-onramp-providers-footer>
    `}onRampProvidersTemplate(){return this.providers.filter(e=>e.supportedChains.includes(I.W.state.activeChain??"eip155")).map(e=>(0,r.qy)`
          <w3m-onramp-provider-item
            label=${e.label}
            name=${e.name}
            feeRange=${e.feeRange}
            @click=${()=>{this.onClickProvider(e)}}
            ?disabled=${!e.url}
            data-testid=${`onramp-provider-${e.name}`}
          ></w3m-onramp-provider-item>
        `)}onClickProvider(e){let t=I.W.state.activeChain;n.aG.setSelectedProvider(e),R.I.push("BuyInProgress"),A.w.openHref(e.url,"popupWindow","width=600,height=800,scrollbars=yes"),$.E.sendEvent({type:"track",event:"SELECT_BUY_PROVIDER",properties:{provider:e.name,isSmartAccount:u.U.state.preferredAccountTypes?.[t]===j.Vl.ACCOUNT_TYPES.SMART_ACCOUNT}})}async getCoinbaseOnRampURL(){let e=u.U.state.address,t=I.W.state.activeCaipNetwork;if(!e)throw Error("No address found");if(!t?.name)throw Error("No network found");let i=P.oU.WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP[t.name]??P.oU.WC_COINBASE_PAY_SDK_FALLBACK_CHAIN,r=n.aG.state.purchaseCurrency,o=r?[r.symbol]:n.aG.state.purchaseCurrencies.map(e=>e.symbol);return await O.T.generateOnRampURL({defaultNetwork:i,destinationWallets:[{address:e,blockchains:P.oU.WC_COINBASE_PAY_SDK_CHAINS,assets:o}],partnerUserId:e,purchaseAmount:n.aG.state.purchaseAmount})}};N([(0,o.wk)()],D.prototype,"providers",void 0),D=N([(0,d.EM)("w3m-onramp-providers-view")],D);let G=(0,r.AH)`
  :host > wui-grid {
    max-height: 360px;
    overflow: auto;
  }

  wui-flex {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-flex.disabled {
    opacity: 0.3;
    pointer-events: none;
    user-select: none;
  }
`;var B=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let U=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.selectedCurrency=n.aG.state.purchaseCurrencies,this.tokens=n.aG.state.purchaseCurrencies,this.tokenImages=l.j.state.tokenImages,this.checked=v.o.state.isLegalCheckboxChecked,this.unsubscribe.push(n.aG.subscribe(e=>{this.selectedCurrency=e.purchaseCurrencies,this.tokens=e.purchaseCurrencies}),l.j.subscribeKey("tokenImages",e=>this.tokenImages=e),v.o.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let{termsConditionsUrl:e,privacyPolicyUrl:t}=p.H.state,i=p.H.state.features?.legalCheckbox,o=!!(e||t)&&!!i&&!this.checked;return(0,r.qy)`
      <w3m-legal-checkbox></w3m-legal-checkbox>
      <wui-flex
        flexDirection="column"
        .padding=${["0","s","s","s"]}
        gap="xs"
        class=${(0,a.J)(o?"disabled":void 0)}
      >
        ${this.currenciesTemplate(o)}
      </wui-flex>
      <w3m-legal-footer></w3m-legal-footer>
    `}currenciesTemplate(e=!1){return this.tokens.map(t=>(0,r.qy)`
        <wui-list-item
          imageSrc=${(0,a.J)(this.tokenImages?.[t.symbol])}
          @click=${()=>this.selectToken(t)}
          variant="image"
          tabIdx=${(0,a.J)(e?-1:void 0)}
        >
          <wui-flex gap="3xs" alignItems="center">
            <wui-text variant="paragraph-500" color="fg-100">${t.name}</wui-text>
            <wui-text variant="small-400" color="fg-200">${t.symbol}</wui-text>
          </wui-flex>
        </wui-list-item>
      `)}selectToken(e){e&&(n.aG.setPurchaseCurrency(e),x.W.close())}};U.styles=G,B([(0,o.wk)()],U.prototype,"selectedCurrency",void 0),B([(0,o.wk)()],U.prototype,"tokens",void 0),B([(0,o.wk)()],U.prototype,"tokenImages",void 0),B([(0,o.wk)()],U.prototype,"checked",void 0),U=B([(0,d.EM)("w3m-onramp-token-select-view")],U);var L=i(26115),z=i(7679),Z=i(32736);i(61823),i(84219);let H=(0,r.AH)`
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

  wui-visual {
    width: var(--wui-wallet-image-size-lg);
    height: var(--wui-wallet-image-size-lg);
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    position: relative;
    overflow: hidden;
  }

  wui-visual::after {
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    position: absolute;
    inset: 0;
    border-radius: calc(var(--wui-border-radius-5xs) * 9 - var(--wui-border-radius-xxs));
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition:
      opacity var(--wui-ease-out-power-2) var(--wui-duration-lg),
      transform var(--wui-ease-out-power-2) var(--wui-duration-lg);
    will-change: opacity, transform;
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

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }

  wui-link {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
  }
`;var F=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let K=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.selectedOnRampProvider=n.aG.state.selectedProvider,this.uri=L.x.state.wcUri,this.ready=!1,this.showRetry=!1,this.buffering=!1,this.error=!1,this.startTime=null,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(n.aG.subscribeKey("selectedProvider",e=>{this.selectedOnRampProvider=e})),this.watchTransactions()}disconnectedCallback(){this.intervalId&&clearInterval(this.intervalId)}render(){let e="Continue in external window";this.error?e="Buy failed":this.selectedOnRampProvider&&(e=`Buy in ${this.selectedOnRampProvider?.label}`);let t=this.error?"Buy can be declined from your side or due to and error on the provider app":`We’ll notify you once your Buy is processed`;return(0,r.qy)`
      <wui-flex
        data-error=${(0,a.J)(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-visual
            name=${(0,a.J)(this.selectedOnRampProvider?.name)}
            size="lg"
            class="provider-image"
          >
          </wui-visual>

          ${this.error?null:this.loaderTemplate()}

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
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${e}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        ${this.error?this.tryAgainTemplate():null}
      </wui-flex>

      <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
        <wui-link @click=${this.onCopyUri} color="fg-200">
          <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
          Copy link
        </wui-link>
      </wui-flex>
    `}watchTransactions(){this.selectedOnRampProvider&&"coinbase"===this.selectedOnRampProvider.name&&(this.startTime=Date.now(),this.initializeCoinbaseTransactions())}async initializeCoinbaseTransactions(){await this.watchCoinbaseTransactions(),this.intervalId=setInterval(()=>this.watchCoinbaseTransactions(),4e3)}async watchCoinbaseTransactions(){try{let e=u.U.state.address;if(!e)throw Error("No address found");(await O.T.fetchTransactions({account:e,onramp:"coinbase"})).data.filter(e=>new Date(e.metadata.minedAt)>new Date(this.startTime)||"ONRAMP_TRANSACTION_STATUS_IN_PROGRESS"===e.metadata.status).length?(clearInterval(this.intervalId),R.I.replace("OnRampActivity")):this.startTime&&Date.now()-this.startTime>=18e4&&(clearInterval(this.intervalId),this.error=!0)}catch(e){z.P.showError(e)}}onTryAgain(){this.selectedOnRampProvider&&(this.error=!1,A.w.openHref(this.selectedOnRampProvider.url,"popupWindow","width=600,height=800,scrollbars=yes"))}tryAgainTemplate(){return this.selectedOnRampProvider?.url?(0,r.qy)`<wui-button size="md" variant="accent" @click=${this.onTryAgain.bind(this)}>
      <wui-icon color="inherit" slot="iconLeft" name="refresh"></wui-icon>
      Try again
    </wui-button>`:null}loaderTemplate(){let e=Z.W.state.themeVariables["--w3m-border-radius-master"],t=e?parseInt(e.replace("px",""),10):4;return(0,r.qy)`<wui-loading-thumbnail radius=${9*t}></wui-loading-thumbnail>`}onCopyUri(){if(!this.selectedOnRampProvider?.url){z.P.showError("No link found"),R.I.goBack();return}try{A.w.copyToClopboard(this.selectedOnRampProvider.url),z.P.showSuccess("Link copied")}catch{z.P.showError("Failed to copy")}}};K.styles=H,F([(0,o.wk)()],K.prototype,"intervalId",void 0),F([(0,o.wk)()],K.prototype,"selectedOnRampProvider",void 0),F([(0,o.wk)()],K.prototype,"uri",void 0),F([(0,o.wk)()],K.prototype,"ready",void 0),F([(0,o.wk)()],K.prototype,"showRetry",void 0),F([(0,o.wk)()],K.prototype,"buffering",void 0),F([(0,o.wk)()],K.prototype,"error",void 0),F([(0,o.wk)()],K.prototype,"startTime",void 0),F([(0,o.MZ)({type:Boolean})],K.prototype,"isMobile",void 0),F([(0,o.MZ)()],K.prototype,"onRetry",void 0),K=F([(0,d.EM)("w3m-buy-in-progress-view")],K);let V=class extends r.WF{render(){return(0,r.qy)`
      <wui-flex
        flexDirection="column"
        .padding=${["xxl","3xl","xl","3xl"]}
        alignItems="center"
        gap="xl"
      >
        <wui-visual name="onrampCard"></wui-visual>
        <wui-flex flexDirection="column" gap="xs" alignItems="center">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            Quickly and easily buy digital assets!
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            Simply select your preferred onramp provider and add digital assets to your account
            using your credit card or bank transfer
          </wui-text>
        </wui-flex>
        <wui-button @click=${R.I.goBack}>
          <wui-icon size="sm" color="inherit" name="add" slot="iconLeft"></wui-icon>
          Buy
        </wui-button>
      </wui-flex>
    `}};V=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s}([(0,d.EM)("w3m-what-is-a-buy-view")],V),i(3399);let J=(0,r.AH)`
  :host {
    width: 100%;
  }

  wui-loading-spinner {
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
  }

  .currency-container {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: var(--wui-spacing-1xs);
    height: 40px;
    padding: var(--wui-spacing-xs) var(--wui-spacing-1xs) var(--wui-spacing-xs)
      var(--wui-spacing-xs);
    min-width: 95px;
    border-radius: var(--FULL, 1000px);
    border: 1px solid var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    cursor: pointer;
  }

  .currency-container > wui-image {
    height: 24px;
    width: 24px;
    border-radius: 50%;
  }
`;var Y=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let Q=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.type="Token",this.value=0,this.currencies=[],this.selectedCurrency=this.currencies?.[0],this.currencyImages=l.j.state.currencyImages,this.tokenImages=l.j.state.tokenImages,this.unsubscribe.push(n.aG.subscribeKey("purchaseCurrency",e=>{e&&"Fiat"!==this.type&&(this.selectedCurrency=this.formatPurchaseCurrency(e))}),n.aG.subscribeKey("paymentCurrency",e=>{e&&"Token"!==this.type&&(this.selectedCurrency=this.formatPaymentCurrency(e))}),n.aG.subscribe(e=>{"Fiat"===this.type?this.currencies=e.purchaseCurrencies.map(this.formatPurchaseCurrency):this.currencies=e.paymentCurrencies.map(this.formatPaymentCurrency)}),l.j.subscribe(e=>{this.currencyImages={...e.currencyImages},this.tokenImages={...e.tokenImages}}))}firstUpdated(){n.aG.getAvailableCurrencies()}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){let e=this.selectedCurrency?.symbol||"",t=this.currencyImages[e]||this.tokenImages[e];return(0,r.qy)`<wui-input-text type="number" size="lg" value=${this.value}>
      ${this.selectedCurrency?(0,r.qy)` <wui-flex
            class="currency-container"
            justifyContent="space-between"
            alignItems="center"
            gap="xxs"
            @click=${()=>x.W.open({view:`OnRamp${this.type}Select`})}
          >
            <wui-image src=${(0,a.J)(t)}></wui-image>
            <wui-text color="fg-100">${this.selectedCurrency.symbol}</wui-text>
          </wui-flex>`:(0,r.qy)`<wui-loading-spinner></wui-loading-spinner>`}
    </wui-input-text>`}formatPaymentCurrency(e){return{name:e.id,symbol:e.id}}formatPurchaseCurrency(e){return{name:e.name,symbol:e.symbol}}};Q.styles=J,Y([(0,o.MZ)({type:String})],Q.prototype,"type",void 0),Y([(0,o.MZ)({type:Number})],Q.prototype,"value",void 0),Y([(0,o.wk)()],Q.prototype,"currencies",void 0),Y([(0,o.wk)()],Q.prototype,"selectedCurrency",void 0),Y([(0,o.wk)()],Q.prototype,"currencyImages",void 0),Y([(0,o.wk)()],Q.prototype,"tokenImages",void 0),Q=Y([(0,d.EM)("w3m-onramp-input")],Q);let X=(0,r.AH)`
  :host > wui-flex {
    width: 100%;
    max-width: 360px;
  }

  :host > wui-flex > wui-flex {
    border-radius: var(--wui-border-radius-l);
    width: 100%;
  }

  .amounts-container {
    width: 100%;
  }
`;var ee=function(e,t,i,r){var o,a=arguments.length,s=a<3?t:null===r?r=Object.getOwnPropertyDescriptor(t,i):r;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,i,r);else for(var n=e.length-1;n>=0;n--)(o=e[n])&&(s=(a<3?o(s):a>3?o(t,i,s):o(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s};let et={USD:"$",EUR:"€",GBP:"\xa3"},ei=[100,250,500,1e3],er=class extends r.WF{constructor(){super(),this.unsubscribe=[],this.disabled=!1,this.caipAddress=I.W.state.activeCaipAddress,this.loading=x.W.state.loading,this.paymentCurrency=n.aG.state.paymentCurrency,this.paymentAmount=n.aG.state.paymentAmount,this.purchaseAmount=n.aG.state.purchaseAmount,this.quoteLoading=n.aG.state.quotesLoading,this.unsubscribe.push(I.W.subscribeKey("activeCaipAddress",e=>this.caipAddress=e),x.W.subscribeKey("loading",e=>{this.loading=e}),n.aG.subscribe(e=>{this.paymentCurrency=e.paymentCurrency,this.paymentAmount=e.paymentAmount,this.purchaseAmount=e.purchaseAmount,this.quoteLoading=e.quotesLoading}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){return(0,r.qy)`
      <wui-flex flexDirection="column" justifyContent="center" alignItems="center">
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <w3m-onramp-input
            type="Fiat"
            @inputChange=${this.onPaymentAmountChange.bind(this)}
            .value=${this.paymentAmount||0}
          ></w3m-onramp-input>
          <w3m-onramp-input
            type="Token"
            .value=${this.purchaseAmount||0}
            .loading=${this.quoteLoading}
          ></w3m-onramp-input>
          <wui-flex justifyContent="space-evenly" class="amounts-container" gap="xs">
            ${ei.map(e=>(0,r.qy)`<wui-button
                  variant=${this.paymentAmount===e?"accent":"neutral"}
                  size="md"
                  textVariant="paragraph-600"
                  fullWidth
                  @click=${()=>this.selectPresetAmount(e)}
                  >${`${et[this.paymentCurrency?.id||"USD"]} ${e}`}</wui-button
                >`)}
          </wui-flex>
          ${this.templateButton()}
        </wui-flex>
      </wui-flex>
    `}templateButton(){return this.caipAddress?(0,r.qy)`<wui-button
          @click=${this.getQuotes.bind(this)}
          variant="main"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Get quotes
        </wui-button>`:(0,r.qy)`<wui-button
          @click=${this.openModal.bind(this)}
          variant="accent"
          fullWidth
          size="lg"
          borderRadius="xs"
        >
          Connect wallet
        </wui-button>`}getQuotes(){this.loading||x.W.open({view:"OnRampProviders"})}openModal(){x.W.open({view:"Connect"})}async onPaymentAmountChange(e){n.aG.setPaymentAmount(Number(e.detail)),await n.aG.getQuote()}async selectPresetAmount(e){n.aG.setPaymentAmount(e),await n.aG.getQuote()}};er.styles=X,ee([(0,o.MZ)({type:Boolean})],er.prototype,"disabled",void 0),ee([(0,o.wk)()],er.prototype,"caipAddress",void 0),ee([(0,o.wk)()],er.prototype,"loading",void 0),ee([(0,o.wk)()],er.prototype,"paymentCurrency",void 0),ee([(0,o.wk)()],er.prototype,"paymentAmount",void 0),ee([(0,o.wk)()],er.prototype,"purchaseAmount",void 0),ee([(0,o.wk)()],er.prototype,"quoteLoading",void 0),er=ee([(0,d.EM)("w3m-onramp-widget")],er)},15448:(e,t,i)=>{i(33380)}}]);