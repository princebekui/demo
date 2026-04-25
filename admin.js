// --- SUPABASE CONFIGURATION ---
const SUPABASE_URL = 'https://cmfutlhzjziecydqmerz.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZnV0bGh6anppZWN5ZHFtZXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzgyODUsImV4cCI6MjA5MTcxNDI4NX0.bvduJBSMS_qVqy-CxLBg_z-UlIIpAMkUFR5u5qdf1oI';
const TABLE_NAME = 'member';

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('loader');
    const errorState = document.getElementById('errorState');
    const table = document.getElementById('membersTable');
    const tableBody = document.getElementById('membersTableBody');

    try {
        // Fetch all members, order by created_at descending
        const { data, error } = await supabaseClient
            .from(TABLE_NAME)
            .select('*')
            .order('created_at', { ascending: false });

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
});
