import './bootstrap';
import 'preline';

document.addEventListener('livewire:navigated', () => {
    window.HSStaticMethods.autoInit();
    const filterToggle = document.getElementById('filter-toggle');
    const filterSection = document.getElementById('filter-section');
    const body = document.body;

    filterToggle.addEventListener('click', function() {
        filterSection.classList.toggle('-translate-x-full');
        body.classList.toggle('overflow-hidden');
    });

    // Close filter section when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideFilter = filterSection.contains(event.target);
        const isClickOnToggle = filterToggle.contains(event.target);

        if (!isClickInsideFilter && !isClickOnToggle && !filterSection.classList.contains(
                '-translate-x-full')) {
            filterSection.classList.add('-translate-x-full');
            body.classList.remove('overflow-hidden');
        }
    });
    document.addEventListener('livewire:load', function () {
        const successMessage = document.getElementById('success-message');

        // Wait for 2 seconds
        setTimeout(() => {
            // Add opacity-0 class to fade out
            successMessage.classList.add('opacity-0');

            // Wait for transition to complete, then remove the element
            setTimeout(() => {
                successMessage.remove();
            }, 300); // This should match the duration in the Tailwind class
        }, 2000);
    });




})




