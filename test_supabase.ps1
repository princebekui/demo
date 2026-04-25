$url = "https://cmfutlhzjziecydqmerz.supabase.co/rest/v1/member"
$key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtZnV0bGh6anppZWN5ZHFtZXJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxMzgyODUsImV4cCI6MjA5MTcxNDI4NX0.bvduJBSMS_qVqy-CxLBg_z-UlIIpAMkUFR5u5qdf1oI"
$headers = @{
    "apikey" = $key
    "Authorization" = "Bearer $key"
    "Content-Type" = "application/json"
    "Prefer" = "return=representation"
}
$body = @{
    member_id = "LF-TEST-XYZ"
    first_name = "Test"
    last_name = "User"
    gender = "male"
    age = 30
    email = "test@example.com"
    phone = "1234567890"
    street = "123 Test St"
    city = "Test City"
    country = "Test Country"
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri $url -Method Post -Headers $headers -Body $body
    Write-Host "SUCCESS:"
    $response | ConvertTo-Json -Depth 5
} catch {
    Write-Host "ERROR STATUS:"
    Write-Host $_.Exception.Response.StatusCode.value__
    Write-Host "ERROR DETAILS:"
    $stream = $_.Exception.Response.GetResponseStream()
    if ($stream) {
        $reader = New-Object System.IO.StreamReader($stream)
        $reader.ReadToEnd()
    }
}
