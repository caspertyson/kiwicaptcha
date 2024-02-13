# KiwiCAPTCHA

## Introduction
**KiwiCAPTCHA** offers a refreshing approach to CAPTCHA systems, focusing on custom kiwi-centric 
questions. Aimed at New Zealand website developers, it provides an engaging alternative to Google's 
reCAPTCHA, leveraging Google Functions for backend development. KiwiCAPTCHA's unique approach is 
designed to fool the majority of bots, enhancing your website's security and user engagement with 
animations and custom kiwi questions.

## Features

- **Kiwi-centric Questions**: Engage your users with questions that reflect New Zealand's culture.
- **Advanced Bot Protection**: By deviating from the widely used reCAPTCHA, KiwiCAPTCHA presents a 
challenge that most bots aren't programmed to solve.
- **Google Functions**: Utilizes the robust and scalable infrastructure of Google Functions for 
backend operations.
- **Engaging Animations**: Enhances the user experience with delightful animations upon interaction.

## Quick Start

### 1. Include KiwiCAPTCHA Script

Embed the KiwiCAPTCHA script into your website:

```html
<script src="https://kiwicaptcha.web.app/captcha.min.js"></script>
```

### 2. Add the CAPTCHA Box

Place the CAPTCHA box in the desired location on your site:

```html
<div class="captcha-box"></div>
```

### 3. Configure Origin Check

Secure your CAPTCHA verification by ensuring it only communicates with your site:

```javascript
window.addEventListener('message', function(event) {
    if (event.origin !== "YOUR_SITE_ORIGIN") { // Replace with your actual site origin
        return;
    }
    if (event.data.type === 'CAPTCHA_VERIFIED' && event.data.verified) {
        // Implement your logic here, for example, enabling a submit button
    }
}, false);
```


## Benefits

- **Custom CAPTCHA**: Stand out with a CAPTCHA system that features custom kiwi-centric questions, 
significantly enhancing user engagement and providing a localized touch.
- **Advanced Bot Protection**: Leverage the unique nature of KiwiCAPTCHA to fool the majority of bots, 
which are typically programmed to target more common CAPTCHA systems like Google's reCAPTCHA.
- **Increased Engagement**: Show your users that you care about the details by integrating a CAPTCHA 
system that's both fun and relevant to the New Zealand audience.
- **Security Through Obscurity**: Take advantage of a less targeted CAPTCHA system, making it more 
likely to provide effective bot protection.

## Honey Potting Technique

KiwiCAPTCHA employs a clever technique to further enhance security against bots:

- A honeypot input element named "name" is created by `captcha.min.js` and hidden via CSS. This 
element is invisible to human users but can trap bots that attempt to fill out every form field.
- If this hidden field is filled, the submission is automatically flagged as coming from a bot, 
providing an additional layer of security.

## Session Management and Timing

- **Unique Session IDs**: Each CAPTCHA challenge is associated with a unique session ID, ensuring that 
responses can be accurately verified against the original question.
- **Timed Responses**: The system monitors the time taken to respond to the CAPTCHA, adding another 
layer of bot detection. Responses that come after a long delay will be rejected.

## Integration Process

KiwiCAPTCHA is designed to be easily integrated into any website with minimal effort. Follow the 
documentation for detailed instructions on embedding the CAPTCHA, configuring the origin check, and 
customizing the CAPTCHA challenge to fit the theme and security requirements of your site.


