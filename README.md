Declarative Cookies
=================

Angular Cookies directive and filters.

**[Demo][]**

<h4>Installing</h4>

```
bower install rc-cookies
```

```javascript
angular('yourAngularApp',['rcCookies']);
```

<h4>Usage/Example Form</h4>

```html
<div data-ng-controller="mainCtrl as main">
    <form novalidate data-ng-submit="" 
          name="cookieForm" class="card-section cookie-form" 
          rc-cookie="consent" rc-cookie-fields="main.$cookieFields" rc-cookie-days="2"
    >
        <label>
            <input type="checkbox" data-ng-model="main.$cookieFields._ga" class="cookie-field" required>
            *Google Analitycs required
        </label>
        <label>
            <input type="checkbox" data-ng-model="main.$cookieFields._gtm" class="cookie-field">
            Google Tag Manager
        </label>
    
        <button type="submit" class="button cookie-button">Accept</button>
    </form>
</div>
```

[Demo]: http://redcastor.github.io/rc-cookies/