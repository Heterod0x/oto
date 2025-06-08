"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[4350],{21680:(e,t,r)=>{var i=r(2776),a=r(8847);r(28563),r(33380),r(80352);var o=r(24957),s=r(93626);let n=(0,i.AH)`
  button {
    border: none;
    border-radius: var(--wui-border-radius-3xl);
  }

  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='gray'] {
    background-color: transparent;
    color: var(--wui-color-fg-200);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='shade'] {
    background-color: transparent;
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-size='sm'] {
    height: 32px;
    padding: 0 var(--wui-spacing-s);
  }

  button[data-size='md'] {
    height: 40px;
    padding: 0 var(--wui-spacing-l);
  }

  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] > wui-icon {
    width: 14px;
    height: 14px;
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  button.disabled > wui-icon,
  button.disabled > wui-image {
    filter: grayscale(1);
  }

  button[data-variant='main'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-accent-090);
  }

  button[data-variant='shade'] > wui-image,
  button[data-variant='gray'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:focus-visible {
      background-color: var(--wui-color-accent-090);
    }

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

    button[data-variant='shade']:focus-visible,
    button[data-variant='gray']:focus-visible,
    button[data-variant='shade']:hover,
    button[data-variant='gray']:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    button[data-variant='gray']:active,
    button[data-variant='shade']:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  button.disabled {
    color: var(--wui-color-gray-glass-020);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    pointer-events: none;
  }
`;var c=function(e,t,r,i){var a,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(o<3?a(s):o>3?a(t,r,s):a(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s};let l=class extends i.WF{constructor(){super(...arguments),this.variant="accent",this.imageSrc="",this.disabled=!1,this.icon="externalLink",this.size="md",this.text=""}render(){let e="sm"===this.size?"small-600":"paragraph-600";return(0,i.qy)`
      <button
        class=${this.disabled?"disabled":""}
        data-variant=${this.variant}
        data-size=${this.size}
      >
        ${this.imageSrc?(0,i.qy)`<wui-image src=${this.imageSrc}></wui-image>`:null}
        <wui-text variant=${e} color="inherit"> ${this.text} </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </button>
    `}};l.styles=[o.W5,o.fD,n],c([(0,a.MZ)()],l.prototype,"variant",void 0),c([(0,a.MZ)()],l.prototype,"imageSrc",void 0),c([(0,a.MZ)({type:Boolean})],l.prototype,"disabled",void 0),c([(0,a.MZ)()],l.prototype,"icon",void 0),c([(0,a.MZ)()],l.prototype,"size",void 0),c([(0,a.MZ)()],l.prototype,"text",void 0),l=c([(0,s.E)("wui-chip-button")],l)},27239:(e,t,r)=>{var i=r(2776),a=r(8847);r(28563),r(33380);var o=r(22382);function s(e,t,r){return e!==t&&(e-t<0?t-e:e-t)<=r+.1}let n={generate({uri:e,size:t,logoSize:r,dotColor:a="#141414"}){let n=[],c=function(e,t){let r=Array.prototype.slice.call(o.create(e,{errorCorrectionLevel:"Q"}).modules.data,0),i=Math.sqrt(r.length);return r.reduce((e,t,r)=>(r%i==0?e.push([t]):e[e.length-1].push(t))&&e,[])}(e,0),l=t/c.length,d=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];d.forEach(({x:e,y:t})=>{let r=(c.length-7)*l*e,o=(c.length-7)*l*t;for(let e=0;e<d.length;e+=1){let t=l*(7-2*e);n.push((0,i.JW)`
            <rect
              fill=${2===e?a:"transparent"}
              width=${0===e?t-5:t}
              rx= ${0===e?(t-5)*.45:.45*t}
              ry= ${0===e?(t-5)*.45:.45*t}
              stroke=${a}
              stroke-width=${5*(0===e)}
              height=${0===e?t-5:t}
              x= ${0===e?o+l*e+2.5:o+l*e}
              y= ${0===e?r+l*e+2.5:r+l*e}
            />
          `)}});let u=Math.floor((r+25)/l),h=c.length/2-u/2,p=c.length/2+u/2-1,w=[];c.forEach((e,t)=>{e.forEach((e,r)=>{!c[t][r]||t<7&&r<7||t>c.length-8&&r<7||t<7&&r>c.length-8||t>h&&t<p&&r>h&&r<p||w.push([t*l+l/2,r*l+l/2])})});let g={};return w.forEach(([e,t])=>{g[e]?g[e]?.push(t):g[e]=[t]}),Object.entries(g).map(([e,t])=>{let r=t.filter(e=>t.every(t=>!s(e,t,l)));return[Number(e),r]}).forEach(([e,t])=>{t.forEach(t=>{n.push((0,i.JW)`<circle cx=${e} cy=${t} fill=${a} r=${l/2.5} />`)})}),Object.entries(g).filter(([e,t])=>t.length>1).map(([e,t])=>{let r=t.filter(e=>t.some(t=>s(e,t,l)));return[Number(e),r]}).map(([e,t])=>{t.sort((e,t)=>e<t?-1:1);let r=[];for(let e of t){let t=r.find(t=>t.some(t=>s(e,t,l)));t?t.push(e):r.push([e])}return[e,r.map(e=>[e[0],e[e.length-1]])]}).forEach(([e,t])=>{t.forEach(([t,r])=>{n.push((0,i.JW)`
              <line
                x1=${e}
                x2=${e}
                y1=${t}
                y2=${r}
                stroke=${a}
                stroke-width=${l/1.25}
                stroke-linecap="round"
              />
            `)})}),n}};var c=r(24957),l=r(93626);let d=(0,i.AH)`
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
`;var u=function(e,t,r,i){var a,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(o<3?a(s):o>3?a(t,r,s):a(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s};let h=class extends i.WF{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`
     --local-size: ${this.size}px;
     --local-icon-color: ${this.color??"#3396ff"}
    `,(0,i.qy)`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){let e="light"===this.theme?this.size:this.size-32;return(0,i.JW)`
      <svg height=${e} width=${e}>
        ${n.generate({uri:this.uri,size:e,logoSize:this.arenaClear?0:e/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?(0,i.qy)`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?(0,i.qy)`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:(0,i.qy)`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};h.styles=[c.W5,d],u([(0,a.MZ)()],h.prototype,"uri",void 0),u([(0,a.MZ)({type:Number})],h.prototype,"size",void 0),u([(0,a.MZ)()],h.prototype,"theme",void 0),u([(0,a.MZ)()],h.prototype,"imageSrc",void 0),u([(0,a.MZ)()],h.prototype,"alt",void 0),u([(0,a.MZ)()],h.prototype,"color",void 0),u([(0,a.MZ)({type:Boolean})],h.prototype,"arenaClear",void 0),u([(0,a.MZ)({type:Boolean})],h.prototype,"farcaster",void 0),h=u([(0,l.E)("wui-qr-code")],h)},33380:(e,t,r)=>{var i=r(2776),a=r(8847),o=r(24957),s=r(93626);let n=(0,i.AH)`
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
`;var c=function(e,t,r,i){var a,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(o<3?a(s):o>3?a(t,r,s):a(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s};let l=class extends i.WF{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      `,(0,i.qy)`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};l.styles=[o.W5,o.ck,n],c([(0,a.MZ)()],l.prototype,"src",void 0),c([(0,a.MZ)()],l.prototype,"alt",void 0),c([(0,a.MZ)()],l.prototype,"size",void 0),l=c([(0,s.E)("wui-image")],l)},74350:(e,t,r)=>{r.r(t),r.d(t,{W3mWalletReceiveView:()=>k});var i=r(2776),a=r(8847),o=r(51685),s=r(38426),n=r(90588),c=r(7679),l=r(78685),d=r(32736),u=r(84962),h=r(71644),p=r(10021);r(21680),r(28563),r(33380),r(80352),r(7614);var w=r(24957),g=r(93626);let v=(0,i.AH)`
  button {
    display: flex;
    gap: var(--wui-spacing-xl);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xxs);
    padding: var(--wui-spacing-m) var(--wui-spacing-s);
  }

  wui-text {
    width: 100%;
  }

  wui-flex {
    width: auto;
  }

  .network-icon {
    width: var(--wui-spacing-2l);
    height: var(--wui-spacing-2l);
    border-radius: calc(var(--wui-spacing-2l) / 2);
    overflow: hidden;
    box-shadow:
      0 0 0 3px var(--wui-color-gray-glass-002),
      0 0 0 3px var(--wui-color-modal-bg);
  }
`;var b=function(e,t,r,i){var a,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(o<3?a(s):o>3?a(t,r,s):a(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s};let f=class extends i.WF{constructor(){super(...arguments),this.networkImages=[""],this.text=""}render(){return(0,i.qy)`
      <button>
        <wui-text variant="small-400" color="fg-200">${this.text}</wui-text>
        <wui-flex gap="3xs" alignItems="center">
          ${this.networksTemplate()}
          <wui-icon name="chevronRight" size="sm" color="fg-200"></wui-icon>
        </wui-flex>
      </button>
    `}networksTemplate(){let e=this.networkImages.slice(0,5);return(0,i.qy)` <wui-flex class="networks">
      ${e?.map(e=>(0,i.qy)` <wui-flex class="network-icon"> <wui-image src=${e}></wui-image> </wui-flex>`)}
    </wui-flex>`}};f.styles=[w.W5,w.fD,v],b([(0,a.MZ)({type:Array})],f.prototype,"networkImages",void 0),b([(0,a.MZ)()],f.prototype,"text",void 0),f=b([(0,g.E)("wui-compatible-network")],f),r(79824),r(27239),r(77740);var m=r(15256);let y=(0,i.AH)`
  wui-compatible-network {
    margin-top: var(--wui-spacing-l);
  }
`;var x=function(e,t,r,i){var a,o=arguments.length,s=o<3?t:null===i?i=Object.getOwnPropertyDescriptor(t,r):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)s=Reflect.decorate(e,t,r,i);else for(var n=e.length-1;n>=0;n--)(a=e[n])&&(s=(o<3?a(s):o>3?a(t,r,s):a(t,r))||s);return o>3&&s&&Object.defineProperty(t,r,s),s};let k=class extends i.WF{constructor(){super(),this.unsubscribe=[],this.address=s.U.state.address,this.profileName=s.U.state.profileName,this.network=n.W.state.activeCaipNetwork,this.preferredAccountTypes=s.U.state.preferredAccountTypes,this.unsubscribe.push(s.U.subscribe(e=>{e.address?(this.address=e.address,this.profileName=e.profileName,this.preferredAccountTypes=e.preferredAccountTypes):c.P.showError("Account not found")}),n.W.subscribeKey("activeCaipNetwork",e=>{e?.id&&(this.network=e)}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){if(!this.address)throw Error("w3m-wallet-receive-view: No account provided");let e=l.$.getNetworkImage(this.network);return(0,i.qy)` <wui-flex
      flexDirection="column"
      .padding=${["0","l","l","l"]}
      alignItems="center"
    >
      <wui-chip-button
        data-testid="receive-address-copy-button"
        @click=${this.onCopyClick.bind(this)}
        text=${p.Zv.getTruncateString({string:this.profileName||this.address||"",charsStart:this.profileName?18:4,charsEnd:4*!this.profileName,truncate:this.profileName?"end":"middle"})}
        icon="copy"
        size="sm"
        imageSrc=${e||""}
        variant="gray"
      ></wui-chip-button>
      <wui-flex
        flexDirection="column"
        .padding=${["l","0","0","0"]}
        alignItems="center"
        gap="s"
      >
        <wui-qr-code
          size=${232}
          theme=${d.W.state.themeMode}
          uri=${this.address}
          ?arenaClear=${!0}
          color=${(0,o.J)(d.W.state.themeVariables["--w3m-qr-color"])}
          data-testid="wui-qr-code"
        ></wui-qr-code>
        <wui-text variant="paragraph-500" color="fg-100" align="center">
          Copy your address or scan this QR code
        </wui-text>
      </wui-flex>
      ${this.networkTemplate()}
    </wui-flex>`}networkTemplate(){let e=n.W.getAllRequestedCaipNetworks(),t=n.W.checkIfSmartAccountEnabled(),r=n.W.state.activeCaipNetwork,a=e.filter(e=>e?.chainNamespace===r?.chainNamespace);if(this.preferredAccountTypes?.[r?.chainNamespace]===m.Vl.ACCOUNT_TYPES.SMART_ACCOUNT&&t)return r?(0,i.qy)`<wui-compatible-network
        @click=${this.onReceiveClick.bind(this)}
        text="Only receive assets on this network"
        .networkImages=${[l.$.getNetworkImage(r)??""]}
      ></wui-compatible-network>`:null;let o=(a?.filter(e=>e?.assets?.imageId)?.slice(0,5)).map(l.$.getNetworkImage).filter(Boolean);return(0,i.qy)`<wui-compatible-network
      @click=${this.onReceiveClick.bind(this)}
      text="Only receive assets on these networks"
      .networkImages=${o}
    ></wui-compatible-network>`}onReceiveClick(){u.I.push("WalletCompatibleNetworks")}onCopyClick(){try{this.address&&(h.w.copyToClopboard(this.address),c.P.showSuccess("Address copied"))}catch{c.P.showError("Failed to copy")}}};k.styles=y,x([(0,a.wk)()],k.prototype,"address",void 0),x([(0,a.wk)()],k.prototype,"profileName",void 0),x([(0,a.wk)()],k.prototype,"network",void 0),x([(0,a.wk)()],k.prototype,"preferredAccountTypes",void 0),k=x([(0,p.EM)("w3m-wallet-receive-view")],k)}}]);