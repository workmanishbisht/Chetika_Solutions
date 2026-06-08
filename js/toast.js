(function () {
    'use strict';

    let _toast = null;
    let _msgEl = null;
    let _timer = null;

    function getToast() {
        if (!_toast) {
            _toast = document.getElementById('contToast');
            _msgEl = _toast?.querySelector('.toast-message');
        }
        return _toast;
    }

    window.showToast = function (msg, isError) {
        const toast = getToast();
        if (!toast) return;

        if (_msgEl && msg) _msgEl.textContent = msg;

        toast.classList.remove('toast-error', 'toast-success');
        if (isError) {
            toast.classList.add('toast-error');
        } else {
            toast.classList.add('toast-success');
        }

        toast.classList.remove('show', 'hide');
        void toast.offsetWidth;
        toast.classList.add('show');

        clearTimeout(_timer);
        _timer = setTimeout(function () {
            window.hideToast();
        }, 6000);
    };

    window.hideToast = function () {
        const toast = getToast();
        if (!toast) return;
        clearTimeout(_timer);
        toast.classList.remove('show');
        toast.classList.add('hide');
    };

    document.addEventListener('DOMContentLoaded', function () {
        const btn = document.getElementById('toastClose');
        if (btn) btn.addEventListener('click', window.hideToast);

        const toast = document.getElementById('contToast');
        if (toast) {
            toast.classList.remove('show');
            toast.classList.add('hide');
        }
    });

})();