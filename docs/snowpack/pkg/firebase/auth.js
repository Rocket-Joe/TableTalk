import { b as getModularInstance, g as getApp, a as _getProvider, d as deepEqual, j as isMobileCordova, k as isReactNative, q as querystring, _ as _registerComponent, C as Component, S as SDK_VERSION, r as registerVersion, E as ErrorFactory, i as isBrowserExtension, F as FirebaseError, l as createSubscribe, m as LogLevel, n as base64Decode, p as getUA, s as isIE, L as Logger, t as isEmpty } from '../common/index.esm2017-102f85a9.js';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function _prodErrorMap() {
    // We will include this one message in the prod error map since by the very
    // nature of this error, developers will never be able to see the message
    // using the debugErrorMap (which is installed during auth initialization).
    return {
        ["dependent-sdk-initialized-before-auth" /* DEPENDENT_SDK_INIT_BEFORE_AUTH */]: 'Another Firebase SDK was initialized and is trying to use Auth before Auth is ' +
            'initialized. Please be sure to call `initializeAuth` or `getAuth` before ' +
            'starting any other Firebase SDK.'
    };
}
/**
 * A minimal error map with all verbose error messages stripped.
 *
 * See discussion at {@link AuthErrorMap}
 *
 * @public
 */
const prodErrorMap = _prodErrorMap;
const _DEFAULT_AUTH_ERROR_FACTORY = new ErrorFactory('auth', 'Firebase', _prodErrorMap());

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const logClient = new Logger('@firebase/auth');
function _logError(msg, ...args) {
    if (logClient.logLevel <= LogLevel.ERROR) {
        logClient.error(`Auth (${SDK_VERSION}): ${msg}`, ...args);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _fail(authOrCode, ...rest) {
    throw createErrorInternal(authOrCode, ...rest);
}
function _createError(authOrCode, ...rest) {
    return createErrorInternal(authOrCode, ...rest);
}
function _errorWithCustomMessage(auth, code, message) {
    const errorMap = Object.assign(Object.assign({}, prodErrorMap()), { [code]: message });
    const factory = new ErrorFactory('auth', 'Firebase', errorMap);
    return factory.create(code, {
        appName: auth.name,
    });
}
function _assertInstanceOf(auth, object, instance) {
    const constructorInstance = instance;
    if (!(object instanceof constructorInstance)) {
        if (constructorInstance.name !== object.constructor.name) {
            _fail(auth, "argument-error" /* ARGUMENT_ERROR */);
        }
        throw _errorWithCustomMessage(auth, "argument-error" /* ARGUMENT_ERROR */, `Type of ${object.constructor.name} does not match expected instance.` +
            `Did you pass a reference from a different Auth SDK?`);
    }
}
function createErrorInternal(authOrCode, ...rest) {
    if (typeof authOrCode !== 'string') {
        const code = rest[0];
        const fullParams = [...rest.slice(1)];
        if (fullParams[0]) {
            fullParams[0].appName = authOrCode.name;
        }
        return authOrCode._errorFactory.create(code, ...fullParams);
    }
    return _DEFAULT_AUTH_ERROR_FACTORY.create(authOrCode, ...rest);
}
function _assert(assertion, authOrCode, ...rest) {
    if (!assertion) {
        throw createErrorInternal(authOrCode, ...rest);
    }
}
/**
 * Unconditionally fails, throwing an internal error with the given message.
 *
 * @param failure type of failure encountered
 * @throws Error
 */
function debugFail(failure) {
    // Log the failure in addition to throw an exception, just in case the
    // exception is swallowed.
    const message = `INTERNAL ASSERTION FAILED: ` + failure;
    _logError(message);
    // NOTE: We don't use FirebaseError here because these are internal failures
    // that cannot be handled by the user. (Also it would create a circular
    // dependency between the error and assert modules which doesn't work.)
    throw new Error(message);
}
/**
 * Fails if the given assertion condition is false, throwing an Error with the
 * given message if it did.
 *
 * @param assertion
 * @param message
 */
function debugAssert(assertion, message) {
    if (!assertion) {
        debugFail(message);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const instanceCache = new Map();
function _getInstance(cls) {
    debugAssert(cls instanceof Function, 'Expected a class definition');
    let instance = instanceCache.get(cls);
    if (instance) {
        debugAssert(instance instanceof cls, 'Instance stored in cache mismatched with class');
        return instance;
    }
    instance = new cls();
    instanceCache.set(cls, instance);
    return instance;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Initializes an {@link Auth} instance with fine-grained control over
 * {@link Dependencies}.
 *
 * @remarks
 *
 * This function allows more control over the {@link Auth} instance than
 * {@link getAuth}. `getAuth` uses platform-specific defaults to supply
 * the {@link Dependencies}. In general, `getAuth` is the easiest way to
 * initialize Auth and works for most use cases. Use `initializeAuth` if you
 * need control over which persistence layer is used, or to minimize bundle
 * size if you're not using either `signInWithPopup` or `signInWithRedirect`.
 *
 * For example, if your app only uses anonymous accounts and you only want
 * accounts saved for the current session, initialize `Auth` with:
 *
 * ```js
 * const auth = initializeAuth(app, {
 *   persistence: browserSessionPersistence,
 *   popupRedirectResolver: undefined,
 * });
 * ```
 *
 * @public
 */
function initializeAuth(app, deps) {
    const provider = _getProvider(app, 'auth');
    if (provider.isInitialized()) {
        const auth = provider.getImmediate();
        const initialOptions = provider.getOptions();
        if (deepEqual(initialOptions, deps !== null && deps !== void 0 ? deps : {})) {
            return auth;
        }
        else {
            _fail(auth, "already-initialized" /* ALREADY_INITIALIZED */);
        }
    }
    const auth = provider.initialize({ options: deps });
    return auth;
}
function _initializeAuthInstance(auth, deps) {
    const persistence = (deps === null || deps === void 0 ? void 0 : deps.persistence) || [];
    const hierarchy = (Array.isArray(persistence) ? persistence : [persistence]).map(_getInstance);
    if (deps === null || deps === void 0 ? void 0 : deps.errorMap) {
        auth._updateErrorMap(deps.errorMap);
    }
    // This promise is intended to float; auth initialization happens in the
    // background, meanwhile the auth object may be used by the app.
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    auth._initializeWithPersistence(hierarchy, deps === null || deps === void 0 ? void 0 : deps.popupRedirectResolver);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _getCurrentUrl() {
    var _a;
    return (typeof self !== 'undefined' && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.href)) || '';
}
function _isHttpOrHttps() {
    return _getCurrentScheme() === 'http:' || _getCurrentScheme() === 'https:';
}
function _getCurrentScheme() {
    var _a;
    return (typeof self !== 'undefined' && ((_a = self.location) === null || _a === void 0 ? void 0 : _a.protocol)) || null;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Determine whether the browser is working online
 */
function _isOnline() {
    if (typeof navigator !== 'undefined' &&
        navigator &&
        'onLine' in navigator &&
        typeof navigator.onLine === 'boolean' &&
        // Apply only for traditional web apps and Chrome extensions.
        // This is especially true for Cordova apps which have unreliable
        // navigator.onLine behavior unless cordova-plugin-network-information is
        // installed which overwrites the native navigator.onLine value and
        // defines navigator.connection.
        (_isHttpOrHttps() || isBrowserExtension() || 'connection' in navigator)) {
        return navigator.onLine;
    }
    // If we can't determine the state, assume it is online.
    return true;
}
function _getUserLanguage() {
    if (typeof navigator === 'undefined') {
        return null;
    }
    const navigatorLanguage = navigator;
    return (
    // Most reliable, but only supported in Chrome/Firefox.
    (navigatorLanguage.languages && navigatorLanguage.languages[0]) ||
        // Supported in most browsers, but returns the language of the browser
        // UI, not the language set in browser settings.
        navigatorLanguage.language ||
        // Couldn't determine language.
        null);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A structure to help pick between a range of long and short delay durations
 * depending on the current environment. In general, the long delay is used for
 * mobile environments whereas short delays are used for desktop environments.
 */
class Delay {
    constructor(shortDelay, longDelay) {
        this.shortDelay = shortDelay;
        this.longDelay = longDelay;
        // Internal error when improperly initialized.
        debugAssert(longDelay > shortDelay, 'Short delay should be less than long delay!');
        this.isMobile = isMobileCordova() || isReactNative();
    }
    get() {
        if (!_isOnline()) {
            // Pick the shorter timeout.
            return Math.min(5000 /* OFFLINE */, this.shortDelay);
        }
        // If running in a mobile environment, return the long delay, otherwise
        // return the short delay.
        // This could be improved in the future to dynamically change based on other
        // variables instead of just reading the current environment.
        return this.isMobile ? this.longDelay : this.shortDelay;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _emulatorUrl(config, path) {
    debugAssert(config.emulator, 'Emulator should always be set here');
    const { url } = config.emulator;
    if (!path) {
        return url;
    }
    return `${url}${path.startsWith('/') ? path.slice(1) : path}`;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class FetchProvider {
    static initialize(fetchImpl, headersImpl, responseImpl) {
        this.fetchImpl = fetchImpl;
        if (headersImpl) {
            this.headersImpl = headersImpl;
        }
        if (responseImpl) {
            this.responseImpl = responseImpl;
        }
    }
    static fetch() {
        if (this.fetchImpl) {
            return this.fetchImpl;
        }
        if (typeof self !== 'undefined' && 'fetch' in self) {
            return self.fetch;
        }
        debugFail('Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill');
    }
    static headers() {
        if (this.headersImpl) {
            return this.headersImpl;
        }
        if (typeof self !== 'undefined' && 'Headers' in self) {
            return self.Headers;
        }
        debugFail('Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill');
    }
    static response() {
        if (this.responseImpl) {
            return this.responseImpl;
        }
        if (typeof self !== 'undefined' && 'Response' in self) {
            return self.Response;
        }
        debugFail('Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill');
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Map from errors returned by the server to errors to developer visible errors
 */
const SERVER_ERROR_MAP = {
    // Custom token errors.
    ["CREDENTIAL_MISMATCH" /* CREDENTIAL_MISMATCH */]: "custom-token-mismatch" /* CREDENTIAL_MISMATCH */,
    // This can only happen if the SDK sends a bad request.
    ["MISSING_CUSTOM_TOKEN" /* MISSING_CUSTOM_TOKEN */]: "internal-error" /* INTERNAL_ERROR */,
    // Create Auth URI errors.
    ["INVALID_IDENTIFIER" /* INVALID_IDENTIFIER */]: "invalid-email" /* INVALID_EMAIL */,
    // This can only happen if the SDK sends a bad request.
    ["MISSING_CONTINUE_URI" /* MISSING_CONTINUE_URI */]: "internal-error" /* INTERNAL_ERROR */,
    // Sign in with email and password errors (some apply to sign up too).
    ["INVALID_PASSWORD" /* INVALID_PASSWORD */]: "wrong-password" /* INVALID_PASSWORD */,
    // This can only happen if the SDK sends a bad request.
    ["MISSING_PASSWORD" /* MISSING_PASSWORD */]: "internal-error" /* INTERNAL_ERROR */,
    // Sign up with email and password errors.
    ["EMAIL_EXISTS" /* EMAIL_EXISTS */]: "email-already-in-use" /* EMAIL_EXISTS */,
    ["PASSWORD_LOGIN_DISABLED" /* PASSWORD_LOGIN_DISABLED */]: "operation-not-allowed" /* OPERATION_NOT_ALLOWED */,
    // Verify assertion for sign in with credential errors:
    ["INVALID_IDP_RESPONSE" /* INVALID_IDP_RESPONSE */]: "invalid-credential" /* INVALID_IDP_RESPONSE */,
    ["INVALID_PENDING_TOKEN" /* INVALID_PENDING_TOKEN */]: "invalid-credential" /* INVALID_IDP_RESPONSE */,
    ["FEDERATED_USER_ID_ALREADY_LINKED" /* FEDERATED_USER_ID_ALREADY_LINKED */]: "credential-already-in-use" /* CREDENTIAL_ALREADY_IN_USE */,
    // This can only happen if the SDK sends a bad request.
    ["MISSING_REQ_TYPE" /* MISSING_REQ_TYPE */]: "internal-error" /* INTERNAL_ERROR */,
    // Send Password reset email errors:
    ["EMAIL_NOT_FOUND" /* EMAIL_NOT_FOUND */]: "user-not-found" /* USER_DELETED */,
    ["RESET_PASSWORD_EXCEED_LIMIT" /* RESET_PASSWORD_EXCEED_LIMIT */]: "too-many-requests" /* TOO_MANY_ATTEMPTS_TRY_LATER */,
    ["EXPIRED_OOB_CODE" /* EXPIRED_OOB_CODE */]: "expired-action-code" /* EXPIRED_OOB_CODE */,
    ["INVALID_OOB_CODE" /* INVALID_OOB_CODE */]: "invalid-action-code" /* INVALID_OOB_CODE */,
    // This can only happen if the SDK sends a bad request.
    ["MISSING_OOB_CODE" /* MISSING_OOB_CODE */]: "internal-error" /* INTERNAL_ERROR */,
    // Operations that require ID token in request:
    ["CREDENTIAL_TOO_OLD_LOGIN_AGAIN" /* CREDENTIAL_TOO_OLD_LOGIN_AGAIN */]: "requires-recent-login" /* CREDENTIAL_TOO_OLD_LOGIN_AGAIN */,
    ["INVALID_ID_TOKEN" /* INVALID_ID_TOKEN */]: "invalid-user-token" /* INVALID_AUTH */,
    ["TOKEN_EXPIRED" /* TOKEN_EXPIRED */]: "user-token-expired" /* TOKEN_EXPIRED */,
    ["USER_NOT_FOUND" /* USER_NOT_FOUND */]: "user-token-expired" /* TOKEN_EXPIRED */,
    // Other errors.
    ["TOO_MANY_ATTEMPTS_TRY_LATER" /* TOO_MANY_ATTEMPTS_TRY_LATER */]: "too-many-requests" /* TOO_MANY_ATTEMPTS_TRY_LATER */,
    // Phone Auth related errors.
    ["INVALID_CODE" /* INVALID_CODE */]: "invalid-verification-code" /* INVALID_CODE */,
    ["INVALID_SESSION_INFO" /* INVALID_SESSION_INFO */]: "invalid-verification-id" /* INVALID_SESSION_INFO */,
    ["INVALID_TEMPORARY_PROOF" /* INVALID_TEMPORARY_PROOF */]: "invalid-credential" /* INVALID_IDP_RESPONSE */,
    ["MISSING_SESSION_INFO" /* MISSING_SESSION_INFO */]: "missing-verification-id" /* MISSING_SESSION_INFO */,
    ["SESSION_EXPIRED" /* SESSION_EXPIRED */]: "code-expired" /* CODE_EXPIRED */,
    // Other action code errors when additional settings passed.
    // MISSING_CONTINUE_URI is getting mapped to INTERNAL_ERROR above.
    // This is OK as this error will be caught by client side validation.
    ["MISSING_ANDROID_PACKAGE_NAME" /* MISSING_ANDROID_PACKAGE_NAME */]: "missing-android-pkg-name" /* MISSING_ANDROID_PACKAGE_NAME */,
    ["UNAUTHORIZED_DOMAIN" /* UNAUTHORIZED_DOMAIN */]: "unauthorized-continue-uri" /* UNAUTHORIZED_DOMAIN */,
    // getProjectConfig errors when clientId is passed.
    ["INVALID_OAUTH_CLIENT_ID" /* INVALID_OAUTH_CLIENT_ID */]: "invalid-oauth-client-id" /* INVALID_OAUTH_CLIENT_ID */,
    // User actions (sign-up or deletion) disabled errors.
    ["ADMIN_ONLY_OPERATION" /* ADMIN_ONLY_OPERATION */]: "admin-restricted-operation" /* ADMIN_ONLY_OPERATION */,
    // Multi factor related errors.
    ["INVALID_MFA_PENDING_CREDENTIAL" /* INVALID_MFA_PENDING_CREDENTIAL */]: "invalid-multi-factor-session" /* INVALID_MFA_SESSION */,
    ["MFA_ENROLLMENT_NOT_FOUND" /* MFA_ENROLLMENT_NOT_FOUND */]: "multi-factor-info-not-found" /* MFA_INFO_NOT_FOUND */,
    ["MISSING_MFA_ENROLLMENT_ID" /* MISSING_MFA_ENROLLMENT_ID */]: "missing-multi-factor-info" /* MISSING_MFA_INFO */,
    ["MISSING_MFA_PENDING_CREDENTIAL" /* MISSING_MFA_PENDING_CREDENTIAL */]: "missing-multi-factor-session" /* MISSING_MFA_SESSION */,
    ["SECOND_FACTOR_EXISTS" /* SECOND_FACTOR_EXISTS */]: "second-factor-already-in-use" /* SECOND_FACTOR_ALREADY_ENROLLED */,
    ["SECOND_FACTOR_LIMIT_EXCEEDED" /* SECOND_FACTOR_LIMIT_EXCEEDED */]: "maximum-second-factor-count-exceeded" /* SECOND_FACTOR_LIMIT_EXCEEDED */,
    // Blocking functions related errors.
    ["BLOCKING_FUNCTION_ERROR_RESPONSE" /* BLOCKING_FUNCTION_ERROR_RESPONSE */]: "internal-error" /* INTERNAL_ERROR */,
};

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DEFAULT_API_TIMEOUT_MS = new Delay(30000, 60000);
function _addTidIfNecessary(auth, request) {
    if (auth.tenantId && !request.tenantId) {
        return Object.assign(Object.assign({}, request), { tenantId: auth.tenantId });
    }
    return request;
}
async function _performApiRequest(auth, method, path, request, customErrorMap = {}) {
    return _performFetchWithErrorHandling(auth, customErrorMap, async () => {
        let body = {};
        let params = {};
        if (request) {
            if (method === "GET" /* GET */) {
                params = request;
            }
            else {
                body = {
                    body: JSON.stringify(request)
                };
            }
        }
        const query = querystring(Object.assign({ key: auth.config.apiKey }, params)).slice(1);
        const headers = await auth._getAdditionalHeaders();
        headers["Content-Type" /* CONTENT_TYPE */] = 'application/json';
        if (auth.languageCode) {
            headers["X-Firebase-Locale" /* X_FIREBASE_LOCALE */] = auth.languageCode;
        }
        return FetchProvider.fetch()(_getFinalTarget(auth, auth.config.apiHost, path, query), Object.assign({ method,
            headers, referrerPolicy: 'no-referrer' }, body));
    });
}
async function _performFetchWithErrorHandling(auth, customErrorMap, fetchFn) {
    auth._canInitEmulator = false;
    const errorMap = Object.assign(Object.assign({}, SERVER_ERROR_MAP), customErrorMap);
    try {
        const networkTimeout = new NetworkTimeout(auth);
        const response = await Promise.race([
            fetchFn(),
            networkTimeout.promise
        ]);
        // If we've reached this point, the fetch succeeded and the networkTimeout
        // didn't throw; clear the network timeout delay so that Node won't hang
        networkTimeout.clearNetworkTimeout();
        const json = await response.json();
        if ('needConfirmation' in json) {
            throw _makeTaggedError(auth, "account-exists-with-different-credential" /* NEED_CONFIRMATION */, json);
        }
        if (response.ok && !('errorMessage' in json)) {
            return json;
        }
        else {
            const errorMessage = response.ok ? json.errorMessage : json.error.message;
            const [serverErrorCode, serverErrorMessage] = errorMessage.split(' : ');
            if (serverErrorCode === "FEDERATED_USER_ID_ALREADY_LINKED" /* FEDERATED_USER_ID_ALREADY_LINKED */) {
                throw _makeTaggedError(auth, "credential-already-in-use" /* CREDENTIAL_ALREADY_IN_USE */, json);
            }
            else if (serverErrorCode === "EMAIL_EXISTS" /* EMAIL_EXISTS */) {
                throw _makeTaggedError(auth, "email-already-in-use" /* EMAIL_EXISTS */, json);
            }
            else if (serverErrorCode === "USER_DISABLED" /* USER_DISABLED */) {
                throw _makeTaggedError(auth, "user-disabled" /* USER_DISABLED */, json);
            }
            const authError = errorMap[serverErrorCode] ||
                serverErrorCode
                    .toLowerCase()
                    .replace(/[_\s]+/g, '-');
            if (serverErrorMessage) {
                throw _errorWithCustomMessage(auth, authError, serverErrorMessage);
            }
            else {
                _fail(auth, authError);
            }
        }
    }
    catch (e) {
        if (e instanceof FirebaseError) {
            throw e;
        }
        _fail(auth, "network-request-failed" /* NETWORK_REQUEST_FAILED */);
    }
}
async function _performSignInRequest(auth, method, path, request, customErrorMap = {}) {
    const serverResponse = (await _performApiRequest(auth, method, path, request, customErrorMap));
    if ('mfaPendingCredential' in serverResponse) {
        _fail(auth, "multi-factor-auth-required" /* MFA_REQUIRED */, {
            _serverResponse: serverResponse
        });
    }
    return serverResponse;
}
function _getFinalTarget(auth, host, path, query) {
    const base = `${host}${path}?${query}`;
    if (!auth.config.emulator) {
        return `${auth.config.apiScheme}://${base}`;
    }
    return _emulatorUrl(auth.config, base);
}
class NetworkTimeout {
    constructor(auth) {
        this.auth = auth;
        // Node timers and browser timers are fundamentally incompatible, but we
        // don't care about the value here
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.timer = null;
        this.promise = new Promise((_, reject) => {
            this.timer = setTimeout(() => {
                return reject(_createError(this.auth, "network-request-failed" /* NETWORK_REQUEST_FAILED */));
            }, DEFAULT_API_TIMEOUT_MS.get());
        });
    }
    clearNetworkTimeout() {
        clearTimeout(this.timer);
    }
}
function _makeTaggedError(auth, code, response) {
    const errorParams = {
        appName: auth.name
    };
    if (response.email) {
        errorParams.email = response.email;
    }
    if (response.phoneNumber) {
        errorParams.phoneNumber = response.phoneNumber;
    }
    const error = _createError(auth, code, errorParams);
    // We know customData is defined on error because errorParams is defined
    error.customData._tokenResponse = response;
    return error;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function deleteAccount(auth, request) {
    return _performApiRequest(auth, "POST" /* POST */, "/v1/accounts:delete" /* DELETE_ACCOUNT */, request);
}
async function getAccountInfo(auth, request) {
    return _performApiRequest(auth, "POST" /* POST */, "/v1/accounts:lookup" /* GET_ACCOUNT_INFO */, request);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function utcTimestampToDateString(utcTimestamp) {
    if (!utcTimestamp) {
        return undefined;
    }
    try {
        // Convert to date object.
        const date = new Date(Number(utcTimestamp));
        // Test date is valid.
        if (!isNaN(date.getTime())) {
            // Convert to UTC date string.
            return date.toUTCString();
        }
    }
    catch (e) {
        // Do nothing. undefined will be returned.
    }
    return undefined;
}
/**
 * Returns a deserialized JSON Web Token (JWT) used to identitfy the user to a Firebase service.
 *
 * @remarks
 * Returns the current token if it has not expired or if it will not expire in the next five
 * minutes. Otherwise, this will refresh the token and return a new one.
 *
 * @param user - The user.
 * @param forceRefresh - Force refresh regardless of token expiration.
 *
 * @public
 */
async function getIdTokenResult(user, forceRefresh = false) {
    const userInternal = getModularInstance(user);
    const token = await userInternal.getIdToken(forceRefresh);
    const claims = _parseToken(token);
    _assert(claims && claims.exp && claims.auth_time && claims.iat, userInternal.auth, "internal-error" /* INTERNAL_ERROR */);
    const firebase = typeof claims.firebase === 'object' ? claims.firebase : undefined;
    const signInProvider = firebase === null || firebase === void 0 ? void 0 : firebase['sign_in_provider'];
    return {
        claims,
        token,
        authTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.auth_time)),
        issuedAtTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.iat)),
        expirationTime: utcTimestampToDateString(secondsStringToMilliseconds(claims.exp)),
        signInProvider: signInProvider || null,
        signInSecondFactor: (firebase === null || firebase === void 0 ? void 0 : firebase['sign_in_second_factor']) || null
    };
}
function secondsStringToMilliseconds(seconds) {
    return Number(seconds) * 1000;
}
function _parseToken(token) {
    const [algorithm, payload, signature] = token.split('.');
    if (algorithm === undefined ||
        payload === undefined ||
        signature === undefined) {
        _logError('JWT malformed, contained fewer than 3 sections');
        return null;
    }
    try {
        const decoded = base64Decode(payload);
        if (!decoded) {
            _logError('Failed to decode base64 JWT payload');
            return null;
        }
        return JSON.parse(decoded);
    }
    catch (e) {
        _logError('Caught error parsing JWT payload as JSON', e);
        return null;
    }
}
/**
 * Extract expiresIn TTL from a token by subtracting the expiration from the issuance.
 */
function _tokenExpiresIn(token) {
    const parsedToken = _parseToken(token);
    _assert(parsedToken, "internal-error" /* INTERNAL_ERROR */);
    _assert(typeof parsedToken.exp !== 'undefined', "internal-error" /* INTERNAL_ERROR */);
    _assert(typeof parsedToken.iat !== 'undefined', "internal-error" /* INTERNAL_ERROR */);
    return Number(parsedToken.exp) - Number(parsedToken.iat);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function _logoutIfInvalidated(user, promise, bypassAuthState = false) {
    if (bypassAuthState) {
        return promise;
    }
    try {
        return await promise;
    }
    catch (e) {
        if (e instanceof FirebaseError && isUserInvalidated(e)) {
            if (user.auth.currentUser === user) {
                await user.auth.signOut();
            }
        }
        throw e;
    }
}
function isUserInvalidated({ code }) {
    return (code === `auth/${"user-disabled" /* USER_DISABLED */}` ||
        code === `auth/${"user-token-expired" /* TOKEN_EXPIRED */}`);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class ProactiveRefresh {
    constructor(user) {
        this.user = user;
        this.isRunning = false;
        // Node timers and browser timers return fundamentally different types.
        // We don't actually care what the value is but TS won't accept unknown and
        // we can't cast properly in both environments.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.timerId = null;
        this.errorBackoff = 30000 /* RETRY_BACKOFF_MIN */;
    }
    _start() {
        if (this.isRunning) {
            return;
        }
        this.isRunning = true;
        this.schedule();
    }
    _stop() {
        if (!this.isRunning) {
            return;
        }
        this.isRunning = false;
        if (this.timerId !== null) {
            clearTimeout(this.timerId);
        }
    }
    getInterval(wasError) {
        var _a;
        if (wasError) {
            const interval = this.errorBackoff;
            this.errorBackoff = Math.min(this.errorBackoff * 2, 960000 /* RETRY_BACKOFF_MAX */);
            return interval;
        }
        else {
            // Reset the error backoff
            this.errorBackoff = 30000 /* RETRY_BACKOFF_MIN */;
            const expTime = (_a = this.user.stsTokenManager.expirationTime) !== null && _a !== void 0 ? _a : 0;
            const interval = expTime - Date.now() - 300000 /* OFFSET */;
            return Math.max(0, interval);
        }
    }
    schedule(wasError = false) {
        if (!this.isRunning) {
            // Just in case...
            return;
        }
        const interval = this.getInterval(wasError);
        this.timerId = setTimeout(async () => {
            await this.iteration();
        }, interval);
    }
    async iteration() {
        try {
            await this.user.getIdToken(true);
        }
        catch (e) {
            // Only retry on network errors
            if (e.code === `auth/${"network-request-failed" /* NETWORK_REQUEST_FAILED */}`) {
                this.schedule(/* wasError */ true);
            }
            return;
        }
        this.schedule();
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class UserMetadata {
    constructor(createdAt, lastLoginAt) {
        this.createdAt = createdAt;
        this.lastLoginAt = lastLoginAt;
        this._initializeTime();
    }
    _initializeTime() {
        this.lastSignInTime = utcTimestampToDateString(this.lastLoginAt);
        this.creationTime = utcTimestampToDateString(this.createdAt);
    }
    _copy(metadata) {
        this.createdAt = metadata.createdAt;
        this.lastLoginAt = metadata.lastLoginAt;
        this._initializeTime();
    }
    toJSON() {
        return {
            createdAt: this.createdAt,
            lastLoginAt: this.lastLoginAt
        };
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function _reloadWithoutSaving(user) {
    var _a;
    const auth = user.auth;
    const idToken = await user.getIdToken();
    const response = await _logoutIfInvalidated(user, getAccountInfo(auth, { idToken }));
    _assert(response === null || response === void 0 ? void 0 : response.users.length, auth, "internal-error" /* INTERNAL_ERROR */);
    const coreAccount = response.users[0];
    user._notifyReloadListener(coreAccount);
    const newProviderData = ((_a = coreAccount.providerUserInfo) === null || _a === void 0 ? void 0 : _a.length)
        ? extractProviderData(coreAccount.providerUserInfo)
        : [];
    const providerData = mergeProviderData(user.providerData, newProviderData);
    // Preserves the non-nonymous status of the stored user, even if no more
    // credentials (federated or email/password) are linked to the user. If
    // the user was previously anonymous, then use provider data to update.
    // On the other hand, if it was not anonymous before, it should never be
    // considered anonymous now.
    const oldIsAnonymous = user.isAnonymous;
    const newIsAnonymous = !(user.email && coreAccount.passwordHash) && !(providerData === null || providerData === void 0 ? void 0 : providerData.length);
    const isAnonymous = !oldIsAnonymous ? false : newIsAnonymous;
    const updates = {
        uid: coreAccount.localId,
        displayName: coreAccount.displayName || null,
        photoURL: coreAccount.photoUrl || null,
        email: coreAccount.email || null,
        emailVerified: coreAccount.emailVerified || false,
        phoneNumber: coreAccount.phoneNumber || null,
        tenantId: coreAccount.tenantId || null,
        providerData,
        metadata: new UserMetadata(coreAccount.createdAt, coreAccount.lastLoginAt),
        isAnonymous
    };
    Object.assign(user, updates);
}
/**
 * Reloads user account data, if signed in.
 *
 * @param user - The user.
 *
 * @public
 */
async function reload(user) {
    const userInternal = getModularInstance(user);
    await _reloadWithoutSaving(userInternal);
    // Even though the current user hasn't changed, update
    // current user will trigger a persistence update w/ the
    // new info.
    await userInternal.auth._persistUserIfCurrent(userInternal);
    userInternal.auth._notifyListenersIfCurrent(userInternal);
}
function mergeProviderData(original, newData) {
    const deduped = original.filter(o => !newData.some(n => n.providerId === o.providerId));
    return [...deduped, ...newData];
}
function extractProviderData(providers) {
    return providers.map((_a) => {
        var { providerId } = _a, provider = __rest(_a, ["providerId"]);
        return {
            providerId,
            uid: provider.rawId || '',
            displayName: provider.displayName || null,
            email: provider.email || null,
            phoneNumber: provider.phoneNumber || null,
            photoURL: provider.photoUrl || null
        };
    });
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function requestStsToken(auth, refreshToken) {
    const response = await _performFetchWithErrorHandling(auth, {}, async () => {
        const body = querystring({
            'grant_type': 'refresh_token',
            'refresh_token': refreshToken
        }).slice(1);
        const { tokenApiHost, apiKey } = auth.config;
        const url = _getFinalTarget(auth, tokenApiHost, "/v1/token" /* TOKEN */, `key=${apiKey}`);
        const headers = await auth._getAdditionalHeaders();
        headers["Content-Type" /* CONTENT_TYPE */] = 'application/x-www-form-urlencoded';
        return FetchProvider.fetch()(url, {
            method: "POST" /* POST */,
            headers,
            body
        });
    });
    // The response comes back in snake_case. Convert to camel:
    return {
        accessToken: response.access_token,
        expiresIn: response.expires_in,
        refreshToken: response.refresh_token
    };
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * We need to mark this class as internal explicitly to exclude it in the public typings, because
 * it references AuthInternal which has a circular dependency with UserInternal.
 *
 * @internal
 */
class StsTokenManager {
    constructor() {
        this.refreshToken = null;
        this.accessToken = null;
        this.expirationTime = null;
    }
    get isExpired() {
        return (!this.expirationTime ||
            Date.now() > this.expirationTime - 30000 /* TOKEN_REFRESH */);
    }
    updateFromServerResponse(response) {
        _assert(response.idToken, "internal-error" /* INTERNAL_ERROR */);
        _assert(typeof response.idToken !== 'undefined', "internal-error" /* INTERNAL_ERROR */);
        _assert(typeof response.refreshToken !== 'undefined', "internal-error" /* INTERNAL_ERROR */);
        const expiresIn = 'expiresIn' in response && typeof response.expiresIn !== 'undefined'
            ? Number(response.expiresIn)
            : _tokenExpiresIn(response.idToken);
        this.updateTokensAndExpiration(response.idToken, response.refreshToken, expiresIn);
    }
    async getToken(auth, forceRefresh = false) {
        _assert(!this.accessToken || this.refreshToken, auth, "user-token-expired" /* TOKEN_EXPIRED */);
        if (!forceRefresh && this.accessToken && !this.isExpired) {
            return this.accessToken;
        }
        if (this.refreshToken) {
            await this.refresh(auth, this.refreshToken);
            return this.accessToken;
        }
        return null;
    }
    clearRefreshToken() {
        this.refreshToken = null;
    }
    async refresh(auth, oldToken) {
        const { accessToken, refreshToken, expiresIn } = await requestStsToken(auth, oldToken);
        this.updateTokensAndExpiration(accessToken, refreshToken, Number(expiresIn));
    }
    updateTokensAndExpiration(accessToken, refreshToken, expiresInSec) {
        this.refreshToken = refreshToken || null;
        this.accessToken = accessToken || null;
        this.expirationTime = Date.now() + expiresInSec * 1000;
    }
    static fromJSON(appName, object) {
        const { refreshToken, accessToken, expirationTime } = object;
        const manager = new StsTokenManager();
        if (refreshToken) {
            _assert(typeof refreshToken === 'string', "internal-error" /* INTERNAL_ERROR */, {
                appName
            });
            manager.refreshToken = refreshToken;
        }
        if (accessToken) {
            _assert(typeof accessToken === 'string', "internal-error" /* INTERNAL_ERROR */, {
                appName
            });
            manager.accessToken = accessToken;
        }
        if (expirationTime) {
            _assert(typeof expirationTime === 'number', "internal-error" /* INTERNAL_ERROR */, {
                appName
            });
            manager.expirationTime = expirationTime;
        }
        return manager;
    }
    toJSON() {
        return {
            refreshToken: this.refreshToken,
            accessToken: this.accessToken,
            expirationTime: this.expirationTime
        };
    }
    _assign(stsTokenManager) {
        this.accessToken = stsTokenManager.accessToken;
        this.refreshToken = stsTokenManager.refreshToken;
        this.expirationTime = stsTokenManager.expirationTime;
    }
    _clone() {
        return Object.assign(new StsTokenManager(), this.toJSON());
    }
    _performRefresh() {
        return debugFail('not implemented');
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function assertStringOrUndefined(assertion, appName) {
    _assert(typeof assertion === 'string' || typeof assertion === 'undefined', "internal-error" /* INTERNAL_ERROR */, { appName });
}
class UserImpl {
    constructor(_a) {
        var { uid, auth, stsTokenManager } = _a, opt = __rest(_a, ["uid", "auth", "stsTokenManager"]);
        // For the user object, provider is always Firebase.
        this.providerId = "firebase" /* FIREBASE */;
        this.proactiveRefresh = new ProactiveRefresh(this);
        this.reloadUserInfo = null;
        this.reloadListener = null;
        this.uid = uid;
        this.auth = auth;
        this.stsTokenManager = stsTokenManager;
        this.accessToken = stsTokenManager.accessToken;
        this.displayName = opt.displayName || null;
        this.email = opt.email || null;
        this.emailVerified = opt.emailVerified || false;
        this.phoneNumber = opt.phoneNumber || null;
        this.photoURL = opt.photoURL || null;
        this.isAnonymous = opt.isAnonymous || false;
        this.tenantId = opt.tenantId || null;
        this.providerData = opt.providerData ? [...opt.providerData] : [];
        this.metadata = new UserMetadata(opt.createdAt || undefined, opt.lastLoginAt || undefined);
    }
    async getIdToken(forceRefresh) {
        const accessToken = await _logoutIfInvalidated(this, this.stsTokenManager.getToken(this.auth, forceRefresh));
        _assert(accessToken, this.auth, "internal-error" /* INTERNAL_ERROR */);
        if (this.accessToken !== accessToken) {
            this.accessToken = accessToken;
            await this.auth._persistUserIfCurrent(this);
            this.auth._notifyListenersIfCurrent(this);
        }
        return accessToken;
    }
    getIdTokenResult(forceRefresh) {
        return getIdTokenResult(this, forceRefresh);
    }
    reload() {
        return reload(this);
    }
    _assign(user) {
        if (this === user) {
            return;
        }
        _assert(this.uid === user.uid, this.auth, "internal-error" /* INTERNAL_ERROR */);
        this.displayName = user.displayName;
        this.photoURL = user.photoURL;
        this.email = user.email;
        this.emailVerified = user.emailVerified;
        this.phoneNumber = user.phoneNumber;
        this.isAnonymous = user.isAnonymous;
        this.tenantId = user.tenantId;
        this.providerData = user.providerData.map(userInfo => (Object.assign({}, userInfo)));
        this.metadata._copy(user.metadata);
        this.stsTokenManager._assign(user.stsTokenManager);
    }
    _clone(auth) {
        return new UserImpl(Object.assign(Object.assign({}, this), { auth, stsTokenManager: this.stsTokenManager._clone() }));
    }
    _onReload(callback) {
        // There should only ever be one listener, and that is a single instance of MultiFactorUser
        _assert(!this.reloadListener, this.auth, "internal-error" /* INTERNAL_ERROR */);
        this.reloadListener = callback;
        if (this.reloadUserInfo) {
            this._notifyReloadListener(this.reloadUserInfo);
            this.reloadUserInfo = null;
        }
    }
    _notifyReloadListener(userInfo) {
        if (this.reloadListener) {
            this.reloadListener(userInfo);
        }
        else {
            // If no listener is subscribed yet, save the result so it's available when they do subscribe
            this.reloadUserInfo = userInfo;
        }
    }
    _startProactiveRefresh() {
        this.proactiveRefresh._start();
    }
    _stopProactiveRefresh() {
        this.proactiveRefresh._stop();
    }
    async _updateTokensIfNecessary(response, reload = false) {
        let tokensRefreshed = false;
        if (response.idToken &&
            response.idToken !== this.stsTokenManager.accessToken) {
            this.stsTokenManager.updateFromServerResponse(response);
            tokensRefreshed = true;
        }
        if (reload) {
            await _reloadWithoutSaving(this);
        }
        await this.auth._persistUserIfCurrent(this);
        if (tokensRefreshed) {
            this.auth._notifyListenersIfCurrent(this);
        }
    }
    async delete() {
        const idToken = await this.getIdToken();
        await _logoutIfInvalidated(this, deleteAccount(this.auth, { idToken }));
        this.stsTokenManager.clearRefreshToken();
        // TODO: Determine if cancellable-promises are necessary to use in this class so that delete()
        //       cancels pending actions...
        return this.auth.signOut();
    }
    toJSON() {
        return Object.assign(Object.assign({ uid: this.uid, email: this.email || undefined, emailVerified: this.emailVerified, displayName: this.displayName || undefined, isAnonymous: this.isAnonymous, photoURL: this.photoURL || undefined, phoneNumber: this.phoneNumber || undefined, tenantId: this.tenantId || undefined, providerData: this.providerData.map(userInfo => (Object.assign({}, userInfo))), stsTokenManager: this.stsTokenManager.toJSON(), 
            // Redirect event ID must be maintained in case there is a pending
            // redirect event.
            _redirectEventId: this._redirectEventId }, this.metadata.toJSON()), { 
            // Required for compatibility with the legacy SDK (go/firebase-auth-sdk-persistence-parsing):
            apiKey: this.auth.config.apiKey, appName: this.auth.name });
    }
    get refreshToken() {
        return this.stsTokenManager.refreshToken || '';
    }
    static _fromJSON(auth, object) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const displayName = (_a = object.displayName) !== null && _a !== void 0 ? _a : undefined;
        const email = (_b = object.email) !== null && _b !== void 0 ? _b : undefined;
        const phoneNumber = (_c = object.phoneNumber) !== null && _c !== void 0 ? _c : undefined;
        const photoURL = (_d = object.photoURL) !== null && _d !== void 0 ? _d : undefined;
        const tenantId = (_e = object.tenantId) !== null && _e !== void 0 ? _e : undefined;
        const _redirectEventId = (_f = object._redirectEventId) !== null && _f !== void 0 ? _f : undefined;
        const createdAt = (_g = object.createdAt) !== null && _g !== void 0 ? _g : undefined;
        const lastLoginAt = (_h = object.lastLoginAt) !== null && _h !== void 0 ? _h : undefined;
        const { uid, emailVerified, isAnonymous, providerData, stsTokenManager: plainObjectTokenManager } = object;
        _assert(uid && plainObjectTokenManager, auth, "internal-error" /* INTERNAL_ERROR */);
        const stsTokenManager = StsTokenManager.fromJSON(this.name, plainObjectTokenManager);
        _assert(typeof uid === 'string', auth, "internal-error" /* INTERNAL_ERROR */);
        assertStringOrUndefined(displayName, auth.name);
        assertStringOrUndefined(email, auth.name);
        _assert(typeof emailVerified === 'boolean', auth, "internal-error" /* INTERNAL_ERROR */);
        _assert(typeof isAnonymous === 'boolean', auth, "internal-error" /* INTERNAL_ERROR */);
        assertStringOrUndefined(phoneNumber, auth.name);
        assertStringOrUndefined(photoURL, auth.name);
        assertStringOrUndefined(tenantId, auth.name);
        assertStringOrUndefined(_redirectEventId, auth.name);
        assertStringOrUndefined(createdAt, auth.name);
        assertStringOrUndefined(lastLoginAt, auth.name);
        const user = new UserImpl({
            uid,
            auth,
            email,
            emailVerified,
            displayName,
            isAnonymous,
            photoURL,
            phoneNumber,
            tenantId,
            stsTokenManager,
            createdAt,
            lastLoginAt
        });
        if (providerData && Array.isArray(providerData)) {
            user.providerData = providerData.map(userInfo => (Object.assign({}, userInfo)));
        }
        if (_redirectEventId) {
            user._redirectEventId = _redirectEventId;
        }
        return user;
    }
    /**
     * Initialize a User from an idToken server response
     * @param auth
     * @param idTokenResponse
     */
    static async _fromIdTokenResponse(auth, idTokenResponse, isAnonymous = false) {
        const stsTokenManager = new StsTokenManager();
        stsTokenManager.updateFromServerResponse(idTokenResponse);
        // Initialize the Firebase Auth user.
        const user = new UserImpl({
            uid: idTokenResponse.localId,
            auth,
            stsTokenManager,
            isAnonymous
        });
        // Updates the user info and data and resolves with a user instance.
        await _reloadWithoutSaving(user);
        return user;
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class InMemoryPersistence {
    constructor() {
        this.type = "NONE" /* NONE */;
        this.storage = {};
    }
    async _isAvailable() {
        return true;
    }
    async _set(key, value) {
        this.storage[key] = value;
    }
    async _get(key) {
        const value = this.storage[key];
        return value === undefined ? null : value;
    }
    async _remove(key) {
        delete this.storage[key];
    }
    _addListener(_key, _listener) {
        // Listeners are not supported for in-memory storage since it cannot be shared across windows/workers
        return;
    }
    _removeListener(_key, _listener) {
        // Listeners are not supported for in-memory storage since it cannot be shared across windows/workers
        return;
    }
}
InMemoryPersistence.type = 'NONE';
/**
 * An implementation of {@link Persistence} of type 'NONE'.
 *
 * @public
 */
const inMemoryPersistence = InMemoryPersistence;

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _persistenceKeyName(key, apiKey, appName) {
    return `${"firebase" /* PERSISTENCE */}:${key}:${apiKey}:${appName}`;
}
class PersistenceUserManager {
    constructor(persistence, auth, userKey) {
        this.persistence = persistence;
        this.auth = auth;
        this.userKey = userKey;
        const { config, name } = this.auth;
        this.fullUserKey = _persistenceKeyName(this.userKey, config.apiKey, name);
        this.fullPersistenceKey = _persistenceKeyName("persistence" /* PERSISTENCE_USER */, config.apiKey, name);
        this.boundEventHandler = auth._onStorageEvent.bind(auth);
        this.persistence._addListener(this.fullUserKey, this.boundEventHandler);
    }
    setCurrentUser(user) {
        return this.persistence._set(this.fullUserKey, user.toJSON());
    }
    async getCurrentUser() {
        const blob = await this.persistence._get(this.fullUserKey);
        return blob ? UserImpl._fromJSON(this.auth, blob) : null;
    }
    removeCurrentUser() {
        return this.persistence._remove(this.fullUserKey);
    }
    savePersistenceForRedirect() {
        return this.persistence._set(this.fullPersistenceKey, this.persistence.type);
    }
    async setPersistence(newPersistence) {
        if (this.persistence === newPersistence) {
            return;
        }
        const currentUser = await this.getCurrentUser();
        await this.removeCurrentUser();
        this.persistence = newPersistence;
        if (currentUser) {
            return this.setCurrentUser(currentUser);
        }
    }
    delete() {
        this.persistence._removeListener(this.fullUserKey, this.boundEventHandler);
    }
    static async create(auth, persistenceHierarchy, userKey = "authUser" /* AUTH_USER */) {
        if (!persistenceHierarchy.length) {
            return new PersistenceUserManager(_getInstance(inMemoryPersistence), auth, userKey);
        }
        // Eliminate any persistences that are not available
        const availablePersistences = (await Promise.all(persistenceHierarchy.map(async (persistence) => {
            if (await persistence._isAvailable()) {
                return persistence;
            }
            return undefined;
        }))).filter(persistence => persistence);
        // Fall back to the first persistence listed, or in memory if none available
        let selectedPersistence = availablePersistences[0] ||
            _getInstance(inMemoryPersistence);
        const key = _persistenceKeyName(userKey, auth.config.apiKey, auth.name);
        // Pull out the existing user, setting the chosen persistence to that
        // persistence if the user exists.
        let userToMigrate = null;
        // Note, here we check for a user in _all_ persistences, not just the
        // ones deemed available. If we can migrate a user out of a broken
        // persistence, we will (but only if that persistence supports migration).
        for (const persistence of persistenceHierarchy) {
            try {
                const blob = await persistence._get(key);
                if (blob) {
                    const user = UserImpl._fromJSON(auth, blob); // throws for unparsable blob (wrong format)
                    if (persistence !== selectedPersistence) {
                        userToMigrate = user;
                    }
                    selectedPersistence = persistence;
                    break;
                }
            }
            catch (_a) { }
        }
        // If we find the user in a persistence that does support migration, use
        // that migration path (of only persistences that support migration)
        const migrationHierarchy = availablePersistences.filter(p => p._shouldAllowMigration);
        // If the persistence does _not_ allow migration, just finish off here
        if (!selectedPersistence._shouldAllowMigration ||
            !migrationHierarchy.length) {
            return new PersistenceUserManager(selectedPersistence, auth, userKey);
        }
        selectedPersistence = migrationHierarchy[0];
        if (userToMigrate) {
            // This normally shouldn't throw since chosenPersistence.isAvailable() is true, but if it does
            // we'll just let it bubble to surface the error.
            await selectedPersistence._set(key, userToMigrate.toJSON());
        }
        // Attempt to clear the key in other persistences but ignore errors. This helps prevent issues
        // such as users getting stuck with a previous account after signing out and refreshing the tab.
        await Promise.all(persistenceHierarchy.map(async (persistence) => {
            if (persistence !== selectedPersistence) {
                try {
                    await persistence._remove(key);
                }
                catch (_a) { }
            }
        }));
        return new PersistenceUserManager(selectedPersistence, auth, userKey);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Determine the browser for the purposes of reporting usage to the API
 */
function _getBrowserName(userAgent) {
    const ua = userAgent.toLowerCase();
    if (ua.includes('opera/') || ua.includes('opr/') || ua.includes('opios/')) {
        return "Opera" /* OPERA */;
    }
    else if (_isIEMobile(ua)) {
        // Windows phone IEMobile browser.
        return "IEMobile" /* IEMOBILE */;
    }
    else if (ua.includes('msie') || ua.includes('trident/')) {
        return "IE" /* IE */;
    }
    else if (ua.includes('edge/')) {
        return "Edge" /* EDGE */;
    }
    else if (_isFirefox(ua)) {
        return "Firefox" /* FIREFOX */;
    }
    else if (ua.includes('silk/')) {
        return "Silk" /* SILK */;
    }
    else if (_isBlackBerry(ua)) {
        // Blackberry browser.
        return "Blackberry" /* BLACKBERRY */;
    }
    else if (_isWebOS(ua)) {
        // WebOS default browser.
        return "Webos" /* WEBOS */;
    }
    else if (_isSafari(ua)) {
        return "Safari" /* SAFARI */;
    }
    else if ((ua.includes('chrome/') || _isChromeIOS(ua)) &&
        !ua.includes('edge/')) {
        return "Chrome" /* CHROME */;
    }
    else if (_isAndroid(ua)) {
        // Android stock browser.
        return "Android" /* ANDROID */;
    }
    else {
        // Most modern browsers have name/version at end of user agent string.
        const re = /([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/;
        const matches = userAgent.match(re);
        if ((matches === null || matches === void 0 ? void 0 : matches.length) === 2) {
            return matches[1];
        }
    }
    return "Other" /* OTHER */;
}
function _isFirefox(ua = getUA()) {
    return /firefox\//i.test(ua);
}
function _isSafari(userAgent = getUA()) {
    const ua = userAgent.toLowerCase();
    return (ua.includes('safari/') &&
        !ua.includes('chrome/') &&
        !ua.includes('crios/') &&
        !ua.includes('android'));
}
function _isChromeIOS(ua = getUA()) {
    return /crios\//i.test(ua);
}
function _isIEMobile(ua = getUA()) {
    return /iemobile/i.test(ua);
}
function _isAndroid(ua = getUA()) {
    return /android/i.test(ua);
}
function _isBlackBerry(ua = getUA()) {
    return /blackberry/i.test(ua);
}
function _isWebOS(ua = getUA()) {
    return /webos/i.test(ua);
}
function _isIOS(ua = getUA()) {
    return /iphone|ipad|ipod/i.test(ua);
}
function _isIOSStandalone(ua = getUA()) {
    var _a;
    return _isIOS(ua) && !!((_a = window.navigator) === null || _a === void 0 ? void 0 : _a.standalone);
}
function _isIE10() {
    return isIE() && document.documentMode === 10;
}
function _isMobileBrowser(ua = getUA()) {
    // TODO: implement getBrowserName equivalent for OS.
    return (_isIOS(ua) ||
        _isAndroid(ua) ||
        _isWebOS(ua) ||
        _isBlackBerry(ua) ||
        /windows phone/i.test(ua) ||
        _isIEMobile(ua));
}
function _isIframe() {
    try {
        // Check that the current window is not the top window.
        // If so, return true.
        return !!(window && window !== window.top);
    }
    catch (e) {
        return false;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/*
 * Determine the SDK version string
 */
function _getClientVersion(clientPlatform, frameworks = []) {
    let reportedPlatform;
    switch (clientPlatform) {
        case "Browser" /* BROWSER */:
            // In a browser environment, report the browser name.
            reportedPlatform = _getBrowserName(getUA());
            break;
        case "Worker" /* WORKER */:
            // Technically a worker runs from a browser but we need to differentiate a
            // worker from a browser.
            // For example: Chrome-Worker/JsCore/4.9.1/FirebaseCore-web.
            reportedPlatform = `${_getBrowserName(getUA())}-${clientPlatform}`;
            break;
        default:
            reportedPlatform = clientPlatform;
    }
    const reportedFrameworks = frameworks.length
        ? frameworks.join(',')
        : 'FirebaseCore-web'; /* default value if no other framework is used */
    return `${reportedPlatform}/${"JsCore" /* CORE */}/${SDK_VERSION}/${reportedFrameworks}`;
}

/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class AuthMiddlewareQueue {
    constructor(auth) {
        this.auth = auth;
        this.queue = [];
    }
    pushCallback(callback, onAbort) {
        // The callback could be sync or async. Wrap it into a
        // function that is always async.
        const wrappedCallback = (user) => new Promise((resolve, reject) => {
            try {
                const result = callback(user);
                // Either resolve with existing promise or wrap a non-promise
                // return value into a promise.
                resolve(result);
            }
            catch (e) {
                // Sync callback throws.
                reject(e);
            }
        });
        // Attach the onAbort if present
        wrappedCallback.onAbort = onAbort;
        this.queue.push(wrappedCallback);
        const index = this.queue.length - 1;
        return () => {
            // Unsubscribe. Replace with no-op. Do not remove from array, or it will disturb
            // indexing of other elements.
            this.queue[index] = () => Promise.resolve();
        };
    }
    async runMiddleware(nextUser) {
        var _a;
        if (this.auth.currentUser === nextUser) {
            return;
        }
        // While running the middleware, build a temporary stack of onAbort
        // callbacks to call if one middleware callback rejects.
        const onAbortStack = [];
        try {
            for (const beforeStateCallback of this.queue) {
                await beforeStateCallback(nextUser);
                // Only push the onAbort if the callback succeeds
                if (beforeStateCallback.onAbort) {
                    onAbortStack.push(beforeStateCallback.onAbort);
                }
            }
        }
        catch (e) {
            // Run all onAbort, with separate try/catch to ignore any errors and
            // continue
            onAbortStack.reverse();
            for (const onAbort of onAbortStack) {
                try {
                    onAbort();
                }
                catch (_) { /* swallow error */ }
            }
            throw this.auth._errorFactory.create("login-blocked" /* LOGIN_BLOCKED */, { originalMessage: (_a = e) === null || _a === void 0 ? void 0 : _a.message });
        }
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class AuthImpl {
    constructor(app, heartbeatServiceProvider, config) {
        this.app = app;
        this.heartbeatServiceProvider = heartbeatServiceProvider;
        this.config = config;
        this.currentUser = null;
        this.emulatorConfig = null;
        this.operations = Promise.resolve();
        this.authStateSubscription = new Subscription(this);
        this.idTokenSubscription = new Subscription(this);
        this.beforeStateQueue = new AuthMiddlewareQueue(this);
        this.redirectUser = null;
        this.isProactiveRefreshEnabled = false;
        // Any network calls will set this to true and prevent subsequent emulator
        // initialization
        this._canInitEmulator = true;
        this._isInitialized = false;
        this._deleted = false;
        this._initializationPromise = null;
        this._popupRedirectResolver = null;
        this._errorFactory = _DEFAULT_AUTH_ERROR_FACTORY;
        // Tracks the last notified UID for state change listeners to prevent
        // repeated calls to the callbacks. Undefined means it's never been
        // called, whereas null means it's been called with a signed out user
        this.lastNotifiedUid = undefined;
        this.languageCode = null;
        this.tenantId = null;
        this.settings = { appVerificationDisabledForTesting: false };
        this.frameworks = [];
        this.name = app.name;
        this.clientVersion = config.sdkClientVersion;
    }
    _initializeWithPersistence(persistenceHierarchy, popupRedirectResolver) {
        if (popupRedirectResolver) {
            this._popupRedirectResolver = _getInstance(popupRedirectResolver);
        }
        // Have to check for app deletion throughout initialization (after each
        // promise resolution)
        this._initializationPromise = this.queue(async () => {
            var _a, _b;
            if (this._deleted) {
                return;
            }
            this.persistenceManager = await PersistenceUserManager.create(this, persistenceHierarchy);
            if (this._deleted) {
                return;
            }
            // Initialize the resolver early if necessary (only applicable to web:
            // this will cause the iframe to load immediately in certain cases)
            if ((_a = this._popupRedirectResolver) === null || _a === void 0 ? void 0 : _a._shouldInitProactively) {
                // If this fails, don't halt auth loading
                try {
                    await this._popupRedirectResolver._initialize(this);
                }
                catch (e) { /* Ignore the error */ }
            }
            await this.initializeCurrentUser(popupRedirectResolver);
            this.lastNotifiedUid = ((_b = this.currentUser) === null || _b === void 0 ? void 0 : _b.uid) || null;
            if (this._deleted) {
                return;
            }
            this._isInitialized = true;
        });
        return this._initializationPromise;
    }
    /**
     * If the persistence is changed in another window, the user manager will let us know
     */
    async _onStorageEvent() {
        if (this._deleted) {
            return;
        }
        const user = await this.assertedPersistence.getCurrentUser();
        if (!this.currentUser && !user) {
            // No change, do nothing (was signed out and remained signed out).
            return;
        }
        // If the same user is to be synchronized.
        if (this.currentUser && user && this.currentUser.uid === user.uid) {
            // Data update, simply copy data changes.
            this._currentUser._assign(user);
            // If tokens changed from previous user tokens, this will trigger
            // notifyAuthListeners_.
            await this.currentUser.getIdToken();
            return;
        }
        // Update current Auth state. Either a new login or logout.
        // Skip blocking callbacks, they should not apply to a change in another tab.
        await this._updateCurrentUser(user, /* skipBeforeStateCallbacks */ true);
    }
    async initializeCurrentUser(popupRedirectResolver) {
        var _a;
        // First check to see if we have a pending redirect event.
        const previouslyStoredUser = (await this.assertedPersistence.getCurrentUser());
        let futureCurrentUser = previouslyStoredUser;
        let needsTocheckMiddleware = false;
        if (popupRedirectResolver && this.config.authDomain) {
            await this.getOrInitRedirectPersistenceManager();
            const redirectUserEventId = (_a = this.redirectUser) === null || _a === void 0 ? void 0 : _a._redirectEventId;
            const storedUserEventId = futureCurrentUser === null || futureCurrentUser === void 0 ? void 0 : futureCurrentUser._redirectEventId;
            const result = await this.tryRedirectSignIn(popupRedirectResolver);
            // If the stored user (i.e. the old "currentUser") has a redirectId that
            // matches the redirect user, then we want to initially sign in with the
            // new user object from result.
            // TODO(samgho): More thoroughly test all of this
            if ((!redirectUserEventId || redirectUserEventId === storedUserEventId) &&
                (result === null || result === void 0 ? void 0 : result.user)) {
                futureCurrentUser = result.user;
                needsTocheckMiddleware = true;
            }
        }
        // If no user in persistence, there is no current user. Set to null.
        if (!futureCurrentUser) {
            return this.directlySetCurrentUser(null);
        }
        if (!futureCurrentUser._redirectEventId) {
            // This isn't a redirect link operation, we can reload and bail.
            // First though, ensure that we check the middleware is happy.
            if (needsTocheckMiddleware) {
                try {
                    await this.beforeStateQueue.runMiddleware(futureCurrentUser);
                }
                catch (e) {
                    futureCurrentUser = previouslyStoredUser;
                    // We know this is available since the bit is only set when the
                    // resolver is available
                    this._popupRedirectResolver._overrideRedirectResult(this, () => Promise.reject(e));
                }
            }
            if (futureCurrentUser) {
                return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
            }
            else {
                return this.directlySetCurrentUser(null);
            }
        }
        _assert(this._popupRedirectResolver, this, "argument-error" /* ARGUMENT_ERROR */);
        await this.getOrInitRedirectPersistenceManager();
        // If the redirect user's event ID matches the current user's event ID,
        // DO NOT reload the current user, otherwise they'll be cleared from storage.
        // This is important for the reauthenticateWithRedirect() flow.
        if (this.redirectUser &&
            this.redirectUser._redirectEventId === futureCurrentUser._redirectEventId) {
            return this.directlySetCurrentUser(futureCurrentUser);
        }
        return this.reloadAndSetCurrentUserOrClear(futureCurrentUser);
    }
    async tryRedirectSignIn(redirectResolver) {
        // The redirect user needs to be checked (and signed in if available)
        // during auth initialization. All of the normal sign in and link/reauth
        // flows call back into auth and push things onto the promise queue. We
        // need to await the result of the redirect sign in *inside the promise
        // queue*. This presents a problem: we run into deadlock. See:
        //    ┌> [Initialization] ─────┐
        //    ┌> [<other queue tasks>] │
        //    └─ [getRedirectResult] <─┘
        //    where [] are tasks on the queue and arrows denote awaits
        // Initialization will never complete because it's waiting on something
        // that's waiting for initialization to complete!
        //
        // Instead, this method calls getRedirectResult() (stored in
        // _completeRedirectFn) with an optional parameter that instructs all of
        // the underlying auth operations to skip anything that mutates auth state.
        let result = null;
        try {
            // We know this._popupRedirectResolver is set since redirectResolver
            // is passed in. The _completeRedirectFn expects the unwrapped extern.
            result = await this._popupRedirectResolver._completeRedirectFn(this, redirectResolver, true);
        }
        catch (e) {
            // Swallow any errors here; the code can retrieve them in
            // getRedirectResult().
            await this._setRedirectUser(null);
        }
        return result;
    }
    async reloadAndSetCurrentUserOrClear(user) {
        try {
            await _reloadWithoutSaving(user);
        }
        catch (e) {
            if (e.code !== `auth/${"network-request-failed" /* NETWORK_REQUEST_FAILED */}`) {
                // Something's wrong with the user's token. Log them out and remove
                // them from storage
                return this.directlySetCurrentUser(null);
            }
        }
        return this.directlySetCurrentUser(user);
    }
    useDeviceLanguage() {
        this.languageCode = _getUserLanguage();
    }
    async _delete() {
        this._deleted = true;
    }
    async updateCurrentUser(userExtern) {
        // The public updateCurrentUser method needs to make a copy of the user,
        // and also check that the project matches
        const user = userExtern
            ? getModularInstance(userExtern)
            : null;
        if (user) {
            _assert(user.auth.config.apiKey === this.config.apiKey, this, "invalid-user-token" /* INVALID_AUTH */);
        }
        return this._updateCurrentUser(user && user._clone(this));
    }
    async _updateCurrentUser(user, skipBeforeStateCallbacks = false) {
        if (this._deleted) {
            return;
        }
        if (user) {
            _assert(this.tenantId === user.tenantId, this, "tenant-id-mismatch" /* TENANT_ID_MISMATCH */);
        }
        if (!skipBeforeStateCallbacks) {
            await this.beforeStateQueue.runMiddleware(user);
        }
        return this.queue(async () => {
            await this.directlySetCurrentUser(user);
            this.notifyAuthListeners();
        });
    }
    async signOut() {
        // Run first, to block _setRedirectUser() if any callbacks fail.
        await this.beforeStateQueue.runMiddleware(null);
        // Clear the redirect user when signOut is called
        if (this.redirectPersistenceManager || this._popupRedirectResolver) {
            await this._setRedirectUser(null);
        }
        // Prevent callbacks from being called again in _updateCurrentUser, as
        // they were already called in the first line.
        return this._updateCurrentUser(null, /* skipBeforeStateCallbacks */ true);
    }
    setPersistence(persistence) {
        return this.queue(async () => {
            await this.assertedPersistence.setPersistence(_getInstance(persistence));
        });
    }
    _getPersistence() {
        return this.assertedPersistence.persistence.type;
    }
    _updateErrorMap(errorMap) {
        this._errorFactory = new ErrorFactory('auth', 'Firebase', errorMap());
    }
    onAuthStateChanged(nextOrObserver, error, completed) {
        return this.registerStateListener(this.authStateSubscription, nextOrObserver, error, completed);
    }
    beforeAuthStateChanged(callback, onAbort) {
        return this.beforeStateQueue.pushCallback(callback, onAbort);
    }
    onIdTokenChanged(nextOrObserver, error, completed) {
        return this.registerStateListener(this.idTokenSubscription, nextOrObserver, error, completed);
    }
    toJSON() {
        var _a;
        return {
            apiKey: this.config.apiKey,
            authDomain: this.config.authDomain,
            appName: this.name,
            currentUser: (_a = this._currentUser) === null || _a === void 0 ? void 0 : _a.toJSON()
        };
    }
    async _setRedirectUser(user, popupRedirectResolver) {
        const redirectManager = await this.getOrInitRedirectPersistenceManager(popupRedirectResolver);
        return user === null
            ? redirectManager.removeCurrentUser()
            : redirectManager.setCurrentUser(user);
    }
    async getOrInitRedirectPersistenceManager(popupRedirectResolver) {
        if (!this.redirectPersistenceManager) {
            const resolver = (popupRedirectResolver && _getInstance(popupRedirectResolver)) ||
                this._popupRedirectResolver;
            _assert(resolver, this, "argument-error" /* ARGUMENT_ERROR */);
            this.redirectPersistenceManager = await PersistenceUserManager.create(this, [_getInstance(resolver._redirectPersistence)], "redirectUser" /* REDIRECT_USER */);
            this.redirectUser =
                await this.redirectPersistenceManager.getCurrentUser();
        }
        return this.redirectPersistenceManager;
    }
    async _redirectUserForId(id) {
        var _a, _b;
        // Make sure we've cleared any pending persistence actions if we're not in
        // the initializer
        if (this._isInitialized) {
            await this.queue(async () => { });
        }
        if (((_a = this._currentUser) === null || _a === void 0 ? void 0 : _a._redirectEventId) === id) {
            return this._currentUser;
        }
        if (((_b = this.redirectUser) === null || _b === void 0 ? void 0 : _b._redirectEventId) === id) {
            return this.redirectUser;
        }
        return null;
    }
    async _persistUserIfCurrent(user) {
        if (user === this.currentUser) {
            return this.queue(async () => this.directlySetCurrentUser(user));
        }
    }
    /** Notifies listeners only if the user is current */
    _notifyListenersIfCurrent(user) {
        if (user === this.currentUser) {
            this.notifyAuthListeners();
        }
    }
    _key() {
        return `${this.config.authDomain}:${this.config.apiKey}:${this.name}`;
    }
    _startProactiveRefresh() {
        this.isProactiveRefreshEnabled = true;
        if (this.currentUser) {
            this._currentUser._startProactiveRefresh();
        }
    }
    _stopProactiveRefresh() {
        this.isProactiveRefreshEnabled = false;
        if (this.currentUser) {
            this._currentUser._stopProactiveRefresh();
        }
    }
    /** Returns the current user cast as the internal type */
    get _currentUser() {
        return this.currentUser;
    }
    notifyAuthListeners() {
        var _a, _b;
        if (!this._isInitialized) {
            return;
        }
        this.idTokenSubscription.next(this.currentUser);
        const currentUid = (_b = (_a = this.currentUser) === null || _a === void 0 ? void 0 : _a.uid) !== null && _b !== void 0 ? _b : null;
        if (this.lastNotifiedUid !== currentUid) {
            this.lastNotifiedUid = currentUid;
            this.authStateSubscription.next(this.currentUser);
        }
    }
    registerStateListener(subscription, nextOrObserver, error, completed) {
        if (this._deleted) {
            return () => { };
        }
        const cb = typeof nextOrObserver === 'function'
            ? nextOrObserver
            : nextOrObserver.next.bind(nextOrObserver);
        const promise = this._isInitialized
            ? Promise.resolve()
            : this._initializationPromise;
        _assert(promise, this, "internal-error" /* INTERNAL_ERROR */);
        // The callback needs to be called asynchronously per the spec.
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        promise.then(() => cb(this.currentUser));
        if (typeof nextOrObserver === 'function') {
            return subscription.addObserver(nextOrObserver, error, completed);
        }
        else {
            return subscription.addObserver(nextOrObserver);
        }
    }
    /**
     * Unprotected (from race conditions) method to set the current user. This
     * should only be called from within a queued callback. This is necessary
     * because the queue shouldn't rely on another queued callback.
     */
    async directlySetCurrentUser(user) {
        if (this.currentUser && this.currentUser !== user) {
            this._currentUser._stopProactiveRefresh();
            if (user && this.isProactiveRefreshEnabled) {
                user._startProactiveRefresh();
            }
        }
        this.currentUser = user;
        if (user) {
            await this.assertedPersistence.setCurrentUser(user);
        }
        else {
            await this.assertedPersistence.removeCurrentUser();
        }
    }
    queue(action) {
        // In case something errors, the callback still should be called in order
        // to keep the promise chain alive
        this.operations = this.operations.then(action, action);
        return this.operations;
    }
    get assertedPersistence() {
        _assert(this.persistenceManager, this, "internal-error" /* INTERNAL_ERROR */);
        return this.persistenceManager;
    }
    _logFramework(framework) {
        if (!framework || this.frameworks.includes(framework)) {
            return;
        }
        this.frameworks.push(framework);
        // Sort alphabetically so that "FirebaseCore-web,FirebaseUI-web" and
        // "FirebaseUI-web,FirebaseCore-web" aren't viewed as different.
        this.frameworks.sort();
        this.clientVersion = _getClientVersion(this.config.clientPlatform, this._getFrameworks());
    }
    _getFrameworks() {
        return this.frameworks;
    }
    async _getAdditionalHeaders() {
        var _a;
        // Additional headers on every request
        const headers = {
            ["X-Client-Version" /* X_CLIENT_VERSION */]: this.clientVersion,
        };
        if (this.app.options.appId) {
            headers["X-Firebase-gmpid" /* X_FIREBASE_GMPID */] = this.app.options.appId;
        }
        // If the heartbeat service exists, add the heartbeat string
        const heartbeatsHeader = await ((_a = this.heartbeatServiceProvider.getImmediate({
            optional: true,
        })) === null || _a === void 0 ? void 0 : _a.getHeartbeatsHeader());
        if (heartbeatsHeader) {
            headers["X-Firebase-Client" /* X_FIREBASE_CLIENT */] = heartbeatsHeader;
        }
        return headers;
    }
}
/**
 * Method to be used to cast down to our private implmentation of Auth.
 * It will also handle unwrapping from the compat type if necessary
 *
 * @param auth Auth object passed in from developer
 */
function _castAuth(auth) {
    return getModularInstance(auth);
}
/** Helper class to wrap subscriber logic */
class Subscription {
    constructor(auth) {
        this.auth = auth;
        this.observer = null;
        this.addObserver = createSubscribe(observer => (this.observer = observer));
    }
    get next() {
        _assert(this.observer, this.auth, "internal-error" /* INTERNAL_ERROR */);
        return this.observer.next.bind(this.observer);
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Interface that represents the credentials returned by an {@link AuthProvider}.
 *
 * @remarks
 * Implementations specify the details about each auth provider's credential requirements.
 *
 * @public
 */
class AuthCredential {
    /** @internal */
    constructor(
    /**
     * The authentication provider ID for the credential.
     *
     * @remarks
     * For example, 'facebook.com', or 'google.com'.
     */
    providerId, 
    /**
     * The authentication sign in method for the credential.
     *
     * @remarks
     * For example, {@link SignInMethod}.EMAIL_PASSWORD, or
     * {@link SignInMethod}.EMAIL_LINK. This corresponds to the sign-in method
     * identifier as returned in {@link fetchSignInMethodsForEmail}.
     */
    signInMethod) {
        this.providerId = providerId;
        this.signInMethod = signInMethod;
    }
    /**
     * Returns a JSON-serializable representation of this object.
     *
     * @returns a JSON-serializable representation of this object.
     */
    toJSON() {
        return debugFail('not implemented');
    }
    /** @internal */
    _getIdTokenResponse(_auth) {
        return debugFail('not implemented');
    }
    /** @internal */
    _linkToIdToken(_auth, _idToken) {
        return debugFail('not implemented');
    }
    /** @internal */
    _getReauthenticationResolver(_auth) {
        return debugFail('not implemented');
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function signInWithIdp(auth, request) {
    return _performSignInRequest(auth, "POST" /* POST */, "/v1/accounts:signInWithIdp" /* SIGN_IN_WITH_IDP */, _addTidIfNecessary(auth, request));
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const IDP_REQUEST_URI$1 = 'http://localhost';
/**
 * Represents the OAuth credentials returned by an {@link OAuthProvider}.
 *
 * @remarks
 * Implementations specify the details about each auth provider's credential requirements.
 *
 * @public
 */
class OAuthCredential extends AuthCredential {
    constructor() {
        super(...arguments);
        this.pendingToken = null;
    }
    /** @internal */
    static _fromParams(params) {
        const cred = new OAuthCredential(params.providerId, params.signInMethod);
        if (params.idToken || params.accessToken) {
            // OAuth 2 and either ID token or access token.
            if (params.idToken) {
                cred.idToken = params.idToken;
            }
            if (params.accessToken) {
                cred.accessToken = params.accessToken;
            }
            // Add nonce if available and no pendingToken is present.
            if (params.nonce && !params.pendingToken) {
                cred.nonce = params.nonce;
            }
            if (params.pendingToken) {
                cred.pendingToken = params.pendingToken;
            }
        }
        else if (params.oauthToken && params.oauthTokenSecret) {
            // OAuth 1 and OAuth token with token secret
            cred.accessToken = params.oauthToken;
            cred.secret = params.oauthTokenSecret;
        }
        else {
            _fail("argument-error" /* ARGUMENT_ERROR */);
        }
        return cred;
    }
    /** {@inheritdoc AuthCredential.toJSON}  */
    toJSON() {
        return {
            idToken: this.idToken,
            accessToken: this.accessToken,
            secret: this.secret,
            nonce: this.nonce,
            pendingToken: this.pendingToken,
            providerId: this.providerId,
            signInMethod: this.signInMethod
        };
    }
    /**
     * Static method to deserialize a JSON representation of an object into an
     * {@link  AuthCredential}.
     *
     * @param json - Input can be either Object or the stringified representation of the object.
     * When string is provided, JSON.parse would be called first.
     *
     * @returns If the JSON input does not represent an {@link  AuthCredential}, null is returned.
     */
    static fromJSON(json) {
        const obj = typeof json === 'string' ? JSON.parse(json) : json;
        const { providerId, signInMethod } = obj, rest = __rest(obj, ["providerId", "signInMethod"]);
        if (!providerId || !signInMethod) {
            return null;
        }
        const cred = new OAuthCredential(providerId, signInMethod);
        cred.idToken = rest.idToken || undefined;
        cred.accessToken = rest.accessToken || undefined;
        cred.secret = rest.secret;
        cred.nonce = rest.nonce;
        cred.pendingToken = rest.pendingToken || null;
        return cred;
    }
    /** @internal */
    _getIdTokenResponse(auth) {
        const request = this.buildRequest();
        return signInWithIdp(auth, request);
    }
    /** @internal */
    _linkToIdToken(auth, idToken) {
        const request = this.buildRequest();
        request.idToken = idToken;
        return signInWithIdp(auth, request);
    }
    /** @internal */
    _getReauthenticationResolver(auth) {
        const request = this.buildRequest();
        request.autoCreate = false;
        return signInWithIdp(auth, request);
    }
    buildRequest() {
        const request = {
            requestUri: IDP_REQUEST_URI$1,
            returnSecureToken: true
        };
        if (this.pendingToken) {
            request.pendingToken = this.pendingToken;
        }
        else {
            const postBody = {};
            if (this.idToken) {
                postBody['id_token'] = this.idToken;
            }
            if (this.accessToken) {
                postBody['access_token'] = this.accessToken;
            }
            if (this.secret) {
                postBody['oauth_token_secret'] = this.secret;
            }
            postBody['providerId'] = this.providerId;
            if (this.nonce && !this.pendingToken) {
                postBody['nonce'] = this.nonce;
            }
            request.postBody = querystring(postBody);
        }
        return request;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The base class for all Federated providers (OAuth (including OIDC), SAML).
 *
 * This class is not meant to be instantiated directly.
 *
 * @public
 */
class FederatedAuthProvider {
    /**
     * Constructor for generic OAuth providers.
     *
     * @param providerId - Provider for which credentials should be generated.
     */
    constructor(providerId) {
        this.providerId = providerId;
        /** @internal */
        this.defaultLanguageCode = null;
        /** @internal */
        this.customParameters = {};
    }
    /**
     * Set the language gode.
     *
     * @param languageCode - language code
     */
    setDefaultLanguage(languageCode) {
        this.defaultLanguageCode = languageCode;
    }
    /**
     * Sets the OAuth custom parameters to pass in an OAuth request for popup and redirect sign-in
     * operations.
     *
     * @remarks
     * For a detailed list, check the reserved required OAuth 2.0 parameters such as `client_id`,
     * `redirect_uri`, `scope`, `response_type`, and `state` are not allowed and will be ignored.
     *
     * @param customOAuthParameters - The custom OAuth parameters to pass in the OAuth request.
     */
    setCustomParameters(customOAuthParameters) {
        this.customParameters = customOAuthParameters;
        return this;
    }
    /**
     * Retrieve the current list of {@link CustomParameters}.
     */
    getCustomParameters() {
        return this.customParameters;
    }
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Common code to all OAuth providers. This is separate from the
 * {@link OAuthProvider} so that child providers (like
 * {@link GoogleAuthProvider}) don't inherit the `credential` instance method.
 * Instead, they rely on a static `credential` method.
 */
class BaseOAuthProvider extends FederatedAuthProvider {
    constructor() {
        super(...arguments);
        /** @internal */
        this.scopes = [];
    }
    /**
     * Add an OAuth scope to the credential.
     *
     * @param scope - Provider OAuth scope to add.
     */
    addScope(scope) {
        // If not already added, add scope to list.
        if (!this.scopes.includes(scope)) {
            this.scopes.push(scope);
        }
        return this;
    }
    /**
     * Retrieve the current list of OAuth scopes.
     */
    getScopes() {
        return [...this.scopes];
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Provider for generating an an {@link OAuthCredential} for {@link ProviderId}.GOOGLE.
 *
 * @example
 * ```javascript
 * // Sign in using a redirect.
 * const provider = new GoogleAuthProvider();
 * // Start a sign in process for an unauthenticated user.
 * provider.addScope('profile');
 * provider.addScope('email');
 * await signInWithRedirect(auth, provider);
 * // This will trigger a full page redirect away from your app
 *
 * // After returning from the redirect when your app initializes you can obtain the result
 * const result = await getRedirectResult(auth);
 * if (result) {
 *   // This is the signed-in user
 *   const user = result.user;
 *   // This gives you a Google Access Token.
 *   const credential = GoogleAuthProvider.credentialFromResult(result);
 *   const token = credential.accessToken;
 * }
 * ```
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new GoogleAuthProvider();
 * provider.addScope('profile');
 * provider.addScope('email');
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Google Access Token.
 * const credential = GoogleAuthProvider.credentialFromResult(result);
 * const token = credential.accessToken;
 * ```
 *
 * @public
 */
class GoogleAuthProvider extends BaseOAuthProvider {
    constructor() {
        super("google.com" /* GOOGLE */);
        this.addScope('profile');
    }
    /**
     * Creates a credential for Google. At least one of ID token and access token is required.
     *
     * @example
     * ```javascript
     * // \`googleUser\` from the onsuccess Google Sign In callback.
     * const credential = GoogleAuthProvider.credential(googleUser.getAuthResponse().id_token);
     * const result = await signInWithCredential(credential);
     * ```
     *
     * @param idToken - Google ID token.
     * @param accessToken - Google access token.
     */
    static credential(idToken, accessToken) {
        return OAuthCredential._fromParams({
            providerId: GoogleAuthProvider.PROVIDER_ID,
            signInMethod: GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,
            idToken,
            accessToken
        });
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link UserCredential}.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromResult(userCredential) {
        return GoogleAuthProvider.credentialFromTaggedObject(userCredential);
    }
    /**
     * Used to extract the underlying {@link OAuthCredential} from a {@link AuthError} which was
     * thrown during a sign-in, link, or reauthenticate operation.
     *
     * @param userCredential - The user credential.
     */
    static credentialFromError(error) {
        return GoogleAuthProvider.credentialFromTaggedObject((error.customData || {}));
    }
    static credentialFromTaggedObject({ _tokenResponse: tokenResponse }) {
        if (!tokenResponse) {
            return null;
        }
        const { oauthIdToken, oauthAccessToken } = tokenResponse;
        if (!oauthIdToken && !oauthAccessToken) {
            // This could be an oauth 1 credential or a phone credential
            return null;
        }
        try {
            return GoogleAuthProvider.credential(oauthIdToken, oauthAccessToken);
        }
        catch (_a) {
            return null;
        }
    }
}
/** Always set to {@link SignInMethod}.GOOGLE. */
GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD = "google.com" /* GOOGLE */;
/** Always set to {@link ProviderId}.GOOGLE. */
GoogleAuthProvider.PROVIDER_ID = "google.com" /* GOOGLE */;

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function signUp(auth, request) {
    return _performSignInRequest(auth, "POST" /* POST */, "/v1/accounts:signUp" /* SIGN_UP */, _addTidIfNecessary(auth, request));
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class UserCredentialImpl {
    constructor(params) {
        this.user = params.user;
        this.providerId = params.providerId;
        this._tokenResponse = params._tokenResponse;
        this.operationType = params.operationType;
    }
    static async _fromIdTokenResponse(auth, operationType, idTokenResponse, isAnonymous = false) {
        const user = await UserImpl._fromIdTokenResponse(auth, idTokenResponse, isAnonymous);
        const providerId = providerIdForResponse(idTokenResponse);
        const userCred = new UserCredentialImpl({
            user,
            providerId,
            _tokenResponse: idTokenResponse,
            operationType
        });
        return userCred;
    }
    static async _forOperation(user, operationType, response) {
        await user._updateTokensIfNecessary(response, /* reload */ true);
        const providerId = providerIdForResponse(response);
        return new UserCredentialImpl({
            user,
            providerId,
            _tokenResponse: response,
            operationType
        });
    }
}
function providerIdForResponse(response) {
    if (response.providerId) {
        return response.providerId;
    }
    if ('phoneNumber' in response) {
        return "phone" /* PHONE */;
    }
    return null;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Asynchronously signs in as an anonymous user.
 *
 * @remarks
 * If there is already an anonymous user signed in, that user will be returned; otherwise, a
 * new anonymous user identity will be created and returned.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
async function signInAnonymously(auth) {
    var _a;
    const authInternal = _castAuth(auth);
    await authInternal._initializationPromise;
    if ((_a = authInternal.currentUser) === null || _a === void 0 ? void 0 : _a.isAnonymous) {
        // If an anonymous user is already signed in, no need to sign them in again.
        return new UserCredentialImpl({
            user: authInternal.currentUser,
            providerId: null,
            operationType: "signIn" /* SIGN_IN */
        });
    }
    const response = await signUp(authInternal, {
        returnSecureToken: true
    });
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(authInternal, "signIn" /* SIGN_IN */, response, true);
    await authInternal._updateCurrentUser(userCredential.user);
    return userCredential;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class MultiFactorError extends FirebaseError {
    constructor(auth, error, operationType, user) {
        var _a;
        super(error.code, error.message);
        this.operationType = operationType;
        this.user = user;
        // https://github.com/Microsoft/TypeScript-wiki/blob/master/Breaking-Changes.md#extending-built-ins-like-error-array-and-map-may-no-longer-work
        Object.setPrototypeOf(this, MultiFactorError.prototype);
        this.customData = {
            appName: auth.name,
            tenantId: (_a = auth.tenantId) !== null && _a !== void 0 ? _a : undefined,
            _serverResponse: error.customData._serverResponse,
            operationType,
        };
    }
    static _fromErrorAndOperation(auth, error, operationType, user) {
        return new MultiFactorError(auth, error, operationType, user);
    }
}
function _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user) {
    const idTokenProvider = operationType === "reauthenticate" /* REAUTHENTICATE */
        ? credential._getReauthenticationResolver(auth)
        : credential._getIdTokenResponse(auth);
    return idTokenProvider.catch(error => {
        if (error.code === `auth/${"multi-factor-auth-required" /* MFA_REQUIRED */}`) {
            throw MultiFactorError._fromErrorAndOperation(auth, error, operationType, user);
        }
        throw error;
    });
}
async function _link$1(user, credential, bypassAuthState = false) {
    const response = await _logoutIfInvalidated(user, credential._linkToIdToken(user.auth, await user.getIdToken()), bypassAuthState);
    return UserCredentialImpl._forOperation(user, "link" /* LINK */, response);
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function _reauthenticate(user, credential, bypassAuthState = false) {
    const { auth } = user;
    const operationType = "reauthenticate" /* REAUTHENTICATE */;
    try {
        const response = await _logoutIfInvalidated(user, _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential, user), bypassAuthState);
        _assert(response.idToken, auth, "internal-error" /* INTERNAL_ERROR */);
        const parsed = _parseToken(response.idToken);
        _assert(parsed, auth, "internal-error" /* INTERNAL_ERROR */);
        const { sub: localId } = parsed;
        _assert(user.uid === localId, auth, "user-mismatch" /* USER_MISMATCH */);
        return UserCredentialImpl._forOperation(user, operationType, response);
    }
    catch (e) {
        // Convert user deleted error into user mismatch
        if ((e === null || e === void 0 ? void 0 : e.code) === `auth/${"user-not-found" /* USER_DELETED */}`) {
            _fail(auth, "user-mismatch" /* USER_MISMATCH */);
        }
        throw e;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function _signInWithCredential(auth, credential, bypassAuthState = false) {
    const operationType = "signIn" /* SIGN_IN */;
    const response = await _processCredentialSavingMfaContextIfNecessary(auth, operationType, credential);
    const userCredential = await UserCredentialImpl._fromIdTokenResponse(auth, operationType, response);
    if (!bypassAuthState) {
        await auth._updateCurrentUser(userCredential.user);
    }
    return userCredential;
}
/**
 * Signs out the current user.
 *
 * @param auth - The {@link Auth} instance.
 *
 * @public
 */
function signOut(auth) {
    return getModularInstance(auth).signOut();
}
/**
 * Deletes and signs out the user.
 *
 * @remarks
 * Important: this is a security-sensitive operation that requires the user to have recently
 * signed in. If this requirement isn't met, ask the user to authenticate again and then call
 * {@link reauthenticateWithCredential}.
 *
 * @param user - The user.
 *
 * @public
 */
async function deleteUser(user) {
    return getModularInstance(user).delete();
}

const STORAGE_AVAILABLE_KEY = '__sak';

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// There are two different browser persistence types: local and session.
// Both have the same implementation but use a different underlying storage
// object.
class BrowserPersistenceClass {
    constructor(storageRetriever, type) {
        this.storageRetriever = storageRetriever;
        this.type = type;
    }
    _isAvailable() {
        try {
            if (!this.storage) {
                return Promise.resolve(false);
            }
            this.storage.setItem(STORAGE_AVAILABLE_KEY, '1');
            this.storage.removeItem(STORAGE_AVAILABLE_KEY);
            return Promise.resolve(true);
        }
        catch (_a) {
            return Promise.resolve(false);
        }
    }
    _set(key, value) {
        this.storage.setItem(key, JSON.stringify(value));
        return Promise.resolve();
    }
    _get(key) {
        const json = this.storage.getItem(key);
        return Promise.resolve(json ? JSON.parse(json) : null);
    }
    _remove(key) {
        this.storage.removeItem(key);
        return Promise.resolve();
    }
    get storage() {
        return this.storageRetriever();
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _iframeCannotSyncWebStorage() {
    const ua = getUA();
    return _isSafari(ua) || _isIOS(ua);
}
// The polling period in case events are not supported
const _POLLING_INTERVAL_MS$1 = 1000;
// The IE 10 localStorage cross tab synchronization delay in milliseconds
const IE10_LOCAL_STORAGE_SYNC_DELAY = 10;
class BrowserLocalPersistence extends BrowserPersistenceClass {
    constructor() {
        super(() => window.localStorage, "LOCAL" /* LOCAL */);
        this.boundEventHandler = (event, poll) => this.onStorageEvent(event, poll);
        this.listeners = {};
        this.localCache = {};
        // setTimeout return value is platform specific
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.pollTimer = null;
        // Safari or iOS browser and embedded in an iframe.
        this.safariLocalStorageNotSynced = _iframeCannotSyncWebStorage() && _isIframe();
        // Whether to use polling instead of depending on window events
        this.fallbackToPolling = _isMobileBrowser();
        this._shouldAllowMigration = true;
    }
    forAllChangedKeys(cb) {
        // Check all keys with listeners on them.
        for (const key of Object.keys(this.listeners)) {
            // Get value from localStorage.
            const newValue = this.storage.getItem(key);
            const oldValue = this.localCache[key];
            // If local map value does not match, trigger listener with storage event.
            // Differentiate this simulated event from the real storage event.
            if (newValue !== oldValue) {
                cb(key, oldValue, newValue);
            }
        }
    }
    onStorageEvent(event, poll = false) {
        // Key would be null in some situations, like when localStorage is cleared
        if (!event.key) {
            this.forAllChangedKeys((key, _oldValue, newValue) => {
                this.notifyListeners(key, newValue);
            });
            return;
        }
        const key = event.key;
        // Check the mechanism how this event was detected.
        // The first event will dictate the mechanism to be used.
        if (poll) {
            // Environment detects storage changes via polling.
            // Remove storage event listener to prevent possible event duplication.
            this.detachListener();
        }
        else {
            // Environment detects storage changes via storage event listener.
            // Remove polling listener to prevent possible event duplication.
            this.stopPolling();
        }
        // Safari embedded iframe. Storage event will trigger with the delta
        // changes but no changes will be applied to the iframe localStorage.
        if (this.safariLocalStorageNotSynced) {
            // Get current iframe page value.
            const storedValue = this.storage.getItem(key);
            // Value not synchronized, synchronize manually.
            if (event.newValue !== storedValue) {
                if (event.newValue !== null) {
                    // Value changed from current value.
                    this.storage.setItem(key, event.newValue);
                }
                else {
                    // Current value deleted.
                    this.storage.removeItem(key);
                }
            }
            else if (this.localCache[key] === event.newValue && !poll) {
                // Already detected and processed, do not trigger listeners again.
                return;
            }
        }
        const triggerListeners = () => {
            // Keep local map up to date in case storage event is triggered before
            // poll.
            const storedValue = this.storage.getItem(key);
            if (!poll && this.localCache[key] === storedValue) {
                // Real storage event which has already been detected, do nothing.
                // This seems to trigger in some IE browsers for some reason.
                return;
            }
            this.notifyListeners(key, storedValue);
        };
        const storedValue = this.storage.getItem(key);
        if (_isIE10() &&
            storedValue !== event.newValue &&
            event.newValue !== event.oldValue) {
            // IE 10 has this weird bug where a storage event would trigger with the
            // correct key, oldValue and newValue but localStorage.getItem(key) does
            // not yield the updated value until a few milliseconds. This ensures
            // this recovers from that situation.
            setTimeout(triggerListeners, IE10_LOCAL_STORAGE_SYNC_DELAY);
        }
        else {
            triggerListeners();
        }
    }
    notifyListeners(key, value) {
        this.localCache[key] = value;
        const listeners = this.listeners[key];
        if (listeners) {
            for (const listener of Array.from(listeners)) {
                listener(value ? JSON.parse(value) : value);
            }
        }
    }
    startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(() => {
            this.forAllChangedKeys((key, oldValue, newValue) => {
                this.onStorageEvent(new StorageEvent('storage', {
                    key,
                    oldValue,
                    newValue
                }), 
                /* poll */ true);
            });
        }, _POLLING_INTERVAL_MS$1);
    }
    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }
    attachListener() {
        window.addEventListener('storage', this.boundEventHandler);
    }
    detachListener() {
        window.removeEventListener('storage', this.boundEventHandler);
    }
    _addListener(key, listener) {
        if (Object.keys(this.listeners).length === 0) {
            // Whether browser can detect storage event when it had already been pushed to the background.
            // This may happen in some mobile browsers. A localStorage change in the foreground window
            // will not be detected in the background window via the storage event.
            // This was detected in iOS 7.x mobile browsers
            if (this.fallbackToPolling) {
                this.startPolling();
            }
            else {
                this.attachListener();
            }
        }
        if (!this.listeners[key]) {
            this.listeners[key] = new Set();
            // Populate the cache to avoid spuriously triggering on first poll.
            this.localCache[key] = this.storage.getItem(key);
        }
        this.listeners[key].add(listener);
    }
    _removeListener(key, listener) {
        if (this.listeners[key]) {
            this.listeners[key].delete(listener);
            if (this.listeners[key].size === 0) {
                delete this.listeners[key];
            }
        }
        if (Object.keys(this.listeners).length === 0) {
            this.detachListener();
            this.stopPolling();
        }
    }
    // Update local cache on base operations:
    async _set(key, value) {
        await super._set(key, value);
        this.localCache[key] = JSON.stringify(value);
    }
    async _get(key) {
        const value = await super._get(key);
        this.localCache[key] = JSON.stringify(value);
        return value;
    }
    async _remove(key) {
        await super._remove(key);
        delete this.localCache[key];
    }
}
BrowserLocalPersistence.type = 'LOCAL';
/**
 * An implementation of {@link Persistence} of type `LOCAL` using `localStorage`
 * for the underlying storage.
 *
 * @public
 */
const browserLocalPersistence = BrowserLocalPersistence;

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class BrowserSessionPersistence extends BrowserPersistenceClass {
    constructor() {
        super(() => window.sessionStorage, "SESSION" /* SESSION */);
    }
    _addListener(_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    }
    _removeListener(_key, _listener) {
        // Listeners are not supported for session storage since it cannot be shared across windows
        return;
    }
}
BrowserSessionPersistence.type = 'SESSION';
/**
 * An implementation of {@link Persistence} of `SESSION` using `sessionStorage`
 * for the underlying storage.
 *
 * @public
 */
const browserSessionPersistence = BrowserSessionPersistence;

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Shim for Promise.allSettled, note the slightly different format of `fulfilled` vs `status`.
 *
 * @param promises - Array of promises to wait on.
 */
function _allSettled(promises) {
    return Promise.all(promises.map(async (promise) => {
        try {
            const value = await promise;
            return {
                fulfilled: true,
                value
            };
        }
        catch (reason) {
            return {
                fulfilled: false,
                reason
            };
        }
    }));
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Interface class for receiving messages.
 *
 */
class Receiver {
    constructor(eventTarget) {
        this.eventTarget = eventTarget;
        this.handlersMap = {};
        this.boundEventHandler = this.handleEvent.bind(this);
    }
    /**
     * Obtain an instance of a Receiver for a given event target, if none exists it will be created.
     *
     * @param eventTarget - An event target (such as window or self) through which the underlying
     * messages will be received.
     */
    static _getInstance(eventTarget) {
        // The results are stored in an array since objects can't be keys for other
        // objects. In addition, setting a unique property on an event target as a
        // hash map key may not be allowed due to CORS restrictions.
        const existingInstance = this.receivers.find(receiver => receiver.isListeningto(eventTarget));
        if (existingInstance) {
            return existingInstance;
        }
        const newInstance = new Receiver(eventTarget);
        this.receivers.push(newInstance);
        return newInstance;
    }
    isListeningto(eventTarget) {
        return this.eventTarget === eventTarget;
    }
    /**
     * Fans out a MessageEvent to the appropriate listeners.
     *
     * @remarks
     * Sends an {@link Status.ACK} upon receipt and a {@link Status.DONE} once all handlers have
     * finished processing.
     *
     * @param event - The MessageEvent.
     *
     */
    async handleEvent(event) {
        const messageEvent = event;
        const { eventId, eventType, data } = messageEvent.data;
        const handlers = this.handlersMap[eventType];
        if (!(handlers === null || handlers === void 0 ? void 0 : handlers.size)) {
            return;
        }
        messageEvent.ports[0].postMessage({
            status: "ack" /* ACK */,
            eventId,
            eventType
        });
        const promises = Array.from(handlers).map(async (handler) => handler(messageEvent.origin, data));
        const response = await _allSettled(promises);
        messageEvent.ports[0].postMessage({
            status: "done" /* DONE */,
            eventId,
            eventType,
            response
        });
    }
    /**
     * Subscribe an event handler for a particular event.
     *
     * @param eventType - Event name to subscribe to.
     * @param eventHandler - The event handler which should receive the events.
     *
     */
    _subscribe(eventType, eventHandler) {
        if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.addEventListener('message', this.boundEventHandler);
        }
        if (!this.handlersMap[eventType]) {
            this.handlersMap[eventType] = new Set();
        }
        this.handlersMap[eventType].add(eventHandler);
    }
    /**
     * Unsubscribe an event handler from a particular event.
     *
     * @param eventType - Event name to unsubscribe from.
     * @param eventHandler - Optinoal event handler, if none provided, unsubscribe all handlers on this event.
     *
     */
    _unsubscribe(eventType, eventHandler) {
        if (this.handlersMap[eventType] && eventHandler) {
            this.handlersMap[eventType].delete(eventHandler);
        }
        if (!eventHandler || this.handlersMap[eventType].size === 0) {
            delete this.handlersMap[eventType];
        }
        if (Object.keys(this.handlersMap).length === 0) {
            this.eventTarget.removeEventListener('message', this.boundEventHandler);
        }
    }
}
Receiver.receivers = [];

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _generateEventId(prefix = '', digits = 10) {
    let random = '';
    for (let i = 0; i < digits; i++) {
        random += Math.floor(Math.random() * 10);
    }
    return prefix + random;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Interface for sending messages and waiting for a completion response.
 *
 */
class Sender {
    constructor(target) {
        this.target = target;
        this.handlers = new Set();
    }
    /**
     * Unsubscribe the handler and remove it from our tracking Set.
     *
     * @param handler - The handler to unsubscribe.
     */
    removeMessageHandler(handler) {
        if (handler.messageChannel) {
            handler.messageChannel.port1.removeEventListener('message', handler.onMessage);
            handler.messageChannel.port1.close();
        }
        this.handlers.delete(handler);
    }
    /**
     * Send a message to the Receiver located at {@link target}.
     *
     * @remarks
     * We'll first wait a bit for an ACK , if we get one we will wait significantly longer until the
     * receiver has had a chance to fully process the event.
     *
     * @param eventType - Type of event to send.
     * @param data - The payload of the event.
     * @param timeout - Timeout for waiting on an ACK from the receiver.
     *
     * @returns An array of settled promises from all the handlers that were listening on the receiver.
     */
    async _send(eventType, data, timeout = 50 /* ACK */) {
        const messageChannel = typeof MessageChannel !== 'undefined' ? new MessageChannel() : null;
        if (!messageChannel) {
            throw new Error("connection_unavailable" /* CONNECTION_UNAVAILABLE */);
        }
        // Node timers and browser timers return fundamentally different types.
        // We don't actually care what the value is but TS won't accept unknown and
        // we can't cast properly in both environments.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let completionTimer;
        let handler;
        return new Promise((resolve, reject) => {
            const eventId = _generateEventId('', 20);
            messageChannel.port1.start();
            const ackTimer = setTimeout(() => {
                reject(new Error("unsupported_event" /* UNSUPPORTED_EVENT */));
            }, timeout);
            handler = {
                messageChannel,
                onMessage(event) {
                    const messageEvent = event;
                    if (messageEvent.data.eventId !== eventId) {
                        return;
                    }
                    switch (messageEvent.data.status) {
                        case "ack" /* ACK */:
                            // The receiver should ACK first.
                            clearTimeout(ackTimer);
                            completionTimer = setTimeout(() => {
                                reject(new Error("timeout" /* TIMEOUT */));
                            }, 3000 /* COMPLETION */);
                            break;
                        case "done" /* DONE */:
                            // Once the receiver's handlers are finished we will get the results.
                            clearTimeout(completionTimer);
                            resolve(messageEvent.data.response);
                            break;
                        default:
                            clearTimeout(ackTimer);
                            clearTimeout(completionTimer);
                            reject(new Error("invalid_response" /* INVALID_RESPONSE */));
                            break;
                    }
                }
            };
            this.handlers.add(handler);
            messageChannel.port1.addEventListener('message', handler.onMessage);
            this.target.postMessage({
                eventType,
                eventId,
                data
            }, [messageChannel.port2]);
        }).finally(() => {
            if (handler) {
                this.removeMessageHandler(handler);
            }
        });
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Lazy accessor for window, since the compat layer won't tree shake this out,
 * we need to make sure not to mess with window unless we have to
 */
function _window() {
    return window;
}
function _setWindowLocation(url) {
    _window().location.href = url;
}

/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function _isWorker() {
    return (typeof _window()['WorkerGlobalScope'] !== 'undefined' &&
        typeof _window()['importScripts'] === 'function');
}
async function _getActiveServiceWorker() {
    if (!(navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker)) {
        return null;
    }
    try {
        const registration = await navigator.serviceWorker.ready;
        return registration.active;
    }
    catch (_a) {
        return null;
    }
}
function _getServiceWorkerController() {
    var _a;
    return ((_a = navigator === null || navigator === void 0 ? void 0 : navigator.serviceWorker) === null || _a === void 0 ? void 0 : _a.controller) || null;
}
function _getWorkerGlobalScope() {
    return _isWorker() ? self : null;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const DB_NAME = 'firebaseLocalStorageDb';
const DB_VERSION = 1;
const DB_OBJECTSTORE_NAME = 'firebaseLocalStorage';
const DB_DATA_KEYPATH = 'fbase_key';
/**
 * Promise wrapper for IDBRequest
 *
 * Unfortunately we can't cleanly extend Promise<T> since promises are not callable in ES6
 *
 */
class DBPromise {
    constructor(request) {
        this.request = request;
    }
    toPromise() {
        return new Promise((resolve, reject) => {
            this.request.addEventListener('success', () => {
                resolve(this.request.result);
            });
            this.request.addEventListener('error', () => {
                reject(this.request.error);
            });
        });
    }
}
function getObjectStore(db, isReadWrite) {
    return db
        .transaction([DB_OBJECTSTORE_NAME], isReadWrite ? 'readwrite' : 'readonly')
        .objectStore(DB_OBJECTSTORE_NAME);
}
function _deleteDatabase() {
    const request = indexedDB.deleteDatabase(DB_NAME);
    return new DBPromise(request).toPromise();
}
function _openDatabase() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    return new Promise((resolve, reject) => {
        request.addEventListener('error', () => {
            reject(request.error);
        });
        request.addEventListener('upgradeneeded', () => {
            const db = request.result;
            try {
                db.createObjectStore(DB_OBJECTSTORE_NAME, { keyPath: DB_DATA_KEYPATH });
            }
            catch (e) {
                reject(e);
            }
        });
        request.addEventListener('success', async () => {
            const db = request.result;
            // Strange bug that occurs in Firefox when multiple tabs are opened at the
            // same time. The only way to recover seems to be deleting the database
            // and re-initializing it.
            // https://github.com/firebase/firebase-js-sdk/issues/634
            if (!db.objectStoreNames.contains(DB_OBJECTSTORE_NAME)) {
                // Need to close the database or else you get a `blocked` event
                db.close();
                await _deleteDatabase();
                resolve(await _openDatabase());
            }
            else {
                resolve(db);
            }
        });
    });
}
async function _putObject(db, key, value) {
    const request = getObjectStore(db, true).put({
        [DB_DATA_KEYPATH]: key,
        value
    });
    return new DBPromise(request).toPromise();
}
async function getObject(db, key) {
    const request = getObjectStore(db, false).get(key);
    const data = await new DBPromise(request).toPromise();
    return data === undefined ? null : data.value;
}
function _deleteObject(db, key) {
    const request = getObjectStore(db, true).delete(key);
    return new DBPromise(request).toPromise();
}
const _POLLING_INTERVAL_MS = 800;
const _TRANSACTION_RETRY_COUNT = 3;
class IndexedDBLocalPersistence {
    constructor() {
        this.type = "LOCAL" /* LOCAL */;
        this._shouldAllowMigration = true;
        this.listeners = {};
        this.localCache = {};
        // setTimeout return value is platform specific
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.pollTimer = null;
        this.pendingWrites = 0;
        this.receiver = null;
        this.sender = null;
        this.serviceWorkerReceiverAvailable = false;
        this.activeServiceWorker = null;
        // Fire & forget the service worker registration as it may never resolve
        this._workerInitializationPromise =
            this.initializeServiceWorkerMessaging().then(() => { }, () => { });
    }
    async _openDb() {
        if (this.db) {
            return this.db;
        }
        this.db = await _openDatabase();
        return this.db;
    }
    async _withRetries(op) {
        let numAttempts = 0;
        while (true) {
            try {
                const db = await this._openDb();
                return await op(db);
            }
            catch (e) {
                if (numAttempts++ > _TRANSACTION_RETRY_COUNT) {
                    throw e;
                }
                if (this.db) {
                    this.db.close();
                    this.db = undefined;
                }
                // TODO: consider adding exponential backoff
            }
        }
    }
    /**
     * IndexedDB events do not propagate from the main window to the worker context.  We rely on a
     * postMessage interface to send these events to the worker ourselves.
     */
    async initializeServiceWorkerMessaging() {
        return _isWorker() ? this.initializeReceiver() : this.initializeSender();
    }
    /**
     * As the worker we should listen to events from the main window.
     */
    async initializeReceiver() {
        this.receiver = Receiver._getInstance(_getWorkerGlobalScope());
        // Refresh from persistence if we receive a KeyChanged message.
        this.receiver._subscribe("keyChanged" /* KEY_CHANGED */, async (_origin, data) => {
            const keys = await this._poll();
            return {
                keyProcessed: keys.includes(data.key)
            };
        });
        // Let the sender know that we are listening so they give us more timeout.
        this.receiver._subscribe("ping" /* PING */, async (_origin, _data) => {
            return ["keyChanged" /* KEY_CHANGED */];
        });
    }
    /**
     * As the main window, we should let the worker know when keys change (set and remove).
     *
     * @remarks
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerContainer/ready | ServiceWorkerContainer.ready}
     * may not resolve.
     */
    async initializeSender() {
        var _a, _b;
        // Check to see if there's an active service worker.
        this.activeServiceWorker = await _getActiveServiceWorker();
        if (!this.activeServiceWorker) {
            return;
        }
        this.sender = new Sender(this.activeServiceWorker);
        // Ping the service worker to check what events they can handle.
        const results = await this.sender._send("ping" /* PING */, {}, 800 /* LONG_ACK */);
        if (!results) {
            return;
        }
        if (((_a = results[0]) === null || _a === void 0 ? void 0 : _a.fulfilled) &&
            ((_b = results[0]) === null || _b === void 0 ? void 0 : _b.value.includes("keyChanged" /* KEY_CHANGED */))) {
            this.serviceWorkerReceiverAvailable = true;
        }
    }
    /**
     * Let the worker know about a changed key, the exact key doesn't technically matter since the
     * worker will just trigger a full sync anyway.
     *
     * @remarks
     * For now, we only support one service worker per page.
     *
     * @param key - Storage key which changed.
     */
    async notifyServiceWorker(key) {
        if (!this.sender ||
            !this.activeServiceWorker ||
            _getServiceWorkerController() !== this.activeServiceWorker) {
            return;
        }
        try {
            await this.sender._send("keyChanged" /* KEY_CHANGED */, { key }, 
            // Use long timeout if receiver has previously responded to a ping from us.
            this.serviceWorkerReceiverAvailable
                ? 800 /* LONG_ACK */
                : 50 /* ACK */);
        }
        catch (_a) {
            // This is a best effort approach. Ignore errors.
        }
    }
    async _isAvailable() {
        try {
            if (!indexedDB) {
                return false;
            }
            const db = await _openDatabase();
            await _putObject(db, STORAGE_AVAILABLE_KEY, '1');
            await _deleteObject(db, STORAGE_AVAILABLE_KEY);
            return true;
        }
        catch (_a) { }
        return false;
    }
    async _withPendingWrite(write) {
        this.pendingWrites++;
        try {
            await write();
        }
        finally {
            this.pendingWrites--;
        }
    }
    async _set(key, value) {
        return this._withPendingWrite(async () => {
            await this._withRetries((db) => _putObject(db, key, value));
            this.localCache[key] = value;
            return this.notifyServiceWorker(key);
        });
    }
    async _get(key) {
        const obj = (await this._withRetries((db) => getObject(db, key)));
        this.localCache[key] = obj;
        return obj;
    }
    async _remove(key) {
        return this._withPendingWrite(async () => {
            await this._withRetries((db) => _deleteObject(db, key));
            delete this.localCache[key];
            return this.notifyServiceWorker(key);
        });
    }
    async _poll() {
        // TODO: check if we need to fallback if getAll is not supported
        const result = await this._withRetries((db) => {
            const getAllRequest = getObjectStore(db, false).getAll();
            return new DBPromise(getAllRequest).toPromise();
        });
        if (!result) {
            return [];
        }
        // If we have pending writes in progress abort, we'll get picked up on the next poll
        if (this.pendingWrites !== 0) {
            return [];
        }
        const keys = [];
        const keysInResult = new Set();
        for (const { fbase_key: key, value } of result) {
            keysInResult.add(key);
            if (JSON.stringify(this.localCache[key]) !== JSON.stringify(value)) {
                this.notifyListeners(key, value);
                keys.push(key);
            }
        }
        for (const localKey of Object.keys(this.localCache)) {
            if (this.localCache[localKey] && !keysInResult.has(localKey)) {
                // Deleted
                this.notifyListeners(localKey, null);
                keys.push(localKey);
            }
        }
        return keys;
    }
    notifyListeners(key, newValue) {
        this.localCache[key] = newValue;
        const listeners = this.listeners[key];
        if (listeners) {
            for (const listener of Array.from(listeners)) {
                listener(newValue);
            }
        }
    }
    startPolling() {
        this.stopPolling();
        this.pollTimer = setInterval(async () => this._poll(), _POLLING_INTERVAL_MS);
    }
    stopPolling() {
        if (this.pollTimer) {
            clearInterval(this.pollTimer);
            this.pollTimer = null;
        }
    }
    _addListener(key, listener) {
        if (Object.keys(this.listeners).length === 0) {
            this.startPolling();
        }
        if (!this.listeners[key]) {
            this.listeners[key] = new Set();
            // Populate the cache to avoid spuriously triggering on first poll.
            void this._get(key); // This can happen in the background async and we can return immediately.
        }
        this.listeners[key].add(listener);
    }
    _removeListener(key, listener) {
        if (this.listeners[key]) {
            this.listeners[key].delete(listener);
            if (this.listeners[key].size === 0) {
                delete this.listeners[key];
            }
        }
        if (Object.keys(this.listeners).length === 0) {
            this.stopPolling();
        }
    }
}
IndexedDBLocalPersistence.type = 'LOCAL';
/**
 * An implementation of {@link Persistence} of type `LOCAL` using `indexedDB`
 * for the underlying storage.
 *
 * @public
 */
const indexedDBLocalPersistence = IndexedDBLocalPersistence;

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getScriptParentElement() {
    var _a, _b;
    return (_b = (_a = document.getElementsByTagName('head')) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : document;
}
function _loadJS(url) {
    // TODO: consider adding timeout support & cancellation
    return new Promise((resolve, reject) => {
        const el = document.createElement('script');
        el.setAttribute('src', url);
        el.onload = resolve;
        el.onerror = e => {
            const error = _createError("internal-error" /* INTERNAL_ERROR */);
            error.customData = e;
            reject(error);
        };
        el.type = 'text/javascript';
        el.charset = 'UTF-8';
        getScriptParentElement().appendChild(el);
    });
}
function _generateCallbackName(prefix) {
    return `__${prefix}${Math.floor(Math.random() * 1000000)}`;
}
const NETWORK_TIMEOUT_DELAY = new Delay(30000, 60000);

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Chooses a popup/redirect resolver to use. This prefers the override (which
 * is directly passed in), and falls back to the property set on the auth
 * object. If neither are available, this function errors w/ an argument error.
 */
function _withDefaultResolver(auth, resolverOverride) {
    if (resolverOverride) {
        return _getInstance(resolverOverride);
    }
    _assert(auth._popupRedirectResolver, auth, "argument-error" /* ARGUMENT_ERROR */);
    return auth._popupRedirectResolver;
}

/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class IdpCredential extends AuthCredential {
    constructor(params) {
        super("custom" /* CUSTOM */, "custom" /* CUSTOM */);
        this.params = params;
    }
    _getIdTokenResponse(auth) {
        return signInWithIdp(auth, this._buildIdpRequest());
    }
    _linkToIdToken(auth, idToken) {
        return signInWithIdp(auth, this._buildIdpRequest(idToken));
    }
    _getReauthenticationResolver(auth) {
        return signInWithIdp(auth, this._buildIdpRequest());
    }
    _buildIdpRequest(idToken) {
        const request = {
            requestUri: this.params.requestUri,
            sessionId: this.params.sessionId,
            postBody: this.params.postBody,
            tenantId: this.params.tenantId,
            pendingToken: this.params.pendingToken,
            returnSecureToken: true,
            returnIdpCredential: true
        };
        if (idToken) {
            request.idToken = idToken;
        }
        return request;
    }
}
function _signIn(params) {
    return _signInWithCredential(params.auth, new IdpCredential(params), params.bypassAuthState);
}
function _reauth(params) {
    const { auth, user } = params;
    _assert(user, auth, "internal-error" /* INTERNAL_ERROR */);
    return _reauthenticate(user, new IdpCredential(params), params.bypassAuthState);
}
async function _link(params) {
    const { auth, user } = params;
    _assert(user, auth, "internal-error" /* INTERNAL_ERROR */);
    return _link$1(user, new IdpCredential(params), params.bypassAuthState);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Popup event manager. Handles the popup's entire lifecycle; listens to auth
 * events
 */
class AbstractPopupRedirectOperation {
    constructor(auth, filter, resolver, user, bypassAuthState = false) {
        this.auth = auth;
        this.resolver = resolver;
        this.user = user;
        this.bypassAuthState = bypassAuthState;
        this.pendingPromise = null;
        this.eventManager = null;
        this.filter = Array.isArray(filter) ? filter : [filter];
    }
    execute() {
        return new Promise(async (resolve, reject) => {
            this.pendingPromise = { resolve, reject };
            try {
                this.eventManager = await this.resolver._initialize(this.auth);
                await this.onExecution();
                this.eventManager.registerConsumer(this);
            }
            catch (e) {
                this.reject(e);
            }
        });
    }
    async onAuthEvent(event) {
        const { urlResponse, sessionId, postBody, tenantId, error, type } = event;
        if (error) {
            this.reject(error);
            return;
        }
        const params = {
            auth: this.auth,
            requestUri: urlResponse,
            sessionId: sessionId,
            tenantId: tenantId || undefined,
            postBody: postBody || undefined,
            user: this.user,
            bypassAuthState: this.bypassAuthState
        };
        try {
            this.resolve(await this.getIdpTask(type)(params));
        }
        catch (e) {
            this.reject(e);
        }
    }
    onError(error) {
        this.reject(error);
    }
    getIdpTask(type) {
        switch (type) {
            case "signInViaPopup" /* SIGN_IN_VIA_POPUP */:
            case "signInViaRedirect" /* SIGN_IN_VIA_REDIRECT */:
                return _signIn;
            case "linkViaPopup" /* LINK_VIA_POPUP */:
            case "linkViaRedirect" /* LINK_VIA_REDIRECT */:
                return _link;
            case "reauthViaPopup" /* REAUTH_VIA_POPUP */:
            case "reauthViaRedirect" /* REAUTH_VIA_REDIRECT */:
                return _reauth;
            default:
                _fail(this.auth, "internal-error" /* INTERNAL_ERROR */);
        }
    }
    resolve(cred) {
        debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.resolve(cred);
        this.unregisterAndCleanUp();
    }
    reject(error) {
        debugAssert(this.pendingPromise, 'Pending promise was never set');
        this.pendingPromise.reject(error);
        this.unregisterAndCleanUp();
    }
    unregisterAndCleanUp() {
        if (this.eventManager) {
            this.eventManager.unregisterConsumer(this);
        }
        this.pendingPromise = null;
        this.cleanUp();
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const _POLL_WINDOW_CLOSE_TIMEOUT = new Delay(2000, 10000);
/**
 * Authenticates a Firebase client using a popup-based OAuth authentication flow.
 *
 * @remarks
 * If succeeds, returns the signed in user along with the provider's credential. If sign in was
 * unsuccessful, returns an error object containing additional information about the error.
 *
 * @example
 * ```javascript
 * // Sign in using a popup.
 * const provider = new FacebookAuthProvider();
 * const result = await signInWithPopup(auth, provider);
 *
 * // The signed-in user info.
 * const user = result.user;
 * // This gives you a Facebook Access Token.
 * const credential = provider.credentialFromResult(auth, result);
 * const token = credential.accessToken;
 * ```
 *
 * @param auth - The {@link Auth} instance.
 * @param provider - The provider to authenticate. The provider has to be an {@link OAuthProvider}.
 * Non-OAuth providers like {@link EmailAuthProvider} will throw an error.
 * @param resolver - An instance of {@link PopupRedirectResolver}, optional
 * if already supplied to {@link initializeAuth} or provided by {@link getAuth}.
 *
 *
 * @public
 */
async function signInWithPopup(auth, provider, resolver) {
    const authInternal = _castAuth(auth);
    _assertInstanceOf(auth, provider, FederatedAuthProvider);
    const resolverInternal = _withDefaultResolver(authInternal, resolver);
    const action = new PopupOperation(authInternal, "signInViaPopup" /* SIGN_IN_VIA_POPUP */, provider, resolverInternal);
    return action.executeNotNull();
}
/**
 * Popup event manager. Handles the popup's entire lifecycle; listens to auth
 * events
 *
 */
class PopupOperation extends AbstractPopupRedirectOperation {
    constructor(auth, filter, provider, resolver, user) {
        super(auth, filter, resolver, user);
        this.provider = provider;
        this.authWindow = null;
        this.pollId = null;
        if (PopupOperation.currentPopupAction) {
            PopupOperation.currentPopupAction.cancel();
        }
        PopupOperation.currentPopupAction = this;
    }
    async executeNotNull() {
        const result = await this.execute();
        _assert(result, this.auth, "internal-error" /* INTERNAL_ERROR */);
        return result;
    }
    async onExecution() {
        debugAssert(this.filter.length === 1, 'Popup operations only handle one event');
        const eventId = _generateEventId();
        this.authWindow = await this.resolver._openPopup(this.auth, this.provider, this.filter[0], // There's always one, see constructor
        eventId);
        this.authWindow.associatedEvent = eventId;
        // Check for web storage support and origin validation _after_ the popup is
        // loaded. These operations are slow (~1 second or so) Rather than
        // waiting on them before opening the window, optimistically open the popup
        // and check for storage support at the same time. If storage support is
        // not available, this will cause the whole thing to reject properly. It
        // will also close the popup, but since the promise has already rejected,
        // the popup closed by user poll will reject into the void.
        this.resolver._originValidation(this.auth).catch(e => {
            this.reject(e);
        });
        this.resolver._isIframeWebStorageSupported(this.auth, isSupported => {
            if (!isSupported) {
                this.reject(_createError(this.auth, "web-storage-unsupported" /* WEB_STORAGE_UNSUPPORTED */));
            }
        });
        // Handle user closure. Notice this does *not* use await
        this.pollUserCancellation();
    }
    get eventId() {
        var _a;
        return ((_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.associatedEvent) || null;
    }
    cancel() {
        this.reject(_createError(this.auth, "cancelled-popup-request" /* EXPIRED_POPUP_REQUEST */));
    }
    cleanUp() {
        if (this.authWindow) {
            this.authWindow.close();
        }
        if (this.pollId) {
            window.clearTimeout(this.pollId);
        }
        this.authWindow = null;
        this.pollId = null;
        PopupOperation.currentPopupAction = null;
    }
    pollUserCancellation() {
        const poll = () => {
            var _a, _b;
            if ((_b = (_a = this.authWindow) === null || _a === void 0 ? void 0 : _a.window) === null || _b === void 0 ? void 0 : _b.closed) {
                // Make sure that there is sufficient time for whatever action to
                // complete. The window could have closed but the sign in network
                // call could still be in flight.
                this.pollId = window.setTimeout(() => {
                    this.pollId = null;
                    this.reject(_createError(this.auth, "popup-closed-by-user" /* POPUP_CLOSED_BY_USER */));
                }, 2000 /* AUTH_EVENT */);
                return;
            }
            this.pollId = window.setTimeout(poll, _POLL_WINDOW_CLOSE_TIMEOUT.get());
        };
        poll();
    }
}
// Only one popup is ever shown at once. The lifecycle of the current popup
// can be managed / cancelled by the constructor.
PopupOperation.currentPopupAction = null;

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const PENDING_REDIRECT_KEY = 'pendingRedirect';
// We only get one redirect outcome for any one auth, so just store it
// in here.
const redirectOutcomeMap = new Map();
class RedirectAction extends AbstractPopupRedirectOperation {
    constructor(auth, resolver, bypassAuthState = false) {
        super(auth, [
            "signInViaRedirect" /* SIGN_IN_VIA_REDIRECT */,
            "linkViaRedirect" /* LINK_VIA_REDIRECT */,
            "reauthViaRedirect" /* REAUTH_VIA_REDIRECT */,
            "unknown" /* UNKNOWN */
        ], resolver, undefined, bypassAuthState);
        this.eventId = null;
    }
    /**
     * Override the execute function; if we already have a redirect result, then
     * just return it.
     */
    async execute() {
        let readyOutcome = redirectOutcomeMap.get(this.auth._key());
        if (!readyOutcome) {
            try {
                const hasPendingRedirect = await _getAndClearPendingRedirectStatus(this.resolver, this.auth);
                const result = hasPendingRedirect ? await super.execute() : null;
                readyOutcome = () => Promise.resolve(result);
            }
            catch (e) {
                readyOutcome = () => Promise.reject(e);
            }
            redirectOutcomeMap.set(this.auth._key(), readyOutcome);
        }
        // If we're not bypassing auth state, the ready outcome should be set to
        // null.
        if (!this.bypassAuthState) {
            redirectOutcomeMap.set(this.auth._key(), () => Promise.resolve(null));
        }
        return readyOutcome();
    }
    async onAuthEvent(event) {
        if (event.type === "signInViaRedirect" /* SIGN_IN_VIA_REDIRECT */) {
            return super.onAuthEvent(event);
        }
        else if (event.type === "unknown" /* UNKNOWN */) {
            // This is a sentinel value indicating there's no pending redirect
            this.resolve(null);
            return;
        }
        if (event.eventId) {
            const user = await this.auth._redirectUserForId(event.eventId);
            if (user) {
                this.user = user;
                return super.onAuthEvent(event);
            }
            else {
                this.resolve(null);
            }
        }
    }
    async onExecution() { }
    cleanUp() { }
}
async function _getAndClearPendingRedirectStatus(resolver, auth) {
    const key = pendingRedirectKey(auth);
    const persistence = resolverPersistence(resolver);
    if (!(await persistence._isAvailable())) {
        return false;
    }
    const hasPendingRedirect = (await persistence._get(key)) === 'true';
    await persistence._remove(key);
    return hasPendingRedirect;
}
function _overrideRedirectResult(auth, result) {
    redirectOutcomeMap.set(auth._key(), result);
}
function resolverPersistence(resolver) {
    return _getInstance(resolver._redirectPersistence);
}
function pendingRedirectKey(auth) {
    return _persistenceKeyName(PENDING_REDIRECT_KEY, auth.config.apiKey, auth.name);
}
async function _getRedirectResult(auth, resolverExtern, bypassAuthState = false) {
    const authInternal = _castAuth(auth);
    const resolver = _withDefaultResolver(authInternal, resolverExtern);
    const action = new RedirectAction(authInternal, resolver, bypassAuthState);
    const result = await action.execute();
    if (result && !bypassAuthState) {
        delete result.user._redirectEventId;
        await authInternal._persistUserIfCurrent(result.user);
        await authInternal._setRedirectUser(null, resolverExtern);
    }
    return result;
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// The amount of time to store the UIDs of seen events; this is
// set to 10 min by default
const EVENT_DUPLICATION_CACHE_DURATION_MS = 10 * 60 * 1000;
class AuthEventManager {
    constructor(auth) {
        this.auth = auth;
        this.cachedEventUids = new Set();
        this.consumers = new Set();
        this.queuedRedirectEvent = null;
        this.hasHandledPotentialRedirect = false;
        this.lastProcessedEventTime = Date.now();
    }
    registerConsumer(authEventConsumer) {
        this.consumers.add(authEventConsumer);
        if (this.queuedRedirectEvent &&
            this.isEventForConsumer(this.queuedRedirectEvent, authEventConsumer)) {
            this.sendToConsumer(this.queuedRedirectEvent, authEventConsumer);
            this.saveEventToCache(this.queuedRedirectEvent);
            this.queuedRedirectEvent = null;
        }
    }
    unregisterConsumer(authEventConsumer) {
        this.consumers.delete(authEventConsumer);
    }
    onEvent(event) {
        // Check if the event has already been handled
        if (this.hasEventBeenHandled(event)) {
            return false;
        }
        let handled = false;
        this.consumers.forEach(consumer => {
            if (this.isEventForConsumer(event, consumer)) {
                handled = true;
                this.sendToConsumer(event, consumer);
                this.saveEventToCache(event);
            }
        });
        if (this.hasHandledPotentialRedirect || !isRedirectEvent(event)) {
            // If we've already seen a redirect before, or this is a popup event,
            // bail now
            return handled;
        }
        this.hasHandledPotentialRedirect = true;
        // If the redirect wasn't handled, hang on to it
        if (!handled) {
            this.queuedRedirectEvent = event;
            handled = true;
        }
        return handled;
    }
    sendToConsumer(event, consumer) {
        var _a;
        if (event.error && !isNullRedirectEvent(event)) {
            const code = ((_a = event.error.code) === null || _a === void 0 ? void 0 : _a.split('auth/')[1]) ||
                "internal-error" /* INTERNAL_ERROR */;
            consumer.onError(_createError(this.auth, code));
        }
        else {
            consumer.onAuthEvent(event);
        }
    }
    isEventForConsumer(event, consumer) {
        const eventIdMatches = consumer.eventId === null ||
            (!!event.eventId && event.eventId === consumer.eventId);
        return consumer.filter.includes(event.type) && eventIdMatches;
    }
    hasEventBeenHandled(event) {
        if (Date.now() - this.lastProcessedEventTime >=
            EVENT_DUPLICATION_CACHE_DURATION_MS) {
            this.cachedEventUids.clear();
        }
        return this.cachedEventUids.has(eventUid(event));
    }
    saveEventToCache(event) {
        this.cachedEventUids.add(eventUid(event));
        this.lastProcessedEventTime = Date.now();
    }
}
function eventUid(e) {
    return [e.type, e.eventId, e.sessionId, e.tenantId].filter(v => v).join('-');
}
function isNullRedirectEvent({ type, error }) {
    return (type === "unknown" /* UNKNOWN */ &&
        (error === null || error === void 0 ? void 0 : error.code) === `auth/${"no-auth-event" /* NO_AUTH_EVENT */}`);
}
function isRedirectEvent(event) {
    switch (event.type) {
        case "signInViaRedirect" /* SIGN_IN_VIA_REDIRECT */:
        case "linkViaRedirect" /* LINK_VIA_REDIRECT */:
        case "reauthViaRedirect" /* REAUTH_VIA_REDIRECT */:
            return true;
        case "unknown" /* UNKNOWN */:
            return isNullRedirectEvent(event);
        default:
            return false;
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function _getProjectConfig(auth, request = {}) {
    return _performApiRequest(auth, "GET" /* GET */, "/v1/projects" /* GET_PROJECT_CONFIG */, request);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const IP_ADDRESS_REGEX = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
const HTTP_REGEX = /^https?/;
async function _validateOrigin(auth) {
    // Skip origin validation if we are in an emulated environment
    if (auth.config.emulator) {
        return;
    }
    const { authorizedDomains } = await _getProjectConfig(auth);
    for (const domain of authorizedDomains) {
        try {
            if (matchDomain(domain)) {
                return;
            }
        }
        catch (_a) {
            // Do nothing if there's a URL error; just continue searching
        }
    }
    // In the old SDK, this error also provides helpful messages.
    _fail(auth, "unauthorized-domain" /* INVALID_ORIGIN */);
}
function matchDomain(expected) {
    const currentUrl = _getCurrentUrl();
    const { protocol, hostname } = new URL(currentUrl);
    if (expected.startsWith('chrome-extension://')) {
        const ceUrl = new URL(expected);
        if (ceUrl.hostname === '' && hostname === '') {
            // For some reason we're not parsing chrome URLs properly
            return (protocol === 'chrome-extension:' &&
                expected.replace('chrome-extension://', '') ===
                    currentUrl.replace('chrome-extension://', ''));
        }
        return protocol === 'chrome-extension:' && ceUrl.hostname === hostname;
    }
    if (!HTTP_REGEX.test(protocol)) {
        return false;
    }
    if (IP_ADDRESS_REGEX.test(expected)) {
        // The domain has to be exactly equal to the pattern, as an IP domain will
        // only contain the IP, no extra character.
        return hostname === expected;
    }
    // Dots in pattern should be escaped.
    const escapedDomainPattern = expected.replace(/\./g, '\\.');
    // Non ip address domains.
    // domain.com = *.domain.com OR domain.com
    const re = new RegExp('^(.+\\.' + escapedDomainPattern + '|' + escapedDomainPattern + ')$', 'i');
    return re.test(hostname);
}

/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const NETWORK_TIMEOUT = new Delay(30000, 60000);
/**
 * Reset unlaoded GApi modules. If gapi.load fails due to a network error,
 * it will stop working after a retrial. This is a hack to fix this issue.
 */
function resetUnloadedGapiModules() {
    // Clear last failed gapi.load state to force next gapi.load to first
    // load the failed gapi.iframes module.
    // Get gapix.beacon context.
    const beacon = _window().___jsl;
    // Get current hint.
    if (beacon === null || beacon === void 0 ? void 0 : beacon.H) {
        // Get gapi hint.
        for (const hint of Object.keys(beacon.H)) {
            // Requested modules.
            beacon.H[hint].r = beacon.H[hint].r || [];
            // Loaded modules.
            beacon.H[hint].L = beacon.H[hint].L || [];
            // Set requested modules to a copy of the loaded modules.
            beacon.H[hint].r = [...beacon.H[hint].L];
            // Clear pending callbacks.
            if (beacon.CP) {
                for (let i = 0; i < beacon.CP.length; i++) {
                    // Remove all failed pending callbacks.
                    beacon.CP[i] = null;
                }
            }
        }
    }
}
function loadGapi(auth) {
    return new Promise((resolve, reject) => {
        var _a, _b, _c;
        // Function to run when gapi.load is ready.
        function loadGapiIframe() {
            // The developer may have tried to previously run gapi.load and failed.
            // Run this to fix that.
            resetUnloadedGapiModules();
            gapi.load('gapi.iframes', {
                callback: () => {
                    resolve(gapi.iframes.getContext());
                },
                ontimeout: () => {
                    // The above reset may be sufficient, but having this reset after
                    // failure ensures that if the developer calls gapi.load after the
                    // connection is re-established and before another attempt to embed
                    // the iframe, it would work and would not be broken because of our
                    // failed attempt.
                    // Timeout when gapi.iframes.Iframe not loaded.
                    resetUnloadedGapiModules();
                    reject(_createError(auth, "network-request-failed" /* NETWORK_REQUEST_FAILED */));
                },
                timeout: NETWORK_TIMEOUT.get()
            });
        }
        if ((_b = (_a = _window().gapi) === null || _a === void 0 ? void 0 : _a.iframes) === null || _b === void 0 ? void 0 : _b.Iframe) {
            // If gapi.iframes.Iframe available, resolve.
            resolve(gapi.iframes.getContext());
        }
        else if (!!((_c = _window().gapi) === null || _c === void 0 ? void 0 : _c.load)) {
            // Gapi loader ready, load gapi.iframes.
            loadGapiIframe();
        }
        else {
            // Create a new iframe callback when this is called so as not to overwrite
            // any previous defined callback. This happens if this method is called
            // multiple times in parallel and could result in the later callback
            // overwriting the previous one. This would end up with a iframe
            // timeout.
            const cbName = _generateCallbackName('iframefcb');
            // GApi loader not available, dynamically load platform.js.
            _window()[cbName] = () => {
                // GApi loader should be ready.
                if (!!gapi.load) {
                    loadGapiIframe();
                }
                else {
                    // Gapi loader failed, throw error.
                    reject(_createError(auth, "network-request-failed" /* NETWORK_REQUEST_FAILED */));
                }
            };
            // Load GApi loader.
            return _loadJS(`https://apis.google.com/js/api.js?onload=${cbName}`).catch(e => reject(e));
        }
    }).catch(error => {
        // Reset cached promise to allow for retrial.
        cachedGApiLoader = null;
        throw error;
    });
}
let cachedGApiLoader = null;
function _loadGapi(auth) {
    cachedGApiLoader = cachedGApiLoader || loadGapi(auth);
    return cachedGApiLoader;
}

/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const PING_TIMEOUT = new Delay(5000, 15000);
const IFRAME_PATH = '__/auth/iframe';
const EMULATED_IFRAME_PATH = 'emulator/auth/iframe';
const IFRAME_ATTRIBUTES = {
    style: {
        position: 'absolute',
        top: '-100px',
        width: '1px',
        height: '1px'
    },
    'aria-hidden': 'true',
    tabindex: '-1'
};
// Map from apiHost to endpoint ID for passing into iframe. In current SDK, apiHost can be set to
// anything (not from a list of endpoints with IDs as in legacy), so this is the closest we can get.
const EID_FROM_APIHOST = new Map([
    ["identitytoolkit.googleapis.com" /* API_HOST */, 'p'],
    ['staging-identitytoolkit.sandbox.googleapis.com', 's'],
    ['test-identitytoolkit.sandbox.googleapis.com', 't'] // test
]);
function getIframeUrl(auth) {
    const config = auth.config;
    _assert(config.authDomain, auth, "auth-domain-config-required" /* MISSING_AUTH_DOMAIN */);
    const url = config.emulator
        ? _emulatorUrl(config, EMULATED_IFRAME_PATH)
        : `https://${auth.config.authDomain}/${IFRAME_PATH}`;
    const params = {
        apiKey: config.apiKey,
        appName: auth.name,
        v: SDK_VERSION
    };
    const eid = EID_FROM_APIHOST.get(auth.config.apiHost);
    if (eid) {
        params.eid = eid;
    }
    const frameworks = auth._getFrameworks();
    if (frameworks.length) {
        params.fw = frameworks.join(',');
    }
    return `${url}?${querystring(params).slice(1)}`;
}
async function _openIframe(auth) {
    const context = await _loadGapi(auth);
    const gapi = _window().gapi;
    _assert(gapi, auth, "internal-error" /* INTERNAL_ERROR */);
    return context.open({
        where: document.body,
        url: getIframeUrl(auth),
        messageHandlersFilter: gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER,
        attributes: IFRAME_ATTRIBUTES,
        dontclear: true
    }, (iframe) => new Promise(async (resolve, reject) => {
        await iframe.restyle({
            // Prevent iframe from closing on mouse out.
            setHideOnLeave: false
        });
        const networkError = _createError(auth, "network-request-failed" /* NETWORK_REQUEST_FAILED */);
        // Confirm iframe is correctly loaded.
        // To fallback on failure, set a timeout.
        const networkErrorTimer = _window().setTimeout(() => {
            reject(networkError);
        }, PING_TIMEOUT.get());
        // Clear timer and resolve pending iframe ready promise.
        function clearTimerAndResolve() {
            _window().clearTimeout(networkErrorTimer);
            resolve(iframe);
        }
        // This returns an IThenable. However the reject part does not call
        // when the iframe is not loaded.
        iframe.ping(clearTimerAndResolve).then(clearTimerAndResolve, () => {
            reject(networkError);
        });
    }));
}

/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const BASE_POPUP_OPTIONS = {
    location: 'yes',
    resizable: 'yes',
    statusbar: 'yes',
    toolbar: 'no'
};
const DEFAULT_WIDTH = 500;
const DEFAULT_HEIGHT = 600;
const TARGET_BLANK = '_blank';
const FIREFOX_EMPTY_URL = 'http://localhost';
class AuthPopup {
    constructor(window) {
        this.window = window;
        this.associatedEvent = null;
    }
    close() {
        if (this.window) {
            try {
                this.window.close();
            }
            catch (e) { }
        }
    }
}
function _open(auth, url, name, width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
    const top = Math.max((window.screen.availHeight - height) / 2, 0).toString();
    const left = Math.max((window.screen.availWidth - width) / 2, 0).toString();
    let target = '';
    const options = Object.assign(Object.assign({}, BASE_POPUP_OPTIONS), { width: width.toString(), height: height.toString(), top,
        left });
    // Chrome iOS 7 and 8 is returning an undefined popup win when target is
    // specified, even though the popup is not necessarily blocked.
    const ua = getUA().toLowerCase();
    if (name) {
        target = _isChromeIOS(ua) ? TARGET_BLANK : name;
    }
    if (_isFirefox(ua)) {
        // Firefox complains when invalid URLs are popped out. Hacky way to bypass.
        url = url || FIREFOX_EMPTY_URL;
        // Firefox disables by default scrolling on popup windows, which can create
        // issues when the user has many Google accounts, for instance.
        options.scrollbars = 'yes';
    }
    const optionsString = Object.entries(options).reduce((accum, [key, value]) => `${accum}${key}=${value},`, '');
    if (_isIOSStandalone(ua) && target !== '_self') {
        openAsNewWindowIOS(url || '', target);
        return new AuthPopup(null);
    }
    // about:blank getting sanitized causing browsers like IE/Edge to display
    // brief error message before redirecting to handler.
    const newWin = window.open(url || '', target, optionsString);
    _assert(newWin, auth, "popup-blocked" /* POPUP_BLOCKED */);
    // Flaky on IE edge, encapsulate with a try and catch.
    try {
        newWin.focus();
    }
    catch (e) { }
    return new AuthPopup(newWin);
}
function openAsNewWindowIOS(url, target) {
    const el = document.createElement('a');
    el.href = url;
    el.target = target;
    const click = document.createEvent('MouseEvent');
    click.initMouseEvent('click', true, true, window, 1, 0, 0, 0, 0, false, false, false, false, 1, null);
    el.dispatchEvent(click);
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * URL for Authentication widget which will initiate the OAuth handshake
 *
 * @internal
 */
const WIDGET_PATH = '__/auth/handler';
/**
 * URL for emulated environment
 *
 * @internal
 */
const EMULATOR_WIDGET_PATH = 'emulator/auth/handler';
function _getRedirectUrl(auth, provider, authType, redirectUrl, eventId, additionalParams) {
    _assert(auth.config.authDomain, auth, "auth-domain-config-required" /* MISSING_AUTH_DOMAIN */);
    _assert(auth.config.apiKey, auth, "invalid-api-key" /* INVALID_API_KEY */);
    const params = {
        apiKey: auth.config.apiKey,
        appName: auth.name,
        authType,
        redirectUrl,
        v: SDK_VERSION,
        eventId
    };
    if (provider instanceof FederatedAuthProvider) {
        provider.setDefaultLanguage(auth.languageCode);
        params.providerId = provider.providerId || '';
        if (!isEmpty(provider.getCustomParameters())) {
            params.customParameters = JSON.stringify(provider.getCustomParameters());
        }
        // TODO set additionalParams from the provider as well?
        for (const [key, value] of Object.entries(additionalParams || {})) {
            params[key] = value;
        }
    }
    if (provider instanceof BaseOAuthProvider) {
        const scopes = provider.getScopes().filter(scope => scope !== '');
        if (scopes.length > 0) {
            params.scopes = scopes.join(',');
        }
    }
    if (auth.tenantId) {
        params.tid = auth.tenantId;
    }
    // TODO: maybe set eid as endipointId
    // TODO: maybe set fw as Frameworks.join(",")
    const paramsDict = params;
    for (const key of Object.keys(paramsDict)) {
        if (paramsDict[key] === undefined) {
            delete paramsDict[key];
        }
    }
    return `${getHandlerBase(auth)}?${querystring(paramsDict).slice(1)}`;
}
function getHandlerBase({ config }) {
    if (!config.emulator) {
        return `https://${config.authDomain}/${WIDGET_PATH}`;
    }
    return _emulatorUrl(config, EMULATOR_WIDGET_PATH);
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The special web storage event
 *
 */
const WEB_STORAGE_SUPPORT_KEY = 'webStorageSupport';
class BrowserPopupRedirectResolver {
    constructor() {
        this.eventManagers = {};
        this.iframes = {};
        this.originValidationPromises = {};
        this._redirectPersistence = browserSessionPersistence;
        this._completeRedirectFn = _getRedirectResult;
        this._overrideRedirectResult = _overrideRedirectResult;
    }
    // Wrapping in async even though we don't await anywhere in order
    // to make sure errors are raised as promise rejections
    async _openPopup(auth, provider, authType, eventId) {
        var _a;
        debugAssert((_a = this.eventManagers[auth._key()]) === null || _a === void 0 ? void 0 : _a.manager, '_initialize() not called before _openPopup()');
        const url = _getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId);
        return _open(auth, url, _generateEventId());
    }
    async _openRedirect(auth, provider, authType, eventId) {
        await this._originValidation(auth);
        _setWindowLocation(_getRedirectUrl(auth, provider, authType, _getCurrentUrl(), eventId));
        return new Promise(() => { });
    }
    _initialize(auth) {
        const key = auth._key();
        if (this.eventManagers[key]) {
            const { manager, promise } = this.eventManagers[key];
            if (manager) {
                return Promise.resolve(manager);
            }
            else {
                debugAssert(promise, 'If manager is not set, promise should be');
                return promise;
            }
        }
        const promise = this.initAndGetManager(auth);
        this.eventManagers[key] = { promise };
        // If the promise is rejected, the key should be removed so that the
        // operation can be retried later.
        promise.catch(() => {
            delete this.eventManagers[key];
        });
        return promise;
    }
    async initAndGetManager(auth) {
        const iframe = await _openIframe(auth);
        const manager = new AuthEventManager(auth);
        iframe.register('authEvent', (iframeEvent) => {
            _assert(iframeEvent === null || iframeEvent === void 0 ? void 0 : iframeEvent.authEvent, auth, "invalid-auth-event" /* INVALID_AUTH_EVENT */);
            // TODO: Consider splitting redirect and popup events earlier on
            const handled = manager.onEvent(iframeEvent.authEvent);
            return { status: handled ? "ACK" /* ACK */ : "ERROR" /* ERROR */ };
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
        this.eventManagers[auth._key()] = { manager };
        this.iframes[auth._key()] = iframe;
        return manager;
    }
    _isIframeWebStorageSupported(auth, cb) {
        const iframe = this.iframes[auth._key()];
        iframe.send(WEB_STORAGE_SUPPORT_KEY, { type: WEB_STORAGE_SUPPORT_KEY }, result => {
            var _a;
            const isSupported = (_a = result === null || result === void 0 ? void 0 : result[0]) === null || _a === void 0 ? void 0 : _a[WEB_STORAGE_SUPPORT_KEY];
            if (isSupported !== undefined) {
                cb(!!isSupported);
            }
            _fail(auth, "internal-error" /* INTERNAL_ERROR */);
        }, gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER);
    }
    _originValidation(auth) {
        const key = auth._key();
        if (!this.originValidationPromises[key]) {
            this.originValidationPromises[key] = _validateOrigin(auth);
        }
        return this.originValidationPromises[key];
    }
    get _shouldInitProactively() {
        // Mobile browsers and Safari need to optimistically initialize
        return _isMobileBrowser() || _isSafari() || _isIOS();
    }
}
/**
 * An implementation of {@link PopupRedirectResolver} suitable for browser
 * based applications.
 *
 * @public
 */
const browserPopupRedirectResolver = BrowserPopupRedirectResolver;

var name = "@firebase/auth";
var version = "0.20.3";

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class AuthInterop {
    constructor(auth) {
        this.auth = auth;
        this.internalListeners = new Map();
    }
    getUid() {
        var _a;
        this.assertAuthConfigured();
        return ((_a = this.auth.currentUser) === null || _a === void 0 ? void 0 : _a.uid) || null;
    }
    async getToken(forceRefresh) {
        this.assertAuthConfigured();
        await this.auth._initializationPromise;
        if (!this.auth.currentUser) {
            return null;
        }
        const accessToken = await this.auth.currentUser.getIdToken(forceRefresh);
        return { accessToken };
    }
    addAuthTokenListener(listener) {
        this.assertAuthConfigured();
        if (this.internalListeners.has(listener)) {
            return;
        }
        const unsubscribe = this.auth.onIdTokenChanged(user => {
            var _a;
            listener(((_a = user) === null || _a === void 0 ? void 0 : _a.stsTokenManager.accessToken) || null);
        });
        this.internalListeners.set(listener, unsubscribe);
        this.updateProactiveRefresh();
    }
    removeAuthTokenListener(listener) {
        this.assertAuthConfigured();
        const unsubscribe = this.internalListeners.get(listener);
        if (!unsubscribe) {
            return;
        }
        this.internalListeners.delete(listener);
        unsubscribe();
        this.updateProactiveRefresh();
    }
    assertAuthConfigured() {
        _assert(this.auth._initializationPromise, "dependent-sdk-initialized-before-auth" /* DEPENDENT_SDK_INIT_BEFORE_AUTH */);
    }
    updateProactiveRefresh() {
        if (this.internalListeners.size > 0) {
            this.auth._startProactiveRefresh();
        }
        else {
            this.auth._stopProactiveRefresh();
        }
    }
}

/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function getVersionForPlatform(clientPlatform) {
    switch (clientPlatform) {
        case "Node" /* NODE */:
            return 'node';
        case "ReactNative" /* REACT_NATIVE */:
            return 'rn';
        case "Worker" /* WORKER */:
            return 'webworker';
        case "Cordova" /* CORDOVA */:
            return 'cordova';
        default:
            return undefined;
    }
}
/** @internal */
function registerAuth(clientPlatform) {
    _registerComponent(new Component("auth" /* AUTH */, (container, { options: deps }) => {
        const app = container.getProvider('app').getImmediate();
        const heartbeatServiceProvider = container.getProvider('heartbeat');
        const { apiKey, authDomain } = app.options;
        return ((app, heartbeatServiceProvider) => {
            _assert(apiKey && !apiKey.includes(':'), "invalid-api-key" /* INVALID_API_KEY */, { appName: app.name });
            // Auth domain is optional if IdP sign in isn't being used
            _assert(!(authDomain === null || authDomain === void 0 ? void 0 : authDomain.includes(':')), "argument-error" /* ARGUMENT_ERROR */, {
                appName: app.name
            });
            const config = {
                apiKey,
                authDomain,
                clientPlatform,
                apiHost: "identitytoolkit.googleapis.com" /* API_HOST */,
                tokenApiHost: "securetoken.googleapis.com" /* TOKEN_API_HOST */,
                apiScheme: "https" /* API_SCHEME */,
                sdkClientVersion: _getClientVersion(clientPlatform)
            };
            const authInstance = new AuthImpl(app, heartbeatServiceProvider, config);
            _initializeAuthInstance(authInstance, deps);
            return authInstance;
        })(app, heartbeatServiceProvider);
    }, "PUBLIC" /* PUBLIC */)
        /**
         * Auth can only be initialized by explicitly calling getAuth() or initializeAuth()
         * For why we do this, See go/firebase-next-auth-init
         */
        .setInstantiationMode("EXPLICIT" /* EXPLICIT */)
        /**
         * Because all firebase products that depend on auth depend on auth-internal directly,
         * we need to initialize auth-internal after auth is initialized to make it available to other firebase products.
         */
        .setInstanceCreatedCallback((container, _instanceIdentifier, _instance) => {
        const authInternalProvider = container.getProvider("auth-internal" /* AUTH_INTERNAL */);
        authInternalProvider.initialize();
    }));
    _registerComponent(new Component("auth-internal" /* AUTH_INTERNAL */, container => {
        const auth = _castAuth(container.getProvider("auth" /* AUTH */).getImmediate());
        return (auth => new AuthInterop(auth))(auth);
    }, "PRIVATE" /* PRIVATE */).setInstantiationMode("EXPLICIT" /* EXPLICIT */));
    registerVersion(name, version, getVersionForPlatform(clientPlatform));
    // BUILD_TARGET will be replaced by values like esm5, esm2017, cjs5, etc during the compilation
    registerVersion(name, version, 'esm2017');
}

/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Returns the Auth instance associated with the provided {@link @firebase/app#FirebaseApp}.
 * If no instance exists, initializes an Auth instance with platform-specific default dependencies.
 *
 * @param app - The Firebase App.
 *
 * @public
 */
function getAuth(app = getApp()) {
    const provider = _getProvider(app, 'auth');
    if (provider.isInitialized()) {
        return provider.getImmediate();
    }
    return initializeAuth(app, {
        popupRedirectResolver: browserPopupRedirectResolver,
        persistence: [
            indexedDBLocalPersistence,
            browserLocalPersistence,
            browserSessionPersistence
        ]
    });
}
registerAuth("Browser" /* BROWSER */);

export { GoogleAuthProvider, deleteUser, getAuth, signInAnonymously, signInWithPopup, signOut };
