// ==UserScript==
// @name         YouTube PiP Button
// @author       codecool123
// @namespace    http://tampermonkey.net/
// @version      1.0
// @icon         https://cdn.iconscout.com/icon/free/png-512/free-youtube-icon-svg-download-png-432560.png?f=webp&w=256
// @description  Adds a PiP button on youtube.com.
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  function createPiPButton(video) {
    const btn = document.createElement('button');
    btn.className = 'ytp-button ytp-pip-button-custom';

    // PiP SVG icon
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 36 36');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    const outer = document.createElementNS(svgNS, 'rect');
    outer.setAttribute('x', '7'); outer.setAttribute('y', '9');
    outer.setAttribute('width', '22'); outer.setAttribute('height', '18');
    outer.setAttribute('rx', '2'); outer.setAttribute('ry', '2');
    outer.setAttribute('fill', 'none'); outer.setAttribute('stroke', 'currentColor');
    outer.setAttribute('stroke-width', '2');

    const inner = document.createElementNS(svgNS, 'rect');
    inner.setAttribute('x', '18'); inner.setAttribute('y', '16');
    inner.setAttribute('width', '10'); inner.setAttribute('height', '7');
    inner.setAttribute('rx', '1.5'); inner.setAttribute('ry', '1.5');
    inner.setAttribute('fill', 'currentColor');

    svg.appendChild(outer);
    svg.appendChild(inner);
    btn.appendChild(svg);

    // PiP click functionality
    btn.addEventListener('click', async () => {
      try {
        if (document.pictureInPictureElement === video) {
          await document.exitPictureInPicture();
        } else {
          await video.requestPictureInPicture();
        }
      } catch(e) {
        console.error(e);
      }
    });

    return btn;
  }

  function injectPiP() {
    document.querySelectorAll('.ytp-right-controls').forEach(bar => {
      if (bar.querySelector('.ytp-pip-button-custom')) return;
      const settingsBtn = bar.querySelector('.ytp-settings-button');
      const video = bar.closest('.html5-video-player')?.querySelector('video');
      if (!settingsBtn || !video) return;
      const pipBtn = createPiPButton(video);
      settingsBtn.insertAdjacentElement('afterend', pipBtn);
    });
  }

  const observer = new MutationObserver(injectPiP);
  observer.observe(document.body, { childList: true, subtree: true });
  injectPiP();

})();
