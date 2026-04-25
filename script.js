// --- SUPABASE CONFIGURATION ---
// These are the details you provided. 
// If your table is named differently in Supabase, change 'members' below!
const SUPABASE_URL = 'https://cmfutlhzjziecydqmerz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZnV0bGh6anppZWN5ZHFtZXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzgyODUsImV4cCI6MjA5MTcxNDI4NX0.bvduJBSMS_qVqy-CxLBg_z-UlIIpAMkUFR5u5qdf1oI';
const TABLE_NAME = 'member'; // Make sure this perfectly matches your Supabase table name

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('membershipForm');
    const submitBtn = document.getElementById('submitBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop normal form submission

        // Form Validation & Data Extraction
        const formData = new FormData(form);
        
        // Generate a unique member ID (e.g., LF-TIMESTAMP-RANDOM)
        const generateMemberId = () => {
            const prefix = 'LF'; // Love First
            const timestamp = Date.now().toString(36).toUpperCase();
            const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
            return `${prefix}-${timestamp}-${randomStr}`;
        };

        const data = {
            member_id: generateMemberId(),
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName'),
            gender: formData.get('gender'),
            age: parseInt(formData.get('age')),
            email: formData.get('email'),
            phone: formData.get('phone'),
            street: formData.get('street'),
            city: formData.get('city'),
            country: formData.get('country')
        };

        if (!data.gender) {
            showToast('Please select a gender.', 'error');
            return;
        }

        if (!data.country) {
            showToast('Please select a country.', 'error');
            return;
        }

        // --- SUBMITTING TO SUPABASE ---
        setLoadingState(true);

        try {
            const { error } = await supabaseClient
                .from(TABLE_NAME)
                .insert([data]);

            if (error) throw error;

            showToast('Registration successful!', 'success');

            // Hide the form and show the success message on screen
            form.style.display = 'none';

            // Get the header to hide it since the form is done
            const header = document.querySelector('.form-header');
            if (header) header.style.display = 'none';

            document.getElementById('successState').style.display = 'block';

            form.reset(); // Clear the form memory
        } catch (error) {
            console.error('Supabase Error:', error);
            showToast('Error registering: ' + error.message, 'error');
        } finally {
            setLoadingState(false);
        }
    });

    // Helper: Button Loading State
    function setLoadingState(isLoading) {
        if (isLoading) {
            submitBtn.disabled = true;
            btnText.textContent = 'Submitting...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
        } else {
            submitBtn.disabled = false;
            btnText.textContent = 'Submit Registration';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        }
    }

    // Helper: Toast Notifications
    function showToast(message, type = 'success') {
        toastMessage.textContent = message;
        toast.className = `toast show ${type}`; // Add 'show' and type

        // Hide error messages after 10 seconds, and success messages after 4 seconds
        const displayTime = type === 'error' ? 10000 : 4000;
        
        setTimeout(() => {
            toast.className = 'toast hidden';
        }, displayTime);
    }
});
