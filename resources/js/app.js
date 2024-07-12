import './bootstrap';
import 'preline';

document.addEventListener('livewire:navigated', () => {
    window.HSStaticMethods.autoInit(['carousel', 'dropdown']);

})


document.addEventListener('DOMContentLoaded', function () {
    setTimeout(function () {
        var successMessage = document.getElementById('success-message');
        if (successMessage) {
            successMessage.style.display = 'none';
        }
    }, 2000); // 5000 milliseconds = 5 seconds
});
