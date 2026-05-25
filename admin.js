// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://cmfutlhzjziecydqmerz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZnV0bGh6anppZWN5ZHFtZXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzgyODUsImV4cCI6MjA5MTcxNDI4NX0.bvduJBSMS_qVqy-CxLBg_z-UlIIpAMkUFR5u5qdf1oI';
const TABLE_NAME = 'member';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const loginOverlay = document.getElementById('loginOverlay');
    const mainDashboard = document.getElementById('mainDashboard');
    const btnLogin = document.getElementById('btnLogin');
    const adminPassword = document.getElementById('adminPassword');
    const loginError = document.getElementById('loginError');

    // Simple client-side password protection
    const MASTER_PASSWORD = 'lovefirstadmin';

    btnLogin.addEventListener('click', () => {
        if (adminPassword.value === MASTER_PASSWORD) {
            // Password is correct: hide overlay, show dashboard, fetch data
            loginOverlay.style.display = 'none';
            mainDashboard.style.display = 'block';
            loadDashboardData();
        } else {
            // Password incorrect
            loginError.style.display = 'block';
            adminPassword.value = '';
            adminPassword.focus();
        }
    });

    // Allow pressing 'Enter' to submit password
    adminPassword.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnLogin.click();
        }
    });
});

async function loadDashboardData() {
    const loader = document.getElementById('loader');
    const errorState = document.getElementById('errorState');
    const table = document.getElementById('membersTable');
    const tableBody = document.getElementById('membersTableBody');

    try {
        // Fetch all members
        const { data, error } = await supabaseClient
            .from(TABLE_NAME)
            .select('*');

        if (error) throw error;

        loader.style.display = 'none';

        if (data.length === 0) {
            errorState.style.display = 'block';
            errorState.style.background = 'rgba(255, 255, 255, 0.05)';
            errorState.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            errorState.style.color = 'var(--text-muted)';
            errorState.innerHTML = 'No members found. The database is empty or the RLS policy is blocking SELECT queries.';
            return;
        }

        table.style.display = 'table';

        data.forEach(member => {
            const tr = document.createElement('tr');

            // Format date if it exists
            let dateStr = 'N/A';
            if (member.created_at) {
                const d = new Date(member.created_at);
                dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            }

            tr.innerHTML = `
                <td><span class="badge">${member.member_id || 'N/A'}</span></td>
                <td><strong>${member.first_name || ''} ${member.last_name || ''}</strong></td>
                <td style="text-transform: capitalize;">${member.gender || 'N/A'}</td>
                <td>${member.age || 'N/A'}</td>
                <td>${member.email || 'N/A'}</td>
                <td>${member.phone || 'N/A'}</td>
                <td>${member.city || ''}, ${member.country || ''}</td>
                <td style="color: var(--text-muted); font-size: 0.9em;">${dateStr}</td>
            `;
            tableBody.appendChild(tr);
        });

        // --- EMAILJS INTEGRATION LOGIC ---
        // Extract all valid emails from the database
        const allEmails = data
            .map(member => member.email)
            .filter(email => email && email.trim() !== '' && email.includes('@'));

        const btnComposeEmail = document.getElementById('btnComposeEmail');
        const emailModal = document.getElementById('emailModal');
        const btnCancelEmail = document.getElementById('btnCancelEmail');
        const emailForm = document.getElementById('emailForm');
        const emailStatus = document.getElementById('emailStatus');

        if (btnComposeEmail && emailModal) {
            btnComposeEmail.addEventListener('click', () => {
                if (allEmails.length === 0) {
                    alert('No valid email addresses found in the database.');
                    return;
                }
                emailModal.style.display = 'flex';
            });

            btnCancelEmail.addEventListener('click', () => {
                emailModal.style.display = 'none';
                emailForm.reset();
                emailStatus.style.display = 'none';
            });

            emailForm.addEventListener('submit', (e) => {
                e.preventDefault();

                const subject = document.getElementById('emailSubject').value;
                const message = document.getElementById('emailMessage').value;
                const btnSendEmail = document.getElementById('btnSendEmail');

                btnSendEmail.disabled = true;
                btnSendEmail.innerText = 'Sending...';
                emailStatus.style.display = 'none';

                // EmailJS API Call
                const serviceID = 'service_fn60di8';
                const templateID = 'template_fi3evaj';

                const templateParams = {
                    bcc_emails: allEmails.join(','),
                    subject: subject,
                    message: message
                };

                emailjs.send(serviceID, templateID, templateParams)
                    .then(() => {
                        btnSendEmail.disabled = false;
                        btnSendEmail.innerText = 'Send Email 🚀';
                        emailStatus.style.display = 'block';
                        emailStatus.style.backgroundColor = 'rgba(46, 204, 113, 0.2)';
                        emailStatus.style.color = '#2ecc71';
                        emailStatus.innerText = `Email sent successfully to ${allEmails.length} members!`;

                        setTimeout(() => {
                            emailModal.style.display = 'none';
                            emailForm.reset();
                            emailStatus.style.display = 'none';
                        }, 3000);
                    }, (error) => {
                        btnSendEmail.disabled = false;
                        btnSendEmail.innerText = 'Send Email 🚀';
                        emailStatus.style.display = 'block';
                        emailStatus.style.backgroundColor = 'rgba(231, 76, 60, 0.2)';
                        emailStatus.style.color = '#e74c3c';
                        emailStatus.innerText = 'Failed to send email. Check your EmailJS setup or console for errors.';
                        console.error('EmailJS Error:', error);
                    });
            });
        }


    } catch (error) {
        console.error('Error fetching members:', error);
        loader.style.display = 'none';
        errorState.style.display = 'block';
        errorState.innerHTML = `
            <strong>Error loading data:</strong> ${error.message}<br><br>
            <span style="font-size: 0.9em; color: var(--text-muted);">
            Note: If you receive an RLS error, you need to add a SELECT policy in Supabase for the 'member' table.
            </span>
        `;
    }
}
