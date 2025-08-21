# Debug Nium Customer Creation for Paul Alagbe

$baseUrl = "http://localhost:3001"

Write-Host "🔍 DEBUG: Nium Customer Creation for Paul Alagbe" -ForegroundColor Yellow
Write-Host ""

# Step 1: Login Paul
Write-Host "Step 1: Logging in Paul..." -ForegroundColor Cyan
$loginData = @{
    email = "alagbepaul2002@gmail.com"
    password = "SecurePass123!"
}

try {
    $loginResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/login" -Method POST -Body ($loginData | ConvertTo-Json) -ContentType "application/json" -UseBasicParsing
    $loginResult = $loginResponse.Content | ConvertFrom-Json
    $authToken = $loginResult.data.tokens.accessToken
    Write-Host "✅ Login successful" -ForegroundColor Green
    
    $headers = @{ "Authorization" = "Bearer $authToken" }
    
    # Step 2: Get Paul's current profile
    Write-Host "Step 2: Getting Paul's profile..." -ForegroundColor Cyan
    $profileResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/profile" -Headers $headers -UseBasicParsing
    $profileResult = $profileResponse.Content | ConvertFrom-Json
    
    Write-Host "✅ Profile retrieved" -ForegroundColor Green
    Write-Host "Profile data:" -ForegroundColor White
    $profileResult.data | ConvertTo-Json -Depth 2 | Write-Host
    
    # Check if Paul already has a Nium customer
    if ($profileResult.data.niumCustomerHashId) {
        Write-Host "⚠️ Paul already has a Nium customer ID: $($profileResult.data.niumCustomerHashId)" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Paul doesn't have a Nium customer yet - ready to create one" -ForegroundColor Green
    }
    
    # Step 3: Test Nium connection first
    Write-Host "Step 3: Testing Nium connection..." -ForegroundColor Cyan
    try {
        $niumTestResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/test-nium-connection" -Headers $headers -UseBasicParsing
        Write-Host "✅ Nium connection test passed" -ForegroundColor Green
    } catch {
        Write-Host "Nium connection test had issues - this may be expected" -ForegroundColor Yellow
    }
    
    # Step 4: Attempt to create Nium customer
    Write-Host "Step 4: Creating Nium customer..." -ForegroundColor Cyan
    try {
        $createResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/create-nium-customer" -Method POST -Headers $headers -UseBasicParsing
        $createResult = $createResponse.Content | ConvertFrom-Json
        
        Write-Host "🎉 SUCCESS: Nium customer created!" -ForegroundColor Green
        Write-Host "Customer details:" -ForegroundColor White
        $createResult.data | ConvertTo-Json -Depth 3 | Write-Host
        
        # Step 5: Verify Paul's profile now has the Nium customer ID
        Write-Host "Step 5: Verifying profile update..." -ForegroundColor Cyan
        $updatedProfileResponse = Invoke-WebRequest -Uri "$baseUrl/api/auth/profile" -Headers $headers -UseBasicParsing
        $updatedProfileResult = $updatedProfileResponse.Content | ConvertFrom-Json
        
        if ($updatedProfileResult.data.niumCustomerHashId) {
            Write-Host "✅ Profile successfully updated with Nium customer ID!" -ForegroundColor Green
            Write-Host "Nium Customer ID: $($updatedProfileResult.data.niumCustomerHashId)" -ForegroundColor White
        } else {
            Write-Host "❌ Profile was not updated with Nium customer ID" -ForegroundColor Red
        }
        
        # Step 6: Test wallet access
        Write-Host "Step 6: Testing wallet access..." -ForegroundColor Cyan
        try {
            $walletResponse = Invoke-WebRequest -Uri "$baseUrl/api/wallet/wallets" -Headers $headers -UseBasicParsing
            $walletResult = $walletResponse.Content | ConvertFrom-Json
            
            Write-Host "🎉 SUCCESS: Wallet access now working!" -ForegroundColor Green
            Write-Host "Paul Wallets:" -ForegroundColor White
            $walletResult.data.wallets | ConvertTo-Json -Depth 2 | Write-Host
            
        } catch {
            Write-Host "⚠️ Wallet access still not working (may need KYC completion)" -ForegroundColor Yellow
        }
        
    } catch {
        Write-Host "❌ ERROR: Failed to create Nium customer" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode.Value__)" -ForegroundColor Red
        
        # Get detailed error
        if ($_.Exception.Response) {
            $errorStream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($errorStream)
            $errorContent = $reader.ReadToEnd()
            $reader.Close()
            
            if ($errorContent) {
                try {
                    $errorJson = $errorContent | ConvertFrom-Json
                    Write-Host "Error message: $($errorJson.message)" -ForegroundColor Red
                    if ($errorJson.error) {
                        Write-Host "Error details: $($errorJson.error)" -ForegroundColor Red
                    }
                } catch {
                    Write-Host "Raw error response: $errorContent" -ForegroundColor Red
                }
            } else {
                Write-Host "No error response body" -ForegroundColor Red
            }
        }
    }
    
} catch {
    Write-Host "❌ ERROR: Failed to login Paul" -ForegroundColor Red
    Write-Host "Details: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🔍 DEBUG COMPLETE" -ForegroundColor Yellow
