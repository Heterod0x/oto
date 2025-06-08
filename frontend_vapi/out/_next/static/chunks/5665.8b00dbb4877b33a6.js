"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [5665],
  {
    5665: (e, t, r) => {
      function n(e) {
        let t = new Uint8Array(e),
          r = "";
        for (let e of t) r += String.fromCharCode(e);
        return btoa(r).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      }
      function a(e) {
        let t = e.replace(/-/g, "+").replace(/_/g, "/"),
          r = (4 - (t.length % 4)) % 4,
          n = atob(t.padEnd(t.length + r, "=")),
          a = new ArrayBuffer(n.length),
          o = new Uint8Array(a);
        for (let e = 0; e < n.length; e++) o[e] = n.charCodeAt(e);
        return a;
      }
      function o() {
        return (
          window?.PublicKeyCredential !== void 0 && "function" == typeof window.PublicKeyCredential
        );
      }
      function i(e) {
        let { id: t } = e;
        return { ...e, id: a(t), transports: e.transports };
      }
      function s(e) {
        return "localhost" === e || /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e);
      }
      r.r(t),
        r.d(t, {
          WebAuthnAbortService: () => u,
          WebAuthnError: () => l,
          base64URLStringToBuffer: () => a,
          browserSupportsWebAuthn: () => o,
          browserSupportsWebAuthnAutofill: () => f,
          bufferToBase64URLString: () => n,
          platformAuthenticatorIsAvailable: () => A,
          startAuthentication: () => w,
          startRegistration: () => R,
        });
      class l extends Error {
        constructor({ message: e, code: t, cause: r, name: n }) {
          super(e, { cause: r }), (this.name = n ?? r.name), (this.code = t);
        }
      }
      class c {
        createNewAbortSignal() {
          if (this.controller) {
            let e = Error("Cancelling existing WebAuthn API call for new one");
            (e.name = "AbortError"), this.controller.abort(e);
          }
          let e = new AbortController();
          return (this.controller = e), e.signal;
        }
        cancelCeremony() {
          if (this.controller) {
            let e = Error("Manually cancelling existing WebAuthn API call");
            (e.name = "AbortError"), this.controller.abort(e), (this.controller = void 0);
          }
        }
      }
      let u = new c(),
        d = ["cross-platform", "platform"];
      function h(e) {
        if (e && !(0 > d.indexOf(e))) return e;
      }
      async function R(e) {
        var t;
        let r, c, d, R, f;
        if (!o()) throw Error("WebAuthn is not supported in this browser");
        let w = {
          publicKey: {
            ...e,
            challenge: a(e.challenge),
            user: { ...e.user, id: ((t = e.user.id), new TextEncoder().encode(t)) },
            excludeCredentials: e.excludeCredentials?.map(i),
          },
        };
        w.signal = u.createNewAbortSignal();
        try {
          r = await navigator.credentials.create(w);
        } catch (e) {
          throw (function ({ error: e, options: t }) {
            let { publicKey: r } = t;
            if (!r) throw Error("options was missing required publicKey property");
            if ("AbortError" === e.name) {
              if (t.signal instanceof AbortSignal)
                return new l({
                  message: "Registration ceremony was sent an abort signal",
                  code: "ERROR_CEREMONY_ABORTED",
                  cause: e,
                });
            } else if ("ConstraintError" === e.name) {
              if (r.authenticatorSelection?.requireResidentKey === !0)
                return new l({
                  message:
                    "Discoverable credentials were required but no available authenticator supported it",
                  code: "ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",
                  cause: e,
                });
              else if (r.authenticatorSelection?.userVerification === "required")
                return new l({
                  message:
                    "User verification was required but no available authenticator supported it",
                  code: "ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",
                  cause: e,
                });
            } else if ("InvalidStateError" === e.name)
              return new l({
                message: "The authenticator was previously registered",
                code: "ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",
                cause: e,
              });
            else if ("NotAllowedError" === e.name)
              return new l({
                message: e.message,
                code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
                cause: e,
              });
            else if ("NotSupportedError" === e.name)
              return new l(
                0 === r.pubKeyCredParams.filter((e) => "public-key" === e.type).length
                  ? {
                      message: 'No entry in pubKeyCredParams was of type "public-key"',
                      code: "ERROR_MALFORMED_PUBKEYCREDPARAMS",
                      cause: e,
                    }
                  : {
                      message:
                        "No available authenticator supported any of the specified pubKeyCredParams algorithms",
                      code: "ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",
                      cause: e,
                    },
              );
            else if ("SecurityError" === e.name) {
              let t = window.location.hostname;
              if (!s(t))
                return new l({
                  message: `${window.location.hostname} is an invalid domain`,
                  code: "ERROR_INVALID_DOMAIN",
                  cause: e,
                });
              if (r.rp.id !== t)
                return new l({
                  message: `The RP ID "${r.rp.id}" is invalid for this domain`,
                  code: "ERROR_INVALID_RP_ID",
                  cause: e,
                });
            } else if ("TypeError" === e.name) {
              if (r.user.id.byteLength < 1 || r.user.id.byteLength > 64)
                return new l({
                  message: "User ID was not between 1 and 64 characters",
                  code: "ERROR_INVALID_USER_ID_LENGTH",
                  cause: e,
                });
            } else if ("UnknownError" === e.name)
              return new l({
                message:
                  "The authenticator was unable to process the specified options, or could not create a new credential",
                code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
                cause: e,
              });
            return e;
          })({ error: e, options: w });
        }
        if (!r) throw Error("Registration was not completed");
        let { id: A, rawId: g, response: p, type: b } = r;
        if (
          ("function" == typeof p.getTransports && (d = p.getTransports()),
          "function" == typeof p.getPublicKeyAlgorithm)
        )
          try {
            R = p.getPublicKeyAlgorithm();
          } catch (e) {
            E("getPublicKeyAlgorithm()", e);
          }
        if ("function" == typeof p.getPublicKey)
          try {
            let e = p.getPublicKey();
            null !== e && (f = n(e));
          } catch (e) {
            E("getPublicKey()", e);
          }
        if ("function" == typeof p.getAuthenticatorData)
          try {
            c = n(p.getAuthenticatorData());
          } catch (e) {
            E("getAuthenticatorData()", e);
          }
        return {
          id: A,
          rawId: n(g),
          response: {
            attestationObject: n(p.attestationObject),
            clientDataJSON: n(p.clientDataJSON),
            transports: d,
            publicKeyAlgorithm: R,
            publicKey: f,
            authenticatorData: c,
          },
          type: b,
          clientExtensionResults: r.getClientExtensionResults(),
          authenticatorAttachment: h(r.authenticatorAttachment),
        };
      }
      function E(e, t) {
        console.warn(
          `The browser extension that intercepted this WebAuthn API call incorrectly implemented ${e}. You should report this error to them.
`,
          t,
        );
      }
      function f() {
        let e = window.PublicKeyCredential;
        return void 0 === e.isConditionalMediationAvailable
          ? new Promise((e) => e(!1))
          : e.isConditionalMediationAvailable();
      }
      async function w(e, t = !1) {
        var r;
        let c, d, R;
        if (!o()) throw Error("WebAuthn is not supported in this browser");
        e.allowCredentials?.length !== 0 && (c = e.allowCredentials?.map(i));
        let E = { ...e, challenge: a(e.challenge), allowCredentials: c },
          A = {};
        if (t) {
          if (!(await f())) throw Error("Browser does not support WebAuthn autofill");
          if (document.querySelectorAll("input[autocomplete$='webauthn']").length < 1)
            throw Error(
              'No <input> with "webauthn" as the only or last value in its `autocomplete` attribute was detected',
            );
          (A.mediation = "conditional"), (E.allowCredentials = []);
        }
        (A.publicKey = E), (A.signal = u.createNewAbortSignal());
        try {
          d = await navigator.credentials.get(A);
        } catch (e) {
          throw (function ({ error: e, options: t }) {
            let { publicKey: r } = t;
            if (!r) throw Error("options was missing required publicKey property");
            if ("AbortError" === e.name) {
              if (t.signal instanceof AbortSignal)
                return new l({
                  message: "Authentication ceremony was sent an abort signal",
                  code: "ERROR_CEREMONY_ABORTED",
                  cause: e,
                });
            } else if ("NotAllowedError" === e.name)
              return new l({
                message: e.message,
                code: "ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",
                cause: e,
              });
            else if ("SecurityError" === e.name) {
              let t = window.location.hostname;
              if (!s(t))
                return new l({
                  message: `${window.location.hostname} is an invalid domain`,
                  code: "ERROR_INVALID_DOMAIN",
                  cause: e,
                });
              if (r.rpId !== t)
                return new l({
                  message: `The RP ID "${r.rpId}" is invalid for this domain`,
                  code: "ERROR_INVALID_RP_ID",
                  cause: e,
                });
            } else if ("UnknownError" === e.name)
              return new l({
                message:
                  "The authenticator was unable to process the specified options, or could not create a new assertion signature",
                code: "ERROR_AUTHENTICATOR_GENERAL_ERROR",
                cause: e,
              });
            return e;
          })({ error: e, options: A });
        }
        if (!d) throw Error("Authentication was not completed");
        let { id: g, rawId: p, response: b, type: m } = d;
        return (
          b.userHandle && ((r = b.userHandle), (R = new TextDecoder("utf-8").decode(r))),
          {
            id: g,
            rawId: n(p),
            response: {
              authenticatorData: n(b.authenticatorData),
              clientDataJSON: n(b.clientDataJSON),
              signature: n(b.signature),
              userHandle: R,
            },
            type: m,
            clientExtensionResults: d.getClientExtensionResults(),
            authenticatorAttachment: h(d.authenticatorAttachment),
          }
        );
      }
      function A() {
        return o()
          ? PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
          : new Promise((e) => e(!1));
      }
    },
  },
]);
